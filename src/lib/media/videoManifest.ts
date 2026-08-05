import manifest from "@/data/generated/video-manifest.json";

// Ambient clips, keyed by the same seed as image-manifest.json (Bible 030 §8).
//
// Tier 2 is a bare seed list because the paths are conventional — spelling out
// {webm, mp4, bytes, …} per seed cost ~13 KB of bundle at full scale, which would have blown the
// 3 KB JS budget on the manifest alone. Tier 1 is hand-curated real footage and carries its own
// paths plus provenance, exactly like the photo manifest does.

export interface AmbientSources {
  webm: string;
  mp4: string;
}

interface Tier1Entry extends AmbientSources {
  source: { url: string; credit: string; license: string };
}

const data = manifest as { tier1: Record<string, Tier1Entry>; tier2: string[] };

const tier2 = new Set(data.tier2 ?? []);

/** The ambient clip for a photo seed, or undefined when the seed is tier 3 (still photo only). */
export function ambientClip(seed: string): AmbientSources | undefined {
  const curated = data.tier1?.[seed];
  if (curated) return { webm: curated.webm, mp4: curated.mp4 };
  if (tier2.has(seed)) return { webm: `/video/${seed}.webm`, mp4: `/video/${seed}.mp4` };
  return undefined;
}

/** Provenance for tier-1 footage; tier-2 clips derive from an already-credited photo. */
export function clipCredit(seed: string): Tier1Entry["source"] | undefined {
  return data.tier1?.[seed]?.source;
}
