"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-emerald/10 p-6 text-center">
        <p className="font-display text-lg font-bold text-emerald">Message sent!</p>
        <p className="mt-2 text-sm text-cream/70">We&apos;ll get back to you shortly.</p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-sm text-primary-light hover:text-gold">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Full name"
        className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
      />
      <input
        required
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email address"
        className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
      />
      <textarea
        required
        rows={5}
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="How can we help?"
        className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm placeholder:text-cream/40 focus:outline-none"
      />
      <button
        disabled={status === "sending"}
        className="w-full rounded-full bg-brand-gradient px-6 py-3 font-bold shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && <p className="text-center text-sm text-coral">Something went wrong — please try again.</p>}
    </form>
  );
}
