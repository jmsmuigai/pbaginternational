# Security notes

## Dependency vulnerabilities (as of this build)

`npm audit` reports vulnerabilities in two places. Neither blocks local
development or the demo/simulation flow, but both should be resolved before
production traffic:

1. **Next.js (13 advisories, several high-severity).** The fixed version is
   `next@16.x`, a breaking major upgrade from the `14.2.x` used here (this
   project runs the latest patched `14.2.35`, which is current as of this
   build but still covered by advisories only fully closed in 16.x). Before
   going live: budget time for a Next 15→16 migration (App Router API
   changes, `next.config.js` option changes), test the full site against
   it, then upgrade `apps/web/package.json`.
2. **`uuid` (moderate, transitive via `firebase-admin` → `google-gax` →
   `gaxios`/`teeny-request`).** This project's own code doesn't import
   `uuid` at all (ticket/order/seller IDs use Node's built-in
   `crypto.randomUUID()` — see `apps/api/src/lib/tickets.ts`). The
   vulnerable copy is pulled in by Google's own SDK dependency tree; it
   will resolve automatically as Google publishes updated `firebase-admin`
   releases. Run `npm outdated firebase-admin` periodically and bump it.

Run `npm audit` yourself before each deploy to catch anything new.

## Ticket code security (Section 6.9)

Ticket codes are generated with `crypto.randomBytes` (not `Math.random()`),
drawn from a 31-character alphabet that excludes visually ambiguous
characters (`0/O`, `1/I/L`) — see `generateTicketCode()` in
`apps/api/src/lib/tickets.ts`. A ticket's QR code encodes `{ code, eventId,
orderId }`, but the QR payload is never trusted as proof of validity by
itself: `/api/tickets/verify` always re-checks the code against the live
database and atomically marks it used, so a screenshotted or forwarded
ticket that's already been scanned is rejected, not silently re-admitted.

## Payment data

No card numbers, bank details, or M-Pesa PINs are ever handled, stored, or
logged by this codebase — M-Pesa payments are authorized entirely on the
buyer's own phone via Safaricom's STK push prompt, and the card/PayPal
payment methods are designed to hand off to a PCI-compliant hosted checkout
(Stripe/PayPal) rather than collect card data directly. Keep it that way:
never add a raw card-number input field to this app.

## Secrets

`apps/api/.env` and `apps/web/.env.local` are gitignored. `.env.example`
files contain only placeholder values. Before deploying, put real secrets
(Daraja consumer secret, Firebase service-account key, Stripe/PayPal keys,
SendGrid key) in your platform's secret manager (Google Secret Manager on
Cloud Run) — never in plain environment variables in source control or CI
logs.
