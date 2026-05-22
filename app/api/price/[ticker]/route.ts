import { NextRequest, NextResponse } from "next/server";
import { getYahooAuth, yahooHeaders, YAHOO_UA } from "@/lib/yahooAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = decodeURIComponent(rawTicker).replace(/\./g, "-").toUpperCase();

  const auth = await getYahooAuth();
  const now = Math.floor(Date.now() / 1000);
  const period1 = now - 86400 * 35; // ~35 days for 1M return

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
    `?period1=${period1}&period2=${now}&interval=1d` +
    (auth?.crumb ? `&crumb=${encodeURIComponent(auth.crumb)}` : "");

  const headers = auth?.cookie
    ? yahooHeaders(auth.cookie)
    : { "User-Agent": YAHOO_UA, Accept: "application/json,*/*" };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream" }, { status: 502 });
    }
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) {
      return NextResponse.json({ error: "no data" }, { status: 404 });
    }

    const meta = result.meta ?? {};
    const price: number = meta.regularMarketPrice ?? meta.previousClose ?? 0;
    if (!price) {
      return NextResponse.json({ error: "no price" }, { status: 404 });
    }

    const closes: (number | null)[] =
      result.indicators?.quote?.[0]?.close ?? [];
    const firstValid = closes.find((c) => typeof c === "number") ?? null;
    const ret =
      firstValid && price ? ((price / firstValid) * 100 - 100) : null;

    return NextResponse.json(
      { price, ret, currency: meta.currency ?? "USD" },
      { headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
