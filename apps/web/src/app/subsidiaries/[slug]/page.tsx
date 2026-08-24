import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SUBSIDIARIES } from "@pbag/shared";
import { Button } from "@/components/Button";

export function generateStaticParams() {
  return SUBSIDIARIES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  return { title: sub ? sub.name : "Subsidiary" };
}

const GALLERY_PLACEHOLDER_COUNT = 6;

export default function SubsidiaryPage({ params }: { params: { slug: string } }) {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  if (!sub) return notFound();

  return (
    <div>
      <section className="relative h-[46vh] min-h-[360px] w-full overflow-hidden">
        <Image src={`/images/subsidiaries/${sub.slug}.jpg`} alt={sub.name} fill className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-12 md:px-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">PBAG Subsidiary</p>
          <h1 className="font-display text-4xl font-extrabold md:text-6xl">{sub.name}</h1>
          <p className="mt-2 max-w-xl text-cream/80">{sub.tagline}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3 md:px-8">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold">About {sub.name}</h2>
            <p className="mt-4 leading-relaxed text-cream/75">{sub.longDescription}</p>

            <h3 className="mt-10 font-display text-xl font-bold">Gallery</h3>
            <p className="mt-1 text-sm text-cream/50">
              [PLACEHOLDER — this gallery pulls from{" "}
              <code className="rounded bg-white/10 px-1">/images/subsidiaries/{sub.slug}-gallery/</code>{" "}
              so producers can update each subsidiary&apos;s media independently, without touching the others.]
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: GALLERY_PLACEHOLDER_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl border border-white/10"
                  style={{ background: `linear-gradient(135deg, ${sub.colorFrom}, ${sub.colorTo})` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-cream/70">
                    Photo/video {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl glass p-6">
              <p className="font-display text-lg font-bold">Get involved</p>
              <p className="mt-2 text-sm text-cream/65">
                Interested in joining {sub.name}? Tell us a bit about yourself and we&apos;ll be in touch.
              </p>
              {sub.joinMethod === "whatsapp" ? (
                <Button href={sub.joinTarget} className="mt-4 w-full" variant="gold">
                  Join via WhatsApp
                </Button>
              ) : (
                <Button href={sub.joinTarget} className="mt-4 w-full" variant="gold">
                  Fill the interest form
                </Button>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 p-6">
              <p className="font-display text-lg font-bold">Upcoming from {sub.name}</p>
              <p className="mt-2 text-sm text-cream/60">
                See tickets for events produced by this subsidiary.
              </p>
              <Link href="/tickets" className="mt-3 inline-block text-sm font-semibold text-primary-light hover:text-gold">
                Browse tickets →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
