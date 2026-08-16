/**
 * Mined co-occurrence — Hà Nội, Ninh Bình, Quảng Ninh, Lào Cai. Added by tasks/039.
 *
 * Working notes, including the groups deliberately NOT stored, are in tasks/039-tour-stops.md.
 */
import type { ItineraryPattern } from "./types.ts";

const READ_AT = "2026-08-16";

const SRC = {
  hnSinhtour: "https://sinhtour.vn/du-lich-ha-noi-3-ngay-2-dem/",
  hnTraveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-ha-noi-3-ngay-2-dem-acc/266366",
  hnGonow: "https://gonow.com.vn/du-lich-ha-noi-3-ngay-2-dem/",
  nbVexere: "https://blog.vexere.com/lich-trinh-du-lich-ninh-binh-2-ngay-1-dem-tu-tuc-chi-tiet-nhat/",
  nbBamozo: "https://bamozo.vn/du-lich-ninh-binh-2-ngay-1-dem",
  hlPhanvan: "https://phanvantravel.com/kinh-nghiem-du-lich-ha-long-2-ngay-1-dem",
  hlCatba: "https://catbaduky.vn/kinh-nghiem-du-lich-ha-long-2-ngay-1-dem-choi-gi-an-gi-o-dau",
  spTraveloka: "https://www.traveloka.com/vi-vn/explore/destination/du-lich-sapa-2-ngay-1-dem/313544",
  spSinhtour: "https://thesinhtour.com/tour-sapa-2-ngay-1-dem/",
} as const;

