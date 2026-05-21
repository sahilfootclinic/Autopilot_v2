"use client";

import Link from "next/link";
import { useState } from "react";
import { quarterLabel } from "@/lib/format";

export type QFiling = {
  accessionRaw: string;
  reportDate: string;
  form: string;
};

export function QuarterSwitcher({
  cik,
  filings,
  selectedAccession,
}: {
  cik: string;
  filings: QFiling[];
  selectedAccession: string;
}) {
  const [expanded, setExpanded] = useState(false);

  let visible = expanded ? filings : filings.slice(0, 2);
  // Always keep the currently-selected quarter visible.
  if (
    !expanded &&
    !visible.some((f) => f.accessionRaw === selectedAccession)
  ) {
    const sel = filings.find((f) => f.accessionRaw === selectedAccession);
    if (sel) visible = [...visible, sel];
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((f) => {
        const active = f.accessionRaw === selectedAccession;
        return (
          <Link
            key={f.accessionRaw}
            href={`/fund/${cik}?accession=${f.accessionRaw}`}
            className={
              "rounded-full border px-3.5 py-1.5 text-sm transition " +
              (active
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-ink-700 border-ink-200 hover:border-ink-400")
            }
          >
            {quarterLabel(f.reportDate)}
            {f.form === "13F-HR/A" ? " (A)" : ""}
          </Link>
        );
      })}
      {filings.length > 2 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
        >
          {expanded ? "Show fewer" : "See more.."}
        </button>
      )}
    </div>
  );
}
