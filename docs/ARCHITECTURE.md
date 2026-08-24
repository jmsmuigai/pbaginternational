# Architecture

## How the brief maps to code

| Brief section | Implementation |
|---|---|
| 2. Site map & nav | `apps/web/src/components/NavBar.tsx`, `packages/shared/src/constants.ts` (`NAV_ITEMS`) |
| 3. Landing page motion-graphics showcase | `apps/web/src/components/EventCarousel.tsx` — auto-rotating, swipeable, CSS/transform-driven (no video weight), links straight into the Tickets flow per event |
| 4. About Us | `apps/web/src/app/about/page.tsx` |
| 5. Subsidiaries (dropdown + 4 template pages) | `apps/web/src/app/subsidiaries/*`, subsidiary data in `packages/shared/src/constants.ts` (`SUBSIDIARIES`) — same template, per-subsidiary content, independent "Join" CTA (form or WhatsApp) |
| 6. Tickets (POS-enabled platform) | `apps/api/src/routes/*` + `apps/web/src/app/tickets/*` — see the table below |
| 7. Contact Us | `apps/web/src/app/contact/page.tsx`, `apps/api/src/routes/contact.ts` |

### Section 6 (Tickets) in detail

| Brief requirement | Code |
|---|---|
| 6.3 Event producer tools | `routes/events.ts`, `routes/admin.ts`, `/tickets/producer` dashboard |
| 6.4 Point-of-sale (in-person) | `routes/pos.ts`, `/tickets/pos` — same inventory as online sales via the shared `DbAdapter` |
| 6.5 Sales/affiliate tracking, commission | `routes/sellers.ts`, `lib/settlement.ts` (`calculateCommission`), `/tickets/[slug]` "Sell tickets" panel |
| 6.6 Buyer experience | `components/CheckoutFlow.tsx` |
| 6.7 Entry & live verification | `routes/tickets.ts` (`POST /tickets/verify`), `/tickets/scan` |
| 6.8 Payments | `lib/daraja.ts` (M-Pesa), checkout payment-method selector (card/PayPal/Airtel placeholders), `routes/pos.ts` (cash + POS M-Pesa) |
| 6.9 Non-functional (security, scalability, auditability) | ticket codes are `crypto.randomBytes`-derived (`lib/tickets.ts`), Firestore scales automatically, every order/ticket/commission write is a timestamped, queryable record |

## Data model

Defined once in `packages/shared/src/types.ts` and used identically by both
apps (no duplicated/drifting shapes):

- **EventRecord** — an event, its ticket tiers (name, price, quantity,
  sales window), status, and default commission rate.
- **Order** — a purchase: items, buyer, payment method, status
  (`pending_payment → processing → paid`, or `failed`), channel
  (`direct | code | link | qr | pos`), and — if attributed — `sellerId` +
  `commissionAmount`.
- **IssuedTicket** — one physical/digital ticket: a unique code, a QR data
  URL, and a `valid | used | void` status. One `IssuedTicket` is created
  per unit purchased (buying 2 "Regular" tickets creates 2 separate
  `IssuedTicket` records, each independently scannable).
- **Seller** — a salesperson/influencer, their event-scoped promo code, and
  optional commission-rate override.
- **CommissionLedgerEntry** — one row per paid, seller-attributed order;
  sums into each seller's "commission earned" on the dashboards.

## Request flow: online purchase → M-Pesa → ticket

```
Buyer                Web (Next.js)         API (Express)              Daraja / mock
  |  picks tickets        |                      |                          |
  |----------------------->                      |                          |
  |  enters details, pays |                      |                          |
  |----------------------->  POST /orders/checkout|                          |
  |                        |--------------------->|  create Order (pending)  |
  |                        |                      |  stkPush() -------------->
  |                        |<--- 202 processing ---|<--- checkoutRequestId ---
  |  "check your phone"   |                      |                          |
  |                        |  poll GET /orders/:id|                          |
  |                        |--------------------->|                          |
  |                        |                      |  (mock: auto-settle      |
  |                        |                      |   after ~2.5s   OR       |
  |                        |                      |   real: Safaricom POSTs  |
  |                        |                      |   /mpesa/callback)       |
  |                        |                      |  settleOrderPaid():      |
  |                        |                      |   - mark order paid      |
  |                        |                      |   - bump tier inventory  |
  |                        |                      |   - record commission    |
  |                        |                      |   - issue N tickets+QR   |
  |                        |<---- order: paid -----|                          |
  |                        |  GET /tickets/order/:id                         |
  |  sees QR ticket(s)    |<---------------------|                          |
```

The point-of-sale flow (`/pos/sell`) and the real Daraja callback
(`/mpesa/callback`) both call the exact same `settleOrderPaid()` function in
`apps/api/src/lib/settlement.ts` — there is one source of truth for "what
happens when an order is paid," not three copies of that logic.

## Database adapter pattern

`apps/api/src/db/types.ts` defines a `DbAdapter` interface. Every route
imports `getDb()` and never touches Firestore or the JSON file directly.
Two implementations exist today:

- `MemoryDbAdapter` (`DB_DRIVER=memory`, default) — a JSON-file-backed
  store (`apps/api/data/db.json`, gitignored). Zero credentials, used for
  local dev, CI, and `npm run simulate:ticket-flow`.
- `FirestoreDbAdapter` (`DB_DRIVER=firestore`) — Firebase Admin SDK,
  production-ready, activated by supplying a service account (see
  `docs/DEPLOYMENT.md`).

Adding Postgres/another store later means writing one more class against
the same interface — no route code changes.

## Frontend structure

- `apps/web/src/app/*` — Next.js App Router pages (server components by
  default; interactive pieces like the checkout flow, POS screen, scanner,
  and chatbot are client components).
- `apps/web/src/components/*` — shared UI (`NavBar`, `Footer`,
  `EventCarousel`, `CheckoutFlow`, `Chatbot`, etc.).
- `apps/web/src/lib/api.ts` — a thin typed fetch wrapper against
  `NEXT_PUBLIC_API_URL`; the frontend never talks to Firestore directly,
  only to the Express API.

## Chatbot

`apps/api/src/routes/chatbot.ts` implements a fast, offline, rule-based FAQ
engine by default (no API key, always available, grounded on live event
data). If `ANTHROPIC_API_KEY` is set, it upgrades to a full Claude-powered
assistant with the same grounding context (subsidiaries, on-sale events,
contact details, payment methods) passed as a system prompt.
