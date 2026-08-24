"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function JoinForm({ subsidiaryName }: { subsidiaryName: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", {
        name: form.name,
        email: form.email,
        message: `[Join request — ${subsidiaryName}] Phone: ${form.phone}\n\n${form.message}`,
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-emerald/10 p-6 text-center">
        <p className="font-display text-lg font-bold text-emerald">Thanks — request received!</p>
        <p className="mt-2 text-sm text-cream/70">The {subsidiaryName} team will reach out soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-cream/70">Full name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/70">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/70">Phone (optional)</label>
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          placeholder="07XX XXX XXX"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-cream/70">Why do you want to join?</label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
          placeholder="Tell us a bit about yourself..."
        />
      </div>
      <button
        disabled={status === "sending"}
        className="w-full rounded-full bg-gradient-to-r from-gold to-coral px-6 py-3 font-bold text-ink transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit interest"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-coral">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
