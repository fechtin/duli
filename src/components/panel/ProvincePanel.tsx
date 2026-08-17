import { MapPin, ChevronRight, Route, Utensils } from "lucide-react";
import { fetchProvinceBundle, getProvinceMeta } from "@/lib/api/content";
import { fetchDishesForProvince } from "@/lib/api/food";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useAsync } from "@/lib/utils/useAsync";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useTripStore } from "@/lib/store/useTripStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useI18n, useT } from "@/lib/i18n";
import { destinationPath, dishPath } from "@/lib/seo/urls";
import { IllustratedImage, firstPhotoSeed } from "@/components/ui/IllustratedImage";
import { heroSeedFor, thumbSeedFor } from "@/lib/media/gallery";
import { chipsBeforeJoin } from "@/lib/food/specialtyJoin";
import { AppLink } from "@/components/ui/AppLink";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { markerIcon } from "@/components/map/markerIcons";
import { AISummary } from "./AISummary";
import { Section, Divider } from "./primitives";

export function ProvincePanel({ slug }: { slug: string }) {
  const t = useT();
  const { locale } = useI18n();
  const meta = getProvinceMeta(slug);
  const { data: bundle, loading } = useAsync(() => fetchProvinceBundle(slug, locale), [slug, locale]);
  const country = useCountryStore((s) => s.country);
  const { data: dishes } = useAsync(
    () => fetchDishesForProvince(slug, locale, country),
    [slug, locale, country],
  );
  const selectDestination = useMapStore((s) => s.selectDestination);
  const openDish = useFoodStore((s) => s.openDish);
  const openTripForm = useTripStore((s) => s.openForm);

  if (!meta) return null;
  const content = bundle?.content ?? null;
  const destinations = bundle?.destinations ?? [];

  // Only the specialties with no dish card of their own — a chip repeating the card above it is
  // the card again in smaller type. The Worker settles which is which on the Vietnamese base
  // names, because no two locales write the pair the same way (src/lib/food/specialtyJoin.ts).
  // A cached bundle from before that join carries no answer; the shim there is the old guess, so
  // a stale response is never worse than what it used to be.
  const chips =
    content?.specialtiesWithoutDish ??
    chipsBeforeJoin(content?.specialties ?? [], dishes?.map((d) => d.name) ?? []);

  // No province ever had its own `province-<slug>` photo, so every one of these banners was an
  // illustrated gradient. Borrow the hero of the province's first photographed destination —
  // it is the same place, already credited, and costs nothing to fetch.
  const bannerSeed = firstPhotoSeed(
    `province-${slug}`,
    ...destinations.map((d) => heroSeedFor(d.id)),
  );

  return (
    <div>
      <div className="relative">
        <IllustratedImage seed={bannerSeed} ratio="16/9" rounded={false} />
        <div
          className="absolute inset-x-0 bottom-0 p-5 pt-16"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)",
          }}
        >
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/85">
            <MapPin size={13} />
            {t(`region.${meta.regionId}`)}
          </div>
          {/* Subject line of a province page — see DestinationPanel for why this is an <h1>. */}
          <h1 className="type-display text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
            {t(`province.${meta.slug}`)}
          </h1>
        </div>
      </div>

      {loading && (
        <div className="space-y-3 p-5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {content && (
        <>
          <Section index={0}>
            <p className="text-[15px] leading-relaxed text-foreground/90">{content.summary}</p>
          </Section>

          <Section index={1}>
            <AISummary context={{ locale, provinceSlug: slug, provinceName: meta.name, provinceBundle: bundle ?? undefined }} />
          </Section>

          {/* Primary action, at the mirror position of DestinationPanel's action row. A trip
              starts from wherever the traveller is already looking. */}
          <div className="flex gap-2 px-5 pb-1 pt-1">
            <Button variant="primary" className="flex-1" onClick={() => openTripForm(slug)}>
              <Route size={18} />
              {t("trip.cta")}
            </Button>
          </div>

          <Section index={2} title={t("panel.story")}>
            <p className="text-sm leading-relaxed text-foreground/85">{content.story}</p>
          </Section>

          {((dishes?.length ?? 0) > 0 || chips.length > 0) && (
            <Section index={3} title={t("panel.specialties")}>
              {/* Food Explorer dishes (026 §Entry Points — start from the DISH, not the restaurant) */}
              {(dishes?.length ?? 0) > 0 && (
                <div className="mb-2 flex flex-col gap-2">
                  {dishes!.map((d) => (
                    <AppLink
                      key={d.id}
                      to={dishPath(country, d.id)}
                      onNavigate={() => openDish(d.id)}
                      className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-2 text-left transition-colors hover:bg-surface-2"
                    >
                      <IllustratedImage seed={`dish-${d.id}`} ratio="1/1" className="w-14 shrink-0" credit={false} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {d.emoji} {d.name}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted">{d.summary}</p>
                      </div>
                      <ChevronRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                    </AppLink>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {chips.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs text-foreground/85">
                    <Utensils size={12} className="text-accent" />
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </>
      )}

      {destinations.length > 0 && (
        <>
          <Divider />
          <Section index={4} title={t("panel.destinations")}>
            <div className="flex flex-col gap-2">
              {destinations.map((d) => {
                const Icon = markerIcon(d.type);
                return (
                  <AppLink
                    key={d.id}
                    to={destinationPath(country, slug, d.slug)}
                    onNavigate={() => {
                      selectDestination(d.id, slug);
                      useMapStore.getState().requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
                    }}
                    className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <IllustratedImage seed={thumbSeedFor(d.id)} ratio="1/1" className="w-16 shrink-0" credit={false} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className="text-primary" />
                        <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">{d.summary}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                  </AppLink>
                );
              })}
            </div>
          </Section>
        </>
      )}

      <div className="flex flex-wrap gap-1.5 px-5 pb-8 pt-2">
        <Chip onClick={() => useMapStore.getState().reset()}>{t("map.reset")}</Chip>
      </div>
    </div>
  );
}
