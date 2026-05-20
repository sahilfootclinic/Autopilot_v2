import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "13F Tracker — Follow the world's top investors",
  description:
    "Track the quarterly stock holdings of legendary investors. Real-time 13F filings from the SEC.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-ink antialiased font-sans">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-ink-100">
      <div className="mx-auto max-w-page px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="ticker-dot" />
          <span className="font-semibold tracking-tight text-lg">
            13F<span className="text-accent">.</span>tracker
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-600">
          <Link href="/" className="hover:text-ink-900 transition">
            Investors
          </Link>
          <Link href="/search" className="hover:text-ink-900 transition">
            Search
          </Link>
          <Link href="/about" className="hover:text-ink-900 transition">
            About
          </Link>
        </nav>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 transition"
        >
          Browse filings
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink-100 mt-24">
      <div className="mx-auto max-w-page px-6 py-10 text-sm text-ink-500 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p>
          Data sourced from{" "}
          <a
            href="https://www.sec.gov/edgar"
            target="_blank"
            rel="noreferrer"
            className="text-ink-700 underline underline-offset-2"
          >
            SEC EDGAR
          </a>
          . For informational purposes only. Not investment advice.
        </p>
        <p className="text-ink-400">
          13F filings are reported up to 45 days after quarter-end.
        </p>
      </div>
    </footer>
  );
}
