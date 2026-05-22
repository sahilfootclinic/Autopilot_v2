import Link from "next/link";

export const metadata = {
  title: "About — Sentinel",
  description:
    "Sentinel uses AI to analyse every disclosed portfolio on the market and surface the trades worth following.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-16 pb-28">
      {/* Hero */}
      <div className="mb-14">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-ink-900">
          About Sentinel
        </h1>
        <p className="mt-5 text-xl text-ink-500 leading-relaxed">
          We built Sentinel because we believe every investor deserves the same
          information advantage that institutional money has always had.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Our mission
        </h2>
        <div className="space-y-4 text-[17px] text-ink-700 leading-relaxed">
          <p>
            Sentinel's goal is simple: beat the market with AI. Not by guessing
            or gambling, but by systematically collecting every piece of public
            investment disclosure available — the 13F filings of the world's
            largest hedge funds, the STOCK Act trades of members of Congress,
            the monthly allocations of AI-managed portfolios — and using
            artificial intelligence to find where the smartest money actually
            converges.
          </p>
          <p>
            Retail investors have always been at an information disadvantage.
            Hedge funds have armies of analysts, proprietary data feeds, and
            decades of experience. Politicians have inside knowledge of
            legislation before it becomes law. AI funds have compute power no
            individual can match. Sentinel puts all of that in one place and
            lets you follow the signal.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          How it works
        </h2>
        <div className="space-y-6">
          {[
            {
              n: "01",
              title: "We collect every public disclosure",
              body: "Every quarter, fund managers with more than $100M in US equities must file a Form 13F with the SEC. Every member of Congress must report their personal stock trades within 45 days under the STOCK Act. We pull all of it directly from EDGAR and the House and Senate disclosure portals, parse it, and make it readable in seconds.",
            },
            {
              n: "02",
              title: "AI finds the signal in the noise",
              body: "Raw filings are data. Sentinel's AI — including our own model, Matt — analyses every position across every tracked portfolio to identify where conviction is building, where smart money is quietly exiting, and which individual securities appear in the most high-performing books at the same time. You see the pattern, not just the paperwork.",
            },
            {
              n: "03",
              title: "You follow what matters",
              body: "Browse by investor, by sector, or let Matt's synthesised portfolio do the work. Every position comes with live prices, performance since disclosure, and the investment thesis behind it. Set up your watchlist and we'll keep you updated as new filings land.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-ink-100 bg-white shadow-card p-6"
            >
              <div className="text-sm font-semibold text-accent mb-2">
                {s.n}
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                {s.title}
              </h3>
              <p className="text-ink-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matt */}
      <section className="mb-12 rounded-2xl border border-ink-100 bg-ink-50 p-7">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-lg mt-1">
            M
          </div>
          <div>
            <div className="font-semibold text-ink-900 text-lg">Matt</div>
            <div className="text-sm text-ink-500">Sentinel AI</div>
          </div>
        </div>
        <p className="text-ink-700 leading-relaxed text-[17px] mb-4">
          Matt is our proprietary AI and the only portfolio on Sentinel that
          knows what every other portfolio on Sentinel is doing. Rather than
          scoring stocks in isolation, Matt cross-references thousands of
          disclosed positions from hedge funds, politicians, and AI portfolios,
          weights each signal by the investor's historical performance, and
          builds a monthly 15-asset portfolio from the result.
        </p>
        <p className="text-ink-700 leading-relaxed text-[17px] mb-5">
          Think of Matt as the investor who has read every filing, tracked every
          trade, and done the maths on all of it so you don't have to. Each
          month Matt publishes its allocation alongside a plain-English
          explanation of which signals drove each position.
        </p>
        <Link
          href="/ai/matt"
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-ink-700 transition"
        >
          View Matt's portfolio →
        </Link>
      </section>

      {/* The data */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          The data we use
        </h2>
        <div className="space-y-4 text-[17px] text-ink-700 leading-relaxed">
          <p>
            Everything on Sentinel comes from public, government-mandated
            disclosures. We don't scrape private communications, pay for
            alternative data, or speculate about positions that haven't been
            filed. If it's on Sentinel, it's because a regulatory body required
            it to be disclosed.
          </p>
          <ul className="space-y-3 pl-1">
            {[
              {
                label: "SEC Form 13F",
                desc: "Required quarterly from any institutional manager with more than $100M in US equities. Shows long positions held at quarter-end.",
              },
              {
                label: "STOCK Act disclosures",
                desc: "Members of Congress must report personal trades of US securities within 45 days of execution. Sentinel tracks the House and Senate portals daily.",
              },
              {
                label: "AI portfolio allocations",
                desc: "Monthly portfolios constructed by large language models following published academic methodology — transparent, reproducible, and updated each month.",
              },
              {
                label: "Live market prices",
                desc: "Position values, day changes, and performance since disclosure are updated continuously using live market data.",
              },
            ].map((item) => (
              <li key={item.label} className="flex gap-3">
                <span className="mt-1 text-accent shrink-0">·</span>
                <span>
                  <span className="font-semibold text-ink-900">
                    {item.label}
                  </span>{" "}
                  — {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What Sentinel is not */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          What Sentinel is not
        </h2>
        <div className="space-y-4 text-[17px] text-ink-700 leading-relaxed">
          <p>
            Sentinel is an information and research tool. We are not a broker,
            an investment adviser, or a fund. Nothing on this site is
            investment advice, and nothing here constitutes a recommendation to
            buy or sell any security.
          </p>
          <p>
            The portfolios you see here are disclosed positions — snapshots of
            what was held at a point in time, often 45 or more days in the
            past. Positions may have changed significantly since filing. Past
            performance of any investor does not guarantee future results.
            Always do your own research before making investment decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-card p-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          Start following the money
        </h2>
        <p className="text-ink-500 mb-6 max-w-md mx-auto">
          Browse every portfolio we track, or let Matt synthesise them all for
          you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/#browse"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 text-white px-6 py-3 text-sm font-medium hover:bg-ink-700 transition"
          >
            Browse portfolios
          </Link>
          <Link
            href="/ai/matt"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 px-6 py-3 text-sm font-medium text-ink-700 hover:bg-ink-50 transition"
          >
            Meet Matt
          </Link>
        </div>
      </div>
    </div>
  );
}
