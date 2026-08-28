/**
 * Shared TypeScript types used by both the Next.js frontend (apps/web)
 * and the Express API (apps/api). Keeping these in one package means the
 * shape of an "Event" or a "Ticket" can never silently drift between the
 * two apps.
 */

export type SubsidiarySlug =
  | "pbag-theatre"
  | "peers-got-talent"
  | "peatice-production"
  | "pbag-bunge";

export interface Subsidiary {
  slug: SubsidiarySlug;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  emoji: string;
  isLead?: boolean;
  colorFrom: string;
  colorTo: string;
  joinMethod: "form" | "whatsapp";
  joinTarget: string; // route or wa.me link
}

export type UserRole =
  | "buyer"
  | "seller"
  | "producer"
  | "admin"
  | "door_staff";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface TicketTier {
  id: string;
  name: string; // "Early Bird", "Regular", "VIP"
  price: number; // KES
  quantityTotal: number;
  quantitySold: number;
  salesStart: string;
  salesEnd: string;
}

export type EventStatus = "draft" | "on_sale" | "sold_out" | "closed" | "past";

export interface EventRecord {
  id: string;
  slug: string;
  title: string;
  subsidiary: SubsidiarySlug | "pbag";
  description: string;
  category: string;
  venue: string;
  isOnline: boolean;
  startAt: string; // ISO
  endAt: string; // ISO
  coverImage: string;
  gallery: string[];
  status: EventStatus;
  ticketTiers: TicketTier[];
  defaultCommissionRate: number; // 0..1
  createdAt: string;
}

export type SellerLinkChannel = "code" | "link" | "qr" | "pos";

export interface Seller {
  id: string;
  userId: string;
  name: string;
  code: string; // e.g. JANE10
  eventId: string;
  commissionRateOverride?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type PaymentMethod = "mpesa" | "airtel_money" | "card" | "paypal" | "cash" | "pos_mpesa";

export type OrderStatus =
  | "pending_payment"
  | "processing"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export interface OrderItem {
  ticketTierId: string;
  ticketTierName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  items: OrderItem[];
  subtotal: number;
  platformFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  channel: SellerLinkChannel | "direct";
  sellerCode?: string;
  sellerId?: string;
  commissionAmount?: number;
  commissionRateApplied?: number;
  mpesaCheckoutRequestId?: string;
  mpesaReceiptNumber?: string;
  soldByDoorStaffId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = "valid" | "used" | "void";

export interface IssuedTicket {
  id: string;
  code: string; // unique, hard-to-guess ticket code
  qrPayload: string;
  orderId: string;
  eventId: string;
  ticketTierId: string;
  ticketTierName: string;
  holderName: string;
  status: TicketStatus;
  usedAt?: string;
  scannedBy?: string;
  createdAt: string;
}

export interface CommissionLedgerEntry {
  id: string;
  sellerId: string;
  eventId: string;
  orderId: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: string;
}

export interface StkPushRequest {
  phone: string; // 2547XXXXXXXX
  amount: number;
  orderId: string;
  accountReference: string;
  description: string;
}

export interface StkPushResponse {
  merchantRequestId: string;
  checkoutRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
}

export interface DarajaCallbackMetadataItem {
  Name: string;
  Value?: string | number;
}

export interface DarajaStkCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: DarajaCallbackMetadataItem[];
      };
    };
  };
}

export interface ChatbotMessage {
  role: "user" | "assistant";
  content: string;
}
