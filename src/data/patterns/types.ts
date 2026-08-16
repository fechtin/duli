/**
 * Shape of a mined co-occurrence group. Authoring-side only — the engine reads the narrower
 * `PatternRow` (`src/lib/itinerary/types.ts`), which deliberately omits the provenance fields so
 * the engine can never depend on how this data was sourced.
 *
 * Lives beside the data rather than in the aggregator so the three region files can import it
 * without importing each other's siblings. `src/data/itinerary-patterns.ts` re-exports it.
 */
export interface ItineraryPattern {
  id: string;
  /** The hub this pattern belongs to. */
  provinceSlug: string;
  /** Destination ids observed sharing a single day. Must exist in the atlas. */
  destinationIds: string[];
  /** How many INDEPENDENT sources showed this grouping. */
  occurrenceCount: number;
  /** 0–1. Derived from occurrenceCount; kept explicit so a judgement call can override. */
  confidence: number;
  /** Every source that contributed to the count. Attribution is not optional. */
  sources: string[];
  /** ISO date the sources were read. */
  verifiedAt: string;
}
