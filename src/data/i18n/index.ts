// Aggregates per-(region,locale) editorial translations into id/slug-keyed maps consumed by
// the D1 seed builder (scripts/build-d1-seed.mjs), which writes them to the `i18n` JSON column.
// The Worker overlays these onto the Vietnamese base at read time (worker/db.ts).
//
// Build-time only — the client never imports this; localized content comes from the API.
// To add a language: add its bucket files under ./content and extend `byLocale` below.
import type { ContentLocale, DestinationI18n, DestinationTranslation, ProvinceI18n, ProvinceTranslation } from "@/lib/types";

import * as nmEn from "./content/northMountains.en.ts";
import * as nmKo from "./content/northMountains.ko.ts";
import * as nmJa from "./content/northMountains.ja.ts";
import * as nmZh from "./content/northMountains.zh.ts";
import * as rrdEn from "./content/redRiverDelta.en.ts";
import * as rrdKo from "./content/redRiverDelta.ko.ts";
import * as rrdJa from "./content/redRiverDelta.ja.ts";
import * as rrdZh from "./content/redRiverDelta.zh.ts";
import * as ncEn from "./content/northCentral.en.ts";
import * as ncKo from "./content/northCentral.ko.ts";
import * as ncJa from "./content/northCentral.ja.ts";
import * as ncZh from "./content/northCentral.zh.ts";
import * as schEn from "./content/southCentralHighlands.en.ts";
import * as schKo from "./content/southCentralHighlands.ko.ts";
import * as schJa from "./content/southCentralHighlands.ja.ts";
import * as schZh from "./content/southCentralHighlands.zh.ts";
import * as seEn from "./content/southeast.en.ts";
import * as seKo from "./content/southeast.ko.ts";
import * as seJa from "./content/southeast.ja.ts";
import * as seZh from "./content/southeast.zh.ts";
import * as mkEn from "./content/mekong.en.ts";
import * as mkKo from "./content/mekong.ko.ts";
import * as mkJa from "./content/mekong.ja.ts";
import * as mkZh from "./content/mekong.zh.ts";

interface BucketModule {
  destinations: Record<string, DestinationTranslation>;
  provinces: Record<string, ProvinceTranslation>;
}

const byLocale: Record<ContentLocale, BucketModule[]> = {
  en: [nmEn, rrdEn, ncEn, schEn, seEn, mkEn],
  ko: [nmKo, rrdKo, ncKo, schKo, seKo, mkKo],
  ja: [nmJa, rrdJa, ncJa, schJa, seJa, mkJa],
  zh: [nmZh, rrdZh, ncZh, schZh, seZh, mkZh],
};

export const destinationI18n: Record<string, DestinationI18n> = {};
export const provinceI18n: Record<string, ProvinceI18n> = {};

for (const locale of Object.keys(byLocale) as ContentLocale[]) {
  for (const mod of byLocale[locale]) {
    for (const [id, tr] of Object.entries(mod.destinations)) {
      (destinationI18n[id] ??= {})[locale] = tr;
    }
    for (const [slug, tr] of Object.entries(mod.provinces)) {
      (provinceI18n[slug] ??= {})[locale] = tr;
    }
  }
}
