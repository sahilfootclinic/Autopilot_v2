import Link from "next/link";
import { searchFilers } from "@/lib/edgar";
import { SearchBar } from "@/components/SearchBar";
import { INVESTORS_13F } from "@/lib/investors";

export const revalidate = 3600;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: qParam } = await searchParams;
  const q = (qParam ?? "").trim();
  const results = q ? await searchFilers(q) : [];

  return (
    <div className="mx-auto max-w-page px-6 pt-10 pb-20">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Search hedge funds
      </h1>
      <p className="text-ink-500 mt-2">
        Find any institutional investor that files Form 13F with the SEC.
      </p>
      <div className="mt-6 max-w-xl">
        <SearchBar initialValue={q} />
      </div>

      {q && (
        <section className="mt-10">
          <p className="text-sm text-ink-500 mb-4">
            {results.length === 0
              ? `No 13F filers matched "${q}".`
              : `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"`}
          </p>
          <ul className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white shadow-card overflow-hidden">
            {results.map((r) => (
              <li key={r.cik}>
                <Link
                  href={`/fund/${r.cik}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-ink-50 transition"
                >
                  <div>
                    <div className="font-medium text-ink-900">{r.name}</div>
                    <div className="text-xs text-ink-500">CIK {r.cik}</div>
                  </div>
                  <span className="text-sm text-ink-500">View →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!q && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Or browse featured</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INVESTORS_13F.map((inv) => (
              <li key={inv.cik}>
                <Link
                  href={`/fund/${inv.cik}`}
                  className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3 hover:bg-ink-50 transition"
                >
                  <div>
                    <div className="font-medium">{inv.manager}</div>
                    <div className="text-xs text-ink-500">{inv.name}</div>
                  </div>
                  <span className="text-sm text-ink-500">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
