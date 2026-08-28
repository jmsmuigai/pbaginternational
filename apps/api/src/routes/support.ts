import { Router } from "express";
import { stkPush, buildMockCallback } from "../lib/daraja";
import { newId } from "../lib/tickets";
import { env } from "../config/env";

export const supportRouter = Router();

// In-memory store for simulation purposes
export const simulatedSupportPayments: any[] = [];

supportRouter.post("/", async (req, res) => {
  const { name, phone, amount } = req.body;

  if (!name || !phone || !amount) {
    return res.status(400).json({ error: "name, phone and amount are required" });
  }

  const supportId = newId("sup");
  
  try {
    const stk = await stkPush({
      phone,
      amount: Number(amount),
      orderId: supportId,
      accountReference: "PBAG SUPPORT",
      description: "Support PBAG",
    });

    if (env.mpesaMode === "mock") {
      setTimeout(async () => {
        try {
          const callback = buildMockCallback(
            stk.checkoutRequestId,
            stk.merchantRequestId,
            Number(amount),
            phone
          );
          const receipt = callback.Body.stkCallback.CallbackMetadata?.Item.find(
            (i) => i.Name === "MpesaReceiptNumber"
          )?.Value;
          
          simulatedSupportPayments.push({
            id: supportId,
            name,
            phone,
            amount: Number(amount),
            receipt: String(receipt),
            checkoutRequestId: stk.checkoutRequestId,
            status: "success",
            date: new Date().toISOString()
          });
        } catch (err) {
          console.error("Mock STK auto-settle failed:", err);
        }
      }, 2500);
    }

    return res.status(202).json({ 
      id: supportId, 
      status: "processing", 
      stkPush: stk 
    });
  } catch (err: any) {
    return res.status(502).json({ error: "STK push failed", detail: err.message });
  }
});

supportRouter.get("/:checkoutRequestId", (req, res) => {
  const { checkoutRequestId } = req.params;
  const payment = simulatedSupportPayments.find(p => p.checkoutRequestId === checkoutRequestId);
  if (!payment) return res.status(404).json({ error: "Payment not settled yet" });
  res.json({ payment });
});
