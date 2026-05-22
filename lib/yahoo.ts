// Yahoo Finance financial fundamentals for stock detail pages.
// Uses v7/finance/quote and v10/finance/quoteSummary endpoints.
// The same data yfinance (Python) fetches — requires crumb auth since 2024.

import { getYahooAuth, yahooHeaders } from "./yahooAuth";

const REVALIDATE = 60 * 60 * 6; // 6h

export type StockFinancials = {
  ticker: string;
  marketCap: number | null;
  trailingPE: number | null;
  forwardPE: number | null;
  trailingEps: number | null;
  revenue: number | null;
  ebitda: number | null;
  grossProfits: number | null;
  profitMargin: number | null;
  beta: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  priceToBook: number | null;
  bookValue: number | null;
  enterpriseValue: number | null;
  revenuePerShare: number | null;
  returnOnAssets: number | null;
  returnOnEquity: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  totalCash: number | null;
  totalDebt: number | null;
  freeCashflow: number | null;
  operatingCashflow: number | null;
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  grossMargins: number | null;
  operatingMargins: number | null;
  sharesOutstanding: number | null;
  averageVolume: number | null;
};

export async function getStockFinancials(
  ticker: string
): Promise<StockFinancials | null> {
  const ySym = ticker.replace(/\./g, "-").toUpperCase();

  const auth = await getYahooAuth();
  const crumb = auth?.crumb ?? "";
  const cookie = auth?.cookie ?? "";
  const crumbParam = crumb ? `&crumb=${encodeURIComponent(crumb)}` : "";
  const hdrs = cookie
    ? yahooHeaders(cookie)
    : { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

  // v7/finance/quote — key fundamentals and market data.
  const quoteUrl =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(ySym)}&fields=` +
    `marketCap,trailingPE,forwardPE,trailingEps,epsTrailingTwelveMonths,` +
    `epsForward,fiftyTwoWeekHigh,fiftyTwoWeekLow,beta,` +
    `trailingAnnualDividendYield,bookValue,priceToBook,` +
    `sharesOutstanding,averageAnalystRating,averageDailyVolume3Month` +
    crumbParam;

  // v10/finance/quoteSummary — deeper financials (margins, cash flow, etc.)
  const summaryUrl =
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/` +
    `${encodeURIComponent(ySym)}?modules=financialData,defaultKeyStatistics` +
    crumbParam;

  try {
    const [quoteRes, summaryRes] = await Promise.all([
      fetch(quoteUrl, {
        headers: hdrs,
        next: { revalidate: REVALIDATE },
      }).catch(() => null),
      fetch(summaryUrl, {
        headers: hdrs,
        next: { revalidate: REVALIDATE },
      }).catch(() => null),
    ]);

    const quoteData =
      quoteRes?.ok ? await quoteRes.json().catch(() => null) : null;
    const summaryData =
      summaryRes?.ok ? await summaryRes.json().catch(() => null) : null;

    const q = quoteData?.quoteResponse?.result?.[0] ?? {};
    const fin =
      summaryData?.quoteSummary?.result?.[0]?.financialData ?? {};
    const stats =
      summaryData?.quoteSummary?.result?.[0]?.defaultKeyStatistics ?? {};

    // Merge fields from both sources, preferring summary for fundamentals.
    return {
      ticker: ySym,
      marketCap: q.marketCap ?? stats.marketCap?.raw ?? null,
      trailingPE: q.trailingPE ?? stats.trailingPE?.raw ?? null,
      forwardPE:
        q.forwardPE ?? stats.forwardPE?.raw ?? fin.forwardPE?.raw ?? null,
      trailingEps:
        q.epsTrailingTwelveMonths ??
        q.trailingEps ??
        stats.trailingEps?.raw ??
        null,
      revenue: fin.totalRevenue?.raw ?? null,
      ebitda: fin.ebitda?.raw ?? null,
      grossProfits: fin.grossProfits?.raw ?? null,
      profitMargin: fin.profitMargins?.raw ?? null,
      beta: q.beta ?? stats.beta?.raw ?? null,
      dividendYield:
        q.trailingAnnualDividendYield ?? stats.dividendYield?.raw ?? null,
      fiftyTwoWeekHigh:
        q.fiftyTwoWeekHigh ?? stats.fiftyTwoWeekHigh?.raw ?? null,
      fiftyTwoWeekLow:
        q.fiftyTwoWeekLow ?? stats.fiftyTwoWeekLow?.raw ?? null,
      priceToBook: q.priceToBook ?? stats.priceToBook?.raw ?? null,
      bookValue: q.bookValue ?? stats.bookValue?.raw ?? null,
      enterpriseValue: stats.enterpriseValue?.raw ?? null,
      revenuePerShare: fin.revenuePerShare?.raw ?? null,
      returnOnAssets: fin.returnOnAssets?.raw ?? null,
      returnOnEquity: fin.returnOnEquity?.raw ?? null,
      debtToEquity: fin.debtToEquity?.raw ?? null,
      currentRatio: fin.currentRatio?.raw ?? null,
      totalCash: fin.totalCash?.raw ?? null,
      totalDebt: fin.totalDebt?.raw ?? null,
      freeCashflow: fin.freeCashflow?.raw ?? null,
      operatingCashflow: fin.operatingCashflow?.raw ?? null,
      revenueGrowth: fin.revenueGrowth?.raw ?? null,
      earningsGrowth: fin.earningsGrowth?.raw ?? null,
      grossMargins: fin.grossMargins?.raw ?? null,
      operatingMargins: fin.operatingMargins?.raw ?? null,
      sharesOutstanding:
        q.sharesOutstanding ?? stats.sharesOutstanding?.raw ?? null,
      averageVolume: q.averageDailyVolume3Month ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Financial-statement history ──────────────────────────────────────────────

export type StatementRow = { date: string; value: number | null };
export type StatementSection = { label: string; rows: StatementRow[] };

export type StockStatements = {
  ticker: string;
  incomeAnnual: StatementSection[];
  incomeQuarterly: StatementSection[];
  balanceAnnual: StatementSection[];
  cashflowAnnual: StatementSection[];
};

function pickRaw(items: any[], field: string): StatementRow[] {
  return items
    .map((item: any) => ({
      date: new Date(
        (item.endDate?.raw ?? 0) * 1000
      )
        .toISOString()
        .slice(0, 10),
      value: item[field]?.raw ?? null,
    }))
    .filter((r) => r.date !== "1970-01-01");
}

/** Fetch annual and quarterly income statements, balance sheets, and cash flows. */
export async function getStockStatements(
  ticker: string
): Promise<StockStatements | null> {
  const ySym = ticker.replace(/\./g, "-").toUpperCase();

  const auth = await getYahooAuth();
  const crumb = auth?.crumb ?? "";
  const cookie = auth?.cookie ?? "";
  const crumbParam = crumb ? `&crumb=${encodeURIComponent(crumb)}` : "";
  const hdrs = cookie
    ? yahooHeaders(cookie)
    : { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

  const modules = [
    "incomeStatementHistory",
    "incomeStatementHistoryQuarterly",
    "balanceSheetHistory",
    "cashflowStatementHistory",
  ].join(",");

  const url =
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/` +
    `${encodeURIComponent(ySym)}?modules=${modules}` +
    crumbParam;

  try {
    const res = await fetch(url, {
      headers: hdrs,
      next: { revalidate: REVALIDATE },
    }).catch(() => null);

    if (!res?.ok) return null;
    const data = await res.json().catch(() => null);
    const result = data?.quoteSummary?.result?.[0] ?? {};

    const incStmts: any[] =
      result.incomeStatementHistory?.incomeStatementHistory ?? [];
    const incStmtsQ: any[] =
      result.incomeStatementHistoryQuarterly?.incomeStatementHistory ?? [];
    const balSheets: any[] =
      result.balanceSheetHistory?.balanceSheetStatements ?? [];
    const cfStmts: any[] =
      result.cashflowStatementHistory?.cashflowStatements ?? [];

    return {
      ticker: ySym,
      incomeAnnual: [
        { label: "Total Revenue", rows: pickRaw(incStmts, "totalRevenue") },
        { label: "Gross Profit", rows: pickRaw(incStmts, "grossProfit") },
        {
          label: "Operating Income",
          rows: pickRaw(incStmts, "operatingIncome"),
        },
        { label: "Net Income", rows: pickRaw(incStmts, "netIncome") },
        { label: "EBITDA", rows: pickRaw(incStmts, "ebitda") },
      ],
      incomeQuarterly: [
        { label: "Total Revenue", rows: pickRaw(incStmtsQ, "totalRevenue") },
        { label: "Gross Profit", rows: pickRaw(incStmtsQ, "grossProfit") },
        {
          label: "Operating Income",
          rows: pickRaw(incStmtsQ, "operatingIncome"),
        },
        { label: "Net Income", rows: pickRaw(incStmtsQ, "netIncome") },
      ],
      balanceAnnual: [
        { label: "Total Assets", rows: pickRaw(balSheets, "totalAssets") },
        {
          label: "Total Liabilities",
          rows: pickRaw(balSheets, "totalLiab"),
        },
        {
          label: "Stockholders' Equity",
          rows: pickRaw(balSheets, "totalStockholderEquity"),
        },
        {
          label: "Cash & Equivalents",
          rows: pickRaw(balSheets, "cash"),
        },
        { label: "Total Debt", rows: pickRaw(balSheets, "totalDebt") },
      ],
      cashflowAnnual: [
        {
          label: "Operating Cash Flow",
          rows: pickRaw(
            cfStmts,
            "totalCashFromOperatingActivities"
          ),
        },
        {
          label: "Capital Expenditures",
          rows: pickRaw(cfStmts, "capitalExpenditures"),
        },
        {
          label: "Free Cash Flow",
          rows: pickRaw(cfStmts, "freeCashFlow"),
        },
      ],
    };
  } catch {
    return null;
  }
}
