# KR destination image audit — 2026-08-04

`npm run images:fetch -- kr` filled 109 of 112 new seeds (186/189 destinations covered).
Audited by comparing each manifest entry's Commons `sourceTitle` against the destination's
`nameEn`/seed, then opening the ambiguous ones. 51 entries had zero token overlap, but most of
those are false alarms: a Korean-language filename that names the right subject
(`월정사1.jpg` for Woljeongsa, `부석사 무량수전` for Buseoksa, `불로동 고분군` for the Bullo
tumuli, `구일본58은행지점` for the Incheon open-port quarter, and so on).

## Confirmed wrong — opened and looked at
| Seed | What the image actually shows |
|---|---|
| `yongmunsa` | a cat sitting on a windowsill |
| `independence-hall` | a Cheonan shopping street at dusk |
| `jangsaengpo-whale-village` | the Hyundai Heavy Industries shipyard |
| `mancheonha-skywalk` | a mound of dirt at the river's edge |

## Wrong on the evidence of the file title (different subject entirely)
`paju-book-city` (jangseung totem poles) · `cheongoksan-mureung` (expressway construction site) ·
`sokcho-abai-village` (Dongmyeong port) · `chungju-lake-ferry` (a Baekje marker stone) ·
`jangtaesan-metasequoia` (a fish gate on the Gap river) · `daejeon-skyroad` (a stairway) ·
`bimatgil-geumgang` (a high school) · `birds-nest-library` (a metro station) ·
`mokpo-modern-history` (an SRT train) · `gurye-sansuyu` (a Korail templestay ad) ·
`gimhae-gaya-tombs` (royal graves at Changnyeong, wrong county) · `jeonju-nambu-market` (Pungnammun gate)

## Still to eyeball
`gosu-cave` · `geoje-windy-hill` · `namhae-german-village` · `sanbangsan` · `oido` ·
`igidae-coastal-walk` · `daegwallyeong-sky-ranch`

## Never filled by the pipeline (3)
`ganghwa-peace-observatory` · `jindo-sea-parting` · `ulsan-bridge-observatory`

**Cause.** Commons geosearch returns whatever happens to be geotagged nearby, which for a
skywalk, a library or a museum is usually the wrong building. The name-token guard in
`fetch-images.mjs` only gates the text-search and Wikipedia paths, not geosearch — that is the
gap worth closing if this is ever re-run at scale.

**Fix route.** Hand-pick Commons files into `scripts/.curate-map.json` and run
`node --experimental-strip-types scripts/curate-images.mjs`, same as the 2026-08-03 pass.
