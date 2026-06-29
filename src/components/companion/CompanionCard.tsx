import { useMemo, useState } from "react";
import { ChevronDown, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateBrief, type BriefContent } from "@/lib/living/briefGenerator";
import { useUIStore } from "@/lib/store/useUIStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useIsDesktop } from "@/lib/utils/useMediaQuery";
import { cn } from "@/lib/utils/cn";

/**
 * AI Companion Card — the persistent home of the Morning Brief (023 §AI Companion Card).
 * Always present (no popup): a 1-line, time-aware teaser that expands into a full brief panel.
 * Desktop: floats just below the search bar. Mobile: sticky card above the nav, draggable up
 * like Apple Maps. Hidden behind full-screen overlays so it never covers the map.
 */
export function CompanionCard() {
  const brief = useMemo(() => generateBrief(), []);
  const [expanded, setExpanded] = useState(false);

  const searchOpen = useUIStore((s) => s.searchOpen);
  const briefOpen = useUIStore((s) => s.briefOpen);
  const aiOpen = useUIStore((s) => s.aiOpen);
  const passportOpen = useUIStore((s) => s.passportOpen);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const isDesktop = useIsDesktop();

  const panelOpen = Boolean(selectedDestination || selectedProvince);
  // Hide under any full-screen overlay; on mobile also hide when a panel/sheet is open.
  const hidden = searchOpen || briefOpen || aiOpen || passportOpen || (!isDesktop && panelOpen);
  if (hidden) return null;

  const onDiscover = () => {
    setExpanded(false);
    requestFocus({ kind: "reset" });
  };

  const teaserRow = (
    <>
      <span className="text-base leading-none">{brief.emoji}</span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">{brief.teaser}</span>
      <ChevronDown
        size={16}
        className={cn("shrink-0 text-muted transition-transform duration-200", expanded && "rotate-180")}
      />
    </>
  );

  if (isDesktop) {
    return (
      <div className="pointer-events-none absolute left-0 top-0 z-20 px-4 pt-[4.25rem]">
        <motion.div
          layout
          className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/95 shadow-[var(--shadow-e2)] backdrop-blur"
        >
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label="Bản tin AI hôm nay"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left"
          >
            {teaserRow}
          </button>
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <CompanionBody brief={brief} onDiscover={onDiscover} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Mobile — sticky card above the bottom nav, draggable upward (Apple Maps style).
  return (
    <motion.div
      className="pointer-events-auto fixed inset-x-0 z-20 mx-auto max-w-md px-3 md:hidden"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 4rem)" }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.16}
      onDragEnd={(_, info) => {
        if (info.offset.y < -40) setExpanded(true);
        else if (info.offset.y > 40) setExpanded(false);
      }}
    >
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/95 shadow-[var(--shadow-e3)] backdrop-blur">
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="Bản tin AI hôm nay"
          className="w-full"
        >
          <span className="mx-auto mt-2 block h-1 w-9 rounded-full bg-border" aria-hidden />
          <span className="flex items-center gap-2.5 px-4 pb-2.5 pt-2 text-left">{teaserRow}</span>
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="max-h-[55vh] overflow-y-auto no-scrollbar">
                <CompanionBody brief={brief} onDiscover={onDiscover} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Expanded brief — 5 highlights + AI pick + Hidden Gem + CTA (023 §Expandable Brief). */
function CompanionBody({ brief, onDiscover }: { brief: BriefContent; onDiscover: () => void }) {
  return (
    <div className="border-t border-border px-4 pb-4 pt-3">
      <h2 className="font-display text-[0.98rem] font-bold leading-snug text-foreground">{brief.greeting}</h2>
      <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/80">{brief.heroStory}</p>

      {brief.highlights.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          {brief.highlights.map((h, i) => (
            <li key={i} className="text-[12px] leading-relaxed text-muted">
              {h}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 rounded-[var(--radius-md)] bg-primary-soft px-3.5 py-2.5">
        <p className="mb-0.5 text-[11px] font-semibold text-primary">🤖 AI đề xuất</p>
        <p className="text-[12px] leading-relaxed text-foreground/80">{brief.aiRecommendation}</p>
      </div>

      <p className="mt-3 text-[11px] text-muted">
        <span className="font-semibold text-accent">💎 Hidden Gem hôm nay:</span> {brief.hiddenGem}
      </p>

      <button
        onClick={onDiscover}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[var(--shadow-e1)] transition-opacity hover:opacity-90"
      >
        <Compass size={15} />
        Khám phá
      </button>
    </div>
  );
}
