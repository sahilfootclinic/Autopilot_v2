import { createAvatar } from "@dicebear/core";
import { avataaars, bottts } from "@dicebear/collection";
import { PHOTOS } from "@/data/photoManifest";

// Deterministic cartoon avatars. People get an illustrated cartoon face;
// AI portfolios get a robot. Generated server-side and embedded as data
// URIs — no external requests, no API keys, stable per seed.

const cache = new Map<string, string>();

const PERSON_BG = [
  "b6e3f4",
  "c0aede",
  "d1d4f9",
  "ffd5dc",
  "ffdfbf",
  "c8f7d4",
];

export function personAvatar(seed: string): string {
  const key = "p:" + seed;
  const hit = cache.get(key);
  if (hit) return hit;
  const uri = createAvatar(avataaars, {
    seed,
    backgroundColor: PERSON_BG,
    backgroundType: ["solid"],
  }).toDataUri();
  cache.set(key, uri);
  return uri;
}

export function botAvatar(seed: string): string {
  const key = "b:" + seed;
  const hit = cache.get(key);
  if (hit) return hit;
  const uri = createAvatar(bottts, {
    seed,
    backgroundColor: ["ddd6fe", "e9d5ff", "c4b5fd"],
    backgroundType: ["solid"],
  }).toDataUri();
  cache.set(key, uri);
  return uri;
}

/** Real photo from public/avatars/ if present, else a cartoon face. */
export function photoOrPerson(slug: string, seed: string): string {
  return PHOTOS[slug] ?? personAvatar(seed);
}

/** Real photo from public/avatars/ if present, else a robot. */
export function photoOrBot(slug: string, seed: string): string {
  return PHOTOS[slug] ?? botAvatar(seed);
}
