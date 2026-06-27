import type { HeartbeatResult, HeartbeatSignal, WeatherData } from "./types";
import { wmoToCondition } from "./weather";
import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import festivalCalendar from "@/data/living/festival-calendar.json";
import flowerCalendar from "@/data/living/flower-calendar.json";

// Mock community check-in counts (replaced by real data when backend exists)
const MOCK_COMMUNITY: Record<string, number> = {
  "hoi-an-ancient-town":       420,
  "ha-long-bay":               380,
  "sa-pa-town":                310,
  "hue-imperial-city":         260,
  "da-lat-city":               290,
  "phu-quoc-island":           350,
  "golden-bridge":             280,
  "phong-nha-cave":            190,
  "nha-trang-beach":           240,
  "old-quarter-hanoi":         200,
  "trang-an":                  170,
  "moc-chau-plateau":          130,
  "son-doong-cave":             80,
  "lung-cu-flag-tower":         90,
  "ma-pi-leng-pass":           110,
  "dong-van-old-town":          70,
  "mui-ne-sand-dunes":         160,
  "cai-rang-floating-market":  140,
};

// Editor picks — manually curated destination IDs
const EDITOR_PICKS = new Set([
  "son-doong-cave",
  "ha-long-bay",
  "hoi-an-ancient-town",
  "moc-chau-plateau",
  "trang-an",
]);

// AI picks — rotate by day-of-year for variety
const AI_PICK_POOL = [
  "ma-pi-leng-pass",
  "lung-cu-flag-tower",
  "phong-nha-cave",
  "bai-sao-beach",
  "tra-su-forest",
  "dray-nur-waterfall",
  "buon-don",
  "mieu-ba-chua-xu",
  "dien-bien-phu-battlefield",
  "hon-mun-island",
];

function todayAIPicks(): Set<string> {
  const now = new Date();
  const doy = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const picks = new Set<string>();
  for (let i = 0; i < 3; i++) {
    picks.add(AI_PICK_POOL[(doy + i) % AI_PICK_POOL.length]);
  }
  return picks;
}

// Current local hour in Vietnam (UTC+7)
function vietnamHour(): number {
  return (new Date().getUTCHours() + 7) % 24;
}

function currentMonth(): number {
  return new Date().getMonth() + 1; // 1-based
}

type SeasonEntry = { destinationId: string; state: string; icon: string; mood: string };
type FlowerEntry = { destinationId: string; flower: string; icon: string };
type FestivalEntry = {
  id: string; name: string; nameEn: string; months: number[];
  icon: string; mood: string; destinationIds: string[]; description: string;
};

export function computeHeartbeat(
  destinationId: string,
  weather?: WeatherData | null,
): HeartbeatResult {
  const month = currentMonth();
  const hour = vietnamHour();
  const aiPicks = todayAIPicks();

  // ── Seasonal ──────────────────────────────────────────────
  const monthSeasonal = (seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? [];
  const seasonEntry = monthSeasonal.find((e) => e.destinationId === destinationId);

  // ── Festival ──────────────────────────────────────────────
  const festivals = (festivalCalendar as { festivals: FestivalEntry[] }).festivals;
  const festivalEntry = festivals.find(
    (f) => f.months.includes(month) && f.destinationIds.includes(destinationId)
  );

  // ── Flower ────────────────────────────────────────────────
  const monthFlowers = (flowerCalendar as Record<string, FlowerEntry[]>)[String(month)] ?? [];
  const flowerEntry = monthFlowers.find((e) => e.destinationId === destinationId);

  // ── Weather ───────────────────────────────────────────────
  let weatherLabel: string | undefined;
  let isPerfectWeather = false;
  if (weather) {
    const cond = wmoToCondition(weather.weatherCode);
    isPerfectWeather = cond === "sunny" || cond === "partly-cloudy";
    weatherLabel = isPerfectWeather ? "Thời tiết đẹp" : undefined;
  }

  // ── Golden hour ──────────────────────────────────────────
  const isGoldenHour = hour >= 5 && hour <= 7 || hour >= 17 && hour <= 19;

  // ── Community ─────────────────────────────────────────────
  const checkins = MOCK_COMMUNITY[destinationId] ?? 0;
  const isTrending = checkins >= 300;
  const isPopular  = !isTrending && checkins >= 150;
  const isCalm     = checkins < 100;

  // ── Score weights (spec §Heartbeat Score) ─────────────────
  // 40% community · 20% season · 15% festival · 10% weather · 10% editorial · 5% ai-trend
  let communityScore = Math.min((checkins / 500) * 100, 100);
  let seasonScore    = seasonEntry ? 80 : 20;
  let festivalScore  = festivalEntry ? 100 : 0;
  let weatherScore   = isPerfectWeather ? 100 : 40;
  let editorialScore = EDITOR_PICKS.has(destinationId) ? 100 : 0;
  let aiScore        = aiPicks.has(destinationId) ? 100 : 0;

  const score = Math.round(
    communityScore * 0.40 +
    seasonScore    * 0.20 +
    festivalScore  * 0.15 +
    weatherScore   * 0.10 +
    editorialScore * 0.10 +
    aiScore        * 0.05
  );

  // ── Build signals ─────────────────────────────────────────
  const signals: HeartbeatSignal[] = [];
  if (isTrending)          signals.push("trending");
  else if (isPopular)      signals.push("popular");
  else if (isCalm)         signals.push("calm");
  if (seasonEntry)         signals.push("seasonal");
  if (festivalEntry)       signals.push("festival");
  if (isGoldenHour)        signals.push("golden-hour");
  if (isPerfectWeather)    signals.push("perfect-weather");
  if (EDITOR_PICKS.has(destinationId)) signals.push("editor-pick");
  if (aiPicks.has(destinationId))      signals.push("ai-pick");

  return {
    destinationId,
    score,
    signals,
    seasonalState: seasonEntry?.state,
    seasonalIcon:  seasonEntry?.icon,
    festivalName:  festivalEntry?.name,
    flowerName:    flowerEntry ? `${flowerEntry.icon} ${flowerEntry.flower}` : undefined,
    weatherCode:   weather?.weatherCode,
    weatherLabel,
  };
}
