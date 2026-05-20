export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-16 pb-24">
      <h1 className="text-4xl font-semibold tracking-tight">About</h1>
      <div className="mt-6 space-y-5 text-ink-700 text-[17px] leading-relaxed">
        <p>
          13F.tracker is a small, private site for following what the world's
          biggest institutional investors are buying and selling each quarter.
        </p>
        <p>
          Every fund manager with more than $100M in U.S. equities under
          management is required by the SEC to file a Form 13F within 45 days
          of quarter-end disclosing their long positions. This site reads
          those filings straight from{" "}
          <a
            href="https://www.sec.gov/edgar"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            SEC EDGAR
          </a>{" "}
          and makes them readable.
        </p>
        <h2 className="text-xl font-semibold pt-4">What 13F filings show</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Long U.S. stock positions held on the last day of the quarter.</li>
          <li>Number of shares and dollar value for each position.</li>
          <li>Some derivative positions (puts and calls).</li>
        </ul>
        <h2 className="text-xl font-semibold pt-4">What they don't show</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Short positions (with rare exceptions).</li>
          <li>Foreign equities or private holdings.</li>
          <li>
            Any trades made between quarter-end and the filing date — a 13F is
            a 45-day-old snapshot, not real time.
          </li>
        </ul>
        <p className="pt-4 text-ink-500 text-sm">
          For informational purposes only. Nothing on this site is investment
          advice.
        </p>
      </div>
    </div>
  );
}
