import Link from "next/link";
import type { Investor } from "@/lib/investors";
import { Avatar } from "./Avatar";

const CATEGORY_LABEL: Record<Investor["category"], string> = {
  value: "Value",
  macro: "Macro",
  activist: "Activist",
  quant: "Quant",
  growth: "Growth",
  contrarian: "Contrarian",
  politician: "Politician",
  ai: "AI",
  themed: "Themed",
};

export function investorHref(inv: Investor): string {
  if (inv.cik) return `/fund/${inv.cik}`;
  return `/themed/${inv.slug}`;
}

export function FundCard({ investor }: { investor: Investor }) {
  return (
    <Link
      href={investorHref(investor)}
      className="group block bg-white rounded-2xl border border-ink-100 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center gap-4">
        <Avatar investor={investor} size={48} />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-900 truncate">
            {investor.manager}
          </h3>
          <p className="text-sm text-ink-500 truncate">{investor.name}</p>
        </div>
      </div>
      <p className="mt-5 text-ink-700 text-[15px] leading-relaxed line-clamp-2">
        {investor.tagline}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600 border border-ink-100">
          {CATEGORY_LABEL[investor.category]}
        </span>
        <span className="text-sm font-medium text-ink-700 group-hover:text-accent transition">
          {investor.comingSoon ? "Coming soon →" : "View holdings →"}
        </span>
      </div>
    </Link>
  );
}
