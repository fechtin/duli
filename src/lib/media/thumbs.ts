import manifest from "@/data/generated/image-manifest.json";

// 96px square crops built by scripts/build-thumbs.mjs. A thumb exists iff a photo does, so the
// path is derived by convention rather than carried in a second manifest (031).

const images = manifest as Record<string, unknown>;

/** The marker-sized crop for a photo seed, or undefined when the seed has no photo at all. */
export function thumbSrc(seed: string): string | undefined {
  return images[seed] ? `/img/thumb/${seed}.webp` : undefined;
}
