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
