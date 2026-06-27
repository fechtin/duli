import { buildMapModel } from "./projection";
import type { MapModel } from "./projection";

let _promise: Promise<MapModel> | null = null;

export function getMapModel(): Promise<MapModel> {
  if (!_promise) {
    _promise = fetch("/geo/vn-provinces.json")
      .then((r) => r.json())
      .then((geo) => buildMapModel(geo));
  }
  return _promise;
}
