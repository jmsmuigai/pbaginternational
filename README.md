# PBAG — Corporate Website & Ticketing Platform

The full source for **pbag.com**: a corporate/marketing site for PBAG
and its four subsidiaries, plus an integrated, point-of-sale-enabled event
ticketing platform with M-Pesa Daraja payments, seller/affiliate commission
tracking, and live gate verification.

Built from the PBAG website concept brief (Sections 1–7). Every functional
requirement in that brief has a working implementation here — see
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how each brief section maps
to code.

> **Status: demo-ready scaffold, not yet production-configured.** The whole
> stack runs and has been verified end-to-end (see "Proof it works" below),
> but it ships with placeholder copy, placeholder generated artwork, and
> `MPESA_MODE=mock` payments. Read [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
> before it touches real money or real users.

---

## What's in here

```
pbaginternational-website/
├── apps/
│   ├── web/     Next.js 14 (App Router, TypeScript, Tailwind) — the public site
│   └── api/     Express + TypeScript — REST API, M-Pesa Daraja, ticketing engine
├── packages/
│   └── shared/  Types & constants shared by both apps (brand, subsidiaries, models)
├── firebase/    Firestore security rules + config (production database)
├── scripts/
│   └── generate_images.py   Regenerates every placeholder image in apps/web/public/images
├── docs/        Architecture, API reference, deployment guide, Gemini/Antigravity handoff
└── .github/workflows/  CI: install, build, and run the ticket-flow simulation on every push
```

**Tech stack:** Next.js 14 + React 18 + TypeScript + Tailwind CSS on the
frontend; Node.js + Express + TypeScript on the backend; Firebase Firestore
as the production database (with a zero-config in-memory fallback for local
dev — see below); Safaricom M-Pesa Daraja for mobile-money payments.

## Why Firestore

Firestore was chosen (and is fully wired in `apps/api/src/db/firestoreAdapter.ts`)
because: it needs no server to manage (fits a Google Cloud / Cloud Run
deployment), its security-rules model cleanly matches "server writes, nobody
else touches this data" (see `firebase/firestore.rules`), it scales
automatically through the on-sale traffic spikes the brief calls out
(Section 6.9), and it has a generous free tier for a first launch. If you'd
rather run Postgres/Cloud SQL instead, the whole app talks to a `DbAdapter`
interface (`apps/api/src/db/types.ts`) — write one more adapter class and
flip `DB_DRIVER`, nothing else changes.

## Quick start (local development)

Requires Node.js ≥ 18.18 and Python 3 (only for regenerating images).

```bash
npm install                      # installs all three workspaces
npm run generate:images          # optional — images are already committed
npm run seed --workspace=apps/api   # loads 3 sample events, incl. Ithaka cia Kamĩrĩĩthũ
npm run dev:api                  # http://localhost:4000 — DB_DRIVER=memory, MPESA_MODE=mock
npm run dev:web                  # http://localhost:3000
```

Copy `apps/api/.env.example` → `apps/api/.env` and `apps/web/.env.local.example` →
`apps/web/.env.local` first if you want to override any defaults — the app
runs with zero configuration otherwise (in-memory database, mocked M-Pesa).

Open http://localhost:3000. The landing page carousel, About, Subsidiaries,
Tickets (browse → buy → pay → get a QR ticket), the point-of-sale screen
(`/tickets/pos`), the gate scanner (`/tickets/scan`), the producer dashboard
(`/tickets/producer`), and the chatbot are all live.

## Proof it works: the ticket-flow simulation

```bash
npm run simulate:ticket-flow
```

This boots the real API on a scratch port and drives it purely over HTTP —
seed events → recruit a seller and get their trackable code → buyer checks
out online with that code, pays via a simulated M-Pesa STK push → payment
confirms and two QR tickets are issued → a door-staff POS sale for cash
settles instantly → a gate-staff scan marks a ticket used, and a second scan
of the *same* ticket is correctly rejected as a duplicate → the live producer
dashboard shows revenue, commission owed, and a seller leaderboard → the
chatbot answers a payments question. All in one run, no manual steps. See a
sample run and screenshots of the same flow driven through the real browser
UI in [`docs/API.md`](docs/API.md).

This same command runs in CI on every push (`.github/workflows/ci.yml`).

## Payments

All four methods from Section 6.8 have working checkout UI and backend
handling: **M-Pesa** (real Safaricom Daraja STK Push integration, currently
pointed at a local mock — see below), **Airtel Money** (placeholder,
same code path as M-Pesa), **card**, and **PayPal** (placeholder settlement
paths ready for Stripe/PayPal SDKs — see `docs/API.md`). Point-of-sale
cash and POS M-Pesa sales are handled by `/tickets/pos`.

### M-Pesa Daraja — three modes, one code path

Controlled by `MPESA_MODE` in `apps/api/.env`:

| Mode | What happens |
|---|---|
| `mock` (default) | Fully simulated locally — no network call to Safaricom. This is how `npm run simulate:ticket-flow` and local dev work with zero credentials. |
| `sandbox` | Real calls to Safaricom's Daraja **sandbox**. Needs a free Daraja app (consumer key/secret) from https://developer.safaricom.co.ke — see `docs/DEPLOYMENT.md`. |
| `live` | Real calls to Daraja **production**, using your own Paybill/Till. Requires Safaricom go-live approval. |

The request/response shapes are identical across all three modes
(`apps/api/src/lib/daraja.ts`), so going from demo to real payments is an
environment-variable change, not a code change.

## What's placeholder vs. real

- **Real & working:** every page, the full ticketing engine, commission
  math, QR ticket generation, gate verification + duplicate-scan rejection,
  the POS flow, the producer dashboard, the chatbot, and the Daraja
  integration code.
- **Placeholder, marked inline:** PBAG's history/mission copy, leadership
  bios & photos, contact details, and social handles — all tagged
  `[PLACEHOLDER]` or `TODO(PBAG)` in the source so they're easy to find
  and replace with what PBAG supplies.
- **Generated, not photographed:** every image in `apps/web/public/images`
  is programmatically generated brand art (gradients, geometric shapes,
  typography — see `scripts/generate_images.py`), not real event
  photography. Swap in real photos/motion graphics before launch — see
  [`docs/GEMINI_ANTIGRAVITY_TASKS.md`](docs/GEMINI_ANTIGRAVITY_TASKS.md).

## Deploying

You have successfully deployed the frontend (`apps/web`) to **Vercel**. For the backend API (`apps/api`), **Google Cloud Run** or **Render** are recommended targets. Full step-by-step instructions — including how to connect Vercel to your API — are in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Further reading

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the brief's Sections 1–7 map to code, data model, and design decisions.
- [`docs/API.md`](docs/API.md) — every REST endpoint, request/response shapes, and the simulation transcript.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — GitHub, Firebase, Daraja go-live, and Google Cloud deployment.
- [`docs/GEMINI_ANTIGRAVITY_TASKS.md`](docs/GEMINI_ANTIGRAVITY_TASKS.md) — a ready-to-paste brief for handing the remaining creative/manual work (real photography, motion graphics, brand copy, account creation) to Gemini via Antigravity, or to a human designer.
- [`docs/SECURITY.md`](docs/SECURITY.md) — known-vulnerability status and what to patch before go-live.
