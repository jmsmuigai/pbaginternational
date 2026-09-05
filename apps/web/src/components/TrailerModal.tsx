"use client";

import { useState } from "react";

export function TrailerModal({ trailerUrl, title }: { trailerUrl: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 font-semibold text-gold transition hover:bg-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] md:w-auto"
      >
        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        Watch Trailer
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-ink shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-surface/50 px-4 py-3">
          <h3 className="font-display font-bold text-cream">{title} - Trailer</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-cream/50 transition hover:bg-white/10 hover:text-cream"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={trailerUrl}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
