import { buildMapModel } from "./projection";
import type { MapModel } from "./projection";
import { geoUrl } from "@/lib/country";
import { activeCountry } from "@/lib/store/useCountryStore";
import type { CountryCode } from "@/lib/types";

/** One in-flight/resolved model per country — switching atlases must not reuse VN geometry. */
const _promises = new Map<CountryCode, Promise<MapModel>>();

export function getMapModel(cc: CountryCode = activeCountry()): Promise<MapModel> {
  let p = _promises.get(cc);
  if (!p) {
    p = fetch(geoUrl(cc))
      .then((r) => r.json())
      .then((geo) => buildMapModel(geo));
    _promises.set(cc, p);
  }
  return p;
}
