import Link from "next/link";
import { whalesHolding } from "@/lib/whaleIndex";
import { AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { getAllPoliticianSummaries } from "@/lib/politicians";
import { getPriceSeries } from "@/lib/prices";
import { getStockFinancials } from "@/lib/yahoo";
import { Avatar } from "@/components/Avatar";
import { photoOrPerson } from "@/lib/avatars";
import { getCompanyInfo } from "@/data/companies";
import { cleanCompanyName } from "@/lib/companyName";
import { StockChart } from "@/components/StockChart";
import { CompanyLogo } from "@/components/CompanyLogo";
import {
  formatCompactShares,
  formatDate,
  formatUsd,
  formatPercent,
} from "@/lib/format";
import type { StockFinancials } from "@/lib/yahoo";

export const revalidate = 21600; // 6h

const MAG7_TICKERS = new Set(["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"]);

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: raw } = await params;
  const ticker = decodeURIComponent(raw).trim().toUpperCase().replace(/\./g, "-");

  const [whales, polSummaries, price, financials] = await Promise.all([
    whalesHolding(ticker).catch(() => []),
    getAllPoliticianSummaries().catch(() => new Map()),
    getPriceSeries(ticker).catch(() => null),
    getStockFinancials(ticker).catch(() => null),
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

  const isMag7 = MAG7_TICKERS.has(ticker);

  return (
    <div className="mx-auto max-w-page px-4 sm:px-6 pt-6 sm:pt-10 pb-20">
      {/* Breadcrumb */}
      <div className="text-sm text-ink-500 mb-5">
        <Link href="/" className="hover:text-ink-900">
          Home
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">Stocks</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{ticker}</span>
      </div>

      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {isMag7 && (
            <CompanyLogo ticker={ticker} name={companyName} size={52} />
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-ink-900 leading-tight">
              {companyName}
            </h1>
            <p className="mt-0.5 text-ink-500 text-base sm:text-lg">
              {ticker}
              {info && (
                <span className="text-ink-400"> · {info.sector}</span>
              )}
            </p>
          </div>
        </div>
        {price && (
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-semibold tabular-nums">
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

      {/* Interactive Stock Chart — client component */}
      <StockChart ticker={ticker} currentPrice={price?.current} />

      {/* Company info (Mag-7) */}
      {info && (
        <section className="mt-6 space-y-4">
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card p-5 sm:p-6">
            <h2 className="text-lg font-semibold">About {info.name}</h2>
            <p className="mt-2 text-ink-700 leading-relaxed text-[15px]">
              {info.description}
            </p>
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Fact label="Sector" value={info.sector} />
              <Fact label="Founded" value={info.founded} />
              <Fact label="Headquarters" value={info.hq} />
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white shadow-card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 font-semibold text-base shrink-0 select-none">
                {info.ceo.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-400 mb-0.5">
                  Chief Executive Officer
                </div>
                <div className="text-lg font-semibold text-ink-900">
                  {info.ceo}
                </div>
                <p className="mt-1 text-ink-500 text-[15px]">{info.ceoNote}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Financial metrics */}
      {financials && (
        <FinancialsSection ticker={ticker} financials={financials} />
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-1">
            Hedge funds holding {ticker}
          </h2>
          <p className="text-sm text-ink-500 mb-4">
            {whales.length} tracked fund{whales.length === 1 ? "" : "s"} report
            it among their largest positions.
          </p>
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100 px-3 sm:px-4">
            {whales.map((w) => (
              <Link
                key={w.cik}
                href={`/fund/${w.cik}`}
                className="flex items-center gap-3 sm:gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-ink-50/60 active:bg-ink-100 transition"
              >
                <Avatar
                  seed={w.slug}
                  label={w.manager}
                  image={photoOrPerson(w.slug, w.manager)}
                  size={44}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink-900 truncate text-sm sm:text-base">
                    {w.fundName}
                  </div>
                  <div className="text-xs sm:text-sm text-ink-500 truncate">
                    {w.manager} · {formatCompactShares(w.shares)} ·{" "}
                    {formatDate(w.reportDate)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold tabular-nums text-sm sm:text-base">
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            AI portfolios holding {ticker}
          </h2>
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card divide-y divide-ink-100 px-3 sm:px-4">
            {aiHolders.map(({ portfolio, holding }) => (
              <Link
                key={portfolio.slug}
                href={`/ai/${portfolio.slug}`}
                className="flex items-center justify-between gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-ink-50/60 active:bg-ink-100 transition"
              >
                <div className="font-semibold text-ink-900 text-sm sm:text-base">
                  {portfolio.name}
                </div>
                <div className="text-right">
                  <div className="font-semibold tabular-nums text-sm sm:text-base">
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
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
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
                      className="flex items-center justify-between py-2 text-sm gap-2"
                    >
                      <span className="text-ink-500 text-xs sm:text-sm shrink-0">
                        {formatDate(t.transactionDate)}
                      </span>
                      <span
                        className={
                          "font-medium capitalize shrink-0 " +
                          (t.type === "purchase"
                            ? "text-accent-dark"
                            : t.type === "sale"
                            ? "text-loss"
                            : "text-ink-600")
                        }
                      >
                        {t.type}
                      </span>
                      <span className="text-ink-700 tabular-nums text-xs sm:text-sm text-right">
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
        Politician trades from congressional STOCK Act disclosures. Financial
        data and prices via Yahoo Finance. Not investment advice.
      </p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50 px-3 py-2.5">
      <div className="text-xs uppercase tracking-wide text-ink-400">
        {label}
      </div>
      <div className="mt-0.5 font-semibold text-ink-900 text-[15px]">
        {value}
      </div>
    </div>
  );
}

function fmtBig(n: number | null, decimals = 2): string {
  if (n == null) return "—";
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`;
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`;
  return `$${n.toFixed(decimals)}`;
}

function fmtNum(n: number | null, decimals = 2): string {
  if (n == null) return "—";
  return n.toFixed(decimals);
}

function fmtPct(n: number | null, decimals = 1): string {
  if (n == null) return "—";
  return `${(n * 100).toFixed(decimals)}%`;
}

function MetricCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "neg" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white px-3 sm:px-4 py-3 min-h-[60px]">
      <div className="text-xs uppercase tracking-wide text-ink-400">{label}</div>
      <div
        className={
          "mt-0.5 text-sm sm:text-base font-semibold tabular-nums " +
          (tone === "pos"
            ? "text-accent-dark"
            : tone === "neg"
            ? "text-loss"
            : "text-ink-900")
        }
      >
        {value}
      </div>
    </div>
  );
}

function FinancialsSection({
  ticker,
  financials: f,
}: {
  ticker: string;
  financials: StockFinancials;
}) {
  const range52w =
    f.fiftyTwoWeekLow != null && f.fiftyTwoWeekHigh != null
      ? `$${f.fiftyTwoWeekLow.toFixed(2)} – $${f.fiftyTwoWeekHigh.toFixed(2)}`
      : "—";

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>

      {/* Valuation */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wide text-ink-400 mb-2">
          Valuation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <MetricCell label="Market Cap" value={fmtBig(f.marketCap)} />
          <MetricCell label="P/E (TTM)" value={fmtNum(f.trailingPE)} />
          <MetricCell label="Forward P/E" value={fmtNum(f.forwardPE)} />
          <MetricCell label="EPS (TTM)" value={f.trailingEps != null ? `$${f.trailingEps.toFixed(2)}` : "—"} />
          <MetricCell label="Price / Book" value={fmtNum(f.priceToBook)} />
          <MetricCell label="Enterprise Value" value={fmtBig(f.enterpriseValue)} />
          <MetricCell label="52-Week Range" value={range52w} />
          <MetricCell label="Beta" value={fmtNum(f.beta)} />
        </div>
      </div>

      {/* Financials */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wide text-ink-400 mb-2">
          Financials (TTM)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <MetricCell label="Revenue" value={fmtBig(f.revenue)} />
          <MetricCell label="Gross Profit" value={fmtBig(f.grossProfits)} />
          <MetricCell label="EBITDA" value={fmtBig(f.ebitda)} />
          <MetricCell label="Free Cash Flow" value={fmtBig(f.freeCashflow)} />
          <MetricCell
            label="Gross Margin"
            value={fmtPct(f.grossMargins)}
            tone={f.grossMargins != null ? (f.grossMargins >= 0.4 ? "pos" : "neutral") : "neutral"}
          />
          <MetricCell
            label="Operating Margin"
            value={fmtPct(f.operatingMargins)}
            tone={f.operatingMargins != null ? (f.operatingMargins > 0 ? "pos" : "neg") : "neutral"}
          />
          <MetricCell
            label="Profit Margin"
            value={fmtPct(f.profitMargin)}
            tone={f.profitMargin != null ? (f.profitMargin > 0 ? "pos" : "neg") : "neutral"}
          />
          <MetricCell
            label="Revenue Growth"
            value={fmtPct(f.revenueGrowth)}
            tone={f.revenueGrowth != null ? (f.revenueGrowth > 0 ? "pos" : "neg") : "neutral"}
          />
        </div>
      </div>

      {/* Balance sheet */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wide text-ink-400 mb-2">
          Balance Sheet
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <MetricCell label="Total Cash" value={fmtBig(f.totalCash)} />
          <MetricCell label="Total Debt" value={fmtBig(f.totalDebt)} />
          <MetricCell label="Debt / Equity" value={fmtNum(f.debtToEquity)} />
          <MetricCell label="Current Ratio" value={fmtNum(f.currentRatio)} />
        </div>
      </div>

      {/* Returns */}
      <div>
        <h3 className="text-xs uppercase tracking-wide text-ink-400 mb-2">
          Returns
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          <MetricCell
            label="Return on Equity"
            value={fmtPct(f.returnOnEquity)}
            tone={f.returnOnEquity != null ? (f.returnOnEquity > 0 ? "pos" : "neg") : "neutral"}
          />
          <MetricCell
            label="Return on Assets"
            value={fmtPct(f.returnOnAssets)}
            tone={f.returnOnAssets != null ? (f.returnOnAssets > 0 ? "pos" : "neg") : "neutral"}
          />
          {f.dividendYield != null && f.dividendYield > 0 && (
            <MetricCell
              label="Dividend Yield"
              value={fmtPct(f.dividendYield)}
              tone="pos"
            />
          )}
          {f.earningsGrowth != null && (
            <MetricCell
              label="Earnings Growth"
              value={fmtPct(f.earningsGrowth)}
              tone={f.earningsGrowth > 0 ? "pos" : "neg"}
            />
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-ink-400">
        Financial data from Yahoo Finance. Trailing twelve months unless noted.
        Not investment advice.
      </p>
    </section>
  );
}
