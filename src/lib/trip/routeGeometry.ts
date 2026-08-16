/**
 * Turning projected stops into an SVG path.
 *
 * A quadratic-bow chain, NOT Catmull-Rom, and that is a correctness decision rather than a
 * dependency one (`d3-shape` is not installed, but adding it would not help). Catmull-Rom
 * overshoots outside the convex hull of its control points; on Vietnam's coast — which is most of
 * this map — that overshoot lands in the sea and reads as though the traveller took a boat. A
 * bow-limited quadratic physically cannot leave the corridor between two stops.
 *
 * The bow sign is constant across a route so the arcs read as one consistent hand rather than
 * noise, and the offset is clamped so a 600 km transfer does not bulge halfway to Hainan.
 */

export type Point = [number, number];

const BOW_RATIO = 0.14;
const BOW_MIN = 6;
const BOW_MAX = 60;

/** Build a path `d` through projected map-space points. Fewer than two points yields "". */
export function routePath(points: Point[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy);
    if (len < 0.5) {
      d += ` L ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      continue;
    }
    const bow = Math.min(BOW_MAX, Math.max(BOW_MIN, len * BOW_RATIO));
    // Perpendicular, always the same side, so the whole route curves consistently.
    const nx = -dy / len;
    const ny = dx / len;
    const cx = (x0 + x1) / 2 + nx * bow;
    const cy = (y0 + y1) / 2 + ny * bow;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}
