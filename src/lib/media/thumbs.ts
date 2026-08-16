import manifest from "@/data/generated/image-manifest.json";

// 96px square crops built by scripts/build-thumbs.mjs. A thumb exists iff a photo does, so the
// path is derived by convention rather than carried in a second manifest (031).

const images = manifest as Record<string, { license?: string }>;

/**
 * A no-derivatives licence lets us show the photo unchanged but not distribute a crop, so those
 * seeds get no medallion — build-thumbs.mjs skips them for the same reason. Kept in step with
 * `forbidsDerivatives` in scripts/lib/image-sources.mjs; the .ts/.mjs split is why it is written
 * twice rather than imported.
 */
const forbidsDerivatives = (license?: string) => /(^|[\s-])nd([\s-]|$)|noderiv/i.test(license ?? "");

/** The marker-sized crop for a photo seed, or undefined when there is no crop to show. */
export function thumbSrc(seed: string): string | undefined {
  const entry = images[seed];
  if (!entry || forbidsDerivatives(entry.license)) return undefined;
  return `/img/thumb/${seed}.webp`;
}
