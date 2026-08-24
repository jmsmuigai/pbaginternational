import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { BRAND } from "@pbag/shared";

// NOTE: font loading — this project intentionally uses a curated system
// font stack (see --font-display / --font-body in globals.css) instead of
// next/font/google, because next/font fetches Google Fonts *at build
// time* and fails the build in any offline/restricted-network CI
// environment (including the sandbox this project was scaffolded in).
// To use real Poppins/Inter once you have full network access at build
// time, swap in `next/font/google` here — see docs/GEMINI_ANTIGRAVITY_TASKS.md.

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: "PBAG International — Theatre, Talent, Production & Leadership",
    template: "%s · PBAG International",
  },
  description:
    "PBAG International is the parent brand behind PBAG Theatre, Peers Got Talent, Peatice Production and PBAG Bunge — with an integrated ticketing platform for every PBAG live event.",
  icons: { icon: "/images/brand/favicon.png" },
  openGraph: {
    title: "PBAG International",
    description: "Theatre. Talent. Production. Leadership. Get tickets to every PBAG live event.",
    images: ["/images/brand/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/brand/og-image.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <NavBar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
