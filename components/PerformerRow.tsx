import Link from "next/link";
import type { Investor } from "@/lib/investors";
import { Avatar } from "./Avatar";
import { investorHref } from "./FundCard";
import { formatUsd } from "@/lib/format";

export function PerformerRow({
  investor,
  badge,
  badgeTone = "pos",
  subtitle,
}: {
  investor: Investor;
  badge?: string;
  badgeTone?: "pos" | "neg" | "neutral";
  subtitle?: string;
}) {
  return (
    <Link
      href={investorHref(investor)}
      className="flex items-center gap-4 py-3 hover:bg-ink-50/60 rounded-xl px-2 -mx-2 transition"
    >
      <Avatar investor={investor} size={56} />
      <div className="flex-1 min-w-0">
        {badge && (
          <span
            className={
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums " +
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
        <div className="mt-1 font-semibold text-ink-900 truncate text-[17px]">
          {investor.name}
        </div>
        <div className="text-sm text-ink-500 truncate">{investor.manager}</div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-ink-300 shrink-0"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function PopularRow({
  investor,
  amount,
  subtitle,
}: {
  investor: Investor;
  amount?: number;
  subtitle?: string;
}) {
  return (
    <Link
      href={investorHref(investor)}
      className="flex items-center gap-4 py-3 hover:bg-ink-50/60 rounded-xl px-2 -mx-2 transition"
    >
      <Avatar investor={investor} size={56} />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-ink-500">
          {amount != null ? (
            <>
              <span className="text-accent font-semibold tabular-nums">
                {formatUsd(amount, { compact: true })}
              </span>{" "}
              <span>Portfolio value</span>
            </>
          ) : (
            <span>{subtitle ?? "Themed portfolio"}</span>
          )}
        </div>
        <div className="mt-1 font-semibold text-ink-900 truncate text-[17px]">
          {investor.name}
        </div>
        <div className="text-sm text-ink-500 truncate">{investor.manager}</div>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="text-ink-300 shrink-0"
      >
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
