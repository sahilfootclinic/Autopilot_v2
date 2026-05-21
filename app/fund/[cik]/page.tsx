import Link from "next/link";
import { notFound } from "next/navigation";
import {
  get13FFilings,
  getFilerProfile,
  getFilingHoldings,
  getQoQDiff,
  type Holding,
} from "@/lib/edgar";
import { getInvestor } from "@/lib/investors";
import {
  formatDate,
  formatNumber,
  formatPercent,
  formatUsd,
  quarterLabel,
} from "@/lib/format";
import { HoldingsTable, type HoldingPrice } from "@/components/HoldingsTable";
import { ChangesPanel } from "@/components/ChangesPanel";
import { AboutCard } from "@/components/AboutCard";
import { Avatar } from "@/components/Avatar";
import { WatchlistButton } from "@/components/WatchlistButton";
import { QuarterSwitcher } from "@/components/QuarterSwitcher";
import { getBio } from "@/data/bios";
import { photoOrPerson } from "@/lib/avatars";
import { cusipsToTickers, getPriceSeriesBatch, isoToUnix } from "@/lib/prices";

export const revalidate = 21600;

export default async function FundPage({
  params,
  searchParams,
}: {
  params: Promise<{ cik: string }>;
  searchParams: Promise<{ accession?: string }>;
}) {
  const { cik: cikParam } = await params;
  const { accession } = await searchParams;
  const cik = cikParam.replace(/^0+/, "");
  let profile;
  try {
    profile = await getFilerProfile(cik);
  } catch {
    notFound();
  }
  const filings = profile.filings.filter(
    (f) => f.form === "13F-HR" || f.form === "13F-HR/A"
  );
  if (filings.length === 0) {
    return <NoFilings name={profile.name} cik={cik} />;
  }

  const selected =
    filings.find((f) => f.accessionRaw === accession) ?? filings[0];
  const [holdings, diff] = await Promise.all([
    getFilingHoldings(cik, selected.accessionRaw),
    getQoQDiff(cik, selected.accessionRaw).catch(() => null),
  ]);

  const investor = getInvestor(cik);
  const displayManager = investor?.manager ?? profile.name;
  const displayFirm = investor?.name ?? profile.name;
  const tagline = investor?.tagline;

  // Collapse duplicate rows (a 13F can list the same security several
  // times) into one line per security.
  const top = holdings
    ? aggregateHoldings(holdings.holdings).sort((a, b) => b.value - a.value)
    : [];
  const top10Value = top.slice(0, 10).reduce((s, h) => s + h.value, 0);
  const top10Pct = holdings && holdings.totalValueUsd
    ? (top10Value / holdings.totalValueUsd) * 100
    : 0;

  // Live prices for the largest holdings, plus the move since the filing date.
  const priceByCusip = await resolvePrices(
    top.slice(0, 40),
    selected.reportDate
  ).catch(() => ({}) as Record<string, HoldingPrice>);

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Investors
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{displayFirm}</span>
      </div>

      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex items-center gap-5">
          <Avatar
            seed={displayManager}
            label={displayManager}
            image={photoOrPerson(investor?.slug ?? "", displayManager)}
            size={72}
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900">
              {displayManager}
            </h1>
            <p className="mt-2 text-ink-500 text-lg">{displayFirm}</p>
            {tagline && (
              <p className="mt-1 text-ink-400 text-sm uppercase tracking-wide">
                {tagline}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          {investor && (
            <WatchlistButton
              slug={investor.slug}
              size={22}
              className="rounded-full border border-ink-200 p-2 hover:bg-ink-50"
            />
          )}
          <a
            href={`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=13F&dateb=&owner=include&count=40`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 transition"
          >
            View on SEC EDGAR ↗
          </a>
        </div>
      </header>

      {/* Stat grid */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat
          label="Reporting period"
          value={quarterLabel(selected.reportDate)}
          sub={`Filed ${formatDate(selected.filingDate)}`}
        />
        <Stat
          label="Portfolio value"
          value={
            holdings ? formatUsd(holdings.totalValueUsd, { compact: true }) : "—"
          }
          sub="Reported 13F long positions"
        />
        <Stat
          label="Positions"
          value={holdings ? formatNumber(top.length) : "—"}
          sub="Distinct securities"
        />
        <Stat
          label="Top 10 concentration"
          value={formatPercent(top10Pct, 1)}
          sub="Of portfolio in top 10"
        />
      </div>

      {/* Quarter switcher */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Quarters</h2>
        <QuarterSwitcher
          cik={cik}
          filings={filings.map((f) => ({
            accessionRaw: f.accessionRaw,
            reportDate: f.reportDate,
            form: f.form,
          }))}
          selectedAccession={selected.accessionRaw}
        />
      </div>

      {investor && (
        <AboutCard name={investor.manager} bio={getBio(investor.slug)} />
      )}

      {/* Holdings */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">
          Holdings —{" "}
          <span className="text-ink-500 font-normal">
            {quarterLabel(selected.reportDate)}
          </span>
        </h2>
        {holdings && holdings.holdings.length > 0 ? (
          <HoldingsTable
            holdings={top}
            totalValueUsd={holdings.totalValueUsd}
            priceByCusip={priceByCusip}
          />
        ) : (
          <div className="rounded-2xl border border-ink-100 bg-ink-50 p-8 text-ink-500 text-center">
            Couldn't parse the holdings table for this filing. View it on{" "}
            <a
              className="underline"
              href={`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}&type=13F`}
              target="_blank"
              rel="noreferrer"
            >
              SEC EDGAR
            </a>
            .
          </div>
        )}
      </div>

      {/* Changes vs prior quarter */}
      {diff && (
        <div className="mt-12">
          <ChangesPanel
            diff={diff}
            currentQuarter={quarterLabel(selected.reportDate)}
          />
        </div>
      )}
    </div>
  );
}

function aggregateHoldings(list: Holding[]): Holding[] {
  const map = new Map<string, Holding>();
  for (const h of list) {
    if (!h.cusip) continue;
    const key = `${h.cusip.trim().toUpperCase()}|${h.putCall ?? ""}`;
    const existing = map.get(key);
    if (existing) {
      existing.shares += h.shares;
      existing.value += h.value;
    } else {
      map.set(key, { ...h });
    }
  }
  return [...map.values()];
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

async function resolvePrices(
  holdings: Holding[],
  reportDate: string
): Promise<Record<string, HoldingPrice>> {
  const out: Record<string, HoldingPrice> = {};
  // Skip option rows — pricing the underlying would be misleading.
  const equities = holdings.filter((h) => !h.putCall && h.cusip);
  if (equities.length === 0) return out;

  const cusipTickers = await cusipsToTickers(equities.map((h) => h.cusip));
  if (cusipTickers.size === 0) return out;

  const reportUnix = isoToUnix(reportDate);
  const series = await getPriceSeriesBatch(
    Array.from(new Set(cusipTickers.values())),
    reportUnix
  );

  for (const h of equities) {
    const ticker = cusipTickers.get(h.cusip.trim().toUpperCase());
    if (!ticker) continue;
    const s = series.get(ticker.replace(/\./g, "-").toUpperCase());
    if (!s) continue;
    out[h.cusip] = {
      ticker,
      price: s.current,
      sinceReturn:
        s.atSince && s.atSince > 0
          ? (s.current / s.atSince - 1) * 100
          : null,
    };
  }
  return out;
}

function NoFilings({ name, cik }: { name: string; cik: string }) {
  return (
    <div className="mx-auto max-w-page px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">{name}</h1>
      <p className="mt-2 text-ink-500">
        No 13F filings found for this filer (CIK {cik}).
      </p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        ← Back to investors
      </Link>
    </div>
  );
}
