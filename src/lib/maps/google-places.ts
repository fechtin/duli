import manifest from "@/data/generated/google-places.json";

/**
 * Atlas entry id → Google place id, resolved at build time by scripts/resolve-google-places.mjs.
 * Absent for entries whose name did not match a Google place near their coordinate; those fall
 * back to a coordinate pin, which is never wrong, only less informative.
 */
const places: Record<string, { id: string; name: string }> = manifest;

export function googlePlaceId(entryId?: string): string | undefined {
  return entryId ? places[entryId]?.id : undefined;
}
