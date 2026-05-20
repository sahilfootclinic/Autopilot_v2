export type Investor = {
  cik: string;
  name: string;
  manager: string;
  tagline: string;
  category: "value" | "macro" | "activist" | "quant" | "growth" | "contrarian";
};

// Curated list of well-known 13F filers.
// CIKs verified against SEC EDGAR.
export const FEATURED_INVESTORS: Investor[] = [
  {
    cik: "1067983",
    name: "Berkshire Hathaway",
    manager: "Warren Buffett",
    tagline: "The Oracle of Omaha",
    category: "value",
  },
  {
    cik: "1649339",
    name: "Scion Asset Management",
    manager: "Michael Burry",
    tagline: "The Big Short",
    category: "contrarian",
  },
  {
    cik: "1336528",
    name: "Pershing Square Capital",
    manager: "Bill Ackman",
    tagline: "Concentrated activist",
    category: "activist",
  },
  {
    cik: "1350694",
    name: "Bridgewater Associates",
    manager: "Ray Dalio",
    tagline: "World's largest hedge fund",
    category: "macro",
  },
  {
    cik: "1037389",
    name: "Renaissance Technologies",
    manager: "Jim Simons",
    tagline: "The quant kings",
    category: "quant",
  },
  {
    cik: "1656456",
    name: "Appaloosa Management",
    manager: "David Tepper",
    tagline: "Distressed debt master",
    category: "macro",
  },
  {
    cik: "1079114",
    name: "Greenlight Capital",
    manager: "David Einhorn",
    tagline: "Long/short value",
    category: "value",
  },
  {
    cik: "1040273",
    name: "Third Point",
    manager: "Daniel Loeb",
    tagline: "Event-driven activist",
    category: "activist",
  },
  {
    cik: "1167483",
    name: "Tiger Global Management",
    manager: "Chase Coleman",
    tagline: "Tech & internet growth",
    category: "growth",
  },
  {
    cik: "1061165",
    name: "Baupost Group",
    manager: "Seth Klarman",
    tagline: "Margin of Safety",
    category: "value",
  },
  {
    cik: "1697748",
    name: "ARK Investment Management",
    manager: "Cathie Wood",
    tagline: "Disruptive innovation",
    category: "growth",
  },
  {
    cik: "1135730",
    name: "Coatue Management",
    manager: "Philippe Laffont",
    tagline: "Tech-focused long/short",
    category: "growth",
  },
  {
    cik: "1029160",
    name: "Soros Fund Management",
    manager: "George Soros",
    tagline: "Reflexivity in action",
    category: "macro",
  },
  {
    cik: "1061768",
    name: "Lone Pine Capital",
    manager: "Stephen Mandel",
    tagline: "Tiger cub fundamental",
    category: "growth",
  },
  {
    cik: "1423053",
    name: "Citadel Advisors",
    manager: "Ken Griffin",
    tagline: "Multi-strategy giant",
    category: "quant",
  },
  {
    cik: "1179392",
    name: "Two Sigma Investments",
    manager: "Siegel & Overdeck",
    tagline: "Data-driven quant",
    category: "quant",
  },
  {
    cik: "1273087",
    name: "Millennium Management",
    manager: "Israel Englander",
    tagline: "Pod-shop multi-strategy",
    category: "quant",
  },
  {
    cik: "1009207",
    name: "D. E. Shaw",
    manager: "David E. Shaw",
    tagline: "Pioneer of quant trading",
    category: "quant",
  },
  {
    cik: "1536411",
    name: "Duquesne Family Office",
    manager: "Stanley Druckenmiller",
    tagline: "Macro legend",
    category: "macro",
  },
  {
    cik: "1173334",
    name: "Pabrai Investment Funds",
    manager: "Mohnish Pabrai",
    tagline: "Dhandho value investor",
    category: "value",
  },
];

export function getInvestor(cik: string): Investor | undefined {
  const padded = cik.replace(/^0+/, "");
  return FEATURED_INVESTORS.find((i) => i.cik === padded);
}
