import { useEffect } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useI18n } from "@/lib/i18n";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { countryLabel } from "@/lib/country";
import { getProvinceMeta } from "@/lib/api/content";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { alternatesOf, DEFAULT_LOCALE, HREFLANG, splitLocale, withLocale } from "./urls";

// Dynamic document head + JSON-LD per selection (Bible 004 §10 SEO).
//
// The same tags are rendered server-side by worker/meta.ts, which is what a crawler that
// doesn't run JS sees. This hook keeps them right for a reader who navigates the map without
// a page load — including the canonical, which would otherwise still name the entry URL after
// the app has moved on (a bare "/" resolves to "/vn" on the first frame).

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Rewrite the hreflang cluster for the current path. The Worker ships a correct set with the
 * HTML, but a reader (or a rendering crawler) who navigates the map never reloads — leaving
 * Hội An advertising the homepage's alternates.
 */
function setAlternates(origin: string, path: string, query: string) {
  for (const el of document.head.querySelectorAll('link[rel="alternate"][hreflang]')) el.remove();
  for (const { locale, path: localised } of alternatesOf(path)) {
    const href = `${origin}${localised}${query}`;
    for (const lang of locale === DEFAULT_LOCALE ? [HREFLANG[locale], "x-default"] : [HREFLANG[locale]]) {
      const el = document.createElement("link");
      el.rel = "alternate";
      el.hreflang = lang;
      el.href = href;
      document.head.appendChild(el);
    }
  }
}

function setJsonLd(data: object | null) {
  let el = document.getElementById("ld-json");
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = "ld-json";
    (el as HTMLScriptElement).type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useDocumentMeta() {
  const { locale, t } = useI18n();
  const country = useCountryStore((s) => s.country);
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const destinations = useContentStore((s) => s.destinations);
  const openDishId = useFoodStore((s) => s.openDishId);

  useEffect(() => {
    const brand = "FechTin Go";
    let title = brand;
    // Names the atlas being browsed, never a country literal — see useCountryName's warning.
    let description = t("seo.description", { country: countryLabel(country, locale) });
    let ld: object | null = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: brand,
      inLanguage: locale,
    };

    const dest = selectedDestination ? destinations.find((d) => d.id === selectedDestination) : undefined;
    if (dest) {
      const province = getProvinceMeta(dest.provinceSlug);
      title = `${dest.name} — ${province?.name ?? ""} | ${brand}`;
      description = dest.summary;
      ld = {
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        name: dest.name,
        description: dest.summary,
        geo: { "@type": "GeoCoordinates", latitude: dest.lat, longitude: dest.lng },
        containedInPlace: { "@type": "Place", name: province?.name },
        address: { "@type": "PostalAddress", addressCountry: country.toUpperCase(), addressRegion: province?.name },
      };
    } else if (selectedProvince) {
      const province = getProvinceMeta(selectedProvince);
      if (province) {
        title = `${province.name} | ${brand}`;
        ld = {
          "@context": "https://schema.org",
          "@type": "Place",
          name: province.name,
          description,
          address: { "@type": "PostalAddress", addressCountry: country.toUpperCase() },
        };
      }
    }

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("name", "twitter:card", "summary_large_image");
    // Canonical is built from the path, never from location.href: tracking params must not mint
    // a second URL, and an open dish is one page (/{cc}?dish=…) no matter which map view it
    // opened over — three self-canonicals for the same card is three duplicates to Google.
    const { origin } = window.location;
    const { path } = splitLocale(window.location.pathname);
    const cleanPath = openDishId ? `/${country}` : path;
    const query = openDishId ? `?dish=${openDishId}` : "";
    const canonical = `${origin}${withLocale(locale, cleanPath)}${query}`;

    upsertMeta("property", "og:url", canonical);
    setCanonical(canonical);
    setAlternates(origin, cleanPath, query);
    setJsonLd(ld);
  }, [locale, t, country, selectedProvince, selectedDestination, destinations, openDishId]);
}
