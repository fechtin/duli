/**
 * Trip planner — the vocabulary the deterministic engine speaks (docs/031.md, re-scoped).
 *
 * Two rules govern every shape in this file.
 *
 * 1. **No prose.** The engine emits `themeKey` + params, never a sentence. `npm run check:i18n`
 *    fails the build on Vietnamese text outside `t()`, and a plan that carried its own strings
 *    could only ever be monolingual. The UI renders `t(`trip.theme.${themeKey}`, themeParams)`.
 *
 * 2. **Every duration is an estimate and says so.** `src/lib/ai/prompt.ts` forbids the model from
 *    turning a great-circle distance into a travel time; this engine deliberately excepts itself
 *    (a plan needs a clock) but only under `precision: "estimate"`. See `travel.ts`.
 *
 * Runtime imports in this directory MUST be relative — the Worker bundles it and wrangler/esbuild
 * does not resolve the `@/` alias for subpaths. `purity.test.ts` pins that.
 */

import type { BadgeKind, CountryCode, DestinationType } from "../types.ts";

// ── Input ────────────────────────────────────────────────────────────────────

/** What a traveller picks in the form. Three taps; everything else has a default. */
export type TripStyle = "nature" | "heritage" | "food" | "beach" | "mixed";

/** How hard the day is worked. Sets a minutes budget, never a place count. */
export type TripPace = "relaxed" | "balanced" | "packed";

/**
 * Interests map 1:1 onto verified `DestinationType` values — see `config.ts INTEREST_TYPES`.
 * There is deliberately no `family`: no verified column supports it, and a tags-based guess
 * would be fabrication wearing a filter's clothes (the thing `check:content` exists to stop).
 */
export type TripInterest = "heritage" | "nature" | "beach" | "mountain" | "city" | "spiritual" | "food";

export interface TripInput {
  /** Province the traveller is starting from; the radius ladder expands outward from here. */
  originProvince: string;
  days: number;
  style: TripStyle;
  pace: TripPace;
  /** Empty = no filter (every type is eligible). */
  interests: TripInterest[];
  country: CountryCode;
  /**
   * Per-day variation seeds. Present from day one so a future "regenerate day 3" can vary day 3
   * alone while every other day reproduces byte-identically. Absent = all zeroes.
   */
  seeds?: number[];
  /**
   * Multi-day places ("2 ngày 1 đêm") are excluded by default — they eat the trip. Opt-in only.
   */
  allowMultiDay?: boolean;
  /**
   * Destination ids the trip must feature if they can be scheduled at all. Set by a preset, and
   * later by a traveller who pins something. Not a hard guarantee: a pinned place whose opening
   * hours cannot be honoured is still dropped, because inventing a time is the worse failure.
   */
  pinned?: string[];
}

// ── The row the engine consumes ──────────────────────────────────────────────

/**
 * A destination as the engine needs it — deliberately NOT `Destination`.
 *
 * `worker/db.ts toDestination()` overlays the i18n translation onto `visitDuration`/`openingHours`,
 * so reusing it would feed "2시간" to a Vietnamese-vocabulary parser on a `locale=ko` request and
 * produce a *different plan in Korean than in Vietnamese*. These two fields must always be the
 * base Vietnamese values. `plan.test.ts` pins that invariant.
 */
export interface PlaceRow {
  id: string;
  slug: string;
  provinceSlug: string;
  name: string;
  type: DestinationType;
  lng: number;
  lat: number;
  badges: BadgeKind[];
  tags: string[];
  featured: boolean;
  /** Base (Vietnamese) value — never the localized overlay. */
  visitDuration: string;
  /** Base (Vietnamese) value — never the localized overlay. */
  openingHours: string;
  /** Co-occurrence hint. Holds destination **ids**, not slugs — 242/242 VN tokens resolve by id. */
  nearby: string[];
}

/** A province, reduced to what routing needs. */
export interface ProvinceNode {
  slug: string;
  lng: number;
  lat: number;
}

/** A meal candidate. Sparse by nature — 38 rows over 20 of 80 provinces. */
export interface MealRow {
  id: string;
  name: string;
  provinceSlug: string;
  lng: number;
  lat: number;
  openHours: string;
  atlasScore: number;
}

/**
 * A mined co-occurrence group — see `src/data/itinerary-patterns.ts`.
 *
 * Kept to the three fields the engine actually needs, so the engine never depends on the shape of
 * the authoring file (which also carries sources, counts and provenance for humans to audit).
 */
export interface PatternRow {
  id: string;
  destinationIds: string[];
  /** 0–1. Scales the bonus, so a grouping seen once cannot outvote one seen three times. */
  confidence: number;
}

