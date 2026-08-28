"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { EventRecord } from "@pbag/shared";
import { formatDate } from "@/lib/format";

export function EventCarousel({ events }: { events: EventRecord[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % events.length), [events.length]);
  const prev = () => setIndex((i) => (i - 1 + events.length) % events.length);

  useEffect(() => {
    if (paused || events.length <= 1) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next, events.length]);

  if (!events.length) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-cream/60">
        No upcoming events on sale right now — check back soon.
      </div>
    );
  }

  return (
    <div
      className="relative h-[78vh] min-h-[560px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {events.map((event, i) => (
        <div
          key={event.id}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          } ${event.slug === "ndeiya-talent-search" && i === index ? "animate-dance shadow-dance-glow border-[6px] border-gold rounded-3xl m-4 overflow-hidden" : ""}`}
          aria-hidden={i !== index}
        >
          <div
            className={`absolute inset-0 scale-105 ${i === index ? "animate-[floaty_14s_ease-in-out_infinite]" : ""}`}
          >
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 md:px-10">
            <span className="mb-4 w-fit rounded-full bg-cream/95 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
              {event.category} · {event.subsidiary.replace(/-/g, " ")}
            </span>
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight md:text-6xl">
              {event.title}
            </h2>
            <p className="mt-3 max-w-xl text-cream/80 md:text-lg">{event.description}</p>
            <p className="mt-2 text-sm text-cream/60">
              {formatDate(event.startAt)} · {event.venue}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/tickets/${event.slug}`}
                className="rounded-full bg-brand-gradient px-7 py-3 font-semibold shadow-glow transition hover:-translate-y-0.5"
              >
                Get Tickets
              </Link>
              <Link
                href="/tickets"
                className="rounded-full border border-white/25 px-7 py-3 font-semibold transition hover:bg-white/10"
              >
                See all events
              </Link>
            </div>
          </div>
        </div>
      ))}

      {events.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous event"
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full glass p-3 hover:bg-white/20"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next event"
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full glass p-3 hover:bg-white/20"
          >
            ›
          </button>
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-gold" : "w-3 bg-white/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
