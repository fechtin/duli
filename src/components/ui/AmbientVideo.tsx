import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { claimSlot, updatePriority, motionAllowed } from "@/lib/media/videoBudget";
import type { AmbientSources } from "@/lib/media/videoManifest";

// The ambient video layer (Bible 030 §4).
//
// Contract: PURE ENHANCEMENT. Renders nothing until every gate below passes, and never
// participates in first paint. If it fails, is blocked, or is starved of a decode slot, the webp
// poster underneath is what the user sees — i.e. exactly the product without this feature. It is
// therefore never an LCP candidate, and the <video> element is not created until the gates open.
//
// Gates, in order:
//   1. the poster image has finished loading   (LCP already settled)
//   2. requestIdleCallback                     (no contention with panel/motion work)
//   3. IntersectionObserver >= 50% visible     (never fetch what nobody is looking at)
//   4. motionAllowed()                         (reduced-motion, save-data, slow link)
//   5. a decode slot is free                   (see videoBudget.ts)

// `?videodebug=1` paints a state badge, so the layer can be confirmed by eye rather than inferred
// — perf metrics cannot tell a playing clip from a frozen one (030 §9.1). Read ONCE at module
// load: useUrlSync rebuilds the path from selection state and drops unknown query params, so by
// render time the flag is already gone from location.search.
const DEBUG = typeof window !== "undefined" && window.location.search.includes("videodebug=1");

/** Must match the `duration-500` class on the video below. */
const FADE_OUT_MS = 500;

interface Props {
  /** Stable identity for the decode-slot registry — the photo seed. */
  id: string;
  sources: AmbientSources;
  /** Gate 1 — the poster below has painted. */
  posterReady: boolean;
  /** Lower wins when decode slots are scarce. */
  priority?: number;
  className?: string;
}

const idle = (cb: () => void): (() => void) => {
  const ric = (window as Window & { requestIdleCallback?: (cb: IdleRequestCallback, o?: IdleRequestOptions) => number })
    .requestIdleCallback;
  if (ric) {
    const h = ric(() => cb(), { timeout: 2000 });
    return () => (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback?.(h);
  }
  const h = window.setTimeout(cb, 400);
  return () => window.clearTimeout(h);
};

export function AmbientVideo({ id, sources, posterReady, priority = 0, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idleReady, setIdleReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [granted, setGranted] = useState(false);
  const [playing, setPlaying] = useState(false);
  // The clip plays once and its final frame IS the poster (030 §6.2), so when it ends we can drop
  // the element: the decode slot goes back to the pool and the decoded frames stop occupying
  // memory for the rest of the session.
  //
  // Geometry matches exactly, but a compressed video frame is softer than the webp behind it, so
  // a hard swap reads as a faint "sharpen" pop. Fading the last frame out over the still hides
  // that entirely — `ending` runs the fade, `settled` unmounts once it has finished.
  const [ending, setEnding] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!ending) return;
    const h = window.setTimeout(() => setSettled(true), FADE_OUT_MS);
    return () => window.clearTimeout(h);
  }, [ending]);

  // Gate 2 — idle
  useEffect(() => {
    if (!posterReady || !motionAllowed()) return;
    return idle(() => setIdleReady(true));
  }, [posterReady]);

  // Gate 3 — intersection
  useEffect(() => {
    const el = hostRef.current;
    if (!el || !idleReady) return;
    const io = new IntersectionObserver((entries) => setVisible(entries[0].isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [idleReady]);

  // Gate 5 — decode slot. Priority is pushed separately (below) so that a camera move
  // re-prioritises the claim instead of dropping and re-taking the slot. A settled clip releases
  // its claim so a neighbouring surface can take the slot.
  useEffect(() => {
    if (!visible || settled) return;
    return claimSlot(id, priority, setGranted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, id, settled]);

  useEffect(() => {
    if (visible) updatePriority(id, priority);
  }, [visible, id, priority]);

  // Play/pause follows the slot. Losing a slot pauses but keeps the buffered data, so regaining
  // it resumes instantly rather than re-fetching.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (granted) void v.play().catch(() => {});
    else {
      v.pause();
      setPlaying(false);
    }
  }, [granted]);

  const mounted = idleReady && visible && !settled;

  return (
    <div ref={hostRef} className={cn("pointer-events-none absolute inset-0", className)} aria-hidden>
      {mounted && (
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          // Fade in on `playing`, NOT `canplay`: canplay fires before a frame is on screen, which
          // shows a black flash (030 §7).
          onPlaying={() => setPlaying(true)}
          // No `loop`. The move settles on the poster framing and then this element goes away.
          onEnded={() => setEnding(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity",
            ending ? "opacity-0 duration-500" : playing ? "opacity-100 duration-700" : "opacity-0 duration-700",
          )}
        >
          <source src={sources.webm} type="video/webm" />
          <source src={sources.mp4} type="video/mp4" />
        </video>
      )}
      {DEBUG && (
        <span className="absolute left-1 top-1 z-50 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {settled ? "■ settled" : ending ? "fading" : playing ? "▶ VIDEO" : granted ? "loading" : mounted ? "no slot" : "gated"}
        </span>
      )}
    </div>
  );
}
