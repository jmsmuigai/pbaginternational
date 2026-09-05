"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";
import type { ChatbotMessage } from "@pbag/shared";

const SUGGESTIONS = [
  "How do I buy a ticket?",
  "How does M-Pesa payment work?",
  "What are PBAG's subsidiaries?",
  "Tell me about your consultancy & AI services",
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatbotMessage[]>([
    { role: "assistant", content: "Habari! I'm the PBAG assistant. Ask me about events, tickets, M-Pesa payments, our subsidiaries, or our theatre/film consultancy and generative-AI services." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await api.post<{ reply: string }>("/chatbot", { messages: next });
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I couldn't reach the assistant service right now — please try the Contact page." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-3xl glass shadow-glow">
          <div className="flex items-center justify-between bg-brand-gradient px-4 py-3">
            <p className="font-display text-sm font-bold">PBAG Assistant</p>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-cream/90">✕</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-primary text-cream" : "bg-white/10 text-cream/90"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-cream/50">PBAG assistant is typing…</div>}
            <div ref={bottomRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-cream/70 hover:bg-white/10"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-white/10 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-r from-gold to-coral px-4 py-2 text-sm font-semibold text-ink"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-2xl shadow-glow transition hover:-translate-y-1"
        aria-label="Open chatbot"
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
