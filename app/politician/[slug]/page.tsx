import Link from "next/link";
import { notFound } from "next/navigation";
import { getPolitician, POLITICIANS } from "@/data/politicians";
import { getPoliticianActivity } from "@/lib/politicians";
import { Avatar } from "@/components/Avatar";
import { AboutCard } from "@/components/AboutCard";
import { WatchlistButton } from "@/components/WatchlistButton";
import { getBio } from "@/data/bios";
import { photoOrPerson } from "@/lib/avatars";
import { PoliticianTrades } from "@/components/PoliticianTrades";
import { formatDate, formatUsd } from "@/lib/format";

export const revalidate = 43200; // 12h

export function generateStaticParams() {
  return POLITICIANS.map((p) => ({ slug: p.slug }));
}

export default async function PoliticianPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const politician = getPolitician(slug);
  if (!politician) notFound();

  const activity = await getPoliticianActivity(politician).catch(() => null);
  const partyColor = politician.party === "D" ? "#1A73E8" : "#D93025";

  const buys =
    activity?.trades.filter((t) => t.type === "purchase").length ?? 0;
  const sells = activity?.trades.filter((t) => t.type === "sale").length ?? 0;

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Portfolios
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">Politicians</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{politician.name}</span>
      </div>

      <header className="flex items-center gap-5">
        <Avatar
          seed={politician.slug}
          label={politician.name}
          image={photoOrPerson(politician.slug, politician.name)}
          badge={politician.party}
          badgeColor={partyColor}
          size={72}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
            {politician.name}
          </h1>
          <p className="mt-1 text-ink-500">
            {politician.role} · {politician.party}-{politician.state} ·{" "}
            {politician.chamber}
          </p>
        </div>
        <WatchlistButton
          slug={politician.slug}
          size={24}
          className="rounded-full border border-ink-200 p-2 hover:bg-ink-50"
        />
      </header>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Disclosed trades" value={String(activity?.totalTrades ?? 0)} />
        <Stat
          label="Est. volume"
          value={
            activity ? formatUsd(activity.estimatedVolume, { compact: true }) : "—"
          }
          sub="Midpoint of disclosed ranges"
        />
        <Stat label="Buys / Sells" value={`${buys} / ${sells}`} />
        <Stat
          label="Last trade"
          value={activity?.lastTradeDate ? formatDate(activity.lastTradeDate) : "—"}
        />
      </div>

      <AboutCard name={politician.name} bio={getBio(politician.slug)} />

      <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-600">
        These are congressional STOCK Act Periodic Transaction Reports — not SEC
        13F filings. Amounts are disclosed only as broad ranges. Data via the
        community house-stock-watcher dataset.
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Disclosed trades</h2>
        {activity && activity.trades.length > 0 ? (
          <PoliticianTrades trades={activity.trades} />
        ) : (
          <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center text-ink-500 shadow-card">
            No trades loaded. The STOCK Act dataset may be temporarily
            unavailable — it refreshes automatically.
          </div>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        {POLITICIANS.filter((p) => p.slug !== politician.slug)
          .slice(0, 4)
          .map((p) => (
            <Link
              key={p.slug}
              href={`/politician/${p.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition"
            >
              {p.name} →
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
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="text-xs uppercase tracking-wide text-ink-400">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-ink-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}
