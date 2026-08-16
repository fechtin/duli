/**
 * Mined co-occurrence — TP. Hồ Chí Minh, Lâm Đồng, Khánh Hoà, Kiên Giang. Added by tasks/039.
 *
 * Working notes, including the groups deliberately NOT stored, are in tasks/039-tour-stops.md.
 */
import type { ItineraryPattern } from "./types.ts";

const READ_AT = "2026-08-16";

const SRC = {
  hcmGreensm: "https://www.greensm.com/news/du-lich-sai-gon-3-ngay-2-dem",
  hcmLuhanh: "https://luhanhvietnam.com.vn/du-lich/du-lich-sai-gon-3-ngay-2-dem-an-choi-het-say.html",
  dlMia: "https://mia.vn/cam-nang-du-lich/lich-trinh-va-chi-phi-di-da-lat-3-ngay-2-dem-tu-tuc-1736",
  dlDulichviet:
    "https://dulichviet.com.vn/tin-tuc/goi-y-lich-trinh-du-lich-da-lat-3n2d-tu-tuc-cho-cap-doi-tiet-kiem-nhat",
  dlTraveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-da-lat-3-ngay-2-dem-2/210924",
  // nhatrang-tourist.com was also read (see tasks/039-tour-stops.md) but its land day is spent
  // entirely inside VinWonders, which has no atlas row yet — so it attests nothing citable here.
  ntVietnambooking:
    "https://www.vietnambooking.com/du-lich/tour-du-lich-ha-noi-nha-trang-vinpearl-land-3n2d.html",
  pqTraveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-phu-quoc-3-ngay-2-dem-acc/150866",
  pqFindtour: "https://findtour.vn/lich-trinh-du-lich-phu-quoc-3-ngay-2-dem",
} as const;

