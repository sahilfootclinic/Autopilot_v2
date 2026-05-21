import Link from "next/link";
import { popularInvestors, tradableInvestors } from "@/lib/investors";
import {
  entriesHedgeFunds,
  entriesAI,
  entriesPoliticians,
  entriesTwitterLegends,
  entriesAll,
  investorEntry,
  type CatalogEntry,
} from "@/lib/catalog";
import { PopularRow } from "@/components/PerformerRow";
import { SearchBar } from "@/components/SearchBar";
import { TopPerformers, type PerfRow } from "@/components/TopPerformers";
import { BrowseTabs } from "@/components/BrowseTabs";
import { WatchlistSection } from "@/components/WatchlistSection";
import { BitcoinCoin } from "@/components/BitcoinCoin";
import { PHOTOS } from "@/data/photoManifest";
import { getPerformanceForAll } from "@/lib/performance";
import { getPriceSeriesBatch } from "@/lib/prices";
import { MAG7 } from "@/data/companies";

export const revalidate = 21600;

// Minimum 13F portfolio value (USD) required to appear in Top Performers.
// Excludes very small funds whose % swings reflect new capital flows, not returns.
const MIN_PERF_AUM = 500_000_000; // $500 M

export default async function HomePage() {
  const tradable = tradableInvestors();
  const ciks = tradable.map((i) => i.cik!);
  const perfMap = await getPerformanceForAll(ciks).catch(() => new Map());

  const entriesByCik: Record<string, CatalogEntry> = {};
  for (const inv of tradable) entriesByCik[inv.cik!] = investorEntry(inv);

  const perfRows: PerfRow[] = tradable.map((inv) => {
    const p = perfMap.get(inv.cik!);
    // Only include in performance rankings if AUM is large enough.
    const eligible = p != null && p.currentValueUsd >= MIN_PERF_AUM;
    return {
      cik: inv.cik!,
      values: {
        "1Q": eligible ? p?.results["1Q"]?.deltaPct : undefined,
        "6M": eligible ? p?.results["6M"]?.deltaPct : undefined,
        "1Y": eligible ? p?.results["1Y"]?.deltaPct : undefined,
        "2Y": eligible ? p?.results["2Y"]?.deltaPct : undefined,
      },
    };
  });

  const popular = popularInvestors().slice(0, 6);
  const allEntries = entriesAll();

  // Live prices for Mag-7 tickers.
  const mag7Tickers = Object.keys(MAG7);
  const mag7Prices = await getPriceSeriesBatch(mag7Tickers).catch(
    () => new Map()
  );

  return (
    <>
      <Hero />

      <WatchlistSection all={allEntries} />

      {/* Mag-7 Companies */}
      <Mag7Section prices={mag7Prices} />

      <BrowseTabs
        hedge={entriesHedgeFunds()}
        ai={entriesAI()}
        politicians={entriesPoliticians()}
        twitter={entriesTwitterLegends()}
        all={allEntries}
      />

      <section className="mx-auto max-w-page px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <TopPerformers entriesByCik={entriesByCik} perf={perfRows} />
        <section>
          <div className="mb-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Most Popular
            </h2>
            <p className="text-sm text-ink-400 mt-0.5">
              Ranked by reported 13F portfolio value
            </p>
          </div>
          <div className="mt-3 bg-white rounded-2xl border border-ink-100 shadow-card divide-y divide-ink-100 px-4">
            {popular.map((inv, i) => {
              const p = inv.cik ? perfMap.get(inv.cik) : undefined;
              return (
                <PopularRow
                  key={inv.slug}
                  entry={investorEntry(inv)}
                  rank={i + 1}
                  amount={p?.currentValueUsd}
                />
              );
            })}
          </div>
        </section>
      </section>

      <HowItWorks />
    </>
  );
}

function Hero() {
  return (
    <section className="hero-gradient">
      <div className="mx-auto max-w-page px-6 pt-20 pb-28 md:pt-28 md:pb-36 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Follow <span className="gradient-text">The Money</span>
          <BitcoinCoin className="btc-coin-svg" image={PHOTOS["bitcoin"]} />
        </h1>
        <div className="mt-10 max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

function Mag7Section({
  prices,
}: {
  prices: Map<string, { current: number; previousClose: number | null }>;
}) {
  const companies = Object.values(MAG7);

  return (
    <section className="mx-auto max-w-page px-6 py-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Magnificent 7
          </h2>
          <p className="text-sm text-ink-400 mt-0.5">
            The world's most-held stocks — click any to see who owns them
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {companies.map((co) => {
          const series = prices.get(co.ticker);
          const dayChange =
            series && series.previousClose
              ? ((series.current - series.previousClose) /
                  series.previousClose) *
                100
              : null;
          return (
            <Link
              key={co.ticker}
              href={`/stock/${co.ticker}`}
              className="group flex flex-col items-center rounded-2xl border border-ink-100 bg-white shadow-card hover:shadow-cardHover hover:-translate-y-0.5 p-4 transition text-center"
            >
              <div className="w-10 h-10 rounded-full bg-ink-100 flex items-center justify-center text-ink-600 font-semibold text-sm mb-2 select-none group-hover:bg-accent group-hover:text-white transition">
                {co.ticker === "BRK-B" ? "BRK" : co.ticker.slice(0, 3)}
              </div>
              <div className="font-semibold text-ink-900 text-sm leading-tight">
                {co.name}
              </div>
              <div className="text-xs text-ink-400 mt-0.5">{co.ticker}</div>
              {series && (
                <div className="mt-2">
                  <div className="text-sm font-medium tabular-nums">
                    ${series.current.toFixed(2)}
                  </div>
                  {dayChange != null && (
                    <div
                      className={
                        "text-xs tabular-nums font-medium " +
                        (dayChange >= 0 ? "text-accent-dark" : "text-loss")
                      }
                    >
                      {dayChange >= 0 ? "+" : ""}
                      {dayChange.toFixed(2)}%
                    </div>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick a portfolio",
      body: "Browse 13F funds, AI-managed portfolios, or members of Congress.",
    },
    {
      n: "02",
      title: "See the holdings",
      body: "Every position with live prices and the move since it was disclosed.",
    },
    {
      n: "03",
      title: "Track every update",
      body: "We refresh automatically — new filings and trades appear within a day.",
    },
  ];
  return (
    <section className="bg-ink-50 border-y border-ink-100 mt-8">
      <div className="mx-auto max-w-page px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">
          How it works
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-white rounded-2xl border border-ink-100 p-7 shadow-card"
            >
              <div className="text-sm font-semibold text-accent">{s.n}</div>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-ink-500">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
