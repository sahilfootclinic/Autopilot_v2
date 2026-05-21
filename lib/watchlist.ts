"use client";

import { useCallback, useEffect, useState } from "react";

// A tiny localStorage-backed watchlist. No accounts — each browser
// keeps its own list of starred portfolio slugs.

const KEY = "ww:watchlist";
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function write(items: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function useWatchlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    listeners.add(sync);
    window.addEventListener("storage", sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(
      cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]
    );
  }, []);

  return {
    items,
    has: (slug: string) => items.includes(slug),
    toggle,
  };
}
