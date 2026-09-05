import { formatDate, formatTime } from "@/lib/format";

export function Showtimes({ showtimes }: { showtimes: string[] }) {
  if (!showtimes || showtimes.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="font-display text-lg font-bold text-cream">Available Showtimes</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {showtimes.map((st, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-xl border border-gold/20 bg-surface/40 py-3 text-center transition hover:border-gold/50 hover:bg-surface/80"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gold">
              {formatDate(st)}
            </span>
            <span className="mt-1 text-sm text-cream">{formatTime(st)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
