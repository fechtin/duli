import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform } from "motion/react";
import { Minus, Plus, Locate } from "lucide-react";
import { buildMapModel, type MapModel } from "@/lib/map/projection";
import { useCamera } from "@/lib/map/useCamera";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { getRegions } from "@/lib/api/content";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";
import { Landmark } from "./landmarks";
import { MapHint } from "./MapHint";

type Box = { x0: number; y0: number; x1: number; y1: number };

/** Lighten (amt>0) / darken (amt<0) a hex color. */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const target = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round(r + (target - r) * p);
  g = Math.round(g + (target - g) * p);
  b = Math.round(b + (target - b) * p);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Static terrain layer (silhouette lift shadow + region relief gradients). Memoized so it
 *  never re-renders on camera moves — only on selection/hover changes. */
const ProvinceLayer = memo(function ProvinceLayer({
  model,
  regions,
  active,
  selectedProvince,
  hovered,
  onEnter,
  onLeave,
  onSelect,
}: {
  model: MapModel;
  regions: { id: string; color: string }[];
  active: Set<string>;
  selectedProvince: string | null;
  hovered: string | null;
  onEnter: (slug: string) => void;
  onLeave: () => void;
  onSelect: (slug: string) => void;
}) {
  return (
    <svg
      width={model.width}
      height={model.height}
      viewBox={`0 0 ${model.width} ${model.height}`}
      className="absolute inset-0 overflow-visible"
    >
      <defs>
        {regions.map((r) => (
          <linearGradient key={r.id} id={`relief-${r.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={shade(r.color, 0.22)} />
            <stop offset="55%" stopColor={r.color} />
            <stop offset="100%" stopColor={shade(r.color, -0.26)} />
          </linearGradient>
        ))}
      </defs>

      {/* Raised-island shadow — overlapping fills form one silhouette, offset down (cheap, no blur). */}
      <g transform="translate(3 14)" fill="#0a201c" opacity="0.22" aria-hidden>
        {model.provinces.map((p) => (
          <path key={p.slug} d={p.d} />
        ))}
      </g>

      {/* Land with region relief gradient. */}
      {model.provinces.map((p) => {
        const isSelected = selectedProvince === p.slug;
        const isHovered = hovered === p.slug;
        const isActive = active.has(p.slug);
        return (
          <path
            key={p.slug}
            d={p.d}
            data-slug={p.slug}
            fill={`url(#relief-${p.regionId})`}
            fillOpacity={isSelected ? 1 : isHovered ? 0.92 : isActive ? 0.84 : 0.7}
            stroke={isSelected || isHovered ? "var(--color-surface)" : shade(p.color, -0.3)}
            strokeOpacity={isSelected || isHovered ? 0.95 : 0.4}
            strokeWidth={isSelected ? 1.6 : 0.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            className="cursor-pointer transition-[fill-opacity] duration-150"
            onPointerEnter={() => onEnter(p.slug)}
            onPointerLeave={onLeave}
            onClick={() => onSelect(p.slug)}
          />
        );
      })}
    </svg>
  );
});

/** Calm sea: depth gradient + a faint drifting wave band (GPU transform, low opacity). */
function MapSea() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 18%, color-mix(in srgb, var(--color-map-sea) 70%, white) 0%, var(--color-map-sea) 45%, color-mix(in srgb, var(--color-map-sea) 80%, black) 100%)",
        }}
      />
      <svg className="absolute -inset-x-1/4 inset-y-0 h-full w-[150%] opacity-[0.05]" preserveAspectRatio="none" aria-hidden>
        <defs>
          <pattern id="waves" width="160" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 Q40 6 80 20 T160 20" fill="none" stroke="var(--color-secondary)" strokeWidth="2" />
            <path d="M0 32 Q40 18 80 32 T160 32" fill="none" stroke="var(--color-secondary)" strokeWidth="2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#waves)" style={{ animation: "via-wave-drift 14s linear infinite" }} />
      </svg>
    </div>
  );
}

