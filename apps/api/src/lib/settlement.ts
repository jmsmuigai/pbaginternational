import type { IssuedTicket, Order } from "@pbag/shared";
import { getDb } from "../db";
import { buildQrDataUrl, calculateCommission, generateTicketCode, newId } from "./tickets";

/**
 * Central "an order has just been paid" handler. Called from three places:
 *   1. POST /api/mpesa/callback        (real Safaricom Daraja callback)
 *   2. the MPESA_MODE=mock auto-settle timer (src/routes/orders.ts)
 *   3. POST /api/pos/sell with paymentMethod=cash (instant settlement)
 *
 * Responsibilities: mark the order paid, bump ticket-tier inventory,
 * record seller commission (if attributed), and issue one IssuedTicket
 * per unit purchased, each with its own unique code + QR payload.
 */
export async function settleOrderPaid(
  orderId: string,
  opts: { mpesaReceiptNumber?: string } = {}
): Promise<{ order: Order; tickets: IssuedTicket[] }> {
  const db = getDb();
  const order = await db.getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status === "paid") {
    const tickets = await db.listTicketsByOrder(orderId);
    return { order, tickets };
  }

  for (const item of order.items) {
    await db.incrementTierSold(order.eventId, item.ticketTierId, item.quantity);
  }

  let commissionAmount = 0;
  let commissionRateApplied = 0;
  if (order.sellerId) {
    const seller = await db.getSeller(order.sellerId);
    const event = await db.getEvent(order.eventId);
    if (seller && event) {
      commissionRateApplied = seller.commissionRateOverride ?? event.defaultCommissionRate;
      commissionAmount = calculateCommission(order.subtotal, commissionRateApplied);
      await db.addCommissionEntry({
        id: newId("comm"),
        sellerId: seller.id,
        eventId: order.eventId,
        orderId: order.id,
        amount: commissionAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }
  }

  const updated = await db.updateOrder(order.id, {
    status: "paid",
    mpesaReceiptNumber: opts.mpesaReceiptNumber,
    commissionAmount,
    commissionRateApplied,
  });

  const tickets: IssuedTicket[] = [];
  for (const item of order.items) {
    for (let i = 0; i < item.quantity; i++) {
      const code = generateTicketCode();
      const qrPayload = { code, eventId: order.eventId, orderId: order.id, v: 1 as const };
      const ticket: IssuedTicket = {
        id: newId("tkt"),
        code,
        qrPayload: await buildQrDataUrl(qrPayload),
        orderId: order.id,
        eventId: order.eventId,
        ticketTierId: item.ticketTierId,
        ticketTierName: item.ticketTierName,
        holderName: order.buyerName,
        status: "valid",
        createdAt: new Date().toISOString(),
      };
      tickets.push(ticket);
    }
  }
  await db.createTickets(tickets);

  return { order: updated as Order, tickets };
}

export async function markOrderFailed(orderId: string, reason: string) {
  const db = getDb();
  return db.updateOrder(orderId, { status: "failed" });
}