/** Everything the engine reads. Passing it in keeps the engine pure and trivially testable. */
export interface TripData {
  places: PlaceRow[];
  provinces: ProvinceNode[];
  meals: MealRow[];
  /** Optional: absent means geometry and editorial signals alone decide, which still works. */
  patterns?: PatternRow[];
}

// ── Normalization ────────────────────────────────────────────────────────────

/** Parsed `visitDuration`. `parseVisitDuration` is total over the shipped vocabulary. */
export interface VisitSpec {
  /** Scheduling budget in minutes — the SHORTEST plausible reading of the raw string. */
  minutes: number;
  /** Consumes a whole day ("Cả ngày", "1 ngày"). Cannot share the day with much else. */
  fullDay: boolean;
  /** Needs 2+ days ("2 ngày 1 đêm"). Excluded unless `allowMultiDay`. */
  multiDay: boolean;
  raw: string;
}

/**
 * Parsed `openingHours` — a **total classifier**, not an extractor.
 *
 * Measured over all 376 rows: 58% start with `HH:MM`, 70% contain a range somewhere, and 29%
 * contain no digit at all. A first-match regex is actively wrong on strings like
 * "Khu ngoài trời mở 24 giờ; phòng triển lãm 10:00–19:00" — it would close a 24-hour site at 19:00.
 * So anything not confidently a single whole-site window classifies as `unknown`, which schedules
 * fine but is never *claimed* to be open.
 */
export type OpenSpec =
  /** A single unambiguous whole-site window, in minutes from midnight. */
  | { kind: "interval"; openMin: number; closeMin: number; raw: string }
  /** Open around the clock / no gate. */
  | { kind: "always"; raw: string }
  /** Not confidently parseable. Schedulable, but never asserted as open. */
  | { kind: "unknown"; raw: string };

// ── Output ───────────────────────────────────────────────────────────────────

/**
 * Day themes. A closed literal union so the dictionary can be checked against it —
 * `check:i18n` verifies key parity across locales, NOT coverage against engine output, so a
 * theme with no `trip.theme.*` entry would render as its own key in all five languages.
 */
export type ThemeKey =
  | "arrive"
  | "oldTown"
  | "coast"
  | "heritage"
  | "mountain"
  | "city"
  | "spiritual"
  | "food"
  | "transfer"
  | "fallback";

/** Why a duration should never be rendered as a hard number. */
export type Precision = "estimate";

export interface TripStop {
  destinationId: string;
  provinceSlug: string;
  order: number;
  /** Minutes from midnight. */
  arrivalMinutes: number;
  departureMinutes: number;
  visitMinutes: number;
  /** 0 for the first stop of a day. Always an estimate. */
  travelFromPreviousMinutes: number;
  /** True when opening hours were confidently known and respected. */
  hoursKnown: boolean;
}

export interface TripMeal {
  /** Which slot this fills. */
  slot: "lunch" | "dinner";
  atMinutes: number;
  /** Absent when no restaurant was in range — the slot is still held open as free time. */
  restaurantId?: string;
  restaurantName?: string;
  provinceSlug: string;
}

export interface TripDay {
  day: number;
  themeKey: ThemeKey;
  themeParams: Record<string, string>;
  /** Province the traveller sleeps in. The most-asked question of a multi-province trip. */
  nightProvince: string;
  estimatedTravelMinutes: number;
  estimatedVisitMinutes: number;
  stops: TripStop[];
  meals: TripMeal[];
  /**
   * False when this day has no alternative places to swap in — with 2–3 usable places per base
   * that is common, and a reroll button that returns the same day looks broken.
   */
  rerollable: boolean;
}

/** Things the plan must admit about itself. Rendered as `trip.notice.*`. */
export type TripNoticeKey =
  /** Fewer days than asked — the area ran out of content. */
  | "shortened"
  /** A leg crosses open water; the engine cannot cost a ferry or flight it has no data for. */
  | "waterCrossing"
  /** Some opening hours were unknown, so the clock is indicative for those stops. */
  | "hoursUnknown"
  /** No restaurant data in one or more bases; meal slots are free time. */
  | "mealsUnknown";

export interface TripPlan {
  originProvince: string;
  /** Every province the route touches, in visit order. */
  provinces: string[];
  requestedDays: number;
  totalDays: number;
  totalStops: number;
  estimatedTravelMinutes: number;
  /** Always "estimate". Exists so the UI cannot forget to render a tilde. */
  precision: Precision;
  days: TripDay[];
  notices: TripNoticeKey[];
  /** Bumped whenever engine output changes, so an edge-cached plan cannot outlive a deploy. */
  engineVersion: string;
}
