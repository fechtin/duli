import { MapPin, Clock, Ticket, CalendarHeart, MessageCircle, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { fetchDestination, getProvinceMeta } from "@/lib/api/content";
import { useAsync } from "@/lib/utils/useAsync";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { useI18n, useT } from "@/lib/i18n";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AISummary } from "./AISummary";
import { Gallery } from "./Gallery";
import { Section, InfoRow, Divider } from "./primitives";

export function DestinationPanel({ id }: { id: string }) {
  const t = useT();
  const { locale } = useI18n();
  const { data: dest, loading } = useAsync(() => fetchDestination(id), [id]);
  const allDestinations = useContentStore((s) => s.destinations);
  const selectDestination = useMapStore((s) => s.selectDestination);
  const setAiOpen = useUIStore((s) => s.setAiOpen);
  const openCheckin = useUIStore((s) => s.openCheckin);
  const visited = usePassportStore((s) => s.checkins.some((c) => c.destinationId === id));

  if (loading)
    return (
      <div className="space-y-3 p-5">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  if (!dest) return null;
  const province = getProvinceMeta(dest.provinceSlug);
  const nearby = dest.nearby
    .map((nid) => allDestinations.find((x) => x.id === nid))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <div>
      {/* 1. Hero + 2. Name */}
      <div className="relative">
        <IllustratedImage seed={dest.gallery[0]?.seed ?? dest.id} ratio="4/3" rounded={false} className="md:rounded-none" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent p-5 pt-12">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/85">
            <MapPin size={13} />
            {province?.name} · {province?.regionName}
          </div>
          <h2 className="font-display text-2xl font-bold text-white">{dest.name}</h2>
        </div>
      </div>

      {/* badges */}
      {dest.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-4">
          {dest.badges.map((b) => (
            <Badge key={b} kind={b} />
          ))}
        </div>
      )}

      {/* 3. Summary */}
      <Section index={0}>
        <p className="text-[15px] leading-relaxed text-foreground/90">{dest.summary}</p>
      </Section>

      {/* 4. AI Summary */}
      <Section index={1}>
        <AISummary context={{ locale, destinationId: dest.id, provinceSlug: dest.provinceSlug, destinationName: dest.name, destination: dest }} />
      </Section>

      {/* Primary actions */}
      <div className="flex gap-2 px-5 pb-1">
        <Button onClick={() => openCheckin(dest.id)} className="flex-1" variant={visited ? "secondary" : "primary"}>
          {visited ? <CheckCircle2 size={18} /> : <CalendarHeart size={18} />}
          {t("panel.checkin")}
        </Button>
        <Button variant="secondary" onClick={() => setAiOpen(true)} aria-label={t("nav.guide")}>
          <MessageCircle size={18} />
        </Button>
      </div>

      {/* 5. Gallery */}
      <Section index={2} title={t("panel.gallery")}>
        <Gallery images={dest.gallery} />
      </Section>

      <Divider />

      {/* 6. Story */}
      <Section index={3} title={t("panel.story")}>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{dest.story}</p>
        {dest.facts.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {dest.facts.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Divider />

      {/* 7. Travel info */}
      <Section index={4} title={t("panel.travelInfo")}>
        <div>
          <InfoRow label={t("panel.bestTime")} value={dest.bestTime} />
          <InfoRow label={t("panel.duration")} value={dest.visitDuration} />
          <InfoRow label={t("panel.ticket")} value={dest.ticket || t("panel.free")} />
          <InfoRow label={t("panel.openHours")} value={dest.openingHours} />
        </div>
        {dest.travelTips.length > 0 && (
          <ul className="mt-3 space-y-2">
            {dest.travelTips.map((tip) => (
              <li key={tip} className="flex gap-2 rounded-[var(--radius-md)] bg-surface-2 p-2.5 text-sm text-foreground/85">
                <Clock size={15} className="mt-0.5 shrink-0 text-primary" />
                {tip}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* 8. Nearby */}
      {nearby.length > 0 && (
        <>
          <Divider />
          <Section index={5} title={t("panel.nearby")}>
            <div className="flex flex-col gap-2">
              {nearby.map((nb) => (
                <button
                  key={nb.id}
                  onClick={() => {
                    selectDestination(nb.id, nb.provinceSlug);
                    useMapStore.getState().requestFocus({ kind: "point", lng: nb.lng, lat: nb.lat, zoom: 7 });
                  }}
                  className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-2 text-left transition-colors hover:bg-surface-2"
                >
                  <IllustratedImage seed={nb.gallery[0]?.seed ?? nb.id} ratio="1/1" className="w-14 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{nb.name}</p>
                    <p className="truncate text-xs text-muted">{nb.summary}</p>
                  </div>
                </button>
              ))}
            </div>
          </Section>
        </>
      )}

      {/* 9. Ticket icon footer spacer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 px-5 pb-8 pt-2 text-xs text-faint">
        <Ticket size={13} /> {dest.tags.join(" · ")}
      </motion.div>
    </div>
  );
}
