import manifest from "@/data/generated/naver-places.json";

/**
 * Atlas entry id → Naver place id, resolved at build time by scripts/resolve-naver-places.mjs.
 * Only Korean entries appear here, and only those whose Korean name matched a Naver place
 * exactly; everything else is absent on purpose and falls back to a name search.
 */
const places: Record<string, { id: string; name: string }> = manifest;

export function naverPlaceId(entryId?: string): string | undefined {
  return entryId ? places[entryId]?.id : undefined;
}
