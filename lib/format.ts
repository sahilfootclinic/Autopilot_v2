export function formatUsd(n: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(n)) return "—";
  if (opts?.compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(n)) return "—";
  if (opts?.compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatPercent(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}

/** Share counts as 50k, 3.0M, 2.0B. */
export function formatCompactShares(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) {
    const k = abs / 1e3;
    return `${sign}${k >= 100 ? Math.round(k).toString() : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `${sign}${Math.round(abs)}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

export function quarterLabel(reportDate: string): string {
  if (!reportDate) return "—";
  const [y, m] = reportDate.split("-").map(Number);
  if (!y || !m) return reportDate;
  const q = Math.ceil(m / 3);
  return `Q${q} ${y}`;
}
