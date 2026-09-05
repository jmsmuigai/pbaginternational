import Link from "next/link";
import type { Metadata } from "next";
import type { EventRecord } from "@pbag/shared";
import { API_URL } from "@/lib/api";
import { Suspense } from "react";
import { seedEvents } from "@/lib/mockEvents";
import { EventListClient } from "@/components/EventListClient";

export const metadata: Metadata = { title: "Tickets" };

async function getEvents(): Promise<EventRecord[]> {
  return seedEvents();
}

export default async function TicketsPage() {
  const events = await getEvents();

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

        {events.length === 0 ? (
          <div className="rounded-3xl glass p-12 text-center text-cream/60">
            No events loaded yet. Start the API (<code className="rounded bg-white/10 px-1">npm run dev:api</code>) and
            seed it (<code className="rounded bg-white/10 px-1">npm run seed</code>) to see events here.
          </div>
        ) : (
          <Suspense fallback={<div className="text-cream/50">Loading events...</div>}>
            <EventListClient events={events} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
