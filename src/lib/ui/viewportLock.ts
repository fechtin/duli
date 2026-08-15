/**
 * iOS standalone (PWA) leaves the app shell shorter than its own window, which shows up as a
 * blank strip below the bottom nav. Two WebKit behaviours cause it, both of them intermittent:
 *
 *  1. The layout viewport goes stale. Everything the shell could size itself against — `100dvh`,
 *     `100%`, even `position: fixed; inset: 0` (which resolves against the initial containing
 *     block) — reads from that same stale value, so no pure-CSS answer exists. It goes stale when
 *     the soft keyboard closes (the search overlay autofocuses its input), when the app is
 *     resumed from the background, and during status-bar transitions (call / hotspot banner).
 *  2. iOS scrolls the document to reveal a focused input even under `overflow: hidden`, and never
 *     scrolls back, so the fixed shell is left riding above the window bottom.
 *
 * So the height is measured in JS and published as `--app-h`. `visualViewport` is the one value
 * iOS refreshes reliably, but it also shrinks while the keyboard is up — taking the larger of the
 * two means a stale `innerHeight` can't shorten the shell and an open keyboard can't resize it.
 */
export function lockViewportHeight(): void {
  const root = document.documentElement;
  let raf = 0;

  const apply = () => {
    raf = 0;
    const height = Math.max(window.innerHeight || 0, window.visualViewport?.height ?? 0);
    if (height > 0) root.style.setProperty("--app-h", `${Math.round(height)}px`);
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };

  const schedule = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(apply);
    // iOS reports the settled size only once the keyboard / status-bar transition has finished;
    // the immediate pass keeps the common case instant, this one catches the value it lied about.
    window.setTimeout(apply, 300);
  };

  apply();
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);
  window.addEventListener("pageshow", schedule);
  window.addEventListener("focusout", schedule);
  window.visualViewport?.addEventListener("resize", schedule);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) schedule();
  });
}
