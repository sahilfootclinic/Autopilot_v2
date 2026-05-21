import Link from "next/link";
import { notFound } from "next/navigation";
import { getAiPortfolio, AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { Avatar } from "@/components/Avatar";
import { AboutCard } from "@/components/AboutCard";
import { getBio } from "@/data/bios";
import { getPriceSeriesBatch, isoToUnix } from "@/lib/prices";
import { formatDate, formatPercent } from "@/lib/format";

export const revalidate = 1800; // 30 min

export function generateStaticParams() {
  return AI_PORTFOLIOS.map((p) => ({ slug: p.slug }));
}

export default async function AiPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolio = getAiPortfolio(slug);
  if (!portfolio) notFound();

  const since = isoToUnix(portfolio.rebalanceDate);
  const prices = await getPriceSeriesBatch(
    portfolio.holdings.map((h) => h.ticker),
    since
  ).catch(() => new Map());

  const rows = portfolio.holdings.map((h) => {
    const series = prices.get(h.ticker.replace(/\./g, "-").toUpperCase());
    let ret: number | null = null;
    if (series && series.atSince && series.atSince > 0) {
      ret = (series.current / series.atSince - 1) * 100;
    }
    return { ...h, price: series?.current ?? null, ret };
  });

  const priced = rows.filter((r) => r.ret != null);
  const portfolioReturn =
    priced.length > 0
      ? priced.reduce((s, r) => s + (r.weight / 100) * (r.ret as number), 0)
      : null;
  // Scale up so partial coverage still gives a representative number.
  const coverage = priced.reduce((s, r) => s + r.weight, 0);
  const scaledReturn =
    portfolioReturn != null && coverage > 0
      ? (portfolioReturn * 100) / coverage
      : null;

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Portfolios
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">AI Portfolios</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{portfolio.name}</span>
      </div>

      <header className="flex flex-col md:flex-row md:items-center gap-5">
        <Avatar
          seed={portfolio.slug}
          label={portfolio.model}
          badge="AI"
          badgeColor="#9334E6"
          size={72}
        />
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
            {portfolio.name}
          </h1>
          <p className="mt-1 text-ink-500">
            Managed by {portfolio.model} · methodology by {portfolio.manager}
          </p>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          label="Since rebalance"
          value={
            scaledReturn != null ? formatPercent(scaledReturn, 2) : "—"
          }
          tone={scaledReturn != null ? (scaledReturn >= 0 ? "pos" : "neg") : "neutral"}
          sub={`From ${formatDate(portfolio.rebalanceDate)}`}
        />
        <Stat label="Holdings" value={String(portfolio.holdings.length)} sub="Equal-ish weighted" />
        <Stat label="Rebalance" value="Monthly" sub="Full re-score each month" />
        <Stat
          label="Live price coverage"
          value={`${priced.length}/${portfolio.holdings.length}`}
          sub="Tickers priced via Yahoo"
        />
      </div>

      {/* Methodology */}
      <section className="mt-10 rounded-2xl border border-ink-100 bg-ink-50 p-6">
        <h2 className="text-lg font-semibold">How this portfolio is built</h2>
        <ul className="mt-3 space-y-2 text-ink-700 text-[15px]">
          {portfolio.methodology.map((m, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent">·</span>
              <span>{m}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-400">
          Holdings below are a reference allocation following this methodology,
          effective {formatDate(portfolio.rebalanceDate)}. Prices and returns
          are live from Yahoo Finance. This is not investment advice.
        </p>
      </section>

      {/* Holdings */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Holdings — 15-asset allocation
        </h2>
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
                {rows.map((r) => (
                  <tr key={r.ticker} className="hover:bg-ink-50/60 align-top">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink-900">
                        {r.ticker}
                      </div>
                      <div className="text-xs text-ink-500">{r.name}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">
                      {r.weight}%
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {r.price != null
                        ? `$${r.price.toFixed(2)}`
                        : "—"}
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
        </div>
      </section>

      <AboutCard name={portfolio.manager} bio={getBio(portfolio.slug)} />

      <div className="mt-8 flex flex-wrap gap-3">
        {AI_PORTFOLIOS.filter((p) => p.slug !== portfolio.slug).map((p) => (
          <Link
            key={p.slug}
            href={`/ai/${p.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition"
          >
            Compare with {p.name} →
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({
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
      <div className="text-xs uppercase tracking-wide text-ink-400">
        {label}
      </div>
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
