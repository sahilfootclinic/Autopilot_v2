import Link from "next/link";
import type { CatalogEntry } from "@/lib/catalog";
import { Avatar } from "./Avatar";
import { formatUsd } from "@/lib/format";

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="text-ink-300 shrink-0"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small circular monogram for the manager line. */
function ManagerTag({ entry }: { entry: CatalogEntry }) {
  return (
    <div className="flex items-center gap-1.5 mt-0.5">
      <Avatar seed={entry.manager} label={entry.manager} size={18} />
      <span className="text-sm text-ink-500 truncate">{entry.manager}</span>
    </div>
  );
}

export function PerformerRow({
  entry,
  rank,
  badge,
  badgeTone = "pos",
}: {
  entry: CatalogEntry;
  rank?: number;
  badge?: string;
  badgeTone?: "pos" | "neg" | "neutral";
}) {
  return (
    <Link
      href={entry.href}
      className="flex items-center gap-3 sm:gap-4 py-3.5 hover:bg-ink-50/60 transition px-2 -mx-2 rounded-xl"
    >
      {rank != null && (
        <span className="w-5 text-center text-ink-300 font-medium tabular-nums shrink-0">
          {rank}
        </span>
      )}
      <Avatar
        seed={entry.slug}
        label={entry.manager}
        image={entry.image}
        badge={entry.avatarBadge}
        badgeColor={entry.avatarBadgeColor}
        shape="squircle"
        size={60}
      />
      <div className="flex-1 min-w-0">
        {badge && (
          <span
            className={
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums " +
              (badgeTone === "pos"
                ? "bg-accent-light text-accent-dark"
                : badgeTone === "neg"
                ? "bg-red-50 text-loss"
                : "bg-ink-100 text-ink-700")
            }
          >
            {badge}
          </span>
        )}
        <div className="mt-0.5 font-semibold text-ink-900 truncate text-[17px] leading-tight">
          {entry.name}
        </div>
        <ManagerTag entry={entry} />
      </div>
      <Chevron />
    </Link>
  );
}

export function PopularRow({
  entry,
  rank,
  amount,
  subtitle,
}: {
  entry: CatalogEntry;
  rank?: number;
  amount?: number;
  subtitle?: string;
}) {
  return (
    <Link
      href={entry.href}
      className="flex items-center gap-3 sm:gap-4 py-3.5 hover:bg-ink-50/60 transition px-2 -mx-2 rounded-xl"
    >
      {rank != null && (
        <span className="w-5 text-center text-ink-300 font-medium tabular-nums shrink-0">
          {rank}
        </span>
      )}
      <Avatar
        seed={entry.slug}
        label={entry.manager}
        image={entry.image}
        badge={entry.avatarBadge}
        badgeColor={entry.avatarBadgeColor}
        shape="squircle"
        size={60}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-ink-400">
          {amount != null ? (
            <span className="text-accent-dark">
              {formatUsd(amount, { compact: true })} portfolio
            </span>
          ) : (
            <span>{subtitle ?? entry.badgeLabel}</span>
          )}
        </div>
        <div className="mt-0.5 font-semibold text-ink-900 truncate text-[17px] leading-tight">
          {entry.name}
        </div>
        <ManagerTag entry={entry} />
      </div>
      <Chevron />
    </Link>
  );
}
