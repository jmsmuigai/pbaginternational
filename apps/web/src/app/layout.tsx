import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MusicPlayer } from "@/components/MusicPlayer";
import { BRAND } from "@pbag/shared";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

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

export const viewport: Viewport = {
  themeColor: "#120b23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-body antialiased bg-african-pattern bg-fixed bg-cover bg-center bg-no-repeat text-white`}>
        <NavBar />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
        <Chatbot />
        <MusicPlayer />
        {/* Placeholder GA Measurement ID. Update to the real G-XXXXXXX when available */}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
