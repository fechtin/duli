import { useI18n } from "@/lib/i18n";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { COUNTRIES, countryLabel } from ".";

/**
 * Name and flag of the atlas currently being browsed, in the UI locale.
 *
 * Copy that names the country — the passport title, the map loading line, the share card —
 * must go through this. Hardcoding "Vietnam" into those strings is how the app ended up
 * showing "Hộ chiếu Việt Nam" over a map of Korea.
 */
export function useCountryName(): { country: string; flag: string } {
  const { locale } = useI18n();
  const code = useCountryStore((s) => s.country);
  return { country: countryLabel(code, locale), flag: COUNTRIES[code].flag };
}
