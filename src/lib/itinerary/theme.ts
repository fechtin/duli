/**
 * A one-line identity for each day — docs/031.md §Phase 11 ("Day 1 / Theme").
 *
 * The engine emits a `ThemeKey` and its params, never a sentence. Two reasons, and both are hard
 * constraints rather than preferences:
 *
 *  - `npm run check:i18n` fails the build on Vietnamese text outside `t()`, and this app ships in
 *    five languages. A plan carrying its own prose could only ever be monolingual.
 *  - Slice 2 adds optional LLM narration. Keeping the deterministic layer free of prose means the
 *    model decorates a plan it cannot alter — the whole point of docs/031.md's product principle.
 *
 * `ThemeKey` is a closed union in `types.ts` so `check:i18n` can be extended to verify that every
 * member has a `trip.theme.*` entry. Without that, a missing key renders as the literal string
 * "trip.theme.whatever" in all five languages.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { DestinationType } from "../types.ts";
import type { Candidate } from "./candidates.ts";
import type { ThemeKey, TripStop } from "./types.ts";

/** Which theme a place's type argues for, strongest claim first. */
const TYPE_THEME: Partial<Record<DestinationType, ThemeKey>> = {
  beach: "coast",
  island: "coast",
  unesco: "heritage",
  palace: "heritage",
  museum: "heritage",
  village: "oldTown",
  street: "oldTown",
  temple: "spiritual",
  mountain: "mountain",
  waterfall: "mountain",
  cave: "mountain",
  viewpoint: "mountain",
  market: "food",
  cafe: "food",
  nightlife: "city",
  themepark: "city",
  city: "city",
  bridge: "city",
  park: "city",
  lake: "coast",
};

export interface ThemeResult {
  themeKey: ThemeKey;
  themeParams: Record<string, string>;
}

/**
 * Pick the theme a day argues for hardest.
 *
 * Order matters: a transfer day is *about* the transfer no matter what is seen along the way, and
 * day one is about arriving. Only after those does the mix of places get a vote.
 */
export function deriveTheme(
  day: number,
  stops: TripStop[],
  candidates: Candidate[],
  options: { transfer: boolean; fromProvince: string | null; toProvince: string },
): ThemeResult {
  if (options.transfer && options.fromProvince) {
    return {
      themeKey: "transfer",
      themeParams: { from: options.fromProvince, to: options.toProvince },
    };
  }
  if (day === 1) return { themeKey: "arrive", themeParams: { province: options.toProvince } };
  if (!stops.length) return { themeKey: "fallback", themeParams: { n: String(day) } };

  // Weight each theme by how much of the day is actually spent on it.
  const byTheme = new Map<ThemeKey, number>();
  for (const stop of stops) {
    const candidate = candidates.find((c) => c.place.id === stop.destinationId);
    if (!candidate) continue;
    const theme = TYPE_THEME[candidate.place.type];
    if (!theme) continue;
    byTheme.set(theme, (byTheme.get(theme) ?? 0) + stop.visitMinutes);
  }
  if (!byTheme.size) return { themeKey: "fallback", themeParams: { n: String(day) } };

  const [themeKey] = [...byTheme.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  return { themeKey, themeParams: { province: options.toProvince, n: String(day) } };
}
