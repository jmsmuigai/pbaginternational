import { Router } from "express";
import { getDb } from "../db";
import { settleOrderPaid, markOrderFailed } from "../lib/settlement";
import type { DarajaStkCallback } from "@pbag/shared";

export const mpesaRouter = Router();

/**
 * Safaricom Daraja posts here after the buyer approves (or cancels/fails)
 * the STK push prompt on their phone. Configure this as MPESA_CALLBACK_URL
 * in your Daraja app once deployed (Safaricom requires a public HTTPS URL —
 * it cannot call back to localhost, so use a tunnel like ngrok for local
 * sandbox testing).
 */
mpesaRouter.post("/callback", async (req, res) => {
  const body = req.body as DarajaStkCallback;
  const callback = body?.Body?.stkCallback;
  if (!callback) return res.status(400).json({ error: "Malformed Daraja callback" });

  const db = getDb();
  // We stored mpesaCheckoutRequestId on the order at STK-push time; find it.
  const allEvents = await db.listEvents();
  let matchedOrderId: string | null = null;
  for (const ev of allEvents) {
    const orders = await db.listOrdersByEvent(ev.id);
    const match = orders.find((o) => o.mpesaCheckoutRequestId === callback.CheckoutRequestID);
    if (match) {
      matchedOrderId = match.id;
      break;
    }
  }

  if (!matchedOrderId) {
    // Always 200 back to Safaricom even if we can't match, per Daraja docs,
    // so it doesn't keep retrying — but log for investigation.
    // eslint-disable-next-line no-console
    console.warn("Daraja callback for unknown CheckoutRequestID", callback.CheckoutRequestID);
    return res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  }

  if (callback.ResultCode === 0) {
    const receipt = callback.CallbackMetadata?.Item.find((i) => i.Name === "MpesaReceiptNumber")?.Value;
    await settleOrderPaid(matchedOrderId, { mpesaReceiptNumber: receipt ? String(receipt) : undefined });
  } else {
    await markOrderFailed(matchedOrderId, callback.ResultDesc);
  }

  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});
