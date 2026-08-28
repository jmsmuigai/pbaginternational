import type { Subsidiary } from "./types";

/**
 * PBAG brand palette — a deep, theatrical purple paired with warm gold and
 * coral accents. Chosen to read as "modern arts & culture" rather than
 * generic corporate blue. See docs/BRAND.md for full usage guidance.
 */
export const BRAND = {
  name: "PBAG",
  fullName: "PBAG International", // TODO(PBAG): confirm official full/legal name & acronym meaning
  domain: "pbag.com",
  colors: {
    ink: "#120B23", // near-black background
    surface: "#1B1130",
    surfaceAlt: "#241640",
    primary: "#7C3AED", // violet
    primaryDark: "#5B21B6",
    accentGold: "#F5B400",
    accentCoral: "#FB5D5D",
    accentEmerald: "#22C55E",
    cream: "#FCF7F0",
    slate: "#94A3B8",
  },
} as const;

export const SUBSIDIARIES: Subsidiary[] = [
  {
    slug: "pbag-theatre",
    name: "PBAG Theatre",
    tagline: "Stage stories that move the nation.",
    description:
      "PBAG's flagship performing-arts company, producing original and adapted stage productions — including Ithaka cia Kamĩrĩĩthũ.",
    longDescription:
      "PBAG Theatre is the performing-arts heart of PBAG, developing and staging original and adapted theatrical productions for Kenyan and East African audiences. From script development through rehearsal to full production, PBAG Theatre exists to put powerful, homegrown stories on stage — including flagship productions such as Ithaka cia Kamĩrĩĩthũ. Our ensemble of classically trained actors and visionary directors work tirelessly to revive traditional narratives while pushing the boundaries of contemporary African theatre.",
    emoji: "🎭",
    colorFrom: "#7C3AED",
    colorTo: "#5B21B6",
    joinMethod: "form",
    joinTarget: "/placeholder",
  },
  {
    slug: "peers-got-talent",
    name: "Peers Got Talanta (PGT) CBO",
    tagline: "Where undiscovered talent gets its first stage.",
    description:
      "A talent-discovery platform and live competition series spotlighting emerging performers across music, dance, comedy and spoken word.",
    longDescription:
      "Peers Got Talanta (PGT) CBO scouts, mentors and showcases emerging performers — musicians, dancers, comedians and spoken-word artists — through open auditions and live competition events. It is PBAG's engine for discovering the next generation of Kenyan performing talent. By providing world-class stages, professional coaching, and direct exposure to industry leaders, PGT transforms raw potential into seasoned, market-ready artistry.",
    emoji: "🌟",
    colorFrom: "#F5B400",
    colorTo: "#FB923C",
    joinMethod: "whatsapp",
    joinTarget: "/placeholder",
  },
  {
    slug: "peatice-production",
    name: "Peatice Productions",
    tagline: "The craft behind every PBAG production.",
    description:
      "PBAG's in-house production house — handling creative direction, event production, and audio-visual delivery for PBAG and external clients.",
    longDescription:
      "Peatice Productions is PBAG's production and events arm, responsible for creative direction, staging, sound, lighting and audio-visual delivery across PBAG's shows — and available for external production partnerships. Leveraging state-of-the-art equipment and a highly skilled technical crew, Peatice ensures that every live event is a seamless, immersive, and unforgettable auditory and visual experience.",
    emoji: "🎥",
    colorFrom: "#FB5D5D",
    colorTo: "#B91C1C",
    joinMethod: "form",
    joinTarget: "/placeholder",
  },
  {
    slug: "pbag-bunge",
    name: "PBAG Bunge",
    tagline: "Building the next generation of leaders and orators.",
    description:
      "A youth parliamentary-debate and civic-leadership programme, training members in public speaking, governance and structured debate.",
    longDescription:
      "PBAG Bunge ('bunge' — Kiswahili for 'parliament') is PBAG's civic-leadership and debate programme, giving young people a structured, parliamentary-style platform to build public-speaking, governance and critical-thinking skills. Bunge empowers the youth to articulate their visions, debate policy with confidence, and emerge as the transformative leaders who will shape the future of our communities and the nation.",
    emoji: "🏛️",
    isLead: true,
    colorFrom: "#22C55E",
    colorTo: "#0EA5E9",
    joinMethod: "whatsapp",
    joinTarget: "/placeholder",
  },
];

export const PLATFORM_FEE_RATE = 0.05; // 5% platform fee on top of ticket subtotal
export const DEFAULT_COMMISSION_RATE = 0.1; // 10% default seller commission

export const CONTACT = {
  phone: "0720 960 180", // TODO(PBAG): confirm real number
  email: "pbagint@gmail.com", // TODO(PBAG): confirm real inbox
  address: "Nairobi, Kenya", // TODO(PBAG): confirm physical/venue address
  social: {
    facebook: "/placeholder",
    instagram: "/placeholder", // TODO(PBAG): confirm handle
    twitter: "/placeholder", // TODO(PBAG): confirm handle
    youtube: "/placeholder", // TODO(PBAG): confirm handle
    tiktok: "/placeholder", // TODO(PBAG): confirm handle
  },
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Subsidiaries", href: "/subsidiaries", dropdown: true },
  { label: "Tickets", href: "/tickets" },
  { label: "Contact Us", href: "/contact" },
] as const;
