import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BRAND } from "@pbag/shared";

// NOTE: deliberately NOT using next/font/google here. next/font fetches
// Google Fonts over the network *at build time*, and that single fetch
// failing (a flaky runner, a firewalled CI environment, a transient DNS
// blip) turns into a hard build failure with no fallback — which is very
// likely what caused earlier GitHub Actions "Deploy to Pages" runs to fail
// silently and leave the old README showing at the live URL. The curated
// system-font stack below (see --font-display / --font-body in
// globals.css) looks close to Poppins/Inter and never depends on network
// access to build successfully.

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: "PBAG Consortium — Theatre, Talent, Production & Leadership",
    template: "%s · PBAG Consortium",
  },
  description:
    "The PBAG Consortium (Peers Best Art Group) is the parent brand behind PBAG Theatre, Peers Got Talanta (PGT), Peatice Productions and PBAG Bunge — with an integrated ticketing platform for every PBAG live event.",
  icons: { icon: "/images/brand/favicon.png" },
  openGraph: {
    title: "PBAG Consortium",
    description: "Theatre. Talent. Production. Leadership. Get tickets to every PBAG live event.",
    images: ["/images/brand/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/brand/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased bg-african-pattern bg-fixed bg-cover bg-center bg-no-repeat text-white">
        <NavBar />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
        <Chatbot />
        <MusicPlayer />
        {/* Google Analytics is intentionally omitted until PBAG supplies a real
            Measurement ID — a hardcoded G-XXXXXXXXXX placeholder would ship a
            non-functional tracking script. Set NEXT_PUBLIC_GA_ID and re-add
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} /> from
            @next/third-parties/google once one exists. */}
      </body>
    </html>
  );
}
