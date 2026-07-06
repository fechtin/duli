import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLivingStore } from "@/lib/store/useLivingStore";
import { SIGNAL_META } from "@/lib/living/types";
import { useT } from "@/lib/i18n";

interface Props {
  destinationId: string;
}

/** Animated circular gauge — the score draws itself and counts up on mount (025 §GĐ3). */
function ScoreRing({ score, colorClass }: { score: number; colorClass: string }) {
  const R = 24;
  const C = 2 * Math.PI * R;
  const mv = useMotionValue(0);
  const dashOffset = useTransform(mv, (v) => C - (C * v) / 100);
  const label = useTransform(mv, (v) => String(Math.round(v)));

  useEffect(() => {
    const ctrl = animate(mv, score, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
    return () => ctrl.stop();
  }, [score, mv]);

  return (
    <div className="relative h-16 w-16 shrink-0" role="img" aria-label={`Heartbeat score ${score}/100`}>
      <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={R} fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={C}
          style={{ strokeDashoffset: dashOffset }}
          className={colorClass}
        />
      </svg>
      <motion.span
        className={`absolute inset-0 grid place-items-center font-display text-lg font-bold tabular-nums ${colorClass}`}
      >
        {label}
      </motion.span>
    </div>
  );
}

export function HeartbeatSection({ destinationId }: Props) {
  const t = useT();
  const getHeartbeat = useLivingStore((s) => s.getHeartbeat);
  const initialized  = useLivingStore((s) => s.initialized);
  const hb = getHeartbeat(destinationId);

  if (!initialized || !hb || hb.signals.length === 0) return null;

  const scoreColor =
    hb.score >= 75 ? "text-danger"
    : hb.score >= 50 ? "text-accent"
    : "text-primary";

  return (
    <div className="mx-5 mt-4 rounded-[var(--radius-lg)] border border-border bg-surface-2 p-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={hb.score} colorClass={scoreColor} />
        <div className="min-w-0 flex-1">
          <p className="type-micro text-muted">Heartbeat Score</p>
          {/* Signals */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {hb.signals.map((sig) => {
              const meta = SIGNAL_META[sig];
              return (
                <span
                  key={sig}
                  title={meta.description}
                  className="flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground shadow-[var(--shadow-e1)]"
                >
                  <span className="text-[13px]">{meta.icon}</span>
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Extra detail rows */}
      {(hb.seasonalState || hb.festivalName || hb.flowerName || hb.weatherLabel) && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {hb.seasonalState && (
            <p className="type-caption text-foreground/80">
              <span className="mr-1">{hb.seasonalIcon}</span>
              {hb.seasonalState}
            </p>
          )}
          {hb.festivalName && (
            <p className="type-caption font-medium text-foreground/80">
              🎉 {t("heartbeat.festivalHappening", { name: hb.festivalName })}
            </p>
          )}
          {hb.flowerName && (
            <p className="type-caption text-foreground/80">{t("heartbeat.flowerBlooming", { name: hb.flowerName })}</p>
          )}
          {hb.weatherLabel && (
            <p className="type-caption text-foreground/80">☀ {hb.weatherLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
