// Cross-check the province names in the UI dictionary against Wikidata.
//
//   node --experimental-strip-types scripts/verify-province-names.mjs   (npm run check:provinces)
//
// The dictionary (src/lib/i18n/locales/*.ts, `province.<slug>`) is the SOURCE OF TRUTH — it is
// what every panel, map label, page title and JSON-LD renders. This script does not write it;
// it audits it, because 80 provinces x 4 languages is 320 hand-written proper nouns and nobody
// re-reads those. It earned its keep on the first run by finding two wrong characters:
// Bạc Liêu as 薄辽 (辽 is the Liêu of Liaoning) and Sơn La as 山萝 (萝 is the radish).
//
// Differences are reported, never applied. Most are stylistic — Wikidata keeps the 省/성
// "province" suffix and the dictionary drops it — so those are counted and summarised rather
// than listed, leaving only the differences worth a human look.
//
// Resolution is by Wikidata entity, not by Wikipedia title: several Vietnamese province names
// are also Chinese place names, and the vi.wikipedia article at that exact title is often a
// DISAMBIGUATION page whose interlanguage links point at the Chinese homonym — matching on name
// alone resolved "Hà Nam" to 河南省 (Henan). Every candidate must claim country (P17) = Vietnam.
// Where an entity's label and its Wikipedia article title disagree, the article wins: Hà Giang's
// zh label reads 河楊省 ("Dương") while zh.wikipedia titles the article 河江省.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as OpenCC from "opencc-js";
import { dictionaries } from "../src/lib/i18n/dictionaries.ts";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const r = (p) => resolve(ROOT, p);

const UA = "FechTinGo/1.0 (https://go.fechtin.com; province name resolution)";
const VIETNAM = "Q881";
const WANT = ["ko", "ja", "zh"];
/** Wikidata carries several Chinese variants; take the Simplified one, else normalise. */
const ZH_PREFERENCE = ["zh-hans", "zh-cn", "zh-sg", "zh"];
const toSimplified = OpenCC.Converter({ from: "t", to: "cn" });

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function getJson(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res.json();
    if (res.status === 429 || res.status >= 500) {
      await sleep(500 * 2 ** attempt);
      continue;
    }
    throw new Error(`${res.status} ${res.statusText} for ${url}`);
  }
  throw new Error(`gave up on ${url}`);
}

/** Wikidata ids for vi.wikipedia titles (batched — the API takes up to 50 at a time). */
async function idsForTitles(titles) {
  const url =
    "https://vi.wikipedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      prop: "pageprops",
      ppprop: "wikibase_item",
      titles: titles.join("|"),
      redirects: "1",
      format: "json",
      origin: "*",
    });
  const data = await getJson(url);
  const byTitle = new Map();
  // `normalized` and `redirects` remap what we asked for onto what we got back.
  const alias = new Map();
  for (const n of data.query?.normalized ?? []) alias.set(n.from, n.to);
  for (const rd of data.query?.redirects ?? []) alias.set(rd.from, rd.to);
  const pages = Object.values(data.query?.pages ?? {});
  const resolvedTitle = (t) => {
    let cur = t;
    for (let i = 0; i < 5 && alias.has(cur); i++) cur = alias.get(cur);
    return cur;
  };
  for (const t of titles) {
    const page = pages.find((p) => p.title === resolvedTitle(t));
    if (page?.pageprops?.wikibase_item) byTitle.set(t, page.pageprops.wikibase_item);
  }
  return byTitle;
}

/** Labels + country claim for Wikidata entities (batched). */
async function entities(ids) {
  const url =
    "https://www.wikidata.org/w/api.php?" +
    new URLSearchParams({
      action: "wbgetentities",
      ids: ids.join("|"),
      props: "labels|claims|sitelinks",
      languages: [...WANT, ...ZH_PREFERENCE].join("|"),
      sitefilter: "kowiki|jawiki|zhwiki",
      format: "json",
      origin: "*",
    });
  const data = await getJson(url);
  return data.entities ?? {};
}

const geo = JSON.parse(readFileSync(r("src/data/generated/geo-meta.vn.json"), "utf8"));

/**
 * Titles worth trying for one province, best first.
 *
 * The bare name leads. Putting the "(tỉnh)" form first looked safer and was worse: for the five
 * centrally-governed cities it matched a HISTORICAL province instead of the city — "Hà Nội
 * (tỉnh)" is a 19th-century entity whose Chinese label is 河内省, not the 河内市 a reader wants —
 * and for fifteen provinces whose capital shares the province's name it fell through to the
 * "(thành phố)" article and returned the city (金瓯市 for Cà Mau instead of 金瓯省).
 *
 * The bare title is safe to lead with because the P17 guard below does the real filtering: where
 * the bare name is a disambiguation page (Bắc Giang, Hà Nam, Hải Dương…) its entity has no
 * country claim, so it is rejected and the "(tỉnh)" form is tried next.
 */
function candidates(name) {
  const bare = name.replace(/^(TP\.|Thành phố)\s*/i, "").trim();
  return [...new Set([name, bare, `${bare} (tỉnh)`, `Tỉnh ${bare}`, `${bare} (thành phố)`])];
}

const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

// ── Resolve every candidate title to a Wikidata id ───────────────────────────
const allTitles = [...new Set(geo.provinces.flatMap((p) => candidates(p.name)))];
const titleToId = new Map();
for (const batch of chunk(allTitles, 40)) {
  for (const [t, id] of await idsForTitles(batch)) titleToId.set(t, id);
  await sleep(150);
}