function Flag({ label }: { label: string }) {
  return (
    <span title={label} className="block">
      <svg width="20" height="22" viewBox="0 0 20 22" aria-label={label}>
        <rect x="3" y="1" width="1.4" height="20" rx="0.7" fill="#5b431f" />
        <path d="M4.4 2h12.5l-2.5 4 2.5 4H4.4z" fill="#da251d" />
        <path d="m9.4 5 .7 2.1h2.2l-1.8 1.3.7 2.1-1.8-1.3-1.8 1.3.7-2.1L6.5 7.1h2.2z" fill="#ff0" />
      </svg>
    </span>
  );
}

const ISLAND_FLAGS = [
  { id: "hoang-sa", name: "Quần đảo Hoàng Sa", lng: 111.8, lat: 16.5 },
  { id: "truong-sa", name: "Quần đảo Trường Sa", lng: 114.3, lat: 9.2 },
];

export function MapEngine() {
  const t = useT();
  const [model, setModel] = useState<MapModel | null>(null);
  const [error, setError] = useState(false);
  const [vp, setVp] = useState<Box | null>(null);

  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const hovered = useMapStore((s) => s.hovered);
  const zoomLevel = useMapStore((s) => s.zoomLevel);
  const focusRequest = useMapStore((s) => s.focusRequest);
  const setHovered = useMapStore((s) => s.setHovered);
  const setZoomLevel = useMapStore((s) => s.setZoomLevel);
  const selectProvince = useMapStore((s) => s.selectProvince);
  const selectDestination = useMapStore((s) => s.selectDestination);
  const requestFocus = useMapStore((s) => s.requestFocus);

  const cam = useCamera(model, { onZoomLevel: setZoomLevel });
  const invK = useTransform(cam.scale, (v) => 1 / v);
  const down = useRef<{ x: number; y: number; moved: boolean } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}geo/vn-provinces.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("geo"))))
      .then((geo) => alive && setModel(buildMapModel(geo)))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!model) return;
    const tgt = focusRequest.target;
    if (tgt.kind === "reset") cam.fitAll();
    else if (tgt.kind === "province") {
      const shape = model.provinces.find((p) => p.slug === tgt.slug);
      if (shape) cam.focusBox(shape.bbox);
    } else if (tgt.kind === "point") {
      const [px, py] = model.project([tgt.lng, tgt.lat]);
      cam.focusPoint(px, py, tgt.zoom);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest.nonce, model]);

  // Viewport culling — recompute the visible map-space box on camera moves (rAF-throttled),
  // so only on-screen markers/labels render (Bible 005 §20).
  useEffect(() => {
    if (!model) return;
    let raf = 0;
    let pending = false;
    const update = () => {
      pending = false;
      const k = cam.scale.get();
      const x = cam.x.get();
      const y = cam.y.get();
      const { w, h } = cam.size.current;
      const pad = 96;
      const next = { x0: (-x - pad) / k, y0: (-y - pad) / k, x1: (w - x + pad) / k, y1: (h - y + pad) / k };
      setVp((prev) =>
        prev && Math.abs(prev.x0 - next.x0) < 6 && Math.abs(prev.y0 - next.y0) < 6 && Math.abs(prev.x1 - next.x1) < 6
          ? prev
          : next,
      );
    };
    const sched = () => {
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(update);
      }
    };
    const unsub = [cam.x.on("change", sched), cam.y.on("change", sched), cam.scale.on("change", sched)];
    update();
    return () => {
      unsub.forEach((u) => u());
      cancelAnimationFrame(raf);
    };
  }, [cam.x, cam.y, cam.scale, cam.size, model]);

  const destinations = useContentStore((s) => s.destinations);
  const regions = getRegions();
  const active = useMemo(() => new Set(destinations.map((d) => d.provinceSlug)), [destinations]);

  const regionLabels = useMemo(() => {
    if (!model) return [];
    return regions.map((r) => {
      const members = model.provinces.filter((p) => p.regionId === r.id);
      const cx = members.reduce((s, p) => s + p.cx, 0) / (members.length || 1);
      const cy = members.reduce((s, p) => s + p.cy, 0) / (members.length || 1);
      return { id: r.id, name: r.name, cx, cy };
    });
  }, [model, regions]);

  const projectedDestinations = useMemo(() => {
    if (!model) return [];
    return destinations.map((d) => {
      const [x, y] = model.project([d.lng, d.lat]);
      return { ...d, x, y };
    });
  }, [model, destinations]);

  const projectedFlags = useMemo(() => {
    if (!model) return [];
    return ISLAND_FLAGS.map((f) => {
      const [x, y] = model.project([f.lng, f.lat]);
      return { ...f, x, y };
    });
  }, [model]);

  const inView = useCallback((x: number, y: number) => !vp || (x >= vp.x0 && x <= vp.x1 && y >= vp.y0 && y <= vp.y1), [vp]);

  // Stable handlers so ProvinceLayer's memo holds across camera-driven re-renders.
  const onEnter = useCallback((slug: string) => setHovered(slug), [setHovered]);
  const onLeave = useCallback(() => setHovered(null), [setHovered]);
  const onSelectProvince = useCallback(
    (slug: string) => {
      if (down.current?.moved) return;
      selectProvince(slug);
    },
    [selectProvince],
  );

  if (error) {
    return (
      <div className="grid h-full place-items-center bg-map-sea p-8 text-center">
        <p className="max-w-xs text-sm text-muted">{t("common.error")}</p>
      </div>
    );
  }
  if (!model) {
    return (
      <div className="grid h-full place-items-center bg-map-sea">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted">{t("map.loading")}</p>
        </div>
      </div>
    );
  }

  const showProvinceLabels = zoomLevel >= 1;
  const showMarkers = zoomLevel >= 2;

  return (
    <div
      ref={cam.containerRef}
      className="relative h-full w-full touch-none overflow-hidden bg-map-sea outline-none [contain:strict]"
      role="application"
      aria-label={t("app.tagline")}
      tabIndex={0}
      {...cam.handlers}
      onKeyDown={(e) => {
        const step = 64;
        switch (e.key) {
          case "ArrowUp": e.preventDefault(); cam.panBy(0, step); break;
          case "ArrowDown": e.preventDefault(); cam.panBy(0, -step); break;
          case "ArrowLeft": e.preventDefault(); cam.panBy(step, 0); break;
          case "ArrowRight": e.preventDefault(); cam.panBy(-step, 0); break;
          case "+": case "=": e.preventDefault(); cam.zoomCenter(1.3); break;
          case "-": case "_": e.preventDefault(); cam.zoomCenter(1 / 1.3); break;
          case "0": e.preventDefault(); useMapStore.getState().reset(); break;
          case "Escape":
            if (selectedDestination) selectDestination(null);
            else if (selectedProvince) useMapStore.getState().reset();
            break;
        }
      }}
      onPointerDown={(e) => {
        down.current = { x: e.clientX, y: e.clientY, moved: false };
        cam.handlers.onPointerDown(e);
      }}
      onPointerMove={(e) => {
        if (down.current && Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > 5)
          down.current.moved = true;
        cam.handlers.onPointerMove(e);
      }}
    >
      <MapSea />

      <motion.div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: model.width, height: model.height, transform: cam.transform }}
      >
        <ProvinceLayer
          model={model}
          regions={regions}
          active={active}
          selectedProvince={selectedProvince}
          hovered={hovered}
          onEnter={onEnter}
          onLeave={onLeave}
          onSelect={onSelectProvince}
        />

        {/* Island flags — territorial markers in the East Sea (always shown). */}
        {projectedFlags.map((f) => (
          <Label key={f.id} x={f.x} y={f.y} invK={invK} z={12}>
            <div className="flex flex-col items-center">
              <Flag label={f.name} />
            </div>
          </Label>
        ))}

        {/* Region labels at the overview. */}
        {!showProvinceLabels &&
          regionLabels.map((r) => (
            <Label key={r.id} x={r.cx} y={r.cy} invK={invK}>
              <span className="rounded-full bg-surface/85 px-2.5 py-1 text-[13px] font-semibold text-foreground shadow-[var(--shadow-e1)] backdrop-blur">
                {r.name}
              </span>
            </Label>
          ))}

        {/* Province labels (mid zoom, culled to viewport). */}
        {showProvinceLabels &&
          model.provinces
            .filter((p) => (active.has(p.slug) || selectedProvince === p.slug) && inView(p.cx, p.cy))
            .map((p) => (
              <Label key={p.slug} x={p.cx} y={p.cy - 14} invK={invK}>
                <span className="whitespace-nowrap rounded-full bg-surface/80 px-2 py-0.5 text-[11px] font-medium text-muted shadow-[var(--shadow-e1)] backdrop-blur">
                  {p.name}
                </span>
              </Label>
            ))}

        {/* Destination markers — illustrated landmarks, culled to viewport. */}
        {showMarkers &&
          projectedDestinations
            .filter((d) => inView(d.x, d.y))
            .map((d) => {
              const isSelected = selectedDestination === d.id;
              return (
                <Label key={d.id} x={d.x} y={d.y} invK={invK} z={isSelected ? 30 : 20}>
                  <button
                    aria-label={d.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (down.current?.moved) return;
                      selectDestination(d.id, d.provinceSlug);
                      requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
                    }}
                    className={cn(
                      "group flex items-center gap-1.5 rounded-full border bg-surface/95 py-1 pl-1 pr-2.5 shadow-[var(--shadow-e2)] backdrop-blur transition-transform duration-150 hover:scale-[1.06]",
                      isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-2">
                      <Landmark type={d.type} className="h-5 w-5" />
                    </span>
                    <span className="max-w-[7.5rem] truncate text-[11px] font-semibold text-foreground">{d.name}</span>
                  </button>
                </Label>
              );
            })}
      </motion.div>

      <MapControls
        onZoomIn={() => cam.setK(cam.scale.get() * 1.5)}
        onZoomOut={() => cam.setK(cam.scale.get() / 1.5)}
        onReset={() => useMapStore.getState().reset()}
      />
      <MapHint />
    </div>
  );
}

