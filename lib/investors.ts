export type InvestorCategory =
  | "value"
  | "macro"
  | "activist"
  | "quant"
  | "growth"
  | "contrarian"
  | "themed";

export type Investor = {
  /** SEC CIK for real 13F filers, or null for themed/coming-soon entries */
  cik: string | null;
  slug: string;
  name: string;
  manager: string;
  tagline: string;
  category: InvestorCategory;
  /** Optional path under /public, e.g. "/avatars/buffett.jpg" */
  image?: string;
  /** True for entries we don't have a 13F for yet */
  comingSoon?: boolean;
  /** Manual popularity ordering — lower numbers show up first */
  popularity?: number;
  description?: string;
};

// The 10 core 13F filers we track. CIKs verified against SEC EDGAR.
export const INVESTORS_13F: Investor[] = [
  {
    cik: "1067983",
    slug: "berkshire",
    name: "Berkshire Hathaway",
    manager: "Warren Buffett",
    tagline: "The Oracle of Omaha — 60 years of compounding at 20%+ per year",
    category: "value",
    popularity: 1,
  },
  {
    cik: "1336528",
    slug: "pershing-square",
    name: "Pershing Square Capital",
    manager: "Bill Ackman",
    tagline: "High-conviction activist — a handful of large bets, publicly argued",
    category: "activist",
    popularity: 2,
  },
  {
    cik: "1350694",
    slug: "bridgewater",
    name: "Bridgewater Associates",
    manager: "Ray Dalio",
    tagline: "The world's largest hedge fund, built on radical transparency",
    category: "macro",
    popularity: 3,
  },
  {
    cik: "2045724",
    slug: "situational-awareness",
    name: "Situational Awareness LP",
    manager: "Leopold Aschenbrenner",
    tagline: "Concentrated AGI-thesis portfolio — betting that superintelligence is near",
    category: "contrarian",
    popularity: 4,
  },
  {
    cik: "1697748",
    slug: "ark",
    name: "ARK Investment Management",
    manager: "Cathie Wood",
    tagline: "Disruptive innovation — AI, genomics, EVs and fintech at high conviction",
    category: "growth",
    popularity: 5,
  },
  {
    cik: "1029160",
    slug: "soros",
    name: "Soros Fund Management",
    manager: "George Soros",
    tagline: "Reflexivity in action — macro legends who broke the Bank of England",
    category: "macro",
    popularity: 6,
  },
  {
    cik: "1037389",
    slug: "renaissance",
    name: "Renaissance Technologies",
    manager: "Jim Simons",
    tagline: "The quant kings — Medallion's 66% gross return is the greatest fund ever",
    category: "quant",
    popularity: 7,
  },
  {
    cik: "1656456",
    slug: "appaloosa",
    name: "Appaloosa Management",
    manager: "David Tepper",
    tagline: "Distressed-debt turned macro titan — bold, well-timed, high-conviction",
    category: "macro",
    popularity: 8,
  },
  {
    cik: "1649339",
    slug: "scion",
    name: "Scion Asset Management",
    manager: "Michael Burry",
    tagline: "The Big Short — deep contrarian research and concentrated contrarian bets",
    category: "contrarian",
    popularity: 9,
  },
  {
    cik: "1536411",
    slug: "duquesne",
    name: "Duquesne Family Office",
    manager: "Stanley Druckenmiller",
    tagline: "Macro legend — reportedly never had a down year across three decades",
    category: "macro",
    popularity: 10,
  },
];

// Themed entries for Twitter Legends — not 13F filers.
export const THEMED_INVESTORS: Investor[] = [
  {
    cik: null,
    slug: "michael-sikand",
    name: "Michael Sikand",
    manager: "Fintech & Growth Investor",
    tagline: "Former Robinhood Head of International turned fintech & growth investor",
    category: "themed",
  },
  {
    cik: null,
    slug: "nikhil-kamath",
    name: "Nikhil Kamath",
    manager: "Co-founder, Zerodha & True Beacon",
    tagline: "India's most followed investor — Zerodha founder with a global macro lens",
    category: "themed",
  },
  {
    cik: null,
    slug: "inverse-cramer",
    name: "Inverse Cramer",
    manager: "Jim Cramer (inverse)",
    tagline: "Do the opposite of his TV calls — the meme strategy that went viral",
    category: "themed",
  },
];

export const FEATURED_INVESTORS: Investor[] = [
  ...INVESTORS_13F,
  ...THEMED_INVESTORS,
];

export function getInvestor(idOrCik: string): Investor | undefined {
  const normalized = idOrCik.replace(/^0+/, "");
  return FEATURED_INVESTORS.find(
    (i) => i.cik === normalized || i.slug === idOrCik
  );
}

export function findThemedBySlug(slug: string): Investor | undefined {
  return THEMED_INVESTORS.find((i) => i.slug === slug);
}

export function tradableInvestors(): Investor[] {
  return INVESTORS_13F;
}

export function popularInvestors(): Investor[] {
  return [...INVESTORS_13F]
    .filter((i) => i.popularity != null)
    .sort((a, b) => (a.popularity ?? 99) - (b.popularity ?? 99));
}
