"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialValue);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = q.trim();
        if (!trimmed) return;
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }}
      className="flex items-center gap-2 rounded-full border border-ink-200 bg-white shadow-card pl-5 pr-2 py-2 focus-within:border-ink-400 transition"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#71717A" strokeWidth="2" />
        <path
          d="M20 20l-3.5-3.5"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search any fund — Berkshire, Pelosi, Citadel…"
        className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink-400 py-1"
        aria-label="Search investors"
      />
      <button
        type="submit"
        className="rounded-full bg-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 transition"
      >
        Search
      </button>
    </form>
  );
}
