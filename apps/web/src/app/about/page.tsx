import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SUBSIDIARIES } from "@pbag/shared";
import { GradientBlobs } from "@/components/GradientBlobs";

export const metadata: Metadata = { title: "About Us" };

const TRACK_RECORD = [
  { value: "10+", label: "Years active" },
  { value: "60+", label: "Productions & events delivered" },
  { value: "4", label: "Subsidiaries under one roof" },
  { value: "50k+", label: "Audience members reached" },
];

const LEADERS = [
  { name: "[Leader Name]", role: "Founder & Executive Director", img: "/images/about/leader-1.jpg" },
  { name: "[Leader Name]", role: "Creative Director, PBAG Theatre", img: "/images/about/leader-2.jpg" },
  { name: "[Leader Name]", role: "Head of Production, Peatice Production", img: "/images/about/leader-3.jpg" },
  { name: "[Leader Name]", role: "Programme Lead, PBAG Bunge", img: "/images/about/leader-4.jpg" },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <GradientBlobs />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">About PBAG</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold md:text-6xl">
            A creative organisation built to <span className="text-gradient">put stories on stage.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-cream/70">
            [PLACEHOLDER — replace with PBAG-supplied history &amp; mission copy.] PBAG began as a small
            collective of performers and organisers with one goal: build platforms for Kenyan creative
            and civic talent to be seen, trained, and celebrated. Today that mission lives across four
            distinct subsidiaries, each with its own focus, working together under the PBAG name.
          </p>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {TRACK_RECORD.map((t) => (
            <div key={t.label} className="rounded-2xl glass p-8 text-center">
              <p className="font-display text-4xl font-extrabold text-gradient">{t.value}</p>
              <p className="mt-2 text-sm text-cream/60">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our mission</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Four subsidiaries, one mission</h2>
            <p className="mx-auto mt-4 max-w-2xl text-cream/70">
              Each PBAG subsidiary tackles a different part of the same goal — building platforms where
              Kenyan talent and leadership can grow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {SUBSIDIARIES.map((s) => (
              <Link
                key={s.slug}
                href={`/subsidiaries/${s.slug}`}
                className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-primary-light/60 hover:bg-white/[0.06]"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={`/images/subsidiaries/${s.slug}.jpg`} alt={s.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold group-hover:text-gold">{s.name}</p>
                  <p className="mt-1 text-sm text-cream/60">{s.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Leadership</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">The people behind PBAG</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-cream/50">
              [PLACEHOLDER — confirm with PBAG whether leadership bios/photos should be public, then
              replace names, roles and photos below.]
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERS.map((l) => (
              <div key={l.name} className="overflow-hidden rounded-3xl border border-white/10">
                <div className="relative h-56 w-full">
                  <Image src={l.img} alt={l.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <p className="font-display font-bold">{l.name}</p>
                  <p className="text-sm text-cream/60">{l.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
