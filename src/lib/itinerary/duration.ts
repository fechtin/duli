/**
 * `visitDuration` → a schedulable number of minutes.
 *
 * The column is free-text Vietnamese but the vocabulary is small and closed (34 distinct values
 * across both atlases, 100% populated), so this parser is TOTAL over shipped data and
 * `coverage.test.ts` fails the build the moment a value it cannot read is authored.
 *
 * Two reading rules, and they point in opposite directions on purpose:
 *
 * - **Alternatives** ("Nửa ngày (cáp treo) hoặc 2 ngày (leo bộ)") are a *choice*, so take the
 *   cheapest option — the traveller takes the cable car.
 * - **Ranges** ("2–3 giờ") are an *uncertainty*, so budget the upper bound. Budgeting the lower
 *   bound is how you get a plan that says three places fit in an afternoon when two do.
 *
 * The exception is a day-scale range ("Cả ngày đến 3 ngày"): there, take the lower bound, because
 * the upper bound would classify the place as multi-day and drop it from the trip entirely.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { VisitSpec } from "./types.ts";

/** A tourist day of actual visiting, not 24h. Keeps "1 ngày" and DAY_START..DAY_END consistent. */
export const MINUTES_PER_DAY = 480;

/** One parsed quantity. `days` is null for sub-day units. */
interface Quantity {
  minutes: number;
  days: number | null;
}

/**
 * Normalize away the cosmetic variation: the data mixes `-`/`–`/`—`, uses `,` as the decimal
 * separator, and carries parentheticals ("(kể cả phà)") that must go before matching — note
 * "kể cả phà" contains "cả", which would otherwise read as "cả ngày" (a whole day).
 */
function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/\s+/g, " ")
    .trim();
}

/** A single quantity with no separators left in it. */
function parseQuantity(text: string): Quantity | null {
  // "2 ngày 1 đêm" / "Tour 4 ngày 3 đêm" — the day count is what matters.
  const nights = text.match(/(\d+(?:\.\d+)?)\s*ngày\s*\d+(?:\.\d+)?\s*đêm/);
  if (nights) {
    const d = Number(nights[1]);
    return { minutes: d * MINUTES_PER_DAY, days: d };
  }

  if (/nửa\s*ngày/.test(text)) return { minutes: MINUTES_PER_DAY / 2, days: 0.5 };
  if (/cả\s*ngày/.test(text)) return { minutes: MINUTES_PER_DAY, days: 1 };

  const days = text.match(/(\d+(?:\.\d+)?)\s*ngày/);
  if (days) {
    const d = Number(days[1]);
    return { minutes: d * MINUTES_PER_DAY, days: d };
  }

  // A bare "1 đêm" is an overnight stay — two days of the traveller's time.
  const night = text.match(/(\d+(?:\.\d+)?)\s*đêm/);
  if (night) {
    const d = Number(night[1]) + 1;
    return { minutes: d * MINUTES_PER_DAY, days: d };
  }

  const hours = text.match(/(\d+(?:\.\d+)?)\s*giờ/);
  if (hours) return { minutes: Math.round(Number(hours[1]) * 60), days: null };

  const mins = text.match(/(\d+(?:\.\d+)?)\s*phút/);
  if (mins) return { minutes: Math.round(Number(mins[1])), days: null };

  return null;
}

/** One alternative, which may itself be a range. */
function parseAlternative(text: string): Quantity | null {
  // "1 - 2 giờ" / "2-3 ngày" — one unit shared by both bounds.
  const shared = text.match(/(\d+(?:\.\d+)?)\s*(?:-|đến)\s*(\d+(?:\.\d+)?)\s*(giờ|phút|ngày)/);
  if (shared) {
    const lo = Number(shared[1]);
    const hi = Number(shared[2]);
    const unit = shared[3];
    if (unit === "ngày") return { minutes: lo * MINUTES_PER_DAY, days: lo };
    const perUnit = unit === "giờ" ? 60 : 1;
    return { minutes: Math.round(hi * perUnit), days: null };
  }

  // "Nửa ngày đến 1 ngày" — two fully-spelled bounds, possibly different units.
  const parts = text.split(/\s+(?:đến|-)\s+/).filter(Boolean);
  if (parts.length === 2) {
    const a = parseQuantity(parts[0]);
    const b = parseQuantity(parts[1]);
    if (a && b) {
      const dayScale = a.days !== null || b.days !== null;
      return dayScale
        ? (a.minutes <= b.minutes ? a : b) // lower bound, so a "…đến 3 ngày" place stays usable
        : (a.minutes >= b.minutes ? a : b); // upper bound, so the day isn't overpacked
    }
    return a ?? b;
  }

  return parseQuantity(text);
}

/**
 * Parse, or return null. Use this in tests to assert totality; use `parseVisitDuration` in the
 * engine, which cannot fail.
 */
export function tryParseVisitDuration(raw: string): VisitSpec | null {
  const text = normalize(raw);
  if (!text) return null;

  const alternatives = text
    .split(/\s+hoặc\s+/)
    .map(parseAlternative)
    .filter((q): q is Quantity => q !== null);
  if (!alternatives.length) return null;

  // A choice between options: take the cheapest.
  const chosen = alternatives.reduce((a, b) => (a.minutes <= b.minutes ? a : b));

  return {
    minutes: Math.max(15, Math.round(chosen.minutes)),
    fullDay: chosen.days !== null && chosen.days >= 1 && chosen.days < 2,
    multiDay: chosen.days !== null && chosen.days >= 2,
    raw,
  };
}

/**
 * Total version — falls back to the type's profile default when the string is unreadable.
 * Shipped data has never needed the fallback; new data might, and a trip that silently omits a
 * place is worse than one that budgets it approximately.
 */
export function parseVisitDuration(raw: string, fallbackMinutes: number): VisitSpec {
  return (
    tryParseVisitDuration(raw) ?? {
      minutes: fallbackMinutes,
      fullDay: fallbackMinutes >= MINUTES_PER_DAY,
      multiDay: false,
      raw,
    }
  );
}
