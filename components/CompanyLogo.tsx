// Server-safe component — uses locally hosted SVGs with no external deps.
// SVG files live in /public/logos/{ticker}.svg

const MAG7_LOGOS = new Set(["AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA"]);

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
  const t = ticker.toUpperCase();
  const hasLogo = MAG7_LOGOS.has(t);
  const color = BRAND_COLORS[t] ?? "#52525B";
  const initial = (name || ticker).slice(0, 1).toUpperCase();

  if (!hasLogo) {
    return (
      <div
        className={"rounded-full flex items-center justify-center font-bold text-white shrink-0 " + className}
        style={{
          width: size,
          height: size,
          background: color,
          fontSize: Math.round(size * 0.42),
        }}
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${t}.svg`}
      alt={name + " logo"}
      width={size}
      height={size}
      className={"rounded-full object-contain bg-white p-[3px] border border-ink-100 shrink-0 " + className}
      style={{ width: size, height: size }}
    />
  );
}
