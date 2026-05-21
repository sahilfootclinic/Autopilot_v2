"use client";

import { useMemo, useState } from "react";
import type { Investor } from "@/lib/investors";
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
  values: Partial<Record<PerformanceWindow, number>>; // % change
};

export function TopPerformers({
  investors,
  perf,
}: {
  investors: Investor[];
  perf: PerfRow[];
}) {
  const [tab, setTab] = useState<PerformanceWindow>("1Y");

  const ranked = useMemo(() => {
    const withVal = perf
      .map((r) => ({ cik: r.cik, val: r.values[tab] }))
      .filter((r): r is { cik: string; val: number } => typeof r.val === "number");
    withVal.sort((a, b) => b.val - a.val);
    return withVal
      .map((r) => ({
        investor: investors.find((i) => i.cik === r.cik),
        val: r.val,
      }))
      .filter((r): r is { investor: Investor; val: number } => !!r.investor)
      .slice(0, 5);
  }, [tab, perf, investors]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          Top Performers
          <span
            className="text-ink-400"
            title="Ranked by reported 13F portfolio value change over the period. Reflects price moves plus inflows/outflows, not just total return."
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 8.5v.01M11 11h1v5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
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
          ranked.map(({ investor, val }) => (
            <PerformerRow
              key={investor.cik ?? investor.slug}
              investor={investor}
              badge={`${val >= 0 ? "+" : ""}${val.toFixed(1)}%`}
              badgeTone={val >= 0 ? "pos" : "neg"}
            />
          ))
        )}
      </div>
      <p className="text-xs text-ink-400 mt-3">
        Based on reported 13F portfolio value Δ. Includes inflows/outflows, not just price return.
      </p>
    </section>
  );
}
