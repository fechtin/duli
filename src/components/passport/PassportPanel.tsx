import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Share2, Compass, MapPin, Star } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useIsDesktop } from "@/lib/utils/useMediaQuery";
import { useT } from "@/lib/i18n";
import { panelTransition } from "@/design/motion";
import { Button } from "@/components/ui/Button";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { ShareCard } from "@/components/share/ShareCard";
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

  const visitedProvinces = useMemo(() => [...new Set(checkins.map((c) => c.provinceSlug))], [checkins]);
  const visitedRegions = useMemo(
    () => [...new Set(checkins.map((c) => provinceToRegion[c.provinceSlug]).filter(Boolean))],
    [checkins],
  );
  const badges = useMemo(() => usePassportStore.getState().badges(), [checkins]);

  const selectDestination = useMapStore((s) => s.selectDestination);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const destinations = useContentStore((s) => s.destinations);
  const cardRef = useRef<SVGSVGElement>(null);

  const onShare = () => {
    if (cardRef.current) shareOrDownload(cardRef.current);
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

            <div className="no-scrollbar flex-1 overflow-y-auto">
              {/* Hidden export card */}
              <div className="pointer-events-none absolute -left-[9999px] top-0">
                <ShareCard ref={cardRef} provincesVisited={visitedProvinces.length} visitedRegions={visitedRegions.length} checkins={checkins} badges={badges} />
              </div>

              {/* Passport Cover Card */}
              <div className="relative overflow-hidden mx-0"
                style={{ background: "linear-gradient(160deg, #0d2a35 0%, #16504a 55%, #0e3030 100%)" }}>
                {/* Decorative border */}
                <div className="absolute inset-[10px] rounded-none border border-white/10 pointer-events-none" />

                {/* Compass watermark */}
                <div className="absolute bottom-4 right-6 opacity-10">
                  <CompassRoseSvg size={80} />
                </div>

                {/* Vietnam map watermark */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.07]">
                  <VietnamOutlineSvg size={70} />
                </div>

                <div className="relative flex items-center gap-6 px-6 py-6">
                  {/* Left: emblem + title */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-[#d4a84b]/40 flex items-center justify-center">
                        <VietnamOutlineSvg size={38} color="#d4a84b" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d4a84b]/20 border border-[#d4a84b]/50 flex items-center justify-center">
                        <Star size={9} fill="#d4a84b" color="#d4a84b" />
                      </div>
                    </div>
                    <p className="text-[9px] tracking-[0.2em] uppercase text-white/40 font-medium">VIETNAM ATLAS</p>
                  </div>

                  {/* Right: title + stats */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-[#d4a84b]/80 font-medium mb-0.5">
                      {t("passport.subtitle")}
                    </p>
                    <h2 className="font-display text-xl font-bold text-white leading-tight">
                      VIETNAM<br />PASSPORT
                    </h2>

                    {/* Province progress */}
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

                    {/* 4-stat grid */}
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
                <Button className="w-full" variant="secondary" onClick={onShare} disabled={checkins.length === 0}>
                  <Share2 size={15} />
                  {t("passport.share")}
                </Button>
              </div>

              {checkins.length === 0 ? (
                <EmptyState t={t} setOpen={setOpen} />
              ) : (
                <div className="px-5 pb-6 space-y-6 mt-4">
                  {/* Visited places */}
                  <section>
                    <SectionHeader label={t("passport.visitedPlaces")} count={checkins.length} />
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      {checkins.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                          className="group relative overflow-hidden rounded-[var(--radius-md)] border border-border text-left transition-all hover:border-primary/40 hover:shadow-[var(--elevation-1)]"
                        >
                          <IllustratedImage seed={c.photoSeed} ratio="4/3" className="w-full" />
                          {/* Number badge */}
                          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white">{i + 1}</span>
                          </div>
                          <div className="p-2">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-primary shrink-0" />
                              <span className="text-xs font-semibold text-foreground truncate">{c.destinationName}</span>
                            </div>
                            <p className="mt-0.5 text-[10px] text-muted line-clamp-2 leading-relaxed">{c.caption}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Badges */}
                  {badges.length > 0 && (
                    <section>
                      <SectionHeader label={t("passport.yourBadges")} count={badges.length} />
                      <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        {badges.map((b) => (
                          <div key={b.id} className="flex flex-col items-center gap-2 shrink-0 w-[72px]">
                            <BadgeMedal emoji={b.emoji} />
                            <span className="text-[9px] text-center text-muted leading-snug font-medium px-0.5">{b.label}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Timeline */}
                  <section>
                    <SectionHeader label={t("passport.timeline")} />
                    <div className="mt-3 overflow-x-auto no-scrollbar">
                      <div className="flex items-start gap-0 min-w-max">
                        {[...checkins].reverse().map((c, i, arr) => (
                          <div key={c.id} className="flex items-start">
                            <button
                              onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                              className="flex flex-col items-center gap-1.5 w-20 hover:opacity-80 transition-opacity"
                            >
                              <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center overflow-hidden">
                                <IllustratedImage seed={c.photoSeed} ratio="1/1" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-[9px] text-center text-muted leading-tight px-1 font-medium">
                                {c.destinationName}
                              </span>
                            </button>
                            {i < arr.length - 1 && (
                              <div className="h-0.5 w-4 bg-border mt-4 shrink-0" />
                            )}
                          </div>
                        ))}
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

// Badge medal — resembles the golden circular badges in badges.png design
function BadgeMedal({ emoji }: { emoji: string }) {
  const S = 56;
  const c = S / 2;
  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring with tick marks */}
      <circle cx={c} cy={c} r={c - 1} fill="#0d2a2e" stroke="#c49a2a" strokeWidth="2" />
      {/* Inner ring */}
      <circle cx={c} cy={c} r={c - 6} fill="none" stroke="rgba(212,168,75,0.35)" strokeWidth="1" />
      {/* Decorative dots at cardinal points */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const r2 = c - 4;
        return (
          <circle
            key={deg}
            cx={c + Math.cos(rad) * r2}
            cy={c + Math.sin(rad) * r2}
            r={1.5}
            fill="#c49a2a"
            opacity="0.7"
          />
        );
      })}
      {/* Emoji */}
      <text x={c} y={c + 8} textAnchor="middle" fontSize="22" fontFamily="Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif">
        {emoji}
      </text>
    </svg>
  );
}

function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      {count !== undefined && (
        <span className="text-xs text-muted bg-surface-2 rounded-full px-2 py-0.5">{count}</span>
      )}
    </div>
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
      <path
        d="M20 2 C24 2 28 5 30 9 C32 13 31 18 29 22 C27 26 28 30 29 34 C30 38 29 42 27 45 C25 48 24 52 25 56 C26 60 24 64 21 68 C18 72 15 78 12 84 C10 88 9 92 10 94"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
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
      {/* Cardinal arrows */}
      <polygon points={`${c},${c - r * 0.9} ${c - 4},${c} ${c + 4},${c}`} fill="white" opacity="0.9" />
      <polygon points={`${c},${c + r * 0.9} ${c - 4},${c} ${c + 4},${c}`} fill="white" opacity="0.5" />
      <polygon points={`${c - r * 0.9},${c} ${c},${c - 4} ${c},${c + 4}`} fill="white" opacity="0.5" />
      <polygon points={`${c + r * 0.9},${c} ${c},${c - 4} ${c},${c + 4}`} fill="white" opacity="0.5" />
      <circle cx={c} cy={c} r={3} fill="white" opacity="0.8" />
    </svg>
  );
}
