import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";
import { photoMeta } from "./IllustratedImage";
import { duration, easeOut } from "@/design/motion";

// Full-screen photo viewer (044). Sits at z-[70], above every other surface: panel z-30,
// search z-50, check-in and settings z-[60]. Written down because the stack has bitten before —
// a layer placed above another makes every click on the lower one look dead.
//
// Zoom stops at 1:1 with the file's real pixels. Letting someone magnify a 1280px photo to 4x
// only produces a blurry photo and the impression that the image is bad, so the ceiling is
// computed from `naturalWidth` rather than picked as a constant.

/** Never magnify past this even when the file is enormous — beyond it, panning is unusable. */
const HARD_MAX = 5;

interface Transform {
  scale: number;
  x: number;
  y: number;
}
const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

export function Lightbox() {
  const t = useT();
  const lightbox = useUIStore((s) => s.lightbox);
  const close = useUIStore((s) => s.closeLightbox);
  const setIndex = useUIStore((s) => s.setLightboxIndex);

  const [tf, setTf] = useState<Transform>(IDENTITY);
  const [maxScale, setMaxScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  /** Live pointers, so one finger pans and two pinch without a separate gesture library. */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);

  const current = lightbox?.images[lightbox.index];
  const meta = photoMeta(current?.seed);
  const count = lightbox?.images.length ?? 0;

  const go = useCallback(
    (delta: number) => {
      if (!lightbox || count < 2) return;
      setTf(IDENTITY);
      setIndex((lightbox.index + delta + count) % count);
    },
    [lightbox, count, setIndex],
  );

  // Reset the transform whenever the photo changes, so image B never inherits image A's pan.
  useEffect(() => setTf(IDENTITY), [current?.seed]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    // The page behind must not scroll while a full-screen viewer is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, go]);

  /** The real ceiling: the point where one image pixel covers one screen pixel. */
  const onLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const fitted = img.getBoundingClientRect().width;
    const ratio = fitted > 0 ? img.naturalWidth / fitted : 1;
    setMaxScale(Math.min(HARD_MAX, Math.max(1, ratio)));
  };

  const clamp = (next: Transform): Transform => {
    const scale = Math.min(maxScale, Math.max(1, next.scale));
    if (scale === 1) return { scale: 1, x: 0, y: 0 };
    const frame = frameRef.current?.getBoundingClientRect();
    const img = imgRef.current?.getBoundingClientRect();
    if (!frame || !img) return { ...next, scale };
    // Keep the photo covering the frame: pan only as far as the overhang allows.
    const maxX = Math.max(0, ((img.width / tf.scale) * scale - frame.width) / 2);
    const maxY = Math.max(0, ((img.height / tf.scale) * scale - frame.height) / 2);
    return {
      scale,
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  };

  const onWheel = (e: React.WheelEvent) => {
    if (maxScale <= 1) return;
    e.preventDefault();
    setTf((p) => clamp({ ...p, scale: p.scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15) }));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: tf.scale };
      panStart.current = null;
    } else if (pointers.current.size === 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      setTf((p) => clamp({ ...p, scale: pinchStart.current!.scale * (dist / pinchStart.current!.dist) }));
    } else if (pointers.current.size === 1 && panStart.current && tf.scale > 1) {
      const s = panStart.current;
      setTf(clamp({ scale: tf.scale, x: s.tx + (e.clientX - s.x), y: s.ty + (e.clientY - s.y) }));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const start = panStart.current;
    // A horizontal flick at 1× means "next photo"; while zoomed the same drag means "pan".
    if (start && tf.scale === 1 && pointers.current.size === 1) {
      const dx = e.clientX - start.x;
      if (Math.abs(dx) > 60 && Math.abs(e.clientY - start.y) < 80) go(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
  };

  const src = current && meta ? (meta.lg ? `/img/lg/${current.seed}.webp` : meta.src) : "";

  return (
    <AnimatePresence>
      {lightbox && current && meta && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || t("lightbox.title")}
          className="fixed left-0 top-0 z-[70] flex h-[var(--app-h)] w-full flex-col bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          <div className="flex shrink-0 items-center justify-between p-3 text-white/80">
            <span className="pl-2 text-xs tabular-nums">
              {count > 1 ? `${lightbox.index + 1} / ${count}` : ""}
            </span>
            <button
              aria-label={t("lightbox.close")}
              onClick={close}
              className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div
            ref={frameRef}
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={() => setTf((p) => (p.scale > 1 ? IDENTITY : clamp({ ...p, scale: maxScale })))}
            style={{ touchAction: "none", cursor: maxScale > 1 ? (tf.scale > 1 ? "grab" : "zoom-in") : "default" }}
          >
            <img
              ref={imgRef}
              key={current.seed}
              src={src}
              alt={current.alt}
              onLoad={onLoad}
              draggable={false}
              className="max-h-full max-w-full select-none object-contain"
              style={{
                transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
                transition: pointers.current.size ? "none" : "transform 160ms ease-out",
              }}
            />

            {count > 1 && (
              <>
                <NavButton side="left" label={t("lightbox.prev")} onClick={() => go(-1)} />
                <NavButton side="right" label={t("lightbox.next")} onClick={() => go(1)} />
              </>
            )}
          </div>

          <div className="shrink-0 px-5 pb-safe pt-3 text-center" onClick={(e) => e.stopPropagation()}>
            {current.caption && <p className="text-sm text-white/95">{current.caption}</p>}
            <p className="mt-1 text-xs text-white/55">
              {meta.credit && <>© {meta.credit} · </>}
              {meta.sourceUrl ? (
                <a href={meta.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {meta.license}
                </a>
              ) : (
                meta.license
              )}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white/85 transition-colors hover:bg-black/60 ${
        side === "left" ? "left-3" : "right-3"
      }`}
    >
      {side === "left" ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  );
}
