"use client";

import { useEffect, useState } from "react";
import type { EventRecord } from "@pbag/shared";
import { api } from "@/lib/api";
import { formatKES } from "@/lib/format";

interface Dashboard {
  event: { id: string; title: string; capacity: number };
  summary: {
    ticketsSold: number;
    ticketsScanned: number;
    ticketsRemaining: number;
    revenue: number;
    platformFees: number;
    commissionOwed: number;
    netToProducer: number;
    revenueByChannel: Record<string, number>;
    ordersPending: number;
  };
  sellerLeaderboard: {
    sellerId: string;
    name: string;
    code: string;
    ticketsSold: number;
    revenue: number;
    commissionEarned: number;
  }[];
}

/** Real-time producer sales & commission dashboard (Section 6.3 / 6.5). */
export default function ProducerDashboardPage() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [eventId, setEventId] = useState("");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);

  useEffect(() => {
    api.get<{ events: EventRecord[] }>("/events").then((d) => {
      setEvents(d.events);
      if (d.events[0]) setEventId(d.events[0].id);
    });
  }, []);

  useEffect(() => {
    if (!eventId) return;
    let active = true;
    async function load() {
      const d = await api.get<Dashboard>(`/admin/dashboard/${eventId}`);
      if (active) setDashboard(d);
    }
    load();
    const t = setInterval(load, 4000);
    return () => { active = false; clearInterval(t); };
  }, [eventId]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold">Producer</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold">Live sales dashboard</h1>

      <select
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        className="mt-6 rounded-xl bg-white/10 px-4 py-3 text-sm focus:outline-none"
      >
        {events.map((e) => (
          <option key={e.id} value={e.id} className="bg-surface">{e.title}</option>
        ))}
      </select>

      {dashboard && (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Tickets sold", value: `${dashboard.summary.ticketsSold} / ${dashboard.event.capacity}` },
              { label: "Scanned at gate", value: dashboard.summary.ticketsScanned },
              { label: "Revenue", value: formatKES(dashboard.summary.revenue) },
              { label: "Net to producer", value: formatKES(dashboard.summary.netToProducer) },
              { label: "Platform fees", value: formatKES(dashboard.summary.platformFees) },
              { label: "Commission owed", value: formatKES(dashboard.summary.commissionOwed) },
              { label: "Tickets remaining", value: dashboard.summary.ticketsRemaining },
              { label: "Orders pending", value: dashboard.summary.ordersPending },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl glass p-5">
                <p className="text-xs uppercase tracking-wide text-cream/50">{s.label}</p>
                <p className="mt-1 font-display text-2xl font-bold text-gradient">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 p-6">
            <p className="font-display text-lg font-bold">Revenue by channel</p>
            <div className="mt-4 space-y-2">
              {Object.entries(dashboard.summary.revenueByChannel).map(([channel, amount]) => (
                <div key={channel} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm capitalize text-cream/60">{channel}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-coral"
                      style={{
                        width: `${dashboard.summary.revenue ? Math.min(100, (amount / dashboard.summary.revenue) * 100) : 0}%`,
                      }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-sm">{formatKES(amount)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 p-6">
            <p className="font-display text-lg font-bold">Seller leaderboard</p>
            {dashboard.sellerLeaderboard.length === 0 ? (
              <p className="mt-3 text-sm text-cream/50">No seller-attributed sales yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-cream/50">
                    <tr>
                      <th className="pb-2">Seller</th>
                      <th className="pb-2">Code</th>
                      <th className="pb-2">Tickets</th>
                      <th className="pb-2">Revenue</th>
                      <th className="pb-2">Commission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.sellerLeaderboard.map((s) => (
                      <tr key={s.sellerId} className="border-t border-white/10">
                        <td className="py-2">{s.name}</td>
                        <td className="py-2 font-mono text-xs text-gold">{s.code}</td>
                        <td className="py-2">{s.ticketsSold}</td>
                        <td className="py-2">{formatKES(s.revenue)}</td>
                        <td className="py-2">{formatKES(s.commissionEarned)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
