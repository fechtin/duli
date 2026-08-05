import { apiGet } from "./client";
import { getStoredLocale } from "@/lib/i18n";
import { activeCountry } from "@/lib/store/useCountryStore";
import type { Locale } from "@/lib/i18n";
import type { CountryCode, Dish, DishWithRestaurants } from "@/lib/types";

// Food Explorer content (Bible 026) — read-only, heavily cached at the edge.
// Caches are keyed per country + locale so switching either refetches.

/** Query string: country (omitted for the default atlas) + locale (omitted for the base vi). */
function query(locale: Locale, cc: CountryCode): string {
  const parts: string[] = [];
  if (cc !== "vn") parts.push(`country=${cc}`);
  if (locale !== "vi") parts.push(`locale=${locale}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

const dishesCache = new Map<string, Promise<Dish[]>>();
const dishCache = new Map<string, Promise<DishWithRestaurants | null>>();

/** All dishes (light list — powers specialties sections, search, passport progress). */
export function fetchDishes(
  locale: Locale = getStoredLocale(),
  cc: CountryCode = activeCountry(),
): Promise<Dish[]> {
  const key = `${cc}:${locale}`;
  let p = dishesCache.get(key);
  if (!p) {
    p = apiGet<Dish[]>(`/food/dishes${query(locale, cc)}`).catch(() => []);
    dishesCache.set(key, p);
  }
  return p;
}

export async function fetchDishesForProvince(
  slug: string,
  locale: Locale = getStoredLocale(),
  cc: CountryCode = activeCountry(),
): Promise<Dish[]> {
  return (await fetchDishes(locale, cc)).filter((d) => d.provinceSlugs.includes(slug));
}

export function fetchDish(
  id: string,
  locale: Locale = getStoredLocale(),
  cc: CountryCode = activeCountry(),
): Promise<DishWithRestaurants | null> {
  const key = `${cc}:${locale}:${id}`;
  let p = dishCache.get(key);
  if (!p) {
    p = apiGet<DishWithRestaurants>(`/food/dish/${id}${query(locale, cc)}`).catch(() => null);
    dishCache.set(key, p);
  }
  return p;
}
