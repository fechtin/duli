import { Check, Clock, MapPin, Sparkles, UtensilsCrossed, Wallet } from "lucide-react";
import { getProvinceMeta } from "@/lib/api/content";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { usePassportStore } from "@/lib/store/usePassportStore";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";
import { Section, Divider, InfoRow } from "./primitives";
import type { Restaurant, RestaurantLabel } from "@/lib/types";

// 026 §Restaurant Categories — label chips (VI-first like the passport surfaces).
const LABEL_META: Record<RestaurantLabel, { text: string; className: string }> = {
  "ai-pick":        { text: "AI Pick",            className: "bg-primary-soft text-primary" },
  "local-favorite": { text: "Người địa phương mê", className: "bg-accent/15 text-accent" },
  "atlas-pick":     { text: "Atlas chọn",          className: "bg-secondary/15 text-secondary" },
  "street-food":    { text: "Vỉa hè",              className: "bg-surface-2 text-muted" },
  "fine-dining":    { text: "Cao cấp",             className: "bg-lotus/15 text-lotus" },
  "family":         { text: "Gia đình",            className: "bg-success/15 text-success" },
};

/** Dish page (026 §Dish Page) — story-first, then top restaurants with explained picks. */
export function DishPanel() {
  const dish = useFoodStore((s) => s.dish);
  const loading = useFoodStore((s) => s.loading);
  const tasted = usePassportStore((s) => s.tastedDishes);
  const toggleTasted = usePassportStore((s) => s.toggleTasted);

  if (loading || !dish)
    return (
      <div className="space-y-3 p-5">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-20 w-full" />
      </div>
    );

  const origin = getProvinceMeta(dish.originProvince);
  const isTasted = tasted.includes(dish.id);

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
            Đặc sản {origin ? origin.name : "Việt Nam"}
          </div>
          <h2 className="type-display text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.35)]">
            {dish.emoji} {dish.name}
          </h2>
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
          {isTasted ? "Đã thưởng thức — lưu trong Passport" : "Tôi đã thưởng thức món này"}
        </button>
      </Section>

      {/* Story */}
      <Section index={1} title="Câu chuyện">
        <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{dish.story}</p>
      </Section>

      <Divider />

      {/* Facts */}
      <Section index={2} title="Hương vị & thành phần">
        <InfoRow label="Hương vị" value={dish.flavor} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dish.ingredients.map((ing) => (
            <span key={ing} className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
              {ing}
            </span>
          ))}
        </div>
        <div className="mt-3">
          <InfoRow label="Nên ăn lúc" value={dish.bestTime} />
        </div>
      </Section>

      <Divider />

      {/* Top restaurants (026 §Restaurant Card + §AI Recommendation) */}
      <Section index={3} title="Ăn ở đâu ngon nhất">
        <div className="flex flex-col gap-3">
          {dish.restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
          {dish.restaurants.length === 0 && (
            <p className="text-sm text-muted">Chưa có gợi ý quán cho món này.</p>
          )}
        </div>
      </Section>
    </div>
  );
}

function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
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
          title="Atlas Score"
        >
          {Math.round(r.atlasScore)}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {r.labels.map((l) => (
          <span key={l} className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-semibold", LABEL_META[l].className)}>
            {LABEL_META[l].text}
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
            <Sparkles size={12} /> Phù hợp với bạn vì
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
        Xem trên bản đồ
      </button>
    </div>
  );
}