/** Overlay element pinned to a map point at constant screen size (shared counter-scale). */
function Label({
  x,
  y,
  invK,
  z = 10,
  children,
}: {
  x: number;
  y: number;
  invK: ReturnType<typeof useTransform<number, number>>;
  z?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, zIndex: z }}>
      <motion.div className="pointer-events-auto -translate-x-1/2 -translate-y-1/2 origin-center" style={{ scale: invK }}>
        {children}
      </motion.div>
    </div>
  );
}

function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const t = useT();
  return (
    <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-2 md:bottom-6 md:right-5">
      <div className="flex flex-col overflow-hidden rounded-full border border-border bg-surface/90 shadow-[var(--shadow-e2)] backdrop-blur">
        <button aria-label={t("map.zoomIn")} onClick={onZoomIn} className="grid h-10 w-10 place-items-center hover:bg-surface-2">
          <Plus size={18} />
        </button>
        <div className="mx-2 h-px bg-border" />
        <button aria-label={t("map.zoomOut")} onClick={onZoomOut} className="grid h-10 w-10 place-items-center hover:bg-surface-2">
          <Minus size={18} />
        </button>
      </div>
      <button
        aria-label={t("map.reset")}
        onClick={onReset}
        className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface/90 shadow-[var(--shadow-e2)] backdrop-blur hover:bg-surface-2"
      >
        <Locate size={18} />
      </button>
    </div>
  );
}
