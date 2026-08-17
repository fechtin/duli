import { useEffect, useMemo, useRef } from "react";
import { Route } from "lucide-react";
import { useT } from "@/lib/i18n";
import { duration } from "@/lib/trip/format";
import { useMapStore } from "@/lib/store/useMapStore";
import { useTripStore } from "@/lib/store/useTripStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useUIStore } from "@/lib/store/useUIStore";
import type { TripPlan } from "@/lib/itinerary/types";
import { Chip } from "@/components/ui/Chip";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { firstPhotoSeed } from "@/components/ui/IllustratedImage";
import { heroSeedFor } from "@/lib/media/gallery";
import { DayTimeline } from "./DayTimeline";
import { DayTab, StatTile, TripNotice } from "./primitives";

/**
 * The generated trip.
 *
 * Selecting a day frames it on the map; selecting "whole route" frames everything. The camera is
 * never yanked on close — the traveller may still be reading.
 */
export function TripResult({ plan }: { plan: TripPlan }) {
  const t = useT();
  const theme = useUIStore((s) => s.theme);
  const dark = theme === "dark";
  const activeDay = useTripStore((s) => s.activeDay);
  const setActiveDay = useTripStore((s) => s.setActiveDay);
  const openForm = useTripStore((s) => s.openForm);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const destinations = useContentStore((s) => s.destinations);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Zustand v5: select raw state, derive with useMemo — a selector returning a fresh array loops.
  const pointsFor = useMemo(() => {
    const byId = new Map(destinations.map((d) => [d.id, d]));
    const of = (ids: string[]) =>
      ids
        .map((id) => byId.get(id))
        .filter(Boolean)
        .map((d) => [d!.lng, d!.lat] as [number, number]);
    return {
      all: of(plan.days.flatMap((d) => d.stops.map((s) => s.destinationId))),
      byDay: plan.days.map((d) => of(d.stops.map((s) => s.destinationId))),
    };
  }, [plan, destinations]);

  // Frame whatever is selected. Keyed on the day so re-selecting the same tab still refires.
  useEffect(() => {
    const points = activeDay === 0 ? pointsFor.all : (pointsFor.byDay[activeDay - 1] ?? []);
    if (points.length) requestFocus({ kind: "bounds", points });
  }, [activeDay, pointsFor, requestFocus]);

  // Keep the selected tab visible without scrolling the panel body.
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [activeDay]);

  const day = plan.days[activeDay - 1];
  // Photos are keyed by SEED, never by destination id — passing ids yields a gradient for every
  // stop, which is how the first build shipped a blank hero and blank thumbnails. `heroSeedFor`
  // is the translation, and it returns null rather than a dead seed for a stop with no photo.
  const heroSeed = useMemo(
    () => firstPhotoSeed(...plan.days.flatMap((d) => d.stops.map((s) => heroSeedFor(s.destinationId)))),
    [plan],
  );

  return (
    <div>
      {/* Every other panel opens on a photo, and the mobile sheet's grab handle is styled white
          for exactly that — on a plain surface it would be invisible. */}
      <div className="relative">
        <IllustratedImage seed={heroSeed} ratio="16/9" rounded={false} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/80">
            <Route size={13} />
            {t("trip.badge")}
          </span>
          <h2 className="type-display text-white">
            {t("trip.result.title", {
              days: plan.totalDays,
              province: t(`province.${plan.originProvince}`),
            })}
          </h2>
        </div>
      </div>

      <div className="truncate px-5 pt-3 text-xs text-muted">
        {plan.provinces.map((slug) => t(`province.${slug}`)).join(" › ")}
      </div>

      <div className="flex gap-2 px-5 pt-3">
        <StatTile value={String(plan.totalStops)} label={t("trip.result.stops")} />
        <StatTile value={String(plan.provinces.length)} label={t("trip.result.provinces")} />
        <StatTile value={`≈${duration(t, plan.estimatedTravelMinutes)}`} label={t("trip.result.driveTime")} />
      </div>

      {plan.notices.length > 0 && (
        <div className="flex flex-col gap-1.5 px-5 pt-3">
          {plan.notices.map((n) => (
            <TripNotice key={n}>{t(`trip.notice.${n}`)}</TripNotice>
          ))}
        </div>
      )}

      <div
        ref={tabsRef}
        className="no-scrollbar sticky top-0 z-10 mt-4 flex snap-x gap-1.5 overflow-x-auto border-b border-border bg-surface/95 px-5 pb-2.5 pt-6 backdrop-blur md:pt-3"
      >
        <button
          onClick={() => setActiveDay(0)}
          aria-pressed={activeDay === 0}
          className={`shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeDay === 0 ? "border-primary bg-primary-soft text-primary" : "border-border text-muted hover:bg-surface-2"
          }`}
        >
          {t("trip.result.allDays")}
        </button>
        {plan.days.map((d) => (
          <DayTab
            key={d.day}
            n={d.day}
            active={activeDay === d.day}
            dark={dark}
            labelShort={t("trip.day.tabShort", { n: d.day })}
            labelLong={t("trip.day.tab", { n: d.day })}
            onClick={() => setActiveDay(d.day)}
          />
        ))}
      </div>

      {day ? (
        <>
          <div className="px-5 pt-4">
            <h3 className="type-heading text-foreground">{t(`trip.theme.${day.themeKey}`, resolveParams(day.themeParams, t))}</h3>
            <p className="mt-0.5 text-[11px] text-muted">
              {t("trip.day.stats", {
                visit: duration(t, day.estimatedVisitMinutes),
                travel: `≈${duration(t, day.estimatedTravelMinutes)}`,
              })}
            </p>
          </div>
          <DayTimeline day={day} dark={dark} />
        </>
      ) : (
        <div className="flex flex-col gap-4 px-5 pt-4">
          {plan.days.map((d) => (
            <div key={d.day}>
              <h3 className="type-heading text-foreground">
                {t("trip.day.tab", { n: d.day })} · {t(`trip.theme.${d.themeKey}`, resolveParams(d.themeParams, t))}
              </h3>
              <DayTimeline day={d} dark={dark} />
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 px-5 pb-8 pt-2">
        <Chip onClick={() => openForm(plan.originProvince)}>{t("trip.form.regenerate")}</Chip>
      </div>
    </div>
  );
}

/**
 * Theme params carry province SLUGS, not names — the engine must never emit prose, and province
 * names live in the UI dictionary. Resolve them here, at the one place that has `t`.
 */
function resolveParams(
  params: Record<string, string>,
  t: (key: string, p?: Record<string, string | number>) => string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    out[k] = k === "province" || k === "from" || k === "to" ? t(`province.${v}`) : v;
  }
  return out;
}
