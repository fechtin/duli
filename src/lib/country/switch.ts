import { useCountryStore } from "@/lib/store/useCountryStore";
import { useMapStore } from "@/lib/store/useMapStore";
import { useFoodStore } from "@/lib/store/useFoodStore";
import { splitLocale, withLocale } from "@/lib/seo/urls";
import type { CountryCode } from "@/lib/types";

/**
 * Switch atlases: drop every selection tied to the old country, flip the store (which pulls
 * the new geometry + content), and land on that country's home URL. Kept out of the store so
 * useCountryStore stays a plain state holder.
 */
export function switchCountry(cc: CountryCode) {
  const { country, setCountry } = useCountryStore.getState();
  if (country === cc) return;

  useFoodStore.getState().closeDish();
  useMapStore.getState().reset();
  setCountry(cc);
  // Switching atlas must not switch language: keep whatever locale prefix the URL carries.
  window.history.pushState(null, "", withLocale(splitLocale(window.location.pathname).locale, `/${cc}`));
}
