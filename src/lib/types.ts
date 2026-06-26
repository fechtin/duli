// Domain types (aligned with Bible 013 data model, trimmed for the client).

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
}

export interface ProvinceContent {
  slug: string;
  summary: string;
  story: string;
  bestTime: string;
  specialties: string[];
  /** ids of destinations in this province. */
  destinationIds: string[];
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
