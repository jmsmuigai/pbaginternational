import Link from "next/link";
import Image from "next/image";
import { CONTACT, SUBSIDIARIES } from "@pbag/shared";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:px-8">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-2">
            <Image src="/images/brand/logo.png" alt="PBAG logo" width={40} height={40} className="rounded-full" />
            <p className="font-display text-xl font-bold">
              <span className="text-gradient">PBAG</span> Consortium
            </p>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-widest text-cream/40">Peers Best Art Group</p>
          <p className="mt-3 text-sm text-cream/60">
            Theatre. Talent. Production. Leadership. One consortium, four subsidiaries, live on stage.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">Explore</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/consultancy" className="hover:text-gold">Consultancy &amp; AI</Link></li>
            <li><Link href="/tickets" className="hover:text-gold">Tickets</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">Subsidiaries</p>
          <ul className="space-y-2 text-sm text-cream/80">
            {SUBSIDIARIES.map((s) => (
              <li key={s.slug}>
                <Link href={`/subsidiaries/${s.slug}`} className="hover:text-gold">{s.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cream/50">Contact</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>{CONTACT.phone}</li>
            <li>{CONTACT.email}</li>
            <li>{CONTACT.address}</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-cream/60">
            {CONTACT.social.facebook && (
              <a href={CONTACT.social.facebook} target="_blank" rel="noreferrer" className="hover:text-gold">Facebook</a>
            )}
            {CONTACT.social.youtube && (
              <a href={CONTACT.social.youtube} target="_blank" rel="noreferrer" className="hover:text-gold">YouTube</a>
            )}
            {CONTACT.social.instagram && (
              <a href={CONTACT.social.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">Instagram</a>
            )}
            {CONTACT.social.twitter && (
              <a href={CONTACT.social.twitter} target="_blank" rel="noreferrer" className="hover:text-gold">X</a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} PBAG Consortium (Peers Best Art Group). All rights reserved.
      </div>
    </footer>
  );
}
