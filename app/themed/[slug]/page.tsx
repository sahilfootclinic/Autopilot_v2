import Link from "next/link";
import { notFound } from "next/navigation";
import { findThemedBySlug, THEMED_INVESTORS } from "@/lib/investors";
import { getTwitterLegend } from "@/data/twitterLegends";
import { Avatar } from "@/components/Avatar";
import { AboutCard } from "@/components/AboutCard";
import { TickerLink } from "@/components/TickerLink";
import { getBio } from "@/data/bios";
import { photoOrPerson } from "@/lib/avatars";
import { getPriceSeriesBatch } from "@/lib/prices";
import { formatPercent } from "@/lib/format";

export const revalidate = 3600; // 1h

export function generateStaticParams() {
  return THEMED_INVESTORS.map((t) => ({ slug: t.slug }));
}

export default async function ThemedPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const investor = findThemedBySlug(slug);
  if (!investor) notFound();

  const legend = getTwitterLegend(slug);

  // Fetch live prices for legend holdings if available.
  const priceMap = legend
    ? await getPriceSeriesBatch(legend.holdings.map((h) => h.ticker)).catch(
        () => new Map()
      )
    : new Map();

  const rows = legend
    ? legend.holdings.map((h) => {
        const series = priceMap.get(h.ticker.replace(/\./g, "-").toUpperCase());
        return {
          ...h,
          price: series?.current ?? null,
          change: series && series.previousClose
            ? ((series.current - series.previousClose) / series.previousClose) * 100
            : null,
        };
      })
    : [];

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-24">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Investors
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-400">Twitter Legends</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{investor.name}</span>
      </div>

      <div className="flex items-center gap-5">
        <Avatar
          seed={investor.slug}
          label={investor.manager}
          image={photoOrPerson(investor.slug, investor.manager)}
          size={80}
        />
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {investor.name}
          </h1>
          <p className="text-ink-500 mt-1">
            {legend?.handle ?? investor.manager}
          </p>
        </div>
      </div>

      <p className="mt-5 text-ink-400 text-sm uppercase tracking-wide">
        {investor.tagline}
      </p>

      {legend ? (
        <>
          {/* Holdings table */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Known holdings
              </h2>
              <span className="text-xs text-ink-400">As of {legend.asOf}</span>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-ink-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Asset</th>
                      <th className="text-right font-medium px-4 py-3">Est. Weight</th>
                      <th className="text-right font-medium px-4 py-3">Price</th>
                      <th className="text-right font-medium px-4 py-3">Today</th>
                      <th className="text-left font-medium px-4 py-3 hidden md:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {rows.map((r) => (
                      <tr key={r.ticker} className="hover:bg-ink-50/60 align-top">
                        <td className="px-4 py-3">
                          <TickerLink
                            ticker={r.ticker}
                            className="font-semibold text-ink-900"
                          />
                          <div className="text-xs text-ink-500">
                            <Link
                              href={`/stock/${encodeURIComponent(r.ticker.toUpperCase())}`}
                              className="hover:text-accent-dark hover:underline"
                            >
                              {r.name}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium">
                          ~{r.weightPct}%
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {r.price != null ? `$${r.price.toFixed(2)}` : "—"}
                        </td>
                        <td
                          className={
                            "px-4 py-3 text-right tabular-nums font-medium " +
                            (r.change == null
                              ? "text-ink-400"
                              : r.change >= 0
                              ? "text-accent-dark"
                              : "text-loss")
                          }
                        >
                          {r.change == null
                            ? "—"
                            : `${r.change >= 0 ? "+" : ""}${r.change.toFixed(2)}%`}
                        </td>
                        <td className="px-4 py-3 text-ink-600 hidden md:table-cell max-w-xs">
                          {r.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-2 text-xs text-ink-400">
              Source: {legend.source}. Weights are approximate estimates, not
              verified filings. Prices via Yahoo Finance. Not investment advice.
            </p>
          </section>
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-6">
          <div className="flex items-center gap-2 text-accent-dark font-semibold mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M12 7v6M12 16v.01"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            Coming soon
          </div>
          <p className="text-ink-700 leading-relaxed">{investor.description}</p>
        </div>
      )}

      <AboutCard
        name={investor.name}
        bio={getBio(investor.slug) ?? legend?.bio}
      />

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Explore more</h2>
        <ul className="space-y-2 text-ink-700">
          <li>
            ·{" "}
            <Link href="/" className="underline underline-offset-2">
              Browse the 10 real 13F filers we track
            </Link>
          </li>
          <li>
            ·{" "}
            <Link href="/search" className="underline underline-offset-2">
              Search any institutional investor by name
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
