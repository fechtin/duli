// Server-side <head> injection for crawlers & social scrapers (SEO / OG cards).
// The SPA sets these same tags client-side via src/lib/seo/useDocumentMeta.ts, but
// bots that don't run JS only ever see the static index.html. Here we fill the
// correct per-URL <head> at the edge so a shared /hoi-an link renders a proper card.
//
// The matching <body> content — what a non-rendering crawler actually reads — is built in
// ./seo-body, and the structured data in ./seo-jsonld.
//
// The URL's locale prefix (see src/lib/seo/urls.ts) decides the language of everything here:
// the D1 rows, the copy, the canonical and the hreflang set. Five locales on one URL meant
// Google could only ever index the Vietnamese one.

import * as db from "./db";
import type { D1Like } from "./db";
import { countryBody, countryName, destinationBody, dishBody, homeBody, provinceBody } from "./seo-body";
import { absoluteFor, countryLd, destinationLd, dishLd, galleryUrls, provinceLd } from "./seo-jsonld";
import { translate, type Locale } from "../src/lib/i18n/dictionaries";
import { alternatesOf, DEFAULT_LOCALE, HREFLANG, OG_LOCALE, splitLocale, withLocale } from "../src/lib/seo/urls";
import { COUNTRY_ORDER } from "../src/lib/country/names";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  DB: D1Like;
}

export interface PageMeta {
  title: string;
  description: string;
  url: string;
  /** Self-referencing canonical, already locale-prefixed. */
  canonical: string;
  image?: string;
  type: "website" | "article";
  jsonLd: object;
  /** Pre-hydration markup for #root; see ./seo-body. */
  body?: string;
  locale: Locale;
  /** Locale-free path, used to mint the hreflang set. */
  path: string;
  /** Query string to carry onto every alternate (only ?dish= survives canonicalisation). */
  query: string;
  /** Set for paths that resolve to nothing — served as a real 404 rather than a soft one. */
  notFound?: boolean;
}

const BRAND = "FechTin Go";

/** Collapse whitespace and clamp to a scraper-friendly length. */
function clamp(text: string | null | undefined, max = 200): string {
  const s = (text ?? "").replace(/\s+/g, " ").trim();
  return s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s;
}

/** Build the per-URL metadata. Never returns null: an unresolvable path is a 404, not a blank. */
export async function buildMeta(env: Env, url: URL): Promise<PageMeta> {
  const origin = url.origin;
  const { locale, path } = splitLocale(url.pathname);
  const abs = absoluteFor(origin, locale);
  const t = (key: string, params?: Record<string, string | number>) => translate(locale, key, params);

  const raw = path.split("/").filter(Boolean);
  // URLs are /{country}/{province}/{destination}; links minted before the country prefix
  // (/{province}/…) still resolve against Vietnam.
  const country = raw[0] === "kr" || raw[0] === "vn" ? raw[0] : "vn";
  const segments = raw[0] === "kr" || raw[0] === "vn" ? raw.slice(1) : raw;
  const dishId = url.searchParams.get("dish");
  const label = countryName(country, locale);

  const base = { locale, query: "" };

  // A dish overlay (?dish=…) rides on top of any map context — it wins the card. Its canonical
  // is always the country-level URL: the same card on /vn, /vn/quang-nam and /vn/qn/hoi-an is
  // one page, and three self-referencing canonicals made it three duplicates.
  if (dishId) {
    const dish = await db.getDish(env.DB, dishId, locale, country);
    if (dish) {
      const name = dish.emoji ? `${dish.emoji} ${dish.name}` : dish.name;
      const description = clamp(dish.summary || dish.story);
      const dishPath = `/${country}`;
      return {
        ...base,
        title: `${name} — ${t("seo.cuisine")} | ${BRAND}`,
        description,
        url: url.href,
        canonical: `${abs(dishPath)}?dish=${dish.id}`,
        image: `${origin}/img/dishes/${dish.id}.webp`,
        type: "article",
        jsonLd: dishLd(abs, origin, country, label, dish, description, locale),
        body: dishBody(country, locale, dish),
        path: dishPath,
        query: `?dish=${dish.id}`,
      };
    }
  }

  // "/" is answered by Cloudflare's asset layer and never reaches the Worker, but "/en", "/ko"…
  // do — a locale-prefixed homepage is a real page and needs its own copy.
  if (path === "/") {
    const countries = COUNTRY_ORDER.map((cc) => ({ cc, name: countryName(cc, locale) }));
    return {
      ...base,
      title: `${BRAND} — ${t("app.tagline", { country: countries.map((c) => c.name).join(" · ") })}`,
      description: t("seo.description", { country: countries.map((c) => c.name).join(" · ") }),
      url: abs("/"),
      canonical: abs("/"),
      type: "website",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: BRAND,
        url: abs("/"),
        inLanguage: locale,
      },
      body: homeBody(locale, countries),
      path: "/",
    };
  }

  // "/vn", "/kr" — the province index. Without it nothing links to a province page.
  if (segments.length === 0) {
    const provinces = await db.getProvinceIndex(env.DB, country);
    if (!provinces.length) return notFound(origin, locale, path, t);
    const dishes = await db.getDishes(env.DB, undefined, locale, country);
    return {
      ...base,
      title: `${label} | ${BRAND}`,
      description: clamp(t("seo.countryDesc", { country: label, count: provinces.length })),
      url: abs(`/${country}`),
      canonical: abs(`/${country}`),
      type: "website",
      jsonLd: countryLd(abs, country, label, provinces.length, locale),
      body: countryBody(country, locale, provinces, dishes),
      path: `/${country}`,
    };
  }

  const [provinceSlug, destSlug] = segments;
  const bundle = await db.getProvinceBundle(env.DB, provinceSlug, locale, country);
  if (!bundle) return notFound(origin, locale, path, t);

  if (destSlug) {
    const dest = bundle.destinations.find((d) => d.slug === destSlug);
    // A slug that doesn't resolve is a 404, not the province page wearing the wrong URL. The
    // old fallthrough served every typo as a 200 with a self-canonical — unbounded duplicates.
    if (!dest) return notFound(origin, locale, path, t);

    const description = clamp(dest.summary);
    const destPath = `/${country}/${provinceSlug}/${dest.slug}`;
    return {
      ...base,
      title: `${dest.name} — ${bundle.meta.name} | ${BRAND}`,
      description,
      url: abs(destPath),
      canonical: abs(destPath),
      image: galleryUrls(origin, dest)[0],
      type: "article",
      jsonLd: destinationLd(abs, origin, country, label, bundle.meta, dest, description, locale),
      body: destinationBody(country, locale, bundle.meta, dest),
      path: destPath,
    };
  }

  // Province landing. Province content has no gallery of its own — borrow the first
  // featured destination's lead image so the card still carries a photo.
  const heroDest = bundle.destinations.find((d) => galleryUrls(origin, d).length);
  const heroUrl = heroDest ? galleryUrls(origin, heroDest)[0] : undefined;
  const summary = bundle.content?.summary ?? "";
  const description = clamp(summary || t("seo.provinceDesc", { name: bundle.meta.name }));
  const provincePath = `/${country}/${provinceSlug}`;
  return {
    ...base,
    title: `${bundle.meta.name} | ${BRAND}`,
    description,
    url: abs(provincePath),
    canonical: abs(provincePath),
    image: heroUrl,
    type: "article",
    jsonLd: provinceLd(
      abs,
      origin,
      country,
      label,
      bundle.meta,
      description,
      locale,
      heroUrl?.replace(origin, ""),
    ),
    body: provinceBody(country, locale, bundle.meta, bundle.content, bundle.destinations),
    path: provincePath,
  };
}

