import Link from "next/link";
import {
  FEATURED_INVESTORS,
  popularInvestors,
  tradableInvestors,
} from "@/lib/investors";
import { FundCard } from "@/components/FundCard";
import { PopularRow } from "@/components/PerformerRow";
import { SearchBar } from "@/components/SearchBar";
import { TopPerformers, type PerfRow } from "@/components/TopPerformers";
import { getPerformanceForAll } from "@/lib/performance";

export const revalidate = 21600;

export default async function HomePage() {
  const tradable = tradableInvestors();
  const ciks = tradable.map((i) => i.cik!);
  const perfMap = await getPerformanceForAll(ciks).catch(
    () => new Map()
  );

  const perfRows: PerfRow[] = tradable.map((inv) => {
    const p = perfMap.get(inv.cik!);
    return {
      cik: inv.cik!,
      values: {
        "1Q": p?.results["1Q"]?.deltaPct,
        "6M": p?.results["6M"]?.deltaPct,
        "1Y": p?.results["1Y"]?.deltaPct,
        "2Y": p?.results["2Y"]?.deltaPct,
      },
    };
  });

  const popular = popularInvestors().slice(0, 6);

  return (
    <>
      <Hero />
      <PerformanceSection investors={tradable} perfRows={perfRows} popular={popular} perfMap={perfMap} />
      <Featured />
      <HowItWorks />
    </>
  );
}

function Hero() {
  return (
    <section className="hero-gradient">
      <div className="mx-auto max-w-page px-6 pt-20 pb-12 md:pt-28 md:pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 mb-6">
          <span className="ticker-dot" />
          Latest 13F filings, refreshed every quarter
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-ink-900 leading-[1.05]">
          Follow the world's
          <br />
          <span className="gradient-text">smartest investors.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink-500 max-w-2xl mx-auto">
          See exactly what Buffett, Burry, Ackman and 25+ legendary fund managers
          are buying and selling. Pulled straight from the SEC.
        </p>
        <div className="mt-10 max-w-xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}

function PerformanceSection({
  investors,
  perfRows,
  popular,
  perfMap,
}: {
  investors: ReturnType<typeof tradableInvestors>;
  perfRows: PerfRow[];
  popular: ReturnType<typeof popularInvestors>;
  perfMap: Awaited<ReturnType<typeof getPerformanceForAll>>;
}) {
  return (
    <section className="mx-auto max-w-page px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <TopPerformers investors={investors} perf={perfRows} />
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Popular</h2>
          <Link
            href="/search"
            className="text-sm text-ink-600 hover:text-ink-900"
          >
            Browse all →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-ink-100 shadow-card divide-y divide-ink-100 px-4">
          {popular.map((inv) => {
            const p = inv.cik ? perfMap.get(inv.cik) : undefined;
            return (
              <PopularRow
                key={inv.cik ?? inv.slug}
                investor={inv}
                amount={p?.currentValueUsd}
                subtitle={inv.comingSoon ? "Coming soon" : undefined}
              />
            );
          })}
        </div>
        <p className="text-xs text-ink-400 mt-3">
          Hand-picked: famous funds, AI portfolios, and synthetic strategies.
        </p>
      </section>
    </section>
  );
}

function Featured() {
  return (
    <section className="mx-auto max-w-page px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            All featured investors
          </h2>
          <p className="text-ink-500 mt-2">
            Tap any fund to see their latest quarter's holdings.
          </p>
        </div>
        <Link
          href="/search"
          className="hidden md:inline-flex text-sm font-medium text-ink-700 hover:text-ink-900"
        >
          Search all filers →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURED_INVESTORS.map((inv) => (
          <FundCard key={inv.cik ?? inv.slug} investor={inv} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick an investor",
      body: "Browse 25+ hand-picked legends — or search any 13F filer by name.",
    },
    {
      n: "02",
      title: "See their holdings",
      body: "Every position, share count, and dollar value from their most recent 13F.",
    },
    {
      n: "03",
      title: "Track every quarter",
      body: "We refresh the data automatically. New filings appear within a day.",
    },
  ];
  return (
    <section className="bg-ink-50 border-y border-ink-100 mt-8">
      <div className="mx-auto max-w-page px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">
          How it works
        </h2>
        <p className="text-ink-500 mt-3 text-center max-w-xl mx-auto">
          Every quarter, big institutional investors must disclose their U.S.
          equity holdings to the SEC. We make that data readable.
        </p>
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
