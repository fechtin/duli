// Crawler-visible content for the SPA shell.
//
// index.html ships an empty <div id="root">: everything a reader sees is painted by React from
// data fetched at runtime. Googlebot does render JS, but it pays for it out of a crawl budget and
// defers the render; the crawlers behind LLM answers mostly do not render at all, so to them the
// atlas is a blank page with good <meta> tags. Here we fill #root at the edge with the same
// content the app is about to show.
//
// This is a pre-hydration fallback, not server rendering: React's createRoot() clears the
// container on first render (unlike hydrateRoot), so the app overwrites this wholesale. It is
// also genuine progressive enhancement — on a slow connection a reader sees the text instead of
// an empty screen — which is why it is served to everyone rather than sniffed by user-agent.
//
// Everything here is inline-styled: the stylesheet is loaded async by the same bundle that is
// about to replace this markup, so it cannot be relied on.

import type { Destination } from "../src/lib/types";
import { labelOf } from "../src/lib/country/names";
import { translate, type Locale } from "../src/lib/i18n/dictionaries";
import { FOOD_SEGMENT, withLocale } from "../src/lib/seo/urls";
import manifest from "../src/data/generated/image-manifest.json";

/** seed → real file. 98 of 531 gallery seeds have no photo, so every <img> is gated on this. */
const IMAGES = manifest as Record<string, { src: string; credit?: string; license?: string }>;

/** Country name in the reader's language. */
export const countryName = (cc: string, locale: Locale) => labelOf(cc, locale);

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const S = {
  wrap:
    "max-width:44rem;margin:0 auto;padding:3rem 1.5rem 4rem;font-family:Inter,system-ui,sans-serif;" +
    "background:#111315;color:#e7e5e4;min-height:100%;line-height:1.65",
  h1: "font-size:2rem;line-height:1.2;margin:0 0 .75rem;font-weight:700;color:#fafaf9",
  h2: "font-size:1.1rem;margin:2.5rem 0 .75rem;font-weight:600;color:#fafaf9",
  h3: "font-size:1rem;margin:0 0 .25rem;font-weight:600",
  q: "font-size:1rem;margin:1.25rem 0 .25rem;font-weight:600;color:#fafaf9",
  crumb: "font-size:.85rem;margin:0 0 1rem;color:#a8a29e",
  p: "margin:0 0 1rem",
  dim: "margin:0 0 1rem;color:#a8a29e",
  cap: "margin:.5rem 0 1.5rem;font-size:.8rem;color:#a8a29e",
  ul: "margin:0 0 1rem;padding-left:1.25rem",
  list: "list-style:none;margin:0;padding:0",
  item: "margin:0 0 1.25rem",
  img: "width:100%;height:auto;border-radius:.75rem;display:block",
  a: "color:#7dd3c0;text-decoration:none",
} as const;

const link = (href: string, label: string) => `<a href="${esc(href)}" style="${S.a}">${esc(label)}</a>`;

