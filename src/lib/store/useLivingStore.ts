import { create } from "zustand";
import type { HeartbeatResult, WeatherData } from "@/lib/living/types";
import { computeHeartbeat } from "@/lib/living/heartbeat";
import { fetchAllCityWeather } from "@/lib/living/weather";

// Mapping from destination city-key — mirrors weather.ts DESTINATION_CITY
import { DESTINATION_CITY_MAP } from "@/lib/living/weatherCityMap";

interface LivingState {
  heartbeats: Record<string, HeartbeatResult>;
  cityWeather: Record<string, WeatherData>;
  initialized: boolean;
  loading: boolean;
  init: (destinationIds: string[]) => Promise<void>;
  getHeartbeat: (destinationId: string) => HeartbeatResult | undefined;
}

export const useLivingStore = create<LivingState>((set, get) => ({
  heartbeats: {},
  cityWeather: {},
  initialized: false,
  loading: false,

  init: async (destinationIds: string[]) => {
    if (get().initialized || get().loading) return;
    set({ loading: true });

    // Fetch weather for all cities in parallel
    const cityWeather = await fetchAllCityWeather();

    // Compute heartbeat for every destination
    const heartbeats: Record<string, HeartbeatResult> = {};
    for (const id of destinationIds) {
      const cityKey = DESTINATION_CITY_MAP[id];
      const weather = cityKey ? cityWeather[cityKey] : null;
      heartbeats[id] = computeHeartbeat(id, weather);
    }

    set({ heartbeats, cityWeather, initialized: true, loading: false });
  },

  getHeartbeat: (destinationId: string) => get().heartbeats[destinationId],
}));
