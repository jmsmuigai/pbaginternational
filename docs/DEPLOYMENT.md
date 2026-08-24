# Deployment Guide

Your stated plan: host on **GitHub** for now (private, until PBAG approves),
then move to **Google Cloud**. This guide covers both, plus activating
Firebase and going live on M-Pesa Daraja.

## 1. Push this code to GitHub

This project could not create the GitHub repo or push directly — there was
no GitHub account connected to the session that built it. The repo has
already been initialized locally with git and an initial commit. From your
machine:

```bash
cd pbaginternational-website
gh repo create pbaginternational-website --private --source=. --remote=origin
# or, without the GitHub CLI:
#   1. Create an empty private repo named pbaginternational-website on github.com
#   2. git remote add origin https://github.com/<your-username>/pbaginternational-website.git
git push -u origin main
```

Keep it **private** until PBAG has approved the site publicly — the repo
currently contains placeholder copy and no real secrets (`.env` files are
gitignored), but there's no reason to make an unapproved site public.

## 2. Activate Firebase (production database)

1. Go to https://console.firebase.google.com → **Add project** → name it
   (e.g. `pbaginternational-prod`).
2. **Build → Firestore Database → Create database** → start in production
   mode → pick a region close to your users (e.g. `europe-west1` or
   `asia-south1` — check current Firestore region options for the lowest
   latency to Kenya).
3. Deploy the security rules already in this repo:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add            # select your new project
   cd firebase && firebase deploy --only firestore:rules,firestore:indexes
   ```
4. **Project settings → Service accounts → Generate new private key** —
   downloads a JSON file. Do **not** commit it.
5. In `apps/api/.env` (production environment / secret manager), set either:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = the full JSON contents (single line), or
   - `GOOGLE_APPLICATION_CREDENTIALS` = path to the JSON file (or rely on
     Application Default Credentials automatically when running on Cloud Run
     in the same GCP project — no key file needed there).
6. Set `DB_DRIVER=firestore` and `FIREBASE_PROJECT_ID=<your-project-id>`.
7. Re-run `npm run seed --workspace=apps/api` once against production to
   load starter events (or create them via the producer flow instead).

## 3. Go live on M-Pesa Daraja

1. Register at https://developer.safaricom.co.ke and create an app to get
   **sandbox** consumer key/secret immediately.
2. Test against sandbox first: set `MPESA_MODE=sandbox`,
   `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET` from your Daraja app, and
   deploy the API somewhere with a public HTTPS URL (Daraja cannot call back
   to `localhost`) — set `MPESA_CALLBACK_URL` to
   `https://<your-api-domain>/api/mpesa/callback`. For local sandbox testing
   before deploying, tunnel with `ngrok http 4000` and use the ngrok URL.
3. For **production** payments: apply for Daraja go-live with your real
   Paybill/Till number (Safaricom reviews this — budget a few business
   days), then set `MPESA_MODE=live`, your production
   `MPESA_SHORTCODE`/`MPESA_PASSKEY`, and point `MPESA_CALLBACK_URL` at your
   production API.
4. Nothing else changes — the same `stkPush()` code path is used in all
   three modes (see `docs/ARCHITECTURE.md`).

## 4. Deploy to Google Cloud

Two services to deploy: `apps/api` (Express) and `apps/web` (Next.js).

### API → Cloud Run

```bash
cd apps/api
npm run build
gcloud run deploy pbag-api \
  --source . \
  --region <your-region> \
  --allow-unauthenticated \
  --set-env-vars DB_DRIVER=firestore,MPESA_MODE=sandbox,FIREBASE_PROJECT_ID=<project-id>,CORS_ORIGIN=https://pbaginternational.com
```

Add the M-Pesa and (if not using Application Default Credentials) Firebase
secrets via `gcloud run services update pbag-api --set-secrets=...` backed
by **Secret Manager** — don't pass real secrets as plain `--set-env-vars` in
production. Note the resulting `https://pbag-api-xxxxx.run.app` URL.

### Web → Cloud Run (or Firebase Hosting with a Cloud Run backend)

```bash
cd apps/web
# set NEXT_PUBLIC_API_URL to the Cloud Run API URL from above before building
gcloud run deploy pbag-web \
  --source . \
  --region <your-region> \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://pbag-api-xxxxx.run.app/api
```

Then map your domain: **Cloud Run → Manage Custom Domains** → add
`pbaginternational.com`, and update your DNS (A/AAAA or CNAME per Google's
instructions) at your domain registrar.

> Alternative for the frontend only: Next.js also deploys cleanly to
> **Vercel** (`vercel deploy`) if you'd rather not run it on Cloud Run — the
> API still runs on Cloud Run either way. Either is fine; Cloud Run keeps
> everything in one place under your Google Cloud billing.

### CI

`.github/workflows/ci.yml` installs dependencies, builds both apps, and runs
`npm run simulate:ticket-flow` on every push — treat a red CI run as a
signal not to deploy that commit.

## 5. Before this touches real users

- [ ] Replace every `[PLACEHOLDER]` / `TODO(PBAG)` string (search the repo)
      with real copy, contact details, and social handles.
- [ ] Replace generated images with real event photography / motion
      graphics — see `docs/GEMINI_ANTIGRAVITY_TASKS.md`.
- [ ] Read `docs/SECURITY.md` and patch the flagged dependencies.
- [ ] Switch `MPESA_MODE` to `sandbox` then `live` only after testing real
      payments end-to-end on sandbox.
- [ ] Wire a real email provider (`SENDGRID_API_KEY`) so ticket
      confirmations actually reach buyers' inboxes, not just the in-app
      QR display.
- [ ] Decide on real card/PayPal processors (Stripe keys are stubbed in
      `.env.example`) — the checkout UI already offers these methods, but
      `apps/api/src/routes/orders.ts` settles them immediately as a demo
      placeholder rather than redirecting to a real hosted checkout.
- [ ] Load-test around your actual on-sale traffic expectations (Section
      6.9 calls out traffic spikes specifically).
