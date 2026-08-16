import { memo } from "react";
import { motion, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { easeOut } from "@/design/motion";
import { tripDayColor, TRIP_CASING } from "@/lib/map/tripPalette";
import { routePath } from "@/lib/trip/routeGeometry";
import type { Point } from "@/lib/trip/routeGeometry";

/**
 * The itinerary drawn on the atlas.
 *
 * Rendered as a sibling `<svg>` right after `ProvinceLayer` and before every `<Label>`: those all
 * set a positive `zIndex`, so the route lands above the land and below every chip without needing
 * a z-index of its own.
 *
 * Memoised for the same reason `ProvinceLayer` is — `MapEngine` re-renders on every camera settle
 * (viewport culling), and the route has no reason to.
 */

export interface DayLegs {
  day: number;
  /** Stops of this day, projected into map space. */
  points: Point[];
  /** The overnight hop from the previous day's last stop into this day's first. */
  transferFrom?: Point;
}

interface Props {
  legs: DayLegs[];
  /** 0 = whole route. */
  activeDay: number;
  dark: boolean;
  width: number;
  height: number;
  /** 1/k from the camera. See the stroke-width note below. */
  invK: MotionValue<number>;
}

export const TripRouteLayer = memo(function TripRouteLayer({ legs, activeDay, dark, width, height, invK }: Props) {
  // `vectorEffect="non-scaling-stroke"` is NOT enough here, and that is worth stating: it only
  // cancels scaling that happens INSIDE the SVG (viewBox, nested transforms). This layer sits in
  // the camera group, which scales via a CSS transform on the parent div — and CSS transforms
  // scale strokes right past `vectorEffect`. Left alone, a 3.5px line rendered as a fat band the
  // moment the camera zoomed to a city. So the widths are driven off the camera's own 1/k, the
  // same counter-scale every HTML `<Label>` already uses.
  const casingWidth = useTransform(invK, (v) => 7 * v);
  const lineWidth = useTransform(invK, (v) => 3.5 * v);
  const transferWidth = useTransform(invK, (v) => 2 * v);
  const transferDash = useTransform(invK, (v) => `${1 * v} ${7 * v}`);

  if (!legs.length) return null;
  const casing = dark ? TRIP_CASING.dark : TRIP_CASING.light;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none absolute inset-0 overflow-visible"
      aria-hidden
    >
      {legs.map((leg) => {
        const c = tripDayColor(leg.day - 1, dark);
        const on = activeDay === 0 || activeDay === leg.day;
        // Dimmed, never hidden: the shape of the whole trip is most of the point, and a day you
        // cannot see is a day you cannot decide to look at.
        const opacity = on ? 1 : 0.26;

        return (
          <g key={leg.day} opacity={opacity} style={{ transition: "opacity 200ms" }}>
            {/* The overnight transfer, in the arriving day's colour and visibly not a drive you
                do between sights — without it a five-day route reads as five loose fragments. */}
            {leg.transferFrom && leg.points.length > 0 && (
              <motion.path
                d={routePath([leg.transferFrom, leg.points[0]])}
                fill="none"
                stroke={c.line}
                style={{ strokeWidth: transferWidth, strokeDasharray: transferDash }}
                strokeLinecap="round"
              />
            )}
            {leg.points.length > 1 && (
              <>
                {/* Casing first. This is what makes any hue legible over any terrain — the same
                    two-layer trick as COAST_GLOW, and just as cheap. */}
                <motion.path
                  d={routePath(leg.points)}
                  fill="none"
                  stroke={casing}
                  style={{ strokeWidth: casingWidth }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <motion.path
                  key={`draw-${leg.day}-${activeDay}`}
                  d={routePath(leg.points)}
                  fill="none"
                  stroke={c.line}
                  style={{ strokeWidth: lineWidth }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={on ? { pathLength: 0 } : false}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, ease: easeOut }}
                />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
});