function notFound(
  origin: string,
  locale: Locale,
  path: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): PageMeta {
  const home = `${origin}${withLocale(locale, "/")}`;
  return {
    locale,
    path,
    query: "",
    title: `404 | ${BRAND}`,
    description: t("seo.description", { country: BRAND }),
    url: `${origin}${withLocale(locale, path)}`,
    canonical: home,
    type: "website",
    jsonLd: { "@context": "https://schema.org", "@type": "WebPage", name: "404" },
    notFound: true,
  };
}

/** Rewrite an index.html Response with the resolved metadata (<head>) and content (#root). */
export function injectMeta(res: Response, meta: PageMeta): Response {
  const alternates = alternatesOf(meta.path);
  const origin = new URL(meta.canonical).origin;

  const rewriter = new HTMLRewriter()
    // The shell ships lang="vi"; a Korean page claiming Vietnamese is a bad quality signal
    // and makes browser translation offer the wrong direction.
    .on("html", {
      element(el) {
        el.setAttribute("lang", HREFLANG[meta.locale]);
      },
    })
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
    // index.html carries the *homepage's* hreflang cluster (static, for the one route the asset
    // layer answers itself). On every other route it is wrong, and a page advertising two
    // clusters gets both ignored — drop them before appending this page's own set below.
    .on('link[rel="alternate"][hreflang]', {
      element(el) {
        el.remove();
      },
    })
    .on("head", {
      element(el) {
        const tags: Array<[string, string]> = [
          ["og:title", meta.title],
          ["og:description", meta.description],
          ["og:type", meta.type],
          ["og:locale", OG_LOCALE[meta.locale]], // og:url is retargeted above, not appended.
          ["twitter:card", meta.image ? "summary_large_image" : "summary"],
          ["twitter:title", meta.title],
          ["twitter:description", meta.description],
        ];
        for (const { locale } of alternates) {
          if (locale !== meta.locale) tags.push(["og:locale:alternate", OG_LOCALE[locale]]);
        }
        if (meta.image) {
          tags.push(["og:image", meta.image], ["twitter:image", meta.image]);
        }
        for (const [key, value] of tags) {
          const attr = key.startsWith("og:") ? "property" : "name";
          el.append(`<meta ${attr}="${key}" content="${escapeAttr(value)}" />`, { html: true });
        }

        if (meta.notFound) {
          el.append(`<meta name="robots" content="noindex,follow" />`, { html: true });
        } else {
          // hreflang must be reciprocal and include a self-reference, or Google discards the
          // whole cluster. x-default points at the source language.
          for (const { locale, path } of alternates) {
            const href = escapeAttr(`${origin}${path}${meta.query}`);
            el.append(
              `<link rel="alternate" hreflang="${HREFLANG[locale]}" href="${href}" />`,
              { html: true },
            );
            if (locale === DEFAULT_LOCALE) {
              el.append(`<link rel="alternate" hreflang="x-default" href="${href}" />`, { html: true });
            }
          }
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

  const out = rewriter.transform(res);
  if (!meta.notFound) return out;
  return new Response(out.body, { status: 404, headers: out.headers });
}

/** Escape a value for use inside a double-quoted HTML attribute. */
function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
