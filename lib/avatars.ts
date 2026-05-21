import { createAvatar } from "@dicebear/core";
import { avataaars, bottts } from "@dicebear/collection";

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
