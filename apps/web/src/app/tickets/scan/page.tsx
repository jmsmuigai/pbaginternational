"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { IssuedTicket } from "@pbag/shared";

interface VerifyResponse {
  valid: boolean;
  reason?: string;
  alreadyUsed?: boolean;
  usedAt?: string;
  scannedBy?: string;
  ticket?: IssuedTicket;
}

/**
 * Gate / door-staff scanning tool (Section 6.7). In production this would
 * read the camera via a QR-decoding library (e.g. html5-qrcode) and call
 * the same verify() function below with the decoded code — see
 * docs/GEMINI_ANTIGRAVITY_TASKS.md for wiring up live camera scanning.
 * The manual code-entry mode here exercises the exact same API and proves
 * duplicate-scan rejection works.
 */
export default function ScanPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<{ code: string; valid: boolean; at: string }[]>([]);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    try {
      const res = await api.post<VerifyResponse>("/tickets/verify", { code: code.trim(), scannedBy: "gate-staff-demo" });
      setResult(res);
      setHistory((h) => [{ code: code.trim(), valid: res.valid, at: new Date().toLocaleTimeString() }, ...h].slice(0, 8));
    } catch (err: any) {
      setResult({ valid: false, reason: err.message });
    } finally {
      setBusy(false);
      setCode("");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Gate Staff</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">Ticket verification</h1>
      <p className="mt-2 text-sm text-cream/60">
        Enter (or scan) a ticket code to validate entry. A ticket can only ever be marked used once.
      </p>

      <form onSubmit={verify} className="mt-8 flex gap-3 rounded-3xl glass p-4">
        <input
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="PBAG-XXXX-XXXX-XXXX"
          className="flex-1 rounded-xl bg-white/10 px-4 py-3 font-mono text-sm placeholder:text-cream/40 focus:outline-none"
        />
        <button
          disabled={busy}
          className="rounded-xl bg-brand-gradient px-6 py-3 text-sm font-bold disabled:opacity-50"
        >
          {busy ? "Checking…" : "Verify"}
        </button>
      </form>

      {result && (
        <div
          className={`mt-6 rounded-3xl p-6 text-center ${
            result.valid ? "bg-emerald/15" : "bg-coral/15"
          }`}
        >
          <p className={`font-display text-2xl font-extrabold ${result.valid ? "text-emerald" : "text-coral"}`}>
            {result.valid ? "✅ VALID — Entry granted" : "⛔ DENIED"}
          </p>
          {!result.valid && result.reason === "already_used" && (
            <p className="mt-2 text-sm text-cream/70">
              Already scanned at {result.usedAt ? new Date(result.usedAt).toLocaleTimeString() : "—"} by {result.scannedBy}.
            </p>
          )}
          {!result.valid && result.reason === "not_found" && (
            <p className="mt-2 text-sm text-cream/70">No ticket found with that code.</p>
          )}
          {result.ticket && (
            <p className="mt-3 text-sm text-cream/60">
              {result.ticket.ticketTierName} · Holder: {result.ticket.holderName}
            </p>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <p className="mb-2 text-sm font-semibold text-cream/60">Recent scans</p>
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 text-sm">
                <span className="font-mono text-xs">{h.code}</span>
                <span className={h.valid ? "text-emerald" : "text-coral"}>{h.valid ? "Valid" : "Denied"}</span>
                <span className="text-xs text-cream/40">{h.at}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
