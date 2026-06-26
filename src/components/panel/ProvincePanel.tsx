import { MapPin, ChevronRight, Utensils } from "lucide-react";
import { fetchProvinceBundle, getProvinceMeta } from "@/lib/api/content";
import { useAsync } from "@/lib/utils/useAsync";
import { useMapStore } from "@/lib/store/useMapStore";
import { useI18n, useT } from "@/lib/i18n";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Chip } from "@/components/ui/Chip";
import { Skeleton } from "@/components/ui/Skeleton";
import { markerIcon } from "@/components/map/markerIcons";
import { AISummary } from "./AISummary";
import { Section, Divider } from "./primitives";

export function ProvincePanel({ slug }: { slug: string }) {
  const t = useT();
  const { locale } = useI18n();
  const meta = getProvinceMeta(slug);
  const { data: bundle, loading } = useAsync(() => fetchProvinceBundle(slug), [slug]);
  const selectDestination = useMapStore((s) => s.selectDestination);

  if (!meta) return null;
  const content = bundle?.content ?? null;
  const destinations = bundle?.destinations ?? [];

  return (
    <div>
      <div className="relative">
        <IllustratedImage seed={`province-${slug}`} ratio="16/9" rounded={false} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 pt-12">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-white/85">
            <MapPin size={13} />
            {meta.regionName}
          </div>
          <h2 className="font-display text-2xl font-bold text-white">{meta.name}</h2>
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

          <Section index={2} title={t("panel.story")}>
            <p className="text-sm leading-relaxed text-foreground/85">{content.story}</p>
          </Section>

          {content.specialties.length > 0 && (
            <Section index={3} title={t("panel.specialties")}>
              <div className="flex flex-wrap gap-1.5">
                {content.specialties.map((s) => (
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
                  <button
                    key={d.id}
                    onClick={() => {
                      selectDestination(d.id, slug);
                      useMapStore.getState().requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
                    }}
                    className="group flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <IllustratedImage seed={d.gallery[0]?.seed ?? d.id} ratio="1/1" className="w-16 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className="text-primary" />
                        <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted">{d.summary}</p>
                    </div>
                    <ChevronRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" />
                  </button>
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
