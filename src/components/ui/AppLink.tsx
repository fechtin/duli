import type { MouseEvent, ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { withLocale } from "@/lib/seo/urls";

/**
 * A real `<a href>` that navigates in-app.
 *
 * Every list in this atlas used to be a `<button onClick>` — correct for a reader, invisible to a
 * crawler. Measured on the live site, a rendered page carried **zero** outbound links, so Google
 * could only ever reach a URL through the sitemap and no page passed a signal to any other. The
 * anchor restores the link graph, and with it cmd/middle-click and the status-bar preview a
 * button never had.
 *
 * `onNavigate` keeps the map-first behaviour: it mutates selection state and `useUrlSync` writes
 * the URL from there, so nothing here touches history — going through the anchor's default would
 * reload the SPA and lose the map camera.
 */
export function AppLink({
  to,
  onNavigate,
  className,
  children,
  ariaLabel,
}: {
  /** Locale-free path from `destinationPath()` / `provincePath()` / `dishPath()`. */
  to: string;
  onNavigate: () => void;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const { locale } = useI18n();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Leave new-tab / new-window / download intents to the browser — the href is real, so they
    // all resolve to a served page.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate();
  };

  return (
    <a href={withLocale(locale, to)} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
