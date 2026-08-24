import admin from "firebase-admin";
import type {
  EventRecord,
  Order,
  IssuedTicket,
  Seller,
  CommissionLedgerEntry,
} from "@pbag/shared";
import type { DbAdapter } from "./types";
import { env } from "../config/env";

/**
 * Production database adapter — Firebase Firestore via firebase-admin.
 * Activated by setting DB_DRIVER=firestore and supplying either
 * FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.
 *
 * Firestore collections used:
 *   events, orders, tickets, sellers, commissions
 *
 * See docs/ARCHITECTURE.md for the full schema and docs/DEPLOYMENT.md for
 * setup steps (creating the project, enabling Firestore, generating a
 * service-account key, and deploying the security rules in
 * firebase/firestore.rules).
 */

function initFirebase() {
  if (admin.apps.length) return;

  if (env.firebaseServiceAccountJson) {
    const creds = JSON.parse(env.firebaseServiceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(creds),
      projectId: env.firebaseProjectId || creds.project_id,
    });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS or Google Cloud's
    // Application Default Credentials (e.g. when running on Cloud Run).
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: env.firebaseProjectId || undefined,
    });
  }
}

export class FirestoreDbAdapter implements DbAdapter {
  private db: admin.firestore.Firestore;

  constructor() {
    initFirebase();
    this.db = admin.firestore();
  }

  private col(name: string) {
    return this.db.collection(name);
  }

  async listEvents() {
    const snap = await this.col("events").orderBy("startAt", "asc").get();
    return snap.docs.map((d) => d.data() as EventRecord);
  }
  async getEvent(id: string) {
    const doc = await this.col("events").doc(id).get();
    return doc.exists ? (doc.data() as EventRecord) : null;
  }
  async getEventBySlug(slug: string) {
    const snap = await this.col("events").where("slug", "==", slug).limit(1).get();
    return snap.empty ? null : (snap.docs[0].data() as EventRecord);
  }
  async upsertEvent(event: EventRecord) {
    await this.col("events").doc(event.id).set(event, { merge: true });
  }
  async incrementTierSold(eventId: string, tierId: string, qty: number) {
    await this.db.runTransaction(async (tx) => {
      const ref = this.col("events").doc(eventId);
      const snap = await tx.get(ref);
      if (!snap.exists) return;
      const ev = snap.data() as EventRecord;
      const tier = ev.ticketTiers.find((t) => t.id === tierId);
      if (tier) tier.quantitySold += qty;
      tx.set(ref, ev, { merge: true });
    });
  }

  async createOrder(order: Order) {
    await this.col("orders").doc(order.id).set(order);
  }
  async getOrder(id: string) {
    const doc = await this.col("orders").doc(id).get();
    return doc.exists ? (doc.data() as Order) : null;
  }
  async updateOrder(id: string, patch: Partial<Order>) {
    const ref = this.col("orders").doc(id);
    await ref.set({ ...patch, updatedAt: new Date().toISOString() }, { merge: true });
    const doc = await ref.get();
    return doc.exists ? (doc.data() as Order) : null;
  }
  async listOrdersByEvent(eventId: string) {
    const snap = await this.col("orders").where("eventId", "==", eventId).get();
    return snap.docs.map((d) => d.data() as Order);
  }
  async listOrdersBySeller(sellerId: string) {
    const snap = await this.col("orders").where("sellerId", "==", sellerId).get();
    return snap.docs.map((d) => d.data() as Order);
  }

  async createTickets(tickets: IssuedTicket[]) {
    const batch = this.db.batch();
    for (const t of tickets) batch.set(this.col("tickets").doc(t.code), t);
    await batch.commit();
  }
  async getTicket(code: string) {
    const doc = await this.col("tickets").doc(code).get();
    return doc.exists ? (doc.data() as IssuedTicket) : null;
  }
  async listTicketsByOrder(orderId: string) {
    const snap = await this.col("tickets").where("orderId", "==", orderId).get();
    return snap.docs.map((d) => d.data() as IssuedTicket);
  }
  async listTicketsByEvent(eventId: string) {
    const snap = await this.col("tickets").where("eventId", "==", eventId).get();
    return snap.docs.map((d) => d.data() as IssuedTicket);
  }
  async markTicketUsed(code: string, scannedBy: string) {
    const ref = this.col("tickets").doc(code);
    const doc = await ref.get();
    if (!doc.exists) return null;
    const ticket = doc.data() as IssuedTicket;
    if (ticket.status === "used") return ticket;
    const updated: IssuedTicket = {
      ...ticket,
      status: "used",
      usedAt: new Date().toISOString(),
      scannedBy,
    };
    await ref.set(updated, { merge: true });
    return updated;
  }

  async createSeller(seller: Seller) {
    await this.col("sellers").doc(seller.id).set(seller);
  }
  async getSeller(id: string) {
    const doc = await this.col("sellers").doc(id).get();
    return doc.exists ? (doc.data() as Seller) : null;
  }
  async getSellerByCode(eventId: string, code: string) {
    const snap = await this.col("sellers")
      .where("eventId", "==", eventId)
      .where("code", "==", code)
      .limit(1)
      .get();
    return snap.empty ? null : (snap.docs[0].data() as Seller);
  }
  async listSellersByEvent(eventId: string) {
    const snap = await this.col("sellers").where("eventId", "==", eventId).get();
    return snap.docs.map((d) => d.data() as Seller);
  }
  async updateSeller(id: string, patch: Partial<Seller>) {
    const ref = this.col("sellers").doc(id);
    await ref.set(patch, { merge: true });
    const doc = await ref.get();
    return doc.exists ? (doc.data() as Seller) : null;
  }

  async addCommissionEntry(entry: CommissionLedgerEntry) {
    await this.col("commissions").doc(entry.id).set(entry);
  }
  async listCommissionsBySeller(sellerId: string) {
    const snap = await this.col("commissions").where("sellerId", "==", sellerId).get();
    return snap.docs.map((d) => d.data() as CommissionLedgerEntry);
  }
}
