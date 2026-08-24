export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-KE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}
