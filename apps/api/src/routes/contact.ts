import { Router } from "express";
import { newId } from "../lib/tickets";

export const contactRouter = Router();

/**
 * General enquiries form (Section 7). This demo logs + acknowledges the
 * message; wire SENDGRID_API_KEY (see .env.example) to forward it to a
 * real inbox, or point CONTACT_WEBHOOK_URL at a Slack/Zapier webhook.
 */
contactRouter.post("/", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email and message are required" });
  }
  const ref = newId("msg");
  // eslint-disable-next-line no-console
  console.log(`[contact] ${ref} from ${name} <${email}>: ${message}`);
  res.status(201).json({ ok: true, reference: ref });
});
