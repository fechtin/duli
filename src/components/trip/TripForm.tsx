import { Route } from "lucide-react";
import { useMemo } from "react";
import { presetsFor } from "@/data/trip-presets";
import { useT } from "@/lib/i18n";
import { activeCountry } from "@/lib/store/useCountryStore";
import { useTripStore } from "@/lib/store/useTripStore";
import type { TripPace, TripStyle } from "@/lib/itinerary/types";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Section } from "@/components/panel/primitives";

/**
 * One screen, not a wizard.
 *
 * `CheckinFlow` is the app's only multi-step form and it earns its steps: picking a photo is
 * expensive and gates the caption. Days, style and pace are three independent single taps, so a
 * stepper would triple the interaction cost and add a modal handoff right before the result
 * appears on the map behind. Four taps, about eight seconds.
 *
 * Built from `Chip` and `Button` only — the codebase has no Select, and it does not need one here.
 */

const DAY_CHOICES = [3, 4, 5, 7];
const STYLES: TripStyle[] = ["mixed", "nature", "heritage", "food", "beach"];
const PACES: TripPace[] = ["relaxed", "balanced", "packed"];

export function TripForm() {
  const t = useT();
  const params = useTripStore((s) => s.params);
  const setParams = useTripStore((s) => s.setParams);
  const generate = useTripStore((s) => s.generate);

  const cc = activeCountry();
  // Zustand v5: never return a fresh array from a selector. This derives from props, not state.
  const presets = useMemo(
    () => (params ? presetsFor(params.originProvince, cc) : []),
    [params?.originProvince, cc],
  );

  if (!params) return null;

  return (
    <div className="pb-8">
      <div className="px-5 pt-6">
        <h2 className="type-title text-foreground">{t("trip.form.title")}</h2>
        <p className="mt-1 text-sm text-muted">{t("trip.form.subtitle")}</p>
      </div>

      {presets.length > 0 && (
        <Section index={0} title={t("trip.form.presets")}>
          <div className="flex flex-col gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() =>
                  generate({
                    originProvince: preset.provinceSlug,
                    days: preset.days,
                    style: preset.style,
                    pace: preset.pace,
                    pinned: preset.pinned,
                  })
                }
                className="group flex items-center gap-2 rounded-[var(--radius-md)] border border-border px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-surface-2"
              >
                <Route size={15} className="shrink-0 text-primary" />
                <span className="flex-1 truncate">{t(preset.labelKey)}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section index={1} title={t("trip.form.days")}>
        <div className="flex flex-wrap gap-1.5">
          {DAY_CHOICES.map((d) => (
            <Chip key={d} active={params.days === d} onClick={() => setParams({ days: d })}>
              {t("trip.form.dayCount", { count: d })}
            </Chip>
          ))}
        </div>
      </Section>

      <Section index={2} title={t("trip.form.style")}>
        <div className="flex flex-wrap gap-1.5">
          {STYLES.map((s) => (
            <Chip key={s} active={params.style === s} onClick={() => setParams({ style: s })}>
              {t(`trip.style.${s}`)}
            </Chip>
          ))}
        </div>
      </Section>

      <Section index={3} title={t("trip.form.pace")}>
        <div className="flex flex-wrap gap-1.5">
          {PACES.map((p) => (
            <Chip key={p} active={params.pace === p} onClick={() => setParams({ pace: p })}>
              {t(`trip.pace.${p}`)}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Sticky because this CTA is mandatory and singular, unlike DestinationPanel's optional
          action row. The live summary above it is what tells the traveller what they just built. */}
      <div className="sticky bottom-0 border-t border-border bg-surface/95 px-5 py-3 pb-safe backdrop-blur">
        <p className="mb-2 text-xs text-muted">
          {t("trip.form.summary", {
            days: t("trip.form.dayCount", { count: params.days }),
            style: t(`trip.style.${params.style}`),
            pace: t(`trip.pace.${params.pace}`),
          })}
        </p>
        <Button variant="primary" className="w-full" onClick={() => generate()}>
          <Route size={18} />
          {t("trip.form.generate")}
        </Button>
      </div>
    </div>
  );
}
