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

// Real 13F filers. CIKs verified against SEC EDGAR.
export const INVESTORS_13F: Investor[] = [
  { cik: "1067983", slug: "berkshire", name: "Berkshire Hathaway", manager: "Warren Buffett", tagline: "The Oracle of Omaha", category: "value", popularity: 1 },
  { cik: "1649339", slug: "scion", name: "Scion Asset Management", manager: "Michael Burry", tagline: "The Big Short", category: "contrarian", popularity: 3 },
  { cik: "1336528", slug: "pershing-square", name: "Pershing Square Capital", manager: "Bill Ackman", tagline: "Concentrated activist", category: "activist", popularity: 4 },
  { cik: "1350694", slug: "bridgewater", name: "Bridgewater Associates", manager: "Ray Dalio", tagline: "World's largest hedge fund", category: "macro", popularity: 5 },
  { cik: "1037389", slug: "renaissance", name: "Renaissance Technologies", manager: "Jim Simons", tagline: "The quant kings", category: "quant", popularity: 6 },
  { cik: "1656456", slug: "appaloosa", name: "Appaloosa Management", manager: "David Tepper", tagline: "Distressed debt master", category: "macro", popularity: 8 },
  { cik: "1079114", slug: "greenlight", name: "Greenlight Capital", manager: "David Einhorn", tagline: "Long/short value", category: "value" },
  { cik: "1040273", slug: "third-point", name: "Third Point", manager: "Daniel Loeb", tagline: "Event-driven activist", category: "activist" },
  { cik: "1167483", slug: "tiger-global", name: "Tiger Global Management", manager: "Chase Coleman", tagline: "Tech & internet growth", category: "growth", popularity: 9 },
  { cik: "1061165", slug: "baupost", name: "Baupost Group", manager: "Seth Klarman", tagline: "Margin of Safety", category: "value" },
  { cik: "1697748", slug: "ark", name: "ARK Investment Management", manager: "Cathie Wood", tagline: "Disruptive innovation", category: "growth", popularity: 7 },
  { cik: "1135730", slug: "coatue", name: "Coatue Management", manager: "Philippe Laffont", tagline: "Tech-focused long/short", category: "growth" },
  { cik: "1029160", slug: "soros", name: "Soros Fund Management", manager: "George Soros", tagline: "Reflexivity in action", category: "macro" },
  { cik: "1061768", slug: "lone-pine", name: "Lone Pine Capital", manager: "Stephen Mandel", tagline: "Tiger cub fundamental", category: "growth" },
  { cik: "1423053", slug: "citadel", name: "Citadel Advisors", manager: "Ken Griffin", tagline: "Multi-strategy giant", category: "quant", popularity: 10 },
  { cik: "1179392", slug: "two-sigma", name: "Two Sigma Investments", manager: "Siegel & Overdeck", tagline: "Data-driven quant", category: "quant" },
  { cik: "1273087", slug: "millennium", name: "Millennium Management", manager: "Israel Englander", tagline: "Pod-shop multi-strategy", category: "quant" },
  { cik: "1009207", slug: "de-shaw", name: "D. E. Shaw", manager: "David E. Shaw", tagline: "Pioneer of quant trading", category: "quant" },
  { cik: "1536411", slug: "duquesne", name: "Duquesne Family Office", manager: "Stanley Druckenmiller", tagline: "Macro legend", category: "macro" },
  { cik: "1173334", slug: "pabrai", name: "Pabrai Investment Funds", manager: "Mohnish Pabrai", tagline: "Dhandho value investor", category: "value" },
  { cik: "2045724", slug: "situational-awareness", name: "Situational Awareness LP", manager: "Leopold Aschenbrenner", tagline: "AGI-thesis concentrated bet", category: "contrarian", popularity: 2 },
];

// Themed / coming-soon entries that aren't 13F filers (yet).
export const THEMED_INVESTORS: Investor[] = [
  {
    cik: null,
    slug: "inverse-cramer",
    name: "Inverse Cramer",
    manager: "Jim Cramer (inverse)",
    tagline: "Do the opposite of his TV calls",
    category: "themed",
    comingSoon: true,
    description:
      "A synthetic strategy that inverts Jim Cramer's televised buy/sell calls. Requires parsing CNBC transcripts into structured calls — coming soon.",
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
