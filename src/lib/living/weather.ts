import type { WeatherData, WeatherCondition } from "./types";

// Key cities in Vietnam with coordinates for Open-Meteo lookup.
// Destinations are mapped to nearest city.
export const CITY_COORDS: Record<string, { lat: number; lng: number; name: string }> = {
  "ha-noi":     { lat: 21.028,  lng: 105.834, name: "Hà Nội" },
  "ho-chi-minh":{ lat: 10.762,  lng: 106.660, name: "TP. HCM" },
  "da-nang":    { lat: 16.054,  lng: 108.202, name: "Đà Nẵng" },
  "hue":        { lat: 16.467,  lng: 107.590, name: "Huế" },
  "hoi-an":     { lat: 15.880,  lng: 108.335, name: "Hội An" },
  "da-lat":     { lat: 11.940,  lng: 108.458, name: "Đà Lạt" },
  "nha-trang":  { lat: 12.238,  lng: 109.196, name: "Nha Trang" },
  "phu-quoc":   { lat: 10.289,  lng: 103.984, name: "Phú Quốc" },
  "sa-pa":      { lat: 22.337,  lng: 103.844, name: "Sa Pa" },
  "ha-long":    { lat: 20.951,  lng: 107.074, name: "Hạ Long" },
  "ha-giang":   { lat: 22.823,  lng: 104.984, name: "Hà Giang" },
  "ninh-binh":  { lat: 20.251,  lng: 105.975, name: "Ninh Bình" },
  "phong-nha":  { lat: 17.600,  lng: 106.149, name: "Phong Nha" },
  "mui-ne":     { lat: 10.932,  lng: 108.298, name: "Mũi Né" },
  "can-tho":    { lat: 10.046,  lng: 105.746, name: "Cần Thơ" },
};

// Destination → city key mapping
const DESTINATION_CITY: Record<string, string> = {
  "hoan-kiem-lake":           "ha-noi",
  "old-quarter-hanoi":        "ha-noi",
  "hue-imperial-city":        "hue",
  "golden-bridge":            "da-nang",
  "hoi-an-ancient-town":      "hoi-an",
  "da-lat-city":              "da-lat",
  "ben-thanh-market":         "ho-chi-minh",
  "nha-trang-beach":          "nha-trang",
  "hon-mun-island":           "nha-trang",
  "phu-quoc-island":          "phu-quoc",
  "bai-sao-beach":            "phu-quoc",
  "ha-long-bay":              "ha-long",
  "sa-pa-town":               "sa-pa",
  "moc-chau-plateau":         "sa-pa",
  "lung-cu-flag-tower":       "ha-giang",
  "ma-pi-leng-pass":          "ha-giang",
  "dong-van-old-town":        "ha-giang",
  "trang-an":                 "ninh-binh",
  "phong-nha-cave":           "phong-nha",
  "son-doong-cave":           "phong-nha",
  "mui-ne-sand-dunes":        "mui-ne",
  "cai-rang-floating-market": "can-tho",
  "tra-su-forest":            "can-tho",
  "mieu-ba-chua-xu":          "can-tho",
  "buon-don":                 "da-lat",
  "dray-nur-waterfall":       "da-lat",
  "dien-bien-phu-battlefield":"sa-pa",
};

// WMO weather code → condition
export function wmoToCondition(code: number): WeatherCondition {
  if (code === 0)                     return "sunny";
  if (code <= 2)                      return "partly-cloudy";
  if (code === 3)                     return "cloudy";
  if (code >= 45 && code <= 48)       return "foggy";
  if ((code >= 51 && code <= 67) ||
      (code >= 80 && code <= 82))     return "rainy";
  if (code >= 95)                     return "stormy";
  return "cloudy";
}

export function conditionLabel(cond: WeatherCondition): string {
  const MAP: Record<WeatherCondition, string> = {
    "sunny":         "Nắng đẹp",
    "partly-cloudy": "Nắng nhẹ, ít mây",
    "cloudy":        "Nhiều mây",
    "foggy":         "Sương mù",
    "rainy":         "Có mưa",
    "stormy":        "Giông bão",
  };
  return MAP[cond];
}

// In-memory cache keyed by city, TTL 3h
const _cache: Record<string, WeatherData> = {};
const CACHE_TTL_MS = 3 * 60 * 60 * 1000;

export async function fetchCityWeather(cityKey: string): Promise<WeatherData | null> {
  const city = CITY_COORDS[cityKey];
  if (!city) return null;

  const cached = _cache[cityKey];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,weather_code,is_day&timezone=Asia%2FBangkok&forecast_days=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const current = json.current;
    const data: WeatherData = {
      lat: city.lat,
      lng: city.lng,
      temperatureC: current.temperature_2m,
      weatherCode: current.weather_code,
      isDay: current.is_day === 1,
      fetchedAt: Date.now(),
    };
    _cache[cityKey] = data;
    return data;
  } catch {
    return null;
  }
}

export async function fetchDestinationWeather(destinationId: string): Promise<WeatherData | null> {
  const cityKey = DESTINATION_CITY[destinationId];
  if (!cityKey) return null;
  return fetchCityWeather(cityKey);
}

export async function fetchAllCityWeather(): Promise<Record<string, WeatherData>> {
  const results: Record<string, WeatherData> = {};
  await Promise.all(
    Object.keys(CITY_COORDS).map(async (key) => {
      const data = await fetchCityWeather(key);
      if (data) results[key] = data;
    })
  );
  return results;
}
