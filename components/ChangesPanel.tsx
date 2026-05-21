"use client";

import { useState } from "react";
import type { PositionChange, QoQDiff } from "@/lib/edgar";
import { formatCompactShares, formatUsd, quarterLabel } from "@/lib/format";
import { cleanCompanyName } from "@/lib/companyName";

type TabKey = "new" | "increased" | "reduced" | "sold";

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: "new", label: "New positions", color: "text-accent" },
  { key: "increased", label: "Added to", color: "text-accent" },
  { key: "reduced", label: "Reduced", color: "text-loss" },
  { key: "sold", label: "Sold out", color: "text-loss" },
];

export function ChangesPanel({
  diff,
  currentQuarter,
}: {
  diff: QoQDiff;
  currentQuarter: string;
}) {
  const [tab, setTab] = useState<TabKey>("new");

  const lists: Record<TabKey, PositionChange[]> = {
    new: diff.newPositions,
    increased: diff.increased,
    reduced: diff.reduced,
    sold: diff.soldOut,
  };

  const counts: Record<TabKey, number> = {
    new: diff.newPositions.length,
    increased: diff.increased.length,
    reduced: diff.reduced.length,
    sold: diff.soldOut.length,
  };

  const items = lists[tab].slice(0, 25);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
      <div className="p-5 border-b border-ink-100">
        <h3 className="text-lg font-semibold">
          Changes vs {quarterLabel(diff.prevReportDate)}
        </h3>
        <p className="text-sm text-ink-500 mt-0.5">
          What changed between {quarterLabel(diff.prevReportDate)} and{" "}
          {currentQuarter}.
        </p>
      </div>

      <div className="flex border-b border-ink-100 overflow-x-auto">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition " +
                (active
                  ? "border-ink-900 text-ink-900"
                  : "border-transparent text-ink-500 hover:text-ink-700")
              }
            >
              {t.label}
              <span
                className={
                  "rounded-full px-2 py-0.5 text-xs " +
                  (active
                    ? "bg-ink-100 text-ink-700"
                    : "bg-ink-50 text-ink-500")
                }
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center text-ink-500 text-sm">
          Nothing in this category for this quarter.
        </div>
      ) : (
        <ul className="divide-y divide-ink-100">
          {items.map((c) => (
            <ChangeRow key={c.cusip} c={c} tab={tab} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ChangeRow({ c, tab }: { c: PositionChange; tab: TabKey }) {
  const isPos = tab === "new" || tab === "increased";
  const arrow = isPos ? "▲" : "▼";
  const colorClass = isPos ? "text-accent" : "text-loss";

  let primary: string;
  let secondary: string;
  if (tab === "new") {
    primary = formatUsd(c.currValue, { compact: true });
    secondary = `${formatCompactShares(c.currShares)} shares`;
  } else if (tab === "sold") {
    primary = `−${formatUsd(c.prevValue, { compact: true })}`;
    secondary = `${formatCompactShares(c.prevShares)} shares sold`;
  } else if (tab === "increased") {
    const pct = Number.isFinite(c.pctChange)
      ? ` (+${(c.pctChange * 100).toFixed(0)}%)`
      : "";
    primary = `+${formatCompactShares(c.sharesDelta)}${pct}`;
    secondary = `${formatCompactShares(c.prevShares)} → ${formatCompactShares(c.currShares)}`;
  } else {
    const pct = c.prevShares > 0
      ? ` (${((c.sharesDelta / c.prevShares) * 100).toFixed(0)}%)`
      : "";
    primary = `${formatCompactShares(c.sharesDelta)}${pct}`;
    secondary = `${formatCompactShares(c.prevShares)} → ${formatCompactShares(c.currShares)}`;
  }

  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-ink-50/60">
      <div className="min-w-0">
        <div className="font-medium text-ink-900 truncate">
          {cleanCompanyName(c.nameOfIssuer)}
        </div>
        <div className="text-xs text-ink-500 truncate">
          {tab === "new" || tab === "increased"
            ? "Shares now held"
            : "Shares"}
        </div>
      </div>
      <div className={"text-right shrink-0 " + colorClass}>
        <div className="font-semibold tabular-nums">
          <span className="mr-1">{arrow}</span>
          {primary}
        </div>
        <div className="text-xs text-ink-500 tabular-nums">{secondary}</div>
      </div>
    </li>
  );
}
