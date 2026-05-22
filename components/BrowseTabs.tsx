"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogEntry } from "@/lib/catalog";
import { FundCard } from "./FundCard";
import { Avatar } from "./Avatar";

type TabKey = "popular" | "hedge" | "ai" | "politician" | "twitter" | "profiles";

const TABS: { key: TabKey; label: string; blurb: string }[] = [
  {
    key: "popular",
    label: "Most Popular",
    blurb: "The most-followed investors on the platform — from Buffett to Pelosi.",
  },
  {
    key: "hedge",
    label: "Hedge Funds",
    blurb: "Institutional investors who file quarterly holdings with the SEC.",
  },
  {
    key: "ai",
    label: "AI Portfolios",
    blurb: "Portfolios scored and rebalanced monthly by large language models.",
  },
  {
    key: "politician",
    label: "Politicians",
    blurb: "Members of Congress and their disclosed STOCK Act trades.",
  },
  {
    key: "twitter",
    label: "Twitter Legends",
    blurb: "Pundits and meme strategies from the timeline.",
  },
  {
    key: "profiles",
    label: "Profiles",
    blurb: "Everyone we track — tap a name to read who they are.",
  },
];

function VerifiedCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
      <path
        fill="#1A73E8"
        d="M12 1l2.4 2.1 3.2-.3 1.3 2.9 2.9 1.3-.3 3.2L23.6 16 21.5 18.4l.3 3.2-2.9 1.3-1.3 2.9-3.2-.3L12 27.6 9.6 25.5l-3.2.3-1.3-2.9-2.9-1.3.3-3.2L.4 16l2.1-2.4-.3-3.2 2.9-1.3 1.3-2.9 3.2.3z"
        transform="scale(0.83)"
      />
      <path
        fill="#fff"
        d="M8.6 12.3l2 2 4.2-4.4 1.3 1.3-5.5 5.7-3.3-3.3z"
      />
    </svg>
  );
}

function ProfileRow({ entry }: { entry: CatalogEntry }) {
  return (
    <Link
      href={entry.href}
      className="flex items-center gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-ink-50/60 transition"
    >
      <Avatar
        seed={entry.slug}
        label={entry.primary}
        image={entry.image}
        imageZoom={entry.imageZoom}
        imageFocus={entry.imageFocus}
        size={56}
        shape="circle"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-ink-900 truncate text-[17px]">
            {entry.primary}
          </span>
          <VerifiedCheck />
        </div>
        <div className="text-sm text-ink-500 truncate">
          {entry.secondary} · {entry.badgeLabel}
        </div>
      </div>
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
    </Link>
  );
}

export function BrowseTabs({
  popular,
  hedge,
  ai,
  politicians,
  twitter,
  all,
}: {
  popular: CatalogEntry[];
  hedge: CatalogEntry[];
  ai: CatalogEntry[];
  politicians: CatalogEntry[];
  twitter: CatalogEntry[];
  all: CatalogEntry[];
}) {
  const [tab, setTab] = useState<TabKey>("popular");
  const [hedgeExpanded, setHedgeExpanded] = useState(false);

  const counts: Record<TabKey, number> = {
    popular: popular.length,
    hedge: hedge.length,
    ai: ai.length,
    politician: politicians.length,
    twitter: twitter.length,
    profiles: all.length,
  };
  const active = TABS.find((t) => t.key === tab)!;

  const visibleHedge = hedgeExpanded ? hedge : hedge.slice(0, 5);

  return (
    <section id="browse" className="mx-auto max-w-page px-4 sm:px-6 py-10 sm:py-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
        Browse portfolios
      </h2>

      <div className="mt-6 flex gap-0.5 sm:gap-1 border-b border-ink-100 overflow-x-auto pb-px -mx-1 px-1">
        {TABS.map((t) => {
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-3 sm:px-4 py-2.5 text-sm sm:text-[15px] font-medium border-b-2 -mb-px whitespace-nowrap transition " +
                (isActive
                  ? "border-ink-900 text-ink-900"
                  : "border-transparent text-ink-500 hover:text-ink-700")
              }
            >
              {t.label}
              <span
                className={
                  "ml-2 rounded-full px-1.5 py-0.5 text-xs " +
                  (isActive
                    ? "bg-ink-100 text-ink-700"
                    : "bg-ink-50 text-ink-400")
                }
              >
                {counts[t.key]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-ink-500 mt-4">{active.blurb}</p>

      {tab === "profiles" ? (
        <div className="mt-4 bg-white rounded-2xl border border-ink-100 shadow-card divide-y divide-ink-100 px-4">
          {all.map((e) => (
            <ProfileRow key={e.slug} entry={e} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(tab === "popular"
              ? popular
              : tab === "hedge"
              ? visibleHedge
              : tab === "ai"
              ? ai
              : tab === "politician"
              ? politicians
              : twitter
            ).map((e) => (
              <FundCard key={e.slug} entry={e} />
            ))}
          </div>

          {tab === "hedge" && hedge.length > 5 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setHedgeExpanded((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 transition"
              >
                {hedgeExpanded
                  ? "Show fewer"
                  : `See more (${hedge.length - 5})`}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={hedgeExpanded ? "rotate-180" : ""}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
