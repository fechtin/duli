/**
 * Trip planner — every tunable number in one file.
 *
 * If a magic number appears anywhere else in `src/lib/itinerary/`, it belongs here instead.
 * docs/031.md §Phase 7 asks for configurable weights; this is that file.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { DestinationType } from "../types.ts";
import type { TripInterest, TripPace, TripStyle } from "./types.ts";

/**
 * Bump on ANY change that alters engine output. It rides in the request URL, so a deploy cannot
 * leave stale plans cached at Cloudflare's edge for the full TTL.
 */
export const ENGINE_VERSION = "1";

// ── The day ──────────────────────────────────────────────────────────────────

/** Minutes from midnight. A day starts after breakfast and ends before it gets late. */
export const DAY_START_MIN = 8 * 60;
export const DAY_END_MIN = 19 * 60;

export const LUNCH_MIN = 12 * 60;
export const DINNER_MIN = 18 * 60 + 30;
export const MEAL_DURATION_MIN = 60;

/** Slack after each stop so a plan survives contact with reality. */
export const BUFFER_PER_STOP_MIN = 15;

/**
 * Latest the traveller may be back at their bed.
 *
 * `DAY_END_MIN` only bounded when the last VISIT ends, which said nothing about the drive home:
 * a stop four hours out could finish at 18:00 and have you arrive at 22:00. Dinner on the road is
 * fine, midnight is not.
 */
export const LATEST_HOME_MIN = 21 * 60;

/**
 * Least a day must contain before it is worth calling a day.
 *
 * When the good places ran out the engine kept emitting days anyway — one had sixty minutes of
 * sightseeing inside an eight-hour budget, another was a single night market opening at 17:00.
 * Padding a trip to the requested length is a worse answer than saying it is shorter: the
 * `shortened` notice is right there, and a traveller can decide for themselves.
 */
export const MIN_DAY_VISIT_MIN = 120;

// ── Pace ─────────────────────────────────────────────────────────────────────

/**
 * Pace sets a MINUTES budget, never a place count.
 *
 * Counting places is what produces 12-hour days: of the 15 places in the Đà Nẵng r150 corridor,
 * four are full-day or longer and seven more are "Nửa ngày" (~4h). Three of those in one day is
 * eleven hours of standing up. `maxStops` below is a safety cap, not a target — the real limiter
 * is `activeMinutes`, and stop count emerges from it (realistically 1–3).
 */
export interface PaceProfile {
  /** Total minutes of visiting + travelling the traveller is willing to spend in a day. */
  activeMinutes: number;
  /** Hard cap so a day of tiny viewpoints doesn't turn into a checklist. */
  maxStops: number;
  /**
   * How far the day may reach OUT from the base to its first stop. Generous, because that is
   * exactly what a day trip is: real Đà Nẵng itineraries drive ~2.5 h to Huế and back in a day.
   */
  maxOutboundMinutes: number;
  /**
   * How far the day may hop BETWEEN stops. Tight, and this is the number that matters most.
   * With one limit for both, a day happily paired Mỹ Sơn (south) with Thiên Mụ (Huế, north) —
   * 2 h 50 between them, arriving at 16:10 for a one-hour visit. No real itinerary does that;
   * they spend a whole day on Huế instead. Once out, you stay out there.
   */
  maxLegMinutes: number;
}

export const PACE: Record<TripPace, PaceProfile> = {
  relaxed: { activeMinutes: 6 * 60, maxStops: 2, maxOutboundMinutes: 120, maxLegMinutes: 60 },
  balanced: { activeMinutes: 8 * 60, maxStops: 3, maxOutboundMinutes: 180, maxLegMinutes: 75 },
  packed: { activeMinutes: 10 * 60, maxStops: 4, maxOutboundMinutes: 240, maxLegMinutes: 90 },
};

