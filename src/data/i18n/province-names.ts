// Province names per content locale — derived, never authored here.
//
// The names already exist, and have for a long time: the UI dictionary carries a
// `province.<slug>` key for all 80 provinces in all five languages, and that is what every panel
// and map label renders. What was missing was those names reaching D1 and geo-meta, so the
// Worker titled a Korean page "Phố cổ Hội An — Quảng Nam" while the panel underneath said 꽝남.
//
// Deriving rather than copying is the point: a second table of the same 400 strings is a second
// table to drift. `npm run check:provinces` cross-checks these against Wikidata, which is how the
// two wrong Chinese characters in this set were found (薄辽 for Bạc Liêu, 山萝 for Sơn La).

import { dictionaries } from "../../lib/i18n/dictionaries.ts";
import type { ContentLocale } from "@/lib/types";

const CONTENT_LOCALES: ContentLocale[] = ["en", "ko", "ja", "zh"];
const KEY = /^province\.(.+)$/;

/** Every province slug the dictionary names, across both atlases. */
export const provinceSlugs: string[] = Object.keys(dictionaries.vi)
  .map((k) => KEY.exec(k)?.[1])
  .filter((slug): slug is string => Boolean(slug));

/** `{ ko: "꽝남", ja: "クアンナム", … }` — omitting locales the dictionary doesn't name. */
export function provinceNames(slug: string): Partial<Record<ContentLocale, string>> {
  const names: Partial<Record<ContentLocale, string>> = {};
  for (const locale of CONTENT_LOCALES) {
    const name = dictionaries[locale][`province.${slug}`];
    if (name) names[locale] = name;
  }
  return names;
}
