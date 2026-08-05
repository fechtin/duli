// The site's canonical origin — the single answer to "where does this atlas live".
//
// Build-time only. Read by scripts/build-sitemap.mjs (every <loc> and the robots.txt Sitemap
// line) and by vite.config.ts (the homepage's static canonical). Getting it wrong is not a
// visible bug: a sitemap listing another origin's URLs is silently ignored by Google, which is
// exactly how this site sat un-indexed while pointing at a dead vietnam-atlas.pages.dev.
export const SITE_URL = (process.env.SITE_URL || "https://go.fechtin.com").replace(/\/$/, "");
