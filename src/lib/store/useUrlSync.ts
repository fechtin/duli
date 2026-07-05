import { useCallback, useEffect, useRef } from "react";
import { useMapStore } from "./useMapStore";
import { useFoodStore } from "./useFoodStore";
import { useContentStore, findDestinationBySlug } from "./useContentStore";
import { getProvinceMeta } from "@/lib/api/content";

/**
 * Two-way sync between selection state and the URL (Bible 005 §3.3 — navigate by camera,
 * then sync the URL). Format: /{province} or /{province}/{destination}, with an open dish
 * carried as ?dish=<id> on top of either. Each deeper layer PUSHES a history entry so the
 * browser Back button steps back one layer (dish → destination → province → map); shallower
 * moves REPLACE, so closing never leaves dangling forward entries.
 */

/** Layer depth of the current selection, used to decide push vs replace. */
function depthOf(hasDish: boolean, hasDest: boolean, hasProvince: boolean) {
  if (hasDish) return 3;
  if (hasDest) return 2;
  if (hasProvince) return 1;
  return 0;
}

function currentUrlDepth() {
  const [province, dest] = window.location.pathname.split("/").filter(Boolean);
  const dish = new URLSearchParams(window.location.search).has("dish");
  return depthOf(dish, Boolean(dest), Boolean(province));
}

export function useUrlSync() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const openDishId = useFoodStore((s) => s.openDishId);
  const ready = useContentStore((s) => s.ready);
  const applied = useRef(false);
  const prevDepth = useRef(currentUrlDepth());

  const applyFromUrl = useCallback(() => {
    const [provinceSlug, destSlug] = window.location.pathname.split("/").filter(Boolean);
    const dishId = new URLSearchParams(window.location.search).get("dish");
    const map = useMapStore.getState();
    const food = useFoodStore.getState();
    applied.current = true;

    if (provinceSlug && getProvinceMeta(provinceSlug)) {
      if (destSlug) {
        const d = findDestinationBySlug(provinceSlug, destSlug);
        if (d) {
          map.selectDestination(d.id, provinceSlug);
          map.requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
        } else {
          // destination not loaded yet — fall back to the province until content is ready
          map.selectProvince(provinceSlug);
        }
      } else {
        map.selectProvince(provinceSlug);
      }
    } else {
      map.reset();
    }

    // Reconcile the dish layer that rides on top of the map context.
    if (dishId) {
      if (food.openDishId !== dishId) food.openDish(dishId);
    } else if (food.openDishId) {
      food.closeDish();
    }

    prevDepth.current = currentUrlDepth();
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
    const dishId = useFoodStore.getState().openDishId;

    let path = "/";
    if (live.selectedDestination) {
      const d = useContentStore.getState().destinations.find((x) => x.id === live.selectedDestination);
      if (d) path = `/${d.provinceSlug}/${d.slug}`;
    } else if (live.selectedProvince) {
      path = `/${live.selectedProvince}`;
    }
    if (dishId && path !== "/") path += `?dish=${dishId}`;

    const nextDepth = depthOf(Boolean(dishId), Boolean(live.selectedDestination), Boolean(live.selectedProvince));
    const current = window.location.pathname + window.location.search;
    if (path !== current) {
      // Deeper than before → push a real back-target; same/shallower → replace in place.
      if (nextDepth > prevDepth.current) window.history.pushState(null, "", path);
      else window.history.replaceState(null, "", path);
    }
    prevDepth.current = nextDepth;
  }, [selectedProvince, selectedDestination, openDishId]);
}
