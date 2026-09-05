import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { CONTACT } from "@pbag/shared";
import { GradientBlobs } from "@/components/GradientBlobs";
import { Tilt3D } from "@/components/Tilt3D";
import { TraditionalDivider } from "@/components/TraditionalDivider";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "Theatre & Film Consultancy",
  description:
    "PBAG's theatre and film consultancy — production strategy, dramaturgy, and generative-AI-assisted creative tooling for companies, schools, and independent producers.",
};

const SERVICES = [
  {
    icon: "/images/consultancy/icon-theatre.svg",
    title: "Theatre Consultancy",
    tagline: "From script to curtain call.",
    points: [
      "Script development & dramaturgy notes",
      "Casting strategy and rehearsal-room planning",
      "Venue selection, staging, and technical riders",
      "Box-office and ticket-tier pricing strategy",
    ],
  },
  {
    icon: "/images/consultancy/icon-film.svg",
    title: "Film & Production Consultancy",
    tagline: "Pre-production to premiere.",
    points: [
      "Production planning, budgeting & scheduling",
      "Location scouting and crew sourcing support",
      "Post-production, colour, and sound-mix oversight",
      "Distribution and festival-submission strategy",
    ],
  },
  {
    icon: "/images/consultancy/icon-generative-ai.svg",
    title: "Generative AI for Theatre & Film",
    tagline: "Agentic tools for creative teams.",
    points: [
      "AI-assisted script coverage & story-structure notes",
      "Storyboard and mood-board generation for pitch decks",
      "Automated marketing key-art and trailer-cut drafts",
      "An agentic box-office assistant trained on your show",
    ],
  },
];

const ENGAGEMENT_STEPS = [
  {
    phase: "01 — Discovery",
    detail: "A working session to map your production's goals, timeline, budget band, and where an AI-assisted workflow would actually save time (and where it wouldn't).",
  },
  {
    phase: "02 — Strategy",
    detail: "A written consultancy brief: staffing plan, production or tour schedule, and — where relevant — the specific generative-AI tools we'd wire into your workflow.",
  },
  {
    phase: "03 — Build & Rehearse",
    detail: "Hands-on support through rehearsals or the shoot itself: dramaturgy check-ins, technical run-throughs, and iteration on any AI-assisted drafts (key art, coverage notes, cut sequences).",
  },
  {
    phase: "04 — Launch & Review",
    detail: "Opening night or premiere support, box-office setup on the PBAG ticketing platform, and a post-mortem review of what worked for next time.",
  },
];

const PACKAGES = [
  {
    name: "Starter",
    price: "From KES 25,000",
    fit: "One-off script review or a single strategy session",
    features: ["1 consultancy session (up to 3 hrs)", "Written notes & recommendations", "Email follow-up (7 days)"],
    variant: "secondary" as const,
  },
  {
    name: "Production",
    price: "From KES 120,000",
    fit: "Full pre-production through opening night / premiere",
    features: [
      "Full discovery → strategy → build → launch cycle",
      "Weekly check-ins through rehearsal or shoot",
      "Generative-AI drafts: key art, coverage notes, cut sequences",
      "Box-office setup on the PBAG ticketing platform",
    ],
    variant: "gold" as const,
    highlight: true,
  },
  {
    name: "Ongoing Partner",
    price: "Custom retainer",
    fit: "Companies, schools & festivals producing year-round",
    features: [
      "Everything in Production, per show",
      "Priority scheduling across your season",
      "A dedicated agentic assistant tuned to your archive",
      "Quarterly strategy review",
    ],
    variant: "secondary" as const,
  },
];

const FAQ = [
  {
    q: "Is the \"generative AI\" work photoreal AI-generated imagery, or something else?",
    a: "It's an advisory and drafting service — we use generative-AI tools to produce first-draft coverage notes, storyboards, key art, and cut sequences that your team then reviews, edits, and approves. Nothing goes out under PBAG's name as final without a human sign-off.",
  },
  {
    q: "Do you work with schools and community theatre groups, not just professional productions?",
    a: "Yes — Peers Got Talanta (PGT) and PBAG Bunge both grew out of community and youth programmes, so a lower-budget or first-time production is exactly who the Starter package is built for.",
  },
  {
    q: "Can the agentic assistant sell tickets on my own site?",
    a: "The chatbot on this site is wired into our own ticketing platform. For a client's own website, we scope that as part of the Ongoing Partner tier rather than promising a drop-in integration up front.",
  },
];

