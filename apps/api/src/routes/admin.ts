import { Router } from "express";
import { getDb } from "../db";

export const adminRouter = Router();

/**
 * Real-time producer/admin sales dashboard (Section 6.3) — revenue and
 * commission broken down by channel: direct online sales, seller-attributed
 * sales (code/link/QR), and point-of-sale. Also reports live scan counts
 * for entry-flow management (Section 6.7).
 */
adminRouter.get("/dashboard/:eventId", async (req, res) => {
  const db = getDb();
  const event = await db.getEvent(req.params.eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const orders = await db.listOrdersByEvent(event.id);
  const paid = orders.filter((o) => o.status === "paid");
  const tickets = await db.listTicketsByEvent(event.id);
  const sellers = await db.listSellersByEvent(event.id);

  const byChannel = { direct: 0, code: 0, link: 0, qr: 0, pos: 0 } as Record<string, number>;
  let revenue = 0;
  let commissionOwed = 0;
  for (const o of paid) {
    byChannel[o.channel] = (byChannel[o.channel] || 0) + o.subtotal;
    revenue += o.subtotal;
    commissionOwed += o.commissionAmount || 0;
  }

  const sellerLeaderboard = await Promise.all(
    sellers.map(async (s) => {
      const sellerOrders = paid.filter((o) => o.sellerId === s.id);
      const ticketsSold = sellerOrders.reduce(
        (sum, o) => sum + o.items.reduce((s2, i) => s2 + i.quantity, 0),
        0
      );
      return {
        sellerId: s.id,
        name: s.name,
        code: s.code,
        ticketsSold,
        revenue: sellerOrders.reduce((sum, o) => sum + o.subtotal, 0),
        commissionEarned: sellerOrders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0),
      };
    })
  );
  sellerLeaderboard.sort((a, b) => b.ticketsSold - a.ticketsSold);

  const ticketsSold = tickets.length;
  const ticketsScanned = tickets.filter((t) => t.status === "used").length;
  const capacity = event.ticketTiers.reduce((s, t) => s + t.quantityTotal, 0);

  res.json({
    event: { id: event.id, title: event.title, capacity },
    summary: {
      ticketsSold,
      ticketsScanned,
      ticketsRemaining: capacity - ticketsSold,
      revenue,
      platformFees: paid.reduce((s, o) => s + o.platformFee, 0),
      commissionOwed,
      netToProducer: revenue - commissionOwed,
      revenueByChannel: byChannel,
      ordersPending: orders.filter((o) => o.status === "processing" || o.status === "pending_payment").length,
    },
    sellerLeaderboard,
  });
});
