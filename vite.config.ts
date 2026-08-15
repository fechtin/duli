/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { COUNTRY_ORDER, labelList, labelOf } from "./src/lib/country/names";
import { DEFAULT_LOCALE, HREFLANG, SEO_LOCALES, withLocale } from "./src/lib/seo/urls";
import { SITE_URL } from "./scripts/site";

/**
 * Fills the homepage's static <head> and its crawler-visible links from the country registry.
 *
 * "/" is the one route Cloudflare's asset layer answers without invoking the Worker (see
 * wrangler.toml), so it cannot be rendered per-request like every other page. Baking it here
 * keeps a single source of truth: adding a country changes src/lib/country/names.ts and the
 * homepage follows, instead of drifting into naming only Vietnam.
 */
function homepageSeo() {
  const links = COUNTRY_ORDER.map(
    (cc) =>
      `<li style="margin:0 0 0.5rem"><a href="/${cc}" style="color:#7dd3c0;text-decoration:none">` +
      `Khám phá ${labelOf(cc)}</a></li>`,
  ).join("\n          ");

  // hreflang must be reciprocal and self-referencing or Google discards the whole cluster —
  // the locale-prefixed homepages the Worker renders all point back here, so "/" must point out.
  const hreflang = SEO_LOCALES.flatMap((locale) => {
    const href = `${SITE_URL}${withLocale(locale, "/")}`;
    const tags = [`<link rel="alternate" hreflang="${HREFLANG[locale]}" href="${href}" />`];
    if (locale === DEFAULT_LOCALE) {
      tags.push(`<link rel="alternate" hreflang="x-default" href="${href}" />`);
    }
    return tags;
  }).join("\n    ");

  return {
    name: "homepage-seo",
    transformIndexHtml: (html: string) =>
      html
        .replaceAll("%ATLASES%", labelList("vi", "và"))
        .replaceAll("%COUNTRY_LINKS%", links)
        .replaceAll("%HREFLANG%", hreflang)
        .replaceAll("%SITE_URL%", SITE_URL),
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), homepageSeo()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@data": fileURLToPath(new URL("./data", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Proxy the API to the local Cloudflare Worker (wrangler dev) when running both.
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  build: {
    target: "es2022",
    cssTarget: "chrome111",
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the map engine + projection math out of the initial bundle.
          map: ["d3-geo"],
          motion: ["motion"],
        },
      },
    },
  },
});
