import { SupportFlow } from "@/components/SupportFlow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support PBAG",
  description: "Support the PBAG Consortium's mission through an M-Pesa donation.",
};

export default function SupportPage() {
  return (
    <div className="py-24 px-6 relative z-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl text-white">
            Support Our <span className="text-gold">Mission</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-cream/80">
            The PBAG Consortium thrives on the support of our community. Your contribution helps us nurture raw talent, produce world-class theatre, and empower the next generation of leaders.
          </p>
        </div>

        <SupportFlow />
      </div>
    </div>
  );
}
