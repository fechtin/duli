import { useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import { getProvinceMeta } from "@/lib/api/content";
import { fetchDishes } from "@/lib/api/food";
import { useAsync } from "@/lib/utils/useAsync";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useI18n, useT } from "@/lib/i18n";
import { useCountryName } from "@/lib/country/useCountryName";
import { AppLink } from "@/components/ui/AppLink";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { dishPath } from "@/lib/seo/urls";
import { getRegions } from "@/lib/api/content";
import type { CountryCode, Dish, RegionId } from "@/lib/types";

/**
 * The cuisine index (`/{cc}/food`) — every dish in the atlas, grouped by region.
 *
 * This page exists because the sidebar's "view all" had nowhere to go: dishes are an overlay
 * (`?dish=…`) with no listing of their own, so the control opened the search box instead, whose
 * empty state lists destinations rather than food. Grouping by region rather than showing one
 * flat run of ninety cards is what makes the list readable — and it is how the atlas already
 * asks a reader to think about the country.
 */
export function FoodListPanel() {
  const t = useT();
  const { locale } = useI18n();
  const country = useCountryStore((s) => s.country);
  const { country: countryName } = useCountryName();
  const openDish = useFoodStore((s) => s.openDish);
  const closeMobile = useUIStore((s) => s.setSidebarMobileOpen);

  const { data: dishes, loading } = useAsync(() => fetchDishes(locale, country), [locale, country]);

  // Region order comes from the atlas itself (north → south), never from Object.keys order.
  const groups = useMemo(() => groupByRegion(dishes ?? [], country), [dishes, country]);

  if (loading || !dishes) {
    return (
      <div className="space-y-4 p-5">
        <Skeleton className="h-7 w-1/2" />
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[76px] w-full" />
        ))}
      </div>
    );
  }

  const open = (id: string) => {
    openDish(id);
    closeMobile(false);
  };

  return (
    <div className="px-5 pb-8 pt-6">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
        <UtensilsCrossed size={13} />
        {countryName}
      </div>
      {/* `/{cc}/food` is its own indexable URL, so this page owns the <h1> — see 040. */}
      <h1 className="type-display text-foreground">{t("seo.cuisine")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {t("seo.cuisineDesc", { count: dishes.length, country: countryName })}
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {groups.map(({ key, labelKey, dishes: list }) => (
          <section key={key}>
            <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint">
              {t(labelKey)} · {list.length}
            </h2>
            <div className="flex flex-col gap-2">
              {list.map((d) => (
                <DishRow key={d.id} dish={d} country={country} onOpen={() => open(d.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function DishRow({ dish, country, onOpen }: { dish: Dish; country: CountryCode; onOpen: () => void }) {
  const origin = getProvinceMeta(dish.originProvince, country);
  return (
    <AppLink
      to={dishPath(country, dish.id)}
      onNavigate={onOpen}
      className="group flex items-center gap-3 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface p-2 text-left transition-colors hover:bg-surface-2"
    >
      <div className="h-[62px] w-[82px] shrink-0 overflow-hidden rounded-[var(--radius-md)]">
        <IllustratedImage
          seed={`dish-${dish.id}`}
          ratio="4/3"
          rounded={false}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {dish.emoji} {dish.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{dish.summary}</p>
        {origin && <p className="mt-0.5 truncate text-[11px] text-faint">{origin.name}</p>}
      </div>
    </AppLink>
  );
}

interface DishGroup {
  key: string;
  /** Dictionary key for the heading — region names live in the UI dictionary, never in the data. */
  labelKey: string;
  dishes: Dish[];
}

/**
 * Bucket dishes by the region of their origin province, in the atlas's own north → south order.
 *
 * A dish whose origin province doesn't resolve would silently vanish from a filter-per-region
 * pass, so unmatched ones get their own trailing group instead of being dropped — a missing
 * card on a page whose whole job is "all of them" is the one bug worth guarding against here.
 */
function groupByRegion(dishes: Dish[], cc: CountryCode): DishGroup[] {
  const byRegion = new Map<RegionId, Dish[]>();
  const orphans: Dish[] = [];

  for (const d of dishes) {
    const region = getProvinceMeta(d.originProvince, cc)?.regionId;
    if (!region) {
      orphans.push(d);
      continue;
    }
    const list = byRegion.get(region);
    if (list) list.push(d);
    else byRegion.set(region, [d]);
  }

  const groups: DishGroup[] = getRegions(cc)
    .filter((r) => byRegion.has(r.id))
    .map((r) => ({ key: r.id, labelKey: `region.${r.id}`, dishes: byRegion.get(r.id)! }));

  if (orphans.length) groups.push({ key: "other", labelKey: "food.indexOther", dishes: orphans });
  return groups;
}
