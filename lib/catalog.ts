import { INVESTORS_13F, THEMED_INVESTORS, type Investor } from "@/lib/investors";
import { AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { POLITICIANS } from "@/data/politicians";

export type EntityKind = "13f" | "ai" | "politician";

export type CatalogEntry = {
  kind: EntityKind;
  slug: string;
  href: string;
  name: string;
  manager: string;
  tagline: string;
  badgeLabel: string;
  avatarBadge?: string;
  avatarBadgeColor?: string;
  comingSoon?: boolean;
  image?: string;
};

const CATEGORY_LABEL: Record<Investor["category"], string> = {
  value: "Value",
  macro: "Macro",
  activist: "Activist",
  quant: "Quant",
  growth: "Growth",
  contrarian: "Contrarian",
  themed: "Themed",
};

export function investorEntry(inv: Investor): CatalogEntry {
  return {
    kind: "13f",
    slug: inv.slug,
    href: inv.cik ? `/fund/${inv.cik}` : `/themed/${inv.slug}`,
    name: inv.name,
    manager: inv.manager,
    tagline: inv.tagline,
    badgeLabel: CATEGORY_LABEL[inv.category],
    comingSoon: inv.comingSoon,
    image: inv.image,
  };
}

export function entries13F(): CatalogEntry[] {
  return [...INVESTORS_13F, ...THEMED_INVESTORS].map(investorEntry);
}

export function entriesAI(): CatalogEntry[] {
  return AI_PORTFOLIOS.map((p) => ({
    kind: "ai" as const,
    slug: p.slug,
    href: `/ai/${p.slug}`,
    name: p.name,
    manager: p.manager,
    tagline: p.tagline,
    badgeLabel: "AI Portfolio",
    avatarBadge: "AI",
    avatarBadgeColor: "#9334E6",
  }));
}

export function entriesPoliticians(): CatalogEntry[] {
  return POLITICIANS.map((p) => ({
    kind: "politician" as const,
    slug: p.slug,
    href: `/politician/${p.slug}`,
    name: p.name,
    manager: `${p.role} (${p.party}-${p.state})`,
    tagline: p.tagline,
    badgeLabel: p.party === "D" ? "Democrat" : "Republican",
    avatarBadge: p.party,
    avatarBadgeColor: p.party === "D" ? "#1A73E8" : "#D93025",
  }));
}
