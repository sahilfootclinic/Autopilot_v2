import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-6 py-32 text-center">
      <div className="text-sm font-medium text-accent">404</div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Filer not found
      </h1>
      <p className="mt-3 text-ink-500 max-w-md mx-auto">
        We couldn't find that filer on SEC EDGAR. Try searching by name.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink-900 text-white px-5 py-2.5 text-sm font-medium hover:bg-ink-800"
      >
        ← Back home
      </Link>
    </div>
  );
}
