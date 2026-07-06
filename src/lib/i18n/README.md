# i18n Playbook

The app ships 5 locales — **vi** (source), **en**, **ko**, **ja**, **zh**. Vietnamese is
the base; every other locale mirrors its keys exactly.

## The two systems — which one do I touch?

| You're adding… | System | Where |
| --- | --- | --- |
| **Any static client string** — UI chrome (buttons/labels/titles/aria/placeholder/toasts) **and** province/region names | Client dictionary | `locales/*.ts` + `useT()` |
| **Editorial content** — dish/place/province copy (summary/story/tips…) | Server D1 overlay | `src/data/i18n/**` (build-time) |

The rule of thumb: **if it's a string you know at build time, it's a dictionary key** (`useT()`).
If it's editorial prose that a content editor writes per place, it's the D1 overlay.

Province & region names are dictionary keys too — `t(\`province.${slug}\`)`, `t(\`region.${id}\`)`.
(They used to be a separate client name-map; that third mechanism was folded into the dictionary.)

## Adding a UI string (the 90% case)

1. Add the key to **`locales/vi.ts`** (the source of truth) — `"feature.thing": "Chữ"`.
2. Mirror it in **`en.ts`, `ko.ts`, `ja.ts`, `zh.ts`** (typed `Record<TranslationKey, …>`,
   so a missing key is a compile error).
3. In the component: `const t = useT();` then `{t("feature.thing")}`.
4. Interpolate with params: `t("dish.specialtyOf", { place })` ↔ `"Đặc sản {place}"`.

Reuse before inventing — e.g. an "Explore" button is already `nav.explore`, "Close" is
`panel.close`.

## Guardrails (run before commit)

```
npm run check:i18n     # key parity across locales + no hardcoded Vietnamese in JSX
npm run typecheck      # missing locale keys fail here too
```

`useT()`'s `t()` also **warns in dev** (`console.warn`) on an unknown or untranslated key,
so a gap surfaces the moment you render it instead of silently falling back to Vietnamese.

### Escape hatches

- A genuine exception on one line: append `// i18n-ignore` (e.g. geographic proper nouns
  in map data).
- A whole standalone file that is intentionally single-language (e.g. a dead/branded
  export-image card): put `i18n-ignore-file` in a top comment.

## Non-hook code

`t` is just `(key, params) => string`. Pure modules (e.g. `lib/living/briefGenerator.ts`)
take it as a parameter — pass `useT()` from the calling component. Never read
`navigator.language` or `locale === "vi"` branches in view code; route through `t`.

## Known remaining debt

- `briefGenerator.ts` / `sidebar/navHelpers.ts` embed Vietnamese **place names and seasonal
  states** sourced from `data/living/*.json`. The scaffolding sentences are keyed, but the
  interpolated `{state}` / place names stay Vietnamese until the living calendars get the
  D1-overlay content treatment.
- `share/ShareCard.tsx` and `passport/PassportExportCard.tsx` are unused Vietnamese-only
  export cards (`i18n-ignore-file`). Thread a `t` prop from the caller if re-enabled.