export const southPatterns: ItineraryPattern[] = [
  // ── TP. Hồ Chí Minh ────────────────────────────────────────────────────────
  {
    // District 1 on foot, and the most reliable grouping in the whole 039 batch: both sources open
    // day 1 with exactly these four, differing only in whether the palace or the cathedral comes
    // first. All four sit inside a 900 m square, so geometry agrees — this mostly confirms it.
    id: "hcm-downtown-day",
    provinceSlug: "ho-chi-minh",
    destinationIds: [
      "independence-palace",
      "notre-dame-saigon",
      "saigon-central-post-office",
      "nguyen-hue-walking-street",
    ],
    occurrenceCount: 2,
    confidence: 0.85,
    sources: [SRC.hcmGreensm, SRC.hcmLuhanh],
    verifiedAt: READ_AT,
  },
  {
    // The war museum folded into the same downtown day. Kept separate from the group above because
    // only one source does it — the other treats the museum as an alternative on a later day.
    id: "hcm-war-museum-downtown",
    provinceSlug: "ho-chi-minh",
    destinationIds: ["war-remnants-museum", "independence-palace"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hcmLuhanh],
    verifiedAt: READ_AT,
  },
  {
    // The market-and-Chợ Lớn day, ending in the backpacker quarter. Bến Thành to Chợ Lớn is 5 km
    // west, which distance alone would not join.
    id: "hcm-cholon-day",
    provinceSlug: "ho-chi-minh",
    destinationIds: ["ben-thanh-market", "cho-lon-district", "bui-vien-street"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hcmLuhanh],
    verifiedAt: READ_AT,
  },
  {
    // The riverside evening: the tower for the view, the wharf below it for the walk afterwards.
    id: "hcm-riverside-evening",
    provinceSlug: "ho-chi-minh",
    destinationIds: ["landmark-81", "bach-dang-wharf"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hcmGreensm],
    verifiedAt: READ_AT,
  },

  // ── Lâm Đồng / Đà Lạt ──────────────────────────────────────────────────────
  //
  // Every Đà Lạt group below carries occurrenceCount 1 despite citing two URLs. mia.vn and
  // dulichviet.com.vn publish near-identical day splits — same stops, same order, all three days —
  // so they are one observation, not two. Counting them twice would manufacture evidence, which is
  // exactly what patterns.test.ts:45 exists to catch.
  {
    // The city-centre day, in the order both sources use: the lake, the flower garden on its north
    // shore, the station east of it, the cathedral on the hill between, and the square after dark.
    // traveloka independently pairs the lake with the square, but on a different day and without
    // the rest, so it is not counted here.
    id: "dl-city-centre-day",
    provinceSlug: "lam-dong",
    destinationIds: [
      "xuan-huong-lake",
      "da-lat-flower-garden",
      "da-lat-railway-station",
      "da-lat-cathedral",
      "lam-vien-square",
    ],
    occurrenceCount: 1,
    confidence: 0.55,
    sources: [SRC.dlMia, SRC.dlDulichviet],
    verifiedAt: READ_AT,
  },
  {
    // The southern loop. Tuyền Lâm and the monastery share a cable car, the palace is on the road
    // in, and Datanla is 3 km further down the same pass — a genuine one-day circuit.
    id: "dl-tuyen-lam-day",
    provinceSlug: "lam-dong",
    destinationIds: [
      "tuyen-lam-lake",
      "truc-lam-monastery",
      "bao-dai-summer-palace",
      "datanla-waterfall",
    ],
    occurrenceCount: 1,
    confidence: 0.55,
    sources: [SRC.dlMia, SRC.dlDulichviet],
    verifiedAt: READ_AT,
  },
  {
    // The market is the lake's evening. Chợ Âm Phủ is the same building as Chợ Đà Lạt after dark,
    // which is why no separate row was added for it.
    id: "dl-market-evening",
    provinceSlug: "lam-dong",
    destinationIds: ["xuan-huong-lake", "da-lat-market"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.dlTraveloka],
    verifiedAt: READ_AT,
  },

  // ── Khánh Hoà / Nha Trang ──────────────────────────────────────────────────
  {
    // The city sightseeing day, which is what a Nha Trang trip does when it is not on a boat. The
    // four run north to south along one road, ending at the market. Named directly by one source;
    // the other spends its land day inside a theme park instead.
    id: "nt-city-temples-day",
    provinceSlug: "khanh-hoa",
    destinationIds: [
      "ponagar-towers",
      "long-son-pagoda",
      "nha-trang-cathedral",
      "hon-chong-promontory",
    ],
    occurrenceCount: 1,
    confidence: 0.55,
    sources: [SRC.ntVietnambooking],
    verifiedAt: READ_AT,
  },

  // ── Kiên Giang / Phú Quốc ──────────────────────────────────────────────────
  {
    // The arrival evening in Dương Đông: the headland shrine at sunset, the fishing village pier,
    // then the night market. All three are within 3 km of the town centre.
    id: "pq-duong-dong-evening",
    provinceSlug: "kien-giang",
    destinationIds: ["dinh-cau-phu-quoc", "ham-ninh-fishing-village", "phu-quoc-night-market"],
    occurrenceCount: 1,
    confidence: 0.55,
    sources: [SRC.pqTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // The southern day. Bãi Sao and Hàm Ninh are on opposite coasts of the same narrow south end,
    // 12 km apart, and the pagoda sits on the road between them — one loop, one day.
    id: "pq-south-coast-day",
    provinceSlug: "kien-giang",
    destinationIds: ["ho-quoc-pagoda", "bai-sao-beach", "ham-ninh-fishing-village"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.pqFindtour],
    verifiedAt: READ_AT,
  },
  {
    // The northern day: the long west-facing beach and the cape beyond it, which is as far north as
    // the island road goes. The same source also puts a southern pagoda on this day — 40 km and a
    // whole island away — and that half of its day is deliberately not recorded.
    id: "pq-north-coast-day",
    provinceSlug: "kien-giang",
    destinationIds: ["bai-dai-phu-quoc", "ganh-dau-cape"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.pqTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // The two paid attractions on the north road get done together, because nothing else is up there.
    id: "pq-prison-vinwonders-day",
    provinceSlug: "kien-giang",
    destinationIds: ["phu-quoc-prison", "vinwonders-phu-quoc"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.pqTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // The island-hopping day ends back in town at the night market — the cable car returns to An
    // Thới in the late afternoon and the market is the evening that follows.
    id: "pq-hon-thom-day",
    provinceSlug: "kien-giang",
    destinationIds: ["hon-thom-cable-car", "phu-quoc-night-market"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.pqFindtour],
    verifiedAt: READ_AT,
  },
];
