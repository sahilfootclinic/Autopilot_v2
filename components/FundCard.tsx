import Link from "next/link";
import type { CatalogEntry } from "@/lib/catalog";
import { Avatar } from "./Avatar";

export function FundCard({ entry }: { entry: CatalogEntry }) {
  return (
    <Link
      href={entry.href}
      className="group block bg-white rounded-2xl border border-ink-100 p-6 shadow-card hover:shadow-cardHover hover:-translate-y-0.5 transition"
    >
      <div className="flex items-center gap-4">
        <Avatar
          seed={entry.slug}
          label={entry.manager}
          image={entry.image}
          badge={entry.avatarBadge}
          badgeColor={entry.avatarBadgeColor}
          size={48}
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink-900 truncate">{entry.name}</h3>
          <p className="text-sm text-ink-500 truncate">{entry.manager}</p>
        </div>
      </div>
      <p className="mt-5 text-ink-700 text-[15px] leading-relaxed line-clamp-2">
        {entry.tagline}
      </p>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-600 border border-ink-100">
          {entry.badgeLabel}
        </span>
        <span className="text-sm font-medium text-ink-700 group-hover:text-accent transition">
          {entry.comingSoon ? "Coming soon →" : "View →"}
        </span>
      </div>
    </Link>
  );
}
