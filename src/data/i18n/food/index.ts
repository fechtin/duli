// Aggregates per-locale Food translations (dishes + restaurants) into id-keyed maps consumed
// by the D1 seed builder (scripts/build-d1-seed.mjs), which writes them to the `i18n` JSON
// column on the dishes/restaurants tables. The Worker overlays them onto the Vietnamese base
// at read time (worker/db.ts). Build-time only — the client never imports this.
//
// To add a language: add its dishes.<locale>.ts / restaurants.<locale>.ts and extend the maps.
import type {
  ContentLocale, DishI18n, DishTranslation, RestaurantI18n, RestaurantTranslation,
} from "@/lib/types";

import { dishes as dishesEn } from "./dishes.en.ts";
import { dishes as dishesKo } from "./dishes.ko.ts";
import { dishes as dishesJa } from "./dishes.ja.ts";
import { dishes as dishesZh } from "./dishes.zh.ts";
import { restaurants as restEn } from "./restaurants.en.ts";
import { restaurants as restKo } from "./restaurants.ko.ts";
import { restaurants as restJa } from "./restaurants.ja.ts";
import { restaurants as restZh } from "./restaurants.zh.ts";

const dishesByLocale: Record<ContentLocale, Record<string, DishTranslation>> = {
  en: dishesEn, ko: dishesKo, ja: dishesJa, zh: dishesZh,
};
const restByLocale: Record<ContentLocale, Record<string, RestaurantTranslation>> = {
  en: restEn, ko: restKo, ja: restJa, zh: restZh,
};

export const dishI18n: Record<string, DishI18n> = {};
export const restaurantI18n: Record<string, RestaurantI18n> = {};

for (const locale of Object.keys(dishesByLocale) as ContentLocale[]) {
  for (const [id, tr] of Object.entries(dishesByLocale[locale])) {
    (dishI18n[id] ??= {})[locale] = tr;
  }
  for (const [id, tr] of Object.entries(restByLocale[locale])) {
    (restaurantI18n[id] ??= {})[locale] = tr;
  }
}
