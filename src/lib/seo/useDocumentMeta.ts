import { useEffect } from "react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { useI18n } from "@/lib/i18n";
import { getProvinceMeta } from "@/lib/api/content";

// Dynamic document head + JSON-LD per selection (Bible 004 §10 SEO).
// SPA-side; a Worker could additionally render these tags server-side for crawlers.

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
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
  const { locale } = useI18n();
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const destinations = useContentStore((s) => s.destinations);

  useEffect(() => {
    const brand = "Vietnam Interactive Tourism Atlas";
    let title = brand;
    let description =
      locale === "en"
        ? "Explore Vietnam through one living, interactive map — stories, photos and your own journey."
        : "Khám phá Việt Nam qua một tấm bản đồ sống động — câu chuyện, hình ảnh và hành trình của riêng bạn.";
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
        address: { "@type": "PostalAddress", addressCountry: "VN", addressRegion: province?.name },
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
          address: { "@type": "PostalAddress", addressCountry: "VN" },
        };
      }
    }

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("name", "twitter:card", "summary_large_image");
    setJsonLd(ld);
  }, [locale, selectedProvince, selectedDestination, destinations]);
}