/**
 * How far a traveller will go and still come back to the same bed — the single number that decides
 * whether a trip relocates or day-trips, and the one most worth getting right.
 *
 * Measured in MINUTES, not kilometres, because terrain is the whole point: 100 km of mountain road
 * is 3.5 h and nobody drives it twice in a day, while 100 km of coastal highway is a morning. A
 * straight-line threshold cannot tell those apart; the travel provider already can.
 *
 * Calibrated against real shared itineraries (docs/031.md §Phase 8 — structured signal, not copied
 * text). Both of these are done as day trips, and both must therefore pass:
 *
 *   Đà Nẵng → Huế        185 min   (84 km, coastal)
 *   Hà Nội → Ninh Bình   155 min   (87 km, delta)
 *
 * 195 sits just above the further of the two. Anything beyond it is over three hours each way,
 * which is when a traveller moves hotel instead.
 */
export const DAY_TRIP_MINUTES = 195;

/**
 * Two entries this close are one visit, not two.
 *
 * The atlas lists Cầu Vàng and Bà Nà Hills as separate destinations, and they are 630 m apart on
 * the same mountain behind the same cable-car ticket. Scheduling them on different days is the
 * single most obviously wrong thing the engine can output, and no traveller would forgive it.
 *
 * Applied only around a full-day anchor, deliberately. Downtown Đà Nẵng packs eight entries into
 * a 1.5 km radius (Cầu Rồng, Bảo tàng Chăm, chợ Hàn, chợ Cồn, APEC…) and those genuinely are
 * separate stops you choose between — a blanket merge would swallow the whole city centre into
 * one unusable day.
 */
export const CO_SITE_KM = 2;

/**
 * A mid-day hop must not cost more time than the place it leads to is worth.
 *
 * This replaced a cross-province leg limit, which was the wrong axis entirely. Measured on the
 * three legs that decide it:
 *
 *   Sơn Trà → Chùa Cầu   45 min driving for a **30 min** visit  → refuse
 *   Ngũ Hành Sơn → Hội An 25 min for a half-to-whole-day visit  → allow (2 sources agree)
 *   Mỹ Sơn → Hội An       43 min for a half-to-whole-day visit  → allow (attested)
 *
 * The first two straddle a province line and the third does not, so administrative boundaries
 * separate none of them — while "don't drive longer than you'll stay" separates all three. The
 * province rule also quietly destroyed the Red River Delta, where provinces sit 20–30 km apart and
 * crossing one is unremarkable: a Hà Nội request for five days returned three, one stop per day,
 * without Hà Nội in it.
 *
 * Applies only after the first stop. Reaching OUT from the base is a day trip, and a day trip is
 * allowed to cost more than any single stop on it.
 */
export const MAX_TRAVEL_TO_VISIT_RATIO = 1;

// ── Reach ────────────────────────────────────────────────────────────────────

/**
 * How far from the origin province the engine may look, tried in order until supply is enough.
 *
 * Kilometres from where the traveller actually is, measured to each PLACE — a province is an
 * administrative fact and says nothing about how far anything is.
 *
 * Two ladders because one constant cannot serve both atlases: measured, VN r150 from `da-nang`
 * yields 15 destinations while KR r150 from `seoul` yields 88. The first rung is city-sized, which
 * IS a city day-planner once an area carries enough venues, so one code path covers both scales.
 */
export const RADIUS_LADDER_KM: Record<string, number[]> = {
  vn: [30, 80, 150, 220],
  kr: [25, 60, 110, 170],
};

/** Beyond this, a single transfer stops being a drive. Bounds the island/ferry problem. */
export const MAX_TRANSFER_KM = 260;

/** A leg longer than this over water is flagged — the engine has no ferry or flight data. */
export const WATER_CROSSING_HINT_KM = 60;

// ── Place profiles ───────────────────────────────────────────────────────────

/** When a place is worth visiting. `any` = no constraint. */
export type DayPart = "any" | "daylight" | "evening";

