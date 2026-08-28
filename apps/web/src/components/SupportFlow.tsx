"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { formatKES } from "@/lib/format";

type Step = "input" | "processing" | "success" | "error";

export function SupportFlow() {
  const [step, setStep] = useState<Step>("input");
  const [donor, setDonor] = useState({ name: "", phone: "", amount: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");

  async function pollPayment(checkoutRequestId: string) {
    const started = Date.now();
    while (Date.now() - started < 20000) {
      try {
        const { payment } = await api.get<{ payment: any }>(`/support/${checkoutRequestId}`);
        if (payment && payment.status === "success") {
          setReceipt(payment.receipt);
          setStep("success");
          return;
        }
      } catch (err: any) {
        // 404 means not settled yet, keep polling
        if (err.response?.status !== 404) {
           console.error("Polling error", err);
        }
      }
      
      setStatusMessage("Waiting for you to approve the payment prompt on your phone…");
      await new Promise((r) => setTimeout(r, 900));
    }
    setError("We didn't receive payment confirmation in time.");
    setStep("error");
  }

  async function submitSupport() {
    setError("");
    setStep("processing");
    setStatusMessage("Sending M-Pesa prompt to your phone…");
    
    try {
      const res = await api.post<{ id: string; status: string; stkPush?: any }>(
        "/support",
        {
          name: donor.name,
          phone: donor.phone,
          amount: donor.amount,
        }
      );
      
      if (res.stkPush?.checkoutRequestId) {
        await pollPayment(res.stkPush.checkoutRequestId);
      } else {
        setError("Invalid response from server.");
        setStep("error");
      }
    } catch (err: any) {
      setError(err.message || "Support payment failed");
      setStep("error");
    }
  }

  if (step === "success") {
    return (
      <div className="rounded-3xl glass p-8 text-center max-w-md mx-auto">
        <p className="font-display text-2xl font-bold text-emerald">Thank You!</p>
        <p className="mt-4 text-cream/80">
          Your generous support of {formatKES(Number(donor.amount))} has been received.
        </p>
        <div className="mt-6 rounded-xl bg-white/5 p-4 border border-white/10">
          <p className="text-sm text-cream/50 uppercase tracking-wider mb-1">M-Pesa Receipt</p>
          <p className="font-mono text-xl font-bold text-gold">{receipt}</p>
        </div>
        <button
          onClick={() => {
            setDonor({ name: "", phone: "", amount: "" });
            setStep("input");
          }}
          className="mt-8 rounded-full bg-white/10 px-6 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Support Again
        </button>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="rounded-3xl glass p-8 text-center max-w-md mx-auto">
        <p className="font-display text-xl font-bold text-coral">Something went wrong</p>
        <p className="mt-2 text-sm text-cream/65">{error}</p>
        <button
          onClick={() => setStep("input")}
          className="mt-6 rounded-full bg-white/10 px-6 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Try again
        </button>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="rounded-3xl glass p-8 text-center max-w-md mx-auto">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin-slow rounded-full border-4 border-white/20 border-t-gold" />
        <p className="font-semibold text-lg">{statusMessage}</p>
        <p className="mt-4 text-sm text-cream/50 bg-black/20 p-3 rounded-lg">
          (Demo mode: payment auto-confirms in a couple of seconds — no real Safaricom request is made.)
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl glass p-8 max-w-md mx-auto">
      <h2 className="font-display text-2xl font-bold mb-2">Support PBAG</h2>
      <p className="text-cream/70 mb-6 text-sm">
        Enter your details below to donate via M-Pesa. A prompt will be sent to your phone.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase text-cream/50 mb-1 ml-1">Name</label>
          <input
            required
            placeholder="E.g. Jane Doe"
            value={donor.name}
            onChange={(e) => setDonor({ ...donor, name: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        
        <div>
          <label className="block text-xs uppercase text-cream/50 mb-1 ml-1">M-Pesa Phone</label>
          <input
            required
            placeholder="07XX XXX XXX"
            value={donor.phone}
            onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <div>
          <label className="block text-xs uppercase text-cream/50 mb-1 ml-1">Amount (KES)</label>
          <input
            required
            type="number"
            min="10"
            placeholder="Amount to donate"
            value={donor.amount}
            onChange={(e) => setDonor({ ...donor, amount: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>

        <button
          onClick={submitSupport}
          disabled={!donor.name || !donor.phone || !donor.amount}
          className="w-full mt-4 rounded-full bg-brand-gradient px-6 py-4 font-bold text-white shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Donate via M-Pesa
        </button>
      </div>
    </div>
  );
}
