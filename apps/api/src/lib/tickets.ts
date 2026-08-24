import { randomBytes, randomUUID } from "crypto";
import QRCode from "qrcode";

/**
 * Generates a unique, hard-to-guess ticket code (Section 6.9 — "secure,
 * unique, hard-to-guess ticket codes to prevent forgery"). Format:
 * PBAG-XXXX-XXXX-XXXX using a cryptographically random alphabet that
 * excludes visually ambiguous characters (0/O, 1/I/L).
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generateTicketCode(): string {
  const bytes = randomBytes(12);
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
    if ((i + 1) % 4 === 0 && i !== 11) out += "-";
  }
  return `PBAG-${out}`;
}

export function generateSellerCode(name: string): string {
  const base = name.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase() || "SELL";
  const suffix = Math.floor(10 + Math.random() * 90); // two digits, e.g. JANE47
  return `${base}${suffix}`;
}

export function newId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

/**
 * Builds the payload encoded into each ticket's QR code. Door-staff scanners
 * decode this JSON, then call POST /api/tickets/verify with { code } to
 * validate + mark-as-used against the live database — the QR payload itself
 * is never trusted as proof of validity, only as a fast way to read the code.
 */
export interface QrPayload {
  code: string;
  eventId: string;
  orderId: string;
  v: 1;
}

export async function buildQrDataUrl(payload: QrPayload): Promise<string> {
  const json = JSON.stringify(payload);
  return QRCode.toDataURL(json, { margin: 1, width: 320, color: { dark: "#120B23", light: "#FCF7F0" } });
}

export function calculateCommission(subtotal: number, rate: number): number {
  return Math.round(subtotal * rate * 100) / 100;
}
