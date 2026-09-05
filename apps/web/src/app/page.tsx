import Link from "next/link";
import Image from "next/image";
import { EventCarousel } from "@/components/EventCarousel";
import { GradientBlobs } from "@/components/GradientBlobs";
import { SUBSIDIARIES } from "@pbag/shared";
import type { EventRecord } from "@pbag/shared";
import { API_URL } from "@/lib/api";
import { Tilt3D } from "@/components/Tilt3D";
import { TraditionalDivider } from "@/components/TraditionalDivider";
import { seedEvents } from "@/lib/mockEvents";


async function getUpcomingEvents(): Promise<EventRecord[]> {
  return seedEvents().filter((e) => e.status === "on_sale");
}

const STATS = [
  { value: "4", label: "Subsidiaries" },
  { value: "15+", label: "Years of experience" },
  { value: "10K+", label: "Audience members reached" },
  { value: "100%", label: "Digital + on-site ticketing" },
];

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return (
    <div>
      <EventCarousel events={events} />

      {/* Quick nav */}
      <section className="relative border-y border-white/10 bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-10 md:grid-cols-4 md:px-8">
          {[
            { href: "/about", label: "About Us", desc: "Our story & mission" },
            { href: "/subsidiaries", label: "Subsidiaries", desc: "Four brands, one PBAG" },
            { href: "/tickets", label: "Tickets", desc: "Buy, sell, scan" },
            { href: "/contact", label: "Contact Us", desc: "Reach the team" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-primary-light/60 hover:bg-white/[0.06]"
            >
              <p className="font-display text-lg font-bold text-cream group-hover:text-gold">{item.label}</p>
              <p className="mt-1 text-sm text-cream/60">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why PBAG */}
      <section className="relative overflow-hidden py-24">
        <GradientBlobs />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Who we are</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold md:text-5xl">
              One creative organisation, <span className="text-gradient">four ways to experience it.</span>
            </h2>
            <p className="mt-4 text-cream/70">
              PBAG brings together stage productions, talent discovery, full-service production, and
              civic leadership training under one roof — and one ticketing platform.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl glass p-6 text-center ring-1 ring-white/5">
                <p className="font-display text-4xl font-extrabold text-gradient">{s.value}</p>
                <p className="mt-2 text-sm text-cream/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <TraditionalDivider />

      {/* Subsidiaries preview */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold">Subsidiaries</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Meet the PBAG family</h2>
            </div>
            <Link href="/subsidiaries" className="text-sm font-semibold text-primary-light hover:text-gold">
              View all subsidiaries →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SUBSIDIARIES.map((s) => (
              <Tilt3D key={s.slug} perspective={1500} scale={1.03}>
                <Link
                  href={`/subsidiaries/${s.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 block shadow-lg"
                >
                  <div className="relative h-72 w-full">
                    <Image
                      src={`/images/subsidiaries/${s.slug}.jpg`}
                      alt={s.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="font-display text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{s.emoji}</span>
                      {s.name}
                    </p>
                    <p className="mt-1 text-sm text-cream/70 line-clamp-2">{s.tagline}</p>
                  </div>
                </Link>
              </Tilt3D>
            ))}
          </div>
        </div>
      </section>

      <TraditionalDivider />

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        <GradientBlobs variant="warm" />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-8">
          <h2 className="font-display text-3xl font-extrabold md:text-5xl">Never miss a PBAG show.</h2>
          <p className="mt-4 text-cream/85">
            Browse every upcoming production, buy tickets in under a minute, and get your QR e-ticket
            instantly — pay by M-Pesa, card, or PayPal.
          </p>
          <Link
            href="/tickets"
            className="mt-8 inline-flex rounded-full bg-cream px-8 py-4 font-bold text-ink shadow-xl transition hover:-translate-y-0.5 hover:shadow-gold/20"
          >
            Browse Tickets
          </Link>
        </div>
      </section>
    </div>
  );
}
