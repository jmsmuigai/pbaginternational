import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SUBSIDIARIES } from "@pbag/shared";

export const metadata: Metadata = { title: "Subsidiaries" };

export default function SubsidiariesIndexPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Subsidiaries</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">The PBAG family</h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/70">
            Four distinct organisations, one shared mission. Explore each one below.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SUBSIDIARIES.map((s) => (
            <Link
              key={s.slug}
              href={`/subsidiaries/${s.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10"
            >
              <div className="relative h-80 w-full">
                <Image src={`/images/subsidiaries/${s.slug}.jpg`} alt={s.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="font-display text-2xl font-extrabold">{s.name}</p>
                <p className="mt-2 max-w-md text-sm text-cream/75">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
