import { NextRequest, NextResponse } from "next/server";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const YAHOO_HEADERS: HeadersInit = {
  "User-Agent": UA,
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Referer: "https://finance.yahoo.com/",
  Origin: "https://finance.yahoo.com",
};

// Module-level crumb cache (survives across requests within a server instance)
let cachedCrumb: string | null = null;
let cachedCookie: string | null = null;
let crumbFetchedAt = 0;
const CRUMB_TTL = 60 * 60 * 1000; // 1 hour

const PERIOD_SECONDS: Record<string, number> = {
  "1D": 86400,
  "5D": 86400 * 5,
  "1M": 86400 * 31,
  "6M": 86400 * 182,
  "1Y": 86400 * 365,
  "5Y": 86400 * 365 * 5,
};

const PERIOD_INTERVALS: Record<string, string> = {
  "1D": "2m",
  "5D": "15m",
  "1M": "1d",
  "6M": "1d",
  "1Y": "1d",
  "5Y": "1wk",
};

async function getYahooCrumb(): Promise<{ crumb: string; cookie: string } | null> {
  const now = Date.now();
  if (cachedCrumb && cachedCookie && now - crumbFetchedAt < CRUMB_TTL) {
    return { crumb: cachedCrumb, cookie: cachedCookie };
  }

  try {
    // Step 1: visit Yahoo Finance to get the consent/session cookie
    const consentRes = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
    });
    const rawCookies = consentRes.headers.getSetCookie?.() ??
      (consentRes.headers.get("set-cookie") ?? "").split(/,(?=\s*\w+=)/);
    const cookieStr = rawCookies
      .map((c: string) => c.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");

    // Step 2: fetch the crumb
    const crumbRes = await fetch(
      "https://query1.finance.yahoo.com/v1/test/getcrumb",
      {
        headers: {
          "User-Agent": UA,
          Accept: "text/plain,*/*",
          Cookie: cookieStr,
        },
      }
    );
    if (!crumbRes.ok) return null;
    const crumb = (await crumbRes.text()).trim();
    if (!crumb || crumb.includes("<")) return null; // got HTML, not a crumb

    cachedCrumb = crumb;
    cachedCookie = cookieStr;
    crumbFetchedAt = now;
    return { crumb, cookie: cookieStr };
  } catch {
    return null;
  }
}

async function fetchYahooChart(
  ticker: string,
  period1: number,
  period2: number,
  interval: string
): Promise<Response | null> {
  const auth = await getYahooCrumb();

  for (const host of ["query1.finance.yahoo.com", "query2.finance.yahoo.com"]) {
    let url =
      `https://${host}/v8/finance/chart/${encodeURIComponent(ticker)}` +
      `?period1=${period1}&period2=${period2}&interval=${interval}&includePrePost=false`;
    if (auth?.crumb) url += `&crumb=${encodeURIComponent(auth.crumb)}`;

    const headers: HeadersInit = { ...YAHOO_HEADERS };
    if (auth?.cookie) (headers as Record<string, string>)["Cookie"] = auth.cookie;

    try {
      const res = await fetch(url, { headers });
      if (res.ok) return res;
    } catch {
      // try next host
    }
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker: rawTicker } = await params;
  const ticker = decodeURIComponent(rawTicker).toUpperCase().replace(/\./g, "-");
  const period = req.nextUrl.searchParams.get("period") ?? "1M";

  const seconds = PERIOD_SECONDS[period] ?? PERIOD_SECONDS["1M"];
  const interval = PERIOD_INTERVALS[period] ?? "1d";
  const now = Math.floor(Date.now() / 1000);
  const period1 = now - seconds;

  const res = await fetchYahooChart(ticker, period1, now, interval);

  if (!res) {
    return NextResponse.json(
      { error: "Chart data unavailable", points: [] },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json({ error: "parse error", points: [] }, { status: 200 });
  }

  const result = data?.chart?.result?.[0];
  if (!result) {
    return NextResponse.json({ error: "no result", points: [] }, { status: 200 });
  }

  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

  const points = timestamps
    .map((t, i) => ({ t, v: closes[i] }))
    .filter((p): p is { t: number; v: number } => typeof p.v === "number");

  const cacheSeconds = period === "1D" ? 120 : period === "5D" ? 300 : 1800;

  return NextResponse.json(
    { points, currency: result.meta?.currency ?? "USD" },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=60`,
      },
    }
  );
}
