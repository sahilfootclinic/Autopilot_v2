import Link from "next/link";
import { notFound } from "next/navigation";
import { findThemedBySlug } from "@/lib/investors";
import { Avatar } from "@/components/Avatar";
import { AboutCard } from "@/components/AboutCard";
import { getBio } from "@/data/bios";

export default async function ThemedPortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const investor = findThemedBySlug(slug);
  if (!investor) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-24">
      <div className="text-sm text-ink-500 mb-6">
        <Link href="/" className="hover:text-ink-900">
          Investors
        </Link>{" "}
        <span className="mx-1.5">/</span>
        <span className="text-ink-700">{investor.name}</span>
      </div>

      <div className="flex items-center gap-5">
        <Avatar seed={investor.slug} label={investor.manager} size={80} />
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            {investor.name}
          </h1>
          <p className="text-ink-500 mt-1">{investor.manager}</p>
        </div>
      </div>

      <p className="mt-6 text-ink-400 text-sm uppercase tracking-wide">
        {investor.tagline}
      </p>

      <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-6">
        <div className="flex items-center gap-2 text-accent-dark font-semibold mb-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="M12 7v6M12 16v.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          Coming soon
        </div>
        <p className="text-ink-700 leading-relaxed">{investor.description}</p>
      </div>

      <AboutCard name={investor.manager} bio={getBio(investor.slug)} />

      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">In the meantime</h2>
        <ul className="space-y-2 text-ink-700">
          <li>
            ·{" "}
            <Link href="/" className="underline underline-offset-2">
              Browse the 20 real 13F filers we already track
            </Link>
          </li>
          <li>
            ·{" "}
            <Link href="/search" className="underline underline-offset-2">
              Search any institutional investor by name
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
