import Link from "next/link";
import type { Investor } from "@/lib/investors";

const CATEGORY_LABEL: Record<Investor["category"], string> = {
  value: "Value",
  macro: "Macro",
  activist: "Activist",
  quant: "Quant",
  growth: "Growth",
  contrarian: "Contrarian",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(cik: string): string {
  const colors = [
    "#0F9D58",
    "#1A73E8",
    "#9334E6",
    "#D93025",
    "#F29900",
    "#188038",
    "#1967D2",
    "#A142F4",
  ];
  let h = 0;
  for (let i = 0; i < cik.length; i++) h = (h * 31 + cik.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
}

export function FundCard({ investor }: { investor: Investor }) {
  const bg = avatarColor(investor.cik);
  return (
    <Link
      href={`/fund/${investor.cik}`}
      className="group block bg-white rounded-2xl border border-ink-100 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold text-base"
          style={{ background: bg }}
        >
          {initials(investor.manager)}
        </div>
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
          View holdings →
        </span>
      </div>
    </Link>
  );
}
