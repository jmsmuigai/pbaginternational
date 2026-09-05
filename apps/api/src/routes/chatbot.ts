import { Router } from "express";
import axios from "axios";
import { getDb } from "../db";
import { env } from "../config/env";
import { CONTACT, SUBSIDIARIES } from "@pbag/shared";
import type { ChatbotMessage } from "@pbag/shared";

export const chatbotRouter = Router();

/**
 * PBAG's on-site assistant. Two modes:
 *  - Offline (default): a fast, deterministic FAQ engine — no API key, no
 *    network call, always available. Good enough to answer "how do I buy a
 *    ticket", "what subsidiaries does PBAG have", "how do I contact you".
 *  - Claude-powered (optional): set ANTHROPIC_API_KEY to upgrade to a full
 *    conversational assistant grounded with live event data.
 */

function offlineReply(message: string, eventTitles: string[]): string {
  const m = message.toLowerCase();

  if (/(buy|purchase|get).*(ticket)|how.*ticket/.test(m)) {
    return `You can buy tickets from the "Tickets" tab: pick an event, choose a ticket tier and quantity, then pay by M-Pesa, card, or PayPal. Your ticket (with a QR code for entry) is issued instantly after payment. ${
      eventTitles.length ? `Currently on sale: ${eventTitles.join(", ")}.` : ""
    }`;
  }
  if (/(m-?pesa|mpesa|pay)/.test(m)) {
    return "We accept M-Pesa (STK push to your phone), Airtel Money, cards, and PayPal. For M-Pesa, enter your phone number at checkout and approve the payment prompt — your ticket is generated the moment payment is confirmed.";
  }
  if (/(subsidiar|pbag theatre|peers got talent|peatice|bunge)/.test(m)) {
    return `PBAG has four subsidiaries: ${SUBSIDIARIES.map((s) => s.name).join(", ")}. You can read about each one — and how to join — under the "Subsidiaries" menu.`;
  }
  if (/(join|volunteer|audition|get involved)/.test(m)) {
    return 'Each subsidiary page has a "Join" button that routes you to a short interest form or WhatsApp chat — find it under Subsidiaries > [subsidiary name].';
  }
  if (/(refund|cancel)/.test(m)) {
    return "For refund or cancellation requests, please reach us via the Contact page and include your order/ticket code — our team handles these case by case.";
  }
  if (/(seller|commission|affiliate|promo code)/.test(m)) {
    return "If you'd like to sell tickets and earn commission, apply from an event's page. You'll get a unique promo code, a trackable link, and a QR code — every sale attributed to you is tracked automatically on your seller dashboard.";
  }
  if (/(contact|phone|email|reach)/.test(m)) {
    return `You can reach PBAG at ${CONTACT.email} or ${CONTACT.phone}, or use the contact form on the Contact Us page.`;
  }
  if (/(scan|entry|door|verify)/.test(m)) {
    return "Each ticket has a unique QR code. Door staff scan it at entry using the gate-scanner tool, which validates and marks it as used in real time — a screenshot or duplicate can't be reused once the original has been scanned.";
  }
  return "I can help with buying tickets, M-Pesa payments, PBAG's subsidiaries, joining a subsidiary, or contacting the team. What would you like to know?";
}

chatbotRouter.post("/", async (req, res) => {
  const messages = (req.body?.messages || []) as ChatbotMessage[];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const db = getDb();
  const events = await db.listEvents();
  const onSaleTitles = events.filter((e) => e.status === "on_sale").map((e) => e.title);

  if (!lastUser) return res.json({ reply: "Hi! Ask me anything about PBAG events, tickets, or subsidiaries." });

  if (env.anthropicApiKey) {
    try {
      const system = `You are the PBAG Consortium (Peers Best Art Group) website assistant. Be concise and friendly. PBAG has four subsidiaries: ${SUBSIDIARIES.map(
        (s) => `${s.name} (${s.description})`
      ).join(" | ")}. Events currently on sale: ${onSaleTitles.join(", ") || "none right now"}. Contact: ${CONTACT.email}, ${CONTACT.phone}. Payment methods: M-Pesa, Airtel Money, card, PayPal, and cash/M-Pesa at the door.`;

      const { data } = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-5-haiku-latest",
          max_tokens: 400,
          system,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        },
        {
          headers: {
            "x-api-key": env.anthropicApiKey,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
          },
        }
      );
      const reply = data?.content?.[0]?.text || offlineReply(lastUser.content, onSaleTitles);
      return res.json({ reply, mode: "claude" });
    } catch (err) {
      // Fall through to offline mode on any API error.
    }
  }

  res.json({ reply: offlineReply(lastUser.content, onSaleTitles), mode: "offline" });
});
