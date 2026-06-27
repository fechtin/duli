// Localized region names (8 regions). Vietnamese is the base in geo-meta; these add the
// other content languages. Keyed by RegionId. See ./README.md.
import type { ContentLocale } from "@/lib/types";

export const regionNames: Record<string, Partial<Record<ContentLocale, string>>> = {
  northeast: { en: "Northeast", ko: "동북부", ja: "東北部", zh: "东北部" },
  northwest: { en: "Northwest", ko: "서북부", ja: "西北部", zh: "西北部" },
  "red-river-delta": { en: "Red River Delta", ko: "홍강 삼각주", ja: "紅河デルタ", zh: "红河三角洲" },
  "north-central-coast": { en: "North Central Coast", ko: "북중부", ja: "北中部", zh: "北中部" },
  "south-central-coast": { en: "South Central Coast", ko: "남중부 해안", ja: "南中部沿岸", zh: "南中部沿海" },
  "central-highlands": { en: "Central Highlands", ko: "중부 고원", ja: "中部高原", zh: "中部高原" },
  southeast: { en: "Southeast", ko: "동남부", ja: "東南部", zh: "东南部" },
  "mekong-delta": { en: "Mekong Delta", ko: "메콩강 삼각주", ja: "メコンデルタ", zh: "湄公河三角洲" },
};
