// Translation dictionaries. VI is the source language (Bible 009 §5).
// MVP ships all 5 languages (Bible 001 §12). Each locale file mirrors vi.ts's keys.
import { vi } from "./locales/vi";
import { en } from "./locales/en";
import { ko } from "./locales/ko";
import { ja } from "./locales/ja";
import { zh } from "./locales/zh";

export type Locale = "vi" | "en" | "ko" | "ja" | "zh";

export const locales: { code: Locale; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export type Dict = Record<string, string>;

export const dictionaries: Record<Locale, Dict> = { vi, en, ko, ja, zh };

export type TParams = Record<string, string | number>;

export function interpolate(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? `{${k}}`));
}

/**
 * Translate outside React. The provider's `t` adds dev-time warnings on top of this; the Worker
 * (which renders the crawler-visible body in the reader's language) has no provider at all.
 */
export function translate(locale: Locale, key: string, params?: TParams): string {
  return interpolate(dictionaries[locale]?.[key] ?? vi[key as keyof typeof vi] ?? key, params);
}
