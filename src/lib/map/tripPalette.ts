/**
 * Per-day colours for the itinerary route.
 *
 * Sibling to `regionPalette.ts` and following its rule (docs/025 §1.1): rendering colour lives in
 * a palette module, never in the data. Kept separate from `REGION_PALETTE` because a day index is
 * an orthogonal axis to a region — and because that palette's `dark` values cannot be reused here:
 * they are desaturated LAND FILLS meant to sit under high fill-opacity, and as 3px strokes on the
 * night sea (`--map-sea: #0c1c24`) they would vanish.
 *
 * So the two columns are tuned in opposite directions. Light-mode contrast against a pale map
 * comes from DARKNESS, dark-mode contrast against a near-black sea comes from BRIGHTNESS.
 *
 * Hue order matters more than the individual hues: consecutive days are ~100–140° apart, because
 * the thing that actually goes wrong is two days' lines running parallel down the same coast.
 */

export interface TripDayColor {
  light: string;
  dark: string;
}

export const TRIP_DAY_PALETTE: TripDayColor[] = [
  { light: "#0f6b52", dark: "#4ee0ac" }, // 1 · rừng → ngọc bích (brand-adjacent)
  { light: "#b5471f", dark: "#ff9a5c" }, // 2 · đất nung → mơ chín
  { light: "#1f5f9e", dark: "#6cc0ff" }, // 3 · biển sâu → trời
  { light: "#8a5cc2", dark: "#c3a2ff" }, // 4 · chàm → tử đinh hương
  { light: "#a8862a", dark: "#f0c661" }, // 5 · lúa vàng → vàng ấm
  { light: "#127e86", dark: "#5fdcdc" }, // 6 · đầm phá → lam ngọc
  { light: "#b23a6b", dark: "#ff8fb4" }, // 7 · sen → hồng
];

/**
 * The casing stroke painted under every route line. Load-bearing, not decoration: day 3's
 * `#1f5f9e` over the north-central-coast light fill (`#5497b3`) is only ~2.6:1 on its own, and the
 * halo restores legibility over any terrain. Same two-layer trick as `COAST_GLOW`, and just as
 * cheap — no SVG blur.
 */
export const TRIP_CASING = {
  light: "rgba(255,255,255,0.85)",
  dark: "rgba(3,12,16,0.72)",
} as const;

function rgba(hex: string, alpha: number): string {
  const v = hex.replace("#", "");
  const n = parseInt(v, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Colour for a day, wrapping past seven.
 *
 * `soft` is for fills and chip backgrounds only. Day colours must never be small text on
 * `--surface`: `#a8862a` on white is ~3.6:1, which fails at 12px. White numerals on a coloured
 * medallion is the pattern that works.
 */
export function tripDayColor(dayIndex: number, dark: boolean): { line: string; soft: string } {
  const entry = TRIP_DAY_PALETTE[((dayIndex % TRIP_DAY_PALETTE.length) + TRIP_DAY_PALETTE.length) % TRIP_DAY_PALETTE.length];
  const line = dark ? entry.dark : entry.light;
  return { line, soft: rgba(line, dark ? 0.18 : 0.12) };
}
