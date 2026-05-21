import Link from "next/link";
import { whalesHolding } from "@/lib/whaleIndex";
import { AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { getAllPoliticianSummaries } from "@/lib/politicians";
import { getPriceSeries } from "@/lib/prices";
import { Avatar } from "@/components/Avatar";
import { photoOrPerson } from "@/lib/avatars";
import { getCompanyInfo } from "@/data/companies";
import { cleanCompanyName } from "@/lib/companyName";
import {
  formatCompactShares,
  formatDate,
  formatUsd,
  formatPercent,
} from "@/lib/format";

export const revalidate = 21600; // 6h

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: raw } = await params;
  const ticker = decodeURIComponent(raw).trim().toUpperCase().replace(/\./g, "-");

  const [whales, polSummaries, price] = await Promise.all([
    whalesHolding(ticker).catch(() => []),
    getAllPoliticianSummaries().catch(() => new Map()),
    getPriceSeries(ticker).catch(() => null),
  ]);

  const aiHolders = AI_PORTFOLIOS.flatMap((p) =>
    p.holdings
      .filter((h) => h.ticker.toUpperCase().replace(/\./g, "-") === ticker)
      .map((h) => ({ portfolio: p, holding: h }))
  );

  const politicianTrades: {
    slug: string;
    name: string;
    party: string;
    trades: any[];
  }[] = [];
  for (const activity of polSummaries.values()) {
    const trades = activity.trades.filter(
      (t: any) => t.ticker === ticker || t.ticker === ticker.replace(/-/g, ".")
    );
    if (trades.length > 0) {
      politicianTrades.push({
        slug: activity.politician.slug,
        name: activity.politician.name,
        party: activity.politician.party,
        trades,
      });
    }
  }

  const info = getCompanyInfo(ticker);
  const companyName =
    info?.name ??
    cleanCompanyName(
      whales[0]?.nameOfIssuer ??
        aiHolders[0]?.holding.name ??
        politicianTrades[0]?.trades[0]?.assetDescription ??
        ticker,
      ticker
    );

  const dayChange =
    price && price.previousClose
      ? ((price.current - price.previousClose) / price.previousClose) * 100
      : null;

  const nothingFound =
    whales.length === 0 &&
    aiHolders.length === 0 &&
    politicianTrades.length === 0;

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Home
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">Stocks</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{ticker}</span>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
            {ticker}
          </h1>
          <p className="mt-1 text-ink-500 text-lg">
            {companyName}
            {info && (
              <span className="text-ink-400"> · {info.sector}</span>
            )}
          </p>
        </div>
        {price && (
          <div className="text-right">
            <div className="text-3xl font-semibold tabular-nums">
              ${price.current.toFixed(2)}
            </div>
            {dayChange != null && (
              <div
                className={
                  "text-sm font-medium tabular-nums " +
                  (dayChange >= 0 ? "text-accent-dark" : "text-loss")
                }
              >
                {dayChange >= 0 ? "+" : ""}
                {dayChange.toFixed(2)}% today
              </div>
            )}
          </div>
        )}
      </header>

      {info && (
        <section className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-6">
          <h2 className="text-lg font-semibold">About {info.name}</h2>
          <p className="mt-2 text-ink-700 leading-relaxed text-[15px]">
            {info.description}
          </p>
        </section>
      )}

      {nothingFound && (
        <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50 p-8 text-center text-ink-500">
          None of the funds, AI portfolios, or politicians we track currently
          report a position in {ticker}. (Hedge-fund coverage indexes each
          fund's largest positions.)
        </div>
      )}

      {/* Hedge funds */}
      {whales.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-1">
            Hedge funds holding {ticker}
          </h2>
          <p className="text-sm text-ink-500 mb-4">
            {whales.length} tracked fund{whales.length === 1 ? "" : "s"} report
            it among their largest positions.
          </p>
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100 px-4">
            {whales.map((w) => (
              <Link
                key={w.cik}
                href={`/fund/${w.cik}`}
                className="flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-ink-50/60 transition"
              >
                <Avatar
                  seed={w.slug}
                  label={w.manager}
                  image={photoOrPerson(w.slug, w.manager)}
                  size={48}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-900 truncate">
                    {w.fundName}
                  </div>
                  <div className="text-sm text-ink-500 truncate">
                    {w.manager} · {formatCompactShares(w.shares)} ·{" "}
                    {formatDate(w.reportDate)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold tabular-nums">
                    {formatUsd(w.value, { compact: true })}
                  </div>
                  <div className="text-xs text-ink-500 tabular-nums">
                    {formatPercent(w.portfolioPct, 1)} of portfolio
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* AI portfolios */}
      {aiHolders.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            AI portfolios holding {ticker}
          </h2>
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100 px-4">
            {aiHolders.map(({ portfolio, holding }) => (
              <Link
                key={portfolio.slug}
                href={`/ai/${portfolio.slug}`}
                className="flex items-center justify-between gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-ink-50/60 transition"
              >
                <div className="font-semibold text-ink-900">
                  {portfolio.name}
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums">
                    {holding.weight}% weight
                  </div>
                  <div className="text-xs text-ink-500">{holding.thesis}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Politicians */}
      {politicianTrades.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            Politicians who traded {ticker}
          </h2>
          <div className="space-y-4">
            {politicianTrades.map((p) => (
              <div
                key={p.slug}
                className="rounded-2xl border border-ink-100 bg-white shadow-card p-4"
              >
                <Link
                  href={`/politician/${p.slug}`}
                  className="font-semibold text-ink-900 hover:underline"
                >
                  {p.name}
                </Link>
                <div className="mt-2 divide-y divide-ink-100">
                  {p.trades.slice(0, 8).map((t: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-1.5 text-sm"
                    >
                      <span className="text-ink-500">
                        {formatDate(t.transactionDate)}
                      </span>
                      <span
                        className={
                          "font-medium capitalize " +
                          (t.type === "purchase"
                            ? "text-accent-dark"
                            : t.type === "sale"
                            ? "text-loss"
                            : "text-ink-600")
                        }
                      >
                        {t.type}
                      </span>
                      <span className="text-ink-700 tabular-nums">
                        {t.amountRange}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs text-ink-400">
        Hedge-fund data from SEC 13F filings (largest positions indexed).
        Politician trades from congressional STOCK Act disclosures. Prices via
        Yahoo Finance. Not investment advice.
      </p>
    </div>
  );
}
