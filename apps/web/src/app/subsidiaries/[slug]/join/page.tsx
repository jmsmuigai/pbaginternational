import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SUBSIDIARIES } from "@pbag/shared";
import { JoinForm } from "@/components/JoinForm";

// Required for `output: "export"` — without this, a dynamic route like
// /subsidiaries/[slug]/join fails the entire static build (this was one of
// the causes of GitHub Pages repeatedly failing to deploy).
export function generateStaticParams() {
  return SUBSIDIARIES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  return { title: sub ? `Join ${sub.name}` : "Join PBAG" };
}

export default function JoinPage({ params }: { params: { slug: string } }) {
  const sub = SUBSIDIARIES.find((s) => s.slug === params.slug);
  if (!sub) return notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-20 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Join {sub.name}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Tell us about yourself</h1>
      <p className="mt-3 text-cream/70">
        Fill this in and the {sub.name} team will reach out about how to get involved.
      </p>
      <div className="mt-8 rounded-3xl glass p-6">
        <JoinForm subsidiaryName={sub.name} />
      </div>
    </div>
  );
}
