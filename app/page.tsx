import Link from "next/link";
import { FEATURED_INVESTORS } from "@/lib/investors";
import { FundCard } from "@/components/FundCard";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 21600; // 6h

export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <HowItWorks />
    </>
  );
}

function Hero() {
  return (
    <section className="hero-gradient">
      <div className="mx-auto max-w-page px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
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
          See exactly what Buffett, Burry, Ackman and 20+ legendary fund managers
          are buying and selling. Pulled straight from the SEC.
        </p>
        <div className="mt-10 max-w-xl mx-auto">
          <SearchBar />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
          <span className="flex items-center gap-2">
            <CheckIcon /> Official SEC data
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> 20+ legendary investors
          </span>
          <span className="flex items-center gap-2">
            <CheckIcon /> Free forever
          </span>
        </div>
      </div>
    </section>
  );
}

function Featured() {
  return (
    <section className="mx-auto max-w-page px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Featured investors
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
          <FundCard key={inv.cik} investor={inv} />
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
      body: "Browse 20+ hand-picked legends — or search any 13F filer by name.",
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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="#0F9D58"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
