// Aggregates per-locale living-calendar translations (seasonal / flower / festival) into
// key-indexed maps. UNLIKE the destination/dish overlays (which live in D1 and are merged by the
// Worker), living data is small, dev-authored and read SYNCHRONOUSLY in hot paths (computeHeartbeat
// runs per-marker), so its translations are bundled client-side and resolved in-process by
// src/lib/living/livingI18n.ts. Vietnamese is the base/fallback and is NOT stored here.
//
// Keys: seasonal/flower = `${month}:${destinationId}`, festival = festival id.
// To add a language: add its seasonal/flower/festival.<locale>.ts and extend the maps below.
import type {
  ContentLocale,
  SeasonalI18n, SeasonalTranslation,
  FlowerI18n, FlowerTranslation,
  FestivalI18n, FestivalTranslation,
} from "@/lib/types";

import { seasonal as seasonalEn } from "./seasonal.en.ts";
import { seasonal as seasonalKo } from "./seasonal.ko.ts";
import { seasonal as seasonalJa } from "./seasonal.ja.ts";
import { seasonal as seasonalZh } from "./seasonal.zh.ts";
import { flower as flowerEn } from "./flower.en.ts";
import { flower as flowerKo } from "./flower.ko.ts";
import { flower as flowerJa } from "./flower.ja.ts";
import { flower as flowerZh } from "./flower.zh.ts";
import { festival as festivalEn } from "./festival.en.ts";
import { festival as festivalKo } from "./festival.ko.ts";
import { festival as festivalJa } from "./festival.ja.ts";
import { festival as festivalZh } from "./festival.zh.ts";

const seasonalByLocale: Record<ContentLocale, Record<string, SeasonalTranslation>> = {
  en: seasonalEn, ko: seasonalKo, ja: seasonalJa, zh: seasonalZh,
};
const flowerByLocale: Record<ContentLocale, Record<string, FlowerTranslation>> = {
  en: flowerEn, ko: flowerKo, ja: flowerJa, zh: flowerZh,
};
const festivalByLocale: Record<ContentLocale, Record<string, FestivalTranslation>> = {
  en: festivalEn, ko: festivalKo, ja: festivalJa, zh: festivalZh,
};

export const seasonalI18n: Record<string, SeasonalI18n> = {};
export const flowerI18n: Record<string, FlowerI18n> = {};
export const festivalI18n: Record<string, FestivalI18n> = {};

for (const locale of Object.keys(seasonalByLocale) as ContentLocale[]) {
  for (const [key, tr] of Object.entries(seasonalByLocale[locale])) {
    (seasonalI18n[key] ??= {})[locale] = tr;
  }
  for (const [key, tr] of Object.entries(flowerByLocale[locale])) {
    (flowerI18n[key] ??= {})[locale] = tr;
  }
  for (const [id, tr] of Object.entries(festivalByLocale[locale])) {
    (festivalI18n[id] ??= {})[locale] = tr;
  }
}
