export type HeartbeatSignal =
  | "calm"
  | "popular"
  | "trending"
  | "seasonal"
  | "festival"
  | "golden-hour"
  | "perfect-weather"
  | "editor-pick"
  | "ai-pick";

export interface SignalMeta {
  signal: HeartbeatSignal;
  label: string;
  icon: string;
  description: string;
}

export const SIGNAL_META: Record<HeartbeatSignal, SignalMeta> = {
  "calm":            { signal: "calm",            icon: "🟢", label: "Bình yên",       description: "Địa điểm yên tĩnh, phù hợp nghỉ dưỡng" },
  "popular":         { signal: "popular",          icon: "🟡", label: "Đang hot",       description: "Nhiều người đang quan tâm" },
  "trending":        { signal: "trending",          icon: "🔴", label: "Trending",       description: "Check-in tăng mạnh hôm nay" },
  "seasonal":        { signal: "seasonal",          icon: "🌸", label: "Đúng mùa",       description: "Đang vào mùa đẹp nhất trong năm" },
  "festival":        { signal: "festival",          icon: "🎉", label: "Lễ hội",         description: "Đang có lễ hội diễn ra" },
  "golden-hour":     { signal: "golden-hour",       icon: "🌅", label: "Golden Hour",    description: "Sắp đến giờ bình minh hoặc hoàng hôn" },
  "perfect-weather": { signal: "perfect-weather",   icon: "☀",  label: "Thời tiết đẹp", description: "Điều kiện thời tiết lý tưởng" },
  "editor-pick":     { signal: "editor-pick",       icon: "⭐", label: "Editor's Pick", description: "Được biên tập viên đề xuất" },
  "ai-pick":         { signal: "ai-pick",           icon: "🤖", label: "AI đề xuất",    description: "AI đánh giá phù hợp thời điểm" },
};

export interface HeartbeatResult {
  destinationId: string;
  score: number; // 0–100
  signals: HeartbeatSignal[];
  seasonalState?: string;
  seasonalIcon?: string;
  festivalName?: string;
  flowerName?: string;
  weatherCode?: number;
  weatherLabel?: string;
}

export interface WeatherData {
  lat: number;
  lng: number;
  temperatureC: number;
  weatherCode: number; // WMO code
  isDay: boolean;
  fetchedAt: number; // ms timestamp
}

export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "foggy"
  | "rainy"
  | "stormy";
