// Korea atlas editorial translations, aggregated the same way as the Vietnam ones
// (src/data/i18n/index.ts): per-(province, locale) buckets → id/slug-keyed maps that the D1 seed
// builder writes into the `i18n` JSON column. The Worker overlays them on the Vietnamese base.
//
// Build-time only. Locales still missing for a province simply fall back to Vietnamese.
import type {
  ContentLocale,
  DestinationI18n,
  DestinationTranslation,
  ProvinceI18n,
  ProvinceTranslation,
} from "@/lib/types";
import { provinceNames, provinceSlugs } from "../../i18n/province-names.ts";

import * as seoulEn from "./seoul.en.ts";
import * as incheonEn from "./incheon.en.ts";
import * as gyeonggiEn from "./gyeonggi.en.ts";
import * as gangwonEn from "./gangwon.en.ts";
import * as chungbukEn from "./chungbuk.en.ts";
import * as chungnamEn from "./chungnam.en.ts";
import * as daejeonEn from "./daejeon.en.ts";
import * as sejongEn from "./sejong.en.ts";
import * as jeonbukEn from "./jeonbuk.en.ts";
import * as jeonnamEn from "./jeonnam.en.ts";
import * as gwangjuEn from "./gwangju.en.ts";
import * as gyeongbukEn from "./gyeongbuk.en.ts";
import * as daeguEn from "./daegu.en.ts";
import * as gyeongnamEn from "./gyeongnam.en.ts";
import * as busanEn from "./busan.en.ts";
import * as ulsanEn from "./ulsan.en.ts";
import * as jejuEn from "./jeju.en.ts";

import * as seoulKo from "./seoul.ko.ts";
import * as incheonKo from "./incheon.ko.ts";
import * as gyeonggiKo from "./gyeonggi.ko.ts";
import * as gangwonKo from "./gangwon.ko.ts";
import * as chungbukKo from "./chungbuk.ko.ts";
import * as chungnamKo from "./chungnam.ko.ts";
import * as daejeonKo from "./daejeon.ko.ts";
import * as sejongKo from "./sejong.ko.ts";
import * as jeonbukKo from "./jeonbuk.ko.ts";
import * as jeonnamKo from "./jeonnam.ko.ts";
import * as gwangjuKo from "./gwangju.ko.ts";
import * as gyeongbukKo from "./gyeongbuk.ko.ts";
import * as daeguKo from "./daegu.ko.ts";
import * as gyeongnamKo from "./gyeongnam.ko.ts";
import * as busanKo from "./busan.ko.ts";
import * as ulsanKo from "./ulsan.ko.ts";
import * as jejuKo from "./jeju.ko.ts";

import * as seoulJa from "./seoul.ja.ts";
import * as incheonJa from "./incheon.ja.ts";
import * as gyeonggiJa from "./gyeonggi.ja.ts";
import * as gangwonJa from "./gangwon.ja.ts";
import * as chungbukJa from "./chungbuk.ja.ts";
import * as chungnamJa from "./chungnam.ja.ts";
import * as daejeonJa from "./daejeon.ja.ts";
import * as sejongJa from "./sejong.ja.ts";
import * as jeonbukJa from "./jeonbuk.ja.ts";
import * as jeonnamJa from "./jeonnam.ja.ts";
import * as gwangjuJa from "./gwangju.ja.ts";
import * as gyeongbukJa from "./gyeongbuk.ja.ts";
import * as daeguJa from "./daegu.ja.ts";
import * as gyeongnamJa from "./gyeongnam.ja.ts";
import * as busanJa from "./busan.ja.ts";
import * as ulsanJa from "./ulsan.ja.ts";
import * as jejuJa from "./jeju.ja.ts";

