import { get13FFilings, getFilingHoldings, type FilingRef } from "@/lib/edgar";

export type PerformanceWindow = "1Q" | "6M" | "1Y" | "2Y";

export const WINDOW_LABEL: Record<PerformanceWindow, string> = {
  "1Q": "1Q",
  "6M": "6M",
  "1Y": "1Y",
  "2Y": "2Y",
};

const WINDOW_FILING_OFFSET: Record<PerformanceWindow, number> = {
  "1Q": 1,
  "6M": 2,
  "1Y": 4,
  "2Y": 8,
};

export type FundPerformance = {
  cik: string;
  latestReportDate: string;
  currentValueUsd: number;
  results: Partial<
    Record<
      PerformanceWindow,
      {
        priorReportDate: string;
        priorValueUsd: number;
        deltaPct: number;
      }
    >
  >;
};

/**
 * Returns the latest portfolio value plus the % change vs each timeframe.
 *
 * Important caveat: 13F filings report position values at quarter-end based
 * on then-current prices, but the totals also reflect inflows/outflows and
 * trading activity, not just price returns. We label this clearly in the UI
 * as "13F portfolio value change" rather than "total return".
 */
export async function getFundPerformance(
  cik: string
): Promise<FundPerformance | null> {
  let filings: FilingRef[];
  try {
    filings = await get13FFilings(cik);
  } catch {
    return null;
  }
  filings = filings.filter((f) => f.form === "13F-HR");
  if (filings.length === 0) return null;

  const latest = filings[0];
  const latestHoldings = await getFilingHoldings(cik, latest.accessionRaw);
  if (!latestHoldings) return null;
  const currentValueUsd = latestHoldings.totalValueUsd;

  const results: FundPerformance["results"] = {};

  const windows: PerformanceWindow[] = ["1Q", "6M", "1Y", "2Y"];
  await Promise.all(
    windows.map(async (w) => {
      const offset = WINDOW_FILING_OFFSET[w];
      const prior = filings[offset];
      if (!prior) return;
      const priorHoldings = await getFilingHoldings(cik, prior.accessionRaw);
      if (!priorHoldings || priorHoldings.totalValueUsd === 0) return;
      const deltaPct =
        ((currentValueUsd - priorHoldings.totalValueUsd) /
          priorHoldings.totalValueUsd) *
        100;
      results[w] = {
        priorReportDate: prior.reportDate,
        priorValueUsd: priorHoldings.totalValueUsd,
        deltaPct,
      };
    })
  );

  return {
    cik,
    latestReportDate: latest.reportDate,
    currentValueUsd,
    results,
  };
}

export type RankedFund = {
  cik: string;
  perf: FundPerformance;
};

export async function getPerformanceForAll(
  ciks: string[]
): Promise<Map<string, FundPerformance>> {
  const out = new Map<string, FundPerformance>();
  const results = await Promise.all(
    ciks.map((cik) =>
      getFundPerformance(cik).catch(() => null as FundPerformance | null)
    )
  );
  results.forEach((p, i) => {
    if (p) out.set(ciks[i], p);
  });
  return out;
}
