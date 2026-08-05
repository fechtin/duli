// Decode-concurrency budget for ambient video (Bible 030 §5).
//
// The bottleneck for ambient video is NOT bandwidth, it is the number of <video> elements
// decoding at once: each one is a compositing layer plus a hardware decoder session. This
// module hands out a fixed number of "play slots", prioritised by how close the requester is
// to the centre of the screen. Losing a slot is not a failure — the element pauses and the
// webp poster underneath shows through, which is what the user already sees today.

type Claim = {
  id: string;
  /** Lower = more deserving of a slot (distance from screen centre, in px). */
  priority: number;
  /** Called when this claim gains or loses its slot. */
  onChange: (granted: boolean) => void;
  granted: boolean;
};

const claims = new Map<string, Claim>();

/** Concurrent decoders. Mobile gets one; a phone GPU will not composite more without tearing. */
export function slotCapacity(): number {
  if (typeof window === "undefined") return 0;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  return coarse || narrow ? 1 : 2;
}

function rebalance() {
  const cap = slotCapacity();
  const sorted = [...claims.values()].sort((a, b) => a.priority - b.priority);
  sorted.forEach((c, i) => {
    const granted = i < cap;
    if (granted !== c.granted) {
      c.granted = granted;
      c.onChange(granted);
    }
  });
}

export function claimSlot(id: string, priority: number, onChange: (granted: boolean) => void) {
  claims.set(id, { id, priority, onChange, granted: false });
  rebalance();
  return () => {
    claims.delete(id);
    rebalance();
  };
}

/** Re-prioritise an existing claim (e.g. the camera moved and this marker drifted off-centre). */
export function updatePriority(id: string, priority: number) {
  const c = claims.get(id);
  if (!c || c.priority === priority) return;
  c.priority = priority;
  rebalance();
}

/** Global gates — cheap, synchronous, and identical for every ambient surface. */
// `?novideo=1` disables the layer for A/B measurement on one identical build (Bible 030 §9).
// Read ONCE at module
// load: useUrlSync rewrites the URL from selection state and drops unknown query params, so by the
// time a gate runs the flag is already gone from location.search.
const KILLED = typeof window !== "undefined" && window.location.search.includes("novideo=1");

export function motionAllowed(): boolean {
  if (typeof window === "undefined" || KILLED) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  // Absent Network Information API (Safari/Firefox) we assume a good link rather than
  // penalising every non-Chromium user.
  if (conn?.effectiveType && conn.effectiveType !== "4g") return false;
  return true;
}
