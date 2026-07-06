import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import { localizeSeasonalState } from "@/lib/living/livingI18n";
import type { Locale } from "@/lib/i18n";

/** Translate fn shape (matches i18n `t`) so this pure module stays hook-free. */
type TFn = (key: string, params?: Record<string, string | number>) => string;

export type BriefPeriod = "morning" | "afternoon" | "evening" | "weekend" | "holiday";

export interface BriefContent {
  period: BriefPeriod;
  greeting: string;
  aiRecommendation: string;
  month: number;
}

type SeasonEntry = { destinationId: string; state: string; icon: string; mood: string };

function vietnamHour(): number {
  return (new Date().getUTCHours() + 7) % 24;
}
function currentMonth(): number {
  return new Date().getMonth() + 1;
}
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getBriefPeriod(): BriefPeriod {
  if (isWeekend()) return "weekend";
  const h = vietnamHour();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "evening";
}

/**
 * The daily brief shown in the sidebar (027). Both fields are fully localized:
 * greeting via `brief.greeting.*`, the AI recommendation via `brief.aiRec.*` with place names
 * (`place.<id>`) and the seasonal state resolved through the living overlay.
 */
export function generateBrief(t: TFn, locale: Locale): BriefContent {
  const month = currentMonth();
  const period = getBriefPeriod();

  const seasonal = ((seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? []).slice(0, 2);
  const placeName = (id: string) => t(`place.${id}`);
  const stateOf = (e: SeasonEntry) => localizeSeasonalState(month, e.destinationId, e.state, locale);

  const aiRecommendation =
    seasonal.length > 1
      ? t("brief.aiRec.multi", {
          month,
          a: placeName(seasonal[0].destinationId),
          b: placeName(seasonal[1].destinationId),
          state: stateOf(seasonal[0]),
        })
      : seasonal.length === 1
        ? t("brief.aiRec.single", {
            month,
            name: placeName(seasonal[0].destinationId),
            state: stateOf(seasonal[0]),
          })
        : t("brief.aiRec.single", { month, name: t("common.vietnam"), state: "" });

  return {
    period,
    greeting: t(`brief.greeting.${period}`),
    aiRecommendation,
    month,
  };
}
