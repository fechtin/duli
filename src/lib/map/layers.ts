/**
 * Map layers — which kinds of place the traveller wants to see.
 *
 * The atlas now carries 20 `DestinationType` values, which is far too many to put in front of
 * anyone as a filter, so they are grouped. The grouping is **derived from the itinerary engine's
 * `TYPE_PROFILE`, not authored again here**: that table already answers "what is a temple about"
 * (heritage + spiritual), it is covered by tests, and a second table of the same 20 rows is a
 * second table to drift. Same reasoning as `src/data/i18n/province-names.ts`.
 *
 * `config.ts` is a leaf module — its only imports are type-only — so pulling it into the client
 * bundle costs nothing.
 */

import type { DestinationType } from "../types.ts";
import { TYPE_PROFILE } from "../itinerary/config.ts";
import type { TripInterest } from "../itinerary/types.ts";

/** A layer is an interest. Order is display order, roughly outdoors → indoors → appetite. */
export const MAP_LAYERS: TripInterest[] = [
  "nature",
  "beach",
  "mountain",
  "heritage",
  "spiritual",
  "city",
  "food",
];

/** Which layers a place belongs to. A type can sit in several — a market is both city and food. */
export function layersOf(type: DestinationType): TripInterest[] {
  return TYPE_PROFILE[type]?.interests ?? [];
}

/**
 * Should this place draw, given the layers the traveller switched off?
 *
 * A place survives if ANY of its layers is still on, so hiding "food" removes cafés but keeps a
 * market that is also a city landmark. A type with no layers at all always shows — silently
 * hiding a place because nobody classified it would be the worst outcome of this feature.
 */
export function isLayerVisible(type: DestinationType, hidden: readonly string[]): boolean {
  if (!hidden.length) return true;
  const own = layersOf(type);
  if (!own.length) return true;
  return own.some((layer) => !hidden.includes(layer));
}
