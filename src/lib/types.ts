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

export type DestinationI18n = Partial<Record<ContentLocale, DestinationTranslation>>;
export type ProvinceI18n = Partial<Record<ContentLocale, ProvinceTranslation>>;

export type RegionId =
  | "northeast"
  | "northwest"
  | "red-river-delta"
  | "north-central-coast"
  | "south-central-coast"
  | "central-highlands"
  | "southeast"
  | "mekong-delta";

export interface Region {
  id: RegionId;
  name: string;
  nameEn: string;
  color: string;
}

export interface ProvinceMeta {
  slug: string;
  name: string;
  nameEn: string;
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
  | "market";

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

export interface Checkin {
  id: string;
  destinationId: string;
  destinationName: string;
  provinceSlug: string;
  caption: string;
  photoSeed: string;
  createdAt: number;
}

export interface AwardedBadge {
  id: string;
  emoji: string;
  label: string;
}

/** Map focus intents dispatched from anywhere; the engine animates to them. */
export type FocusTarget =
  | { kind: "reset" }
  | { kind: "province"; slug: string }
  | { kind: "point"; lng: number; lat: number; zoom: number };
