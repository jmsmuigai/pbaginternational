# Handoff brief: tasks for Gemini (via Google Antigravity)

Everything below is work this build could **not** do itself — either
because it requires real image/video generation tooling this environment
doesn't have, or because it requires signing into real accounts (GitHub,
Google Cloud, Safaricom, social media) on PBAG's behalf, which is
deliberately outside what an assistant should do unsupervised. Paste the
relevant section(s) into Antigravity/Gemini as a task brief — each is
self-contained.

The codebase is fully prepared for all of this: placeholders are marked
`[PLACEHOLDER]` or `TODO(PBAG)` and searchable, image paths follow a
predictable convention, and the API/frontend won't need structural changes
to receive real content — only file replacements and copy edits.

---

## 1. Real event & marketing imagery (replaces generated placeholders)

Every image in `apps/web/public/images/` is programmatically generated
brand art (gradients + shapes + typography via `scripts/generate_images.py`)
standing in for real photography. Ask Gemini to:

- Generate (or source from PBAG's real event photos/videos —
  https://web.facebook.com/Pbagconsortium was referenced as a source in the
  original brief) polished marketing images for each event and subsidiary,
  matching these exact filenames/dimensions so no code changes are needed:
  - `apps/web/public/images/events/ithaka-cia-kamiriithu.jpg` (1600×900)
  - `apps/web/public/images/events/peers-got-talent-finale.jpg` (1600×900)
  - `apps/web/public/images/events/pbag-bunge-summit.jpg` (1600×900)
  - `apps/web/public/images/subsidiaries/{pbag-theatre,peers-got-talent,peatice-production,pbag-bunge}.jpg` (1200×1500)
  - `apps/web/public/images/brand/logo.png` (640×640, transparent background) — PBAG's real logo, replacing the generated monogram
  - `apps/web/public/images/brand/favicon.png` (256×256)
  - `apps/web/public/images/brand/og-image.jpg` (1200×630, social share preview)
  - `apps/web/public/images/about/leader-{1..4}.jpg` (480×480) — real leadership headshots, once PBAG confirms which leaders should be public (see Section 2)
- Brand palette to match/complement (already in `packages/shared/src/constants.ts`):
  deep violet `#7C3AED`/`#5B21B6`, gold `#F5B400`, coral `#FB5D5D`, emerald
  `#22C55E`, on a near-black `#120B23` background.
- **Motion graphics for the landing page** (brief Section 3): the carousel
  in `apps/web/src/components/EventCarousel.tsx` currently animates static
  cover images with CSS. For true "motion-graphics-driven" event marketing
  per the brief, generate short (3–6s), optimized, loopable video or
  Lottie-style animations per event and swap them in — keep files small
  (target <1–2MB each) for the "fast load despite motion graphics" mobile
  requirement. If using video, `<video autoplay muted loop playsinline>`
  slots in cleanly in place of the current `<Image>` per-slide.

## 2. Real brand & organizational copy

Search the repo for `[PLACEHOLDER]` and `TODO(PBAG)` — every instance is
copy that needs PBAG's real input, mainly in:

- `packages/shared/src/constants.ts` — `BRAND.fullName` (confirm what PBAG
  stands for / the full legal name), `CONTACT` (real phone, email, address,
  confirmed social handles).
- `apps/web/src/app/about/page.tsx` — PBAG's real history, mission, track
  record numbers, and leadership bios (confirm with PBAG whether leadership
  should be public-facing at all before publishing names/photos).
- `packages/shared/src/constants.ts` `SUBSIDIARIES[].longDescription` —
  each subsidiary's real mission/description, currently reasonable
  best-guess copy inferred from the brief.
- `apps/web/src/app/subsidiaries/[slug]/join/page.tsx` /
  `SUBSIDIARIES[].joinTarget` — confirm real WhatsApp numbers for
  Peers Got Talent and PBAG Bunge (currently placeholder `254700000000`).

## 3. Accounts this build could not create

These require signing into real, PBAG-owned accounts — outside what an
unsupervised assistant should do. Gemini/Antigravity (or a person) should:

- **GitHub**: create the `pbaginternational-website` repository and push
  this code (exact commands in `docs/DEPLOYMENT.md` §1).
- **Google Cloud / Firebase**: create the production project, enable
  Firestore, generate a service-account key (`docs/DEPLOYMENT.md` §2).
- **Safaricom Daraja**: register a developer account, create sandbox and
  (after testing) production apps for M-Pesa (`docs/DEPLOYMENT.md` §3).
- **Domain**: point `pbaginternational.com` DNS at wherever the site ends
  up hosted (`docs/DEPLOYMENT.md` §4).
- **Stripe/PayPal**: create merchant accounts if card/PayPal payments
  should go live for real (currently placeholder settlement in
  `apps/api/src/routes/orders.ts`).

## 4. Nice-to-have engineering follow-ups

Lower priority than the above, but worth assigning if there's time:

- **Live camera QR scanning**: `/tickets/scan` currently uses manual code
  entry (fully functional, proven in the simulation) rather than reading a
  device camera. Wire in a QR-decoding library (e.g. `html5-qrcode` or
  `@zxing/browser`) so gate staff can point a phone camera at a ticket
  instead of typing the code — call the same `verify()` logic already in
  that page with the decoded string.
- **Next.js major-version upgrade**: see `docs/SECURITY.md` — several
  Next.js advisories are only fully resolved on `next@16.x`. Test that
  upgrade in a branch before applying it.
- **Real font loading**: `apps/web/src/app/layout.tsx` uses a system-font
  stack instead of `next/font/google` because Google Fonts isn't reachable
  from this build's sandboxed network. Once building somewhere with normal
  internet access, swap in real Poppins/Inter via `next/font/google` for a
  closer match to the intended display typography.
- **Email delivery**: wire `SENDGRID_API_KEY` (or your preferred provider)
  so ticket QR codes and order confirmations are actually emailed to
  buyers, not just shown in-app.
