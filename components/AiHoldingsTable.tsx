"use client";

import { useState } from "react";
import Link from "next/link";
import { TickerLink } from "./TickerLink";

export type AiHoldingRow = {
  ticker: string;
  name: string;
  weight: number;
  thesis: string;
  price: number | null;
  ret: number | null;
};

const INITIAL_LIMIT = 10;

export function AiHoldingsTable({ rows }: { rows: AiHoldingRow[] }) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? rows : rows.slice(0, INITIAL_LIMIT);
  const hiddenCount = rows.length - INITIAL_LIMIT;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-4 py-3">Asset</th>
              <th className="text-right font-medium px-4 py-3">Weight</th>
              <th className="text-right font-medium px-4 py-3">Price</th>
              <th className="text-right font-medium px-4 py-3">
                Since rebalance
              </th>
              <th className="text-left font-medium px-4 py-3 hidden md:table-cell">
                Thesis
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {visible.map((r) => (
              <tr key={r.ticker} className="hover:bg-ink-50/60 align-top">
                <td className="px-4 py-3">
                  <TickerLink
                    ticker={r.ticker}
                    className="font-semibold text-ink-900"
                  />
                  <div className="text-xs text-ink-500">
                    <Link
                      href={`/stock/${encodeURIComponent(
                        r.ticker.toUpperCase()
                      )}`}
                      className="hover:text-accent-dark hover:underline"
                    >
                      {r.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">
                  {r.weight}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {r.price != null ? `$${r.price.toFixed(2)}` : "—"}
                </td>
                <td
                  className={
                    "px-4 py-3 text-right tabular-nums font-medium " +
                    (r.ret == null
                      ? "text-ink-400"
                      : r.ret >= 0
                      ? "text-accent-dark"
                      : "text-loss")
                  }
                >
                  {r.ret == null
                    ? "—"
                    : `${r.ret >= 0 ? "+" : ""}${r.ret.toFixed(2)}%`}
                </td>
                <td className="px-4 py-3 text-ink-600 hidden md:table-cell max-w-sm">
                  {r.thesis}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > INITIAL_LIMIT && (
        <div className="border-t border-ink-100 p-4 flex justify-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition"
          >
            {showAll
              ? "Show top 10 only"
              : `See ${hiddenCount} more holdings`}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className={showAll ? "rotate-180" : ""}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
