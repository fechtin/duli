/**
 * Itinerary patterns — docs/031.md §Phase 8.
 *
 * WHAT THIS IS: structured co-occurrence signal mined from real, publicly shared itineraries.
 * Which places people actually put on the same day, how often, and where that was observed.
 *
 * WHAT THIS IS NOT, and must never become: a copy of anyone's itinerary. §Phase 8 is explicit —
 * *"Do NOT copy third-party tour itineraries verbatim. Instead extract structured signals."*
 * Facts are not copyrightable but the selection and arrangement of a day plan is, and the sources
 * below are commercial travel publishers. So this file stores only ids, counts and attribution;
 * no descriptions, no day titles, no ordering prose. The engine uses it as one ranking signal
 * among several, never as a template to replay.
 *
 * WHY IT EXISTS: `Destination.nearby` was supposed to carry this, but it maxes out at degree 2
 * with just two cross-province edges in the whole Vietnamese atlas — a pair hint, not a graph.
 * Real itineraries know things geometry does not: that Ngũ Hành Sơn and Hội An are one day because
 * they are on the same road south, that Sơn Trà means the pagoda and the beach too.
 *
 * SCOPE: Đà Nẵng and Quảng Nam only, deliberately. Those are the only two provinces with enough
 * destinations (18 and 14) for a pattern to reference places the atlas actually has; the other 61
 * still carry three each, so mining them would produce ids that do not exist. Adding a hub later
 * is a data-only change.
 *
 * HOW TO EXTEND: read several independent itineraries for the hub, record only pairs/groups that
 * appear on the SAME day, count how many sources showed each, and cite every one. Do not raise a
 * count without adding the source that justifies it.
 */

export interface ItineraryPattern {
  id: string;
  /** The hub this pattern belongs to. */
  provinceSlug: string;
  /** Destination ids observed sharing a single day. Must exist in the atlas. */
  destinationIds: string[];
  /** How many INDEPENDENT sources showed this grouping. */
  occurrenceCount: number;
  /** 0–1. Derived from occurrenceCount; kept explicit so a judgement call can override. */
  confidence: number;
  /** Every source that contributed to the count. Attribution is not optional. */
  sources: string[];
  /** ISO date the sources were read. */
  verifiedAt: string;
}

const READ_AT = "2026-08-16";

const SRC = {
  diff: "https://diff.vn/trai-nghiem-danang/goi-y-lich-trinh-du-lich-da-nang-5-ngay-4-dem-tu-tuc/",
  vietnambooking:
    "https://www.vietnambooking.com/du-lich/blog-du-lich/lich-trinh-du-lich-da-nang-5-ngay-4-dem.html",
  mia3d: "https://mia.vn/cam-nang-du-lich/lich-trinh-du-lich-da-nang-3-ngay-2-dem-12812",
  tixgo: "https://tixgo.vn/blog/da-nang/du-lich-da-nang-5-ngay-4-dem",
  traveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-da-nang-3-ngay-2-dem/145822",
  miaHoiAn: "https://mia.vn/cam-nang-du-lich/pho-co-hoi-an-di-san-kien-truc-an-tuong-cua-the-gioi-166",
} as const;

