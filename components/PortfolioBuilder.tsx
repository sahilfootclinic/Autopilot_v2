"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Holding = {
  id: string;
  ticker: string;
  name: string;
  weight: number;
  thesis: string;
};

type PortfolioData = {
  name: string;
  holdings: Holding[];
  createdAt: string;
};

type PriceData = {
  price: number | null;
  ret: number | null;
  loading: boolean;
};

type FormState = { ticker: string; name: string; weight: string; thesis: string };

const STORAGE_KEY = "sentinel-my-portfolio-v1";

const COLORS = [
  "#228B22", "#1A73E8", "#9334E6", "#D93025", "#F29900",
  "#00897B", "#3F51B5", "#E91E63", "#5E35B1", "#455A64",
  "#0288D1", "#6D4C41", "#2E7D32", "#7B1FA2", "#C62828",
];

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function fetchPrice(
  ticker: string
): Promise<{ price: number | null; ret: number | null }> {
  try {
    const res = await fetch(`/api/price/${encodeURIComponent(ticker)}`, {
      cache: "no-store",
    });
    if (!res.ok) return { price: null, ret: null };
    return await res.json();
  } catch {
    return { price: null, ret: null };
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [renamingPortfolio, setRenamingPortfolio] = useState(false);
  const [initName, setInitName] = useState("My Portfolio");
  const [form, setForm] = useState<FormState>({ ticker: "", name: "", weight: "", thesis: "" });
  const [renameVal, setRenameVal] = useState("");
  const fetchedRef = useRef<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPortfolio(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist on every change
  useEffect(() => {
    if (portfolio !== null) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
      } catch {}
    }
  }, [portfolio]);

  // Fetch prices for new tickers
  useEffect(() => {
    if (!portfolio?.holdings.length) return;
    portfolio.holdings.forEach((h) => {
      if (fetchedRef.current.has(h.ticker)) return;
      fetchedRef.current.add(h.ticker);
      setPrices((prev) => ({
        ...prev,
        [h.ticker]: { price: null, ret: null, loading: true },
      }));
      fetchPrice(h.ticker).then((data) => {
        setPrices((prev) => ({ ...prev, [h.ticker]: { ...data, loading: false } }));
      });
    });
  }, [portfolio?.holdings]);

  const loadPricesForTicker = (ticker: string) => {
    if (fetchedRef.current.has(ticker)) return;
    fetchedRef.current.add(ticker);
    setPrices((prev) => ({
      ...prev,
      [ticker]: { price: null, ret: null, loading: true },
    }));
    fetchPrice(ticker).then((data) => {
      setPrices((prev) => ({ ...prev, [ticker]: { ...data, loading: false } }));
    });
  };

  const openAdd = () => {
    setShowAdd(true);
    setEditId(null);
    setForm({ ticker: "", name: "", weight: "", thesis: "" });
  };

  const startEdit = (h: Holding) => {
    setEditId(h.id);
    setShowAdd(false);
    setForm({ ticker: h.ticker, name: h.name, weight: String(h.weight), thesis: h.thesis });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({ ticker: "", name: "", weight: "", thesis: "" });
  };

  const handleAdd = () => {
    const ticker = form.ticker.trim().toUpperCase();
    const name = form.name.trim();
    const weight = parseFloat(form.weight);
    if (!ticker || !name || isNaN(weight) || weight <= 0 || weight > 100) return;
    const holding: Holding = { id: genId(), ticker, name, weight, thesis: form.thesis.trim() };
    setPortfolio((prev) =>
      prev
        ? { ...prev, holdings: [...prev.holdings, holding].sort((a, b) => b.weight - a.weight) }
        : null
    );
    setShowAdd(false);
    setForm({ ticker: "", name: "", weight: "", thesis: "" });
    loadPricesForTicker(ticker);
  };

  const handleUpdate = () => {
    if (!editId) return;
    const ticker = form.ticker.trim().toUpperCase();
    const name = form.name.trim();
    const weight = parseFloat(form.weight);
    if (!ticker || !name || isNaN(weight) || weight <= 0 || weight > 100) return;
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            holdings: prev.holdings
              .map((h) =>
                h.id === editId
                  ? { ...h, ticker, name, weight, thesis: form.thesis.trim() }
                  : h
              )
              .sort((a, b) => b.weight - a.weight),
          }
        : null
    );
    loadPricesForTicker(ticker);
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    setPortfolio((prev) =>
      prev ? { ...prev, holdings: prev.holdings.filter((h) => h.id !== id) } : null
    );
    if (editId === id) cancelEdit();
  };

  const distributeEvenly = () => {
    if (!portfolio?.holdings.length) return;
    const n = portfolio.holdings.length;
    const base = Math.floor(100 / n);
    const rem = 100 - base * n;
    setPortfolio((prev) =>
      prev
        ? {
            ...prev,
            holdings: prev.holdings.map((h, i) => ({
              ...h,
              weight: base + (i === 0 ? rem : 0),
            })),
          }
        : null
    );
  };

  const handleRename = () => {
    const name = renameVal.trim();
    if (!name) return;
    setPortfolio((prev) => (prev ? { ...prev, name } : null));
    setRenamingPortfolio(false);
  };

  const handleCreate = () => {
    const name = initName.trim() || "My Portfolio";
    setPortfolio({ name, holdings: [], createdAt: new Date().toISOString() });
    setShowAdd(true);
  };

  const handleClear = () => {
    if (!confirm("Reset your portfolio? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    setPortfolio(null);
    setPrices({});
    fetchedRef.current.clear();
    setShowAdd(false);
    setEditId(null);
  };

  if (portfolio === null) {
    return (
      <EmptyState
        initName={initName}
        setInitName={setInitName}
        onCreate={handleCreate}
      />
    );
  }

  const totalWeight = portfolio.holdings.reduce((s, h) => s + h.weight, 0);
  const weightOk = Math.abs(totalWeight - 100) < 0.5;
  const pricedHoldings = portfolio.holdings.filter(
    (h) => prices[h.ticker]?.ret != null
  );
  const pricedWeight = pricedHoldings.reduce((s, h) => s + h.weight, 0);
  const rawReturn = portfolio.holdings.reduce((s, h) => {
    const r = prices[h.ticker]?.ret;
    return r != null ? s + (h.weight / 100) * r : s;
  }, 0);
  const portfolioReturn =
    pricedWeight > 0 ? (rawReturn * 100) / pricedWeight : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        {renamingPortfolio ? (
          <div className="flex items-center gap-2">
            <input
              className="border border-ink-300 rounded-xl px-3 py-1.5 text-3xl font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-accent"
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") setRenamingPortfolio(false);
              }}
              autoFocus
            />
            <button
              onClick={handleRename}
              className="rounded-lg bg-accent text-white px-3 py-1.5 text-sm font-medium hover:bg-accent-dark transition"
            >
              Save
            </button>
            <button
              onClick={() => setRenamingPortfolio(false)}
              className="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50 transition"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
              {portfolio.name}
            </h1>
            <button
              onClick={() => {
                setRenamingPortfolio(true);
                setRenameVal(portfolio.name);
              }}
              className="text-xs text-ink-400 hover:text-ink-700 border border-ink-200 rounded-lg px-2 py-1 transition"
            >
              Rename
            </button>
          </div>
        )}
        <button
          onClick={handleClear}
          className="shrink-0 mt-2 text-xs text-ink-400 hover:text-loss transition"
        >
          Reset
        </button>
      </div>
      <p className="text-ink-500 mb-8">
        Your custom portfolio · {portfolio.holdings.length} holding
        {portfolio.holdings.length !== 1 ? "s" : ""}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Est. return (1M)"
          value={
            portfolioReturn != null
              ? `${portfolioReturn >= 0 ? "+" : ""}${portfolioReturn.toFixed(2)}%`
              : "—"
          }
          tone={
            portfolioReturn != null
              ? portfolioReturn >= 0
                ? "pos"
                : "neg"
              : "neutral"
          }
          sub="Weighted avg, priced holdings"
        />
        <StatCard
          label="Holdings"
          value={String(portfolio.holdings.length)}
          sub="Assets tracked"
        />
        <StatCard
          label="Weight total"
          value={`${totalWeight.toFixed(1)}%`}
          tone={weightOk ? "neutral" : "neg"}
          sub={weightOk ? "Fully allocated" : "Adjust to reach 100%"}
        />
        <StatCard
          label="Live prices"
          value={`${pricedHoldings.length}/${portfolio.holdings.length}`}
          sub="Via Yahoo Finance"
        />
      </div>

      {/* Allocation bar */}
      {portfolio.holdings.length > 0 && (
        <div className="mb-8 rounded-2xl border border-ink-100 bg-white shadow-card p-5">
          <div className="text-xs uppercase tracking-wide text-ink-400 mb-3">
            Allocation
          </div>
          <div className="flex rounded-full overflow-hidden h-5">
            {portfolio.holdings.map((h, i) => (
              <div
                key={h.id}
                style={{
                  width: `${(h.weight / Math.max(totalWeight, 100)) * 100}%`,
                  backgroundColor: COLORS[i % COLORS.length],
                }}
                title={`${h.ticker}: ${h.weight}%`}
              />
            ))}
            {totalWeight < 100 && (
              <div
                style={{ width: `${100 - (totalWeight / 100) * 100}%` }}
                className="bg-ink-100"
              />
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {portfolio.holdings.map((h, i) => (
              <span key={h.id} className="flex items-center gap-1.5 text-xs text-ink-600">
                <span
                  style={{ background: COLORS[i % COLORS.length] }}
                  className="w-2 h-2 rounded-full inline-block shrink-0"
                />
                {h.ticker} {h.weight}%
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Holdings section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          Holdings{" "}
          <span className="text-ink-500 font-normal">
            — {portfolio.holdings.length} asset
            {portfolio.holdings.length !== 1 ? "s" : ""}
          </span>
        </h2>
        <div className="flex gap-2">
          {portfolio.holdings.length > 1 && (
            <button
              onClick={distributeEvenly}
              className="text-sm rounded-full border border-ink-200 px-4 py-2 text-ink-700 hover:bg-ink-50 transition"
            >
              Distribute evenly
            </button>
          )}
          <button
            onClick={openAdd}
            className="text-sm rounded-full bg-ink-900 text-white px-4 py-2 font-medium hover:bg-ink-800 transition"
          >
            + Add holding
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <HoldingForm
          form={form}
          setForm={setForm}
          onSubmit={handleAdd}
          onCancel={() => {
            setShowAdd(false);
            setForm({ ticker: "", name: "", weight: "", thesis: "" });
          }}
          submitLabel="Add holding"
        />
      )}

      {/* Holdings table or empty state */}
      {portfolio.holdings.length === 0 ? (
        <div className="rounded-2xl border border-ink-100 bg-white shadow-card p-12 text-center text-ink-400">
          No holdings yet. Add your first position above.
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Asset</th>
                  <th className="text-right font-medium px-4 py-3">Weight</th>
                  <th className="text-right font-medium px-4 py-3">Price</th>
                  <th className="text-right font-medium px-4 py-3">1M Return</th>
                  <th className="text-left font-medium px-4 py-3 hidden md:table-cell">
                    Notes
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {portfolio.holdings.map((h) => {
                  const p = prices[h.ticker];
                  if (editId === h.id) {
                    return (
                      <tr key={h.id} className="bg-ink-50/60">
                        <td colSpan={6} className="px-4 py-3">
                          <HoldingForm
                            form={form}
                            setForm={setForm}
                            onSubmit={handleUpdate}
                            onCancel={cancelEdit}
                            submitLabel="Save"
                            compact
                          />
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={h.id} className="hover:bg-ink-50/60 align-middle">
                      <td className="px-4 py-3">
                        <Link
                          href={`/stock/${encodeURIComponent(h.ticker)}`}
                          className="font-semibold text-ink-900 hover:text-accent-dark hover:underline"
                        >
                          {h.ticker}
                        </Link>
                        <div className="text-xs text-ink-500">{h.name}</div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium">
                        {h.weight}%
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {p?.loading ? (
                          <span className="text-ink-300">…</span>
                        ) : p?.price != null ? (
                          `$${p.price.toFixed(2)}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td
                        className={
                          "px-4 py-3 text-right tabular-nums font-medium " +
                          (p?.loading
                            ? "text-ink-300"
                            : p?.ret == null
                            ? "text-ink-400"
                            : p.ret >= 0
                            ? "text-accent-dark"
                            : "text-loss")
                        }
                      >
                        {p?.loading
                          ? "…"
                          : p?.ret == null
                          ? "—"
                          : `${p.ret >= 0 ? "+" : ""}${p.ret.toFixed(2)}%`}
                      </td>
                      <td className="px-4 py-3 text-ink-600 hidden md:table-cell max-w-xs">
                        {h.thesis || (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(h)}
                            className="p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 hover:text-ink-700 transition"
                            title="Edit"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(h.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-ink-400 hover:text-loss transition"
                            title="Delete"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <polyline
                                points="3 6 5 6 21 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 11v6M14 11v6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weight warning */}
      {portfolio.holdings.length > 0 && !weightOk && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Weights sum to <strong>{totalWeight.toFixed(1)}%</strong> — adjust
          holdings or{" "}
          <button
            onClick={distributeEvenly}
            className="underline hover:no-underline font-medium"
          >
            distribute evenly
          </button>{" "}
          to reach 100%.
        </div>
      )}

      <p className="mt-8 text-xs text-ink-400">
        Portfolio saved locally in your browser. Prices and returns via Yahoo
        Finance. Not investment advice.
      </p>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "pos" | "neg" | "neutral";
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="text-xs uppercase tracking-wide text-ink-400">{label}</div>
      <div
        className={
          "mt-1 text-2xl font-semibold " +
          (tone === "pos"
            ? "text-accent-dark"
            : tone === "neg"
            ? "text-loss"
            : "text-ink-900")
        }
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}

function EmptyState({
  initName,
  setInitName,
  onCreate,
}: {
  initName: string;
  setInitName: (v: string) => void;
  onCreate: () => void;
}) {
  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900 mb-2">
        My Portfolio
      </h1>
      <p className="text-ink-500 mb-10">
        Build and track a custom portfolio with live prices.
      </p>

      <div className="max-w-md rounded-2xl border border-ink-100 bg-white shadow-card p-8">
        <h2 className="text-lg font-semibold mb-1">Create your portfolio</h2>
        <p className="text-sm text-ink-500 mb-6">
          Add any stocks, ETFs, or assets. We&apos;ll fetch live prices and
          calculate your weighted returns.
        </p>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Portfolio name
        </label>
        <input
          type="text"
          value={initName}
          onChange={(e) => setInitName(e.target.value)}
          placeholder="My Portfolio"
          className="w-full border border-ink-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") onCreate();
          }}
        />
        <button
          onClick={onCreate}
          className="w-full rounded-xl bg-ink-900 text-white font-medium py-2.5 text-sm hover:bg-ink-800 transition"
        >
          Create portfolio →
        </button>
      </div>
    </div>
  );
}

function HoldingForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  submitLabel,
  compact = false,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
  compact?: boolean;
}) {
  const valid =
    form.ticker.trim() &&
    form.name.trim() &&
    parseFloat(form.weight) > 0 &&
    parseFloat(form.weight) <= 100;

  if (compact) {
    return (
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Ticker
          </label>
          <input
            type="text"
            value={form.ticker}
            onChange={(e) =>
              setForm({ ...form, ticker: e.target.value.toUpperCase() })
            }
            className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm w-24 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="AAPL"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Apple Inc."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Weight %
          </label>
          <input
            type="number"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm w-20 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="20"
            min={0.1}
            max={100}
            step={0.1}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Notes
          </label>
          <input
            type="text"
            value={form.thesis}
            onChange={(e) => setForm({ ...form, thesis: e.target.value })}
            className="border border-ink-200 rounded-lg px-2.5 py-1.5 text-sm w-48 focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Optional note..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && valid) onSubmit();
              if (e.key === "Escape") onCancel();
            }}
          />
        </div>
        <div className="flex gap-1.5 pb-0.5">
          <button
            onClick={onSubmit}
            disabled={!valid}
            className="rounded-lg bg-accent text-white px-3 py-1.5 text-xs font-medium hover:bg-accent-dark transition disabled:opacity-40"
          >
            {submitLabel}
          </button>
          <button
            onClick={onCancel}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-ink-50 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-ink-900">New holding</h3>
        <button
          onClick={onCancel}
          className="text-ink-400 hover:text-ink-700 text-sm transition"
        >
          Cancel
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Ticker *
          </label>
          <input
            type="text"
            value={form.ticker}
            onChange={(e) =>
              setForm({ ...form, ticker: e.target.value.toUpperCase() })
            }
            className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            placeholder="AAPL"
            autoFocus
          />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Company name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            placeholder="Apple Inc."
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600 mb-1">
            Weight % *
          </label>
          <input
            type="number"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            placeholder="20"
            min={0.1}
            max={100}
            step={0.1}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-medium text-ink-600 mb-1">
          Notes (optional)
        </label>
        <input
          type="text"
          value={form.thesis}
          onChange={(e) => setForm({ ...form, thesis: e.target.value })}
          className="w-full border border-ink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
          placeholder="Why you own this..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && valid) onSubmit();
          }}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-600 hover:bg-white transition"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={!valid}
          className="rounded-xl bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent-dark transition disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
