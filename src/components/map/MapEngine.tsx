import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform } from "motion/react";
import { Minus, Plus, Locate } from "lucide-react";
import { buildMapModel, type MapModel } from "@/lib/map/projection";
import { useCamera } from "@/lib/map/useCamera";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { getRegions } from "@/lib/api/content";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";
import { markerIcon } from "./markerIcons";
import { MapHint } from "./MapHint";

export function MapEngine() {
  const t = useT();
  const [model, setModel] = useState<MapModel | null>(null);
  const [error, setError] = useState(false);

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

  // Tap-vs-drag discrimination.
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

  // React to imperative focus commands.
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

  const destinations = useContentStore((s) => s.destinations);
  const regions = getRegions();
  const active = useMemo(() => new Set(destinations.map((d) => d.provinceSlug)), [destinations]);

  // Region label anchors = mean of member province centroids.
  const regionLabels = useMemo(() => {
    if (!model) return [];
    return regions.map((r) => {
      const members = model.provinces.filter((p) => p.regionId === r.id);
      const cx = members.reduce((s, p) => s + p.cx, 0) / (members.length || 1);
      const cy = members.reduce((s, p) => s + p.cy, 0) / (members.length || 1);
      return { id: r.id, name: r.name, color: r.color, cx, cy };
    });
  }, [model, regions]);

  const projectedDestinations = useMemo(() => {
    if (!model) return [];
    return destinations.map((d) => {
      const [x, y] = model.project([d.lng, d.lat]);
      return { ...d, x, y };
    });
  }, [model, destinations]);

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
      <motion.div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: model.width, height: model.height, transform: cam.transform }}
      >
        <svg
          width={model.width}
          height={model.height}
          viewBox={`0 0 ${model.width} ${model.height}`}
          className="absolute inset-0 overflow-visible"
        >
          {model.provinces.map((p) => {
            const isSelected = selectedProvince === p.slug;
            const isHovered = hovered === p.slug;
            const isActive = active.has(p.slug);
            return (
              <path
                key={p.slug}
                d={p.d}
                data-slug={p.slug}
                fill={p.color}
                fillOpacity={isSelected ? 0.95 : isHovered ? 0.78 : isActive ? 0.6 : 0.42}
                stroke={isSelected || isHovered ? "var(--color-surface)" : p.color}
                strokeOpacity={isSelected || isHovered ? 0.9 : 0.35}
                strokeWidth={isSelected ? 1.6 : 0.7}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                className="cursor-pointer transition-[fill-opacity] duration-150"
                onPointerEnter={() => setHovered(p.slug)}
                onPointerLeave={() => setHovered(null)}
                onClick={() => {
                  if (down.current?.moved) return;
                  selectProvince(p.slug);
                }}
              />
            );
          })}
        </svg>

        {/* Region labels — constant screen size via shared counter-scale. */}
        {!showProvinceLabels &&
          regionLabels.map((r) => (
            <Label key={r.id} x={r.cx} y={r.cy} invK={invK}>
              <span className="rounded-full bg-surface/85 px-2.5 py-1 text-[13px] font-semibold text-foreground shadow-[var(--shadow-e1)] backdrop-blur">
                {r.name}
              </span>
            </Label>
          ))}

        {/* Province labels at mid zoom. */}
        {showProvinceLabels &&
          model.provinces
            .filter((p) => active.has(p.slug) || selectedProvince === p.slug)
            .map((p) => (
              <Label key={p.slug} x={p.cx} y={p.cy - 14} invK={invK}>
                <span className="whitespace-nowrap rounded-full bg-surface/80 px-2 py-0.5 text-[11px] font-medium text-muted shadow-[var(--shadow-e1)] backdrop-blur">
                  {p.name}
                </span>
              </Label>
            ))}

        {/* Destination markers. */}
        {showMarkers &&
          projectedDestinations.map((d) => {
            const Icon = markerIcon(d.type);
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
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <Icon size={13} strokeWidth={2.4} />
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

/** Absolutely-positioned overlay element pinned to a map point at constant screen size. */
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
      <motion.div
        className="pointer-events-auto -translate-x-1/2 -translate-y-1/2 origin-center"
        style={{ scale: invK }}
      >
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
