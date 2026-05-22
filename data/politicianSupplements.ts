// Manual trade entries that are merged with (and take precedence over)
// the live house-stock-watcher API data. Use this to add recent disclosures
// that haven't propagated to the community dataset yet, or to correct records.
//
// Structure mirrors PoliticianTrade from lib/politicians.ts.
// Dates: "YYYY-MM-DD". amountRange: e.g. "$15,001 - $50,000".
// type: "purchase" | "sale" | "exchange" | "other".

import type { PoliticianTrade } from "@/lib/politicians";

export const POLITICIAN_SUPPLEMENTS: Record<string, PoliticianTrade[]> = {
  "nancy-pelosi": [
    // Add manually-entered trades here, e.g.:
    // {
    //   transactionDate: "2025-01-15",
    //   disclosureDate: "2025-01-30",
    //   ticker: "NVDA",
    //   assetDescription: "NVIDIA Corporation",
    //   type: "purchase",
    //   amountRange: "$1,000,001 - $5,000,000",
    //   amountMin: 1000001,
    //   amountMax: 5000000,
    //   owner: "Joint",
    // },
  ],
};
