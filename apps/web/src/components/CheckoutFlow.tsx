"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EventRecord, IssuedTicket, Order, PaymentMethod } from "@pbag/shared";
import { api } from "@/lib/api";
import { formatKES } from "@/lib/format";

type Step = "select" | "details" | "processing" | "success" | "error";

const PAYMENT_METHODS: { id: PaymentMethod; label: string; icon: string; note: string }[] = [
  { id: "mpesa", label: "M-Pesa", icon: "📱", note: "STK push to your phone" },
  { id: "card", label: "Card", icon: "💳", note: "Visa / Mastercard" },
  { id: "airtel_money", label: "Airtel Money", icon: "📲", note: "Mobile money prompt" },
  { id: "paypal", label: "PayPal", icon: "🅿️", note: "International buyers" },
];

export function CheckoutFlow({ event }: { event: EventRecord }) {
  const searchParams = useSearchParams();
  const sellerCode = searchParams.get("ref") || undefined;

  const [step, setStep] = useState<Step>("select");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [buyer, setBuyer] = useState({ name: "", email: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [order, setOrder] = useState<Order | null>(null);
  const [tickets, setTickets] = useState<IssuedTicket[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");

  const items = useMemo(
    () =>
      Object.entries(qty)
        .filter(([, q]) => q > 0)
        .map(([ticketTierId, quantity]) => ({ ticketTierId, quantity })),
    [qty]
  );
  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => {
      const tier = event.ticketTiers.find((t) => t.id === i.ticketTierId);
      return sum + (tier ? tier.price * i.quantity : 0);
    }, 0);
  }, [items, event.ticketTiers]);

  function setTierQty(tierId: string, delta: number, max: number) {
    setQty((q) => {
      const current = q[tierId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...q, [tierId]: next };
    });
  }

  async function pollOrder(orderId: string) {
    const started = Date.now();
    while (Date.now() - started < 20000) {
      const { order: polled } = await api.get<{ order: Order }>(`/orders/${orderId}`);
      if (polled.status === "paid") {
        setOrder(polled);
        const { tickets: t } = await api.get<{ order: Order; tickets: IssuedTicket[] }>(
          `/tickets/order/${orderId}`
        );
        setTickets(t);
        setStep("success");
        return;
      }
      if (polled.status === "failed") {
        setError("Payment failed or was cancelled. Please try again.");
        setStep("error");
        return;
      }
      setStatusMessage("Waiting for you to approve the payment prompt on your phone…");
      await new Promise((r) => setTimeout(r, 900));
    }
    setError("We didn't receive payment confirmation in time. If you were charged, contact support with your order ID.");
    setStep("error");
  }

  async function submitOrder() {
    setError("");
    setStep("processing");
    setStatusMessage(paymentMethod === "mpesa" ? "Sending M-Pesa prompt to your phone…" : "Processing payment…");
    try {
      const res = await api.post<{ order: Order; stkPush?: unknown; tickets?: IssuedTicket[] }>(
        "/orders/checkout",
        {
          eventId: event.id,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          buyerPhone: buyer.phone,
          items,
          paymentMethod,
          sellerCode,
          channel: sellerCode ? "code" : "direct",
        }
      );
      setOrder(res.order);
      if (res.order.status === "paid" && res.tickets) {
        setTickets(res.tickets);
        setStep("success");
        return;
      }
      await pollOrder(res.order.id);
    } catch (err: any) {
      setError(err.message || "Checkout failed");
      setStep("error");
    }
  }

  if (step === "success" && order) {
    return (
      <div className="rounded-3xl glass p-6">
        <p className="font-display text-lg font-bold text-emerald">🎉 Payment confirmed!</p>
        <p className="mt-1 text-sm text-cream/65">
          {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} issued to {order.buyerEmail || order.buyerPhone}.
          {order.mpesaReceiptNumber && ` M-Pesa receipt: ${order.mpesaReceiptNumber}.`}
        </p>
        <div className="mt-5 space-y-4">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.qrPayload} alt={`QR code for ticket ${t.code}`} className="h-20 w-20 rounded-lg bg-cream" />
              <div>
                <p className="font-mono text-sm font-bold text-gold">{t.code}</p>
                <p className="text-sm text-cream/70">{t.ticketTierName}</p>
                <p className="text-xs text-cream/50">Holder: {t.holderName}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-cream/45">
          A copy has also been queued for email delivery to {order.buyerEmail || "your inbox"} (wire SENDGRID_API_KEY
          to enable real delivery — see docs/API.md).
        </p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="rounded-3xl glass p-6">
        <p className="font-display text-lg font-bold text-coral">Something went wrong</p>
        <p className="mt-2 text-sm text-cream/65">{error}</p>
        <button
          onClick={() => setStep("select")}
          className="mt-4 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Try again
        </button>
      </div>
    );
  }

  if (step === "processing") {
    return (
      <div className="rounded-3xl glass p-6 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin-slow rounded-full border-4 border-white/20 border-t-gold" />
        <p className="font-semibold">{statusMessage}</p>
        {paymentMethod === "mpesa" && (
          <p className="mt-2 text-xs text-cream/50">
            (Demo mode: payment auto-confirms in a couple of seconds — no real Safaricom request is made unless
            MPESA_MODE=sandbox/live.)
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-24 space-y-5 rounded-3xl glass p-6">
      {sellerCode && (
        <div className="rounded-xl bg-gold/15 px-3 py-2 text-xs text-gold">
          Referred by seller code <strong>{sellerCode}</strong> — they&apos;ll earn commission on this sale.
        </div>
      )}

      <div>
        <p className="font-display text-lg font-bold">Select tickets</p>
        <div className="mt-3 space-y-3">
          {event.ticketTiers.map((tier) => {
            const remaining = tier.quantityTotal - tier.quantitySold;
            const q = qty[tier.id] || 0;
            return (
              <div key={tier.id} className="rounded-2xl border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{tier.name}</p>
                    <p className="text-xs text-cream/50">{remaining} left</p>
                  </div>
                  <p className="font-display font-bold text-gold">{formatKES(tier.price)}</p>
                </div>
                <div className="mt-3 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setTierQty(tier.id, -1, remaining)}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                    disabled={q === 0}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{q}</span>
                  <button
                    onClick={() => setTierQty(tier.id, 1, remaining)}
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20"
                    disabled={remaining === 0 || q >= remaining}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {step === "select" && items.length > 0 && (
        <button
          onClick={() => setStep("details")}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 font-bold shadow-glow transition hover:-translate-y-0.5"
        >
          Continue — {formatKES(subtotal)}
        </button>
      )}

      {step === "details" && (
        <div className="space-y-3 border-t border-white/10 pt-4">
          <input
            required
            placeholder="Full name"
            value={buyer.name}
            onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email address"
            value={buyer.email}
            onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          />
          <input
            required
            placeholder="Phone (e.g. 07XX XXX XXX)"
            value={buyer.phone}
            onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          />

          <p className="pt-2 text-sm font-semibold text-cream/70">Pay with</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`rounded-xl border px-3 py-3 text-left text-sm transition ${
                  paymentMethod === pm.id
                    ? "border-gold bg-gold/10"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <div>{pm.icon} {pm.label}</div>
                <div className="mt-0.5 text-[11px] text-cream/50">{pm.note}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm text-cream/70">
            <span>Subtotal</span>
            <span>{formatKES(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-cream/45">
            <span>Platform fee (5%)</span>
            <span>{formatKES(Math.round(subtotal * 0.05))}</span>
          </div>

          <button
            onClick={submitOrder}
            disabled={!buyer.name || !buyer.email || !buyer.phone}
            className="w-full rounded-full bg-gradient-to-r from-gold to-coral px-6 py-3 font-bold text-ink transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            Pay {formatKES(Math.round(subtotal * 1.05))}
          </button>
        </div>
      )}
    </div>
  );
}
