# Content translations (i18n)

Vietnamese is the **base / source** language. Every translated field is optional and falls
back to Vietnamese when missing — so partial translations never break the UI.

There are **two layers** of localization:

| Layer | What | Where it lives | Served by |
| --- | --- | --- | --- |
| **Static client strings** | UI chrome (nav/buttons/titles/badges) **and** province & region names | `src/lib/i18n/locales/<locale>.ts` | client dictionary (`useT`) |
| **Editorial content** | destination & province summary/story/facts/tips/captions/etc. | `src/data/i18n/content/<bucket>.<locale>.ts` → D1 `i18n` column | Worker overlay (`worker/db.ts`), keyed by `?locale=` |

Place names (`province.<slug>` / `region.<id>`) were formerly a third client name-map; they are now
just keys in the dictionary — access them with `t(\`province.${slug}\`)` like any other UI string.

`bucket` ∈ `northMountains | redRiverDelta | northCentral | southCentralHighlands | southeast | mekong`
(mirrors `src/data/regions/*.ts`). Each content file exports `destinations` (keyed by destination
`id`) and `provinces` (keyed by province `slug`); array fields are index-aligned with the
Vietnamese source.

## How content reaches the app

1. `src/data/i18n/index.ts` aggregates the per-bucket files into `destinationI18n` / `provinceI18n`.
2. `npm run db:seed:build` writes those as a JSON `i18n` column into `db/seed.sql`.
3. `npm run db:setup` applies migrations (incl. `migrations/0002_i18n.sql`) and loads the seed.
4. The Worker reads `?locale=`, parses the `i18n` column, and overlays translated fields over the
   Vietnamese base (missing fields stay Vietnamese).

## Adding a NEW language (e.g. French `fr`)

1. **UI + names:** add `src/lib/i18n/locales/fr.ts` (copy `vi.ts`, translate all keys — this now
   includes the `province.*` / `region.*` name keys), register it in `src/lib/i18n/dictionaries.ts`
   (`Locale` union + `locales` list + `dictionaries`).
2. **Content type:** add `"fr"` to `ContentLocale` in `src/lib/types.ts`.
3. **Editorial content:** add `src/data/i18n/content/<bucket>.fr.ts` for each of the 6 buckets,
   then wire them into `byLocale.fr` in `src/data/i18n/index.ts`.
   (Re-run `scripts/prep-i18n-batches.mjs` to get fresh Vietnamese source JSON to translate from.)
4. Run `npm run db:seed:build && npm run db:setup && npm run typecheck && npm run check:i18n`.

Any field you don't translate simply falls back to Vietnamese — you can ship incrementally.
