/**
 * Theme-aware region palette (025 §1.1–1.2). geo-meta.json keeps one canonical color per
 * region for data purposes; rendering uses these instead so light and dark ("Night Atlas")
 * each get a tuned, harmonized set. Keys match region ids in data/registry/vn.mjs.
 */
export type RegionPaletteEntry = { light: string; dark: string };

export const REGION_PALETTE: Record<string, RegionPaletteEntry> = {
  "northeast":           { light: "#478a6d", dark: "#245043" }, // emerald forest
  "northwest":           { light: "#6f9a58", dark: "#31523a" }, // moss highlands
  "red-river-delta":     { light: "#d6ab4c", dark: "#57492a" }, // rice gold
  "north-central-coast": { light: "#5b93ad", dark: "#26495c" }, // sea blue
  "south-central-coast": { light: "#45a3b5", dark: "#265761" }, // turquoise coast
  "central-highlands":   { light: "#b08a52", dark: "#4f402a" }, // sunlit ochre
  "southeast":           { light: "#c68f56", dark: "#55432c" }, // warm sand
  "mekong-delta":        { light: "#5fae8c", dark: "#285d4e" }, // river green
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
