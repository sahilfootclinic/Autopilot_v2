"use client";

import { useState } from "react";
import type { CatalogEntry } from "@/lib/catalog";
import { FundCard } from "./FundCard";

type TabKey = "13f" | "ai" | "politician";

const TABS: { key: TabKey; label: string; blurb: string }[] = [
  {
    key: "13f",
    label: "13F Funds",
    blurb: "Institutional investors who file quarterly holdings with the SEC.",
  },
  {
    key: "ai",
    label: "AI Portfolios",
    blurb: "Portfolios scored and rebalanced monthly by large language models.",
  },
  {
    key: "politician",
    label: "Politicians",
    blurb: "Members of Congress and their disclosed STOCK Act trades.",
  },
];

export function BrowseTabs({
  funds,
  ai,
  politicians,
}: {
  funds: CatalogEntry[];
  ai: CatalogEntry[];
  politicians: CatalogEntry[];
}) {
  const [tab, setTab] = useState<TabKey>("13f");
  const lists: Record<TabKey, CatalogEntry[]> = {
    "13f": funds,
    ai,
    politician: politicians,
  };
  const active = TABS.find((t) => t.key === tab)!;
  const items = lists[tab];

  return (
    <section className="mx-auto max-w-page px-6 py-12">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Browse portfolios
      </h2>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-ink-100">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2.5 text-[15px] font-medium border-b-2 -mb-px transition " +
                (isActive
                  ? "border-ink-900 text-ink-900"
                  : "border-transparent text-ink-500 hover:text-ink-700")
              }
            >
              {t.label}
              <span
                className={
                  "ml-2 rounded-full px-1.5 py-0.5 text-xs " +
                  (isActive
                    ? "bg-ink-100 text-ink-700"
                    : "bg-ink-50 text-ink-400")
                }
              >
                {lists[t.key].length}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-ink-500 mt-4">{active.blurb}</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((e) => (
          <FundCard key={e.slug} entry={e} />
        ))}
      </div>
    </section>
  );
}
