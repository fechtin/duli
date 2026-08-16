import { useCallback, useEffect, useRef } from "react";
import { useMapStore } from "./useMapStore";
import { useFoodStore } from "./useFoodStore";
import { useTripStore } from "./useTripStore";
import { useContentStore, findDestinationBySlug } from "./useContentStore";
import { useCountryStore } from "./useCountryStore";
import { getProvinceMeta } from "@/lib/api/content";
import { isCountryCode } from "@/lib/country";
import { splitLocale, withLocale } from "@/lib/seo/urls";
import type { CountryCode } from "@/lib/types";

/**
 * Two-way sync between selection state and the URL (Bible 005 §3.3 — navigate by camera,
 * then sync the URL). Format: /{country}/{province}/{destination}, with an open dish carried
 * as ?dish=<id> on top of any of them. Each deeper layer PUSHES a history entry so the browser
 * Back button steps back one layer (dish → destination → province → map); shallower moves
 * REPLACE, so closing never leaves dangling forward entries.
 *
 * The country prefix is the source of truth for which atlas is on screen; the persisted
 * useCountryStore value only decides where a bare "/" lands.
 */

/**
 * Layer depth of the current selection, used to decide push vs replace.
 *
 * A trip is orthogonal to the province → destination → dish hierarchy: it is a context you keep
 * open while drilling into places. Half a rung expresses that without renumbering anything —
 * opening a trip still pushes (so Back closes it) and closing still replaces.
 */
function depthOf(hasDish: boolean, hasDest: boolean, hasProvince: boolean, hasTrip = false) {
  const base = hasDish ? 3 : hasDest ? 2 : hasProvince ? 1 : 0;
  return hasTrip ? base + 0.5 : base;
}

/**
 * Split the path into country + selection. Legacy links minted before the country prefix
 * (/{province}/{destination}, still live in the sitemap and in shared links) resolve against
 * Vietnam and get rewritten in place.
 */
function parsePath(pathname: string): { country: CountryCode; segments: string[]; legacy: boolean } {
  // The locale prefix belongs to I18nProvider, not to selection state — strip it and forget it.
  const { path } = splitLocale(pathname);
  const segments = path.split("/").filter(Boolean);
  if (isCountryCode(segments[0])) {
    return { country: segments[0], segments: segments.slice(1), legacy: false };
  }
  if (segments[0] && getProvinceMeta(segments[0], "vn")) {
    return { country: "vn", segments, legacy: true };
  }
  return { country: useCountryStore.getState().country, segments: [], legacy: false };
}

/** Re-attach whatever locale prefix the URL currently carries. */
function localised(path: string): string {
  return withLocale(splitLocale(window.location.pathname).locale, path);
}

function currentUrlDepth() {
  const { segments } = parsePath(window.location.pathname);
  const q = new URLSearchParams(window.location.search);
  return depthOf(q.has("dish"), Boolean(segments[1]), Boolean(segments[0]), q.has("trip"));
}

export function useUrlSync() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const openDishId = useFoodStore((s) => s.openDishId);
  // Subscribed for the dependency array only — the effect reads .getState(), see its comment.
  const tripId = useTripStore((s) => s.tripId);
  const country = useCountryStore((s) => s.country);
  const ready = useContentStore((s) => s.ready);
  const applied = useRef(false);
  const prevDepth = useRef(currentUrlDepth());
  /** Destination slug from a deep link that content hasn't loaded yet (see the write-back effect). */
  const pendingDest = useRef<string | null>(null);

  const applyFromUrl = useCallback(() => {
    const { country: cc, segments, legacy } = parsePath(window.location.pathname);
    const [provinceSlug, destSlug] = segments;
    const dishId = new URLSearchParams(window.location.search).get("dish");
    const map = useMapStore.getState();
    const food = useFoodStore.getState();
    applied.current = true;

    // Country first — province lookups below are resolved against the active atlas.
    useCountryStore.getState().setCountry(cc);

    pendingDest.current = null;
    if (provinceSlug && getProvinceMeta(provinceSlug, cc)) {
      if (destSlug) {
        const d = findDestinationBySlug(provinceSlug, destSlug);
        if (d) {
          map.selectDestination(d.id, provinceSlug);
          map.requestFocus({ kind: "point", lng: d.lng, lat: d.lat, zoom: 7 });
        } else {
          // Content isn't loaded yet — show the province, but remember the destination so the
          // write-back effect doesn't strip it from the URL before we can resolve it.
          pendingDest.current = destSlug;
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

    // Reconcile the trip layer, which rides alongside rather than on top of the map context.
    const tripParam = new URLSearchParams(window.location.search).get("trip");
    const trip = useTripStore.getState();
    if (tripParam) {
      if (trip.tripId !== tripParam) trip.openTrip(tripParam);
    } else if (trip.tripId) {
      trip.close();
    }

    // Upgrade a legacy (country-less) link in place, keeping the same history entry.
    if (legacy) {
      const { path } = splitLocale(window.location.pathname);
      window.history.replaceState(null, "", `${localised(`/vn${path}`)}${window.location.search}`);
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
    // A deep link like /vn/quang-nam/hoi-an-ancient-town lands before the destination list has
    // loaded; writing back now would drop the destination segment and the retry (once content
    // is ready) would find nothing left to resolve.
    if (pendingDest.current && !live.selectedDestination) return;
    const cc = useCountryStore.getState().country;
    const dishId = useFoodStore.getState().openDishId;
    const tripId = useTripStore.getState().tripId;

    let path = `/${cc}`;
    if (live.selectedDestination) {
      const d = useContentStore.getState().destinations.find((x) => x.id === live.selectedDestination);
      if (d) path = `/${cc}/${d.provinceSlug}/${d.slug}`;
    } else if (live.selectedProvince) {
      path = `/${cc}/${live.selectedProvince}`;
    }
    path = localised(path);
    // Build the query rather than appending one parameter. The old single-append form silently
    // dropped every other parameter on the first selection change, which `tasks/lessons.md`
    // records biting twice — `?trip=` would have been the third.
    const q = new URLSearchParams();
    if (dishId) q.set("dish", dishId);
    if (tripId) q.set("trip", tripId);
    const qs = q.toString();
    if (qs) path += `?${qs}`;

    const nextDepth = depthOf(
      Boolean(dishId),
      Boolean(live.selectedDestination),
      Boolean(live.selectedProvince),
      Boolean(tripId),
    );
    const current = window.location.pathname + window.location.search;
    if (path !== current) {
      // Deeper than before → push a real back-target; same/shallower → replace in place.
      if (nextDepth > prevDepth.current) window.history.pushState(null, "", path);
      else window.history.replaceState(null, "", path);
    }
    prevDepth.current = nextDepth;
  }, [selectedProvince, selectedDestination, openDishId, country, tripId]);
}
