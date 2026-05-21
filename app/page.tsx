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
import { getPerformanceForAll } from "@/lib/performance";

export const revalidate = 21600;

export default async function HomePage() {
  const tradable = tradableInvestors();
  const ciks = tradable.map((i) => i.cik!);
  const perfMap = await getPerformanceForAll(ciks).catch(() => new Map());

  const entriesByCik: Record<string, CatalogEntry> = {};
  for (const inv of tradable) entriesByCik[inv.cik!] = investorEntry(inv);

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

      <BrowseTabs
        hedge={entriesHedgeFunds()}
        ai={entriesAI()}
        politicians={entriesPoliticians()}
        twitter={entriesTwitterLegends()}
        all={entriesAll()}
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
      <div className="mx-auto max-w-page px-6 pt-20 pb-14 md:pt-28 md:pb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-ink-900 leading-[1.04]">
          Follow <span className="gradient-text">The Money</span>
        </h1>
        <div className="mt-10 max-w-xl mx-auto">
          <SearchBar />
        </div>
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
