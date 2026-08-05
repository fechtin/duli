import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import manifest from "@/data/generated/image-manifest.json";
import { AmbientVideo } from "./AmbientVideo";
import { ambientClip } from "@/lib/media/videoManifest";

// Real photos (Wikimedia Commons, fetched by scripts/fetch-images.mjs) when available, with
// a deterministic illustrated gradient as the blur-up placeholder + fallback (Bible 002 §10,
// 006 §11). Attribution shown per Commons license (Bible 009 §6).
//
// Opt in with `ambient` to layer a looping clip over the photo where one exists (Bible 030).
// It is opt-in rather than automatic because decode slots are scarce: thumbnails and gallery
// tiles must not compete with the hero for them.

const images = manifest as Record<string, { src: string; credit: string; license: string }>;

const palettes: [string, string, string][] = [
  ["#1f5e50", "#2f8f74", "#cfe6d8"],
  ["#1d4e63", "#3a86a6", "#cfe4ee"],
  ["#6b4f1d", "#b9842a", "#f0e2c2"],
  ["#3a5a40", "#7aa06a", "#dce8cf"],
  ["#4a3a63", "#8a6db0", "#e7ddf0"],
  ["#7a3b3b", "#c2685a", "#f1d9cf"],
  ["#2a4d4f", "#4f9aa0", "#d6ecec"],
];

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

interface Props {
  seed: string;
  ratio?: "16/9" | "4/3" | "1/1";
  caption?: string;
  className?: string;
  rounded?: boolean;
  /**
   * Give the photo motion (Bible 030). A CSS Ken Burns settle by default; if the seed has
   * curated real footage, that plays instead — see `ambientClip`.
   */
  ambient?: boolean;
  /** Tier-1 footage only: lower wins when decode slots are scarce. */
  ambientPriority?: number;
}

export function IllustratedImage({
  seed,
  ratio = "16/9",
  caption,
  className,
  rounded = true,
  ambient = false,
  ambientPriority,
}: Props) {
  const photo = images[seed];
  const clip = ambient ? ambientClip(seed) : undefined;
  const [loaded, setLoaded] = useState(false);

  const { dark, mid, light, sunX, hillSeed } = useMemo(() => {
    const h = hashString(seed);
    const [dk, md, lt] = palettes[h % palettes.length];
    return { dark: dk, mid: md, light: lt, sunX: 20 + (h % 60), hillSeed: h };
  }, [seed]);

  const hill = (offset: number, amp: number, baseY: number) => {
    const a = ((hillSeed >> offset) % amp) + 6;
    return `M0,${baseY} C20,${baseY - a} 40,${baseY + a / 2} 60,${baseY - a / 2} S90,${baseY + a} 100,${baseY - a / 3} L100,100 L0,100 Z`;
  };

  return (
    <figure
      className={cn("relative overflow-hidden bg-surface-2", rounded && "rounded-[var(--radius-md)]", className)}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {/* Illustrated placeholder / fallback */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`sky-${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={light} />
            <stop offset="60%" stopColor={mid} />
            <stop offset="100%" stopColor={dark} />
          </linearGradient>
          <radialGradient id={`sun-${seed}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#sky-${seed})`} />
        <circle cx={sunX} cy="34" r="22" fill={`url(#sun-${seed})`} />
        <path d={hill(3, 18, 74)} fill={mid} opacity="0.55" />
        <path d={hill(7, 24, 82)} fill={dark} opacity="0.85" />
      </svg>

      {/* Real photo, faded in over the placeholder */}
      {photo && (
        <img
          src={photo.src}
          alt={caption ?? ""}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            // Ken Burns on the photo itself (030 §3). Only starts once the photo has painted, so
            // the move is never half-run behind a blank frame.
            ambient && loaded && !clip && "ken-burns-settle",
          )}
        />
      )}

      {/* Tier-1 real footage only — motion that exists INSIDE the scene and cannot be faked by
          moving the frame. Requires the photo to have painted, so a seed with no photo never gets
          video: the illustrated fallback stays honest (030 §3). */}
      {clip && photo && <AmbientVideo id={seed} sources={clip} posterReady={loaded} priority={ambientPriority} />}

      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-2.5 text-xs font-medium text-white/95">
          {caption}
          {photo?.credit && <span className="ml-1 font-normal text-white/65">· © {photo.credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}
