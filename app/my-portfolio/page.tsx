import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioBuilder } from "@/components/PortfolioBuilder";

export const metadata: Metadata = {
  title: "My Portfolio — Sentinel",
  description: "Build and track your own custom portfolio with live prices.",
};

export default function MyPortfolioPage() {
  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900 transition">
          Portfolios
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">My Portfolio</span>
      </div>

      <PortfolioBuilder />
    </div>
  );
}
