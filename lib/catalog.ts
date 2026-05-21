import { INVESTORS_13F, THEMED_INVESTORS, type Investor } from "@/lib/investors";
import { AI_PORTFOLIOS } from "@/data/aiPortfolios";
import { POLITICIANS } from "@/data/politicians";
import { personAvatar, botAvatar } from "@/lib/avatars";

export type EntityKind = "13f" | "ai" | "politician" | "themed";

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
  themed: "Hedge Fund",
};

// The five hedge funds shown before "See more".
const HEDGE_FUND_PRIORITY = [
  "berkshire",
  "pershing-square",
  "bridgewater",
  "duquesne",
  "situational-awareness",
];

export function investorEntry(inv: Investor): CatalogEntry {
  return {
    kind: inv.cik ? "13f" : "themed",
    slug: inv.slug,
    href: inv.cik ? `/fund/${inv.cik}` : `/themed/${inv.slug}`,
    name: inv.name,
    manager: inv.manager,
    tagline: inv.tagline,
    badgeLabel: CATEGORY_LABEL[inv.category],
    comingSoon: inv.comingSoon,
    image: inv.image ?? personAvatar(inv.manager),
  };
}

/** Hedge funds tab: the 20 real 13F filers + Leopold's fund, priority-ordered. */
export function entriesHedgeFunds(): CatalogEntry[] {
  const leopold = THEMED_INVESTORS.find(
    (t) => t.slug === "situational-awareness"
  );
  const all = [...INVESTORS_13F, ...(leopold ? [leopold] : [])].map(
    investorEntry
  );
  return all.sort((a, b) => {
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
    name: p.name,
    manager: p.model,
    tagline: p.tagline,
    badgeLabel: "AI Portfolio",
    image: botAvatar(p.name),
  }));
}

export function entriesPoliticians(): CatalogEntry[] {
  return POLITICIANS.map((p) => ({
    kind: "politician" as const,
    slug: p.slug,
    href: `/politician/${p.slug}`,
    name: p.name,
    manager: `${p.party}-${p.state} · ${p.chamber}`,
    tagline: p.tagline,
    badgeLabel: "Politician",
    avatarBadge: p.party,
    avatarBadgeColor: p.party === "D" ? "#1A73E8" : "#D93025",
    image: personAvatar(p.name),
  }));
}

/** Twitter Legends tab: pundits and meme strategies. */
export function entriesTwitterLegends(): CatalogEntry[] {
  return THEMED_INVESTORS.filter((t) => t.slug === "inverse-cramer").map(
    (t) => ({
      kind: "themed" as const,
      slug: t.slug,
      href: `/themed/${t.slug}`,
      name: t.name,
      manager: t.manager,
      tagline: t.tagline,
      badgeLabel: "Twitter Legend",
      comingSoon: t.comingSoon,
      image: personAvatar(t.manager),
    })
  );
}

/** Everything, for the Profiles directory tab. */
export function entriesAll(): CatalogEntry[] {
  return [
    ...entriesHedgeFunds(),
    ...entriesAI(),
    ...entriesPoliticians(),
    ...entriesTwitterLegends(),
  ];
}
