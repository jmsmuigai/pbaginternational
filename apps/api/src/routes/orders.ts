import { Router } from "express";
import { getDb } from "../db";
import { newId } from "../lib/tickets";
import { stkPush, buildMockCallback } from "../lib/daraja";
import { settleOrderPaid, markOrderFailed } from "../lib/settlement";
import { PLATFORM_FEE_RATE } from "@pbag/shared";
import type { Order, OrderItem } from "@pbag/shared";
import { env } from "../config/env";

export const ordersRouter = Router();

interface CheckoutBody {
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: { ticketTierId: string; quantity: number }[];
  paymentMethod: "mpesa" | "card" | "paypal" | "airtel_money";
  sellerCode?: string;
  channel?: "code" | "link" | "qr" | "direct";
}

ordersRouter.post("/checkout", async (req, res) => {
  const body = req.body as CheckoutBody;
  const db = getDb();

  if (!body.eventId || !body.items?.length || !body.buyerName || !body.buyerPhone) {
    return res.status(400).json({ error: "eventId, buyerName, buyerPhone and items are required" });
  }

  const event = await db.getEvent(body.eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const orderItems: OrderItem[] = [];
  for (const reqItem of body.items) {
    const tier = event.ticketTiers.find((t) => t.id === reqItem.ticketTierId);
    if (!tier) return res.status(400).json({ error: `Unknown ticket tier ${reqItem.ticketTierId}` });
    const available = tier.quantityTotal - tier.quantitySold;
    if (reqItem.quantity < 1 || reqItem.quantity > available) {
      return res.status(409).json({ error: `Only ${available} "${tier.name}" tickets remaining` });
    }
    orderItems.push({
      ticketTierId: tier.id,
      ticketTierName: tier.name,
      unitPrice: tier.price,
      quantity: reqItem.quantity,
    });
  }

  const subtotal = orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE * 100) / 100;
  const total = subtotal + platformFee;

  let sellerId: string | undefined;
  if (body.sellerCode) {
    const seller = await db.getSellerByCode(event.id, body.sellerCode);
    if (seller) sellerId = seller.id;
  }

  const order: Order = {
    id: newId("ord"),
    eventId: event.id,
    buyerName: body.buyerName,
    buyerEmail: body.buyerEmail || "",
    buyerPhone: body.buyerPhone,
    items: orderItems,
    subtotal,
    platformFee,
    total,
    paymentMethod: body.paymentMethod,
    status: "pending_payment",
    channel: sellerId ? body.channel || "code" : "direct",
    sellerCode: body.sellerCode,
    sellerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.createOrder(order);

  if (body.paymentMethod === "mpesa") {
    try {
      const stk = await stkPush({
        phone: body.buyerPhone,
        amount: total,
        orderId: order.id,
        accountReference: event.slug.toUpperCase().slice(0, 12),
        description: `Ticket-${event.slug}`,
      });
      await db.updateOrder(order.id, {
        status: "processing",
        mpesaCheckoutRequestId: stk.checkoutRequestId,
      });

      // In mock mode, simulate Safaricom "pushing" the callback a couple of
      // seconds later — exactly like a buyer entering their M-Pesa PIN on
      // their phone, without needing real Daraja sandbox credentials.
      if (env.mpesaMode === "mock" && env.mockAutoSettle) {
        setTimeout(async () => {
          try {
            const callback = buildMockCallback(
              stk.checkoutRequestId,
              stk.merchantRequestId,
              total,
              body.buyerPhone
            );
            const receipt = callback.Body.stkCallback.CallbackMetadata?.Item.find(
              (i) => i.Name === "MpesaReceiptNumber"
            )?.Value;
            await settleOrderPaid(order.id, { mpesaReceiptNumber: String(receipt) });
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error("Mock STK auto-settle failed:", err);
          }
        }, 2500);
      }

      return res.status(202).json({ order: { ...order, status: "processing" }, stkPush: stk });
    } catch (err: any) {
      await markOrderFailed(order.id, err.message);
      return res.status(502).json({ error: "STK push failed", detail: err.message });
    }
  }

  // Card / PayPal / Airtel Money: placeholder — a real integration would
  // redirect to the provider's hosted checkout, then hit a webhook that
  // also calls settleOrderPaid(). For this demo we settle immediately so
  // the "generate tickets after payment" flow can be exercised for every
  // payment method the brief lists.
  const { order: paidOrder, tickets } = await settleOrderPaid(order.id, {});
  res.status(201).json({ order: paidOrder, tickets });
});

ordersRouter.get("/:id", async (req, res) => {
  const order = await getDb().getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json({ order });
});