export const itineraryPatterns: ItineraryPattern[] = [
  // ── Đà Nẵng ────────────────────────────────────────────────────────────────
  {
    // The single most consistent day in every Đà Nẵng itinerary read: the peninsula, its pagoda
    // and the beach below it are one outing, not three.
    id: "dn-son-tra-day",
    provinceSlug: "da-nang",
    destinationIds: ["son-tra-peninsula", "linh-ung-pagoda-bai-but", "my-khe-beach"],
    occurrenceCount: 3,
    confidence: 0.9,
    sources: [SRC.vietnambooking, SRC.tixgo, SRC.traveloka],
    verifiedAt: READ_AT,
  },
  {
    // Named in docs/031.md §Phase 8 itself as the example of a strong relationship, and the
    // sources agree: both sit on the road south out of the city.
    id: "dn-marble-hoian-day",
    provinceSlug: "da-nang",
    destinationIds: ["marble-mountains", "hoi-an-ancient-town"],
    occurrenceCount: 2,
    confidence: 0.75,
    sources: [SRC.diff, SRC.vietnambooking],
    verifiedAt: READ_AT,
  },
  {
    // The riverside evening. Every source ends a city day here, and the bridge show is after dark.
    id: "dn-riverside-evening",
    provinceSlug: "da-nang",
    destinationIds: ["dragon-bridge", "my-khe-beach"],
    occurrenceCount: 2,
    confidence: 0.7,
    sources: [SRC.diff, SRC.tixgo],
    verifiedAt: READ_AT,
  },
  {
    // The downtown half-day: museum, market, beach. One source directly; the cluster is also
    // 1.5 km across, so geometry already agrees and this only reinforces it.
    id: "dn-downtown-day",
    provinceSlug: "da-nang",
    destinationIds: ["cham-museum", "han-market", "my-khe-beach"],
    occurrenceCount: 1,
    confidence: 0.45,
    sources: [SRC.mia3d],
    verifiedAt: READ_AT,
  },
  {
    // Sơn Trà and Ngũ Hành Sơn on one day — plausible but seen once, so weighted accordingly.
    id: "dn-son-tra-marble",
    provinceSlug: "da-nang",
    destinationIds: ["son-tra-peninsula", "marble-mountains"],
    occurrenceCount: 1,
    confidence: 0.4,
    sources: [SRC.traveloka],
    verifiedAt: READ_AT,
  },

  // ── Quảng Nam / Hội An ─────────────────────────────────────────────────────
  {
    // The ancient-town walk. All four are inside the same ticketed quarter, minutes apart on foot,
    // and every "one day in Hội An" plan strings them together.
    id: "qn-old-town-walk",
    provinceSlug: "quang-nam",
    destinationIds: [
      "hoi-an-ancient-town",
      "japanese-covered-bridge",
      "phuc-kien-assembly-hall",
      "tan-ky-house",
    ],
    occurrenceCount: 1,
    confidence: 0.6,
    sources: [SRC.miaHoiAn],
    verifiedAt: READ_AT,
  },
  {
    // Hội An after dark is the reason people stay past sunset; the night market is the same visit
    // as the old town, several hours later.
    id: "qn-old-town-evening",
    provinceSlug: "quang-nam",
    destinationIds: ["hoi-an-ancient-town", "hoi-an-night-market"],
    occurrenceCount: 2,
    confidence: 0.75,
    sources: [SRC.tixgo, SRC.miaHoiAn],
    verifiedAt: READ_AT,
  },
];

/**
 * Observed but deliberately NOT stored as a pattern:
 *
 * - `ba-na-hills` + `golden-bridge` appear together in all five sources, but the atlas lists them
 *   as two rows 630 m apart behind one cable-car ticket. `selectCandidates` already collapses them
 *   into a single entry, so a co-occurrence bonus would have nothing to act on. The five sightings
 *   instead served as confirmation that the dedupe is right.
 *
 * - "Chùa Linh Ứng" on a Bà Nà day (mia.vn) is a DIFFERENT pagoda. Đà Nẵng has three of them —
 *   Bãi Bụt, Bà Nà and Ngũ Hành Sơn — and the atlas carries only the Sơn Trà one
 *   (`linh-ung-pagoda-bai-but`). Counting that sighting would have wired the peninsula pagoda to a
 *   mountain 30 km away. Name-matching mined text against atlas ids is the sharpest hazard in this
 *   whole file; when a name is ambiguous, drop the observation rather than guess.
 *
 * - Base behaviour is a signal too, but it belongs in `config.ts` (`DAY_TRIP_KM`) rather than here:
 *   four of five sources keep one Đà Nẵng hotel for the whole trip, while one moves to Hội An for
 *   a single night. The dominant behaviour is what the engine reproduces.
 */
