// Domain types (aligned with Bible 013 data model, trimmed for the client).

/**
 * Languages that editorial CONTENT (destinations/provinces) can be translated into.
 * Vietnamese is the base/source language and the fallback, so it is excluded here.
 * To add a new content language: add its code here and provide a translation file
 * under src/data/i18n/<region>/<code>.ts (see src/data/i18n/README.md).
 */
export type ContentLocale = "en" | "ko" | "ja" | "zh";

/** Translatable fields of a destination (a subset of Destination, all optional). */
export interface DestinationTranslation {
  name?: string;
  summary?: string;
  story?: string;
  facts?: string[];
  travelTips?: string[];
  bestTime?: string;
  visitDuration?: string;
  ticket?: string;
  openingHours?: string;
  /** Gallery captions, aligned by index with Destination.gallery. */
  galleryCaptions?: string[];
}

/** Translatable fields of province editorial content. */
export interface ProvinceTranslation {
  name?: string;
  summary?: string;
  story?: string;
  bestTime?: string;
  specialties?: string[];
}

/** Translatable fields of a dish/specialty (all optional; arrays index-aligned with VN source). */
export interface DishTranslation {
  name?: string;
  summary?: string;
  story?: string;
  ingredients?: string[];
  flavor?: string;
  bestTime?: string;
}

/** Translatable fields of a restaurant (arrays index-aligned with VN source). */
export interface RestaurantTranslation {
  name?: string;
  address?: string;
  reasons?: string[];
}

/** Translatable fields of a living-calendar seasonal entry (client overlay). */
export interface SeasonalTranslation {
  state?: string;
}

/** Translatable fields of a living-calendar flower entry (client overlay). */
export interface FlowerTranslation {
  flower?: string;
}

/** Translatable fields of a living-calendar festival (client overlay). */
export interface FestivalTranslation {
  name?: string;
  description?: string;
}

export type SeasonalI18n = Partial<Record<ContentLocale, SeasonalTranslation>>;
export type FlowerI18n = Partial<Record<ContentLocale, FlowerTranslation>>;
export type FestivalI18n = Partial<Record<ContentLocale, FestivalTranslation>>;

export type DestinationI18n = Partial<Record<ContentLocale, DestinationTranslation>>;
export type ProvinceI18n = Partial<Record<ContentLocale, ProvinceTranslation>>;
export type DishI18n = Partial<Record<ContentLocale, DishTranslation>>;
export type RestaurantI18n = Partial<Record<ContentLocale, RestaurantTranslation>>;

/** Atlases the app can show. Each has its own geometry, registry and content (see src/lib/country). */
export type CountryCode = "vn" | "kr";

export type VnRegionId =
  | "northeast"
  | "northwest"
  | "red-river-delta"
  | "north-central-coast"
  | "south-central-coast"
  | "central-highlands"
  | "southeast"
  | "mekong-delta";

export type KrRegionId =
  | "sudogwon"
  | "gangwon"
  | "chungcheong"
  | "honam"
  | "gyeongbuk"
  | "gyeongnam"
  | "jeju";

export type RegionId = VnRegionId | KrRegionId;

export interface Region {
  id: RegionId;
  name: string;
  nameEn: string;
  /** Native-script name, when romanization isn't what locals read (Korean regions). */
  nameKo?: string;
  color: string;
}

export interface ProvinceMeta {
  slug: string;
  name: string;
  nameEn: string;
  /** Native-script name, when romanization isn't what locals read (e.g. 서울특별시). */
  nameKo?: string;
  regionId: RegionId;
  regionName: string;
  color: string;
  centroid: [number, number]; // [lng, lat]
}

export type DestinationType =
  | "beach"
  | "mountain"
  | "temple"
  | "museum"
  | "unesco"
  | "waterfall"
  | "island"
  | "cave"
  | "park"
  | "village"
  | "lake"
  | "bridge"
  | "city"
  | "market"
  /** Royal palaces, fortresses and gates (added with the Korea atlas). */
  | "palace";

export interface GalleryImage {
  /** Deterministic seed used by the illustrated placeholder. */
  seed: string;
  caption: string;
  author?: string;
  ratio?: "16/9" | "4/3" | "1/1";
}

