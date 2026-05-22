import { NextRequest, NextResponse } from "next/server";

const YAHOO_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  Accept: "application/json,text/plain,*/*",
};

const PERIOD_CONFIG: Record<string, { range: string; interval: string }> = {
  "1D": { range: "1d", interval: "2m" },
  "5D": { range: "5d", interval: "15m" },
  "1M": { range: "1mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
  "5Y": { range: "5y", interval: "1wk" },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = decodeURIComponent(rawTicker).toUpperCase();
  const period = req.nextUrl.searchParams.get("period") ?? "1M";
  const config = PERIOD_CONFIG[period] ?? PERIOD_CONFIG["1M"];

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
    `?range=${config.range}&interval=${config.interval}&includePrePost=false`;

  try {
    const res = await fetch(url, { headers: YAHOO_HEADERS });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) {
      return NextResponse.json({ error: "no data" }, { status: 404 });
    }

    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] =
      result.indicators?.quote?.[0]?.close ?? [];

    const points = timestamps
      .map((t, i) => ({ t, v: closes[i] }))
      .filter((p): p is { t: number; v: number } => typeof p.v === "number");

    return NextResponse.json(
      { points, currency: result.meta?.currency ?? "USD" },
      {
        headers: {
          "Cache-Control": period === "1D" ? "s-maxage=120" : "s-maxage=1800",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
