import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Share2, Compass, MapPin } from "lucide-react";
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

export function PassportPanel() {
  const t = useT();
  const isDesktop = useIsDesktop();
  const open = useUIStore((s) => s.passportOpen);
  const setOpen = useUIStore((s) => s.setPassportOpen);
  const checkins = usePassportStore((s) => s.checkins);
  // Derive memoized values — selecting freshly-built arrays would loop (Zustand v5).
  const visitedProvinces = useMemo(() => [...new Set(checkins.map((c) => c.provinceSlug))], [checkins]);
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
            className="absolute z-50 flex flex-col border-border bg-surface shadow-[var(--shadow-e3)] inset-x-0 bottom-0 max-h-[90%] rounded-t-[var(--radius-sheet)] border-t md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[420px] md:rounded-none md:border-l"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <p className="font-display text-base font-semibold text-foreground">{t("passport.title")}</p>
              <button onClick={() => setOpen(false)} aria-label={t("panel.close")} className="text-muted hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="no-scrollbar flex-1 overflow-y-auto p-5">
              {/* Hidden full-res card for export */}
              <div className="pointer-events-none absolute -left-[9999px] top-0">
                <ShareCard ref={cardRef} provincesVisited={visitedProvinces.length} checkins={checkins.length} badges={badges.length} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-lg)] bg-gradient-to-br from-primary to-[#13303a] p-4 text-white">
                <Stat value={`${visitedProvinces.length}/63`} label={t("passport.explored")} />
                <Stat value={String(checkins.length)} label={t("passport.checkins")} />
                <Stat value={String(badges.length)} label={t("passport.badges")} />
              </div>

              <Button className="mt-3 w-full" variant="secondary" onClick={onShare} disabled={checkins.length === 0}>
                <Share2 size={16} />
                {t("passport.share")}
              </Button>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {badges.map((b) => (
                    <span key={b.id} className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1.5 text-sm">
                      <span>{b.emoji}</span>
                      <span className="font-medium text-foreground">{b.label}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Check-ins */}
              {checkins.length === 0 ? (
                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-primary">
                    <Compass size={30} />
                  </div>
                  <p className="max-w-[16rem] text-sm text-muted">{t("passport.empty")}</p>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      useMapStore.getState().reset();
                    }}
                  >
                    {t("passport.startExploring")}
                  </Button>
                </div>
              ) : (
                <div className="mt-6 space-y-2.5">
                  {checkins.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => openDestination(c.destinationId, c.provinceSlug)}
                      className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border p-2 text-left transition-colors hover:bg-surface-2"
                    >
                      <IllustratedImage seed={c.photoSeed} ratio="1/1" className="w-16 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                          <MapPin size={12} className="text-primary" />
                          <span className="truncate">{c.destinationName}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted">{c.caption}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] text-white/75">{label}</div>
    </div>
  );
}
