/**
 * Ordering — docs/031.md §Phase 9.
 *
 * Two orderings happen in a trip and they are different problems:
 *
 *  - **Bases** form an open path (start where the traveller is, end wherever the route ends).
 *    n is at most a handful of provinces, so nearest-neighbour followed by 2-opt is exact enough
 *    and finishes in microseconds. No solver, no dependency.
 *  - **Stops inside a day** are the same shape but additionally constrained by opening hours,
 *    which `schedule.ts` handles after this hands it an order.
 *
 * Everything here is deterministic: ties break on id, never on insertion order, so the same input
 * always yields the same route. `plan.test.ts` pins that.
 *
 * Relative imports only (Worker bundle) — see `types.ts`.
 */

import type { TravelTimeProvider } from "./travel.ts";

export interface RouteNode {
  lng: number;
  lat: number;
  /** Stable tie-breaker, so equal distances never depend on array order. */
  id: string;
}

/** Total path cost, in provider minutes. */
function pathCost<T extends RouteNode>(path: T[], provider: TravelTimeProvider): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += provider.minutesBetween(path[i - 1], path[i]);
  return total;
}

/** Greedy nearest-neighbour from a fixed start. */
function nearestNeighbour<T extends RouteNode>(nodes: T[], start: T, provider: TravelTimeProvider): T[] {
  const remaining = nodes.filter((n) => n.id !== start.id);
  const path = [start];
  let current = start;
  while (remaining.length) {
    let bestIndex = 0;
    let bestCost = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const cost = provider.minutesBetween(current, remaining[i]);
      if (cost < bestCost || (cost === bestCost && remaining[i].id < remaining[bestIndex].id)) {
        bestCost = cost;
        bestIndex = i;
      }
    }
    current = remaining.splice(bestIndex, 1)[0];
    path.push(current);
  }
  return path;
}

/**
 * 2-opt on an OPEN path: reverse any segment that shortens the total, but never move index 0 —
 * the traveller is already standing there.
 */
function twoOpt<T extends RouteNode>(path: T[], provider: TravelTimeProvider): T[] {
  if (path.length < 4) return path;
  let best = path;
  let bestCost = pathCost(best, provider);
  let improved = true;
  // Bounded so a pathological input cannot spin; real n here is <= 8.
  let guard = 32;
  while (improved && guard-- > 0) {
    improved = false;
    for (let i = 1; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const candidate = [...best.slice(0, i), ...best.slice(i, k + 1).reverse(), ...best.slice(k + 1)];
        const cost = pathCost(candidate, provider);
        if (cost < bestCost - 0.001) {
          best = candidate;
          bestCost = cost;
          improved = true;
        }
      }
    }
  }
  return best;
}

/** Order an open path from a fixed start. */
export function sequence<T extends RouteNode>(
  nodes: T[],
  startId: string,
  provider: TravelTimeProvider,
): T[] {
  if (nodes.length <= 1) return [...nodes];
  const start = nodes.find((n) => n.id === startId) ?? nodes[0];
  return twoOpt(nearestNeighbour(nodes, start, provider), provider);
}
