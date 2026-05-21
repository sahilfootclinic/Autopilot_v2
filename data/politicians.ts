// U.S. Congress members whose STOCK Act trade disclosures we surface.
// Data comes from the community house-stock-watcher dataset (see
// lib/politicians.ts) — these are congressional Periodic Transaction
// Reports, not SEC 13F filings.

export type Politician = {
  slug: string;
  /** Name as it should display */
  name: string;
  /** Lowercase tokens that must all appear in the dataset's representative field */
  matchTokens: string[];
  party: "D" | "R";
  chamber: "House" | "Senate";
  state: string;
  role: string;
  tagline: string;
};

export const POLITICIANS: Politician[] = [
  {
    slug: "nancy-pelosi",
    name: "Nancy Pelosi",
    matchTokens: ["pelosi"],
    party: "D",
    chamber: "House",
    state: "CA",
    role: "Representative, former Speaker",
    tagline: "The most-watched trades in Congress",
  },
  {
    slug: "marjorie-taylor-greene",
    name: "Marjorie Taylor Greene",
    matchTokens: ["greene", "marjorie"],
    party: "R",
    chamber: "House",
    state: "GA",
    role: "Representative",
    tagline: "Active single-stock trader",
  },
  {
    slug: "dan-crenshaw",
    name: "Dan Crenshaw",
    matchTokens: ["crenshaw"],
    party: "R",
    chamber: "House",
    state: "TX",
    role: "Representative",
    tagline: "Energy-state portfolio",
  },
  {
    slug: "josh-gottheimer",
    name: "Josh Gottheimer",
    matchTokens: ["gottheimer"],
    party: "D",
    chamber: "House",
    state: "NJ",
    role: "Representative",
    tagline: "One of the busiest disclosers",
  },
  {
    slug: "ro-khanna",
    name: "Ro Khanna",
    matchTokens: ["khanna"],
    party: "D",
    chamber: "House",
    state: "CA",
    role: "Representative, Silicon Valley",
    tagline: "Large, broadly diversified disclosures",
  },
  {
    slug: "tommy-tuberville",
    name: "Tommy Tuberville",
    matchTokens: ["tuberville"],
    party: "R",
    chamber: "Senate",
    state: "AL",
    role: "Senator",
    tagline: "One of the most active traders in the Senate",
  },
  {
    slug: "michael-mccaul",
    name: "Michael McCaul",
    matchTokens: ["mccaul"],
    party: "R",
    chamber: "House",
    state: "TX",
    role: "Representative, House Foreign Affairs Committee",
    tagline: "Defence & tech focus",
  },
  {
    slug: "virginia-foxx",
    name: "Virginia Foxx",
    matchTokens: ["foxx", "virginia"],
    party: "R",
    chamber: "House",
    state: "NC",
    role: "Representative",
    tagline: "Consistently active equity trader",
  },
];

export function getPolitician(slug: string): Politician | undefined {
  return POLITICIANS.find((p) => p.slug === slug);
}
