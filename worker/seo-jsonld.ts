// JSON-LD payloads, kept out of ./meta so that file stays about routing and <head> rewriting.
//
// Everything here is built from the same D1 rows that produce the visible body in ./seo-body —
// structured data that claims more than the page shows is a manual-action risk, so the FAQ
// entries in particular reuse `faqPairs` rather than re-deriving the questions.

import type { Destination } from "../src/lib/types";
import type { Locale } from "../src/lib/i18n/dictionaries";
import { FOOD_SEGMENT, withLocale } from "../src/lib/seo/urls";
import { faqPairs } from "./seo-body";
import manifest from "../src/data/generated/image-manifest.json";

const IMAGES = manifest as Record<string, { src: string }>;

/** Absolute URL for a locale-free path, in the reader's locale. */
type Abs = (path: string) => string;

export function absoluteFor(origin: string, locale: Locale): Abs {
  return (path: string) => `${origin}${withLocale(locale, path)}`;
}

/**
 * A dish photo that actually exists, as an absolute URL. Roughly half the dishes have none
 * (see 037), so a card image has to be looked up rather than assumed from the id.
 */
export function dishImageUrl(origin: string, dishId: string): string | undefined {
  const src = IMAGES[`dish-${dishId}`]?.src;
  return src ? `${origin}${src}` : undefined;
}

/** Gallery photos that actually exist on disk, as absolute URLs. */
export function galleryUrls(origin: string, d: Destination): string[] {
  return (d.gallery ?? [])
    .map((g) => IMAGES[g.seed]?.src)
    .filter((src): src is string => Boolean(src))
    .map((src) => `${origin}${src}`);
}

/**
 * "07:00 – 18:00" → an OpeningHoursSpecification. The column is free text written for humans
 * ("Cả ngày", "24/7", "Theo lịch lễ hội"), so anything that isn't an unambiguous time range is
 * dropped rather than guessed at.
 */
function openingHours(text: string | undefined): object | null {
  const m = text?.match(/(\d{1,2}):(\d{2})\s*[–\-—]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const pad = (h: string, mi: string) => `${h.padStart(2, "0")}:${mi}`;
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: pad(m[1], m[2]),
    closes: pad(m[3], m[4]),
  };
}

function breadcrumb(abs: Abs, trail: { name: string; path: string }[]): object {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/** Wrap one or more nodes as a single @graph document. */
const graph = (nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export function countryLd(
  abs: Abs,
  cc: string,
  name: string,
  count: number,
  locale: Locale,
): object {
  return graph([
    {
      "@type": "CollectionPage",
      name,
      url: abs(`/${cc}`),
      inLanguage: locale,
      numberOfItems: count,
    },
    breadcrumb(abs, [
      { name: "FechTin Go", path: "/" },
      { name, path: `/${cc}` },
    ]),
  ]);
}

/**
 * The cuisine index (`/{cc}/food`) — a CollectionPage whose ItemList names every dish and links
 * to its own page. This is the only structured place the dishes are enumerated: before it
 * existed they were reachable only through the country page's flat link list.
 */
export function foodIndexLd(
  abs: Abs,
  cc: string,
  countryLabel: string,
  cuisineLabel: string,
  description: string,
  dishes: { id: string; name: string }[],
  locale: Locale,
): object {
  const url = abs(`/${cc}/${FOOD_SEGMENT}`);
  return graph([
    {
      "@type": "CollectionPage",
      name: `${cuisineLabel} — ${countryLabel}`,
      description,
      url,
      inLanguage: locale,
      numberOfItems: dishes.length,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: dishes.length,
        itemListElement: dishes.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.name,
          url: abs(`/${cc}/${FOOD_SEGMENT}/${d.id}`),
        })),
      },
    },
    breadcrumb(abs, [
      { name: "FechTin Go", path: "/" },
      { name: countryLabel, path: `/${cc}` },
      { name: cuisineLabel, path: `/${cc}/${FOOD_SEGMENT}` },
    ]),
  ]);
}

