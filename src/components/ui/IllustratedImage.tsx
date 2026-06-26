import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

// Deterministic illustrated placeholder. A unified, calm visual language stands in for
// photography (Bible 002 §9/§10) until real images are served from R2.

const palettes: [string, string, string][] = [
  ["#1f5e50", "#2f8f74", "#cfe6d8"], // forest
  ["#1d4e63", "#3a86a6", "#cfe4ee"], // ocean
  ["#6b4f1d", "#b9842a", "#f0e2c2"], // rice gold
  ["#3a5a40", "#7aa06a", "#dce8cf"], // highland
  ["#4a3a63", "#8a6db0", "#e7ddf0"], // dusk
  ["#7a3b3b", "#c2685a", "#f1d9cf"], // lantern
  ["#2a4d4f", "#4f9aa0", "#d6ecec"], // teal bay
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
}

export function IllustratedImage({ seed, ratio = "16/9", caption, className, rounded = true }: Props) {
  const { dark, mid, light, sunX, hillSeed } = useMemo(() => {
    const h = hashString(seed);
    const [dk, md, lt] = palettes[h % palettes.length];
    return { dark: dk, mid: md, light: lt, sunX: 20 + (h % 60), hillSeed: h };
  }, [seed]);

  // Two layered hill silhouettes whose crest varies with the seed.
  const hill = (offset: number, amp: number, baseY: number) => {
    const a = ((hillSeed >> offset) % amp) + 6;
    return `M0,${baseY} C20,${baseY - a} 40,${baseY + a / 2} 60,${baseY - a / 2} S90,${baseY + a} 100,${baseY - a / 3} L100,100 L0,100 Z`;
  };

  return (
    <figure
      className={cn("relative overflow-hidden", rounded && "rounded-[var(--radius-md)]", className)}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
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
      {caption && (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-2.5 text-xs font-medium text-white/95">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
