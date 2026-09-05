import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SUBSIDIARIES } from "@pbag/shared";
import { GradientBlobs } from "@/components/GradientBlobs";
import { Tilt3D } from "@/components/Tilt3D";
import { TraditionalDivider } from "@/components/TraditionalDivider";

export const metadata: Metadata = { title: "About Us" };

const TRACK_RECORD = [
  { value: "10+", label: "Years active" },
  { value: "60+", label: "Productions & events delivered" },
  { value: "4", label: "Subsidiaries under one roof" },
  { value: "50k+", label: "Audience members reached" },
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
            PBAG began as a small collective of visionary performers and organisers with one primary goal: to build sustainable platforms for Kenyan creative and civic talent to be discovered, trained, and celebrated on a global scale. From our humble beginnings staging local community theatre, we have grown into a multifaceted organisation that champions artistic excellence and cultural preservation. Today, that mission lives across four distinct subsidiaries, each with its own focus, working seamlessly together under the PBAG International name to redefine the arts landscape in East Africa and beyond.
          </p>
        </div>
      </section>

      <TraditionalDivider />

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
          {TRACK_RECORD.map((t) => (
            <div key={t.label} className="rounded-2xl glass p-8 text-center ring-1 ring-white/5">
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
              <Tilt3D key={s.slug}>
                <Link
                  href={`/subsidiaries/${s.slug}`}
                  className="group flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-primary-light/60 hover:bg-white/[0.06] shadow-xl"
                >
                  <div 
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${s.colorFrom}, ${s.colorTo})` }}
                  >
                    <span className="text-4xl">{s.emoji}</span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold group-hover:text-gold">
                      {s.name} {s.isLead && <span className="ml-2 text-xs font-semibold text-gold border border-gold/30 rounded-full px-2 py-0.5">LEAD</span>}
                    </p>
                    <p className="mt-1 text-sm text-cream/60">{s.description}</p>
                  </div>
                </Link>
              </Tilt3D>
            ))}
          </div>
        </div>
      </section>

      <TraditionalDivider />

      <section className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Leadership</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">The PBAG Bunge Initiative</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-cream/50">
              Rather than a traditional corporate board, PBAG&apos;s leadership and civic direction is driven by PBAG Bunge — our dedicated youth parliamentary-debate and civic-leadership programme.
            </p>
          </div>
          
          <Tilt3D className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-2xl backdrop-blur-sm">
              <div className="relative h-64 w-full">
                <Image src="/images/subsidiaries/pbag-bunge.jpg" alt="PBAG Bunge" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              </div>
              <div className="p-8 text-center relative z-10 -mt-16">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-sky-500 shadow-glow mb-4">
                  <span className="text-3xl">🏛️</span>
                </div>
                <h3 className="font-display text-2xl font-bold">Training Tomorrow&apos;s Leaders</h3>
                <p className="mt-4 text-cream/70">
                  Through public speaking, governance training, and structured debate, PBAG Bunge empowers the youth to articulate their visions and debate policy with confidence, emerging as the transformative leaders who will shape the future of our communities and the nation.
                </p>
                <Link href="/subsidiaries/pbag-bunge" className="mt-6 inline-block rounded-full bg-white/10 px-6 py-2 text-sm font-semibold text-cream transition hover:bg-white/20 hover:text-gold">
                  Explore PBAG Bunge
                </Link>
              </div>
            </div>
          </Tilt3D>
        </div>
      </section>
    </div>
  );
}

