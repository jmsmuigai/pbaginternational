import axios from "axios";
import { env } from "../config/env";
import type { StkPushRequest, StkPushResponse } from "@pbag/shared";

/**
 * M-Pesa Daraja (Safaricom) STK Push client.
 *
 * Three modes, controlled by MPESA_MODE:
 *  - "mock"    Fully simulated locally. No network call to Safaricom is
 *              made. Used by default so the ticketing flow can be demoed
 *              and the `npm run simulate` script can run end-to-end without
 *              any Daraja credentials. The *shape* of every request/response
 *              matches the real Daraja API exactly, so switching to
 *              "sandbox"/"live" later requires no code changes — only env
 *              vars.
 *  - "sandbox" Real calls to https://sandbox.safaricom.co.ke using your
 *              Daraja sandbox app's consumer key/secret + test shortcode.
 *  - "live"    Real calls to https://api.safaricom.co.ke using your
 *              production Paybill/Till credentials. Requires Safaricom
 *              go-live approval.
 */

async function getAccessToken(): Promise<string> {
  const url = `${env.mpesaBaseUrl}/oauth/v1/generate?grant_type=client_credentials`;
  const auth = Buffer.from(`${env.mpesaConsumerKey}:${env.mpesaConsumerSecret}`).toString("base64");
  const { data } = await axios.get(url, { headers: { Authorization: `Basic ${auth}` } });
  return data.access_token as string;
}

function darajaTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function darajaPassword(timestamp: string): string {
  return Buffer.from(`${env.mpesaShortcode}${env.mpesaPasskey}${timestamp}`).toString("base64");
}

function normalizeMsisdn(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return `254${digits.slice(1)}`;
  if (digits.startsWith("7") || digits.startsWith("1")) return `254${digits}`;
  return digits;
}

export async function stkPush(req: StkPushRequest): Promise<StkPushResponse> {
  const phone = normalizeMsisdn(req.phone);

  if (env.mpesaMode === "mock") {
    // Simulated response shaped exactly like Safaricom's real payload.
    const merchantRequestId = `mock-mr-${Date.now()}`;
    const checkoutRequestId = `ws_CO_mock_${Date.now()}`;
    return {
      merchantRequestId,
      checkoutRequestId,
      responseCode: "0",
      responseDescription: "Success. Request accepted for processing",
      customerMessage: "Success. Request accepted for processing",
    };
  }

  const timestamp = darajaTimestamp();
  const password = darajaPassword(timestamp);
  const token = await getAccessToken();

  const { data } = await axios.post(
    `${env.mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: env.mpesaShortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.max(1, Math.round(req.amount)),
      PartyA: phone,
      PartyB: env.mpesaShortcode,
      PhoneNumber: phone,
      CallBackURL: env.mpesaCallbackUrl,
      AccountReference: req.accountReference.slice(0, 12),
      TransactionDesc: req.description.slice(0, 13),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseCode: data.ResponseCode,
    responseDescription: data.ResponseDescription,
    customerMessage: data.CustomerMessage,
  };
}

/** Builds a synthetic Daraja callback body, used only by MPESA_MODE=mock. */
export function buildMockCallback(checkoutRequestId: string, merchantRequestId: string, amount: number, phone: string) {
  const receipt = `MOCK${Math.floor(Math.random() * 1_000_000_000)}`;
  return {
    Body: {
      stkCallback: {
        MerchantRequestID: merchantRequestId,
        CheckoutRequestID: checkoutRequestId,
        ResultCode: 0,
        ResultDesc: "The service request is processed successfully.",
        CallbackMetadata: {
          Item: [
            { Name: "Amount", Value: amount },
            { Name: "MpesaReceiptNumber", Value: receipt },
            { Name: "TransactionDate", Value: Number(darajaTimestamp()) },
            { Name: "PhoneNumber", Value: Number(normalizeMsisdn(phone)) },
          ],
        },
      },
    },
  };
}
