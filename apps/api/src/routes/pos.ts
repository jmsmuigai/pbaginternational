import { Router } from "express";
import { getDb } from "../db";
import { newId } from "../lib/tickets";
import { stkPush } from "../lib/daraja";
import { settleOrderPaid, markOrderFailed } from "../lib/settlement";
import { PLATFORM_FEE_RATE } from "@pbag/shared";
import type { Order, OrderItem } from "@pbag/shared";
import { env } from "../config/env";
import { buildMockCallback } from "../lib/daraja";

export const posRouter = Router();

/**
 * Point-of-sale endpoint (Section 6.4) — the same simplified flow door
 * staff use on a tablet/phone at the venue to sell remaining tickets on
 * the day of the event. Draws from the exact same inventory as online
 * sales (via the shared DbAdapter), so a POS sale can never oversell a
 * tier that just sold out online, and vice versa.
 */
posRouter.post("/sell", async (req, res) => {
  const { eventId, ticketTierId, quantity, buyerName, buyerPhone, paymentMethod, doorStaffId } =
    req.body || {};

  if (!eventId || !ticketTierId || !quantity || !buyerName) {
    return res.status(400).json({ error: "eventId, ticketTierId, quantity, buyerName are required" });
  }

  const db = getDb();
  const event = await db.getEvent(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const tier = event.ticketTiers.find((t) => t.id === ticketTierId);
  if (!tier) return res.status(400).json({ error: "Unknown ticket tier" });
  const available = tier.quantityTotal - tier.quantitySold;
  if (quantity > available) {
    return res.status(409).json({ error: `Only ${available} "${tier.name}" tickets remaining` });
  }

  const items: OrderItem[] = [
    { ticketTierId: tier.id, ticketTierName: tier.name, unitPrice: tier.price, quantity },
  ];
  const subtotal = tier.price * quantity;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE * 100) / 100;

  const order: Order = {
    id: newId("ord"),
    eventId: event.id,
    buyerName,
    buyerEmail: "",
    buyerPhone: buyerPhone || "0000000000",
    items,
    subtotal,
    platformFee,
    total: subtotal + platformFee,
    paymentMethod: paymentMethod === "pos_mpesa" ? "pos_mpesa" : "cash",
    status: "pending_payment",
    channel: "pos",
    soldByDoorStaffId: doorStaffId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await db.createOrder(order);

  if (order.paymentMethod === "cash") {
    // Cash is settled instantly — the door-staff device is the source of
    // truth for "money received", so the ticket (with its QR code) can be
    // shown/printed immediately.
    const { order: paidOrder, tickets } = await settleOrderPaid(order.id, {});
    return res.status(201).json({ order: paidOrder, tickets });
  }

  // pos_mpesa: STK push straight to the buyer's phone at the till.
  try {
    const stk = await stkPush({
      phone: order.buyerPhone,
      amount: order.total,
      orderId: order.id,
      accountReference: event.slug.toUpperCase().slice(0, 12),
      description: `POS-${event.slug}`,
    });
    await db.updateOrder(order.id, { status: "processing", mpesaCheckoutRequestId: stk.checkoutRequestId });

    if (env.mpesaMode === "mock" && env.mockAutoSettle) {
      setTimeout(async () => {
        const callback = buildMockCallback(stk.checkoutRequestId, stk.merchantRequestId, order.total, order.buyerPhone);
        const receipt = callback.Body.stkCallback.CallbackMetadata?.Item.find(
          (i) => i.Name === "MpesaReceiptNumber"
        )?.Value;
        await settleOrderPaid(order.id, { mpesaReceiptNumber: String(receipt) });
      }, 2000);
    }

    res.status(202).json({ order: { ...order, status: "processing" }, stkPush: stk });
  } catch (err: any) {
    await markOrderFailed(order.id, err.message);
    res.status(502).json({ error: "STK push failed", detail: err.message });
  }
});
