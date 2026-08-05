// Server-side <head> injection for crawlers & social scrapers (SEO / OG cards).
// The SPA sets these same tags client-side via src/lib/seo/useDocumentMeta.ts, but
// bots that don't run JS only ever see the static index.html. Here we fill the
// correct per-URL <head> at the edge so a shared /hoi-an link renders a proper card.
//
// The matching <body> content — what a non-rendering crawler actually reads — is built in
// ./seo-body and injected into #root by injectMeta().

import * as db from "./db";
import type { D1Like } from "./db";
import { countryBody, countryName, destinationBody, dishBody, provinceBody } from "./seo-body";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Like;
}

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  /** Self-referencing canonical. Query strings other than ?dish= are stripped. */
  canonical: string;
  image?: string;
  type: "website" | "article";
  jsonLd: object;
  /** Pre-hydration markup for #root; see ./seo-body. */
  body?: string;
}

const BRAND = "FechTin Go";

/** Collapse whitespace and clamp to a scraper-friendly length. */
function clamp(text: string | null | undefined, max = 200): string {
  const s = (text ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Build the per-URL metadata, or null for paths we don't recognise (let the SPA 404 them). */
export async function buildMeta(env: Env, url: URL): Promise<PageMeta | null> {
  const origin = url.origin;
  const clean = `${origin}${url.pathname}`;
  const raw = url.pathname.split("/").filter(Boolean);
  // URLs are /{country}/{province}/{destination}; links minted before the country prefix
  // (/{province}/…) still resolve against Vietnam.
  const country = raw[0] === "kr" || raw[0] === "vn" ? raw[0] : "vn";
  const segments = raw[0] === "kr" || raw[0] === "vn" ? raw.slice(1) : raw;
  const dishId = url.searchParams.get("dish");

  // A dish overlay (?dish=…) rides on top of any map context — it wins the card.
  if (dishId) {
    const dish = await db.getDish(env.DB, dishId, undefined, country);
    if (dish) {
      const name = dish.emoji ? `${dish.emoji} ${dish.name}` : dish.name;
      return {
        title: `${name} — Ẩm thực | ${BRAND}`,
        description: clamp(dish.summary || dish.story),
        url: url.href,
        canonical: `${clean}?dish=${dish.id}`,
        image: `${origin}/img/dishes/${dish.id}.webp`,
        type: "article",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Food",
          name: dish.name,
          description: clamp(dish.summary || dish.story),
        },
        body: dishBody(country, dish),
      };
    }
  }

  // "/" never reaches here — Cloudflare's asset layer answers it directly (wrangler.toml
  // [assets]), so the homepage's canonical and links are static in index.html.

  // "/vn", "/kr" — the province index. Without it nothing links to a province page.
  if (segments.length === 0) {
    const provinces = await db.getProvinceIndex(env.DB, country);
    if (!provinces.length) return null;
    const name = countryName(country);
    return {
      title: `${name} | ${BRAND}`,
      description: clamp(`Khám phá ${name} qua bản đồ sống động — ${provinces.length} tỉnh thành, địa điểm, câu chuyện và hình ảnh.`),
      url: clean,
      canonical: clean,
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        url: clean,
        numberOfItems: provinces.length,
      },
      body: countryBody(country, provinces),
    };
  }

  const [provinceSlug, destSlug] = segments;
  const bundle = await db.getProvinceBundle(env.DB, provinceSlug, undefined, country);
  if (!bundle) return null; // unknown path → let the SPA handle / 404 gracefully

  if (destSlug) {
    const dest = bundle.destinations.find((d) => d.slug === destSlug);
    if (dest) {
      const seed = dest.gallery?.[0]?.seed;
      return {
        title: `${dest.name} — ${bundle.meta.name} | ${BRAND}`,
        description: clamp(dest.summary),
        url: clean,
        canonical: clean,
        image: seed ? `${origin}/img/${seed}.webp` : undefined,
        type: "article",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "TouristAttraction",
          name: dest.name,
          description: clamp(dest.summary),
          url: clean,
          geo: { "@type": "GeoCoordinates", latitude: dest.lat, longitude: dest.lng },
          address: {
            "@type": "PostalAddress",
            addressRegion: bundle.meta.name,
            addressCountry: country.toUpperCase(),
          },
        },
        body: destinationBody(country, bundle.meta, dest),
      };
    }
  }

  // Province landing. Province content has no gallery of its own — borrow the first
  // featured destination's lead image so the card still carries a photo.
  const seed = bundle.destinations.find((d) => d.gallery?.[0]?.seed)?.gallery[0]?.seed;
  const summary = bundle.content?.summary ?? "";
  return {
    title: `${bundle.meta.name} | ${BRAND}`,
    description: clamp(
      summary || `Khám phá ${bundle.meta.name} qua bản đồ sống động — địa điểm, câu chuyện và hình ảnh.`,
    ),
    url: clean,
    canonical: clean,
    image: seed ? `${origin}/img/${seed}.webp` : undefined,
    type: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Place",
      name: bundle.meta.name,
      description: clamp(summary),
      url: clean,
    },
    body: provinceBody(country, bundle.meta, bundle.content, bundle.destinations),
  };
}

/** Rewrite an index.html Response with the resolved metadata (<head>) and content (#root). */
export function injectMeta(res: Response, meta: PageMeta): Response {
  const rewriter = new HTMLRewriter()
    .on("title", {
      element(el) {
        el.setInnerContent(meta.title);
      },
    })
    .on('meta[name="description"]', {
      element(el) {
        el.setAttribute("content", meta.description);
      },
    })
    // index.html carries the homepage's canonical and og:url (it is the one route the asset
    // layer answers directly, so the Worker can't render them). Retarget rather than append —
    // two canonicals on a page is the same as none, Google discards both.
    .on('link[rel="canonical"]', {
      element(el) {
        el.setAttribute("href", meta.canonical);
      },
    })
    .on('meta[property="og:url"]', {
      element(el) {
        el.setAttribute("content", meta.canonical);
      },
    })
    .on("head", {
      element(el) {
        const tags: Array<[string, string]> = [
          ["og:title", meta.title],
          ["og:description", meta.description],
          ["og:type", meta.type],
          ["og:locale", "vi_VN"], // og:url is retargeted above, not appended — index.html has one.
          ["twitter:card", meta.image ? "summary_large_image" : "summary"],
          ["twitter:title", meta.title],
          ["twitter:description", meta.description],
        ];
        if (meta.image) {
          tags.push(["og:image", meta.image], ["twitter:image", meta.image]);
        }
        for (const [key, value] of tags) {
          const attr = key.startsWith("og:") ? "property" : "name";
          el.append(`<meta ${attr}="${key}" content="${escapeAttr(value)}" />`, { html: true });
        }
        // JSON-LD: escape "<" so the payload can never break out of the <script>.
        const ld = JSON.stringify(meta.jsonLd).replace(/</g, "\\u003c");
        el.append(`<script type="application/ld+json">${ld}</script>`, { html: true });
      },
    });

  // createRoot() clears #root before its first paint, so this content is only ever seen by a
  // crawler that doesn't run JS — and by a reader whose bundle hasn't arrived yet.
  if (meta.body) {
    rewriter.on("#root", {
      element(el) {
        el.setInnerContent(meta.body!, { html: true });
      },
    });
  }

  return rewriter.transform(res);
}

/** Escape a value for use inside a double-quoted HTML attribute. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
