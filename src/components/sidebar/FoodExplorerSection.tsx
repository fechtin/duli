import { useEffect, useState } from "react";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { AppLink } from "@/components/ui/AppLink";
import { dishPath, foodPath } from "@/lib/seo/urls";
import { fetchDishes } from "@/lib/api/food";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useUIStore } from "@/lib/store/useUIStore";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useI18n, useT } from "@/lib/i18n";
import type { Dish } from "@/lib/types";
import { SectionTitle } from "./primitives";

/** Food Explorer — a few flagship dishes as image-led cards (027 §Food Explorer). */
export function FoodExplorerSection() {
  const { locale } = useI18n();
  const t = useT();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const openDish = useFoodStore((s) => s.openDish);
  const openFoodList = useFoodStore((s) => s.openList);
  const closeDish = useFoodStore((s) => s.closeDish);
  const closeMobile = useUIStore((s) => s.setSidebarMobileOpen);
  const country = useCountryStore((s) => s.country);

  useEffect(() => {
    let alive = true;
    fetchDishes(locale, country).then((all) => {
      const featured = all.filter((d) => d.featured);
      const pick = (featured.length >= 4 ? featured : [...featured, ...all]).slice(0, 4);
      if (alive) setDishes(pick);
    });
    return () => {
      alive = false;
    };
  }, [locale, country]);

  if (dishes.length === 0) return null;

  const open = (id: string) => {
    openDish(id);
    closeMobile(false);
  };

  return (
    <section id="sb-food">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle icon={<UtensilsCrossed size={12} />}>{t("nav.food")}</SectionTitle>
        {/* Was `setSearchOpen(true)` — a food control that opened a search box whose empty state
            lists destinations. An anchor to the real index also puts the page in the link graph. */}
        <AppLink
          to={foodPath(country)}
          onNavigate={() => {
            // "The index, and nothing on top of it" — said here rather than inside `openList`,
            // which must leave the dish layer to the URL. See useFoodStore.openList.
            closeDish();
            openFoodList();
            closeMobile(false);
          }}
          className="flex items-center gap-1 text-[11px] font-semibold text-[color:var(--sb-text-dim)] transition-colors hover:text-[color:var(--sb-gold)]"
        >
          {t("sidebar.viewAll")} <ArrowRight size={12} />
        </AppLink>
      </div>
      <div className="flex flex-col gap-2">
        {dishes.map((d) => (
          <AppLink
            key={d.id}
            to={dishPath(country, d.id)}
            onNavigate={() => open(d.id)}
            className="group flex items-center gap-3 overflow-hidden rounded-[18px] border border-[var(--sb-border)] bg-[var(--sb-surface)] p-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--sb-hover)] hover:shadow-[var(--sb-shadow-hover)]"
          >
            <div className="h-[60px] w-[80px] shrink-0 overflow-hidden rounded-[12px]">
              <IllustratedImage
                seed={`dish-${d.id}`}
                ratio="4/3"
                rounded={false}
                credit={false}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14px] font-semibold text-[color:var(--sb-text)]">
                {d.emoji} {d.name}
              </p>
              <p className="mt-0.5 truncate text-[11.5px] text-[color:var(--sb-text-dim)]">{d.summary}</p>
            </div>
          </AppLink>
        ))}
      </div>
    </section>
  );
}
