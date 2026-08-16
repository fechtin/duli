import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { thumbSrc } from "@/lib/media/thumbs";
import { Landmark } from "./landmarks";
import type { DestinationType } from "@/lib/types";

// The marker medallion (031): the destination's own photo instead of a generic type icon, so the
// map reads as an atlas of places rather than an icon set.
//
// The icon is not replaced, it is layered under: it paints first, the photo crossfades over it
// once decoded, and it stays visible for seeds with no photo or a failed fetch. So the marker is
// never empty and never shifts size.

/** Marker chip tint by destination type (029) — the icon fallback's color family, and the tinted
 *  disc a photo fades in over: nature = forest green, water = ocean blue, culture = rice gold. */
export const MARKER_TINT: Record<DestinationType, { bg: string; fg: string }> = {
  mountain:  { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  park:      { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  waterfall: { bg: "rgba(58, 169, 189, 0.16)", fg: "#2f95a8" },
  cave:      { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  village:   { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  beach:     { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  island:    { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  lake:      { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  temple:    { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  palace:    { bg: "rgba(200, 83, 64, 0.16)",  fg: "#b8493a" },
  unesco:    { bg: "rgba(210, 96, 79, 0.18)",  fg: "#c85340" },
  museum:    { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  city:      { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  market:    { bg: "rgba(214, 138, 163, 0.18)", fg: "#c46b86" },
  bridge:    { bg: "rgba(139, 116, 214, 0.18)", fg: "#7c6ad0" },
  // Venue types (038). Warm browns for the daytime pair, violet for after dark — they read
  // as "made by people" against the greens and blues the landscape types own.
  cafe:      { bg: "rgba(150, 104, 71, 0.18)",  fg: "#8a5f3f" },
  street:    { bg: "rgba(150, 104, 71, 0.18)",  fg: "#8a5f3f" },
  viewpoint: { bg: "rgba(63, 145, 112, 0.16)",  fg: "#3f9170" },
  nightlife: { bg: "rgba(139, 116, 214, 0.18)", fg: "#7c6ad0" },
  themepark: { bg: "rgba(214, 138, 163, 0.18)", fg: "#c46b86" },
};

const BOX = { 1: "h-7 w-7", 2: "h-6 w-6", 3: "h-5 w-5" } as const;
const ICON = { 1: "h-5 w-5", 2: "h-4 w-4", 3: "h-4 w-4" } as const;

interface Props {
  /** Photo seed — the destination's first gallery image. */
  seed: string;
  type: DestinationType;
  tier: 1 | 2 | 3;
  /** Badges positioned against the medallion's edges (seasonal dot, season emoji). */
  children?: React.ReactNode;
  className?: string;
}

export function PhotoMedallion({ seed, type, tier, children, className }: Props) {
  const src = thumbSrc(seed);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const tint = MARKER_TINT[type];

  return (
    <span
      className={cn("relative grid place-items-center rounded-full", BOX[tier], className)}
      style={{ backgroundColor: tint.bg, color: tint.fg }}
    >
      <Landmark type={type} className={ICON[tier]} />

      {src && !failed && (
        <img
          src={src}
          alt=""
          aria-hidden
          // Markers are already culled to the viewport, so `lazy` costs nothing and keeps a
          // fast pan from queueing decodes for markers that scroll straight back out.
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "absolute inset-0 h-full w-full rounded-full object-cover ring-1 ring-inset ring-black/15 transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {children}
    </span>
  );
}
