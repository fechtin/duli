import { useEffect } from "react";
import { Check, Clock, MapPin, Sparkles, UtensilsCrossed, Wallet } from "lucide-react";
import { getProvinceMeta } from "@/lib/api/content";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { useT, useI18n } from "@/lib/i18n";
import { useCountryName } from "@/lib/country/useCountryName";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapLinks } from "@/components/ui/MapLinks";
import { cn } from "@/lib/utils/cn";
import { Section, Divider, InfoRow } from "./primitives";
import type { Restaurant, RestaurantLabel } from "@/lib/types";

// 026 §Restaurant Categories — label chip styles; text comes from the i18n dictionary.
const LABEL_STYLE: Record<RestaurantLabel, string> = {
  "ai-pick":        "bg-primary-soft text-primary",
  "local-favorite": "bg-accent/15 text-accent",
  "atlas-pick":     "bg-secondary/15 text-secondary",
  "street-food":    "bg-surface-2 text-muted",
  "fine-dining":    "bg-lotus/15 text-lotus",
  "family":         "bg-success/15 text-success",
};
const LABEL_KEY: Record<RestaurantLabel, string> = {
  "ai-pick": "restaurant.label.aiPick",
  "local-favorite": "restaurant.label.localFavorite",
  "atlas-pick": "restaurant.label.atlasPick",
  "street-food": "restaurant.label.streetFood",
  "fine-dining": "restaurant.label.fineDining",
  "family": "restaurant.label.family",
};

/** Dish page (026 §Dish Page) — story-first, then top restaurants with explained picks. */
export function DishPanel() {
  const t = useT();
  const { locale } = useI18n();
  const { country: countryName } = useCountryName();
  const dish = useFoodStore((s) => s.dish);
  const loading = useFoodStore((s) => s.loading);
  const openDishId = useFoodStore((s) => s.openDishId);
  const openDish = useFoodStore((s) => s.openDish);
  const tasted = usePassportStore((s) => s.tasted);
  const toggleTasted = usePassportStore((s) => s.toggleTasted);

  // Refetch the open dish in the new language when the user switches locale.
  useEffect(() => {
    if (openDishId) openDish(openDishId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  if (loading || !dish)
    return (
      <div className="space-y-3 p-5">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );

  const origin = getProvinceMeta(dish.originProvince);
  const isTasted = tasted.some((d) => d.id === dish.id);

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        <IllustratedImage seed={`dish-${dish.id}`} ratio="4/3" rounded={false} className="md:rounded-none" />
        <div
          className="absolute inset-x-0 bottom-0 p-5 pt-16"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 45%, rgba(0,0,0,0.12) 75%, transparent 100%)",
          }}
        >
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/85">
            <UtensilsCrossed size={13} />
            {t("dish.specialtyOf", { place: origin ? origin.name : countryName })}
          </div>
          {/* `?dish=` is its own canonical URL, so the dish is this page's subject — see
              DestinationPanel for why the atlas rendered no <h1> at all before 040. */}
          <h1 className="type-display text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
            {dish.emoji} {dish.name}
          </h1>
        </div>
      </div>

      {/* Summary + taste check */}
      <Section index={0}>
        <p className="text-[15px] leading-relaxed text-foreground/90">{dish.summary}</p>
        <button
          onClick={() => toggleTasted(dish.id)}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[13px] font-semibold transition-colors",
            isTasted
              ? "bg-success/15 text-success"
              : "bg-primary text-primary-foreground shadow-[var(--shadow-e1)] hover:opacity-90",
          )}
        >
          <Check size={16} />
          {isTasted ? t("dish.tasted") : t("dish.markTasted")}
        </button>
      </Section>

      {/* Story */}
      <Section index={1} title={t("dish.storyTitle")}>
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{dish.story}</p>
      </Section>

      <Divider />

      {/* Facts */}
      <Section index={2} title={t("dish.flavorIngredients")}>
        <div>
          <InfoRow label={t("dish.flavor")} value={dish.flavor} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dish.ingredients.map((ing) => (
            <span key={ing} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
              {ing}
            </span>
          ))}
        </div>
      </Section>

      <Divider />

      {/* When to eat — its own section */}
      <Section index={3} title={t("dish.bestTime")}>
        <p className="text-sm font-medium text-foreground">{dish.bestTime}</p>
      </Section>

      <Divider />

      {/* Top restaurants (026 §Restaurant Card + §AI Recommendation) */}
      <Section index={4} title={t("dish.whereToEat")}>
        <div className="flex flex-col gap-3">
          {dish.restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} t={t} />
          ))}
          {dish.restaurants.length === 0 && (
            <p className="text-sm text-muted">{t("dish.noRestaurants")}</p>
          )}
        </div>
      </Section>
    </div>
  );
}

function RestaurantCard({ restaurant: r, t }: { restaurant: Restaurant; t: (k: string, p?: Record<string, string | number>) => string }) {
  const requestFocus = useMapStore((s) => s.requestFocus);
  const province = getProvinceMeta(r.provinceSlug);
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-3.5 shadow-[var(--shadow-e1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {r.address}
            {province ? ` · ${province.name}` : ""}
          </p>
        </div>
        {/* Atlas Score (026 §Atlas Score — our own number, not Google's) */}
        <div
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary"
          title={t("panel.atlasScore")}
        >
          {Math.round(r.atlasScore)}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {r.labels.map((l) => (
          <span key={l} className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", LABEL_STYLE[l])}>
            {t(LABEL_KEY[l])}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1"><Wallet size={12} /> {r.priceRange}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {r.openHours}</span>
      </div>

      {/* Every pick explains itself (026 §AI Recommendation) */}
      {r.reasons.length > 0 && (
        <div className="mt-2.5 rounded-[var(--radius-md)] bg-primary-soft px-3 py-2.5">
          <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Sparkles size={12} /> {t("dish.whyForYou")}
          </p>
          <ul className="space-y-0.5">
            {r.reasons.map((reason) => (
              <li key={reason} className="flex gap-1.5 text-[12px] leading-relaxed text-foreground/80">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => requestFocus({ kind: "point", lng: r.lng, lat: r.lat, zoom: 8 })}
        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2"
      >
        <MapPin size={13} />
        {t("dish.viewOnMap")}
      </button>

      {/* Directions out to the user's own map app */}
      <MapLinks place={{ name: r.name, lng: r.lng, lat: r.lat }} size="sm" className="mt-2" />
    </div>
  );
}