// ── Fetch those entities and keep only the ones actually in Vietnam ──────────
const uniqueIds = [...new Set([...titleToId.values()])];
const entityById = {};
for (const batch of chunk(uniqueIds, 40)) {
  Object.assign(entityById, await entities(batch));
  await sleep(150);
}

const inVietnam = (entity) =>
  (entity?.claims?.P17 ?? []).some((c) => c.mainsnak?.datavalue?.value?.id === VIETNAM);

const labelOf = (entity, lang) => entity?.labels?.[lang]?.value ?? null;

/** Wikipedia article titles occasionally carry a parenthetical qualifier; a name never should. */
const stripQualifier = (title) => title.replace(/\s*[（(][^）)]*[）)]\s*$/, "").trim();

const sitelinkOf = (entity, wiki) => {
  const title = entity?.sitelinks?.[wiki]?.title;
  return title ? stripQualifier(title) : null;
};

function zhLabel(entity) {
  for (const lang of ZH_PREFERENCE) {
    const v = labelOf(entity, lang);
    if (v) return toSimplified(v);
  }
  return null;
}

/**
 * The article title beats the label. Wikidata labels are edited far more loosely than article
 * titles and this pass caught one outright error: Hà Giang's zh label reads 河楊省 ("Dương"),
 * while zh.wikipedia titles the article 河江省 — the correct Sino-Vietnamese reading. Where the
 * two disagree the article wins and the disagreement is printed, because a silent pick between
 * two sources is exactly how a wrong name ships.
 */
const WIKI = { ko: "kowiki", ja: "jawiki", zh: "zhwiki" };

function resolveName(entity, lang, disagreements, slug) {
  const raw = sitelinkOf(entity, WIKI[lang]);
  const fromSite = raw && lang === "zh" ? toSimplified(raw) : raw;
  const fromLabel = lang === "zh" ? zhLabel(entity) : labelOf(entity, lang);
  if (fromSite && fromLabel && fromSite !== fromLabel) {
    disagreements.push(`${slug} ${lang}: bài "${fromSite}" ≠ nhãn "${fromLabel}" → lấy bài`);
  }
  return fromSite ?? fromLabel ?? null;
}

const resolved = {};
const report = [];
const disagreements = [];

for (const p of geo.provinces) {
  let picked = null;
  let pickedId = null;
  let viaTitle = null;
  for (const title of candidates(p.name)) {
    const id = titleToId.get(title);
    if (!id) continue;
    const entity = entityById[id];
    // The guard that makes this trustworthy: an entity not in Vietnam is the wrong entity,
    // however well its name matches.
    if (!inVietnam(entity)) continue;
    picked = entity;
    pickedId = id;
    viaTitle = title;
    break;
  }

  const names = {};
  if (picked) {
    for (const lang of WANT) {
      const v = resolveName(picked, lang, disagreements, p.slug);
      if (v) names[lang] = v;
    }
  }

  resolved[p.slug] = {
    ...names,
    _id: pickedId,
    _source: pickedId ? `https://www.wikidata.org/wiki/${pickedId}` : null,
  };
  report.push({
    slug: p.slug,
    vi: p.name,
    ...names,
    id: pickedId ?? "—",
    via: viaTitle ?? "không khớp entity nào ở Việt Nam",
    missing: WANT.filter((l) => !names[l]).join(","),
  });
}

// ── Compare against the dictionary ───────────────────────────────────────────
/** Wikidata keeps the "province"/"city" suffix; the dictionary drops it. Not a disagreement. */
const stripSuffix = (s) => String(s).replace(/(성|시|省|市|特別市|特别市)$/, "");

const suffixOnly = [];
const conflicts = [];
const unchecked = [];

for (const row of report) {
  for (const lang of WANT) {
    const ours = dictionaries[lang][`province.${row.slug}`];
    const theirs = row[lang];
    if (!ours || !theirs) {
      unchecked.push(`${row.slug} ${lang}`);
      continue;
    }
    if (ours === theirs) continue;
    (stripSuffix(ours) === stripSuffix(theirs) ? suffixOnly : conflicts).push(
      `  ${row.slug.padEnd(18)} ${lang}  từ điển "${ours}"  ≠  wikidata "${theirs}"`,
    );
  }
}

const checked = report.length * WANT.length - unchecked.length;
console.log(`Đối chiếu ${checked} tên tỉnh với Wikidata.`);
console.log(`  khớp (bỏ qua hậu tố 省/성): ${checked - conflicts.length}`);
if (suffixOnly.length) console.log(`  chỉ khác hậu tố: ${suffixOnly.length} — bình thường, không cần sửa`);
if (unchecked.length) console.log(`  không tra được: ${unchecked.length} (${unchecked.slice(0, 4).join(", ")}${unchecked.length > 4 ? "…" : ""})`);

if (disagreements.length) {
  console.log(`\nNguồn Wikidata tự mâu thuẫn ở ${disagreements.length} chỗ (đã lấy theo bài Wikipedia):`);
  for (const d of disagreements) console.log(`  ${d}`);
}

if (conflicts.length) {
  console.log(`\n⚠ ${conflicts.length} tên khác thật — xem lại bằng mắt, KHÔNG sửa tự động:`);
  for (const c of conflicts) console.log(c);
  console.log("\nKhác biệt phiên âm là chuyện thường; khác CHỮ trong tên Hán-Việt thì đáng ngờ.");
} else {
  console.log("\n✓ Không có tên nào lệch ngoài hậu tố.");
}
