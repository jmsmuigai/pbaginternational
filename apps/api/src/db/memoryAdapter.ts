import fs from "fs";
import path from "path";
import type {
  EventRecord,
  Order,
  IssuedTicket,
  Seller,
  CommissionLedgerEntry,
} from "@pbag/shared";
import type { DbAdapter } from "./types";

/**
 * Lightweight JSON-file-backed database used when DB_DRIVER=memory
 * (the default). It requires zero credentials, so `npm run simulate` and
 * local development work immediately out of the box. Swap DB_DRIVER to
 * "firestore" for production — every route talks to the DbAdapter
 * interface, not to this file directly.
 */

interface Shape {
  events: Record<string, EventRecord>;
  orders: Record<string, Order>;
  tickets: Record<string, IssuedTicket>;
  sellers: Record<string, Seller>;
  commissions: CommissionLedgerEntry[];
}

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

function empty(): Shape {
  return { events: {}, orders: {}, tickets: {}, sellers: {}, commissions: [] };
}

function load(): Shape {
  try {
    if (!fs.existsSync(DATA_FILE)) return empty();
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Shape;
  } catch {
    return empty();
  }
}

function save(shape: Shape) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(shape, null, 2));
}

let state = load();

export class MemoryDbAdapter implements DbAdapter {
  async listEvents() {
    return Object.values(state.events).sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
  }
  async getEvent(id: string) {
    return state.events[id] || null;
  }
  async getEventBySlug(slug: string) {
    return Object.values(state.events).find((e) => e.slug === slug) || null;
  }
  async upsertEvent(event: EventRecord) {
    state.events[event.id] = event;
    save(state);
  }
  async incrementTierSold(eventId: string, tierId: string, qty: number) {
    const ev = state.events[eventId];
    if (!ev) return;
    const tier = ev.ticketTiers.find((t) => t.id === tierId);
    if (tier) tier.quantitySold += qty;
    save(state);
  }

  async createOrder(order: Order) {
    state.orders[order.id] = order;
    save(state);
  }
  async getOrder(id: string) {
    return state.orders[id] || null;
  }
  async updateOrder(id: string, patch: Partial<Order>) {
    const existing = state.orders[id];
    if (!existing) return null;
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    state.orders[id] = updated;
    save(state);
    return updated;
  }
  async listOrdersByEvent(eventId: string) {
    return Object.values(state.orders).filter((o) => o.eventId === eventId);
  }
  async listOrdersBySeller(sellerId: string) {
    return Object.values(state.orders).filter((o) => o.sellerId === sellerId);
  }

  async createTickets(tickets: IssuedTicket[]) {
    for (const t of tickets) state.tickets[t.code] = t;
    save(state);
  }
  async getTicket(code: string) {
    return state.tickets[code] || null;
  }
  async listTicketsByOrder(orderId: string) {
    return Object.values(state.tickets).filter((t) => t.orderId === orderId);
  }
  async listTicketsByEvent(eventId: string) {
    return Object.values(state.tickets).filter((t) => t.eventId === eventId);
  }
  async markTicketUsed(code: string, scannedBy: string) {
    const t = state.tickets[code];
    if (!t) return null;
    if (t.status === "used") return t; // idempotent read for duplicate-scan detection upstream
    t.status = "used";
    t.usedAt = new Date().toISOString();
    t.scannedBy = scannedBy;
    save(state);
    return t;
  }

  async createSeller(seller: Seller) {
    state.sellers[seller.id] = seller;
    save(state);
  }
  async getSeller(id: string) {
    return state.sellers[id] || null;
  }
  async getSellerByCode(eventId: string, code: string) {
    return (
      Object.values(state.sellers).find(
        (s) => s.eventId === eventId && s.code.toLowerCase() === code.toLowerCase()
      ) || null
    );
  }
  async listSellersByEvent(eventId: string) {
    return Object.values(state.sellers).filter((s) => s.eventId === eventId);
  }
  async updateSeller(id: string, patch: Partial<Seller>) {
    const existing = state.sellers[id];
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    state.sellers[id] = updated;
    save(state);
    return updated;
  }

  async addCommissionEntry(entry: CommissionLedgerEntry) {
    state.commissions.push(entry);
    save(state);
  }
  async listCommissionsBySeller(sellerId: string) {
    return state.commissions.filter((c) => c.sellerId === sellerId);
  }
}

export function resetMemoryDb() {
  state = empty();
  save(state);
}
