/**
 * Rendering engine minutes as something a human reads.
 *
 * Clock times need no dictionary entry — 24-hour `HH:MM` is locale-invariant and every locale this
 * app ships already uses it. Durations DO, because the words differ, and they are deliberately
 * abbreviated in all five: `interpolate()` is a plain string replace with no plural machinery, so
 * a spelled-out "{h} hours" would ship "1 hours".
 */

type T = (key: string, params?: Record<string, string | number>) => string;

/** Minutes from midnight → "08:30". */
export function clock(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** A span of minutes → "2g30p" / "2h 30m" / "2시간 30분". */
export function duration(t: T, minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return t("trip.duration.hm", { h, m });
  if (h) return t("trip.duration.h", { h });
  return t("trip.duration.m", { m });
}
