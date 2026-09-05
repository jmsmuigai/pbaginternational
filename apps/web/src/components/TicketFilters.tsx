"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

const CATEGORIES = ["All", "Theatre", "Concert", "Cinema", "Comedy"];

export function TicketFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "All";
  const currentQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(currentQuery);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      createQueryString("q", query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, createQueryString]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "All") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="mb-10 flex flex-col gap-4">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg
            className="h-5 w-5 text-cream/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-cream/40 outline-none transition focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => createQueryString("category", cat)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              currentCategory === cat
                ? "bg-gold text-ink"
                : "border border-white/20 bg-transparent text-cream hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
