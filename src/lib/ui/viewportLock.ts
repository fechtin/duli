/**
 * iOS standalone (PWA) leaves the app shell shorter than its own window, which shows up as a
 * blank strip below the bottom nav.
 *
 * Three fixes were tried before this one and all three read the SAME number. `100dvh`,
 * `position: fixed; inset: 0` (which resolves against the initial containing block), `height:
 * 100%` and `window.innerHeight` are every one of them the height of the layout viewport — and
 * in standalone WebKit reports that as the SAFE-AREA height, short by the top and bottom insets
 * (~93pt on a home-indicator iPhone), even though `viewport-fit=cover` has already put the app's
 * origin at the physical top of the screen. So the whole shortfall lands at the bottom. Measuring
 * it in JS was just the third syntax for the same wrong number.
 *
 * The one height iOS cannot get wrong is the screen's: an iPhone standalone window IS the entire
 * screen, and `screen.width/height` are hardware values that are never stale. So the measured
 * viewport is treated as a FLOOR, not an answer, and lifted to the screen height when the
 * shortfall is inset-sized. The bound matters — an iPad in Stage Manager is a standalone window
 * that is genuinely much shorter than its screen, and lifting it there would push the shell off
 * the bottom instead of the other way round.
 *
 * `visualViewport.height` shrinks while the soft keyboard is up, so the larger of the two
 * measurements is used: an open keyboard must not resize the shell.
 */

/** Largest shortfall against the screen that can plausibly be safe-area insets, in CSS px. */
const MAX_INSET_SHORTFALL = 140;

/** Everything the shell's height is decided from, so the decision itself can be tested. */
export interface ViewportReading {
  innerHeight: number;
  /** `visualViewport.height`, absent on browsers that don't have the API. */
  visualHeight?: number;
  /** `screen.width` / `screen.height` as reported, i.e. possibly not swapped for orientation. */
  screenWidth: number;
  screenHeight: number;
  portrait: boolean;
  /**
   * `navigator.standalone`, a WebKit-only property — which is exactly the gate wanted here.
   * `(display-mode: standalone)` would also match an installed Android PWA, whose window really
   * is shorter than the screen by the system navigation bar; lifting that one to the screen
   * height would slide the bottom nav under the gesture bar.
   */
  iosStandalone: boolean;
}

/** Chooses the shell height. See the file header for why the screen gets the final say. */
export function resolveAppHeight(r: ViewportReading): number {
  const measured = Math.max(r.innerHeight || 0, r.visualHeight ?? 0);
  if (!r.iosStandalone || !r.screenWidth || !r.screenHeight) return measured;
  // iOS has swapped screen.width/height on orientation change in some versions and not others, so
  // ask the orientation rather than trusting which property is which.
  const screenH = r.portrait
    ? Math.max(r.screenWidth, r.screenHeight)
    : Math.min(r.screenWidth, r.screenHeight);
  const shortfall = screenH - measured;
  return shortfall > 0 && shortfall <= MAX_INSET_SHORTFALL ? screenH : measured;
}

function read(): ViewportReading {
  return {
    innerHeight: window.innerHeight,
    visualHeight: window.visualViewport?.height,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    portrait: window.matchMedia("(orientation: portrait)").matches,
    iosStandalone: (window.navigator as Navigator & { standalone?: boolean }).standalone === true,
  };
}

export function lockViewportHeight(): void {
  const root = document.documentElement;
  let raf = 0;
  const timers: number[] = [];

  const apply = () => {
    raf = 0;
    const height = resolveAppHeight(read());
    if (height > 0) root.style.setProperty("--app-h", `${Math.round(height)}px`);
    // iOS scrolls the document to reveal a focused input even under `overflow: hidden`, and never
    // scrolls back, so the fixed shell is left riding above the window bottom.
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };

  /**
   * iOS reports the settled size only once a launch / keyboard / status-bar transition has
   * finished, and it does not reliably fire an event when it does. A single pass per trigger is
   * how the shell got stuck at a launch-time value for a whole session — nothing ever re-measured
   * until the next event, and a cold launch may see none. The burst keeps re-checking until
   * things stop moving; every pass is one property write, and coalescing on rAF keeps the common
   * case to a single frame.
   */
  const SETTLE_MS = [60, 150, 300, 600, 1200];

  const schedule = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(apply);
    while (timers.length) window.clearTimeout(timers.pop()!);
    for (const ms of SETTLE_MS) timers.push(window.setTimeout(apply, ms));
  };

  schedule();
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("focusout", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) schedule();
  });
}
