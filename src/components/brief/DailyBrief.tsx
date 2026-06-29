import { useState, useEffect } from "react";
import { X, Compass } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateBrief, type BriefContent } from "@/lib/living/briefGenerator";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";

// Morning Brief popup is shown only the first time per DAY (023 §Morning Brief Redesign).
// After that the persistent AI Companion Card carries the brief.
const DAY_KEY = "vivel:brief-popup";
const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

export function DailyBrief() {
  const [brief, setBrief] = useState<BriefContent | null>(null);
  const [visible, setVisible] = useState(false);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const setBriefOpen = useUIStore((s) => s.setBriefOpen);

  useEffect(() => {
    if (localStorage.getItem(DAY_KEY) === today()) return;
    const b = generateBrief();
    setBrief(b);
    // Small delay so the map loads first
    const tid = setTimeout(() => {
      setVisible(true);
      setBriefOpen(true);
    }, 1200);
    return () => clearTimeout(tid);
  }, [setBriefOpen]);

  const dismiss = () => {
    setVisible(false);
    setBriefOpen(false);
    localStorage.setItem(DAY_KEY, today());
  };

  const onDiscover = () => {
    dismiss();
    // Fly to a featured destination — first highlight if parseable, else reset
    requestFocus({ kind: "reset" });
  };

  return (
    <AnimatePresence>
      {visible && brief && (
        <motion.div
          key="daily-brief"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-[4.5rem] md:pt-[3.75rem]"
          aria-live="polite"
          aria-label="Bản tin du lịch hôm nay"
        >
          <div
            className="pointer-events-auto w-full max-w-md rounded-[var(--radius-xl)] border border-border bg-surface/95 shadow-[var(--shadow-e3)] backdrop-blur"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-0">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                  {PERIOD_LABEL[brief.period]}
                </p>
                <h2 className="mt-0.5 font-display text-[1.05rem] font-bold leading-snug text-foreground">
                  {brief.greeting}
                </h2>
              </div>
              <button
                onClick={dismiss}
                aria-label="Đóng bản tin"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Hero story */}
            <p className="px-5 pt-2 text-[13px] leading-relaxed text-foreground/80">
              {brief.heroStory}
            </p>

            {/* Highlights */}
            {brief.highlights.length > 0 && (
              <ul className="mt-3 space-y-1 px-5">
                {brief.highlights.map((h, i) => (
                  <li key={i} className="text-[12px] leading-relaxed text-muted">
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* AI recommendation */}
            <div className="mx-5 mt-3 rounded-[var(--radius-md)] bg-primary-soft px-3.5 py-2.5">
              <p className="text-[11px] font-semibold text-primary mb-0.5">🤖 AI đề xuất</p>
              <p className="text-[12px] text-foreground/80 leading-relaxed">{brief.aiRecommendation}</p>
            </div>

            {/* Hidden gem */}
            <div className="px-5 pt-3 pb-1">
              <p className="text-[11px] text-muted">
                <span className="font-semibold text-accent">💎 Hidden Gem hôm nay:</span>{" "}
                {brief.hiddenGem}
              </p>
            </div>

            {/* CTA */}
            <div className="px-5 pb-4 pt-3">
              <button
                onClick={onDiscover}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[13px] font-semibold text-primary-foreground shadow-[var(--shadow-e1)] transition-opacity hover:opacity-90"
              >
                <Compass size={15} />
                Khám phá ngay
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PERIOD_LABEL: Record<string, string> = {
  morning:   "Bản tin sáng",
  afternoon: "Bản tin chiều",
  evening:   "Bản tin tối",
  weekend:   "Bản tin cuối tuần",
  holiday:   "Bản tin kỳ nghỉ",
};
