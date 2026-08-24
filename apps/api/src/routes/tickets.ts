import { Router } from "express";
import { getDb } from "../db";

export const ticketsRouter = Router();

ticketsRouter.get("/order/:orderId", async (req, res) => {
  const db = getDb();
  const order = await db.getOrder(req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const tickets = await db.listTicketsByOrder(order.id);
  res.json({ order, tickets });
});

/**
 * Entry / live-event verification (Section 6.7). Door staff scan a ticket's
 * QR (which decodes to { code }) and POST it here. A ticket can only ever
 * be marked "used" once — a screenshot or forwarded ticket that was already
 * scanned is rejected with `alreadyUsed: true` and the original scan time,
 * so gate staff can flag/deny it on the spot.
 */
ticketsRouter.post("/verify", async (req, res) => {
  const { code, scannedBy } = req.body || {};
  if (!code) return res.status(400).json({ error: "code is required" });

  const db = getDb();
  const ticket = await db.getTicket(code.trim());
  if (!ticket) return res.status(404).json({ valid: false, reason: "not_found" });
  if (ticket.status === "void") return res.json({ valid: false, reason: "void", ticket });

  if (ticket.status === "used") {
    return res.json({
      valid: false,
      reason: "already_used",
      alreadyUsed: true,
      usedAt: ticket.usedAt,
      scannedBy: ticket.scannedBy,
      ticket,
    });
  }

  const updated = await db.markTicketUsed(code.trim(), scannedBy || "gate-scanner");
  res.json({ valid: true, ticket: updated });
});

ticketsRouter.get("/event/:eventId/live", async (req, res) => {
  const db = getDb();
  const tickets = await db.listTicketsByEvent(req.params.eventId);
  const sold = tickets.length;
  const scanned = tickets.filter((t) => t.status === "used").length;
  res.json({ sold, scanned, remaining: sold - scanned });
});
