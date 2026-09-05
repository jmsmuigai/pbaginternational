"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="py-24 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 rounded-3xl glass p-12 ring-1 ring-white/10">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral/20 text-coral">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Something went wrong!</h2>
          <p className="mt-2 text-cream/70">
            We couldn&apos;t load the upcoming events. Please check your connection or try again.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full bg-gold px-6 py-2.5 font-bold text-ink transition hover:scale-105"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-6 py-2.5 font-bold text-cream transition hover:bg-white/10"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
