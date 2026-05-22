// Yahoo Finance crumb + cookie authentication.
// Since 2024 Yahoo requires a valid session cookie and a crumb token
// on every API request. We obtain them once and cache in-process for 2 hours.

export const YAHOO_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

type YahooAuth = { cookie: string; crumb: string };
let _cache: (YahooAuth & { expiry: number }) | null = null;

export async function getYahooAuth(): Promise<YahooAuth | null> {
  const now = Date.now();
  if (_cache && _cache.expiry > now) {
    return { cookie: _cache.cookie, crumb: _cache.crumb };
  }

  try {
    // Step 1: get a session cookie from Yahoo's consent/fc endpoint.
    const cookieRes = await fetch("https://fc.yahoo.com/", {
      headers: { "User-Agent": YAHOO_UA, Accept: "*/*" },
      redirect: "follow",
      cache: "no-store",
    });

    // `set-cookie` can be a comma-separated list of individual cookie strings.
    const setCookie = cookieRes.headers.get("set-cookie") ?? "";
    const cookie = setCookie
      .split(/,(?=\s*[A-Za-z0-9_-]+=)/)
      .map((c) => c.split(";")[0].trim())
      .filter(Boolean)
      .join("; ");

    if (!cookie) return null;

    // Step 2: exchange the cookie for a crumb token.
    const crumbRes = await fetch(
      "https://query1.finance.yahoo.com/v1/test/getcrumb",
      {
        headers: {
          "User-Agent": YAHOO_UA,
          Accept: "text/plain,*/*",
          Cookie: cookie,
        },
        cache: "no-store",
      }
    );
    if (!crumbRes.ok) return null;
    const crumb = (await crumbRes.text()).trim();
    // Sanity-check: crumb is a short alphanumeric string, never HTML.
    if (!crumb || crumb.length > 60 || crumb.startsWith("<")) return null;

    _cache = { cookie, crumb, expiry: now + 2 * 60 * 60 * 1000 }; // 2h TTL
    return { cookie, crumb };
  } catch {
    return null;
  }
}

/** Build headers for a Yahoo Finance API request. */
export function yahooHeaders(cookie: string): HeadersInit {
  return {
    "User-Agent": YAHOO_UA,
    Accept: "application/json,text/plain,*/*",
    Cookie: cookie,
  };
}