/** A <ul> of plain strings, or "" when there is nothing to list. */
function bullets(items: string[] | undefined): string {
  if (!items?.length) return "";
  return `<ul style="${S.ul}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

/**
 * A photo with its attribution. Returns "" when the seed has no real file — an <img> that 404s
 * costs more than the missing image does. `alt` carries the place name, which is the whole
 * point: without it these 400-odd photos are invisible to Google Images.
 */
function figure(seed: string | undefined, alt: string, caption?: string): string {
  const img = seed ? IMAGES[seed] : undefined;
  if (!img) return "";
  const credit = [caption, img.credit, img.license].filter(Boolean).join(" · ");
  return (
    `<img src="${esc(img.src)}" alt="${esc(alt)}" style="${S.img}" loading="lazy" decoding="async" />` +
    (credit ? `<p style="${S.cap}">${esc(credit)}</p>` : "")
  );
}

/** Wrap page content in the shell that stands in for the app until React boots. */
const shell = (inner: string) => `<div style="${S.wrap}">${inner}</div>`;

/** Breadcrumb trail, locale-prefixed so a crawler never crosses into another language. */
function crumbs(locale: Locale, parts: { href: string; label: string }[]): string {
  const trail = parts.map((p) => link(withLocale(locale, p.href), p.label)).join(" · ");
  return `<p style="${S.crumb}">${trail}</p>`;
}

/**
 * Locale-prefixed homepage ("/en", "/ko", …). The bare "/" is answered by Cloudflare's asset
 * layer and gets its equivalent baked into index.html by the `homepage-seo` vite plugin — keep
 * the two in step.
 */
export function homeBody(locale: Locale, countries: { cc: string; name: string }[]): string {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  const names = countries.map((c) => c.name).join(" · ");
  const items = countries
    .map((c) => `<li style="margin:0 0 .4rem">${link(withLocale(locale, `/${c.cc}`), c.name)}</li>`)
    .join("");
  return shell(
    `<h1 style="${S.h1}">FechTin Go</h1>` +
      `<p style="${S.p}">${esc(t("seo.description", { country: names }))}</p>` +
      `<h2 style="${S.h2}">${esc(t("seo.maps"))}</h2>` +
      `<ul style="${S.ul}">${items}</ul>`,
  );
}

/** Country landing: the index every province page hangs off. */
export function countryBody(
  cc: string,
  locale: Locale,
  provinces: { slug: string; name: string }[],
  dishes: { id: string; name: string; emoji?: string }[] = [],
): string {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  const items = provinces
    .map(
      (p) =>
        `<li style="margin:0 0 .4rem">${link(withLocale(locale, `/${cc}/${p.slug}`), p.name)}</li>`,
    )
    .join("");
  const dishItems = dishes
    .map(
      (d) =>
        `<li style="margin:0 0 .4rem">` +
        `${link(withLocale(locale, `/${cc}/${FOOD_SEGMENT}/${d.id}`), `${d.emoji ?? "🍽️"} ${d.name}`)}</li>`,
    )
    .join("");

  return shell(
    crumbs(locale, [{ href: "/", label: "FechTin Go" }]) +
      `<h1 style="${S.h1}">${esc(countryName(cc, locale))}</h1>` +
      `<p style="${S.p}">${esc(t("seo.provincesLine", { count: provinces.length }))}</p>` +
      `<ul style="${S.ul}">${items}</ul>` +
      (dishItems
        ? `<h2 style="${S.h2}">` +
          `${link(withLocale(locale, `/${cc}/${FOOD_SEGMENT}`), t("seo.cuisine"))}</h2>` +
          `<ul style="${S.ul}">${dishItems}</ul>`
        : ""),
  );
}

/**
 * The cuisine index (`/{cc}/food`) — every dish, with its photo and one line of copy.
 *
 * The country page already links each dish, but as a bare name in a flat run of ninety list
 * items. This page is the one that reads like something: a heading a query can match, and a
 * summary under every link.
 */
export function foodBody(
  cc: string,
  locale: Locale,
  dishes: { id: string; name: string; emoji?: string; summary?: string }[],
): string {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  const label = countryName(cc, locale);
  const items = dishes
    .map((d) => {
      const href = withLocale(locale, `/${cc}/${FOOD_SEGMENT}/${d.id}`);
      const name = `${d.emoji ?? "🍽️"} ${d.name}`;
      return (
        `<li style="${S.item}"><h3 style="${S.h3}">${link(href, name)}</h3>` +
        (d.summary ? `<p style="${S.dim}">${esc(d.summary)}</p>` : "") +
        `</li>`
      );
    })
    .join("");

  return shell(
    crumbs(locale, [
      { href: "/", label: "FechTin Go" },
      { href: `/${cc}`, label },
    ]) +
      `<h1 style="${S.h1}">${esc(t("seo.cuisine"))} — ${esc(label)}</h1>` +
      `<p style="${S.p}">${esc(t("seo.cuisineDesc", { count: dishes.length, country: label }))}</p>` +
      `<ul style="${S.list}">${items}</ul>`,
  );
}

interface ProvinceContentLike {
  summary: string;
  story: string;
  bestTime: string;
  specialties: string[];
}

export function provinceBody(
  cc: string,
  locale: Locale,
  province: { slug: string; name: string; regionName: string },
  content: ProvinceContentLike | null,
  destinations: Destination[],
): string {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  const items = destinations
    .map((d) => {
      const href = withLocale(locale, `/${cc}/${province.slug}/${d.slug}`);
      return (
        `<li style="${S.item}"><h3 style="${S.h3}">${link(href, d.name)}</h3>` +
        `<p style="${S.dim}">${esc(d.summary)}</p></li>`
      );
    })
    .join("");
  const hero = destinations.find((d) => d.gallery?.[0]?.seed && IMAGES[d.gallery[0].seed]);

  return shell(
    crumbs(locale, [
      { href: "/", label: "FechTin Go" },
      { href: `/${cc}`, label: countryName(cc, locale) },
    ]) +
      `<h1 style="${S.h1}">${esc(province.name)}</h1>` +
      `<p style="${S.dim}">${esc(province.regionName)}</p>` +
      figure(hero?.gallery[0]?.seed, `${province.name} — ${hero?.name ?? ""}`, hero?.gallery[0]?.caption) +
      (content?.summary ? `<p style="${S.p}">${esc(content.summary)}</p>` : "") +
      (content?.story ? `<p style="${S.p}">${esc(content.story)}</p>` : "") +
      (content?.bestTime
        ? `<p style="${S.p}"><strong>${esc(t("seo.bestTime"))}:</strong> ${esc(content.bestTime)}</p>`
        : "") +
      (content?.specialties?.length
        ? `<h2 style="${S.h2}">${esc(t("seo.specialties"))}</h2>${bullets(content.specialties)}`
        : "") +
      (items
        ? `<h2 style="${S.h2}">${esc(t("seo.places"))} (${destinations.length})</h2>` +
          `<ul style="${S.list}">${items}</ul>`
        : ""),
  );
}

/**
 * The four questions a destination's data actually answers, paired with their answers.
 * Shared with the JSON-LD builder so the FAQPage markup and the visible text can never drift —
 * structured data that doesn't match the page is a manual-action risk, not just wasted effort.
 */
export function faqPairs(d: Destination, locale: Locale): { q: string; a: string }[] {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  const pairs: { q: string; a: string }[] = [];
  const add = (key: string, answer: string) => {
    if (answer?.trim()) pairs.push({ q: t(key, { name: d.name }), a: answer.trim() });
  };
  add("seo.qBestTime", d.bestTime);
  add("seo.qTicket", d.ticket);
  add("seo.qDuration", d.visitDuration);
  add("seo.qHours", d.openingHours);
  return pairs;
}

export function destinationBody(
  cc: string,
  locale: Locale,
  province: { slug: string; name: string },
  d: Destination,
): string {
  const t = (k: string, p?: Record<string, string | number>) => translate(locale, k, p);
  // Question-shaped headings instead of a label list: "Vé vào X giá bao nhiêu?" is the query a
  // reader types, and the answer is already in the data. Same facts, wording that can rank.
  const faq = faqPairs(d, locale)
    .map(({ q, a }) => `<h3 style="${S.q}">${esc(q)}</h3><p style="${S.p}">${esc(a)}</p>`)
    .join("");

  return shell(
    crumbs(locale, [
      { href: "/", label: "FechTin Go" },
      { href: `/${cc}`, label: countryName(cc, locale) },
      { href: `/${cc}/${province.slug}`, label: province.name },
    ]) +
      `<h1 style="${S.h1}">${esc(d.name)}</h1>` +
      figure(d.gallery?.[0]?.seed, `${d.name} — ${province.name}`, d.gallery?.[0]?.caption) +
      `<p style="${S.p}">${esc(d.summary)}</p>` +
      (d.story ? `<p style="${S.p}">${esc(d.story)}</p>` : "") +
      (faq ? `<h2 style="${S.h2}">${esc(t("seo.visitInfo"))}</h2>${faq}` : "") +
      (d.facts?.length ? `<h2 style="${S.h2}">${esc(t("seo.facts"))}</h2>${bullets(d.facts)}` : "") +
      (d.travelTips?.length ? `<h2 style="${S.h2}">${esc(t("seo.tips"))}</h2>${bullets(d.travelTips)}` : "") +
      (d.sourceUrl ? `<p style="${S.dim}">${esc(t("seo.source"))}: ${link(d.sourceUrl, d.sourceUrl)}</p>` : "") +
      (d.verifiedAt ? `<p style="${S.dim}">${esc(t("seo.updated"))}: ${esc(d.verifiedAt)}</p>` : ""),
  );
}

/** A dish page (`/{cc}/food/{id}`) — story-first, the way the panel reads it. */
export function dishBody(
  cc: string,
  locale: Locale,
  dish: { id: string; name: string; emoji: string; summary: string; story: string; ingredients: string[]; flavor: string },
): string {
  const t = (k: string) => translate(locale, k);
  return shell(
    crumbs(locale, [
      { href: "/", label: "FechTin Go" },
      { href: `/${cc}`, label: countryName(cc, locale) },
      { href: `/${cc}/${FOOD_SEGMENT}`, label: t("seo.cuisine") },
    ]) +
      `<h1 style="${S.h1}">${esc(dish.emoji)} ${esc(dish.name)}</h1>` +
      figure(`dish-${dish.id}`, dish.name) +
      `<p style="${S.p}">${esc(dish.summary)}</p>` +
      (dish.story ? `<p style="${S.p}">${esc(dish.story)}</p>` : "") +
      (dish.flavor ? `<p style="${S.p}"><strong>${esc(t("seo.flavor"))}:</strong> ${esc(dish.flavor)}</p>` : "") +
      (dish.ingredients?.length
        ? `<h2 style="${S.h2}">${esc(t("seo.ingredients"))}</h2>${bullets(dish.ingredients)}`
        : ""),
  );
}