import * as seoulZh from "./seoul.zh.ts";
import * as incheonZh from "./incheon.zh.ts";
import * as gyeonggiZh from "./gyeonggi.zh.ts";
import * as gangwonZh from "./gangwon.zh.ts";
import * as chungbukZh from "./chungbuk.zh.ts";
import * as chungnamZh from "./chungnam.zh.ts";
import * as daejeonZh from "./daejeon.zh.ts";
import * as sejongZh from "./sejong.zh.ts";
import * as jeonbukZh from "./jeonbuk.zh.ts";
import * as jeonnamZh from "./jeonnam.zh.ts";
import * as gwangjuZh from "./gwangju.zh.ts";
import * as gyeongbukZh from "./gyeongbuk.zh.ts";
import * as daeguZh from "./daegu.zh.ts";
import * as gyeongnamZh from "./gyeongnam.zh.ts";
import * as busanZh from "./busan.zh.ts";
import * as ulsanZh from "./ulsan.zh.ts";
import * as jejuZh from "./jeju.zh.ts";

interface BucketModule {
  destinations: Record<string, DestinationTranslation>;
  provinces: Record<string, ProvinceTranslation>;
}

const byLocale: Partial<Record<ContentLocale, BucketModule[]>> = {
  en: [seoulEn, incheonEn, gyeonggiEn, gangwonEn, chungbukEn, chungnamEn, daejeonEn, sejongEn, jeonbukEn, jeonnamEn, gwangjuEn, gyeongbukEn, daeguEn, gyeongnamEn, busanEn, ulsanEn, jejuEn],
  ko: [seoulKo, incheonKo, gyeonggiKo, gangwonKo, chungbukKo, chungnamKo, daejeonKo, sejongKo, jeonbukKo, jeonnamKo, gwangjuKo, gyeongbukKo, daeguKo, gyeongnamKo, busanKo, ulsanKo, jejuKo],
  ja: [seoulJa, incheonJa, gyeonggiJa, gangwonJa, chungbukJa, chungnamJa, daejeonJa, sejongJa, jeonbukJa, jeonnamJa, gwangjuJa, gyeongbukJa, daeguJa, gyeongnamJa, busanJa, ulsanJa, jejuJa],
  zh: [seoulZh, incheonZh, gyeonggiZh, gangwonZh, chungbukZh, chungnamZh, daejeonZh, sejongZh, jeonbukZh, jeonnamZh, gwangjuZh, gyeongbukZh, daeguZh, gyeongnamZh, busanZh, ulsanZh, jejuZh],
};

export const destinationI18nKr: Record<string, DestinationI18n> = {};
export const provinceI18nKr: Record<string, ProvinceI18n> = {};

for (const locale of Object.keys(byLocale) as ContentLocale[]) {
  for (const mod of byLocale[locale] ?? []) {
    for (const [id, tr] of Object.entries(mod.destinations)) {
      (destinationI18nKr[id] ??= {})[locale] = tr;
    }
    for (const [slug, tr] of Object.entries(mod.provinces)) {
      (provinceI18nKr[slug] ??= {})[locale] = tr;
    }
  }
}

// Province names come from the UI dictionary for both atlases — see src/data/i18n/province-names.
// Overwriting rather than filling a gap is deliberate: the dictionary is what the panel renders,
// so it is what the title above the panel has to say too.
for (const slug of provinceSlugs) {
  for (const [locale, name] of Object.entries(provinceNames(slug)) as [ContentLocale, string][]) {
    ((provinceI18nKr[slug] ??= {})[locale] ??= {}).name = name;
  }
}

// ── Food Explorer translations ────────────────────────────────
import type { DishI18n, DishTranslation } from "@/lib/types";
import { dishes as dishesEnKr } from "./dishes.en.ts";
import { dishes as dishesKoKr } from "./dishes.ko.ts";
import { dishes as dishesJaKr } from "./dishes.ja.ts";
import { dishes as dishesZhKr } from "./dishes.zh.ts";

const dishesByLocaleKr: Record<ContentLocale, Record<string, DishTranslation>> = {
  en: dishesEnKr,
  ko: dishesKoKr,
  ja: dishesJaKr,
  zh: dishesZhKr,
};

export const dishI18nKr: Record<string, DishI18n> = {};
for (const locale of Object.keys(dishesByLocaleKr) as ContentLocale[]) {
  for (const [id, tr] of Object.entries(dishesByLocaleKr[locale])) {
    (dishI18nKr[id] ??= {})[locale] = tr;
  }
}

export { restaurantI18nKr } from "./restaurants.ts";
