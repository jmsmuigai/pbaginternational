import { Router } from "express";
import { getDb } from "../db";

export const eventsRouter = Router();

eventsRouter.get("/", async (_req, res) => {
  const events = await getDb().listEvents();
  res.json({ events });
});

eventsRouter.get("/:idOrSlug", async (req, res) => {
  const db = getDb();
  const byId = await db.getEvent(req.params.idOrSlug);
  const event = byId || (await db.getEventBySlug(req.params.idOrSlug));
  if (!event) return res.status(404).json({ error: "Event not found" });
  res.json({ event });
});
