"use client";

import { useMemo, useState } from "react";
import type { CatalogEntry } from "@/lib/catalog";
import { PerformerRow } from "./PerformerRow";
import type { PerformanceWindow } from "@/lib/performance";

const TABS: { key: PerformanceWindow; label: string }[] = [
  { key: "1Q", label: "1Q" },
  { key: "6M", label: "6M" },
  { key: "1Y", label: "1Y" },
  { key: "2Y", label: "2Y" },
];

export type PerfRow = {
  cik: string;
  values: Partial<Record<PerformanceWindow, number>>;
};

export function TopPerformers({
  entriesByCik,
  perf,
}: {
  entriesByCik: Record<string, CatalogEntry>;
  perf: PerfRow[];
}) {
  const [tab, setTab] = useState<PerformanceWindow>("1Y");

  const ranked = useMemo(() => {
    const withVal = perf
      .map((r) => ({ cik: r.cik, val: r.values[tab] }))
      .filter((r): r is { cik: string; val: number } => typeof r.val === "number");
    withVal.sort((a, b) => b.val - a.val);
    return withVal
      .map((r) => ({ entry: entriesByCik[r.cik], val: r.val }))
      .filter((r): r is { entry: CatalogEntry; val: number } => !!r.entry)
      .slice(0, 5);
  }, [tab, perf, entriesByCik]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Top Performers</h2>
        <div className="flex gap-1 rounded-full bg-ink-100 p-1 text-sm">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={
                  "px-3 py-1 rounded-full transition " +
                  (active
                    ? "bg-ink-900 text-white"
                    : "text-ink-600 hover:text-ink-900")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-ink-100 shadow-card divide-y divide-ink-100 px-4">
        {ranked.length === 0 ? (
          <div className="py-10 text-center text-ink-500 text-sm">
            Not enough 13F history yet for this window.
          </div>
        ) : (
          ranked.map(({ entry, val }) => (
            <PerformerRow
              key={entry.slug}
              entry={entry}
              badge={`${val >= 0 ? "+" : ""}${val.toFixed(1)}%`}
              badgeTone={val >= 0 ? "pos" : "neg"}
            />
          ))
        )}
      </div>
      <p className="text-xs text-ink-400 mt-3">
        Ranked by reported 13F portfolio value Δ over the period — includes
        inflows/outflows, not just price return.
      </p>
    </section>
  );
}
