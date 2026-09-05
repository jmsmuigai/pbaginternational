import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import type { EventRecord } from "@pbag/shared";
import { API_URL } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import { BecomeSeller } from "@/components/BecomeSeller";
import { TrailerModal } from "@/components/TrailerModal";
import { Showtimes } from "@/components/Showtimes";
import { CastAndCrew } from "@/components/CastAndCrew";

import { seedEvents } from "@/lib/mockEvents";

export async function generateStaticParams() {
  return seedEvents().map((e) => ({ slug: e.slug }));
}

async function getEvent(slug: string): Promise<EventRecord | null> {
  return seedEvents().find((e) => e.slug === slug) || null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const event = await getEvent(params.slug);
  return { title: event ? event.title : "Event" };
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEvent(params.slug);
  if (!event) return notFound();

  return (
    <div>
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <Image src={event.coverImage} alt={event.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-10 md:px-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="w-fit rounded-full bg-cream/95 px-3 py-1 text-xs font-bold uppercase text-ink">
              {event.category}
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold md:text-5xl text-cream">{event.title}</h1>
          <p className="mt-2 text-cream/80 text-lg">
            {formatDate(event.startAt)} · {event.venue}
          </p>
          {event.trailerUrl && (
            <div className="mt-4">
              <TrailerModal trailerUrl={event.trailerUrl} title={event.title} />
            </div>
          )}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-3 md:px-8">
          <div className="space-y-8 md:col-span-2">
            <div>
              <h2 className="font-display text-2xl font-bold">About this event</h2>
              <p className="mt-4 leading-relaxed text-cream/80">{event.description}</p>
            </div>
            
            {event.showtimes && <Showtimes showtimes={event.showtimes} />}
            {event.castAndCrew && <CastAndCrew castAndCrew={event.castAndCrew} />}
            
            <div className="pt-8">
              <BecomeSeller eventId={event.id} eventSlug={event.slug} />
            </div>
          </div>

          <div>
            <Suspense fallback={<div className="rounded-3xl glass p-6 text-cream/60">Loading checkout…</div>}>
              <CheckoutFlow event={event} />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
