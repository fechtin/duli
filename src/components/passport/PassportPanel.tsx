import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Share2, Compass, MapPin, Loader2, ChevronRight, Heart } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useIsDesktop } from "@/lib/utils/useMediaQuery";
import { useT } from "@/lib/i18n";
import { panelTransition } from "@/design/motion";
import { Button } from "@/components/ui/Button";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { shareOrDownload } from "@/lib/share/exportPng";
import { getMapModel } from "@/lib/map/mapModelCache";
import type { ProvinceShape } from "@/lib/map/projection";
import geoMeta from "@/data/generated/geo-meta.json";

const provinceToRegion: Record<string, string> = Object.fromEntries(
  (geoMeta as { provinces: { slug: string; regionId: string }[] }).provinces.map((p) => [p.slug, p.regionId]),
);

export function PassportPanel() {
  const t = useT();
  const isDesktop = useIsDesktop();
  const open = useUIStore((s) => s.passportOpen);
  const setOpen = useUIStore((s) => s.setPassportOpen);
  const checkins = usePassportStore((s) => s.checkins);
  const user = useAuthStore((s) => s.user);
  const customAvatarUrl = useAuthStore((s) => s.customAvatarUrl);

  const visitedProvinces = useMemo(() => [...new Set(checkins.map((c) => c.provinceSlug))], [checkins]);
  const visitedRegions = useMemo(
    () => [...new Set(checkins.map((c) => provinceToRegion[c.provinceSlug]).filter(Boolean))],
    [checkins],
  );
  const badges = useMemo(() => usePassportStore.getState().badges(), [checkins]);

  const selectDestination = useMapStore((s) => s.selectDestination);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const destinations = useContentStore((s) => s.destinations);
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [mapProvinces, setMapProvinces] = useState<ProvinceShape[]>([]);
  const [mapMeta, setMapMeta] = useState({ width: 1000, height: 2200 });
  const visitedSet = useMemo(() => new Set(visitedProvinces), [visitedProvinces]);

  useEffect(() => {
    getMapModel().then((m) => {
      setMapProvinces(m.provinces);
      setMapMeta({ width: m.width, height: m.height });
    });
  }, []);

  const onShare = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      await shareOrDownload(cardRef.current);
    } finally {
      setExporting(false);
    }
  };

  const openDestination = (destinationId: string, provinceSlug: string) => {
    const d = destinations.find((x) => x.id === destinationId);
    setOpen(false);
    selectDestination(destinationId, provinceSlug);
    if (d) requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
  };

  const motionProps = isDesktop
    ? { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } }
    : { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } };

  const progressPct = Math.min(1, visitedProvinces.length / 63);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            {...motionProps}
            transition={panelTransition}
            className="absolute z-50 flex flex-col border-border bg-surface shadow-[var(--shadow-e3)] inset-x-0 bottom-0 max-h-[92%] rounded-t-[var(--radius-sheet)] border-t md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:border-l"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="font-display text-base font-semibold text-foreground">{t("passport.title")}</p>
              <button onClick={() => setOpen(false)} aria-label={t("panel.close")} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div ref={cardRef} className="no-scrollbar flex-1 overflow-y-auto">

              {/* ── Cover header ── */}
              <div className="relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0a2030 0%, #0f3d38 55%, #0b2828 100%)" }}>

                {/* Top bar: greeting + share */}
                <div className="flex items-start justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      {(customAvatarUrl || user?.photoURL) ? (
                        <img src={customAvatarUrl || user?.photoURL} alt={user?.displayName}
                          className="w-11 h-11 rounded-full object-cover border border-[#d4a84b]/40" />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-white/10 border border-[#d4a84b]/40 flex items-center justify-center text-[#d4a84b] font-bold">
                          {user?.displayName?.[0]?.toUpperCase() ?? "V"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white leading-tight">
                        Xin chào, <span className="text-[#d4a84b]">{user?.displayName?.split(" ").pop() ?? "bạn"}</span>!
                      </p>
                      <p className="text-[10px] text-white/40 mt-0.5 italic leading-snug max-w-[200px]">
                        "Mỗi hành trình là một câu chuyện mà chỉ bạn mới có thể kể."
                      </p>
                    </div>
                  </div>
                  <button data-html2canvas-ignore="true" onClick={onShare} disabled={checkins.length === 0 || exporting}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ borderColor: "rgba(212,168,75,0.5)", color: "#d4a84b", background: "rgba(212,168,75,0.08)" }}>
                    {exporting ? <Loader2 size={11} className="animate-spin" /> : <Share2 size={11} />}
                    Chia sẻ hành trình
                  </button>
                </div>

                {/* Big Vietnam map */}
                {mapProvinces.length > 0 && (() => {
                  const MAP_W = 388, MAP_H = 300;
                  const scale = Math.min(MAP_W / mapMeta.width, MAP_H / mapMeta.height);
                  const offsetX = (MAP_W - mapMeta.width * scale) / 2;
                  const offsetY = (MAP_H - mapMeta.height * scale) / 2;
                  return (
                    <div className="relative mx-4 mb-4 rounded-xl overflow-hidden" style={{ height: MAP_H }}>
                      <svg width="100%" height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0">
                        {/* Sea bg */}
                        <rect width={MAP_W} height={MAP_H} fill="rgba(5,25,40,0.6)" />
                        <g transform={`translate(${offsetX},${offsetY}) scale(${scale})`}>
                          {mapProvinces.map((p) => (
                            <path key={p.slug} d={p.d}
                              fill={visitedSet.has(p.slug) ? "rgba(180,130,40,0.75)" : "rgba(20,70,55,0.6)"}
                              stroke={visitedSet.has(p.slug) ? "rgba(240,208,112,0.6)" : "rgba(200,146,42,0.1)"}
                              strokeWidth={visitedSet.has(p.slug) ? 2.5 : 1.5}
                            />
                          ))}
                        </g>
                        {/* Glow on visited provinces */}
                        {visitedSet.size > 0 && (
                          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                        )}
                      </svg>
                    </div>
                  );
                })()}

                {/* Stats */}
                <div className="px-5 pb-5">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 mb-0.5">Bạn đã khám phá</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-bold text-white leading-none">{visitedProvinces.length}</span>
                    <span className="text-lg text-white/40 mb-0.5">/ 63</span>
                    <span className="text-[10px] uppercase tracking-wider text-white/40 mb-1 ml-1">tỉnh thành</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(progressPct * 100, checkins.length > 0 ? 2 : 0)}%`, background: "linear-gradient(90deg,#c8922a,#f0d070)" }} />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: checkins.length, l: "Check-in" },
                      { v: visitedRegions.length, l: "Vùng miền" },
                      { v: badges.length, l: "Huy hiệu" },
                      { v: visitedProvinces.length, l: "Tỉnh thành" },
                    ].map(({ v, l }) => (
                      <div key={l} className="rounded-lg px-2 py-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="text-xl font-bold text-white leading-none">{v}</div>
                        <div className="text-[9px] text-white/40 mt-1">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {checkins.length === 0 ? (
                <EmptyState t={t} setOpen={setOpen} />
              ) : (
                <div className="pb-6 space-y-3 mt-3" style={{ padding: "0 12px 24px" }}>
                  {/* ── Visited places ── */}
                  <section className="rounded-2xl overflow-hidden" style={{ background: "#0b1c28", border: "1px solid rgba(200,146,42,0.12)" }}>
                    <div className="flex items-center justify-between px-5 pt-5 pb-4">
                      <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#c8922a" }}>
                        {t("passport.visitedPlaces")}
                      </h3>
                      <button className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: "#c8922a" }}>
                        Xem tất cả <ChevronRight size={13} />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-2.5 px-4 pb-5">
                      {checkins.slice(0, 4).map((c) => {
                        const d = new Date(c.createdAt);
                        const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                        return (
                          <button key={c.id} onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                            className="relative overflow-hidden text-left transition-all hover:scale-[1.02]"
                            style={{ height: 210, borderRadius: 14 }}>
                            {c.photoUrl ? (
                              <img src={c.photoUrl} alt={c.destinationName} className="absolute inset-0 h-full w-full object-cover" />
                            ) : (
                              <div className="absolute inset-0"><IllustratedImage seed={c.photoSeed} ratio="1/1" className="w-full h-full" /></div>
                            )}
                            {/* Rich gradient overlay */}
                            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(5,15,25,0.95) 100%)" }} />
                            {/* Heart */}
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(10,20,35,0.55)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                              <Heart size={11} className="text-white/70" />
                            </div>
                            {/* Text */}
                            <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
                              <div className="flex items-center gap-1 mb-0.5">
                                <MapPin size={9} style={{ color: "#d4a84b" }} className="shrink-0" />
                                <span className="text-[11px] font-bold leading-tight" style={{ color: "#fff" }}>{c.destinationName}</span>
                              </div>
                              <div className="flex items-start gap-1 mb-1.5">
                                <MapPin size={8} className="shrink-0 mt-px" style={{ color: "rgba(255,255,255,0.35)" }} />
                                <p className="text-[9px] leading-snug line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>{c.caption}</p>
                              </div>
                              <p className="text-[9px]" style={{ color: "rgba(212,168,75,0.7)" }}>{dateLabel}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* ── Badges ── */}
                  {badges.length > 0 && (
                    <section className="rounded-2xl overflow-hidden" style={{ background: "#0b1c28", border: "1px solid rgba(200,146,42,0.12)" }}>
                      <div className="px-5 pt-5 pb-4">
                        <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#c8922a" }}>
                          {t("passport.yourBadges")}
                        </h3>
                      </div>
                      <div className="grid px-4 pb-5" style={{ gridTemplateColumns: `repeat(${Math.min(badges.length, 6)}, 1fr)`, gap: 10 }}>
                        {badges.map((b) => (
                          <div key={b.id} className="flex flex-col items-center gap-2">
                            <BadgeMedal emoji={b.emoji} />
                            <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                              {b.label}
                            </span>
                            {b.description && (
                              <span className="text-[9px] text-center -mt-1" style={{ color: "rgba(200,146,42,0.7)" }}>
                                {b.description}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ── Timeline ── */}
                  <section className="rounded-2xl overflow-hidden" style={{ background: "#0b1c28", border: "1px solid rgba(200,146,42,0.12)" }}>
                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                      <h3 className="text-[11px] font-bold tracking-[0.25em] uppercase" style={{ color: "#c8922a" }}>
                        {t("passport.timeline")}
                      </h3>
                      <button className="flex items-center gap-0.5 text-[11px] font-medium" style={{ color: "#c8922a" }}>
                        Xem tất cả <ChevronRight size={13} />
                      </button>
                    </div>
                    <div className="overflow-x-auto no-scrollbar px-4 pb-5">
                      {(() => {
                        const items = [...checkins].reverse().slice(0, 5);
                        const ITEM_W = 88;
                        const total = items.length + 1; // +1 for "Tiếp tục"
                        return (
                          <div className="relative" style={{ minWidth: total * ITEM_W + (total - 1) * 8 }}>
                            {/* Continuous gold line */}
                            <div className="absolute" style={{
                              top: 28, left: ITEM_W / 2,
                              right: ITEM_W / 2,
                              height: 2,
                              background: "linear-gradient(90deg, #c8922a, #f0d070, #c8922a)",
                              boxShadow: "0 0 6px rgba(200,146,42,0.5)",
                            }} />
                            <div className="flex" style={{ gap: 8 }}>
                              {items.map((c) => {
                                const d = new Date(c.createdAt);
                                const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                                return (
                                  <button
                                    key={c.id}
                                    onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                                    className="flex flex-col items-center hover:opacity-80 transition-opacity shrink-0"
                                    style={{ width: ITEM_W }}
                                  >
                                    <span className="text-[9px] mb-2 font-medium" style={{ color: "rgba(200,146,42,0.8)" }}>{dateLabel}</span>
                                    {/* Dot */}
                                    <div className="w-3.5 h-3.5 rounded-full z-10 mb-2.5 shrink-0" style={{
                                      background: "radial-gradient(circle, #f0d070 0%, #c8922a 100%)",
                                      boxShadow: "0 0 8px rgba(200,146,42,0.7)",
                                    }} />
                                    <span className="text-[11px] font-bold text-center leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>
                                      {c.destinationName}
                                    </span>
                                    <span className="text-[9px] text-center mt-1 leading-snug line-clamp-2 px-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                                      {c.caption}
                                    </span>
                                  </button>
                                );
                              })}
                              {/* "Tiếp tục" placeholder */}
                              <div className="flex flex-col items-center shrink-0" style={{ width: ITEM_W }}>
                                <span className="text-[9px] mb-2" style={{ color: "transparent" }}>—</span>
                                {/* Diamond dot */}
                                <div className="z-10 mb-2.5 shrink-0" style={{
                                  width: 14, height: 14,
                                  background: "radial-gradient(circle, #f0d070 0%, #c8922a 100%)",
                                  boxShadow: "0 0 8px rgba(200,146,42,0.7)",
                                  transform: "rotate(45deg)",
                                  borderRadius: 2,
                                }} />
                                <span className="text-[11px] font-bold text-center leading-tight" style={{ color: "rgba(255,255,255,0.92)" }}>Tiếp tục...</span>
                                <span className="text-[9px] text-center mt-1 leading-snug px-0.5" style={{ color: "rgba(255,255,255,0.38)" }}>Còn nhiều nơi đang chờ bạn</span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


function BadgeMedal({ emoji }: { emoji: string }) {
  const S = 60;
  const c = S / 2;
  // Octagon points
  const oct = (r: number) => Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4 - Math.PI / 8;
    return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bg-${emoji.codePointAt(0)}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor="#1a3d3a" />
          <stop offset="100%" stopColor="#0a1e20" />
        </radialGradient>
      </defs>
      {/* Outer octagon — gold border */}
      <polygon points={oct(c - 1)} fill={`url(#bg-${emoji.codePointAt(0)})`} stroke="#c49a2a" strokeWidth="2" />
      {/* Inner octagon ring */}
      <polygon points={oct(c - 5)} fill="none" stroke="rgba(212,168,75,0.3)" strokeWidth="0.75" />
      {/* Corner diamonds */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4 - Math.PI / 8;
        const r = c - 2.5;
        return <circle key={i} cx={c + r * Math.cos(a)} cy={c + r * Math.sin(a)} r={1.2} fill="#c49a2a" opacity="0.8" />;
      })}
      {/* Subtle inner glow ring */}
      <circle cx={c} cy={c} r={c - 10} fill="none" stroke="rgba(212,168,75,0.15)" strokeWidth="1" />
      {/* Emoji */}
      <text x={c} y={c + 8} textAnchor="middle" fontSize="23"
        fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
        {emoji}
      </text>
    </svg>
  );
}


function EmptyState({ t, setOpen }: { t: (k: string) => string; setOpen: (v: boolean) => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center px-8 py-12">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-primary">
        <Compass size={30} />
      </div>
      <p className="max-w-[16rem] text-sm text-muted">{t("passport.empty")}</p>
      <Button onClick={() => { setOpen(false); useMapStore.getState().reset(); }}>
        {t("passport.startExploring")}
      </Button>
    </div>
  );
}

