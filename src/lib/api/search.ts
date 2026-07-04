import { normalize } from "@/lib/utils/normalize";
import type { DestinationLight, Dish, ProvinceMeta } from "@/lib/types";

export { normalize };

// Aliases / old names / nicknames (Bible 004 §12).
const aliases: Record<string, string> = {
  saigon: "ho-chi-minh",
  "sai gon": "ho-chi-minh",
  hcm: "ho-chi-minh",
  tphcm: "ho-chi-minh",
  hanoi: "ha-noi",
  "ha noi": "ha-noi",
  thanglong: "ha-noi",
  halong: "quang-ninh",
  sapa: "lao-cai",
  hoian: "quang-nam",
  hue: "thua-thien-hue",
  dalat: "lam-dong",
  danang: "da-nang",
};

export type SearchResultKind = "province" | "destination" | "dish";

export interface SearchResult {
  kind: SearchResultKind;
  id: string;
  title: string;
  subtitle: string;
  provinceSlug: string;
  score: number;
}

/** Pure, diacritic-tolerant ranked search over the loaded content (Bible 003 §6). */
export function searchContent(
  query: string,
  provinces: ProvinceMeta[],
  destinations: DestinationLight[],
  limit = 8,
  dishes: Dish[] = [],
): SearchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const aliasSlug = aliases[q];
  const results: SearchResult[] = [];

  const score = (haystack: string, isProvince: boolean, exactSlug?: string) => {
    let s = 0;
    if (aliasSlug && isProvince && exactSlug === aliasSlug) s = 100;
    else if (haystack === q) s = 90;
    else if (haystack.startsWith(q)) s = 70;
    else if (haystack.includes(` ${q}`)) s = 60;
    else if (haystack.includes(q)) s = 40;
    return s;
  };

  for (const p of provinces) {
    const s = score(normalize([p.name, p.nameEn, p.slug, p.regionName].join(" ")), true, p.slug);
    if (s > 0) results.push({ kind: "province", id: p.slug, title: p.name, subtitle: p.regionName, provinceSlug: p.slug, score: s });
  }

  const provinceName = new Map(provinces.map((p) => [p.slug, p.name]));
  for (const d of destinations) {
    const s = score(normalize([d.name, d.nameEn, d.slug, d.tags.join(" "), provinceName.get(d.provinceSlug) ?? ""].join(" ")), false);
    if (s > 0)
      results.push({
        kind: "destination",
        id: d.id,
        title: d.name,
        subtitle: provinceName.get(d.provinceSlug) ?? "",
        provinceSlug: d.provinceSlug,
        score: s - 3,
      });
  }

  // Food Explorer (026 §Search) — find a dish without knowing its province.
  for (const d of dishes) {
    const s = score(normalize([d.name, d.nameEn, d.tags.join(" "), d.ingredients.join(" ")].join(" ")), false);
    if (s > 0)
      results.push({
        kind: "dish",
        id: d.id,
        title: `${d.emoji} ${d.name}`,
        subtitle: "Ẩm thực",
        provinceSlug: d.originProvince,
        score: s - 5,
      });
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
