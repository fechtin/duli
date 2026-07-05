import { apiGet } from "./client";
import { getStoredLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Dish, DishWithRestaurants } from "@/lib/types";

// Food Explorer content (Bible 026) — read-only, heavily cached at the edge.
// Caches are keyed per-locale so switching language refetches translated content.

/** `?locale=` query, omitted for Vietnamese (the base/source language). */
const localeQuery = (locale: Locale) => (locale !== "vi" ? `?locale=${locale}` : "");

const dishesCache = new Map<Locale, Promise<Dish[]>>();
const dishCache = new Map<string, Promise<DishWithRestaurants | null>>();

/** All dishes (light list — powers specialties sections, search, passport progress). */
export function fetchDishes(locale: Locale = getStoredLocale()): Promise<Dish[]> {
  let p = dishesCache.get(locale);
  if (!p) {
    p = apiGet<Dish[]>(`/food/dishes${localeQuery(locale)}`).catch(() => []);
    dishesCache.set(locale, p);
  }
  return p;
}

export async function fetchDishesForProvince(
  slug: string,
  locale: Locale = getStoredLocale(),
): Promise<Dish[]> {
  return (await fetchDishes(locale)).filter((d) => d.provinceSlugs.includes(slug));
}

export function fetchDish(
  id: string,
  locale: Locale = getStoredLocale(),
): Promise<DishWithRestaurants | null> {
  const key = `${locale}:${id}`;
  let p = dishCache.get(key);
  if (!p) {
    p = apiGet<DishWithRestaurants>(`/food/dish/${id}${localeQuery(locale)}`).catch(() => null);
    dishCache.set(key, p);
  }
  return p;
}
