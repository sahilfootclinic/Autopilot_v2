"use client";

import type { CatalogEntry } from "@/lib/catalog";
import { useWatchlist } from "@/lib/watchlist";
import { FundCard } from "./FundCard";

export function WatchlistSection({ all }: { all: CatalogEntry[] }) {
  const { items } = useWatchlist();
  const starred = all.filter((e) => items.includes(e.slug));
  if (starred.length === 0) return null;

  return (
    <section className="mx-auto max-w-page px-6 pt-12">
      <div className="flex items-center gap-2 mb-1">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="#F7931A">
          <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 18.56l-5.9 3.1 1.12-6.57L2.45 9.44l6.6-.96L12 2.5z" />
        </svg>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Your Watchlist
        </h2>
      </div>
      <p className="text-ink-500 mb-6 text-sm">
        Saved on this device — tap the star on any portfolio to add or remove.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {starred.map((e) => (
          <FundCard key={e.slug} entry={e} />
        ))}
      </div>
    </section>
  );
}
