import { apiGet } from "./client";
import type { Dish, DishWithRestaurants } from "@/lib/types";

// Food Explorer content (Bible 026) — read-only, heavily cached at the edge.

let allDishes: Promise<Dish[]> | null = null;
const dishCache = new Map<string, Promise<DishWithRestaurants | null>>();

/** All dishes (light list — powers specialties sections, search, passport progress). */
export function fetchDishes(): Promise<Dish[]> {
  if (!allDishes) allDishes = apiGet<Dish[]>("/food/dishes").catch(() => []);
  return allDishes;
}

export async function fetchDishesForProvince(slug: string): Promise<Dish[]> {
  return (await fetchDishes()).filter((d) => d.provinceSlugs.includes(slug));
}

export function fetchDish(id: string): Promise<DishWithRestaurants | null> {
  let p = dishCache.get(id);
  if (!p) {
    p = apiGet<DishWithRestaurants>(`/food/dish/${id}`).catch(() => null);
    dishCache.set(id, p);
  }
  return p;
}
