import { getProvinces } from "@/lib/api/content";
import { useCountryName } from "@/lib/country/useCountryName";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useT } from "@/lib/i18n";
import { provincePath } from "@/lib/seo/urls";
import { AppLink } from "@/components/ui/AppLink";

/**
 * The parts of a page a crawler and a screen reader need, that a map cannot give them.
 *
 * Two gaps, both measured on the live site (see `tasks/040-seo-structure.md`):
 *
 * 1. **No `<h1>`.** The Worker's pre-hydration body has one, but `createRoot()` wipes it and the
 *    panels only carried `<h2>` — so what Google actually indexed had no subject line at all.
 *    The panels now own the `<h1>` for a province/destination/dish; this fills the one case no
 *    panel covers, the country page (and a trip, which canonicalises onto it).
 * 2. **No way through to the 63 provinces.** They are SVG polygons: unclickable by a crawler,
 *    unreachable by keyboard. The country page therefore linked nowhere.
 *
 * `sr-only`, not `hidden`: these are real links, keyboard-reachable and announced in the
 * accessibility tree. They duplicate what the map already offers a sighted reader rather than
 * showing a crawler anything a person cannot get to.
 */
export function CrawlNav() {
  const t = useT();
  const country = useCountryStore((s) => s.country);
  const { country: countryName } = useCountryName();
  const selectProvince = useMapStore((s) => s.selectProvince);
  const selectedProvince = useMapStore((s) => s.selectedProvince);
  const selectedDestination = useMapStore((s) => s.selectedDestination);
  const openDishId = useFoodStore((s) => s.openDishId);
  const foodListOpen = useFoodStore((s) => s.listOpen);

  // A panel is showing the page's subject and owns the <h1>. Deliberately not `usePanelOpen`,
  // which also counts an open trip — a trip canonicalises onto /{cc}, so the country heading is
  // the right one there. The cuisine index DOES own its heading: /{cc}/food is its own URL, and
  // leaving this on emitted two <h1>s, "Việt Nam" above "Ẩm thực".
  const panelOwnsHeading = Boolean(
    selectedDestination || selectedProvince || openDishId || foodListOpen,
  );

  return (
    <>
      {!panelOwnsHeading && <h1 className="sr-only">{countryName}</h1>}
      <nav aria-label={t("seo.places")} className="sr-only">
        <ul>
          {getProvinces(country).map((p) => (
            <li key={p.slug}>
              <AppLink to={provincePath(country, p.slug)} onNavigate={() => selectProvince(p.slug)}>
                {t(`province.${p.slug}`)}
              </AppLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
