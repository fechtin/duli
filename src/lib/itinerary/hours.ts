/**
 * `openingHours` → a schedulable window, or an honest admission that there isn't one.
 *
 * This is a **classifier, not an extractor**, and that distinction is the whole design.
 * Measured over all 376 rows: 58% start with `HH:MM`, 70% contain a range *somewhere*, and 29%
 * contain no digit at all. Reaching for the first range you find is actively wrong on real rows:
 *
 *   "Ngõ mở cả ngày, không có giờ quy định; quán cà phê và nhà hàng thường 11:00–23:00"
 *      → the alley never closes; 11:00–23:00 belongs to the cafés.
 *   "Áp dụng 'chế độ giờ vào núi'… lên từ 04:00 … giờ chặn riêng trong khoảng 12:00–17:00"
 *      → 12:00–17:00 is when trails *close*.
 *
 * So anything that isn't confidently one whole-site window classifies as `unknown`, which is
 * schedulable but never *claimed* to be open. Under-claiming is free; a plan that sends someone
 * to a locked gate is not.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { OpenSpec } from "./types.ts";

/** Any `HH:MM`. Deliberately not matching "1/1/2026" or "100.000". */
const TIME_TOKEN = /\b(\d{1,2}):(\d{2})\b/g;
/** A window: two times joined by a dash or tilde. The data mixes `-`, `–`, `—` and `~`. */
const RANGE = /(\d{1,2}):(\d{2})\s*[-–—~]\s*(\d{1,2}):(\d{2})/g;
/** Same, anchored — the common, unambiguous case ("07:00 - 17:30 hằng ngày"). */
const LEADING_RANGE = /^(\d{1,2}):(\d{2})\s*[-–—~]\s*(\d{1,2}):(\d{2})/;
/** Phrases meaning "there is no gate", in both atlases' editorial voice. */
const ALWAYS = /(cả\s*ngày|24\s*giờ|24\/7|quanh\s*năm|suốt\s*ngày|mở\s*tự\s*do)/;

function toMinutes(h: string, m: string): number {
  return Number(h) * 60 + Number(m);
}

function interval(openMin: number, closeMin: number, raw: string): OpenSpec {
  // An overnight venue ("18:00 - 02:00") closes on the following day.
  return { kind: "interval", openMin, closeMin: closeMin <= openMin ? closeMin + 1440 : closeMin, raw };
}

/**
 * Classify. Total by construction — every string lands in exactly one bucket.
 *
 * Order matters and is load-bearing: a leading window wins over an "always" phrase, because
 * "03:00–22:00, mở cửa quanh năm" is a real window whose "quanh năm" means *all year*, not
 * *all day*.
 */
export function parseOpeningHours(raw: string): OpenSpec {
  const text = (raw ?? "").trim();
  if (!text) return { kind: "unknown", raw };

  // 1. The unambiguous majority: the string opens with its own window.
  const leading = text.match(LEADING_RANGE);
  if (leading) return interval(toMinutes(leading[1], leading[2]), toMinutes(leading[3], leading[4]), raw);

  const times = [...text.matchAll(TIME_TOKEN)];
  const ranges = [...text.matchAll(RANGE)];
  const saysAlways = ALWAYS.test(text.toLowerCase());

  // 2. No clock anywhere plus an "open all day" phrase — nothing to respect, so nothing to fear.
  if (!times.length && saysAlways) return { kind: "always", raw };

  // 3. Exactly one window and no stray times: a prefixed but still whole-site window,
  //    e.g. "Họp chợ từ 04:00 - 08:00 hằng ngày". The `saysAlways` guard is what keeps the
  //    café-inside-an-always-open-alley case out of here.
  if (!saysAlways && ranges.length === 1 && times.length === 2) {
    const r = ranges[0];
    return interval(toMinutes(r[1], r[2]), toMinutes(r[3], r[4]), raw);
  }

  // 4. Seasonal tables, per-stall hours, trail-closing windows, tour schedules.
  return { kind: "unknown", raw };
}

/** Can a visit of `durationMin` starting at `atMin` be honestly promised? */
export function fitsWithin(spec: OpenSpec, atMin: number, durationMin: number): boolean {
  if (spec.kind !== "interval") return true; // nothing known to violate
  return atMin >= spec.openMin && atMin + durationMin <= spec.closeMin;
}

/** Earliest honest start at or after `notBefore`, or null if the visit cannot fit at all. */
export function earliestStart(spec: OpenSpec, notBefore: number, durationMin: number): number | null {
  if (spec.kind !== "interval") return notBefore;
  const start = Math.max(notBefore, spec.openMin);
  return start + durationMin <= spec.closeMin ? start : null;
}

/**
 * Fit a visit into what the gate actually allows, shortening it rather than refusing it.
 *
 * `visitDuration` measures a TOURIST day, not eight unbroken hours inside a fence. Cát Tiên is
 * authored "1 ngày" (480 min) but opens 07:00–17:00, so demanding the full 480 meant it had to be
 * under way by 09:00 — arrive at 09:40 and it could never be scheduled at all, on any day, in any
 * trip. Three national parks were silently unreachable for exactly this reason.
 *
 * Returns null only when what is left is too short to be worth the journey.
 */
export function fitVisit(
  spec: OpenSpec,
  notBefore: number,
  wantedMin: number,
): { start: number; minutes: number } | null {
  if (spec.kind !== "interval") return { start: notBefore, minutes: wantedMin };
  const start = Math.max(notBefore, spec.openMin);
  const available = spec.closeMin - start;
  if (available >= wantedMin) return { start, minutes: wantedMin };
  // Half the intended stay, and never less than an hour — below that the drive is the trip.
  const floor = Math.max(60, wantedMin * 0.5);
  return available >= floor ? { start, minutes: available } : null;
}
