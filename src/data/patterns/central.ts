/**
 * Mined co-occurrence — Đà Nẵng, Quảng Nam, Thừa Thiên Huế.
 *
 * The Đà Nẵng and Quảng Nam rows are the original 031 §Phase 8 batch, moved here unchanged when the
 * file was split. Huế was added by tasks/039.
 *
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
 *
 * - Huế: both sources end day 1 on the Nguyễn Đình Chiểu walking street, which has no atlas row.
 *   Recorded as a destination candidate in tasks/039-tour-stops.md, not as a pattern.
 */
import type { ItineraryPattern } from "./types.ts";

const READ_AT = "2026-08-16";

const SRC = {
  diff: "https://diff.vn/trai-nghiem-danang/goi-y-lich-trinh-du-lich-da-nang-5-ngay-4-dem-tu-tuc/",
  vietnambooking:
    "https://www.vietnambooking.com/du-lich/blog-du-lich/lich-trinh-du-lich-da-nang-5-ngay-4-dem.html",
  mia3d: "https://mia.vn/cam-nang-du-lich/lich-trinh-du-lich-da-nang-3-ngay-2-dem-12812",
  tixgo: "https://tixgo.vn/blog/da-nang/du-lich-da-nang-5-ngay-4-dem",
  traveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-da-nang-3-ngay-2-dem/145822",
  miaHoiAn: "https://mia.vn/cam-nang-du-lich/pho-co-hoi-an-di-san-kien-truc-an-tuong-cua-the-gioi-166",
  hueSigo: "https://sigo.vn/news/du-lich-hue-2-ngay-1-dem",
  hueHoangphu: "https://xehoangphu.vn/du-lich-hue-2-ngay-1-dem/",
} as const;

export const centralPatterns: ItineraryPattern[] = [
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

  // ── Thừa Thiên Huế (tasks/039) ─────────────────────────────────────────────
  {
    // Both sources open with the identical morning: the citadel, then Thiên Mụ upriver, and the
    // Perfume River is how you get between them — by dragon boat in one, along the bank in the
    // other. The strongest grouping in the 039 batch.
    id: "hue-citadel-river-day",
    provinceSlug: "thua-thien-hue",
    destinationIds: ["hue-imperial-city", "thien-mu-pagoda", "perfume-river"],
    occurrenceCount: 2,
    confidence: 0.85,
    sources: [SRC.hueSigo, SRC.hueHoangphu],
    verifiedAt: READ_AT,
  },
  {
    // The tombs day, ending at the market on the way back into town. Worth recording because
    // geometry would not force it: Khải Định and Tự Đức are 7 km apart on opposite sides of the
    // river, and Đông Ba is a further 8 km north. The incense village sits on the same road up to
    // Tự Đức, which is why both sources pass it. sigo names the incense village and one tomb;
    // xehoangphu names both tombs and skips the village. Both end the day at Đông Ba.
    id: "hue-tombs-market-day",
    provinceSlug: "thua-thien-hue",
    destinationIds: [
      "khai-dinh-tomb",
      "tu-duc-tomb",
      "thuy-xuan-incense-village",
      "dong-ba-market",
    ],
    occurrenceCount: 2,
    confidence: 0.75,
    sources: [SRC.hueSigo, SRC.hueHoangphu],
    verifiedAt: READ_AT,
  },
];
