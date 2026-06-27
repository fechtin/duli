import { useLivingStore } from "@/lib/store/useLivingStore";
import { SIGNAL_META } from "@/lib/living/types";

interface Props {
  destinationId: string;
}

export function HeartbeatSection({ destinationId }: Props) {
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
      {/* Score row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Heartbeat Score
        </span>
        <span className={`font-display text-2xl font-bold tabular-nums ${scoreColor}`}>
          {hb.score}
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
          style={{ width: `${hb.score}%` }}
        />
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-1.5">
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

      {/* Extra detail rows */}
      {(hb.seasonalState || hb.festivalName || hb.flowerName || hb.weatherLabel) && (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {hb.seasonalState && (
            <p className="text-[12px] text-foreground/80">
              <span className="mr-1">{hb.seasonalIcon}</span>
              {hb.seasonalState}
            </p>
          )}
          {hb.festivalName && (
            <p className="text-[12px] text-foreground/80">
              🎉 <span className="font-medium">{hb.festivalName}</span> đang diễn ra
            </p>
          )}
          {hb.flowerName && (
            <p className="text-[12px] text-foreground/80">{hb.flowerName} đang nở</p>
          )}
          {hb.weatherLabel && (
            <p className="text-[12px] text-foreground/80">☀ {hb.weatherLabel}</p>
          )}
        </div>
      )}
    </div>
  );
}
