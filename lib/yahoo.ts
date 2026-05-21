// Yahoo Finance financial fundamentals for stock detail pages.
// Uses the v7/finance/quote endpoint (no API key, no crumb required).

const YAHOO_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
};

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
  // v7/finance/quote returns a rich quote object including most key fundamentals.
  const quoteUrl =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(ySym)}&fields=` +
    `marketCap,trailingPE,forwardPE,trailingEps,epsTrailingTwelveMonths,` +
    `epsForward,fiftyTwoWeekHigh,fiftyTwoWeekLow,beta,` +
    `trailingAnnualDividendYield,bookValue,priceToBook,` +
    `sharesOutstanding,averageAnalystRating,averageDailyVolume3Month`;

  // v10/finance/quoteSummary for deeper financials.
  const summaryUrl =
    `https://query1.finance.yahoo.com/v10/finance/quoteSummary/` +
    `${encodeURIComponent(ySym)}?modules=financialData,defaultKeyStatistics`;

  try {
    const [quoteRes, summaryRes] = await Promise.all([
      fetch(quoteUrl, {
        headers: YAHOO_HEADERS,
        next: { revalidate: REVALIDATE },
      }).catch(() => null),
      fetch(summaryUrl, {
        headers: YAHOO_HEADERS,
        next: { revalidate: REVALIDATE },
      }).catch(() => null),
    ]);

    const quoteData = quoteRes?.ok ? await quoteRes.json().catch(() => null) : null;
    const summaryData = summaryRes?.ok
      ? await summaryRes.json().catch(() => null)
      : null;

    const q = quoteData?.quoteResponse?.result?.[0] ?? {};
    const fin = summaryData?.quoteSummary?.result?.[0]?.financialData ?? {};
    const stats = summaryData?.quoteSummary?.result?.[0]?.defaultKeyStatistics ?? {};

    // Merge fields from both sources, preferring summary for fundamentals.
    return {
      ticker: ySym,
      marketCap: q.marketCap ?? stats.marketCap?.raw ?? null,
      trailingPE: q.trailingPE ?? stats.trailingPE?.raw ?? null,
      forwardPE: q.forwardPE ?? stats.forwardPE?.raw ?? fin.forwardPE?.raw ?? null,
      trailingEps:
        q.epsTrailingTwelveMonths ?? q.trailingEps ?? stats.trailingEps?.raw ?? null,
      revenue: fin.totalRevenue?.raw ?? null,
      ebitda: fin.ebitda?.raw ?? null,
      grossProfits: fin.grossProfits?.raw ?? null,
      profitMargin: fin.profitMargins?.raw ?? null,
      beta: q.beta ?? stats.beta?.raw ?? null,
      dividendYield:
        q.trailingAnnualDividendYield ?? stats.dividendYield?.raw ?? null,
      fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? stats.fiftyTwoWeekHigh?.raw ?? null,
      fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? stats.fiftyTwoWeekLow?.raw ?? null,
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
