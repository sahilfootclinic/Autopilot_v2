"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Holding } from "@/lib/edgar";
import { formatCompactShares, formatPercent, formatUsd } from "@/lib/format";
import { cleanCompanyName } from "@/lib/companyName";
import { TickerLink } from "./TickerLink";

type SortKey = "value" | "shares" | "name" | "since";

export type HoldingPrice = {
  ticker: string;
  price: number;
  sinceReturn: number | null; // % since the filing's report date
};

export function HoldingsTable({
  holdings,
  totalValueUsd,
  priceByCusip = {},
}: {
  holdings: Holding[];
  totalValueUsd: number;
  priceByCusip?: Record<string, HoldingPrice>;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [showAll, setShowAll] = useState(false);

  const hasPrices = Object.keys(priceByCusip).length > 0;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = holdings;
    if (q) {
      list = list.filter(
        (h) =>
          h.nameOfIssuer.toLowerCase().includes(q) ||
          h.cusip.toLowerCase().includes(q) ||
          h.titleOfClass.toLowerCase().includes(q) ||
          (priceByCusip[h.cusip]?.ticker ?? "").toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortKey === "value") return b.value - a.value;
      if (sortKey === "shares") return b.shares - a.shares;
      if (sortKey === "since") {
        const ra = priceByCusip[a.cusip]?.sinceReturn ?? -Infinity;
        const rb = priceByCusip[b.cusip]?.sinceReturn ?? -Infinity;
        return rb - ra;
      }
      return cleanCompanyName(a.nameOfIssuer).localeCompare(
        cleanCompanyName(b.nameOfIssuer)
      );
    });
    return list;
  }, [query, sortKey, holdings, priceByCusip]);

  const visible = showAll ? filtered : filtered.slice(0, 25);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-ink-100">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#71717A" strokeWidth="2" />
            <path
              d="M20 20l-3.5-3.5"
              stroke="#71717A"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter holdings…"
            className="w-full bg-transparent outline-none text-sm py-1"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <span>Sort by</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-md border border-ink-200 bg-white px-2 py-1 text-ink-700"
          >
            <option value="value">Position value</option>
            <option value="shares">Share count</option>
            {hasPrices && <option value="since">Return since filing</option>}
            <option value="name">Company name</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-4 py-3 w-10">#</th>
              <th className="text-left font-medium px-4 py-3">Company</th>
              <th className="text-right font-medium px-4 py-3">Shares</th>
              <th className="text-right font-medium px-4 py-3">Value</th>
              {hasPrices && (
                <>
                  <th className="text-right font-medium px-4 py-3">Price</th>
                  <th className="text-right font-medium px-4 py-3">
                    Since filing
                  </th>
                </>
              )}
              <th className="text-right font-medium px-4 py-3">% Portfolio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {visible.map((h, i) => {
              const pct = totalValueUsd ? (h.value / totalValueUsd) * 100 : 0;
              const price = priceByCusip[h.cusip];
              return (
                <tr key={`${h.cusip}-${i}`} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3 text-ink-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink-900">
                      {price?.ticker ? (
                        <TickerLink
                          ticker={price.ticker}
                          className="text-ink-900"
                        />
                      ) : (
                        cleanCompanyName(h.nameOfIssuer)
                      )}
                      {h.putCall && (
                        <span className="ml-2 text-xs uppercase rounded bg-loss/10 px-1.5 py-0.5 text-loss">
                          {h.putCall}
                        </span>
                      )}
                    </div>
                    {price?.ticker && (
                      <div className="text-xs text-ink-500">
                        <Link
                          href={`/stock/${encodeURIComponent(price.ticker.toUpperCase())}`}
                          className="hover:text-accent-dark hover:underline"
                        >
                          {cleanCompanyName(h.nameOfIssuer, price.ticker)}
                        </Link>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCompactShares(h.shares)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium">
                    {formatUsd(h.value, { compact: true })}
                  </td>
                  {hasPrices && (
                    <>
                      <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                        {price ? `$${price.price.toFixed(2)}` : "—"}
                      </td>
                      <td
                        className={
                          "px-4 py-3 text-right tabular-nums font-medium " +
                          (price?.sinceReturn == null
                            ? "text-ink-400"
                            : price.sinceReturn >= 0
                            ? "text-accent-dark"
                            : "text-loss")
                        }
                      >
                        {price?.sinceReturn == null
                          ? "—"
                          : `${price.sinceReturn >= 0 ? "+" : ""}${price.sinceReturn.toFixed(1)}%`}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 text-right tabular-nums">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden sm:block h-1.5 w-16 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{
                            width: `${Math.min(100, pct * 2.5).toFixed(1)}%`,
                          }}
                        />
                      </div>
                      <span className="text-ink-700 w-12 text-right">
                        {formatPercent(pct, 2)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td
                  colSpan={hasPrices ? 7 : 5}
                  className="px-4 py-10 text-center text-ink-500"
                >
                  No holdings match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 25 && (
        <div className="border-t border-ink-100 p-4 flex justify-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="text-sm font-medium text-ink-700 hover:text-ink-900"
          >
            {showAll
              ? "Show top 25 only"
              : `Show all ${filtered.length} holdings →`}
          </button>
        </div>
      )}
    </div>
  );
}
