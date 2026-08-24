import type {
  EventRecord,
  Order,
  IssuedTicket,
  Seller,
  CommissionLedgerEntry,
} from "@pbag/shared";

/**
 * Storage-agnostic data access interface. `MemoryDbAdapter` (JSON-file backed)
 * and `FirestoreDbAdapter` both implement this so every route in src/routes
 * works identically no matter which database is active (see DB_DRIVER).
 */
export interface DbAdapter {
  listEvents(): Promise<EventRecord[]>;
  getEvent(id: string): Promise<EventRecord | null>;
  getEventBySlug(slug: string): Promise<EventRecord | null>;
  upsertEvent(event: EventRecord): Promise<void>;
  incrementTierSold(eventId: string, tierId: string, qty: number): Promise<void>;

  createOrder(order: Order): Promise<void>;
  getOrder(id: string): Promise<Order | null>;
  updateOrder(id: string, patch: Partial<Order>): Promise<Order | null>;
  listOrdersByEvent(eventId: string): Promise<Order[]>;
  listOrdersBySeller(sellerId: string): Promise<Order[]>;

  createTickets(tickets: IssuedTicket[]): Promise<void>;
  getTicket(code: string): Promise<IssuedTicket | null>;
  listTicketsByOrder(orderId: string): Promise<IssuedTicket[]>;
  listTicketsByEvent(eventId: string): Promise<IssuedTicket[]>;
  markTicketUsed(code: string, scannedBy: string): Promise<IssuedTicket | null>;

  createSeller(seller: Seller): Promise<void>;
  getSeller(id: string): Promise<Seller | null>;
  getSellerByCode(eventId: string, code: string): Promise<Seller | null>;
  listSellersByEvent(eventId: string): Promise<Seller[]>;
  updateSeller(id: string, patch: Partial<Seller>): Promise<Seller | null>;

  addCommissionEntry(entry: CommissionLedgerEntry): Promise<void>;
  listCommissionsBySeller(sellerId: string): Promise<CommissionLedgerEntry[]>;
}
