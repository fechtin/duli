// Aggregates per-(region,locale) editorial translations into id/slug-keyed maps consumed by
// the D1 seed builder (scripts/build-d1-seed.mjs), which writes them to the `i18n` JSON column.
// The Worker overlays these onto the Vietnamese base at read time (worker/db.ts).
//
// Build-time only — the client never imports this; localized content comes from the API.
// To add a language: add its bucket files under ./content and extend `byLocale` below.
import type { ContentLocale, DestinationI18n, DestinationTranslation, ProvinceI18n, ProvinceTranslation } from "@/lib/types";
import { provinceNames, provinceSlugs } from "./province-names.ts";

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
// Depth pass (tasks/033) — one bucket per VnRegionId, added region by region.
import * as neEn from "./content/depth/northeast.en.ts";
import * as neKo from "./content/depth/northeast.ko.ts";
import * as neJa from "./content/depth/northeast.ja.ts";
import * as neZh from "./content/depth/northeast.zh.ts";
import * as rrdDEn from "./content/depth/redRiverDelta.en.ts";
import * as rrdDKo from "./content/depth/redRiverDelta.ko.ts";
import * as rrdDJa from "./content/depth/redRiverDelta.ja.ts";
import * as rrdDZh from "./content/depth/redRiverDelta.zh.ts";
import * as mkDEn from "./content/depth/mekongDelta.en.ts";
import * as mkDKo from "./content/depth/mekongDelta.ko.ts";
import * as mkDJa from "./content/depth/mekongDelta.ja.ts";
import * as mkDZh from "./content/depth/mekongDelta.zh.ts";
import * as sccEn from "./content/depth/southCentralCoast.en.ts";
import * as sccKo from "./content/depth/southCentralCoast.ko.ts";
import * as sccJa from "./content/depth/southCentralCoast.ja.ts";
import * as sccZh from "./content/depth/southCentralCoast.zh.ts";
import * as seDEn from "./content/depth/southeast.en.ts";
import * as seDKo from "./content/depth/southeast.ko.ts";
import * as seDJa from "./content/depth/southeast.ja.ts";
import * as seDZh from "./content/depth/southeast.zh.ts";
import * as chEn from "./content/depth/centralHighlands.en.ts";
import * as chKo from "./content/depth/centralHighlands.ko.ts";
import * as chJa from "./content/depth/centralHighlands.ja.ts";
import * as chZh from "./content/depth/centralHighlands.zh.ts";
import * as nwEn from "./content/depth/northwest.en.ts";
import * as nwKo from "./content/depth/northwest.ko.ts";
import * as nwJa from "./content/depth/northwest.ja.ts";
import * as nwZh from "./content/depth/northwest.zh.ts";
import * as nccEn from "./content/depth/northCentralCoast.en.ts";
import * as nccKo from "./content/depth/northCentralCoast.ko.ts";
import * as nccJa from "./content/depth/northCentralCoast.ja.ts";
import * as nccZh from "./content/depth/northCentralCoast.zh.ts";

interface BucketModule {
  destinations: Record<string, DestinationTranslation>;
  provinces: Record<string, ProvinceTranslation>;
}

const byLocale: Record<ContentLocale, BucketModule[]> = {
  en: [nmEn, rrdEn, ncEn, schEn, seEn, mkEn, neEn, rrdDEn, mkDEn, sccEn, seDEn, chEn, nwEn, nccEn],
  ko: [nmKo, rrdKo, ncKo, schKo, seKo, mkKo, neKo, rrdDKo, mkDKo, sccKo, seDKo, chKo, nwKo, nccKo],
  ja: [nmJa, rrdJa, ncJa, schJa, seJa, mkJa, neJa, rrdDJa, mkDJa, sccJa, seDJa, chJa, nwJa, nccJa],
  zh: [nmZh, rrdZh, ncZh, schZh, seZh, mkZh, neZh, rrdDZh, mkDZh, sccZh, seDZh, chZh, nwZh, nccZh],
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

// The region files above carry a province's summary and story but never its NAME — that lives in
// the UI dictionary, which is what the app itself renders. Fold it in here so the D1 seed reads
// one aggregate and the API can't disagree with the panel sitting on top of it.
for (const slug of provinceSlugs) {
  for (const [locale, name] of Object.entries(provinceNames(slug)) as [ContentLocale, string][]) {
    ((provinceI18n[slug] ??= {})[locale] ??= {}).name = name;
  }
}
