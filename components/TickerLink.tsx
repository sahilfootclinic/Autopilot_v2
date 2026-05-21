import Link from "next/link";

export function TickerLink({
  ticker,
  className = "",
}: {
  ticker: string;
  className?: string;
}) {
  if (!ticker) return <span className={className}>—</span>;
  return (
    <Link
      href={`/stock/${encodeURIComponent(ticker.toUpperCase())}`}
      className={"hover:text-accent-dark hover:underline " + className}
    >
      {ticker}
    </Link>
  );
}