export function provinceLd(
  abs: Abs,
  origin: string,
  cc: string,
  countryLabel: string,
  province: { slug: string; name: string },
  description: string,
  locale: Locale,
  heroImage?: string,
): object {
  return graph([
    {
      "@type": "Place",
      name: province.name,
      description,
      url: abs(`/${cc}/${province.slug}`),
      inLanguage: locale,
      ...(heroImage ? { image: `${origin}${heroImage}` } : {}),
      address: { "@type": "PostalAddress", addressCountry: cc.toUpperCase() },
    },
    breadcrumb(abs, [
      { name: "FechTin Go", path: "/" },
      { name: countryLabel, path: `/${cc}` },
      { name: province.name, path: `/${cc}/${province.slug}` },
    ]),
  ]);
}

export function destinationLd(
  abs: Abs,
  origin: string,
  cc: string,
  countryLabel: string,
  province: { slug: string; name: string },
  d: Destination,
  description: string,
  locale: Locale,
): object {
  const url = abs(`/${cc}/${province.slug}/${d.slug}`);
  const images = galleryUrls(origin, d);
  const hours = openingHours(d.openingHours);
  const faq = faqPairs(d, locale);

  const attraction: Record<string, unknown> = {
    "@type": "TouristAttraction",
    name: d.name,
    description,
    url,
    inLanguage: locale,
    geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
    address: {
      "@type": "PostalAddress",
      addressRegion: province.name,
      addressCountry: cc.toUpperCase(),
    },
    // "" means free — see the Destination.ticket contract in src/lib/types.ts.
    isAccessibleForFree: !d.ticket,
    publicAccess: true,
  };
  if (images.length) attraction.image = images;
  if (hours) attraction.openingHoursSpecification = hours;
  if (d.sourceUrl) attraction.sameAs = [d.sourceUrl];
  if (d.verifiedAt) attraction.dateModified = d.verifiedAt;

  const nodes: object[] = [
    attraction,
    breadcrumb(abs, [
      { name: "FechTin Go", path: "/" },
      { name: countryLabel, path: `/${cc}` },
      { name: province.name, path: `/${cc}/${province.slug}` },
      { name: d.name, path: `/${cc}/${province.slug}/${d.slug}` },
    ]),
  ];
  // Only claim an FAQ when the same questions are rendered in the body above.
  if (faq.length) {
    nodes.push({
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    });
  }
  return graph(nodes);
}

export function dishLd(
  abs: Abs,
  origin: string,
  cc: string,
  countryLabel: string,
  cuisineLabel: string,
  dish: { id: string; name: string; summary: string; story: string; ingredients: string[] },
  description: string,
  locale: Locale,
): object {
  const img = IMAGES[`dish-${dish.id}`]?.src;
  return graph([
    {
      // schema.org has no "Food" type (the old markup here claimed one). Recipe is the closest
      // real type but needs recipeInstructions we don't have, and an incomplete Recipe just
      // fills Search Console with warnings — so: a Thing, typed precisely via Wikidata.
      "@type": "Thing",
      additionalType: "https://www.wikidata.org/wiki/Q2095",
      name: dish.name,
      description,
      inLanguage: locale,
      url: abs(`/${cc}/${FOOD_SEGMENT}/${dish.id}`),
      ...(img ? { image: `${origin}${img}` } : {}),
    },
    // A trail the URL actually matches (043): every rung here is a real, self-canonical page.
    breadcrumb(abs, [
      { name: "FechTin Go", path: "/" },
      { name: countryLabel, path: `/${cc}` },
      { name: cuisineLabel, path: `/${cc}/${FOOD_SEGMENT}` },
      { name: dish.name, path: `/${cc}/${FOOD_SEGMENT}/${dish.id}` },
    ]),
  ]);
}
