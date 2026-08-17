// The living calendars (seasonal/festival/flower) name places in an id namespace of their own —
// `sapa-terraces`, `ha-giang-loop` — with no automatic relationship to the authoring data. These
// tables are the join, and they live here rather than next to the sidebar that renders them
// because two very different consumers need them: navigation (open the right panel) and photos
// (draw the right picture). They used to be two tables in `navHelpers`, one complete and one not,
// which is exactly how `ha-giang-loop` ended up opening Đèo Mã Pì Lèng under a blank gradient.
//
// Pure data on purpose: no value imports, so `scripts/check-photos.mjs` can read the same tables
// the app reads instead of a copy that drifts.

/**
 * Calendar id → the real destination it names.
 *
 * `navHelpers.test.ts` fails if an id here stops resolving, or if a new calendar id lands with no
 * home: an unmapped id falls through to `reset()`, which silently zooms the map back out.
 */
export const CALENDAR_DESTINATION: Record<string, string> = {
  "cat-ba-island": "hp-cat-ba-island",
  "da-nang-coast": "my-khe-beach",
  "ha-giang-loop": "ma-pi-leng-pass",
  "ha-noi-old-quarter": "old-quarter-hanoi",
  "hoi-an-old-town": "hoi-an-ancient-town",
  "nha-trang-coast": "nha-trang-beach",
  "ninh-binh-trang-an": "trang-an",
  // Chùa Hương in Hà Nội — NOT `chua-huong-tich`, a different pagoda 230km south in Hà Tĩnh.
  "perfume-pagoda": "chua-huong",
  // The Katê entry names the tower the festival is actually held at.
  "phan-rang-ninh-thuan": "ntn-po-klong-garai",
  "phan-thiet-coast": "mui-ne-sand-dunes",
  "phong-nha-caves": "phong-nha-cave",
  "phu-yen-coast": "pye-ganh-da-dia",
  "sapa-terraces": "sa-pa-town",
};

/**
 * Calendar ids that name a whole city rather than a place. Their seasonal state is city-wide
 * weather ("mùa mưa chiều, sáng nắng đẹp"), so the province panel is the honest target —
 * promoting one landmark to stand for the city would put the wrong subject on screen.
 */
export const CALENDAR_PROVINCE: Record<string, string> = {
  "ho-chi-minh-city": "ho-chi-minh",
};

// A hand-kept coordinate table used to live here as a third fallback. It is gone: every living
// id now reaches a destination or a province, and a table that only moves the camera is exactly
// what shadowed `selectDestination` in the first place. A new calendar id belongs in one of the
// two maps above — or needs a destination authored for it, which is what `perfume-pagoda` got.

/**
 * Cards that show something OTHER than their destination's cover photo.
 *
 * This is no longer the table that decides whether a card has a picture at all — `calendarSeed`
 * derives that from the destination above, so a new calendar id arrives with the right photo
 * already and an id nobody remembered can no longer come up blank.
 *
 * What is left is only the disagreement. One entry is a real editorial call: `da-nang-coast`
 * opens Bãi biển Mỹ Khê but shows Cầu Vàng, because that is the picture of the Đà Nẵng coast in
 * a reader's head. The rest are hand-picks that predate the derivation and merely happen to
 * differ from it; each is kept so this refactor changes no pixel it was not asked to change, and
 * any of them can be dropped once someone has looked at both photos and preferred the cover.
 *
 * Every seed here must resolve to a real photo — `check:photos` fails if one stops.
 */
export const CALENDAR_SEED_OVERRIDES: Record<string, string> = {
  "cat-ba-island": "hp-cat-ba-island-1", // cover is hp-cat-ba-island-7
  "da-lat-city": "dalat-1", // cover is da-lat-city-3
  "da-nang-coast": "goldenbridge-1", // editorial: cover is my-khe-beach-3
  "hoi-an-old-town": "hoian-1", // cover is hoi-an-ancient-town-6
  "hue-imperial-city": "hue-1", // cover is hue-2
  "mu-cang-chai-terraces": "mu-cang-chai-terraces-1", // cover is mu-cang-chai-terraces-5
  "sapa-terraces": "sapa-1", // cover is sa-pa-town-1
  // `perfume-pagoda` used to sit here pointing at "huong-tich-chua-co" — a photo of Chùa Hương
  // Tích in Hà Tĩnh, captioned "Chùa cổ giữa rừng Hồng Lĩnh". The Chùa Hương festival card was
  // showing a different pagoda 230km away. No seed is better than the wrong subject; the new
  // `chua-huong` destination has no reviewed photo yet, so the card keeps the clean gradient.
};

/**
 * A curated hero place: reliable photo seed + coordinates for the daily Hero Banner.
 * Display name + subtitle are resolved from the dictionary (`place.<id>` / `hero.subtitle.<id>`).
 */
export interface HeroPlace {
  id: string;
  /** image-manifest seed that is known to have a real photo. */
  seed: string;
  lng: number;
  lat: number;
  /** Set when the copy comes from the authoring data instead of the dictionary (Korea). */
  name?: string;
  subtitle?: string;
}

// Rotated daily. Every seed here is verified by `check:photos` to resolve to a real photo, so the
// hero never falls back to a gradient (027 §Hero Image — "bắt buộc"). These are hand-picked
// rather than derived: the banner is 340px of the first screen, and which photo of Sa Pa goes
// there is an editorial call, not "whatever sorts first".
export const HERO_PLACES: HeroPlace[] = [
  { id: "sa-pa", seed: "sapa-1", lng: 103.844, lat: 22.336 },
  { id: "ha-long", seed: "halong-1", lng: 107.078, lat: 20.91 },
  { id: "da-lat", seed: "dalat-1", lng: 108.458, lat: 11.94 },
  { id: "hue", seed: "hue-1", lng: 107.59, lat: 16.463 },
  { id: "golden-bridge", seed: "goldenbridge-1", lng: 108.0, lat: 15.995 },
  { id: "mu-cang-chai", seed: "mu-cang-chai-terraces-1", lng: 104.15, lat: 21.71 },
  { id: "ban-gioc", seed: "ban-gioc-waterfall-1", lng: 106.72, lat: 22.855 },
];
