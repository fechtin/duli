// South Korea administrative registry — single source of truth for regions & provinces.
// Mirrors data/registry/vn.mjs so scripts/build-map.mjs can build either atlas.
//
// 17 first-level units (1 special city, 6 metropolitan cities, 1 special self-governing city,
// 8 provinces) grouped into the 7 conventional travel regions.
// `provinces` keys match the `shapeName` field in the source GeoJSON (geoBoundaries KOR ADM1,
// derived from Natural Earth — Public Domain).

/** GeoJSON source + the feature property that carries the unit name. */
export const source = {
  file: "data/geo/kr-provinces.simplified.geojson",
  nameProp: "shapeName",
};

export const regions = [
  { id: "sudogwon", name: "Vùng Thủ đô Seoul", nameEn: "Capital Region", nameKo: "수도권", color: "#c7993f" },
  { id: "gangwon", name: "Gangwon", nameEn: "Gangwon", nameKo: "강원권", color: "#4f7b6a" },
  { id: "chungcheong", name: "Chungcheong", nameEn: "Chungcheong", nameKo: "충청권", color: "#6e8c5a" },
  { id: "honam", name: "Honam (Jeolla)", nameEn: "Honam (Jeolla)", nameKo: "호남권", color: "#5d9e86" },
  { id: "gyeongbuk", name: "Bắc Gyeongsang", nameEn: "North Gyeongsang", nameKo: "대구·경북권", color: "#8a6e4b" },
  { id: "gyeongnam", name: "Nam Gyeongsang", nameEn: "South Gyeongsang", nameKo: "부산·경남권", color: "#5a8aa6" },
  { id: "jeju", name: "Jeju", nameEn: "Jeju", nameKo: "제주권", color: "#3e92a8" },
];

// source name -> { slug, name (romanized, the base/vi-facing label), nameEn, nameKo, region }
export const provinces = {
  Seoul: { slug: "seoul", name: "Seoul", nameEn: "Seoul", nameKo: "서울특별시", region: "sudogwon" },
  Incheon: { slug: "incheon", name: "Incheon", nameEn: "Incheon", nameKo: "인천광역시", region: "sudogwon" },
  Gyeonggi: { slug: "gyeonggi", name: "Gyeonggi", nameEn: "Gyeonggi", nameKo: "경기도", region: "sudogwon" },
  Gangwon: { slug: "gangwon", name: "Gangwon", nameEn: "Gangwon", nameKo: "강원특별자치도", region: "gangwon" },
  Daejeon: { slug: "daejeon", name: "Daejeon", nameEn: "Daejeon", nameKo: "대전광역시", region: "chungcheong" },
  Sejong: { slug: "sejong", name: "Sejong", nameEn: "Sejong", nameKo: "세종특별자치시", region: "chungcheong" },
  "North Chungcheong": { slug: "chungbuk", name: "Chungbuk", nameEn: "North Chungcheong", nameKo: "충청북도", region: "chungcheong" },
  "South Chungcheong": { slug: "chungnam", name: "Chungnam", nameEn: "South Chungcheong", nameKo: "충청남도", region: "chungcheong" },
  Gwangju: { slug: "gwangju", name: "Gwangju", nameEn: "Gwangju", nameKo: "광주광역시", region: "honam" },
  "North Jeolla": { slug: "jeonbuk", name: "Jeonbuk", nameEn: "North Jeolla", nameKo: "전북특별자치도", region: "honam" },
  "South Jeolla": { slug: "jeonnam", name: "Jeonnam", nameEn: "South Jeolla", nameKo: "전라남도", region: "honam" },
  Daegu: { slug: "daegu", name: "Daegu", nameEn: "Daegu", nameKo: "대구광역시", region: "gyeongbuk" },
  "North Gyeongsang": { slug: "gyeongbuk", name: "Gyeongbuk", nameEn: "North Gyeongsang", nameKo: "경상북도", region: "gyeongbuk" },
  Busan: { slug: "busan", name: "Busan", nameEn: "Busan", nameKo: "부산광역시", region: "gyeongnam" },
  Ulsan: { slug: "ulsan", name: "Ulsan", nameEn: "Ulsan", nameKo: "울산광역시", region: "gyeongnam" },
  "South Gyeongsang": { slug: "gyeongnam", name: "Gyeongnam", nameEn: "South Gyeongsang", nameKo: "경상남도", region: "gyeongnam" },
  Jeju: { slug: "jeju", name: "Jeju", nameEn: "Jeju", nameKo: "제주특별자치도", region: "jeju" },
};

// Framing box [west, south, east, north] — wide enough to keep Ulleungdo and Jeju in frame.
export const mainlandBounds = [125.2, 32.9, 130.95, 38.75];
