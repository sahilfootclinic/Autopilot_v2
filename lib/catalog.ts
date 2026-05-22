import { INVESTORS_13F, THEMED_INVESTORS, type Investor } from "@/lib/investors";
import { AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { POLITICIANS } from "@/data/politicians";
import { PHOTOS } from "@/data/photoManifest";
import { personAvatar, botAvatar, AVATAR_TWEAKS } from "@/lib/avatars";

const POPULAR_SLUGS = [
  "berkshire",
  "pershing-square",
  "matt",
  "situational-awareness",
  "nancy-pelosi",
  "bridgewater",
] as const;

export type EntityKind = "13f" | "ai" | "politician" | "themed";

export type CatalogEntry = {
  kind: EntityKind;
  slug: string;
  href: string;
  /** Bold line — the person/portfolio */
  primary: string;
  /** Sub line — the firm/role */
  secondary: string;
  name: string;
  manager: string;
  tagline: string;
  badgeLabel: string;
  avatarBadge?: string;
  avatarBadgeColor?: string;
  comingSoon?: boolean;
  image?: string;
  imageZoom?: number;
  imageFocus?: string;
};

const CATEGORY_LABEL: Record<Investor["category"], string> = {
  value: "Value",
  macro: "Macro",
  activist: "Activist",
  quant: "Quant",
  growth: "Growth",
  contrarian: "Contrarian",
  themed: "Hedge Fund",
};

const HEDGE_FUND_PRIORITY = [
  "berkshire",
  "pershing-square",
  "bridgewater",
  "situational-awareness",
  "ark",
  "soros",
  "renaissance",
  "appaloosa",
  "scion",
  "duquesne",
];

function pickImage(slug: string, fallback: string): string {
  return PHOTOS[slug] ?? fallback;
}

export function investorEntry(inv: Investor): CatalogEntry {
  const themed = !inv.cik;
  return {
    kind: themed ? "themed" : "13f",
    slug: inv.slug,
    href: inv.cik ? `/fund/${inv.cik}` : `/themed/${inv.slug}`,
    primary: themed ? inv.name : inv.manager,
    secondary: themed ? inv.manager : inv.name,
    name: inv.name,
    manager: inv.manager,
    tagline: inv.tagline,
    badgeLabel: CATEGORY_LABEL[inv.category],
    comingSoon: inv.comingSoon,
    image: pickImage(inv.slug, inv.image ?? personAvatar(inv.manager)),
    imageZoom: AVATAR_TWEAKS[inv.slug]?.zoom,
    imageFocus: AVATAR_TWEAKS[inv.slug]?.focus,
  };
}

export function entriesHedgeFunds(): CatalogEntry[] {
  return [...INVESTORS_13F].map(investorEntry).sort((a, b) => {
    const ai = HEDGE_FUND_PRIORITY.indexOf(a.slug);
    const bi = HEDGE_FUND_PRIORITY.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function entriesAI(): CatalogEntry[] {
  return AI_PORTFOLIOS.map((p) => ({
    kind: "ai" as const,
    slug: p.slug,
    href: `/ai/${p.slug}`,
    primary: p.name,
    secondary: p.model,
    name: p.name,
    manager: p.model,
    tagline: p.tagline,
    badgeLabel: "AI Portfolio",
    image: pickImage(p.slug, botAvatar(p.name)),
    imageZoom: AVATAR_TWEAKS[p.slug]?.zoom,
    imageFocus: AVATAR_TWEAKS[p.slug]?.focus,
  }));
}

export function entriesPoliticians(): CatalogEntry[] {
  return POLITICIANS.map((p) => ({
    kind: "politician" as const,
    slug: p.slug,
    href: `/politician/${p.slug}`,
    primary: p.name,
    secondary: `${p.party}-${p.state} · ${p.chamber}`,
    name: p.name,
    manager: `${p.party}-${p.state} · ${p.chamber}`,
    tagline: p.tagline,
    badgeLabel: "Politician",
    avatarBadge: p.party,
    avatarBadgeColor: p.party === "D" ? "#1A73E8" : "#D93025",
    image: pickImage(p.slug, personAvatar(p.name)),
    imageZoom: AVATAR_TWEAKS[p.slug]?.zoom,
    imageFocus: AVATAR_TWEAKS[p.slug]?.focus,
  }));
}

export function entriesTwitterLegends(): CatalogEntry[] {
  return THEMED_INVESTORS.map((t) => ({
    kind: "themed" as const,
    slug: t.slug,
    href: `/themed/${t.slug}`,
    primary: t.name,
    secondary: t.manager,
    name: t.name,
    manager: t.manager,
    tagline: t.tagline,
    badgeLabel: "Twitter Legend",
    comingSoon: t.comingSoon,
    image: pickImage(t.slug, personAvatar(t.manager)),
    imageZoom: AVATAR_TWEAKS[t.slug]?.zoom,
    imageFocus: AVATAR_TWEAKS[t.slug]?.focus,
  }));
}

export function entriesAll(): CatalogEntry[] {
  return [
    ...entriesHedgeFunds(),
    ...entriesAI(),
    ...entriesPoliticians(),
    ...entriesTwitterLegends(),
  ];
}

export function entriesPopular(): CatalogEntry[] {
  const all = entriesAll();
  return POPULAR_SLUGS.map((slug) => all.find((e) => e.slug === slug)).filter(
    (e): e is CatalogEntry => e != null
  );
}
