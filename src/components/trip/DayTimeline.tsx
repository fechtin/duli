import { motion } from "motion/react";
import { Car, ChevronRight, Moon, UtensilsCrossed } from "lucide-react";
import { useT } from "@/lib/i18n";
import { clock, duration } from "@/lib/trip/format";
import { tripDayColor } from "@/lib/map/tripPalette";
import { useContentStore } from "@/lib/store/useContentStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useTripStore } from "@/lib/store/useTripStore";
import type { TripDay } from "@/lib/itinerary/types";
import { markerIcon } from "@/components/map/markerIcons";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { RailDot, RailNode } from "./primitives";

/**
 * One day, as a vertical rail.
 *
 * The load-bearing idea: **the drive is part of the rail, not a gap in it.** A multi-province day
 * is mostly road, and rendering that as whitespace between two cards makes the plan look empty
 * where it is actually busiest. So the rail runs solid through a stop and dashed through a drive,
 * with the dashed run's height proportional to how long the drive is — the shape of the column
 * ends up being the shape of the day.
 */

/** Height of a drive run, clamped so a 20-minute hop is a tick and a 3-hour transfer is a wall. */
function driveHeight(minutes: number): number {
  return Math.min(150, Math.max(40, 40 + minutes * 0.45));
}

export function DayTimeline({ day, dark }: { day: TripDay; dark: boolean }) {
  const t = useT();
  const destinations = useContentStore((s) => s.destinations);
  const selectDestination = useMapStore((s) => s.selectDestination);
  const requestFocus = useMapStore((s) => s.requestFocus);
  const activeStopId = useTripStore((s) => s.activeStopId);
  const setActiveStop = useTripStore((s) => s.setActiveStop);
  const c = tripDayColor(day.day - 1, dark);

  const nameOf = (id: string) => destinations.find((d) => d.id === id);

  return (
    <motion.div
      key={day.day}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 pb-4"
    >
      {day.stops.map((stop, i) => {
        const place = nameOf(stop.destinationId);
        const Icon = place ? markerIcon(place.type) : UtensilsCrossed;
        const previous = day.stops[i - 1];
        const crossesProvince = previous && previous.provinceSlug !== stop.provinceSlug;

        return (
          <div key={stop.destinationId}>
            {/* The drive INTO this stop, drawn as a dashed continuation of the rail. */}
            {i > 0 && stop.travelFromPreviousMinutes > 0 && (
              <div className="flex gap-3">
                <div className="flex w-7 justify-center">
                  <span
                    className="w-0 border-l-2 border-dashed"
                    style={{ borderColor: c.line, height: driveHeight(stop.travelFromPreviousMinutes) }}
                  />
                </div>
                <div className="flex-1 py-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Car size={13} />
                    <span>{t("trip.drive.duration", { duration: duration(t, stop.travelFromPreviousMinutes) })}</span>
                  </div>
                  {/* A province crossing is the narrative payload of a long leg — it turns
                      "waiting" into "progress", so it is stated rather than left implicit. */}
                  {crossesProvince && (
                    <div className="mt-1 text-[11px] font-medium text-foreground/70">
                      {t("trip.drive.cross", {
                        from: t(`province.${previous.provinceSlug}`),
                        to: t(`province.${stop.provinceSlug}`),
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setActiveStop(stop.destinationId);
                if (place) requestFocus({ kind: "point", lng: place.lng, lat: place.lat, zoom: 8 });
              }}
              className={cnRow(activeStopId === stop.destinationId)}
            >
              <div className="flex w-7 flex-col items-center">
                <RailNode order={stop.order} dark={dark} dayIndex={day.day - 1} />
              </div>
              {place && (
                <IllustratedImage seed={place.gallery?.[0]?.seed ?? place.id} ratio="1/1" className="w-14 shrink-0" rounded />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {place?.name ?? stop.destinationId}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                  <Icon size={12} />
                  {t("trip.stop.visit", { duration: duration(t, stop.visitMinutes) })}
                </span>
                <span className="mt-0.5 block text-[11px] tabular-nums text-faint">
                  {t("trip.stop.window", { start: clock(stop.arrivalMinutes), end: clock(stop.departureMinutes) })}
                </span>
              </span>
              <ChevronRight
                size={16}
                className="shrink-0 self-center text-faint"
                onClick={(e) => {
                  e.stopPropagation();
                  if (place) selectDestination(place.id, place.provinceSlug);
                }}
              />
            </button>
          </div>
        );
      })}

      {/* Meals sit outside the rail: they are time, not places. */}
      {day.meals.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 pl-10">
          {day.meals.map((meal) => (
            <span
              key={meal.slot}
              className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-muted"
            >
              <UtensilsCrossed size={11} />
              {t(`trip.meal.${meal.slot}`)} · {meal.restaurantName ?? t("trip.meal.free")}
            </span>
          ))}
        </div>
      )}

      {/* "Where do I sleep" is the most-asked question of a multi-province trip and it is free to
          derive, so the day closes on it rather than leaving the reader to work it out. */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex w-7 justify-center">
          <RailDot dark={dark} dayIndex={day.day - 1} />
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <Moon size={12} />
          {t("trip.day.night", { province: t(`province.${day.nightProvince}`) })}
        </span>
      </div>
    </motion.div>
  );
}

function cnRow(active: boolean): string {
  return [
    "flex w-full items-start gap-3 rounded-[var(--radius-md)] py-1.5 pr-1 text-left transition-colors",
    active ? "bg-surface-2" : "hover:bg-surface-2",
  ].join(" ");
}
