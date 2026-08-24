"use client";

import { useEffect, useState } from "react";
import type { EventRecord, IssuedTicket, Order } from "@pbag/shared";
import { api } from "@/lib/api";
import { formatKES } from "@/lib/format";

/**
 * Point-of-sale interface (Section 6.4) — the simplified, mobile-friendly
 * screen door staff use to sell remaining ticket tiers on the day of the
 * event, either for cash (settles instantly) or via an M-Pesa STK push
 * sent straight to the buyer's phone at the till. Draws from the same
 * live inventory as online sales.
 */
export default function PosPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [eventId, setEventId] = useState("");
  const [tierId, setTierId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [method, setMethod] = useState<"cash" | "pos_mpesa">("cash");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [lastTickets, setLastTickets] = useState<IssuedTicket[]>([]);

  useEffect(() => {
    api.get<{ events: EventRecord[] }>("/events").then((d) => {
      setEvents(d.events);
      if (d.events[0]) setEventId(d.events[0].id);
    });
  }, []);

  const event = events.find((e) => e.id === eventId);
  const tier = event?.ticketTiers.find((t) => t.id === tierId);

  async function pollUntilPaid(orderId: string) {
    const start = Date.now();
    while (Date.now() - start < 15000) {
      const { order } = await api.get<{ order: Order }>(`/orders/${orderId}`);
      if (order.status === "paid") return order;
      if (order.status === "failed") throw new Error("Payment failed");
      await new Promise((r) => setTimeout(r, 800));
    }
    throw new Error("Timed out waiting for payment");
  }

  async function sell() {
    if (!event || !tier || !buyerName) return;
    setBusy(true);
    setMessage(method === "cash" ? "Recording cash sale…" : "Sending STK push to buyer…");
    try {
      const res = await api.post<{ order: Order; tickets?: IssuedTicket[] }>("/pos/sell", {
        eventId: event.id,
        ticketTierId: tier.id,
        quantity,
        buyerName,
        buyerPhone,
        paymentMethod: method,
        doorStaffId: "door-staff-demo",
      });
      let tickets = res.tickets;
      if (!tickets) {
        setMessage("Waiting for M-Pesa confirmation…");
        await pollUntilPaid(res.order.id);
        const t = await api.get<{ tickets: IssuedTicket[] }>(`/tickets/order/${res.order.id}`);
        tickets = t.tickets;
      }
      setLastTickets(tickets || []);
      setMessage(`✅ Sold ${tickets?.length || quantity} ticket(s) to ${buyerName}.`);
      setBuyerName("");
      setBuyerPhone("");
      setQuantity(1);
      const refreshed = await api.get<{ events: EventRecord[] }>("/events");
      setEvents(refreshed.events);
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Sale failed"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Door Staff</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">Point-of-sale ticketing</h1>
      <p className="mt-2 text-sm text-cream/60">
        Sell tickets on the spot. Works low-connectivity — cash sales settle instantly on this device.
      </p>

      <div className="mt-8 space-y-4 rounded-3xl glass p-6">
        <div>
          <label className="mb-1 block text-sm text-cream/60">Event</label>
          <select
            value={eventId}
            onChange={(e) => { setEventId(e.target.value); setTierId(""); }}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm focus:outline-none"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id} className="bg-surface">{e.title}</option>
            ))}
          </select>
        </div>

        {event && (
          <div>
            <label className="mb-1 block text-sm text-cream/60">Ticket tier</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {event.ticketTiers.map((t) => {
                const remaining = t.quantityTotal - t.quantitySold;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTierId(t.id)}
                    disabled={remaining === 0}
                    className={`rounded-xl border px-3 py-3 text-left text-sm disabled:opacity-40 ${
                      tierId === t.id ? "border-gold bg-gold/10" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-cream/50">{formatKES(t.price)} · {remaining} left</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-cream/60">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-cream/60">Payment</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as "cash" | "pos_mpesa")}
              className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm focus:outline-none"
            >
              <option value="cash" className="bg-surface">Cash</option>
              <option value="pos_mpesa" className="bg-surface">M-Pesa (STK push)</option>
            </select>
          </div>
        </div>

        <input
          placeholder="Buyer name"
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
        />
        {method === "pos_mpesa" && (
          <input
            placeholder="Buyer phone (for STK push)"
            value={buyerPhone}
            onChange={(e) => setBuyerPhone(e.target.value)}
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          />
        )}

        {tier && (
          <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm">
            <span>Total ({quantity} × {tier.name})</span>
            <span className="font-bold text-gold">{formatKES(tier.price * quantity)}</span>
          </div>
        )}

        <button
          onClick={sell}
          disabled={busy || !tier || !buyerName}
          className="w-full rounded-full bg-brand-gradient px-6 py-3 font-bold shadow-glow disabled:opacity-50"
        >
          {busy ? "Processing…" : "Complete sale"}
        </button>

        {message && <p className="text-center text-sm text-cream/75">{message}</p>}

        {lastTickets.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-4">
            {lastTickets.map((t) => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.qrPayload} alt="" className="h-14 w-14 rounded bg-cream" />
                <p className="font-mono text-sm text-gold">{t.code}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
