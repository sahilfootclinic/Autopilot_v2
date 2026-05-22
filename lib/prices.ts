// Real-time-ish price data via Yahoo Finance's public chart endpoint,
// plus CUSIP -> ticker resolution via the free OpenFIGI mapping API.
//
// Yahoo requires a crumb token + session cookie since 2024 (same as yfinance).
// OpenFIGI allows 25 requests/min anonymously (each request maps up to 10 ids).

import { getYahooAuth, yahooHeaders } from "./yahooAuth";

const PRICE_REVALIDATE = 60 * 30; // 30 min
const FIGI_REVALIDATE = 60 * 60 * 24 * 7; // 7 days — CUSIP↔ticker rarely changes

export type PriceSeries = {
  symbol: string;
  currency: string;
  current: number;
  /** close nearest to the requested `since` date */
  atSince: number | null;
  /** previous close, for day change */
  previousClose: number | null;
};

/** Map over items with bounded concurrency. */
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker)
  );
  return results;
}

/**
 * Fetches a daily price series for one symbol and returns the current price
 * plus the close nearest to `sinceUnix` (seconds). Returns null on failure.
 */
export async function getPriceSeries(
  symbol: string,
  sinceUnix?: number
): Promise<PriceSeries | null> {
  if (!symbol) return null;
  // Yahoo uses dashes for share classes (BRK.B -> BRK-B).
  const ySym = symbol.replace(/\./g, "-").toUpperCase();
  const now = Math.floor(Date.now() / 1000);
  const period1 = sinceUnix
    ? Math.min(sinceUnix, now - 86400)
    : now - 86400 * 7;

  const auth = await getYahooAuth();
  const crumb = auth?.crumb ?? "";
  const cookie = auth?.cookie ?? "";

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySym)}` +
    `?period1=${period1}&period2=${now}&interval=1d` +
    (crumb ? `&crumb=${encodeURIComponent(crumb)}` : "");

  try {
    const res = await fetch(url, {
      headers: cookie
        ? yahooHeaders(cookie)
        : { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      next: { revalidate: PRICE_REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    const meta = result.meta ?? {};
    const current: number =
      meta.regularMarketPrice ?? meta.previousClose ?? 0;
    if (!current) return null;
    const closes: (number | null)[] =
      result.indicators?.quote?.[0]?.close ?? [];
    const firstValid = closes.find((c) => typeof c === "number") ?? null;
    return {
      symbol: ySym,
      currency: meta.currency ?? "USD",
      current,
      atSince: sinceUnix ? firstValid : null,
      previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
    };
  } catch {
    return null;
  }
}

export async function getPriceSeriesBatch(
  symbols: string[],
  sinceUnix?: number
): Promise<Map<string, PriceSeries>> {
  const unique = Array.from(new Set(symbols.filter(Boolean)));
  const out = new Map<string, PriceSeries>();
  const series = await mapLimit(unique, 6, (s) =>
    getPriceSeries(s, sinceUnix)
  );
  unique.forEach((s, i) => {
    const v = series[i];
    if (v) out.set(s.toUpperCase(), v);
  });
  return out;
}

// ----- CUSIP -> ticker via OpenFIGI -----

const figiCache = new Map<string, string | null>();
const US_EXCHANGES = new Set(["US", "UN", "UQ", "UW", "UA", "UR", "UP", "UV"]);

export async function cusipsToTickers(
  cusips: string[]
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const need: string[] = [];
  for (const raw of cusips) {
    const cusip = (raw || "").trim().toUpperCase();
    if (!cusip || cusip.length < 6) continue;
    if (figiCache.has(cusip)) {
      const cached = figiCache.get(cusip);
      if (cached) out.set(cusip, cached);
    } else if (!need.includes(cusip)) {
      need.push(cusip);
    }
  }
  if (need.length === 0) return out;

  // OpenFIGI: max 10 jobs per anonymous request.
  const apiKey = process.env.OPENFIGI_API_KEY;
  const chunkSize = apiKey ? 100 : 10;
  const chunks: string[][] = [];
  for (let i = 0; i < need.length; i += chunkSize) {
    chunks.push(need.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (apiKey) headers["X-OPENFIGI-APIKEY"] = apiKey;
      const res = await fetch("https://api.openfigi.com/v3/mapping", {
        method: "POST",
        headers,
        body: JSON.stringify(
          chunk.map((c) => ({ idType: "ID_CUSIP", idValue: c }))
        ),
        next: { revalidate: FIGI_REVALIDATE },
      });
      if (!res.ok) {
        // Rate limited or down — skip; cards just won't show live prices.
        chunk.forEach((c) => figiCache.set(c, null));
        continue;
      }
      const data = await res.json();
      data.forEach((entry: any, idx: number) => {
        const cusip = chunk[idx];
        const rows: any[] = entry?.data ?? [];
        const usRow =
          rows.find((r) => US_EXCHANGES.has(r.exchCode)) ?? rows[0];
        const ticker: string | null = usRow?.ticker ?? null;
        figiCache.set(cusip, ticker);
        if (ticker) out.set(cusip, ticker);
      });
    } catch {
      chunk.forEach((c) => figiCache.set(c, null));
    }
  }
  return out;
}

/** Treasury-day timestamp for an ISO date (YYYY-MM-DD). */
export function isoToUnix(iso: string): number | undefined {
  if (!iso) return undefined;
  const t = Date.parse(iso + "T00:00:00Z");
  return Number.isNaN(t) ? undefined : Math.floor(t / 1000);
}
