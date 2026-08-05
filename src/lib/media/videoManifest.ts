import manifest from "@/data/generated/video-manifest.json";

// Curated real footage, keyed by the same seed as image-manifest.json (Bible 030 §3).
//
// This manifest holds tier 1 ONLY: clips with motion inside the scene — water moving, lanterns
// swaying — which is the only thing a video can do that CSS cannot. Frame movement (Ken Burns)
// is done by transforming the photo itself in IllustratedImage: no bytes, no decoder, and it
// scales the full-resolution webp rather than a re-encode.
//
// Entries are written by scripts/add-video.mjs, which requires provenance. The clips live in
// public/video/curated/ and ARE committed — unlike anything generated, they cannot be rebuilt.

export interface AmbientSources {
  webm: string;
  mp4: string;
}

interface CuratedEntry extends AmbientSources {
  source: { url: string; credit: string; license: string };
}

const clips = (manifest as { tier1?: Record<string, CuratedEntry> }).tier1 ?? {};

/** Real footage for a photo seed, or undefined — in which case the CSS settle carries the motion. */
export function ambientClip(seed: string): AmbientSources | undefined {
  const entry = clips[seed];
  return entry ? { webm: entry.webm, mp4: entry.mp4 } : undefined;
}

/** Attribution for curated footage; shown wherever the photo credit is shown. */
export function clipCredit(seed: string): CuratedEntry["source"] | undefined {
  return clips[seed]?.source;
}