export default function ConsultancyPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-20">
        <GradientBlobs variant="warm" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2 md:px-8 md:py-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Consultancy &amp; Generative AI</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-5xl">
              Theatre &amp; film expertise, <span className="text-gradient">plus the agentic AI tooling</span> to move faster.
            </h1>
            <p className="mt-5 max-w-xl text-cream/70">
              PBAG doesn&apos;t just produce our own shows — Peatice Productions and the wider PBAG team also advise
              other companies, schools, and independent producers on staging, budgeting, and distribution, and on
              where a generative-AI-assisted workflow genuinely helps versus where it&apos;s just noise.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="gold">Book a consultancy call</Button>
              <Button
                href={`https://wa.me/254720960180?text=${encodeURIComponent("Hi, I'd like to enquire about PBAG's theatre/film consultancy services")}`}
                variant="secondary"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
          <Tilt3D perspective={1600} scale={1.01} maxTilt={4} className="relative">
            <div className="overflow-hidden rounded-3xl shadow-glow ring-1 ring-white/10">
              <Image
                src="/images/consultancy/hero-consultancy.svg"
                alt="Illustration of theatre masks, a clapperboard, a film reel, and connected AI nodes"
                width={1200}
                height={720}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </Tilt3D>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 opacity-70 md:px-8">
        <Image src="/images/consultancy/pattern-strip.svg" alt="" width={800} height={60} className="h-8 w-full" />
      </div>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">What we offer</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Three ways we can work together</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {SERVICES.map((s) => (
              <Tilt3D key={s.title} maxTilt={6}>
                <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-xl transition hover:border-gold/40 hover:bg-white/[0.06]">
                  <div className="mb-5 h-16 w-16 overflow-hidden rounded-2xl">
                    <Image src={s.icon} alt="" width={64} height={64} className="h-full w-full" />
                  </div>
                  <h3 className="font-display text-xl font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm font-medium text-gold">{s.tagline}</p>
                  <ul className="mt-4 space-y-2 text-sm text-cream/70">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span className="mt-1 text-emerald">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Tilt3D>
            ))}
          </div>
        </div>
      </section>

      <TraditionalDivider />

      {/* Engagement process — framed timeline table */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">How an engagement runs</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">A four-stage process, every time</h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-xl">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {ENGAGEMENT_STEPS.map((step, i) => (
                  <tr key={step.phase} className={i % 2 === 0 ? "bg-white/[0.04]" : "bg-white/[0.01]"}>
                    <td className="w-48 border-b border-white/10 px-6 py-5 align-top font-display text-base font-bold text-gold">
                      {step.phase}
                    </td>
                    <td className="border-b border-white/10 px-6 py-5 align-top text-cream/75">{step.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Packages — modern pricing table */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Packages</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Pick a starting point</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-cream/50">
              Every engagement is scoped individually — these are starting bands, not fixed quotes. Ask us for a
              written proposal after the discovery call.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative flex flex-col rounded-3xl border p-8 shadow-xl ${
                  pkg.highlight
                    ? "border-gold/60 bg-gradient-to-b from-gold/10 to-transparent scale-[1.02]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-gradient px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-glow">
                    Most booked
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{pkg.name}</h3>
                <p className="mt-2 text-2xl font-extrabold text-gradient">{pkg.price}</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-cream/50">{pkg.fit}</p>
                <ul className="mt-6 flex-1 space-y-2 text-sm text-cream/75">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1 text-emerald">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/contact" variant={pkg.variant} className="mt-8 w-full">
                  Enquire
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TraditionalDivider />

      {/* FAQ */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-6 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Good to know</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:border-gold/40">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-cream/95 marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="shrink-0 text-gold transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-cream/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gold/30 bg-gradient-to-br from-white/5 to-transparent px-8 py-14 text-center shadow-glow-gold md:px-16">
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">
            Bringing a production to stage or screen? <span className="text-gradient">Let&apos;s talk.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">
            Tell us about your show, timeline, and budget band, and we&apos;ll follow up with which package fits.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="gold">Book a consultancy call</Button>
            <Button href={`mailto:${CONTACT.email}`} variant="ghost">Email {CONTACT.email}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
