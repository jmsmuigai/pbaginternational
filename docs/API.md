# API Reference

Base URL: `http://localhost:4000/api` in development
(`NEXT_PUBLIC_API_URL` in `apps/web/.env.local` points the frontend at it).
All request/response bodies are JSON. All endpoints are CORS-enabled for
`CORS_ORIGIN` (defaults to `http://localhost:3000`).

## Health

`GET /api/health` → `{ ok, dbDriver, mpesaMode, time }`

## Events

| Method | Path | Description |
|---|---|---|
| GET | `/api/events` | List all events |
| GET | `/api/events/:idOrSlug` | Get one event by id or slug |

## Orders / checkout

| Method | Path | Description |
|---|---|---|
| POST | `/api/orders/checkout` | Create an order and pay. Body: `{ eventId, buyerName, buyerEmail, buyerPhone, items: [{ ticketTierId, quantity }], paymentMethod, sellerCode?, channel? }`. For `paymentMethod: "mpesa"`, returns `202 { order (status: processing), stkPush }` — poll the order until `status: "paid"`. For other methods, settles immediately and returns `201 { order (status: paid), tickets }`. |
| GET | `/api/orders/:id` | Poll order status |

## M-Pesa Daraja callback

| Method | Path | Description |
|---|---|---|
| POST | `/api/mpesa/callback` | Safaricom posts the STK Push result here. Matches the order by `CheckoutRequestID`, settles it on `ResultCode: 0`, marks it `failed` otherwise. Configure this URL as `MPESA_CALLBACK_URL` (must be a public HTTPS URL — use ngrok for local sandbox testing). |

## Tickets

| Method | Path | Description |
|---|---|---|
| GET | `/api/tickets/order/:orderId` | Get all issued tickets (with QR data URLs) for a paid order |
| POST | `/api/tickets/verify` | Gate scan. Body: `{ code, scannedBy }`. Marks a valid ticket `used`; a second scan of the same code returns `{ valid: false, reason: "already_used", usedAt, scannedBy }` instead of silently succeeding. |
| GET | `/api/tickets/event/:eventId/live` | `{ sold, scanned, remaining }` — live attendance counter |

## Sellers (salespeople / influencers)

| Method | Path | Description |
|---|---|---|
| POST | `/api/sellers/apply` | Body: `{ eventId, name }`. Returns a unique `code`, a `trackableLink`, and a `qrValue` to encode as a QR poster. |
| GET | `/api/sellers/:id` | Seller info + live performance: tickets sold, revenue, commission earned/paid/pending |
| PATCH | `/api/sellers/:id` | Update seller (e.g. approve/reject, override commission rate) |

## Point of sale

| Method | Path | Description |
|---|---|---|
| POST | `/api/pos/sell` | Body: `{ eventId, ticketTierId, quantity, buyerName, buyerPhone, paymentMethod: "cash" \| "pos_mpesa", doorStaffId }`. Cash settles instantly and returns tickets immediately; `pos_mpesa` sends an STK push and returns `202` for polling, same as online checkout. |

## Admin / producer dashboard

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/dashboard/:eventId` | Ticket sold/scanned/remaining counts, revenue, platform fees, commission owed, net-to-producer, revenue broken down by channel (`direct/code/link/qr/pos`), and a seller leaderboard. |

## Chatbot

| Method | Path | Description |
|---|---|---|
| POST | `/api/chatbot` | Body: `{ messages: [{ role: "user"\|"assistant", content }] }`. Returns `{ reply, mode: "offline"\|"claude" }`. |

## Contact

| Method | Path | Description |
|---|---|---|
| POST | `/api/contact` | Body: `{ name, email, message }`. Used by both the Contact page and each subsidiary's "Join" form. |

---

## Sample end-to-end run (`npm run simulate:ticket-flow`)

This is real output from running the simulation against the live API — not
hand-written:

```
1. Seed events
Seeded 3 events:
  • PBAG Bunge Youth Leadership Summit — Online (Livestream) + Nairobi Hub
  • Ithaka cia Kamĩrĩĩthũ — Kenya National Theatre, Nairobi
  • Peers Got Talent — Season Finale — PBAG Grounds, Nairobi

2. Recruit a salesperson and get their trackable code
Seller created: Jane Wanjiru — code JANEW43
Trackable link: /tickets/ithaka-cia-kamiriithu?ref=JANEW43

3. Buyer checks out ONLINE using Jane's code, pays via M-Pesa STK push
Order ord_98d3fc9d… created — status: processing
STK push sent to buyer's phone. CheckoutRequestID: ws_CO_mock_1787560018244
✅ Payment confirmed. M-Pesa receipt: MOCK610952425
   Subtotal KES 2400 + platform fee KES 120 = total KES 2520
   Seller commission: KES 240 at 10%

4. Tickets auto-generated after payment
  • PBAG-5PDW-AE53-CMHC  (Regular, holder: Peter Otieno, status: valid)
  • PBAG-572M-2VUE-TUXZ  (Regular, holder: Peter Otieno, status: valid)

5. Point-of-sale: door staff sells 1 VIP ticket for cash at the venue
POS sale settled instantly (cash): ticket PBAG-VRQ2-EQTZ-UJ6Z

6. Gate verification: scan a valid ticket, then try to reuse it
First scan  -> valid: true (status now: used)
Second scan -> valid: false, reason: already_used — duplicate correctly rejected ✅

7. Live producer dashboard
Tickets sold: 3 / 450 capacity | Tickets scanned at gate: 1
Revenue: KES 4900 | Commission owed to sellers: KES 240 | Net to producer: KES 4660
Revenue by channel: { direct: 0, code: 2400, link: 0, qr: 0, pos: 2500 }

8. Chatbot sanity check
Bot (offline mode): We accept M-Pesa (STK push to your phone), Airtel Money,
cards, and PayPal. For M-Pesa, enter your phone number at checkout and
approve the payment prompt — your ticket is generated the moment payment
is confirmed.

✅ SIMULATION PASSED — full ticketing + M-Pesa + POS + verification flow works end-to-end.
```

This same flow was also driven through the real browser UI (not just the
API) during development — tier selection → buyer details → M-Pesa payment
method → "Payment confirmed" screen with two scannable QR tickets — with no
errors in either the frontend or backend logs.
