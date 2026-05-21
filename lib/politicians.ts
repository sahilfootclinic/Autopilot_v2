import { POLITICIANS, type Politician } from "@/data/politicians";

// Congressional STOCK Act disclosures, sourced from the community
// house-stock-watcher dataset (House Periodic Transaction Reports).
// This is a third-party aggregation, not an official feed.

const DATA_URL =
  process.env.HOUSE_TRADES_URL ||
  "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/all_transactions.json";

const REVALIDATE = 60 * 60 * 12; // 12h

export type PoliticianTrade = {
  transactionDate: string;
  disclosureDate: string;
  ticker: string;
  assetDescription: string;
  type: "purchase" | "sale" | "exchange" | "other";
  amountRange: string;
  amountMin: number;
  amountMax: number;
  owner: string;
};

export type PoliticianActivity = {
  politician: Politician;
  trades: PoliticianTrade[];
  totalTrades: number;
  estimatedVolume: number; // midpoint of amount ranges
  lastTradeDate: string | null;
};

function normalizeType(raw: string): PoliticianTrade["type"] {
  const t = (raw || "").toLowerCase();
  if (t.includes("purchase")) return "purchase";
  if (t.includes("sale")) return "sale";
  if (t.includes("exchange")) return "exchange";
  return "other";
}

/** Parses ranges like "$1,001 - $15,000" into numeric bounds. */
function parseAmount(raw: string): { min: number; max: number } {
  const nums = (raw || "")
    .replace(/[$,]/g, "")
    .match(/\d+/g);
  if (!nums || nums.length === 0) return { min: 0, max: 0 };
  const min = Number(nums[0]);
  const max = nums.length > 1 ? Number(nums[1]) : min;
  return { min, max };
}

function normalizeDate(raw: string): string {
  if (!raw) return "";
  // Dataset mixes "YYYY-MM-DD" and "MM/DD/YYYY".
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  return raw;
}

let cachedRaw: any[] | null = null;
let cachedAt = 0;

async function loadAllTransactions(): Promise<any[]> {
  const now = Date.now();
  if (cachedRaw && now - cachedAt < REVALIDATE * 1000) return cachedRaw;
  try {
    const res = await fetch(DATA_URL, {
      next: { revalidate: REVALIDATE },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return cachedRaw ?? [];
    const data = await res.json();
    if (Array.isArray(data)) {
      cachedRaw = data;
      cachedAt = now;
      return data;
    }
    return cachedRaw ?? [];
  } catch {
    return cachedRaw ?? [];
  }
}

function matchesPolitician(repField: string, p: Politician): boolean {
  const hay = (repField || "").toLowerCase();
  return p.matchTokens.every((tok) => hay.includes(tok));
}

export async function getPoliticianActivity(
  p: Politician
): Promise<PoliticianActivity> {
  const all = await loadAllTransactions();
  const trades: PoliticianTrade[] = [];
  for (const row of all) {
    if (!matchesPolitician(row?.representative ?? "", p)) continue;
    const { min, max } = parseAmount(row?.amount ?? "");
    trades.push({
      transactionDate: normalizeDate(row?.transaction_date ?? ""),
      disclosureDate: normalizeDate(row?.disclosure_date ?? ""),
      ticker: String(row?.ticker ?? "").replace(/[^A-Za-z.\-]/g, "").toUpperCase(),
      assetDescription: String(row?.asset_description ?? "").trim(),
      type: normalizeType(row?.type ?? ""),
      amountRange: String(row?.amount ?? "").trim(),
      amountMin: min,
      amountMax: max,
      owner: String(row?.owner ?? "").trim(),
    });
  }
  trades.sort((a, b) =>
    (b.transactionDate || "").localeCompare(a.transactionDate || "")
  );
  const estimatedVolume = trades.reduce(
    (s, t) => s + (t.amountMin + t.amountMax) / 2,
    0
  );
  return {
    politician: p,
    trades,
    totalTrades: trades.length,
    estimatedVolume,
    lastTradeDate: trades[0]?.transactionDate ?? null,
  };
}

export async function getAllPoliticianSummaries(): Promise<
  Map<string, PoliticianActivity>
> {
  const out = new Map<string, PoliticianActivity>();
  const results = await Promise.all(
    POLITICIANS.map((p) =>
      getPoliticianActivity(p).catch(
        () =>
          ({
            politician: p,
            trades: [],
            totalTrades: 0,
            estimatedVolume: 0,
            lastTradeDate: null,
          }) as PoliticianActivity
      )
    )
  );
  results.forEach((r) => out.set(r.politician.slug, r));
  return out;
}
