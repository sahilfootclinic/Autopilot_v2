import { INVESTORS_13F } from "@/lib/investors";
import { get13FFilings, getFilingHoldings } from "@/lib/edgar";
import { cusipsToTickers } from "@/lib/prices";

// Reverse index: ticker -> the tracked hedge funds that hold it.
//
// Built from each fund's most recent 13F. To keep CUSIP->ticker
// resolution bounded we only index each fund's largest positions —
// the holdings that actually signal conviction. The whole index is
// cached in-process; set OPENFIGI_API_KEY to make the cold build fast.

export type WhaleHolding = {
  cik: string;
  slug: string;
  fundName: string;
  manager: string;
  ticker: string;
  nameOfIssuer: string;
  value: number;
  shares: number;
  portfolioPct: number;
  reportDate: string;
};

const TOP_N_PER_FUND = 12;
const TTL_MS = 1000 * 60 * 60 * 24; // 24h

let cached: Map<string, WhaleHolding[]> | null = null;
let cachedAt = 0;
let building: Promise<Map<string, WhaleHolding[]>> | null = null;

async function indexFund(
  inv: (typeof INVESTORS_13F)[number],
  index: Map<string, WhaleHolding[]>
): Promise<void> {
  const cik = inv.cik!;
  const filings = await get13FFilings(cik);
  const latest = filings.find((f) => f.form === "13F-HR");
  if (!latest) return;
  const holdings = await getFilingHoldings(cik, latest.accessionRaw);
  if (!holdings || holdings.holdings.length === 0) return;

  const top = [...holdings.holdings]
    .filter((h) => !h.putCall && h.cusip)
    .sort((a, b) => b.value - a.value)
    .slice(0, TOP_N_PER_FUND);

  const tickerMap = await cusipsToTickers(top.map((h) => h.cusip));

  for (const h of top) {
    const ticker = tickerMap.get(h.cusip.trim().toUpperCase());
    if (!ticker) continue;
    const key = ticker.toUpperCase();
    const entry: WhaleHolding = {
      cik,
      slug: inv.slug,
      fundName: inv.name,
      manager: inv.manager,
      ticker: key,
      nameOfIssuer: h.nameOfIssuer,
      value: h.value,
      shares: h.shares,
      portfolioPct: holdings.totalValueUsd
        ? (h.value / holdings.totalValueUsd) * 100
        : 0,
      reportDate: holdings.reportDate,
    };
    const arr = index.get(key);
    if (arr) arr.push(entry);
    else index.set(key, [entry]);
  }
}

async function buildIndex(): Promise<Map<string, WhaleHolding[]>> {
  const index = new Map<string, WhaleHolding[]>();
  await Promise.all(
    INVESTORS_13F.map((inv) =>
      indexFund(inv, index).catch(() => {
        /* one fund failing shouldn't sink the index */
      })
    )
  );
  for (const arr of index.values()) arr.sort((a, b) => b.value - a.value);
  return index;
}

export async function getWhaleIndex(): Promise<Map<string, WhaleHolding[]>> {
  const now = Date.now();
  if (cached && now - cachedAt < TTL_MS) return cached;
  if (building) return building;
  building = buildIndex()
    .then((idx) => {
      cached = idx;
      cachedAt = Date.now();
      return idx;
    })
    .finally(() => {
      building = null;
    });
  return building;
}

export async function whalesHolding(ticker: string): Promise<WhaleHolding[]> {
  const key = ticker.trim().toUpperCase().replace(/\./g, "-");
  const idx = await getWhaleIndex();
  return idx.get(key) ?? [];
}
