import dotenv from "dotenv";
dotenv.config();

function bool(v: string | undefined, fallback: boolean) {
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",

  dbDriver: (process.env.DB_DRIVER || "memory") as "memory" | "firestore",

  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "",
  googleApplicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",

  mpesaMode: (process.env.MPESA_MODE || "mock") as "mock" | "sandbox" | "live",
  mpesaConsumerKey: process.env.MPESA_CONSUMER_KEY || "",
  mpesaConsumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
  mpesaShortcode: process.env.MPESA_SHORTCODE || "174379",
  mpesaPasskey: process.env.MPESA_PASSKEY || "",
  mpesaCallbackUrl: process.env.MPESA_CALLBACK_URL || "http://localhost:4000/api/mpesa/callback",
  mpesaBaseUrl: process.env.MPESA_BASE_URL || "https://sandbox.safaricom.co.ke",

  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",

  mockAutoSettle: bool(process.env.MPESA_MOCK_AUTOSETTLE, true),
};
