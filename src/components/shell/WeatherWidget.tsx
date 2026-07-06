import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, MapPin, Sun } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CITY_COORDS, fetchCityWeather, wmoToCondition } from "@/lib/living/weather";
import type { WeatherCondition, WeatherData } from "@/lib/living/types";
import { DESTINATION_CITY_MAP } from "@/lib/living/weatherCityMap";
import { useMapStore } from "@/lib/store/useMapStore";
import { useT } from "@/lib/i18n";

const COND_ICON: Record<WeatherCondition, LucideIcon> = {
  "sunny": Sun,
  "partly-cloudy": CloudSun,
  "cloudy": Cloud,
  "foggy": CloudFog,
  "rainy": CloudRain,
  "stormy": CloudLightning,
};

/** Resolve the city to show weather for: active destination → its city, else default Đà Nẵng. */
function useActiveCity(): string {
  const dest = useMapStore((s) => s.selectedDestination);
  const province = useMapStore((s) => s.selectedProvince);
  if (dest && DESTINATION_CITY_MAP[dest]) return DESTINATION_CITY_MAP[dest];
  if (province && CITY_COORDS[province]) return province;
  return "da-nang";
}

/** Floating weather card (029) — glass, top-right, mobile only. Real Open-Meteo data. */
export function WeatherWidget() {
  const t = useT();
  const cityKey = useActiveCity();
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let alive = true;
    fetchCityWeather(cityKey).then((d) => {
      if (alive) setData(d);
    });
    return () => {
      alive = false;
    };
  }, [cityKey]);

  if (!data) return null;

  const cond = wmoToCondition(data.weatherCode);
  const Icon = COND_ICON[cond];
  const city = CITY_COORDS[cityKey];

  return (
    <div className="pointer-events-none absolute right-3 top-[calc(env(safe-area-inset-top)+4.5rem)] z-20 md:hidden">
      <div className="pointer-events-auto flex items-center gap-3 rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)] px-4 py-3 text-[color:var(--glass-text)] shadow-[var(--glass-shadow)] backdrop-blur-xl">
        <Icon size={30} className="text-[color:var(--glass-gold)]" strokeWidth={1.8} />
        <div className="leading-tight">
          <div className="flex items-baseline gap-0.5">
            <span className="font-display text-2xl font-bold">{Math.round(data.temperatureC)}</span>
            <span className="text-sm font-medium text-[color:var(--glass-text-dim)]">°C</span>
          </div>
          <div className="text-xs font-medium text-[color:var(--glass-text-dim)]">{t(`weather.cond.${cond}`)}</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[color:var(--glass-text-dim)]">
            <MapPin size={11} className="text-[color:var(--glass-gold)]" />
            {city?.name}
          </div>
        </div>
      </div>
    </div>
  );
}
