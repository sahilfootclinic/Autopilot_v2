"use client";

import { useState } from "react";

const LOGO_DOMAINS: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOGL: "google.com",
  GOOG: "google.com",
  AMZN: "amazon.com",
  NVDA: "nvidia.com",
  META: "meta.com",
  TSLA: "tesla.com",
};

const BRAND_COLORS: Record<string, string> = {
  AAPL: "#000000",
  MSFT: "#00A4EF",
  GOOGL: "#4285F4",
  GOOG: "#4285F4",
  AMZN: "#FF9900",
  NVDA: "#76B900",
  META: "#0866FF",
  TSLA: "#CC0000",
};

export function CompanyLogo({
  ticker,
  name,
  size = 40,
  className = "",
}: {
  ticker: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const domain = LOGO_DOMAINS[ticker.toUpperCase()];
  const color = BRAND_COLORS[ticker.toUpperCase()] ?? "#52525B";
  const initial = (name || ticker).slice(0, 1).toUpperCase();

  const fallback = (
    <div
      className={"rounded-full flex items-center justify-center font-bold text-white shrink-0 " + className}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );

  if (!domain || failed) return fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={name + " logo"}
      width={size}
      height={size}
      className={"rounded-full object-contain bg-white border border-ink-100 shrink-0 " + className}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
