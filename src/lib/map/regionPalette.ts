/**
 * Theme-aware region palette (025 §1.1–1.2). geo-meta.json keeps one canonical color per
 * region for data purposes; rendering uses these instead so light and dark ("Night Atlas")
 * each get a tuned, harmonized set. Keys match region ids in data/registry/vn.mjs.
 */
export type RegionPaletteEntry = { light: string; dark: string };

export const REGION_PALETTE: Record<string, RegionPaletteEntry> = {
  "northeast":           { light: "#3f9070", dark: "#245043" }, // emerald forest
  "northwest":           { light: "#6ba24f", dark: "#31523a" }, // moss highlands
  "red-river-delta":     { light: "#dcae44", dark: "#57492a" }, // rice gold
  "north-central-coast": { light: "#5497b3", dark: "#26495c" }, // sea blue
  "south-central-coast": { light: "#3aa9bd", dark: "#265761" }, // turquoise coast
  "central-highlands":   { light: "#b98d4c", dark: "#4f402a" }, // sunlit ochre
  "southeast":           { light: "#cd9350", dark: "#55432c" }, // warm sand
  "mekong-delta":        { light: "#54b48c", dark: "#285d4e" }, // river green
};

/** Coastline glow (two layered strokes — no SVG blur, GPU-cheap). */
export const COAST_GLOW = {
  light: { color: "#ffffff", wide: 0.18, near: 0.6 },
  dark:  { color: "#5eead4", wide: 0.16, near: 0.52 },
} as const;

export function regionColor(regionId: string, dark: boolean, fallback: string): string {
  const entry = REGION_PALETTE[regionId];
  return entry ? (dark ? entry.dark : entry.light) : fallback;
}
