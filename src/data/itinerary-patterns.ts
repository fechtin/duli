/**
 * Itinerary patterns — docs/031.md §Phase 8.
 *
 * WHAT THIS IS: structured co-occurrence signal mined from real, publicly shared itineraries.
 * Which places people actually put on the same day, how often, and where that was observed.
 *
 * WHAT THIS IS NOT, and must never become: a copy of anyone's itinerary. §Phase 8 is explicit —
 * *"Do NOT copy third-party tour itineraries verbatim. Instead extract structured signals."*
 * Facts are not copyrightable but the selection and arrangement of a day plan is, and the sources
 * are commercial travel publishers. So these files store only ids, counts and attribution;
 * no descriptions, no day titles, no ordering prose. The engine uses it as one ranking signal
 * among several, never as a template to replay.
 *
 * WHY IT EXISTS: `Destination.nearby` was supposed to carry this, but it maxes out at degree 2
 * with just two cross-province edges in the whole Vietnamese atlas — a pair hint, not a graph.
 * Real itineraries know things geometry does not: that Ngũ Hành Sơn and Hội An are one day because
 * they are on the same road south, that Thác Bạc and Cát Cát are one day despite sitting on
 * opposite roads out of Sa Pa, that Tràng An and Bái Đính pair up across 15 km of farmland.
 *
 * SCOPE: the 11 provinces deep enough for a pattern to reference places the atlas actually has.
 * After the 038 hub-depth pass the atlas holds 327 places across 63 provinces, but they are not
 * spread evenly — 11 provinces carry 11–23 each and 50 still carry exactly 3, so mining the rest
 * would produce ids that do not exist. Adding a hub is a data-only change.
 *
 * HOW TO EXTEND: read several independent itineraries for the hub, record only pairs/groups that
 * appear on the SAME day, count how many sources showed each, and cite every one. Do not raise a
 * count without adding the source that justifies it. Two publishers running the same day split
 * word for word are one observation, not two. Working notes for the last batch, including the
 * groups deliberately rejected, are in tasks/039-tour-stops.md.
 *
 * LAYOUT: this file is the aggregator only — the data lives in ./patterns/, split by region to stay
 * inside the 500-line limit, the same shape destinations.ts uses over regions/.
 */

import { centralPatterns } from "./patterns/central.ts";
import { northPatterns } from "./patterns/north.ts";
import { southPatterns } from "./patterns/south.ts";

export type { ItineraryPattern } from "./patterns/types.ts";

export const itineraryPatterns = [...centralPatterns, ...northPatterns, ...southPatterns];
