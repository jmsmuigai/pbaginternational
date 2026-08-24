"use client";

import { useState } from "react";
import { api, API_URL } from "@/lib/api";

interface SellerResponse {
  seller: { id: string; code: string; name: string };
  trackableLink: string;
  qrValue: string;
}

export function BecomeSeller({ eventId, eventSlug }: { eventId: string; eventSlug: string }) {
  const [name, setName] = useState("");
  const [result, setResult] = useState<SellerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<SellerResponse>("/sellers/apply", { eventId, name });
      setResult(res);
    } finally {
      setLoading(false);
    }
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="font-display text-xl font-bold">Sell tickets, earn commission</h2>
      <p className="mt-2 text-sm text-cream/65">
        Become a salesperson for this event. You&apos;ll get a unique code, a trackable link, and a QR
        code — every sale attributed to you is tracked automatically, with commission calculated for you.
      </p>

      {!result ? (
        <form onSubmit={apply} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          />
          <button
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-gold to-coral px-5 py-3 text-sm font-bold text-ink disabled:opacity-60"
          >
            {loading ? "Applying…" : "Get my seller code"}
          </button>
        </form>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-xs text-cream/50">Promo code</p>
            <p className="mt-1 font-mono text-lg font-bold text-gold">{result.seller.code}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 sm:col-span-2">
            <p className="text-xs text-cream/50">Trackable link</p>
            <p className="mt-1 truncate font-mono text-sm text-cream/85">{origin}{result.trackableLink}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-4 sm:col-span-3">
            <p className="text-xs text-cream/50">
              QR value (encode this as a QR code for flyers/posters): <span className="font-mono text-cream/80">{result.qrValue}</span>
            </p>
            <p className="mt-2 text-xs text-cream/40">
              View your live sales &amp; commission at{" "}
              <span className="font-mono">{API_URL}/sellers/{result.seller.id}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