export interface TypeProfile {
  /** Used only when `visitDuration` fails to parse — it never has, but data changes. */
  fallbackMinutes: number;
  /** Which interests this type satisfies. */
  interests: TripInterest[];
  dayPart: DayPart;
  /** Types that routinely consume a whole day regardless of what the string says. */
  fullDayProne?: boolean;
}

/**
 * Per-type planning profile.
 *
 * The last five are the venue types added by task 038 (`cafe`/`viewpoint`/`nightlife`/
 * `themepark`/`street`). They are configured ahead of their data landing: when those rows arrive,
 * a city itinerary falls out of the existing ladder at rung 0 with no code change.
 */
export const TYPE_PROFILE: Record<DestinationType, TypeProfile> = {
  beach: { fallbackMinutes: 150, interests: ["beach", "nature"], dayPart: "daylight" },
  mountain: { fallbackMinutes: 240, interests: ["mountain", "nature"], dayPart: "daylight" },
  temple: { fallbackMinutes: 75, interests: ["spiritual", "heritage"], dayPart: "daylight" },
  museum: { fallbackMinutes: 90, interests: ["heritage", "city"], dayPart: "daylight" },
  unesco: { fallbackMinutes: 180, interests: ["heritage"], dayPart: "daylight" },
  waterfall: { fallbackMinutes: 120, interests: ["nature"], dayPart: "daylight" },
  island: { fallbackMinutes: 240, interests: ["beach", "nature"], dayPart: "daylight" },
  cave: { fallbackMinutes: 150, interests: ["nature"], dayPart: "daylight" },
  park: { fallbackMinutes: 90, interests: ["nature", "city"], dayPart: "any" },
  village: { fallbackMinutes: 120, interests: ["heritage", "city"], dayPart: "daylight" },
  lake: { fallbackMinutes: 90, interests: ["nature"], dayPart: "any" },
  bridge: { fallbackMinutes: 45, interests: ["city"], dayPart: "any" },
  city: { fallbackMinutes: 120, interests: ["city"], dayPart: "any" },
  market: { fallbackMinutes: 75, interests: ["food", "city"], dayPart: "any" },
  palace: { fallbackMinutes: 120, interests: ["heritage"], dayPart: "daylight" },

  // ── 038 venue types ────────────────────────────────────────────────────────
  cafe: { fallbackMinutes: 60, interests: ["food", "city"], dayPart: "any" },
  viewpoint: { fallbackMinutes: 45, interests: ["nature", "mountain"], dayPart: "daylight" },
  nightlife: { fallbackMinutes: 90, interests: ["city"], dayPart: "evening" },
  /** Bà Nà Hills, Sun World — a cable car and a mountain-top complex is not a two-hour stop. */
  themepark: { fallbackMinutes: 480, interests: ["city", "mountain"], dayPart: "daylight", fullDayProne: true },
  street: { fallbackMinutes: 75, interests: ["city", "heritage"], dayPart: "any" },
};

/** Which types satisfy which interest — derived from TYPE_PROFILE so the two cannot drift. */
export const INTEREST_TYPES: Record<TripInterest, DestinationType[]> = (() => {
  const out = {} as Record<TripInterest, DestinationType[]>;
  for (const [type, profile] of Object.entries(TYPE_PROFILE) as [DestinationType, TypeProfile][]) {
    for (const interest of profile.interests) (out[interest] ??= []).push(type);
  }
  return out;
})();

/** Style is a preset over interests; the traveller can still pick interests explicitly. */
export const STYLE_INTERESTS: Record<TripStyle, TripInterest[]> = {
  nature: ["nature", "mountain", "beach"],
  heritage: ["heritage", "spiritual"],
  food: ["food", "city"],
  beach: ["beach", "nature"],
  mixed: [],
};

// ── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Weights for ranking a candidate place. Everything here derives from a column that was
 * editorially authored or externally verified — nothing is invented.
 *
 * Deliberately absent:
 * - `verified` badge — it sits on 170/187 VN rows but only 43/189 KR rows. It is provenance
 *   ("the place exists and the coordinates are right"), not merit; scoring it would rank Vietnam
 *   at random and systematically under-rank Korea.
 * - `ai-recommended` badge — machine-assigned. Scoring it would launder a model's guess into an
 *   editorial signal, which is the exact thing this project's provenance rule exists to prevent.
 */
export const SCORE = {
  /** `featured` is a hand-made editorial call — the strongest honest signal available. */
  featured: 30,
  badge: {
    unesco: 22,
    popular: 14,
    trending: 10,
    "hidden-gem": 6,
    festival: 4,
    new: 3,
    /** See above — intentionally zero, kept explicit so nobody "fixes" it later. */
    verified: 0,
    "ai-recommended": 0,
  } as Record<string, number>,
  /** Per interest matched by the place's type. */
  interestMatch: 18,
  /** Small nudge for a curated co-occurrence edge. `nearby` maxes out at degree 2, so it can
   *  only ever be a hint — it is not a graph and must not be used for clustering. */
  nearbyEdge: 5,
  /**
   * Bonus for a place that real itineraries put on the same day as something already chosen,
   * scaled by the pattern's confidence (docs/031.md §Phase 8, data in
   * `src/data/itinerary-patterns.ts`).
   *
   * Weighted above `nearbyEdge` because it carries strictly more information: `nearby` is one
   * editor's hunch at degree 2, whereas a pattern counts independent published itineraries. Still
   * kept below `featured`, so a mined habit nudges the order of a day rather than deciding what
   * goes in the trip at all.
   */
  patternEdge: 22,
  /**
   * Subtracted per hour of travel from whatever the day already contains. Set high enough to
   * dominate the interest bonus, because with a day-trip radius of 110 km a base's pool spans
   * places five hours apart in opposite directions — Huế one way, Hội An the other — and nothing
   * else stops a day pairing them.
   */
  travelPenaltyPerHour: 45,
  /** Places with a known opening window are mildly preferred — the plan can promise more. */
  hoursKnown: 4,
  /**
   * A place the traveller (or a preset) asked for by name. Large enough to outrank every other
   * signal combined, because a pin is an instruction, not a preference — but it still cannot
   * override opening hours or the day budget, which is why it is a score and not a bypass.
   */
  pinned: 500,
} as const;

/**
 * How well-attested a mined grouping must be before it is allowed to claim a whole day, rather
 * than merely nudge the order within one. Set so a grouping seen once colours a day while one
 * seen two or three times decides it.
 */
export const PATTERN_SEED_MIN_CONFIDENCE = 0.6;

// ── Travel ───────────────────────────────────────────────────────────────────

/**
 * Great-circle km → minutes. Straight-line distance understates a real road, and by how much
 * depends on terrain: `src/lib/ai/prompt.ts` notes Mù Cang Chải is ~230 km direct but ~280 km by
 * QL32, and mountain roads cost far more per km than delta highways.
 *
 * These are ESTIMATES and the whole pipeline labels them as such. Never render kilometres.
 */
export const TRAVEL = {
  /** Effective door-to-door speed, km/h, before the terrain multiplier. */
  baseSpeedKmh: 45,
  /** Distance multipliers — road length over great-circle, by terrain of the harder endpoint. */
  detourFactor: {
    /** Passes and highland roads. */
    mountain: 1.55,
    /** Coast roads and river deltas with bridges and ferries. */
    coastal: 1.3,
    /** Everything else. */
    default: 1.25,
  },
  /** Getting out of and into a place — parking, walking, finding it. */
  fixedOverheadMin: 10,
  /** Round every output to this, so nothing ever reads as "2h 07m" precision. */
  roundToMin: 5,
} as const;

/** Types whose approach road is mountainous. */
export const MOUNTAIN_TYPES: DestinationType[] = ["mountain", "waterfall", "cave", "viewpoint"];
/** Types reached along the coast or across water. */
export const COASTAL_TYPES: DestinationType[] = ["beach", "island"];
