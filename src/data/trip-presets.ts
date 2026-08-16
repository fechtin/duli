/**
 * Named starting points for the trip planner.
 *
 * These exist because a generated plan, however good, opens cold: the traveller has to trust an
 * algorithm before they have seen anything. A preset gives them something recognisable to start
 * from — "Đà Nẵng cổ điển, 5 ngày" — and then they edit it.
 *
 * WHAT A PRESET IS: an *input* to the engine. A province, a length, a style, a pace, and a few
 * places that must appear. Nothing more.
 *
 * WHAT IT IS DELIBERATELY NOT: a stored day-by-day plan. Storing days would mean copying the
 * structure of somebody's published itinerary (docs/031.md §Phase 8 forbids exactly that), it
 * would go stale the moment a site changes its opening hours, it would be monolingual, and it
 * would break the instant a traveller removed a stop — because something would still have to
 * re-time the rest of the day. Running a preset through the engine avoids all four.
 *
 * SCOPE: Đà Nẵng only for now. It is the one province dense enough (18 destinations) for the
 * choice between presets to be meaningful; elsewhere the atlas still holds three places per
 * province and every preset would produce the same trip. Adding a hub is a data-only change.
 *
 * Every `pinned` id must exist in the atlas and every `labelKey` must exist in all five locale
 * files — `presets.test.ts` and `npm run check:i18n` enforce both.
 */

import type { CountryCode } from "../lib/types.ts";
import type { TripPace, TripStyle } from "../lib/itinerary/types.ts";

export interface TripPreset {
  id: string;
  country: CountryCode;
  provinceSlug: string;
  /** i18n key — never a literal string; `check:i18n` fails the build on Vietnamese text in JSX. */
  labelKey: string;
  days: number;
  style: TripStyle;
  pace: TripPace;
  /**
   * Places this preset promises. The engine treats them as a strong instruction, not a guarantee:
   * a pin whose opening hours cannot be honoured on any day is still dropped, because putting
   * someone outside a locked gate is worse than a shorter trip.
   */
  pinned: string[];
}

export const tripPresets: TripPreset[] = [
  {
    // The trip almost every first-time visitor actually takes: the cable car, the peninsula, the
    // old town. All four appear in every published Đà Nẵng itinerary read for §Phase 8.
    id: "dn-classic-5",
    country: "vn",
    provinceSlug: "da-nang",
    labelKey: "trip.preset.dnClassic5",
    days: 5,
    style: "mixed",
    pace: "balanced",
    pinned: ["ba-na-hills", "son-tra-peninsula", "hoi-an-ancient-town", "marble-mountains"],
  },
  {
    // A long weekend. Deliberately short on pins so the engine still has room to shape the days.
    id: "dn-short-3",
    country: "vn",
    provinceSlug: "da-nang",
    labelKey: "trip.preset.dnShort3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: ["ba-na-hills", "my-khe-beach"],
  },
  {
    // Cham towers and the two UNESCO sites — the reason people come to this coast at all.
    id: "dn-heritage-5",
    country: "vn",
    provinceSlug: "da-nang",
    labelKey: "trip.preset.dnHeritage5",
    days: 5,
    style: "heritage",
    pace: "balanced",
    pinned: ["hoi-an-ancient-town", "my-son-sanctuary", "cham-museum", "marble-mountains"],
  },
  {
    // Slow, sea-facing, minimal driving. `relaxed` caps the day at two stops, which is the point.
    id: "dn-coast-4",
    country: "vn",
    provinceSlug: "da-nang",
    labelKey: "trip.preset.dnCoast4",
    days: 4,
    style: "beach",
    pace: "relaxed",
    pinned: ["my-khe-beach", "son-tra-peninsula", "non-nuoc-beach"],
  },
];

/** Presets offered for a province, in display order. Empty is a normal answer, not an error. */
export function presetsFor(provinceSlug: string, country: CountryCode): TripPreset[] {
  return tripPresets.filter((p) => p.provinceSlug === provinceSlug && p.country === country);
}
