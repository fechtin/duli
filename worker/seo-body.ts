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

/** Country name in the copy's language (Vietnamese — the Worker renders the source locale). */
export const countryName = (cc: string) => labelOf(cc);

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
  crumb: "font-size:.85rem;margin:0 0 1rem;color:#a8a29e",
  p: "margin:0 0 1rem",
  dim: "margin:0 0 1rem;color:#a8a29e",
  ul: "margin:0 0 1rem;padding-left:1.25rem",
  list: "list-style:none;margin:0;padding:0",
  item: "margin:0 0 1.25rem",
  a: "color:#7dd3c0;text-decoration:none",
} as const;

const link = (href: string, label: string) => `<a href="${esc(href)}" style="${S.a}">${esc(label)}</a>`;

/** A <ul> of plain strings, or "" when there is nothing to list. */
function bullets(items: string[] | undefined): string {
  if (!items?.length) return "";
  return `<ul style="${S.ul}">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

/** Wrap page content in the shell that stands in for the app until React boots. */
const shell = (inner: string) => `<div style="${S.wrap}">${inner}</div>`;

/** Country landing: the index every province page hangs off. */
export function countryBody(cc: string, provinces: { slug: string; name: string }[]): string {
  const items = provinces
    .map((p) => `<li style="margin:0 0 .4rem">${link(`/${cc}/${p.slug}`, p.name)}</li>`)
    .join("");
  return shell(
    `<p style="${S.crumb}">${link("/", "FechTin Go")}</p>` +
      `<h1 style="${S.h1}">${esc(countryName(cc))}</h1>` +
      `<p style="${S.p}">${provinces.length} tỉnh thành có nội dung trên bản đồ.</p>` +
      `<ul style="${S.ul}">${items}</ul>`,
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
  province: { slug: string; name: string; regionName: string },
  content: ProvinceContentLike | null,
  destinations: Destination[],
): string {
  const items = destinations
    .map(
      (d) =>
        `<li style="${S.item}"><h3 style="${S.h3}">${link(`/${cc}/${province.slug}/${d.slug}`, d.name)}</h3>` +
        `<p style="${S.dim}">${esc(d.summary)}</p></li>`,
    )
    .join("");

  return shell(
    `<p style="${S.crumb}">${link("/", "FechTin Go")} · ${link(`/${cc}`, countryName(cc))}</p>` +
      `<h1 style="${S.h1}">${esc(province.name)}</h1>` +
      `<p style="${S.dim}">${esc(province.regionName)}</p>` +
      (content?.summary ? `<p style="${S.p}">${esc(content.summary)}</p>` : "") +
      (content?.story ? `<p style="${S.p}">${esc(content.story)}</p>` : "") +
      (content?.bestTime ? `<p style="${S.p}"><strong>Thời điểm đẹp nhất:</strong> ${esc(content.bestTime)}</p>` : "") +
      (content?.specialties?.length ? `<h2 style="${S.h2}">Đặc sản</h2>${bullets(content.specialties)}` : "") +
      (items ? `<h2 style="${S.h2}">Địa điểm (${destinations.length})</h2><ul style="${S.list}">${items}</ul>` : ""),
  );
}

export function destinationBody(
  cc: string,
  province: { slug: string; name: string },
  d: Destination,
): string {
  const info: string[] = [];
  if (d.bestTime) info.push(`<strong>Thời điểm đẹp nhất:</strong> ${esc(d.bestTime)}`);
  if (d.visitDuration) info.push(`<strong>Thời gian tham quan:</strong> ${esc(d.visitDuration)}`);
  if (d.ticket) info.push(`<strong>Vé:</strong> ${esc(d.ticket)}`);
  if (d.openingHours) info.push(`<strong>Giờ mở cửa:</strong> ${esc(d.openingHours)}`);

  return shell(
    `<p style="${S.crumb}">${link("/", "FechTin Go")} · ${link(`/${cc}`, countryName(cc))} · ` +
      `${link(`/${cc}/${province.slug}`, province.name)}</p>` +
      `<h1 style="${S.h1}">${esc(d.name)}</h1>` +
      `<p style="${S.p}">${esc(d.summary)}</p>` +
      (d.story ? `<p style="${S.p}">${esc(d.story)}</p>` : "") +
      (info.length ? `<h2 style="${S.h2}">Thông tin tham quan</h2><ul style="${S.ul}">${info.map((i) => `<li>${i}</li>`).join("")}</ul>` : "") +
      (d.facts?.length ? `<h2 style="${S.h2}">Có thể bạn chưa biết</h2>${bullets(d.facts)}` : "") +
      (d.travelTips?.length ? `<h2 style="${S.h2}">Mẹo du lịch</h2>${bullets(d.travelTips)}` : "") +
      (d.sourceUrl ? `<p style="${S.dim}">Nguồn: ${link(d.sourceUrl, d.sourceUrl)}</p>` : ""),
  );
}

/** Dish overlay (?dish=…) — a card on top of the map, so it gets a card's worth of content. */
export function dishBody(
  cc: string,
  dish: { name: string; emoji: string; summary: string; story: string; ingredients: string[]; flavor: string },
): string {
  return shell(
    `<p style="${S.crumb}">${link("/", "FechTin Go")} · ${link(`/${cc}`, countryName(cc))}</p>` +
      `<h1 style="${S.h1}">${esc(dish.emoji)} ${esc(dish.name)}</h1>` +
      `<p style="${S.p}">${esc(dish.summary)}</p>` +
      (dish.story ? `<p style="${S.p}">${esc(dish.story)}</p>` : "") +
      (dish.flavor ? `<p style="${S.p}"><strong>Hương vị:</strong> ${esc(dish.flavor)}</p>` : "") +
      (dish.ingredients?.length ? `<h2 style="${S.h2}">Nguyên liệu</h2>${bullets(dish.ingredients)}` : ""),
  );
}
