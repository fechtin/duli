// Apply verified ticket/openingHours corrections across the Vietnamese source and all four
// translations at once, and stamp provenance. `ticket` and `openingHours` are translatable, so
// a correction that only touches the source silently leaves four stale copies behind — this
// script exists so that cannot happen.
//
// Input: a JSON array of corrections (default scripts/.verified-kr.json):
//   [{ "id": "changdeokgung",
//      "sourceUrl": "https://english.visitkorea.or.kr/...",
//      "verifiedAt": "2026-08-04",
//      "ticket":       { "vi": "...", "en": "...", "ko": "...", "ja": "...", "zh": "..." },
//      "openingHours": { "vi": "...", "en": "...", "ko": "...", "ja": "...", "zh": "..." } }]
// Omit `ticket` or `openingHours` to leave that field alone.
//
// Run: node scripts/apply-verified.mjs [path/to/corrections.json]

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const r = (p) => resolve(root, p);
const LOCALES = ["en", "ko", "ja", "zh"];

const corrections = JSON.parse(readFileSync(r(process.argv[2] ?? "scripts/.verified-kr.json"), "utf8"));

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const regionFiles = readdirSync(r("src/data/kr/regions")).map((f) => `src/data/kr/regions/${f}`);

/** Replace `field: "..."` inside the entry that starts at `id`, in a source or i18n file. */
function setField(path, id, field, value, { stopAt }) {
  const lines = readFileSync(r(path), "utf8").split("\n");
  const start = lines.findIndex((l) => l.includes(id));
  if (start === -1) return false;
  const end = lines.findIndex((l, i) => i > start && stopAt.test(l));
  const re = new RegExp(`^(\\s*)${field}: ".*",$`);
  for (let i = start; i < (end === -1 ? lines.length : end); i++) {
    const m = lines[i].match(re);
    if (m) {
      lines[i] = `${m[1]}${field}: "${esc(value)}",`;
      writeFileSync(r(path), lines.join("\n"));
      return true;
    }
  }
  return false;
}

/** Insert sourceUrl/verifiedAt after `nearby:` if not already present. */
function stampProvenance(path, id, url, date) {
  const lines = readFileSync(r(path), "utf8").split("\n");
  const start = lines.findIndex((l) => l.includes(`id: "${id}",`));
  if (start === -1) return false;
  const end = lines.findIndex((l, i) => i > start && /^ {2}\},?$/.test(l));
  const slice = lines.slice(start, end === -1 ? lines.length : end);
  const at = slice.findIndex((l) => /^ {4}nearby: /.test(l));
  if (at === -1) return false;
  if (slice.some((l) => l.includes("sourceUrl:"))) {
    // already stamped — refresh the date and url in place
    for (let i = start; i < start + slice.length; i++) {
      if (/^ {4}sourceUrl: /.test(lines[i])) lines[i] = `    sourceUrl: "${esc(url)}",`;
      if (/^ {4}verifiedAt: /.test(lines[i])) lines[i] = `    verifiedAt: "${date}",`;
    }
  } else {
    lines.splice(start + at + 1, 0, `    sourceUrl: "${esc(url)}",`, `    verifiedAt: "${date}",`);
  }
  writeFileSync(r(path), lines.join("\n"));
  return true;
}

let applied = 0;
const problems = [];
for (const c of corrections) {
  const idLine = `id: "${c.id}",`;
  const srcFile = regionFiles.find((f) => readFileSync(r(f), "utf8").includes(idLine));
  if (!srcFile) { problems.push(`${c.id}: not found in any region file`); continue; }

  for (const field of ["ticket", "openingHours"]) {
    if (!c[field]) continue;
    if (!setField(srcFile, idLine, field, c[field].vi, { stopAt: /^ {2}\},?$/ }))
      problems.push(`${c.id}: could not set ${field} in ${srcFile}`);
    for (const loc of LOCALES) {
      const province = srcFile.match(/regions\/([\w-]+)\.ts$/)[1];
      // seoul-modern / gyeonggi-north / gyeongju keep their province's single i18n file
      const base = { "seoul-modern": "seoul", "gyeonggi-north": "gyeonggi", gyeongju: "gyeongbuk" }[province] ?? province;
      const p = `src/data/kr/i18n/${base}.${loc}.ts`;
      const key = c.id.includes("-") ? `"${c.id}": {` : `${c.id}: {`;
      if (!setField(p, key, field, c[field][loc], { stopAt: /^ {2}\},$/ }))
        problems.push(`${c.id}: could not set ${field} in ${p}`);
    }
  }
  if (c.sourceUrl && !stampProvenance(srcFile, c.id, c.sourceUrl, c.verifiedAt))
    problems.push(`${c.id}: could not stamp provenance`);
  applied++;
}

console.log(`[apply-verified] ${applied} destination(s) updated across vi + ${LOCALES.length} locales`);
if (problems.length) {
  console.error("\nProblems:\n" + problems.map((p) => `  ${p}`).join("\n"));
  process.exitCode = 1;
}
