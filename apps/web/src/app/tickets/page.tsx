import Image from "next/image";
import Link from "next/link";
import { TicketFilters } from "@/components/TicketFilters";
import type { Metadata } from "next";
import type { EventRecord } from "@pbag/shared";
import { API_URL } from "@/lib/api";
import { formatDate, formatKES } from "@/lib/format";

export const metadata: Metadata = { title: "Tickets" };

async function getEvents(): Promise<EventRecord[]> {
  try {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.events as EventRecord[];
  } catch {
    return [];
  }
}

function lowestPrice(event: EventRecord) {
  return Math.min(...event.ticketTiers.map((t) => t.price));
}

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  let events = await getEvents();

  // Apply filters server-side
  const query = searchParams.q?.toLowerCase() || "";
  const category = searchParams.category;

  if (query) {
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.venue.toLowerCase().includes(query)
    );
  }

  if (category && category !== "All") {
    events = events.filter((e) => e.category === category);
  }

  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Tickets</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold md:text-5xl">Upcoming PBAG events</h1>
            <p className="mt-3 max-w-xl text-cream/65">
              Buy online with instant QR e-tickets, or ask about tickets at the door — the same system
              powers both.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/tickets/pos" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              Door / POS mode
            </Link>
            <Link href="/tickets/scan" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              Gate scanner
            </Link>
            <Link href="/tickets/producer" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">
              Producer dashboard
            </Link>
          </div>
        </div>

        <TicketFilters />

        {events.length === 0 ? (
          <div className="rounded-3xl glass p-12 text-center text-cream/60">
            No events loaded yet. Start the API (<code className="rounded bg-white/10 px-1">npm run dev:api</code>) and
            seed it (<code className="rounded bg-white/10 px-1">npm run seed</code>) to see events here.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
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
      </div>
    </div>
  );
}
