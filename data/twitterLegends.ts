// Static portfolio data for Twitter / social-media investing legends.
// Holdings are based on publicly disclosed positions, interviews, and
// social media — for educational and entertainment purposes only.

export type LegendHolding = {
  ticker: string;
  name: string;
  weightPct: number; // estimated % of disclosed/public portfolio
  note: string;
};

export type TwitterLegend = {
  slug: string;
  name: string;
  handle: string;
  tagline: string;
  bio: string;
  source: string;
  asOf: string;
  holdings: LegendHolding[];
};

export const TWITTER_LEGENDS: TwitterLegend[] = [
  {
    slug: "michael-sikand",
    name: "Michael Sikand",
    handle: "@msikand",
    tagline: "Former Robinhood Head of International, fintech & growth investor",
    bio: "Michael Sikand served as Head of International at Robinhood, overseeing global expansion for one of the most disruptive brokerages in history. After leaving Robinhood he became a prominent voice on fintech, retail investing, and the democratisation of financial services. He invests with a strong focus on next-generation financial infrastructure, digital assets, and AI-driven platforms.",
    source: "Publicly stated positions & social media",
    asOf: "2025-Q1",
    holdings: [
      { ticker: "COIN", name: "Coinbase", weightPct: 20, note: "Crypto financial infrastructure — Sikand's highest-conviction long." },
      { ticker: "HOOD", name: "Robinhood Markets", weightPct: 18, note: "Former employer; bullish on democratised retail investing and options." },
      { ticker: "SQ", name: "Block (Square)", weightPct: 15, note: "Payments ecosystem with global fintech reach and Bitcoin integration." },
      { ticker: "NVDA", name: "NVIDIA", weightPct: 14, note: "AI compute backbone underpinning every platform he follows." },
      { ticker: "MSFT", name: "Microsoft", weightPct: 12, note: "Enterprise AI deployment; Azure Copilot monetisation compounding." },
      { ticker: "AAPL", name: "Apple", weightPct: 11, note: "Services margin and buybacks; a core position in any long-term growth portfolio." },
      { ticker: "PLTR", name: "Palantir", weightPct: 10, note: "Enterprise AI adoption inflection — Sikand has been publicly bullish." },
    ],
  },
  {
    slug: "nikhil-kamath",
    name: "Nikhil Kamath",
    handle: "@nikhilkamathcio",
    tagline: "Co-founder of Zerodha & True Beacon — India's most followed investor",
    bio: "Nikhil Kamath is the co-founder of Zerodha, India's largest stock brokerage by active clients, and True Beacon, a SEBI-registered hedge fund. One of India's youngest self-made billionaires, he is known for contrarian, macro-driven thinking and for blending quant strategies with deep fundamental research. He has spoken publicly about diversifying into global equities, particularly US technology and AI infrastructure.",
    source: "Public interviews, podcasts, and disclosed positions",
    asOf: "2025-Q1",
    holdings: [
      { ticker: "NVDA", name: "NVIDIA", weightPct: 22, note: "AI infrastructure — Kamath calls it the defining bet of the decade." },
      { ticker: "TSLA", name: "Tesla", weightPct: 18, note: "Autonomy + energy convergence; high optionality on robotics." },
      { ticker: "GOOGL", name: "Alphabet", weightPct: 16, note: "Search monopoly with Gemini AI re-rating tailwind." },
      { ticker: "AMZN", name: "Amazon", weightPct: 14, note: "AWS reacceleration + advertising margin expansion." },
      { ticker: "BRK-B", name: "Berkshire Hathaway B", weightPct: 12, note: "Capital-allocation benchmark; Kamath admires Buffett's discipline." },
      { ticker: "GLD", name: "SPDR Gold Shares", weightPct: 10, note: "Macro hedge against fiat debasement and geopolitical risk." },
      { ticker: "MSFT", name: "Microsoft", weightPct: 8, note: "Enterprise AI productivity moat via Copilot and Azure." },
    ],
  },
  {
    slug: "inverse-cramer",
    name: "Inverse Cramer",
    handle: "@jimcramer (inverted)",
    tagline: "A strategy built on one simple rule: do the opposite of what he says",
    bio: "Jim Cramer is the host of CNBC's Mad Money and one of the most watched stock pundits on television. 'Inverse Cramer' is a tongue-in-cheek strategy that gained viral fame when retail traders noticed his on-air buy calls had a poor track record. The concept is simple: wherever Cramer says buy, you sell — and wherever he says avoid, you buy. It is a meme-born strategy, not a licensed fund, and the holdings below represent what an inverse position to his recent calls would look like. Not investment advice; purely for entertainment.",
    source: "Inverted from Cramer's on-air Mad Money calls",
    asOf: "2025-Q1",
    holdings: [
      { ticker: "TSLA", name: "Tesla", weightPct: 20, note: "Cramer repeatedly called it overvalued near highs; inverse bought every dip." },
      { ticker: "META", name: "Meta Platforms", weightPct: 18, note: "Cramer sceptical during the metaverse era; inverse bought the $90 low." },
      { ticker: "NVDA", name: "NVIDIA", weightPct: 15, note: "Cramer was slow to embrace AI semis; inverse positioned early." },
      { ticker: "PLTR", name: "Palantir", weightPct: 14, note: "Cramer repeatedly doubted the valuation; inverse kept the faith." },
      { ticker: "COIN", name: "Coinbase", weightPct: 13, note: "Cramer has flipped on crypto many times; inverse treats that as a buy signal." },
      { ticker: "ARKK", name: "ARK Innovation ETF", weightPct: 12, note: "Cramer critical of high-multiple growth funds; inverse owns the theme." },
      { ticker: "GME", name: "GameStop", weightPct: 8, note: "Cramer called it dead. It then went up 1,000%. A meme strategy needs a meme stock." },
    ],
  },
];

export function getTwitterLegend(slug: string): TwitterLegend | undefined {
  return TWITTER_LEGENDS.find((t) => t.slug === slug);
}
