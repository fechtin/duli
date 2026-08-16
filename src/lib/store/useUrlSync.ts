import { useCallback, useEffect, useRef } from "react";
import { useMapStore } from "./useMapStore";
import { useFoodStore } from "./useFoodStore";
import { useTripStore } from "./useTripStore";
import { useContentStore, findDestinationBySlug } from "./useContentStore";
import { useCountryStore } from "./useCountryStore";
import { getProvinceMeta } from "@/lib/api/content";
import { isCountryCode } from "@/lib/country";
import {
  countryPath,
  destinationPath,
  dishPath,
  foodPath,
  FOOD_SEGMENT,
  provincePath,
  splitLocale,
  withLocale,
} from "@/lib/seo/urls";
import type { CountryCode } from "@/lib/types";

/**
 * Two-way sync between selection state and the URL (Bible 005 §3.3 — navigate by camera,
 * then sync the URL). Two shapes share the space after the country:
 *   /{country}/{province}/{destination}   — the map hierarchy
 *   /{country}/food/{dish}                — the cuisine index and its dishes (043)
 * `food` is the one first segment that is a section rather than a province.
 *
 * Each deeper layer PUSHES a history entry so the browser Back button steps back one layer
 * (dish → destination → province → map); shallower moves REPLACE, so closing never leaves
 * dangling forward entries.
 *
 * A dish OWNS the URL while it is open, even when opened over a province: it is the subject of
 * the page, and one dish is one URL. The map selection underneath survives in state, so closing
 * still returns to it.
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
function depthOf(hasDish: boolean, hasDest: boolean, hasProvinceOrFood: boolean, hasTrip = false) {
  const base = hasDish ? 3 : hasDest ? 2 : hasProvinceOrFood ? 1 : 0;
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
  // Both shapes have two segments, but they sit on different rungs: `/vn/food/pho-bo` is a dish
  // (3) and `/vn/quang-nam/hoi-an` a destination (2). Reading the second segment alone would put
  // a dish on the destination rung and make Back out of it replace instead of pop.
  const isFood = segments[0] === FOOD_SEGMENT;
  const hasDish = (isFood && Boolean(segments[1])) || q.has("dish");
  return depthOf(hasDish, !isFood && Boolean(segments[1]), Boolean(segments[0]), q.has("trip"));
}

export function useUrlSync() {
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const openDishId = useFoodStore((s) => s.openDishId);
  const foodListOpen = useFoodStore((s) => s.listOpen);
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
    const map = useMapStore.getState();
    const food = useFoodStore.getState();
    applied.current = true;

    // `/vn/food/pho-bo` — the second segment is a dish id, not a destination slug. `?dish=` is
    // the pre-043 form: the Worker 301s it, but an in-app history entry can still carry one, so
    // it is accepted here and the write-back below rewrites it to the path form.
    const foodIndex = provinceSlug === FOOD_SEGMENT;
    const dishId = (foodIndex && destSlug) || new URLSearchParams(window.location.search).get("dish");

    // Country first — province lookups below are resolved against the active atlas.
    useCountryStore.getState().setCountry(cc);

    pendingDest.current = null;
    // The cuisine index shares the province rung but resolves against no geometry — decide it
    // before the province lookup, which would otherwise send `/vn/food` down the reset path.
    // A dish URL opens the index underneath it, so closing the dish lands on the list.
    if (foodIndex) food.openList();
    else food.closeList();

    if (foodIndex) {
      map.reset();
    } else if (provinceSlug && getProvinceMeta(provinceSlug, cc)) {
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

    // Reconcile the dish layer. Read the id LIVE rather than off the `food` snapshot taken
    // above: the calls in between mutate the store, and a stale id here silently skipped
    // `openDish` on the second pass of a deep link (042).
    if (dishId) {
      if (useFoodStore.getState().openDishId !== dishId) food.openDish(dishId);
    } else if (useFoodStore.getState().openDishId) {
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
    const { openDishId: dishId, listOpen } = useFoodStore.getState();
    const tripId = useTripStore.getState().tripId;

    // An open dish is the page's subject and takes the URL outright (043) — one dish, one URL,
    // whatever map view it was opened over. Below it, a map selection outranks the index even
    // while the index stays open in state; closing either falls back to what is underneath.
    let path = countryPath(cc);
    if (dishId) {
      path = dishPath(cc, dishId);
    } else if (live.selectedDestination) {
      const d = useContentStore.getState().destinations.find((x) => x.id === live.selectedDestination);
      if (d) path = destinationPath(cc, d.provinceSlug, d.slug);
    } else if (live.selectedProvince) {
      path = provincePath(cc, live.selectedProvince);
    } else if (listOpen) {
      path = foodPath(cc);
    }
    path = localised(path);
    // Build the query rather than appending one parameter. The old single-append form silently
    // dropped every other parameter on the first selection change, which `tasks/lessons.md`
    // records biting twice. `?dish=` used to live here too, until 043 gave it a path.
    const q = new URLSearchParams();
    if (tripId) q.set("trip", tripId);
    const qs = q.toString();
    if (qs) path += `?${qs}`;

    const nextDepth = depthOf(
      Boolean(dishId),
      Boolean(live.selectedDestination),
      Boolean(live.selectedProvince) || listOpen,
      Boolean(tripId),
    );
    const current = window.location.pathname + window.location.search;
    if (path !== current) {
      // Deeper than before → push a real back-target; same/shallower → replace in place.
      if (nextDepth > prevDepth.current) window.history.pushState(null, "", path);
      else window.history.replaceState(null, "", path);
    }
    prevDepth.current = nextDepth;
  }, [selectedProvince, selectedDestination, openDishId, foodListOpen, country, tripId]);
}
