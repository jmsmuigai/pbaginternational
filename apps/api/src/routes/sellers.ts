import { Router } from "express";
import { getDb } from "../db";
import { generateSellerCode, newId } from "../lib/tickets";
import type { Seller } from "@pbag/shared";

export const sellersRouter = Router();

/** Salesperson/influencer applies to sell for a specific event. */
sellersRouter.post("/apply", async (req, res) => {
  const { eventId, name, userId } = req.body || {};
  if (!eventId || !name) return res.status(400).json({ error: "eventId and name are required" });

  const db = getDb();
  const event = await db.getEvent(eventId);
  if (!event) return res.status(404).json({ error: "Event not found" });

  const seller: Seller = {
    id: newId("sel"),
    userId: userId || newId("usr"),
    name,
    code: generateSellerCode(name),
    eventId,
    status: "approved", // auto-approved for the demo; set to "pending" to require producer review
    createdAt: new Date().toISOString(),
  };
  await db.createSeller(seller);
  res.status(201).json({
    seller,
    trackableLink: `/tickets/${event.slug}?ref=${seller.code}`,
    qrValue: `${event.slug}::${seller.code}`,
  });
});

sellersRouter.get("/:id", async (req, res) => {
  const db = getDb();
  const seller = await db.getSeller(req.params.id);
  if (!seller) return res.status(404).json({ error: "Seller not found" });

  const orders = (await db.listOrdersBySeller(seller.id)).filter((o) => o.status === "paid");
  const commissions = await db.listCommissionsBySeller(seller.id);
  const ticketsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const revenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
  const commissionEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
  const commissionPaid = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.amount, 0);

  res.json({
    seller,
    performance: {
      ticketsSold,
      revenue,
      commissionEarned,
      commissionPaid,
      commissionPending: commissionEarned - commissionPaid,
      orders: orders.length,
    },
  });
});

sellersRouter.patch("/:id", async (req, res) => {
  const db = getDb();
  const updated = await db.updateSeller(req.params.id, req.body || {});
  if (!updated) return res.status(404).json({ error: "Seller not found" });
  res.json({ seller: updated });
});
