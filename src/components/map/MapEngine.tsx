import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useTransform } from "motion/react";
import { Minus, Plus, Locate, UtensilsCrossed } from "lucide-react";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { type MapModel } from "@/lib/map/projection";
import { getMapModel } from "@/lib/map/mapModelCache";
import { useCamera } from "@/lib/map/useCamera";
import { COAST_GLOW, regionColor } from "@/lib/map/regionPalette";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { getRegions } from "@/lib/api/content";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/cn";
import { Landmark } from "./landmarks";
import { MapHint } from "./MapHint";
import { useLivingStore } from "@/lib/store/useLivingStore";
import type { HeartbeatResult } from "@/lib/living/types";
import type { DestinationType } from "@/lib/types";

type Box = { x0: number; y0: number; x1: number; y1: number };

/** Marker chip tint by destination type (029) — a legible color family for the icon medallion:
 *  nature = forest green, water = ocean blue, culture = rice gold. */
const MARKER_TINT: Record<DestinationType, { bg: string; fg: string }> = {
  mountain:  { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  park:      { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  waterfall: { bg: "rgba(58, 169, 189, 0.16)", fg: "#2f95a8" },
  cave:      { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  village:   { bg: "rgba(63, 145, 112, 0.16)", fg: "#3f9170" },
  beach:     { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  island:    { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  lake:      { bg: "rgba(58, 169, 189, 0.18)", fg: "#2f95a8" },
  temple:    { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  palace:    { bg: "rgba(200, 83, 64, 0.16)",  fg: "#b8493a" },
  unesco:    { bg: "rgba(210, 96, 79, 0.18)",  fg: "#c85340" },
  museum:    { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  city:      { bg: "rgba(185, 132, 42, 0.18)", fg: "#b9842a" },
  market:    { bg: "rgba(214, 138, 163, 0.18)", fg: "#c46b86" },
  bridge:    { bg: "rgba(139, 116, 214, 0.18)", fg: "#7c6ad0" },
};

/** Dominant heartbeat signal → ambient glow color (festival > trending > seasonal > ai-pick >
 *  perfect-weather). Drives both the always-on glow halo and the marker pulse/dot (023). */
function heartbeatGlow(hb?: HeartbeatResult): string | null {
  if (!hb) return null;
  const s = hb.signals;
  if (s.includes("festival"))        return "#b9842a"; // accent / gold
  if (s.includes("trending"))        return "#d2604f"; // danger / red
  if (s.includes("seasonal"))        return "#16715a"; // primary / green
  if (s.includes("ai-pick"))         return "#8b5cf6"; // violet halo
  if (s.includes("perfect-weather")) return "#246c88"; // secondary / blue
  return null;
}

/** Hex → rgba() at the given alpha. */
function rgba(hex: string, a: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** Stable per-destination phase offset so live signals breathe out of sync (organic, not a
 *  metronome). Negative delay starts each animation mid-cycle. */
function signalPhase(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return `${-(Math.abs(h) % 3600)}ms`;
}

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
  dark,
  onEnter,
  onLeave,
  onSelect,
}: {
  model: MapModel;
  regions: { id: string; color: string }[];
  active: Set<string>;
  selectedProvince: string | null;
  hovered: string | null;
  dark: boolean;
  onEnter: (slug: string) => void;
  onLeave: () => void;
  onSelect: (slug: string) => void;
}) {
  const glow = dark ? COAST_GLOW.dark : COAST_GLOW.light;
  return (
    <svg
      width={model.width}
      height={model.height}
      viewBox={`0 0 ${model.width} ${model.height}`}
      className="absolute inset-0 overflow-visible"
    >
      <defs>
        {regions.map((r) => {
          const base = regionColor(r.id, dark, r.color);
          return (
            <linearGradient key={r.id} id={`relief-${r.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={shade(base, dark ? 0.14 : 0.2)} />
              <stop offset="55%" stopColor={base} />
              <stop offset="100%" stopColor={shade(base, dark ? -0.3 : -0.24)} />
            </linearGradient>
          );
        })}
      </defs>

      {/* Coastline glow — two layered strokes; fill+stroke inside a group with GROUP opacity
          so overlapping province paths composite into one uniform silhouette halo (no seams,
          no SVG blur — 025 §Ràng buộc). Land is repainted opaquely on top. */}
      <g fill={glow.color} stroke={glow.color} strokeWidth={11} strokeLinejoin="round" opacity={glow.wide} aria-hidden>
        {model.provinces.map((p) => (
          <path key={p.slug} d={p.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g fill={glow.color} stroke={glow.color} strokeWidth={3.5} strokeLinejoin="round" opacity={glow.near} aria-hidden>
        {model.provinces.map((p) => (
          <path key={p.slug} d={p.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>

      {/* Raised-island shadow (daylight only — Night Atlas gets its depth from the glow). */}
      {!dark && (
        <g transform="translate(3 14)" fill="#0a201c" opacity="0.18" aria-hidden>
          {model.provinces.map((p) => (
            <path key={p.slug} d={p.d} />
          ))}
        </g>
      )}

      {/* Opaque land base — keeps the translucent relief fills from mixing with the glow. */}
      <g fill="var(--map-land-base)" aria-hidden>
        {model.provinces.map((p) => (
          <path key={p.slug} d={p.d} />
        ))}
      </g>

      {/* Land with region relief gradient. */}
      {model.provinces.map((p) => {
        const isSelected = selectedProvince === p.slug;
        const isHovered = hovered === p.slug;
        const isActive = active.has(p.slug);
        const base = regionColor(p.regionId, dark, p.color);
        return (
          <path
            key={p.slug}
            d={p.d}
            data-slug={p.slug}
            fill={`url(#relief-${p.regionId})`}
            fillOpacity={isSelected ? 1 : isHovered ? 0.97 : isActive ? 0.92 : 0.82}
            stroke={isSelected || isHovered ? (dark ? glow.color : "var(--color-surface)") : shade(base, dark ? 0.4 : -0.3)}
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
            "radial-gradient(120% 90% at 50% 18%, var(--map-sea-hi) 0%, var(--color-map-sea) 45%, var(--map-sea-lo) 100%)",
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

/** Vietnam-only sovereignty markers (map data, not editorial content). */
const ISLAND_FLAGS = [
  { id: "hoang-sa", name: "Quần đảo Hoàng Sa", lng: 111.8, lat: 16.5 }, // i18n-ignore — geographic proper noun (map data)
  { id: "truong-sa", name: "Quần đảo Trường Sa", lng: 114.3, lat: 9.2 }, // i18n-ignore — geographic proper noun (map data)
];

export function MapEngine() {
  const t = useT();
  const country = useCountryStore((s) => s.country);
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

  const dark = useUIStore((s) => s.theme) === "dark";
  const glow = dark ? COAST_GLOW.dark : COAST_GLOW.light;

  // Cinematic intro (025 §1.4) — coastline draws itself, then the land fades in.
  const reducedMotion = useReducedMotion();
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (!model || !intro) return;
    if (reducedMotion) {
      setIntro(false);
      return;
    }
    const tid = setTimeout(() => setIntro(false), 2400);
    return () => clearTimeout(tid);
  }, [model, intro, reducedMotion]);
  const showIntro = intro && !reducedMotion;

  // Geometry follows the active atlas; switching country swaps the whole model (and replays
  // the cinematic intro, since `model` goes null first).
  useEffect(() => {
    let alive = true;
    setModel(null);
    setError(false);
    setIntro(true);
    getMapModel(country)
      .then((m) => alive && setModel(m))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [country]);

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
  const regions = getRegions(country);

  // Food layer (026 §Food Explorer Map) — an open dish projects its restaurants.
  const openDishData = useFoodStore((s) => s.dish);
  const projectedRestaurants = useMemo(() => {
    if (!model || !openDishData) return [];
    return openDishData.restaurants.map((r) => {
      const [x, y] = model.project([r.lng, r.lat]);
      return { ...r, x, y };
    });
  }, [model, openDishData]);

  // Init heartbeat scores once destinations are loaded
  const initLiving = useLivingStore((s) => s.init);
  const getHeartbeat = useLivingStore((s) => s.getHeartbeat);
  useEffect(() => {
    if (destinations.length > 0) {
      initLiving(destinations.map((d) => d.id));
    }
  }, [destinations, initLiving]);
  const active = useMemo(() => new Set(destinations.map((d) => d.provinceSlug)), [destinations]);

  const regionLabels = useMemo(() => {
    if (!model) return [];
    return regions.map((r) => {
      const members = model.provinces.filter((p) => p.regionId === r.id);
      const cx = members.reduce((s, p) => s + p.cx, 0) / (members.length || 1);
      const cy = members.reduce((s, p) => s + p.cy, 0) / (members.length || 1);
      return { id: r.id, name: t(`region.${r.id}`), cx, cy };
    });
  }, [model, regions, t]);

  const projectedDestinations = useMemo(() => {
    if (!model) return [];
    return destinations.map((d) => {
      const [x, y] = model.project([d.lng, d.lat]);
      const tier = d.featured ? 1 : d.badges.some((b) => b === "popular" || b === "trending") ? 2 : 3;
      return { ...d, x, y, tier };
    });
  }, [model, destinations]);

  const projectedFlags = useMemo(() => {
    if (!model || country !== "vn") return [];
    return ISLAND_FLAGS.map((f) => {
      const [x, y] = model.project([f.lng, f.lat]);
      return { ...f, x, y };
    });
  }, [model, country]);

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
  // Max tier shown: tier 1 (featured) → tier 2 (popular/trending) → tier 3 (rest).
  const maxMarkerTier = zoomLevel >= 4 ? 3 : zoomLevel >= 3 ? 2 : 1;

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
        <motion.div
          className="absolute inset-0"
          initial={showIntro ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
        <ProvinceLayer
          model={model}
          regions={regions}
          active={active}
          selectedProvince={selectedProvince}
          hovered={hovered}
          dark={dark}
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
              <span className="map-label-halo whitespace-nowrap font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-foreground/80">
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
                <span className="map-label-halo whitespace-nowrap text-[11px] font-medium tracking-[0.04em] text-foreground/75">
                  {t(`province.${p.slug}`)}
                </span>
              </Label>
            ))}

        {/* Ambient heartbeat glow — a soft breathing halo at every destination with a live
            signal, shown at ALL zoom levels. At overview zoom (markers hidden) this is the only
            cue → "ánh sáng nhẹ, không icon, không popup" (023 §Heartbeat Redesign). */}
        {projectedDestinations
          .filter((d) => inView(d.x, d.y))
          .map((d) => {
            const hb = getHeartbeat(d.id);
            const glowHex = heartbeatGlow(hb);
            if (!glowHex) return null;
            const size = 34 + Math.round(((hb?.score ?? 0) / 100) * 38); // 34..72px screen
            const phase = signalPhase(d.id);
            return (
              <Label key={`glow-${d.id}`} x={d.x} y={d.y} invK={invK} z={5}>
                <span aria-hidden className="pointer-events-none relative block" style={{ width: size, height: size }}>
                  {/* Breathing halo — soft, wide falloff */}
                  <span
                    className="ambient-glow absolute inset-0"
                    style={{
                      background: `radial-gradient(circle, ${rgba(glowHex, 0.5)} 0%, ${rgba(glowHex, 0.18)} 45%, transparent 70%)`,
                      animationDelay: phase,
                    }}
                  />
                  {/* Radar ring — expands past the halo and fades */}
                  <span
                    className="signal-ping absolute inset-0"
                    style={{ border: `1.5px solid ${rgba(glowHex, 0.85)}`, animationDelay: phase }}
                  />
                  {/* Luminous core — crisp center with a white keyline so it reads on light seas */}
                  <span
                    className="signal-core absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-white/80"
                    style={{ background: glowHex, boxShadow: `0 0 8px 2px ${rgba(glowHex, 0.65)}`, animationDelay: phase }}
                  />
                </span>
              </Label>
            );
          })}

        {/* Destination markers — illustrated landmarks, culled to viewport and tier. */}
        {showMarkers &&
          projectedDestinations
            .filter((d) => d.tier <= maxMarkerTier && inView(d.x, d.y))
            .map((d) => {
              const isSelected = selectedDestination === d.id;
              const hb = getHeartbeat(d.id);
              const isTrending = hb?.signals.includes("trending");
              const isFestival = hb?.signals.includes("festival");
              const isSeasonal = hb?.signals.includes("seasonal");
              const isPerfect  = hb?.signals.includes("perfect-weather");
              const glowColor = heartbeatGlow(hb);
              const showPulse = (isTrending || isFestival) && !isSelected;
              const showDot   = (isSeasonal || isPerfect)  && !isSelected && !showPulse;
              return (
                <Label key={d.id} x={d.x} y={d.y} invK={invK} z={isSelected ? 30 : 20}>
                  <div className="relative">
                    {/* Pulse ring for trending/festival destinations */}
                    {showPulse && (
                      <span
                        aria-hidden
                        className="heartbeat-ring pointer-events-none absolute inset-0 rounded-full"
                        style={{ background: glowColor ? rgba(glowColor, 0.4) : "rgba(22,113,90,0.4)" }}
                      />
                    )}
                    <button
                      aria-label={d.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (down.current?.moved) return;
                        selectDestination(d.id, d.provinceSlug);
                        requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
                      }}
                      className={cn(
                        "group flex items-center rounded-full border bg-surface/95 shadow-[var(--shadow-e2)] backdrop-blur transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.06]",
                        d.tier === 1 ? "gap-1.5 py-1 pl-1 pr-2.5" : d.tier === 2 ? "gap-1.5 py-0.5 pl-0.5 pr-2" : "gap-1 py-0.5 pl-0.5 pr-1.5",
                        isSelected ? "border-primary ring-2 ring-primary/30" : "border-border",
                      )}
                    >
                      <span
                        className={cn(
                          "relative grid place-items-center rounded-full",
                          d.tier === 1 ? "h-7 w-7" : d.tier === 2 ? "h-6 w-6" : "h-5 w-5",
                        )}
                        style={{ backgroundColor: MARKER_TINT[d.type].bg, color: MARKER_TINT[d.type].fg }}
                      >
                        <Landmark type={d.type} className={d.tier === 1 ? "h-5 w-5" : "h-4 w-4"} />
                        {/* Seasonal glow dot */}
                        {showDot && (
                          <span
                            aria-hidden
                            className="seasonal-dot absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface"
                            style={{ background: glowColor ?? "var(--color-primary)" }}
                          />
                        )}
                        {/* Season emoji badge */}
                        {hb?.seasonalIcon && !showPulse && (
                          <span className="absolute -bottom-1 -right-1 text-[9px] leading-none select-none">
                            {hb.seasonalIcon}
                          </span>
                        )}
                      </span>
                      <span
                        className={cn(
                          "truncate text-foreground",
                          d.tier === 1
                            ? "max-w-[7.5rem] text-[11px] font-semibold"
                            : d.tier === 2
                              ? "max-w-[6.5rem] text-[10.5px] font-medium"
                              : "max-w-[5.5rem] text-[10px] font-medium",
                        )}
                      >
                        {d.name}
                      </span>
                    </button>
                  </div>
                </Label>
              );
            })}

        {/* Restaurant markers — visible while a dish is open (026 §Food Explorer Map). */}
        {projectedRestaurants
          .filter((r) => inView(r.x, r.y))
          .map((r) => (
            <Label key={`rest-${r.id}`} x={r.x} y={r.y} invK={invK} z={26}>
              <button
                aria-label={r.name}
                onClick={(e) => {
                  e.stopPropagation();
                  if (down.current?.moved) return;
                  requestFocus({ kind: "point", lng: r.lng, lat: r.lat, zoom: 9 });
                }}
                className="group flex items-center gap-1.5 rounded-full border border-accent/50 bg-surface/95 py-1 pl-1 pr-2.5 shadow-[var(--shadow-e2)] backdrop-blur transition-transform duration-150 hover:-translate-y-0.5 hover:scale-[1.06]"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent/15 text-accent">
                  <UtensilsCrossed size={13} />
                </span>
                <span className="max-w-[8rem] truncate text-[11px] font-semibold text-foreground">{r.name}</span>
              </button>
            </Label>
          ))}
        </motion.div>

        {/* Intro overlay — the coastline draws itself in glow color, then fades out. */}
        {showIntro && (
          <svg
            width={model.width}
            height={model.height}
            viewBox={`0 0 ${model.width} ${model.height}`}
            className="pointer-events-none absolute inset-0 overflow-visible"
            aria-hidden
          >
            <g fill="none" stroke={glow.color} strokeWidth={1.6} strokeLinejoin="round">
              {model.provinces.map((p) => (
                <motion.path
                  key={p.slug}
                  d={p.d}
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0.9 }}
                  animate={{ pathLength: 1, opacity: 0 }}
                  transition={{
                    pathLength: { duration: 1.3, ease: "easeInOut" },
                    opacity: { delay: 1.5, duration: 0.7 },
                  }}
                />
              ))}
            </g>
          </svg>
        )}
      </motion.div>

      {/* Atmospheric vignette — draws the eye to the country (screen-space, above the map). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(120% 100% at 50% 45%, transparent 58%, var(--map-vignette) 100%)" }}
      />

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
    <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2.5 md:bottom-6 md:right-5">
      <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[color:var(--glass-text)] shadow-[var(--glass-shadow)] backdrop-blur-xl">
        <button aria-label={t("map.zoomIn")} onClick={onZoomIn} className="grid h-11 w-11 place-items-center transition-colors hover:bg-[var(--glass-hover)] active:text-[color:var(--glass-gold)]">
          <Plus size={19} />
        </button>
        <div className="mx-2.5 h-px bg-[var(--glass-border)]" />
        <button aria-label={t("map.zoomOut")} onClick={onZoomOut} className="grid h-11 w-11 place-items-center transition-colors hover:bg-[var(--glass-hover)] active:text-[color:var(--glass-gold)]">
          <Minus size={19} />
        </button>
      </div>
      <button
        aria-label={t("map.reset")}
        onClick={onReset}
        className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-[color:var(--glass-text)] shadow-[var(--glass-shadow)] backdrop-blur-xl transition-colors hover:bg-[var(--glass-hover)] hover:text-[color:var(--glass-gold)]"
      >
        <Locate size={19} />
      </button>
    </div>
  );
}
