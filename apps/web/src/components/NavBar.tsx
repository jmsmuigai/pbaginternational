"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SUBSIDIARIES } from "@pbag/shared";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Shows", href: "/shows" },
  { label: "Subsidiaries", href: "/subsidiaries" },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Tickets", href: "/tickets" },
  { label: "Contact Us", href: "/contact" },
  { label: "Support Us", href: "/support" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full overflow-hidden bg-brand-gradient py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white shadow-md">
        <div className="whitespace-nowrap inline-block animate-marquee group">
          <Link href="/tickets/ndeiya-talent-search" className="mx-4 hover:text-gold transition">🌟 NDEIYA TALENT SEARCH - PGT PEERS GOT TALANTA FESTIVAL 7TH EDITION - 21ST TO 23RD - REGISTER NOW! 0725 787 214 🌟</Link>
          <Link href="/tickets/ndeiya-talent-search" className="mx-4 hover:text-gold transition">🌟 WINNERS TO PARTICIPATE IN NDEIYA ARTS AND CULTURE WEEK #NACWEEK26 🌟</Link>
          <Link href="/tickets/ndeiya-talent-search" className="mx-4 hover:text-gold transition">🌟 CATEGORIES: TECH, COMEDY, FILM, STORYTELLING, VISUAL ARTS, DJ, MUSIC, FASHION 🌟</Link>
          <Link href="/tickets/ndeiya-talent-search" className="mx-4 hover:text-gold transition">🌟 NDEIYA TALENT SEARCH - PGT PEERS GOT TALANTA FESTIVAL 7TH EDITION - REGISTER NOW! 0725 787 214 🌟</Link>
        </div>
      </div>
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 border-b-0 border-x-0 rounded-b-xl shadow-lg">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/brand/logo.png" alt="PBAG logo" width={40} height={40} className="rounded-full" />
          <span className="font-display text-lg font-bold tracking-tight">
            <span className="text-gradient">PBAG</span> Consortium
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            item.label === "Subsidiaries" ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setSubOpen(true)}
                onMouseLeave={() => setSubOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 ${
                    pathname?.startsWith("/subsidiaries") ? "text-gold" : "text-cream/90"
                  }`}
                >
                  Subsidiaries ▾
                </Link>
                {subOpen && (
                  <div className="absolute left-0 top-full w-64 rounded-2xl glass p-2 shadow-glow">
                    {SUBSIDIARIES.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/subsidiaries/${s.slug}`}
                        className="block rounded-xl px-3 py-2 text-sm text-cream/90 hover:bg-white/10"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 ${
                  pathname === item.href ? "text-gold" : "text-cream/90"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/tickets"
            className="ml-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold shadow-glow transition hover:-translate-y-0.5"
          >
            Get Tickets
          </Link>
        </div>

        <button
          className="rounded-full border border-white/15 p-2 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-5 bg-cream mb-1" />
          <span className="block h-0.5 w-5 bg-cream mb-1" />
          <span className="block h-0.5 w-5 bg-cream" />
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-white/10 px-5 py-4 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl px-3 py-3 text-cream/90 hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {SUBSIDIARIES.map((s) => (
              <Link
                key={s.slug}
                href={`/subsidiaries/${s.slug}`}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs text-cream/80"
                onClick={() => setOpen(false)}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
