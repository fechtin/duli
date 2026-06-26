import { useCallback, useEffect, useMemo, useRef } from "react";
import { animate, useMotionValue, useMotionTemplate, type AnimationPlaybackControls } from "motion/react";
import { springCamera } from "@/design/motion";
import type { MapModel } from "./projection";

interface Options {
  onZoomLevel?: (level: number) => void;
}

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Screen-space camera over a fixed map of `model.width × model.height` px. */
export function useCamera(model: MapModel | null, { onZoomLevel }: Options = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const k = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const size = useRef({ w: 1, h: 1 });
  const baseK = useRef(1);
  const anim = useRef<AnimationPlaybackControls[]>([]);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchPrev = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  const stopAnim = useCallback(() => {
    anim.current.forEach((a) => a.stop());
    anim.current = [];
  }, []);

  const limits = useCallback(() => ({ min: baseK.current * 0.85, max: baseK.current * 18 }), []);

  const reportLevel = useCallback(() => {
    if (!onZoomLevel) return;
    const ratio = k.get() / baseK.current;
    // Levels 0..4 (Bible 005 §4) from zoom ratio thresholds.
    const level = ratio < 1.4 ? 0 : ratio < 3 ? 1 : ratio < 6 ? 2 : ratio < 11 ? 3 : 4;
    onZoomLevel(level);
  }, [k, onZoomLevel]);

  const setK = useCallback(
    (next: number) => {
      const { min, max } = limits();
      k.set(clamp(next, min, max));
      reportLevel();
    },
    [k, limits, reportLevel],
  );

  const fitBox = useCallback(
    (box: Box, pad: number, animated: boolean) => {
      const { w, h } = size.current;
      const bw = Math.max(1, box.x1 - box.x0);
      const bh = Math.max(1, box.y1 - box.y0);
      const { min, max } = limits();
      const nk = clamp(Math.min(w / bw, h / bh) * pad, min, max);
      const cx = (box.x0 + box.x1) / 2;
      const cy = (box.y0 + box.y1) / 2;
      const nx = w / 2 - nk * cx;
      const ny = h / 2 - nk * cy;
      stopAnim();
      if (animated) {
        anim.current = [
          animate(k, nk, { ...springCamera, onUpdate: reportLevel }),
          animate(x, nx, springCamera),
          animate(y, ny, springCamera),
        ];
      } else {
        k.set(nk);
        x.set(nx);
        y.set(ny);
        reportLevel();
      }
    },
    [k, x, y, limits, stopAnim, reportLevel],
  );

  const fitAll = useCallback(
    (animated = true) => {
      if (!model) return;
      fitBox({ x0: 0, y0: 0, x1: model.width, y1: model.height }, 0.95, animated);
    },
    [model, fitBox],
  );

  const focusBox = useCallback(
    (bbox: [number, number, number, number], animated = true) => {
      fitBox({ x0: bbox[0], y0: bbox[1], x1: bbox[2], y1: bbox[3] }, 0.62, animated);
    },
    [fitBox],
  );

  /** Center on a map-space point at `ratio × overview` zoom (Bible 005 §13 fly-to). */
  const focusPoint = useCallback(
    (px: number, py: number, ratio: number, animated = true) => {
      const { w, h } = size.current;
      const { min, max } = limits();
      const nk = clamp(baseK.current * ratio, min, max);
      const nx = w / 2 - nk * px;
      const ny = h / 2 - nk * py;
      stopAnim();
      if (animated) {
        anim.current = [
          animate(k, nk, { ...springCamera, onUpdate: reportLevel }),
          animate(x, nx, springCamera),
          animate(y, ny, springCamera),
        ];
      } else {
        k.set(nk);
        x.set(nx);
        y.set(ny);
        reportLevel();
      }
    },
    [k, x, y, limits, stopAnim, reportLevel],
  );

  // Recompute base scale (overview fit) when the container resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !model) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const first = size.current.w === 1;
      size.current = { w: r.width, h: r.height };
      baseK.current = Math.min(r.width / model.width, r.height / model.height) * 0.95;
      if (first) fitAll(false);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [model, fitAll]);

  const local = (e: { clientX: number; clientY: number }) => {
    const r = containerRef.current!.getBoundingClientRect();
    return { px: e.clientX - r.left, py: e.clientY - r.top };
  };

  const zoomAt = useCallback(
    (px: number, py: number, factor: number) => {
      const { min, max } = limits();
      const nk = clamp(k.get() * factor, min, max);
      const wx = (px - x.get()) / k.get();
      const wy = (py - y.get()) / k.get();
      x.set(px - wx * nk);
      y.set(py - wy * nk);
      k.set(nk);
      reportLevel();
    },
    [k, x, y, limits, reportLevel],
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      stopAnim();
      const { px, py } = local(e);
      zoomAt(px, py, Math.exp(-e.deltaY * 0.0016));
    },
    [stopAnim, zoomAt],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stopAnim();
    },
    [stopAnim],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const pts = pointers.current;
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId)!;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pts.size === 1) {
        x.set(x.get() + (e.clientX - prev.x));
        y.set(y.get() + (e.clientY - prev.y));
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const r = containerRef.current!.getBoundingClientRect();
        const cx = (a.x + b.x) / 2 - r.left;
        const cy = (a.y + b.y) / 2 - r.top;
        if (pinchPrev.current) {
          zoomAt(cx, cy, dist / pinchPrev.current.dist);
          x.set(x.get() + (cx - pinchPrev.current.cx));
          y.set(y.get() + (cy - pinchPrev.current.cy));
        }
        pinchPrev.current = { dist, cx, cy };
      }
    },
    [x, y, zoomAt],
  );

  const endPointer = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchPrev.current = null;
  }, []);

  const onDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      stopAnim();
      const { px, py } = local(e);
      zoomAt(px, py, 1.9);
    },
    [stopAnim, zoomAt],
  );

  // Keyboard controls (Bible 005 §18).
  const panBy = useCallback(
    (dx: number, dy: number) => {
      stopAnim();
      x.set(x.get() + dx);
      y.set(y.get() + dy);
    },
    [x, y, stopAnim],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      stopAnim();
      zoomAt(size.current.w / 2, size.current.h / 2, factor);
    },
    [stopAnim, zoomAt],
  );

  const transform = useMotionTemplate`translate(${x}px, ${y}px) scale(${k})`;

  const handlers = useMemo(
    () => ({
      onWheel,
      onPointerDown,
      onPointerMove,
      onPointerUp: endPointer,
      onPointerCancel: endPointer,
      onDoubleClick,
    }),
    [onWheel, onPointerDown, onPointerMove, endPointer, onDoubleClick],
  );

  return { containerRef, transform, handlers, fitAll, focusBox, focusPoint, panBy, zoomCenter, scale: k, setK };
}
