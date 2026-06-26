import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { RegionId } from "@/lib/types";

export interface ProvinceShape {
  slug: string;
  name: string;
  nameEn: string;
  regionId: RegionId;
  regionName: string;
  color: string;
  d: string;
  /** Projected label/marker anchor (px in map space). */
  cx: number;
  cy: number;
  /** Projected bbox [x0, y0, x1, y1] (px in map space). */
  bbox: [number, number, number, number];
}

export interface MapModel {
  width: number;
  height: number;
  provinces: ProvinceShape[];
  /** Project [lng, lat] into map px space. */
  project: (lnglat: [number, number]) => [number, number];
}

interface ProvinceProps {
  slug: string;
  name: string;
  nameEn: string;
  regionId: RegionId;
  regionName: string;
  color: string;
  centroid: [number, number];
}

const BASE_W = 1000;

/** Build projected SVG geometry for the whole country, framed on the mainland. */
export function buildMapModel(geo: FeatureCollection): MapModel {
  const [w, s, e, n] = (geo.bbox ?? [102, 8.3, 110.2, 23.5]) as number[];
  // A MultiPoint frame (not a polygon) — winding-free, so d3 reads the mainland box
  // correctly instead of mistaking it for the whole globe.
  const frame: Feature<Geometry> = {
    type: "Feature",
    properties: {},
    geometry: { type: "MultiPoint", coordinates: [[w, s], [e, n]] },
  };

  // fitWidth already lands the frame's top-left at (0, 0), so no extra translate is needed.
  const projection = geoMercator().fitWidth(BASE_W, frame as Feature);
  const path = geoPath(projection);

  const fb = path.bounds(frame as Feature);
  const width = fb[1][0] - fb[0][0];
  const height = fb[1][1] - fb[0][1];

  const provinces: ProvinceShape[] = [];
  for (const f of geo.features) {
    const p = f.properties as unknown as ProvinceProps;
    const d = path(f as Feature) ?? "";
    const [px, py] = projection(p.centroid) ?? [0, 0];
    const b = path.bounds(f as Feature);
    provinces.push({
      slug: p.slug,
      name: p.name,
      nameEn: p.nameEn,
      regionId: p.regionId,
      regionName: p.regionName,
      color: p.color,
      d,
      cx: px,
      cy: py,
      bbox: [b[0][0], b[0][1], b[1][0], b[1][1]],
    });
  }

  const project = (lnglat: [number, number]): [number, number] => {
    const p = projection(lnglat);
    return p ? [p[0], p[1]] : [0, 0];
  };

  return { width, height, provinces, project };
}
