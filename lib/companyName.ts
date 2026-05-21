import { KNOWN_NAMES } from "@/data/companies";

// Trailing tokens stripped from a 13F "name of issuer".
const SUFFIX = new Set([
  "inc",
  "incorporated",
  "corp",
  "corporation",
  "co",
  "company",
  "companies",
  "cos",
  "ltd",
  "limited",
  "plc",
  "llc",
  "lp",
  "holdings",
  "holding",
  "hldgs",
  "group",
  "grp",
  "technologies",
  "technology",
  "new",
  "com",
  "cl",
  "class",
  "a",
  "b",
  "c",
  "sa",
  "nv",
  "ag",
  "se",
  "adr",
  "ads",
  "reit",
  "trust",
]);

// Common abbreviations expanded for readability.
const EXPAND: Record<string, string> = {
  finl: "Financial",
  fin: "Financial",
  svcs: "Services",
  svc: "Service",
  intl: "International",
  mtr: "Motor",
  mtrs: "Motors",
  pharm: "Pharmaceutical",
  pharma: "Pharmaceuticals",
  mgmt: "Management",
  entmt: "Entertainment",
  comms: "Communications",
  comm: "Communications",
};

const SMALL = new Set(["of", "and", "the", "for", "de", "&"]);

function titleCase(words: string[]): string {
  return words
    .map((w, i) => {
      if (i > 0 && SMALL.has(w)) return w;
      if (w === "&") return "&";
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

/** Turns "UBER TECHNOLOGIES INC" into "Uber", "MICROSOFT CORP" into "Microsoft". */
export function cleanCompanyName(raw: string, ticker?: string): string {
  const t = (ticker || "").trim().toUpperCase();
  if (t && KNOWN_NAMES[t]) return KNOWN_NAMES[t];

  let name = (raw || "").trim();
  if (!name) return t || "—";

  name = name.replace(/\/[A-Za-z]{2,4}\//g, " "); // drop /DE/ /NV/
  let tokens = name
    .split(/[\s.,]+/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .filter((s) => s !== "com")
    .map((s) => (EXPAND[s] ? EXPAND[s].toLowerCase() : s));

  while (tokens.length > 1 && SUFFIX.has(tokens[tokens.length - 1])) {
    tokens.pop();
  }
  if (tokens.length > 1 && tokens[0] === "the") tokens.shift();
  if (tokens.length === 0) return t || "—";

  return titleCase(tokens);
}
