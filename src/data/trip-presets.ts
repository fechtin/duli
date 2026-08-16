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
 * SCOPE: the 11 provinces the 038/039 passes made dense enough (11–23 destinations) for the choice
 * between presets to be meaningful. The other 52 still hold two or three places each, so every
 * preset there would produce the same trip. Adding a hub is a data-only change.
 *
 * Every `pinned` id must exist in the atlas and every `labelKey` must exist in all five locale
 * files — `presets.test.ts` and `npm run check:i18n` enforce both.
 *
 * WHAT `pinned` COSTS: `presets.test.ts` asserts the engine returns the advertised number of days
 * AND schedules every pin. Both can fail from a pin set that looks perfectly reasonable, so every
 * set below was probed against `generateTrip` before being written, not reasoned about. The sharp
 * one found doing that: pinning `ho-chi-minh-mausoleum` together with `temple-of-literature`
 * collapses a 3-day Hà Nội trip to a single day — either alone is fine, and the pair is two of the
 * city's most-visited sites. Not diagnosed here; the presets route around it and it is written up
 * in tasks/todo.md. Prefer three pins to four, and re-run the tests after touching any of them.
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

  // ── Hà Nội ─────────────────────────────────────────────────────────────────
  // The classic trip deliberately skips the mausoleum: pinned alongside Văn Miếu it collapses the
  // trip (see the header). Ba Đình still gets visited — it is simply not promised.
  {
    id: "hn-classic-3",
    country: "vn",
    provinceSlug: "ha-noi",
    labelKey: "trip.preset.hnClassic3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: ["hoan-kiem-lake", "temple-of-literature", "old-quarter-hanoi"],
  },
  {
    id: "hn-heritage-4",
    country: "vn",
    provinceSlug: "ha-noi",
    labelKey: "trip.preset.hnHeritage4",
    days: 4,
    style: "heritage",
    pace: "balanced",
    pinned: [
      "imperial-citadel-thang-long",
      "temple-of-literature",
      "hoa-lo-prison",
      "national-history-museum-vn",
    ],
  },
  {
    // Two pins only, both on West Lake, so `relaxed` (max two stops a day) has room to breathe.
    id: "hn-slow-3",
    country: "vn",
    provinceSlug: "ha-noi",
    labelKey: "trip.preset.hnSlow3",
    days: 3,
    style: "mixed",
    pace: "relaxed",
    pinned: ["west-lake-hanoi", "tran-quoc-pagoda"],
  },

  // ── TP. Hồ Chí Minh ────────────────────────────────────────────────────────
  {
    // The District 1 walk both mined itineraries open with.
    id: "hcm-classic-3",
    country: "vn",
    provinceSlug: "ho-chi-minh",
    labelKey: "trip.preset.hcmClassic3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: [
      "independence-palace",
      "notre-dame-saigon",
      "ben-thanh-market",
      "nguyen-hue-walking-street",
    ],
  },
  {
    // Củ Chi is 40 km out and eats a day, which is why this one is four and not three.
    id: "hcm-history-4",
    country: "vn",
    provinceSlug: "ho-chi-minh",
    labelKey: "trip.preset.hcmHistory4",
    days: 4,
    style: "heritage",
    pace: "balanced",
    pinned: ["war-remnants-museum", "cu-chi-tunnels", "independence-palace"],
  },
  {
    id: "hcm-cholon-3",
    country: "vn",
    provinceSlug: "ho-chi-minh",
    labelKey: "trip.preset.hcmCholon3",
    days: 3,
    style: "food",
    pace: "balanced",
    pinned: ["cho-lon-district", "binh-tay-market", "bui-vien-street"],
  },

  // ── Đà Lạt ─────────────────────────────────────────────────────────────────
  {
    id: "dl-classic-4",
    country: "vn",
    provinceSlug: "lam-dong",
    labelKey: "trip.preset.dlClassic4",
    days: 4,
    style: "mixed",
    pace: "balanced",
    pinned: ["xuan-huong-lake", "langbiang", "da-lat-market", "da-lat-railway-station"],
  },
  {
    id: "dl-nature-4",
    country: "vn",
    provinceSlug: "lam-dong",
    labelKey: "trip.preset.dlNature4",
    days: 4,
    style: "nature",
    pace: "balanced",
    pinned: ["datanla-waterfall", "tuyen-lam-lake", "pongour-waterfall"],
  },
  {
    id: "dl-slow-3",
    country: "vn",
    provinceSlug: "lam-dong",
    labelKey: "trip.preset.dlSlow3",
    days: 3,
    style: "mixed",
    pace: "relaxed",
    pinned: ["xuan-huong-lake", "lam-vien-square", "da-lat-cathedral"],
  },

  // ── Huế ────────────────────────────────────────────────────────────────────
  {
    // The citadel-and-river day two independent sources both open with (`hue-citadel-river-day`).
    id: "hue-classic-3",
    country: "vn",
    provinceSlug: "thua-thien-hue",
    labelKey: "trip.preset.hueClassic3",
    days: 3,
    style: "heritage",
    pace: "balanced",
    pinned: ["hue-imperial-city", "thien-mu-pagoda", "khai-dinh-tomb"],
  },
  {
    id: "hue-tombs-4",
    country: "vn",
    provinceSlug: "thua-thien-hue",
    labelKey: "trip.preset.hueTombs4",
    days: 4,
    style: "heritage",
    pace: "balanced",
    pinned: ["khai-dinh-tomb", "tu-duc-tomb", "minh-mang-tomb", "hue-imperial-city"],
  },
  {
    id: "hue-coast-4",
    country: "vn",
    provinceSlug: "thua-thien-hue",
    labelKey: "trip.preset.hueCoast4",
    days: 4,
    style: "beach",
    pace: "relaxed",
    pinned: ["lang-co-beach", "thuan-an-beach", "hue-imperial-city"],
  },

  // ── Hạ Long ────────────────────────────────────────────────────────────────
  // Two only: Quảng Ninh's 039 candidates all failed coordinate resolution, so the hub did not gain
  // the extra rows a third distinct preset would need.
  {
    id: "hl-bay-3",
    country: "vn",
    provinceSlug: "quang-ninh",
    labelKey: "trip.preset.hlBay3",
    days: 3,
    style: "nature",
    pace: "balanced",
    pinned: ["ha-long-bay", "sung-sot-cave", "ti-top-island"],
  },
  {
    id: "hl-yentu-4",
    country: "vn",
    provinceSlug: "quang-ninh",
    labelKey: "trip.preset.hlYentu4",
    days: 4,
    style: "mixed",
    pace: "balanced",
    pinned: ["ha-long-bay", "yen-tu", "quang-ninh-museum"],
  },

  // ── Nha Trang ──────────────────────────────────────────────────────────────
  {
    id: "nt-classic-4",
    country: "vn",
    provinceSlug: "khanh-hoa",
    labelKey: "trip.preset.ntClassic4",
    days: 4,
    style: "mixed",
    pace: "balanced",
    pinned: ["nha-trang-beach", "ponagar-towers", "hon-mun-island", "long-son-pagoda"],
  },
  {
    id: "nt-islands-4",
    country: "vn",
    provinceSlug: "khanh-hoa",
    labelKey: "trip.preset.ntIslands4",
    days: 4,
    style: "beach",
    pace: "relaxed",
    pinned: ["hon-mun-island", "hon-tam-island", "nha-trang-beach"],
  },
  {
    // The land day from `nt-city-temples-day`. Chợ Đầm is left unpinned — with it the trip drops to
    // a single day.
    id: "nt-city-3",
    country: "vn",
    provinceSlug: "khanh-hoa",
    labelKey: "trip.preset.ntCity3",
    days: 3,
    style: "heritage",
    pace: "balanced",
    pinned: ["ponagar-towers", "long-son-pagoda", "nha-trang-cathedral"],
  },

  // ── Phú Quốc ───────────────────────────────────────────────────────────────
  {
    id: "pq-classic-4",
    country: "vn",
    provinceSlug: "kien-giang",
    labelKey: "trip.preset.pqClassic4",
    days: 4,
    style: "mixed",
    pace: "balanced",
    pinned: [
      "bai-sao-beach",
      "dinh-cau-phu-quoc",
      "hon-thom-cable-car",
      "phu-quoc-night-market",
    ],
  },
  {
    id: "pq-beach-4",
    country: "vn",
    provinceSlug: "kien-giang",
    labelKey: "trip.preset.pqBeach4",
    days: 4,
    style: "beach",
    pace: "relaxed",
    pinned: ["bai-sao-beach", "bai-dai-phu-quoc", "ganh-dau-cape"],
  },
  {
    id: "pq-south-3",
    country: "vn",
    provinceSlug: "kien-giang",
    labelKey: "trip.preset.pqSouth3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: ["ho-quoc-pagoda", "bai-sao-beach", "ham-ninh-fishing-village"],
  },

  // ── Sa Pa ──────────────────────────────────────────────────────────────────
  // `sa-pa-town` is never pinned: its visitDuration is "2 ngày", so pinning it in a 3-day trip
  // guarantees the engine drops it and the preset breaks its own promise.
  {
    id: "sp-classic-3",
    country: "vn",
    provinceSlug: "lao-cai",
    labelKey: "trip.preset.spClassic3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: ["fansipan", "cat-cat-village", "muong-hoa-valley"],
  },
  {
    id: "sp-villages-4",
    country: "vn",
    provinceSlug: "lao-cai",
    labelKey: "trip.preset.spVillages4",
    days: 4,
    style: "nature",
    pace: "balanced",
    pinned: ["muong-hoa-valley", "ta-van-village", "cat-cat-village"],
  },

  // ── Ninh Bình ──────────────────────────────────────────────────────────────
  {
    // Both mined Ninh Bình groups in one trip: Tràng An with Bái Đính, Tam Cốc with Hang Múa.
    id: "nb-classic-3",
    country: "vn",
    provinceSlug: "ninh-binh",
    labelKey: "trip.preset.nbClassic3",
    days: 3,
    style: "mixed",
    pace: "balanced",
    pinned: ["trang-an", "tam-coc-bich-dong", "mua-cave"],
  },
  {
    id: "nb-heritage-3",
    country: "vn",
    provinceSlug: "ninh-binh",
    labelKey: "trip.preset.nbHeritage3",
    days: 3,
    style: "heritage",
    pace: "balanced",
    pinned: ["hoa-lu-ancient-capital", "bai-dinh-pagoda", "trang-an"],
  },
  {
    id: "nb-nature-4",
    country: "vn",
    provinceSlug: "ninh-binh",
    labelKey: "trip.preset.nbNature4",
    days: 4,
    style: "nature",
    pace: "balanced",
    pinned: ["cuc-phuong-national-park", "van-long-lagoon", "thung-nham-bird-park"],
  },
];

/** Presets offered for a province, in display order. Empty is a normal answer, not an error. */
export function presetsFor(provinceSlug: string, country: CountryCode): TripPreset[] {
  return tripPresets.filter((p) => p.provinceSlug === provinceSlug && p.country === country);
}
