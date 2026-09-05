import type { EventRecord } from "@pbag/shared";
import { newId } from "../lib/tickets";

const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

/**
 * Sample events used to seed the database and power the landing-page
 * carousel + Tickets flow out of the box. Replace with real PBAG events —
 * producers can also create new events directly once the producer
 * dashboard is connected to real accounts.
 */
export function seedEvents(): EventRecord[] {
  const ithaka: EventRecord = {
    id: newId("evt"),
    slug: "ithaka-cia-kamiriithu",
    title: "Ithaka cia Kamĩrĩĩthũ",
    subsidiary: "pbag-theatre",
    description:
      "PBAG Theatre's flagship stage production — a powerful retelling rooted in the Kamĩrĩĩthũ theatre tradition. A limited run, three nights only.",
    category: "Theatre",
    venue: "Kenya National Theatre, Nairobi",
    isOnline: false,
    startAt: inDays(21),
    endAt: inDays(23),
    coverImage: "/images/events/ithaka-cia-kamiriithu.jpg",
    gallery: [
      "/images/events/ithaka-cia-kamiriithu.jpg",
      "/images/subsidiaries/pbag-theatre.jpg",
    ],
    status: "on_sale",
    defaultCommissionRate: 0.1,
    createdAt: new Date().toISOString(),
    ticketTiers: [
      {
        id: newId("tier"),
        name: "Early Bird",
        price: 800,
        quantityTotal: 100,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(7),
      },
      {
        id: newId("tier"),
        name: "Regular",
        price: 1200,
        quantityTotal: 300,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(20),
      },
      {
        id: newId("tier"),
        name: "VIP",
        price: 2500,
        quantityTotal: 50,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(20),
      },
    ],
    trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder trailer
    showtimes: [inDays(21), inDays(22), inDays(23)],
    castAndCrew: [
      { name: "John Doe", role: "Director", imageUrl: "/images/placeholders/cast_1.jpg" },
      { name: "Jane Smith", role: "Lead Actor", imageUrl: "/images/placeholders/cast_2.jpg" },
      { name: "Kariuki Wa Njoroge", role: "Supporting Actor", imageUrl: "/images/placeholders/cast_3.jpg" },
    ],
  };

  const talentFinale: EventRecord = {
    id: newId("evt"),
    slug: "peers-got-talent-season-finale",
    title: "Peers Got Talent — Season Finale",
    subsidiary: "peers-got-talent",
    description:
      "The grand finale of this season's talent search — live performances, audience voting, and the crowning of this year's winner.",
    category: "Talent Show",
    venue: "PBAG Grounds, Nairobi",
    isOnline: false,
    startAt: inDays(35),
    endAt: inDays(35),
    coverImage: "/images/events/peers-got-talent-finale.jpg",
    gallery: ["/images/events/peers-got-talent-finale.jpg", "/images/subsidiaries/peers-got-talent.jpg"],
    status: "on_sale",
    defaultCommissionRate: 0.12,
    createdAt: new Date().toISOString(),
    ticketTiers: [
      {
        id: newId("tier"),
        name: "General",
        price: 500,
        quantityTotal: 500,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(34),
      },
      {
        id: newId("tier"),
        name: "VIP",
        price: 1500,
        quantityTotal: 60,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(34),
      },
    ],
  };

  const bungeSummit: EventRecord = {
    id: newId("evt"),
    slug: "pbag-bunge-youth-leadership-summit",
    title: "PBAG Bunge Youth Leadership Summit",
    subsidiary: "pbag-bunge",
    description:
      "A day of structured debate, keynote talks, and civic-leadership workshops for PBAG Bunge members and guests.",
    category: "Civic / Leadership",
    venue: "Online (Livestream) + Nairobi Hub",
    isOnline: true,
    startAt: inDays(10),
    endAt: inDays(10),
    coverImage: "/images/events/pbag-bunge-summit.jpg",
    gallery: ["/images/events/pbag-bunge-summit.jpg", "/images/subsidiaries/pbag-bunge.jpg"],
    status: "on_sale",
    defaultCommissionRate: 0.08,
    createdAt: new Date().toISOString(),
    ticketTiers: [
      {
        id: newId("tier"),
        name: "Delegate Pass",
        price: 300,
        quantityTotal: 200,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(9),
      },
    ],
  };

  const ndeiyaTalentSearch: EventRecord = {
    id: newId("evt"),
    slug: "ndeiya-talent-search",
    title: "Ndeiya Talent Search - PGT Festival",
    subsidiary: "peers-got-talent",
    description: "The 7th Edition of the Peers Got Talanta Festival. Categories include Tech & Digital Innovation, Comedy, Theatre & Film, and more. Winners participate in the Ndeiya Arts and Culture Week. Register Now! 0725 787 214",
    category: "Talent Show",
    venue: "Royoh Shopping Center / Kamangu Center",
    isOnline: false,
    startAt: inDays(14),
    endAt: inDays(16),
    coverImage: "/images/events/ndeiya-talent-search.jpg",
    gallery: ["/images/events/ndeiya-talent-search.jpg", "/images/subsidiaries/peers-got-talent.jpg"],
    status: "on_sale",
    defaultCommissionRate: 0.1,
    createdAt: new Date().toISOString(),
    ticketTiers: [
      {
        id: newId("tier"),
        name: "Registration Fee",
        price: 500,
        quantityTotal: 1000,
        quantitySold: 0,
        salesStart: new Date().toISOString(),
        salesEnd: inDays(13),
      },
    ],
  };

  return [ithaka, talentFinale, bungeSummit, ndeiyaTalentSearch];
}
