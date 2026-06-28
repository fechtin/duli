import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Share2, Compass, MapPin, Star, Loader2, ChevronRight, Heart } from "lucide-react";
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

              {/* Passport Cover Card */}
              <div className="relative overflow-hidden mx-0"
                style={{ background: "linear-gradient(160deg, #0d2a35 0%, #16504a 55%, #0e3030 100%)" }}>
                <div className="absolute inset-[10px] rounded-none border border-white/10 pointer-events-none" />
                <div className="absolute bottom-4 right-6 opacity-10">
                  <CompassRoseSvg size={80} />
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07]">
                  <VietnamOutlineSvg size={70} />
                </div>

                <div className="relative flex items-center gap-6 px-6 py-6">
                  {/* Left: emblem + title */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative">
                      {user ? (
                        <div className="w-16 h-16 rounded-full overflow-hidden border border-[#d4a84b]/40">
                          {(customAvatarUrl || user.photoURL) ? (
                            <img src={customAvatarUrl || user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-[#d4a84b] text-xl font-bold">
                              {user.displayName[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-[#d4a84b]/40 flex items-center justify-center">
                          <VietnamOutlineSvg size={38} color="#d4a84b" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d4a84b]/20 border border-[#d4a84b]/50 flex items-center justify-center">
                        <Star size={9} fill="#d4a84b" color="#d4a84b" />
                      </div>
                    </div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-medium">
                      {user?.displayName ? user.displayName.split(" ").slice(-1)[0].toUpperCase() : "VIETNAM ATLAS"}
                    </p>
                  </div>

                  {/* Right: title + stats */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-[#d4a84b]/80 font-medium mb-0.5">
                      {t("passport.subtitle")}
                    </p>
                    <h2 className="font-display text-xl font-bold text-white leading-tight">
                      VIETNAM<br />PASSPORT
                    </h2>

                    <div className="mt-3">
                      <div className="flex items-end justify-between mb-1">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider">{t("passport.explored")}</span>
                        <span className="text-sm font-bold text-white">
                          {visitedProvinces.length}<span className="text-white/40 font-normal text-xs">/63</span>
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(progressPct * 100, checkins.length > 0 ? 3 : 0)}%`,
                            background: "linear-gradient(90deg, #d4a84b, #e8c878)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-4 gap-1 text-center">
                      <MiniStat value={String(visitedProvinces.length)} label={t("passport.provincesLabel")} />
                      <MiniStat value={String(visitedRegions.length)} label={t("passport.regions")} />
                      <MiniStat value={String(checkins.length)} label={t("passport.checkins")} />
                      <MiniStat value={String(badges.length)} label={t("passport.badges")} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Share button */}
              <div className="px-5 pt-3 pb-1">
                <Button className="w-full" variant="secondary" onClick={onShare} disabled={checkins.length === 0 || exporting}>
                  {exporting ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
                  {exporting ? "Đang xuất ảnh..." : t("passport.share")}
                </Button>
              </div>

              {checkins.length === 0 ? (
                <EmptyState t={t} setOpen={setOpen} />
              ) : (
                <div className="px-4 pb-6 space-y-3 mt-3">
                  {/* Visited places */}
                  <section className="rounded-xl overflow-hidden" style={{ background: "#0d1e2b" }}>
                    <div className="flex items-center justify-between px-4 pt-4 pb-3">
                      <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#c8922a" }}>
                        {t("passport.visitedPlaces")}
                      </h3>
                      <button className="flex items-center gap-0.5 text-[10px]" style={{ color: "#c8922a" }}>
                        Xem tất cả <ChevronRight size={12} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-3 pb-4">
                      {checkins.map((c) => {
                        const d = new Date(c.createdAt);
                        const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                        return (
                          <button
                            key={c.id}
                            onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                            className="group relative overflow-hidden rounded-lg text-left transition-all hover:opacity-90"
                            style={{ background: "#0a1520" }}
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
                              {c.photoUrl ? (
                                <img src={c.photoUrl} alt={c.destinationName} className="h-full w-full object-cover" />
                              ) : (
                                <IllustratedImage seed={c.photoSeed} ratio="4/3" className="w-full" />
                              )}
                              <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center">
                                <Heart size={11} className="text-white/70" />
                              </div>
                            </div>
                            <div className="px-2.5 py-2">
                              <div className="flex items-center gap-1 mb-0.5">
                                <MapPin size={9} style={{ color: "#c8922a" }} className="shrink-0" />
                                <span className="text-[11px] font-semibold truncate" style={{ color: "#c8922a" }}>
                                  {c.destinationName}
                                </span>
                              </div>
                              <p className="text-[9px] leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                                {c.caption}
                              </p>
                              <p className="mt-1 text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{dateLabel}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Badges */}
                  {badges.length > 0 && (
                    <section className="rounded-xl overflow-hidden" style={{ background: "#0d1e2b" }}>
                      <div className="flex items-center justify-between px-4 pt-4 pb-3">
                        <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#c8922a" }}>
                          {t("passport.yourBadges")}
                        </h3>
                        <span className="text-[10px]" style={{ color: "#c8922a" }}>{badges.length}</span>
                      </div>
                      <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4">
                        {badges.map((b) => (
                          <div key={b.id} className="flex flex-col items-center gap-1.5 shrink-0 w-[70px]">
                            <BadgeMedal emoji={b.emoji} />
                            <span className="text-[10px] font-semibold text-center leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
                              {b.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Timeline */}
                  <section className="rounded-xl overflow-hidden" style={{ background: "#0d1e2b" }}>
                    <div className="flex items-center justify-between px-4 pt-4 pb-3">
                      <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase" style={{ color: "#c8922a" }}>
                        {t("passport.timeline")}
                      </h3>
                      <button className="flex items-center gap-0.5 text-[10px]" style={{ color: "#c8922a" }}>
                        Xem tất cả <ChevronRight size={12} />
                      </button>
                    </div>
                    <div className="overflow-x-auto no-scrollbar px-4 pb-4">
                      <div className="flex items-start min-w-max">
                        {[...checkins].reverse().map((c, i, arr) => {
                          const d = new Date(c.createdAt);
                          const dateLabel = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
                          return (
                            <div key={c.id} className="flex items-center">
                              <button
                                onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                                className="flex flex-col items-center hover:opacity-80 transition-opacity w-[88px]"
                              >
                                <span className="text-[9px] mb-1.5 font-medium" style={{ color: "#c8922a" }}>{dateLabel}</span>
                                <div className="w-3 h-3 rounded-full border-2 mb-2 shrink-0" style={{ background: "#c8922a", borderColor: "rgba(200,146,42,0.4)" }} />
                                <span className="text-[11px] font-bold text-center leading-tight" style={{ color: "rgba(255,255,255,0.9)" }}>
                                  {c.destinationName}
                                </span>
                                <span className="text-[9px] text-center mt-0.5 leading-tight line-clamp-2 px-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                                  {c.caption}
                                </span>
                              </button>
                              {i < arr.length - 1 && (
                                <div className="h-px w-5 shrink-0 mb-6" style={{ background: "rgba(200,146,42,0.35)", borderTop: "1px dashed rgba(200,146,42,0.35)" }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
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

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-base font-bold text-white leading-none">{value}</span>
      <span className="mt-0.5 text-[8px] text-white/45 leading-tight">{label}</span>
    </div>
  );
}

function BadgeMedal({ emoji }: { emoji: string }) {
  const S = 56;
  const c = S / 2;
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
      <circle cx={c} cy={c} r={c - 1} fill="#0d2a2e" stroke="#c49a2a" strokeWidth="2" />
      <circle cx={c} cy={c} r={c - 6} fill="none" stroke="rgba(212,168,75,0.35)" strokeWidth="1" />
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r2 = c - 4;
        return (
          <circle key={deg} cx={c + Math.cos(rad) * r2} cy={c + Math.sin(rad) * r2} r={1.5} fill="#c49a2a" opacity="0.7" />
        );
      })}
      <text x={c} y={c + 8} textAnchor="middle" fontSize="22"
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

function VietnamOutlineSvg({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 2.4} viewBox="0 0 40 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 2 C24 2 28 5 30 9 C32 13 31 18 29 22 C27 26 28 30 29 34 C30 38 29 42 27 45 C25 48 24 52 25 56 C26 60 24 64 21 68 C18 72 15 78 12 84 C10 88 9 92 10 94 C8 90 6 85 7 80 C8 75 10 70 12 65 C14 60 14 56 12 52 C10 48 9 44 11 40 C13 36 14 32 13 28 C12 24 13 19 15 14 C17 9 16 5 18 3 Z"
        fill={color}
        opacity="0.9"
      />
    </svg>
  );
}

function CompassRoseSvg({ size = 60 }: { size?: number }) {
  const c = size / 2;
  const r = size * 0.42;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={c} cy={c} r={r} stroke="white" strokeWidth="1" opacity="0.4" />
      <circle cx={c} cy={c} r={r * 0.6} stroke="white" strokeWidth="0.5" opacity="0.3" />
      <polygon points={`${c},${c - r * 0.9} ${c - 4},${c} ${c + 4},${c}`} fill="white" opacity="0.9" />
      <polygon points={`${c},${c + r * 0.9} ${c - 4},${c} ${c + 4},${c}`} fill="white" opacity="0.5" />
      <polygon points={`${c - r * 0.9},${c} ${c},${c - 4} ${c},${c + 4}`} fill="white" opacity="0.5" />
      <polygon points={`${c + r * 0.9},${c} ${c},${c - 4} ${c},${c + 4}`} fill="white" opacity="0.5" />
      <circle cx={c} cy={c} r={3} fill="white" opacity="0.8" />
    </svg>
  );
}
