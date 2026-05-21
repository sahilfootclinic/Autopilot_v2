"use client";

import { useMemo, useState } from "react";
import type { PoliticianTrade } from "@/lib/politicians";
import { formatDate } from "@/lib/format";

type Filter = "all" | "purchase" | "sale";

const TYPE_STYLE: Record<string, string> = {
  purchase: "bg-accent-light text-accent-dark",
  sale: "bg-red-50 text-loss",
  exchange: "bg-ink-100 text-ink-700",
  other: "bg-ink-100 text-ink-600",
};

export function PoliticianTrades({ trades }: { trades: PoliticianTrade[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(40);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trades.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (
        q &&
        !t.ticker.toLowerCase().includes(q) &&
        !t.assetDescription.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [trades, filter, query]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-b border-ink-100">
        <div className="flex gap-1 rounded-full bg-ink-100 p-1 text-sm">
          {(["all", "purchase", "sale"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1 rounded-full capitalize transition " +
                (filter === f
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:text-ink-900")
              }
            >
              {f === "all" ? "All" : f === "purchase" ? "Buys" : "Sells"}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by ticker or company…"
          className="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm outline-none focus:border-ink-400"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left font-medium px-4 py-3">Traded</th>
              <th className="text-left font-medium px-4 py-3">Asset</th>
              <th className="text-left font-medium px-4 py-3">Type</th>
              <th className="text-right font-medium px-4 py-3">Amount</th>
              <th className="text-right font-medium px-4 py-3 hidden sm:table-cell">
                Disclosed
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {visible.map((t, i) => (
              <tr key={i} className="hover:bg-ink-50/60">
                <td className="px-4 py-3 whitespace-nowrap text-ink-600">
                  {formatDate(t.transactionDate)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-ink-900">
                    {t.ticker || "—"}
                  </div>
                  <div className="text-xs text-ink-500 max-w-xs truncate">
                    {t.assetDescription}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "rounded-md px-2 py-0.5 text-xs font-medium capitalize " +
                      (TYPE_STYLE[t.type] ?? TYPE_STYLE.other)
                    }
                  >
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-700">
                  {t.amountRange || "—"}
                </td>
                <td className="px-4 py-3 text-right text-ink-500 hidden sm:table-cell whitespace-nowrap">
                  {formatDate(t.disclosureDate)}
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-500">
                  No trades match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > limit && (
        <div className="border-t border-ink-100 p-4 flex justify-center">
          <button
            onClick={() => setLimit((l) => l + 60)}
            className="text-sm font-medium text-ink-700 hover:text-ink-900"
          >
            Show more ({filtered.length - limit} remaining) →
          </button>
        </div>
      )}
    </div>
  );
}
