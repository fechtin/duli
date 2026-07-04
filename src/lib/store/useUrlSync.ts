import { useCallback, useEffect, useRef } from "react";
import { useMapStore } from "./useMapStore";
import { useContentStore, findDestinationBySlug } from "./useContentStore";
import { getProvinceMeta } from "@/lib/api/content";

/**
 * Two-way sync between selection state and the URL path (Bible 005 §3.3 — navigate by
 * camera, then sync the URL). Format: /{province} or /{province}/{destination}.
 * Destination deep-links resolve once the lightweight content list has loaded.
 */
export function useUrlSync() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const ready = useContentStore((s) => s.ready);
  const applied = useRef(false);

  const applyFromUrl = useCallback(() => {
    const [provinceSlug, destSlug] = window.location.pathname.split("/").filter(Boolean);
    const store = useMapStore.getState();
    applied.current = true;
    if (provinceSlug && getProvinceMeta(provinceSlug)) {
      if (destSlug) {
        const d = findDestinationBySlug(provinceSlug, destSlug);
        if (d) {
          store.selectDestination(d.id, provinceSlug);
          store.requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
          return;
        }
        // destination not loaded yet — fall back to the province until content is ready
      }
      store.selectProvince(provinceSlug);
    } else {
      store.reset();
    }
  }, []);

  // Apply on mount and re-resolve once content (for destination deep-links) is ready.
  useEffect(() => {
    applyFromUrl();
  }, [ready, applyFromUrl]);

  useEffect(() => {
    window.addEventListener("popstate", applyFromUrl);
    return () => window.removeEventListener("popstate", applyFromUrl);
  }, [applyFromUrl]);

  // Reflect selection changes back into the URL. Read LIVE store state (not the subscribed
  // props): on first mount this effect runs in the same commit as applyFromUrl, whose
  // selectProvince() already updated the store synchronously — the props here are still the
  // stale nulls from the initial render and would clobber a deep-link URL back to "/".
  useEffect(() => {
    if (!applied.current) return;
    const live = useMapStore.getState();
    let path = "/";
    if (live.selectedDestination) {
      const d = useContentStore.getState().destinations.find((x) => x.id === live.selectedDestination);
      if (d) path = `/${d.provinceSlug}/${d.slug}`;
    } else if (live.selectedProvince) {
      path = `/${live.selectedProvince}`;
    }
    if (path !== window.location.pathname) window.history.replaceState(null, "", path);
  }, [selectedProvince, selectedDestination]);
}
