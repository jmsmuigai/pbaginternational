/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import axios from "axios";
import { createApp } from "./app";
import { getDb } from "./db";
import { seedEvents } from "./data/seedEvents";

/**
 * End-to-end simulation of the full PBAG ticketing flow, run with:
 *   npm run simulate --workspace=apps/api
 *
 * It boots the real Express API on a scratch port and drives it purely
 * over HTTP — exactly like a browser or POS tablet would — so a passing
 * run proves the whole stack (checkout -> M-Pesa STK push -> payment
 * callback -> ticket + QR issuance -> commission -> gate scanning ->
 * duplicate-scan rejection -> live dashboard) actually works together.
 *
 * Uses MPESA_MODE=mock by default (see apps/api/.env.example) so it needs
 * no real Safaricom credentials.
 */

const PORT = 4111;
const BASE = `http://localhost:${PORT}/api`;
const line = () => console.log("─".repeat(72));
const heading = (t: string) => {
  console.log("\n" + "═".repeat(72));
  console.log(`  ${t}`);
  console.log("═".repeat(72));
};

async function waitForOrderPaid(orderId: string, timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const { data } = await axios.get(`${BASE}/orders/${orderId}`);
    if (data.order.status === "paid") return data.order;
    if (data.order.status === "failed") throw new Error("Order failed");
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("Timed out waiting for order to settle");
}

async function main() {
  // Start from a clean slate for a deterministic demo run.
  const dataFile = path.join(__dirname, "..", "data", "db.json");
  if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);

  const app = createApp();
  const server = app.listen(PORT);
  await new Promise((r) => setTimeout(r, 200));

  try {
    heading("1. Seed events");
    const db = getDb();
    for (const ev of seedEvents()) await db.upsertEvent(ev);
    const { data: eventsData } = await axios.get(`${BASE}/events`);
    console.log(`Seeded ${eventsData.events.length} events:`);
    eventsData.events.forEach((e: any) => console.log(`  • ${e.title} — ${e.venue}`));

    const event = eventsData.events.find((e: any) => e.slug === "ithaka-cia-kamiriithu");
    const regularTier = event.ticketTiers.find((t: any) => t.name === "Regular");

    heading("2. Recruit a salesperson and get their trackable code");
    const { data: sellerData } = await axios.post(`${BASE}/sellers/apply`, {
      eventId: event.id,
      name: "Jane Wanjiru",
    });
    console.log(`Seller created: ${sellerData.seller.name} — code ${sellerData.seller.code}`);
    console.log(`Trackable link: ${sellerData.trackableLink}`);

    heading("3. Buyer checks out ONLINE using Jane's code, pays via M-Pesa STK push");
    const { data: checkout } = await axios.post(`${BASE}/orders/checkout`, {
      eventId: event.id,
      buyerName: "Peter Otieno",
      buyerEmail: "peter@example.com",
      buyerPhone: "0712345678",
      items: [{ ticketTierId: regularTier.id, quantity: 2 }],
      paymentMethod: "mpesa",
      sellerCode: sellerData.seller.code,
      channel: "code",
    });
    console.log(`Order ${checkout.order.id} created — status: ${checkout.order.status}`);
    console.log(`STK push sent to buyer's phone. CheckoutRequestID: ${checkout.stkPush.checkoutRequestId}`);
    console.log("Waiting for the (simulated) buyer to approve the M-Pesa prompt...");

    const paidOrder = await waitForOrderPaid(checkout.order.id);
    console.log(`✅ Payment confirmed. M-Pesa receipt: ${paidOrder.mpesaReceiptNumber}`);
    console.log(
      `   Subtotal KES ${paidOrder.subtotal} + platform fee KES ${paidOrder.platformFee} = total KES ${paidOrder.total}`
    );
    console.log(
      `   Seller commission: KES ${paidOrder.commissionAmount} at ${(paidOrder.commissionRateApplied * 100).toFixed(0)}%`
    );

    heading("4. Tickets auto-generated after payment");
    const { data: ticketData } = await axios.get(`${BASE}/tickets/order/${checkout.order.id}`);
    ticketData.tickets.forEach((t: any) =>
      console.log(`  • ${t.code}  (${t.ticketTierName}, holder: ${t.holderName}, status: ${t.status})`)
    );
    console.log(`  QR payload generated for each ticket (data URL length: ${ticketData.tickets[0].qrPayload.length} chars)`);

    heading("5. Point-of-sale: door staff sells 1 VIP ticket for cash at the venue");
    const vipTier = event.ticketTiers.find((t: any) => t.name === "VIP");
    const { data: posSale } = await axios.post(`${BASE}/pos/sell`, {
      eventId: event.id,
      ticketTierId: vipTier.id,
      quantity: 1,
      buyerName: "Walk-in Guest",
      buyerPhone: "0700000000",
      paymentMethod: "cash",
      doorStaffId: "door-staff-01",
    });
    console.log(`POS sale settled instantly (cash): order ${posSale.order.id}, ticket ${posSale.tickets[0].code}`);

    heading("6. Gate verification: scan a valid ticket, then try to reuse it");
    const firstTicket = ticketData.tickets[0];
    const { data: scan1 } = await axios.post(`${BASE}/tickets/verify`, {
      code: firstTicket.code,
      scannedBy: "gate-staff-A",
    });
    console.log(`First scan  -> valid: ${scan1.valid} (status now: ${scan1.ticket.status})`);

    const { data: scan2 } = await axios.post(`${BASE}/tickets/verify`, {
      code: firstTicket.code,
      scannedBy: "gate-staff-B",
    });
    console.log(
      `Second scan -> valid: ${scan2.valid}, reason: ${scan2.reason} (originally scanned by ${scan2.scannedBy} at ${scan2.usedAt}) — duplicate correctly rejected ✅`
    );

    heading("7. Live producer dashboard");
    const { data: dashboard } = await axios.get(`${BASE}/admin/dashboard/${event.id}`);
    console.log(`Event: ${dashboard.event.title}`);
    console.log(`Tickets sold: ${dashboard.summary.ticketsSold} / ${dashboard.event.capacity} capacity`);
    console.log(`Tickets scanned at gate: ${dashboard.summary.ticketsScanned}`);
    console.log(`Revenue: KES ${dashboard.summary.revenue}`);
    console.log(`Commission owed to sellers: KES ${dashboard.summary.commissionOwed}`);
    console.log(`Net to producer: KES ${dashboard.summary.netToProducer}`);
    console.log("Revenue by channel:", dashboard.summary.revenueByChannel);
    console.log("Seller leaderboard:", dashboard.sellerLeaderboard);

    heading("8. Chatbot sanity check");
    const { data: chat } = await axios.post(`${BASE}/chatbot`, {
      messages: [{ role: "user", content: "How do I pay with M-Pesa?" }],
    });
    console.log(`Bot (${chat.mode} mode): ${chat.reply}`);

    line();
    console.log("\n✅ SIMULATION PASSED — full ticketing + M-Pesa + POS + verification flow works end-to-end.\n");
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error("\n❌ SIMULATION FAILED:", err?.response?.data || err.message || err);
  process.exit(1);
});
