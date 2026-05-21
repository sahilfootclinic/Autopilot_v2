export type InvestorCategory =
  | "value"
  | "macro"
  | "activist"
  | "quant"
  | "growth"
  | "contrarian"
  | "politician"
  | "ai"
  | "themed";

export type InvestorSource = "13F" | "synthetic";

export type Investor = {
  /** SEC CIK, or null for synthetic/themed portfolios */
  cik: string | null;
  /** URL slug used when cik is null (synthetic portfolios) */
  slug: string;
  name: string;
  manager: string;
  tagline: string;
  category: InvestorCategory;
  /** Optional path under /public, e.g. "/avatars/buffett.jpg" */
  image?: string;
  source: InvestorSource;
  /** True if we don't have a data source for this yet */
  comingSoon?: boolean;
  /** Manual popularity ordering — lower numbers show up first */
  popularity?: number;
  /** Short description shown on the synthetic portfolio's detail page */
  description?: string;
};

// Curated list. CIKs verified against SEC EDGAR.
export const FEATURED_INVESTORS: Investor[] = [
  // ----- Real 13F filers -----
  {
    cik: "1067983",
    slug: "berkshire",
    name: "Berkshire Hathaway",
    manager: "Warren Buffett",
    tagline: "The Oracle of Omaha",
    category: "value",
    source: "13F",
    popularity: 1,
  },
  {
    cik: "1649339",
    slug: "scion",
    name: "Scion Asset Management",
    manager: "Michael Burry",
    tagline: "The Big Short",
    category: "contrarian",
    source: "13F",
    popularity: 3,
  },
  {
    cik: "1336528",
    slug: "pershing-square",
    name: "Pershing Square Capital",
    manager: "Bill Ackman",
    tagline: "Concentrated activist",
    category: "activist",
    source: "13F",
    popularity: 4,
  },
  {
    cik: "1350694",
    slug: "bridgewater",
    name: "Bridgewater Associates",
    manager: "Ray Dalio",
    tagline: "World's largest hedge fund",
    category: "macro",
    source: "13F",
    popularity: 5,
  },
  {
    cik: "1037389",
    slug: "renaissance",
    name: "Renaissance Technologies",
    manager: "Jim Simons",
    tagline: "The quant kings",
    category: "quant",
    source: "13F",
    popularity: 6,
  },
  {
    cik: "1656456",
    slug: "appaloosa",
    name: "Appaloosa Management",
    manager: "David Tepper",
    tagline: "Distressed debt master",
    category: "macro",
    source: "13F",
    popularity: 8,
  },
  {
    cik: "1079114",
    slug: "greenlight",
    name: "Greenlight Capital",
    manager: "David Einhorn",
    tagline: "Long/short value",
    category: "value",
    source: "13F",
  },
  {
    cik: "1040273",
    slug: "third-point",
    name: "Third Point",
    manager: "Daniel Loeb",
    tagline: "Event-driven activist",
    category: "activist",
    source: "13F",
  },
  {
    cik: "1167483",
    slug: "tiger-global",
    name: "Tiger Global Management",
    manager: "Chase Coleman",
    tagline: "Tech & internet growth",
    category: "growth",
    source: "13F",
    popularity: 9,
  },
  {
    cik: "1061165",
    slug: "baupost",
    name: "Baupost Group",
    manager: "Seth Klarman",
    tagline: "Margin of Safety",
    category: "value",
    source: "13F",
  },
  {
    cik: "1697748",
    slug: "ark",
    name: "ARK Investment Management",
    manager: "Cathie Wood",
    tagline: "Disruptive innovation",
    category: "growth",
    source: "13F",
    popularity: 7,
  },
  {
    cik: "1135730",
    slug: "coatue",
    name: "Coatue Management",
    manager: "Philippe Laffont",
    tagline: "Tech-focused long/short",
    category: "growth",
    source: "13F",
  },
  {
    cik: "1029160",
    slug: "soros",
    name: "Soros Fund Management",
    manager: "George Soros",
    tagline: "Reflexivity in action",
    category: "macro",
    source: "13F",
  },
  {
    cik: "1061768",
    slug: "lone-pine",
    name: "Lone Pine Capital",
    manager: "Stephen Mandel",
    tagline: "Tiger cub fundamental",
    category: "growth",
    source: "13F",
  },
  {
    cik: "1423053",
    slug: "citadel",
    name: "Citadel Advisors",
    manager: "Ken Griffin",
    tagline: "Multi-strategy giant",
    category: "quant",
    source: "13F",
    popularity: 10,
  },
  {
    cik: "1179392",
    slug: "two-sigma",
    name: "Two Sigma Investments",
    manager: "Siegel & Overdeck",
    tagline: "Data-driven quant",
    category: "quant",
    source: "13F",
  },
  {
    cik: "1273087",
    slug: "millennium",
    name: "Millennium Management",
    manager: "Israel Englander",
    tagline: "Pod-shop multi-strategy",
    category: "quant",
    source: "13F",
  },
  {
    cik: "1009207",
    slug: "de-shaw",
    name: "D. E. Shaw",
    manager: "David E. Shaw",
    tagline: "Pioneer of quant trading",
    category: "quant",
    source: "13F",
  },
  {
    cik: "1536411",
    slug: "duquesne",
    name: "Duquesne Family Office",
    manager: "Stanley Druckenmiller",
    tagline: "Macro legend",
    category: "macro",
    source: "13F",
  },
  {
    cik: "1173334",
    slug: "pabrai",
    name: "Pabrai Investment Funds",
    manager: "Mohnish Pabrai",
    tagline: "Dhandho value investor",
    category: "value",
    source: "13F",
  },

  // ----- Themed / synthetic portfolios (data source TBD) -----
  {
    cik: null,
    slug: "situational-awareness",
    name: "Situational Awareness LP",
    manager: "Leopold Aschenbrenner",
    tagline: "AGI-thesis concentrated bet",
    category: "themed",
    source: "synthetic",
    comingSoon: true,
    popularity: 2,
    description:
      "Leopold Aschenbrenner's hedge fund built around the thesis from his Situational Awareness essay. The fund launched mid-2024 and will appear here automatically once it files its first 13F with the SEC.",
  },
  {
    cik: null,
    slug: "pelosi-tracker",
    name: "Pelosi Tracker",
    manager: "Nancy Pelosi",
    tagline: "Congressional STOCK Act trades",
    category: "politician",
    source: "synthetic",
    comingSoon: true,
    popularity: 11,
    description:
      "Trades disclosed under the STOCK Act by Nancy Pelosi and her husband. This isn't a 13F filing — it's the Periodic Transaction Reports filed with the House. Hooking up that feed is a separate integration; coming soon.",
  },
  {
    cik: null,
    slug: "inverse-cramer",
    name: "Inverse Cramer",
    manager: "Jim Cramer (inverse)",
    tagline: "Do the opposite of what he says",
    category: "themed",
    source: "synthetic",
    comingSoon: true,
    popularity: 12,
    description:
      "A synthetic portfolio that inverts Jim Cramer's televised buy/sell calls. Requires parsing CNBC transcripts and his Twitter feed — coming soon.",
  },
  {
    cik: null,
    slug: "grok-portfolio",
    name: "Grok Portfolio",
    manager: "xAI Grok",
    tagline: "AI-curated picks",
    category: "ai",
    source: "synthetic",
    comingSoon: true,
    popularity: 13,
    description:
      "A portfolio rebalanced quarterly by Grok's analysis of news, earnings, and macro signals. We'll prompt Grok for its top picks and track the results. Coming soon.",
  },
  {
    cik: null,
    slug: "claude-portfolio",
    name: "Claude Portfolio",
    manager: "Anthropic Claude",
    tagline: "AI-curated picks",
    category: "ai",
    source: "synthetic",
    comingSoon: true,
    popularity: 14,
    description:
      "A portfolio rebalanced quarterly by Claude's analysis of fundamentals and qualitative signals. Same idea as the Grok portfolio but using Anthropic's model. Coming soon.",
  },
];

export function getInvestor(idOrCik: string): Investor | undefined {
  const normalized = idOrCik.replace(/^0+/, "");
  return FEATURED_INVESTORS.find(
    (i) => i.cik === normalized || i.slug === idOrCik
  );
}

export function findBySlug(slug: string): Investor | undefined {
  return FEATURED_INVESTORS.find((i) => i.slug === slug);
}

/** Real 13F filers we can pull data for. */
export function tradableInvestors(): Investor[] {
  return FEATURED_INVESTORS.filter((i) => i.source === "13F" && i.cik);
}

/** Sorted by manual popularity (lower number = more popular). */
export function popularInvestors(): Investor[] {
  return [...FEATURED_INVESTORS]
    .filter((i) => i.popularity != null)
    .sort((a, b) => (a.popularity ?? 99) - (b.popularity ?? 99));
}
