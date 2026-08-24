import type { Subsidiary } from "./types";

/**
 * PBAG brand palette — a deep, theatrical purple paired with warm gold and
 * coral accents. Chosen to read as "modern arts & culture" rather than
 * generic corporate blue. See docs/BRAND.md for full usage guidance.
 */
export const BRAND = {
  name: "PBAG",
  fullName: "PBAG International", // TODO(PBAG): confirm official full/legal name & acronym meaning
  domain: "pbaginternational.com",
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
      "PBAG Theatre is the performing-arts heart of PBAG, developing and staging original and adapted theatrical productions for Kenyan and East African audiences. From script development through rehearsal to full production, PBAG Theatre exists to put powerful, homegrown stories on stage — including flagship productions such as Ithaka cia Kamĩrĩĩthũ. [PLACEHOLDER — replace with PBAG-supplied history and mission copy.]",
    colorFrom: "#7C3AED",
    colorTo: "#5B21B6",
    joinMethod: "form",
    joinTarget: "/subsidiaries/pbag-theatre/join",
  },
  {
    slug: "peers-got-talent",
    name: "Peers Got Talent",
    tagline: "Where undiscovered talent gets its first stage.",
    description:
      "A talent-discovery platform and live competition series spotlighting emerging performers across music, dance, comedy and spoken word.",
    longDescription:
      "Peers Got Talent scouts, mentors and showcases emerging performers — musicians, dancers, comedians and spoken-word artists — through open auditions and live competition events. It is PBAG's engine for discovering the next generation of Kenyan performing talent. [PLACEHOLDER — replace with PBAG-supplied history and mission copy.]",
    colorFrom: "#F5B400",
    colorTo: "#FB923C",
    joinMethod: "whatsapp",
    joinTarget: "https://wa.me/254700000000?text=Hi%2C%20I%27d%20like%20to%20join%20Peers%20Got%20Talent",
  },
  {
    slug: "peatice-production",
    name: "Peatice Production",
    tagline: "The craft behind every PBAG production.",
    description:
      "PBAG's in-house production house — handling creative direction, event production, and audio-visual delivery for PBAG and external clients.",
    longDescription:
      "Peatice Production is PBAG's production and events arm, responsible for creative direction, staging, sound, lighting and audio-visual delivery across PBAG's shows — and available for external production partnerships. [PLACEHOLDER — replace with PBAG-supplied history and mission copy.]",
    colorFrom: "#FB5D5D",
    colorTo: "#B91C1C",
    joinMethod: "form",
    joinTarget: "/subsidiaries/peatice-production/join",
  },
  {
    slug: "pbag-bunge",
    name: "PBAG Bunge",
    tagline: "Building the next generation of leaders and orators.",
    description:
      "A youth parliamentary-debate and civic-leadership programme, training members in public speaking, governance and structured debate.",
    longDescription:
      "PBAG Bunge ('bunge' — Kiswahili for 'parliament') is PBAG's civic-leadership and debate programme, giving young people a structured, parliamentary-style platform to build public-speaking, governance and critical-thinking skills. [PLACEHOLDER — replace with PBAG-supplied history and mission copy.]",
    colorFrom: "#22C55E",
    colorTo: "#0EA5E9",
    joinMethod: "whatsapp",
    joinTarget: "https://wa.me/254700000000?text=Hi%2C%20I%27d%20like%20to%20join%20PBAG%20Bunge",
  },
];

export const PLATFORM_FEE_RATE = 0.05; // 5% platform fee on top of ticket subtotal
export const DEFAULT_COMMISSION_RATE = 0.1; // 10% default seller commission

export const CONTACT = {
  phone: "+254 700 000 000", // TODO(PBAG): confirm real number
  email: "info@pbaginternational.com", // TODO(PBAG): confirm real inbox
  address: "Nairobi, Kenya", // TODO(PBAG): confirm physical/venue address
  social: {
    facebook: "https://web.facebook.com/Pbagconsortium",
    instagram: "https://instagram.com/pbaginternational", // TODO(PBAG): confirm handle
    twitter: "https://twitter.com/pbaginternational", // TODO(PBAG): confirm handle
    youtube: "https://youtube.com/@pbaginternational", // TODO(PBAG): confirm handle
    tiktok: "https://tiktok.com/@pbaginternational", // TODO(PBAG): confirm handle
  },
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Subsidiaries", href: "/subsidiaries", dropdown: true },
  { label: "Tickets", href: "/tickets" },
  { label: "Contact Us", href: "/contact" },
] as const;
