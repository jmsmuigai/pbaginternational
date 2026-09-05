import type { Subsidiary } from "./types";

/**
 * PBAG brand palette — a cinematic black paired with a rich traditional red
 * and warm gold, evoking both "modern film" and the traditional-textile
 * accents used across the site (see TraditionalDivider). Kept in exact sync
 * with apps/web/tailwind.config.ts and globals.css — if you change one,
 * change all three.
 */
export const BRAND = {
  name: "PBAG",
  fullName: "Peers Best Art Group",
  domain: "pbag.com",
  colors: {
    ink: "#0D0D0D", // deep cinematic black
    surface: "#2A1910", // dark traditional earth/brown
    surfaceAlt: "#4A291A", // lighter earth tone
    primary: "#B33924", // deep rich traditional red
    primaryDark: "#822617",
    accentGold: "#D4AF37",
    accentCoral: "#E64A19",
    accentEmerald: "#2E7D32",
    cream: "#F9F6F0",
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
    joinMethod: "whatsapp",
    joinTarget: "https://wa.me/254720960180?text=Hi%2C%20I%27d%20like%20to%20join%20PBAG%20Theatre",
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
    joinTarget: "https://wa.me/254720960180?text=Hi%2C%20I%27d%20like%20to%20join%20Peers%20Got%20Talanta%20(PGT)",
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
    joinMethod: "whatsapp",
    joinTarget: "https://wa.me/254720960180?text=Hi%2C%20I%27d%20like%20to%20join%20Peatice%20Productions",
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
    joinTarget: "https://wa.me/254720960180?text=Hi%2C%20I%27d%20like%20to%20join%20PBAG%20Bunge",
  },
];

export const PLATFORM_FEE_RATE = 0.05; // 5% platform fee on top of ticket subtotal
export const DEFAULT_COMMISSION_RATE = 0.1; // 10% default seller commission

export const CONTACT = {
  phone: "+254 720 960 180",
  email: "pbagint@gmail.com",
  address: "Limuru, Kenya",
  social: {
    facebook: "https://web.facebook.com/Pbagconsortium",
    // TODO(PBAG): confirm real Instagram/X/TikTok handles — until then these
    // are omitted from display (see Footer.tsx / contact page) rather than
    // pointing at a fake or internal placeholder URL.
    instagram: null,
    twitter: null,
    // Verified real channel — "PBAG (Peers Best Art Group)", description
    // matches PBAG RAW / PBAG THEATRE / PBAG GENERATION / PGT FESTIVAL.
    youtube: "https://www.youtube.com/channel/UCFV2mTNumJFcQG6-s-xg_Ew",
    tiktok: null,
  },
  // Uploads playlist for the channel above (channel id UC→UU) — used to
  // embed PBAG's real, live latest videos on /shows instead of fixed IDs.
  youtubeUploadsPlaylist: "UUFV2mTNumJFcQG6-s-xg_Ew",
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Subsidiaries", href: "/subsidiaries", dropdown: true },
  { label: "Consultancy", href: "/consultancy" },
  { label: "Tickets", href: "/tickets" },
  { label: "Contact Us", href: "/contact" },
] as const;
