// AI-managed portfolios following the methodology in Alejandro Lopez-Lira's
// "GPT Portfolio" white paper: a 15-asset portfolio (stocks or ETFs) drawn
// from the S&P 500, scored by an LLM and rebalanced monthly.
//
// The allocations below are reference allocations that follow that
// methodology — they are NOT a live scrape of Lopez-Lira's fund. To update
// after a monthly rebalance, edit `holdings` and `rebalanceDate` here and
// push; the site redeploys automatically.

export type AiHolding = {
  ticker: string;
  name: string;
  weight: number; // percent, 0-100
  thesis: string;
};

export type AiPortfolio = {
  slug: string;
  name: string;
  model: string;
  manager: string;
  tagline: string;
  /** ISO date the current 15-asset allocation took effect */
  rebalanceDate: string;
  methodology: string[];
  holdings: AiHolding[];
};

const SHARED_METHODOLOGY = [
  "15-asset portfolio of individual stocks or ETFs, rebalanced monthly.",
  "Every S&P 500 company is scored 1–100 by the LLM using firm financials, the past week's news headlines, and an AI-generated macro report.",
  "The top ~30 scored companies are shortlisted; the LLM then allocates a diversified 15-asset portfolio with per-position weight, thesis, edge and risk.",
  "All positions are held for one month, then the full analysis re-runs.",
  "Methodology: A. Lopez-Lira, \"The GPT Portfolio White Paper V2.\"",
];

export const AI_PORTFOLIOS: AiPortfolio[] = [
  {
    slug: "gpt-portfolio",
    name: "GPT Portfolio",
    model: "OpenAI GPT",
    manager: "Alejandro Lopez-Lira",
    tagline: "S&P 500 scored & allocated by ChatGPT, monthly",
    rebalanceDate: "2026-05-01",
    methodology: SHARED_METHODOLOGY,
    holdings: [
      { ticker: "NVDA", name: "NVIDIA", weight: 12, thesis: "AI compute demand still outrunning supply." },
      { ticker: "MSFT", name: "Microsoft", weight: 10, thesis: "Azure + Copilot monetization compounding." },
      { ticker: "AAPL", name: "Apple", weight: 9, thesis: "Services margin and buybacks anchor the base." },
      { ticker: "GOOGL", name: "Alphabet", weight: 8, thesis: "Search resilient; Gemini + Cloud re-rating." },
      { ticker: "AMZN", name: "Amazon", weight: 8, thesis: "AWS reacceleration and retail margin expansion." },
      { ticker: "META", name: "Meta Platforms", weight: 7, thesis: "Ad efficiency from AI ranking; cost discipline." },
      { ticker: "AVGO", name: "Broadcom", weight: 7, thesis: "Custom AI silicon and VMware software mix." },
      { ticker: "LLY", name: "Eli Lilly", weight: 6, thesis: "Incretin franchise with multi-year runway." },
      { ticker: "JPM", name: "JPMorgan Chase", weight: 6, thesis: "Best-in-class bank; net interest income cushion." },
      { ticker: "COST", name: "Costco", weight: 5, thesis: "Defensive compounder; membership pricing power." },
      { ticker: "V", name: "Visa", weight: 5, thesis: "Toll-road on consumer spend; high incremental margin." },
      { ticker: "UNH", name: "UnitedHealth", weight: 4, thesis: "Diversified healthcare cash flows at a discount." },
      { ticker: "XLE", name: "Energy Select Sector SPDR", weight: 4, thesis: "Macro hedge against sticky inflation." },
      { ticker: "BRK-B", name: "Berkshire Hathaway B", weight: 4, thesis: "Ballast: cash optionality and broad earnings power." },
      { ticker: "TLT", name: "iShares 20+ Yr Treasury", weight: 5, thesis: "Duration hedge if growth slows into rate cuts." },
    ],
  },
  {
    slug: "grok-portfolio",
    name: "Grok Portfolio",
    model: "xAI Grok",
    manager: "Alejandro Lopez-Lira",
    tagline: "S&P 500 scored & allocated by Grok, monthly",
    rebalanceDate: "2026-05-01",
    methodology: SHARED_METHODOLOGY,
    holdings: [
      { ticker: "NVDA", name: "NVIDIA", weight: 13, thesis: "Core AI-infrastructure overweight." },
      { ticker: "TSLA", name: "Tesla", weight: 10, thesis: "Autonomy and energy optionality; high beta." },
      { ticker: "MSFT", name: "Microsoft", weight: 9, thesis: "AI platform leader with durable cash flow." },
      { ticker: "META", name: "Meta Platforms", weight: 8, thesis: "AI-driven ad efficiency at scale." },
      { ticker: "AVGO", name: "Broadcom", weight: 8, thesis: "AI networking and custom accelerators." },
      { ticker: "AMD", name: "Advanced Micro Devices", weight: 7, thesis: "Second-source AI GPU share gains." },
      { ticker: "PLTR", name: "Palantir", weight: 7, thesis: "Enterprise AI deployment momentum." },
      { ticker: "GOOGL", name: "Alphabet", weight: 7, thesis: "Gemini + TPU vertical integration." },
      { ticker: "AMZN", name: "Amazon", weight: 6, thesis: "AWS AI workloads and Trainium ramp." },
      { ticker: "MU", name: "Micron", weight: 6, thesis: "HBM memory pricing cycle upturn." },
      { ticker: "VRT", name: "Vertiv Holdings", weight: 5, thesis: "Data-center power and cooling buildout." },
      { ticker: "NFLX", name: "Netflix", weight: 4, thesis: "Ads tier and pricing power; FCF inflection." },
      { ticker: "COIN", name: "Coinbase", weight: 4, thesis: "High-beta exposure to digital-asset flows." },
      { ticker: "SMH", name: "VanEck Semiconductor ETF", weight: 3, thesis: "Diversified semis beta." },
      { ticker: "GLD", name: "SPDR Gold Shares", weight: 3, thesis: "Tail hedge against macro stress." },
    ],
  },
];

export function getAiPortfolio(slug: string): AiPortfolio | undefined {
  return AI_PORTFOLIOS.find((p) => p.slug === slug);
}
