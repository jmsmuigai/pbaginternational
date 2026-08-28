import type { Metadata } from "next";
import Link from "next/link";
import { GradientBlobs } from "@/components/GradientBlobs";

export const metadata: Metadata = {
  title: "Coming Soon",
};

export default function PlaceholderPage() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-24 px-6 z-10">
      <GradientBlobs />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">Feature Simulation</p>
        <h1 className="font-display text-4xl font-extrabold md:text-6xl text-white mb-6">
          Simulated <span className="text-gradient">Placeholder</span>
        </h1>
        <p className="text-lg text-cream/80 mb-10">
          This feature or page is currently a simulated placeholder. In a production environment, this button or link would open a fully functional module, external service, or dynamic route.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-brand-gradient px-8 py-4 font-bold text-white shadow-glow transition hover:-translate-y-0.5"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
