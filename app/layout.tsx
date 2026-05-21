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
  title: "Whale Watcher — Follow The Money",
  description:
    "Track what legendary hedge funds, AI portfolios, and members of Congress are buying and selling.",
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M2 13c3 0 3-3 6-3s3 3 6 3 3-3 6-3"
              stroke="#0F9D58"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 7c-1.5 0-3 1-3 3 0 2 1.5 3 3 3 .8 0 1.5-.3 2-.8-.4 2.2-2 3.8-4 3.8"
              stroke="#0A0A0A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-semibold tracking-tight text-lg">
            Whale Watcher
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
