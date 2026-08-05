// Destination tag labels, kept out of the UI locale files because they are content
// vocabulary rather than chrome, and because 265 keys would push those files past the
// 500-LOC limit.
//
// Keys are the raw `Destination.tags` strings. Tags are also fed to local search scoring
// (src/lib/api/search.ts), so this layer is display-only — the underlying tag never changes.
import type { Locale } from "../dictionaries";
import { tagsVi } from "./vi";
import { tagsEn } from "./en";
import { tagsKo } from "./ko";
import { tagsJa } from "./ja";
import { tagsZh } from "./zh";

const TAGS: Record<Locale, Record<string, string>> = {
  vi: tagsVi,
  en: tagsEn,
  ko: tagsKo,
  ja: tagsJa,
  zh: tagsZh,
};

/**
 * Localised label for a destination tag. Falls back to the raw tag so a vocabulary word
 * added to the data before it reaches this dictionary still renders — never blank.
 */
export function tagLabel(tag: string, locale: Locale): string {
  return TAGS[locale]?.[tag] ?? tag;
}

export type { TagKey } from "./vi";
