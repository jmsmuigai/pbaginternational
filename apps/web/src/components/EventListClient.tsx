"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { TicketFilters } from "./TicketFilters";
import { formatDate, formatKES } from "@/lib/format";
import type { EventRecord } from "@pbag/shared";

function lowestPrice(event: EventRecord) {
  return Math.min(...event.ticketTiers.map((t) => t.price));
}

export function EventListClient({ events }: { events: EventRecord[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "All";

  let filteredEvents = events;
  if (query) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query)
    );
  }
  if (category && category !== "All") {
    filteredEvents = filteredEvents.filter((e) => e.category === category);
  }

  return (
    <>
      <TicketFilters />
      {filteredEvents.length === 0 ? (
        <div className="rounded-3xl glass p-12 text-center text-cream/60">
          No events found matching your criteria.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const sold = event.ticketTiers.reduce((s, t) => s + t.quantitySold, 0);
            const total = event.ticketTiers.reduce((s, t) => s + t.quantityTotal, 0);
            const pctSold = total ? Math.round((sold / total) * 100) : 0;
            return (
              <Link
                key={event.id}
                href={`/tickets/${event.slug}`}
                className={`group overflow-hidden rounded-3xl border transition hover:-translate-y-1 hover:border-primary-light/60 ${
                  event.slug === "ndeiya-talent-search"
                    ? "animate-dance shadow-dance-glow border-[3px] border-gold z-10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="relative h-48 w-full">
                  <Image src={event.coverImage} alt={event.title} fill className="object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-bold uppercase text-ink">
                    {event.category}
                  </div>
                  {event.status === "sold_out" && (
                    <div className="absolute right-3 top-3 rounded-full bg-coral px-3 py-1 text-[11px] font-bold uppercase">
                      Sold out
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-display text-lg font-bold group-hover:text-gold">{event.title}</p>
                  <p className="mt-1 text-sm text-cream/60">{formatDate(event.startAt)} · {event.venue}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-cream/70">From {formatKES(lowestPrice(event))}</span>
                    <span className="text-xs text-cream/50">{pctSold}% sold</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-gold to-coral" style={{ width: `${pctSold}%` }} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
