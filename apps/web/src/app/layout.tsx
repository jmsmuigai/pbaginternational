import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BRAND } from "@pbag/shared";

// Font configurations are loaded via CSS @import in globals.css to avoid
// build-time network fetches that cause Next.js static exports to fail
// on restricted CI runners.

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
      <body className="font-body antialiased bg-ink text-cream bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surfaceAlt/30 via-ink to-ink text-lg font-light leading-relaxed">
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