export const northPatterns: ItineraryPattern[] = [
  // ── Hà Nội ─────────────────────────────────────────────────────────────────
  {
    // The lake, the puppet theatre and the beer street close two different days in two different
    // sources, and both sources name all three. The order never varies: lakeside, then the 50-minute
    // show, then Tạ Hiện after dark. The theatre is on the lake's east shore and Tạ Hiện 700 m north.
    id: "hn-hoan-kiem-evening",
    provinceSlug: "ha-noi",
    destinationIds: ["hoan-kiem-lake", "thang-long-water-puppet", "ta-hien-street"],
    occurrenceCount: 2,
    confidence: 0.8,
    sources: [SRC.hnSinhtour, SRC.hnTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // The lakeside walk proper: the island temple, then the cathedral two streets west. Seen once.
    id: "hn-hoan-kiem-walk",
    provinceSlug: "ha-noi",
    destinationIds: ["hoan-kiem-lake", "ngoc-son-temple", "st-joseph-cathedral-hanoi"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hnGonow],
    verifiedAt: READ_AT,
  },
  {
    // The Ba Đình morning. The mausoleum has a hard 11:00 close and the other two are inside the
    // same walled compound, so this is partly a scheduling constraint wearing a pattern's coat —
    // but it is also what both sources do. sinhtour names all three; gonow names the mausoleum and
    // the museum and skips the pagoda.
    id: "hn-ba-dinh-morning",
    provinceSlug: "ha-noi",
    destinationIds: ["ho-chi-minh-mausoleum", "ho-chi-minh-museum", "one-pillar-pagoda"],
    occurrenceCount: 2,
    confidence: 0.75,
    sources: [SRC.hnSinhtour, SRC.hnGonow],
    verifiedAt: READ_AT,
  },
  {
    // Two museums 1.5 km apart but on opposite sides of the centre from each other, put on one day
    // by a source that treats the morning as a museum morning. Geometry alone would not pair them
    // with each other ahead of everything else in between.
    id: "hn-museum-day",
    provinceSlug: "ha-noi",
    destinationIds: ["vietnam-museum-ethnology", "national-history-museum-vn"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hnTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // Worth having precisely because distance argues against it: Văn Miếu is 2 km south of the
    // citadel across the rail line, and nothing in the geometry suggests one day. The source does.
    id: "hn-citadel-literature-day",
    provinceSlug: "ha-noi",
    destinationIds: ["temple-of-literature", "imperial-citadel-thang-long"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.hnTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // West Lake and the pagoda on its causeway. Trấn Quốc is physically in the lake, so geometry
    // agrees; recorded because the day usually runs anticlockwise from here and the engine can use
    // the anchor.
    id: "hn-west-lake-day",
    provinceSlug: "ha-noi",
    destinationIds: ["west-lake-hanoi", "tran-quoc-pagoda", "phu-tay-ho"],
    occurrenceCount: 1,
    confidence: 0.55,
    sources: [SRC.hnSinhtour],
    verifiedAt: READ_AT,
  },

  // ── Ninh Bình ──────────────────────────────────────────────────────────────
  {
    // Both sources pair them, in opposite orders, on whichever day is not the Tam Cốc day. They
    // are 15 km apart — far enough that distance alone would split them — but they share a road
    // and a ticketing rhythm, and a Bái Đính visit is a half-day that leaves exactly one boat trip.
    id: "nb-trang-an-bai-dinh-day",
    provinceSlug: "ninh-binh",
    destinationIds: ["trang-an", "bai-dinh-pagoda"],
    occurrenceCount: 2,
    confidence: 0.8,
    sources: [SRC.nbVexere, SRC.nbBamozo],
    verifiedAt: READ_AT,
  },
  {
    // The other Ninh Bình day, equally consistent: the Tam Cốc boat, then the 500 steps up Hang Múa
    // for the view back down over the same river.
    id: "nb-tam-coc-mua-day",
    provinceSlug: "ninh-binh",
    destinationIds: ["tam-coc-bich-dong", "mua-cave"],
    occurrenceCount: 2,
    confidence: 0.8,
    sources: [SRC.nbVexere, SRC.nbBamozo],
    verifiedAt: READ_AT,
  },
  {
    // The wetland day, from bamozo's second itinerary — the one for people who have already done
    // the boats. Vân Long and Thung Nham are 20 km apart with the karst massif between them, so
    // nothing in the geometry suggests one day; what joins them is that both are bird-and-water
    // half-days rather than cave trips.
    id: "nb-van-long-thung-nham-day",
    provinceSlug: "ninh-binh",
    destinationIds: ["van-long-lagoon", "thung-nham-bird-park"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.nbBamozo],
    verifiedAt: READ_AT,
  },

  // ── Quảng Ninh ─────────────────────────────────────────────────────────────
  {
    // The cruise day, and effectively the only shape a Hạ Long itinerary takes: out into the bay,
    // the big cave after lunch, Ti Tốp before the boat anchors. Both sources, same order.
    id: "hl-bay-cruise-day",
    provinceSlug: "quang-ninh",
    destinationIds: ["ha-long-bay", "sung-sot-cave", "ti-top-island"],
    occurrenceCount: 2,
    confidence: 0.8,
    sources: [SRC.hlPhanvan, SRC.hlCatba],
    verifiedAt: READ_AT,
  },

  // ── Lào Cai / Sa Pa ────────────────────────────────────────────────────────
  {
    // Cát Cát is south of town and Thác Bạc is 12 km northwest up the Ô Quy Hồ pass — geometry
    // would never put them together, and the source does, because both are half-days off the same
    // two roads out of Sa Pa.
    id: "sp-cat-cat-silver-day",
    provinceSlug: "lao-cai",
    destinationIds: ["cat-cat-village", "silver-waterfall-sapa"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.spTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // The Fansipan day. The cable car leaves from Mường Hoa, so the valley is what you cross to
    // reach it rather than a separate outing.
    id: "sp-fansipan-muong-hoa-day",
    provinceSlug: "lao-cai",
    destinationIds: ["fansipan", "muong-hoa-valley"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.spTraveloka],
    verifiedAt: READ_AT,
  },
  {
    // Arrival afternoon: Hàm Rồng rises straight out of the town centre, so the first half-day is
    // spent climbing it before anyone drives anywhere.
    id: "sp-ham-rong-town",
    provinceSlug: "lao-cai",
    destinationIds: ["ham-rong-mountain", "sa-pa-town"],
    occurrenceCount: 1,
    confidence: 0.5,
    sources: [SRC.spSinhtour],
    verifiedAt: READ_AT,
  },
];
