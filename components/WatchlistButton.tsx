"use client";

import { useWatchlist } from "@/lib/watchlist";

export function WatchlistButton({
  slug,
  size = 20,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const { has, toggle } = useWatchlist();
  const active = has(slug);
  return (
    <button
      type="button"
      aria-label={active ? "Remove from watchlist" : "Add to watchlist"}
      title={active ? "Remove from watchlist" : "Add to watchlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={
        "inline-flex items-center justify-center rounded-full transition " +
        (active
          ? "text-[#F7931A] hover:text-[#d97e0a]"
          : "text-ink-300 hover:text-ink-500") +
        " " +
        className
      }
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 18.56l-5.9 3.1 1.12-6.57L2.45 9.44l6.6-.96L12 2.5z" />
      </svg>
    </button>
  );
}