export interface Destination {
  id: string;
  slug: string;
  provinceSlug: string;
  name: string;
  nameEn: string;
  type: DestinationType;
  lng: number;
  lat: number;
  summary: string;
  story: string;
  /** 5–10 short interesting facts (Bible 009 §Interesting Facts). */
  facts: string[];
  travelTips: string[];
  bestTime: string;
  visitDuration: string;
  ticket: string; // "" => free
  openingHours: string;
  badges: BadgeKind[];
  tags: string[];
  gallery: GalleryImage[];
  /** Slugs of nearby destinations. */
  nearby: string[];
  featured?: boolean;
  /**
   * Authority this entry was checked against — an official site or a Wikipedia/Wikidata
   * entry. Absent = never verified.
   *
   * What it does and does not vouch for: the place exists under this name, and `lng`/`lat`
   * put it where the authority does. It does NOT vouch for `ticket` or `openingHours` —
   * Wikipedia almost never carries prices, so those stay unverified on the entries the
   * 034 sweep touched. Treat a price in this dataset as indicative, never as current.
   */
  sourceUrl?: string;
  /** ISO date (YYYY-MM-DD) of that check. `scripts/verify-content.mjs` flags stale entries. */
  verifiedAt?: string;
  /** Per-locale translations of the textual fields. VI fields above are the fallback. */
  i18n?: DestinationI18n;
}

export interface ProvinceContent {
  slug: string;
  summary: string;
  story: string;
  bestTime: string;
  specialties: string[];
  /** ids of destinations in this province. */
  destinationIds: string[];
  /** Per-locale translations of the textual fields. VI fields above are the fallback. */
  i18n?: ProvinceI18n;
}

/** Aggregated province view returned by the API (Bible 015 §Read Optimized). */
export interface ProvinceBundle {
  meta: ProvinceMeta;
  content: ProvinceContent | null;
  destinations: Destination[];
}

/** Lightweight destination shape for map markers + search index. */
export interface DestinationLight {
  id: string;
  slug: string;
  provinceSlug: string;
  name: string;
  nameEn: string;
  type: DestinationType;
  lng: number;
  lat: number;
  summary: string;
  tags: string[];
  badges: BadgeKind[];
  gallery: GalleryImage[];
  featured: boolean;
}

export type BadgeKind =
  | "unesco"
  | "trending"
  | "festival"
  | "popular"
  | "verified"
  | "new"
  | "hidden-gem"
  | "ai-recommended";

/** A dish the user has tasted, tagged with the atlas it belongs to. */
export interface TastedDish {
  id: string;
  country: CountryCode;
}

export interface Checkin {
  id: string;
  /** Which atlas this check-in belongs to (older rows default to "vn"). */
  country: CountryCode;
  destinationId: string;
  destinationName: string;
  provinceSlug: string;
  caption: string;
  photoSeed: string;
  /** URL to user-uploaded photo (Firebase Storage). Falls back to photoSeed if absent. */
  photoUrl?: string;
  createdAt: number;
}

export interface AwardedBadge {
  id: string;
  emoji: string;
  label: string;
  description?: string;
}

/** Map focus intents dispatched from anywhere; the engine animates to them. */
export type FocusTarget =
  | { kind: "reset" }
  | { kind: "province"; slug: string }
  | { kind: "point"; lng: number; lat: number; zoom: number };

// ── Food Explorer (Bible 026) ─────────────────────────────────
export type DishTag =
  | "noodle" | "spicy" | "vegetarian-option" | "coffee" | "street"
  | "breakfast" | "late-night" | "dessert" | "seafood" | "rice";

export type RestaurantLabel =
  | "ai-pick" | "local-favorite" | "atlas-pick" | "street-food" | "fine-dining" | "family";

export interface Dish {
  id: string; // slug
  name: string;
  nameEn: string;
  emoji: string;
  summary: string;
  story: string;
  originProvince: string;
  provinceSlugs: string[];
  ingredients: string[];
  flavor: string;
  bestTime: string;
  tags: DishTag[];
  featured?: boolean;
  i18n?: DishI18n;
}

export interface Restaurant {
  id: string;
  dishId: string;
  name: string;
  provinceSlug: string;
  address: string;
  lng: number;
  lat: number;
  priceRange: string;
  openHours: string;
  labels: RestaurantLabel[];
  /** 026 §Atlas Score — FechTin Go's own composite (editorial in Phase 1). */
  atlasScore: number;
  /** 026 §AI Recommendation — every pick must explain itself. */
  reasons: string[];
  i18n?: RestaurantI18n;
}

export interface DishWithRestaurants extends Dish {
  restaurants: Restaurant[];
}
