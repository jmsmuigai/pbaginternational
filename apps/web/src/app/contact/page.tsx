import type { Metadata } from "next";
import { CONTACT } from "@pbag/shared";
import { ContactForm } from "@/components/ContactForm";
import { GradientBlobs } from "@/components/GradientBlobs";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden py-20">
      <GradientBlobs />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold md:text-5xl">Let&apos;s talk.</h1>
          <p className="mt-4 max-w-md text-cream/70">
            Questions about an event, a subsidiary, or a partnership? Reach us directly or send a message.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">📞</span>
              <div>
                <p className="text-sm text-cream/50">Phone</p>
                <p className="font-semibold">{CONTACT.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">✉️</span>
              <div>
                <p className="text-sm text-cream/50">Email</p>
                <p className="font-semibold">{CONTACT.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">📍</span>
              <div>
                <p className="text-sm text-cream/50">Location</p>
                <p className="font-semibold">{CONTACT.address}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-3">
            {Object.entries(CONTACT.social)
              .filter((entry): entry is [string, string] => Boolean(entry[1]))
              .map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm capitalize text-cream/80 hover:border-gold hover:text-gold"
                >
                  {name}
                </a>
              ))}
          </div>
        </div>

        <div className="rounded-3xl glass p-6 md:p-8">
          <h2 className="font-display text-xl font-bold">Send a message</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
