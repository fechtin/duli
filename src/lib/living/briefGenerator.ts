import seasonalCalendar from "@/data/living/seasonal-calendar.json";
import festivalCalendar from "@/data/living/festival-calendar.json";
import flowerCalendar from "@/data/living/flower-calendar.json";

export type BriefPeriod = "morning" | "afternoon" | "evening" | "weekend" | "holiday";

export interface BriefContent {
  period: BriefPeriod;
  /** Period emoji for the collapsed Companion Card. */
  emoji: string;
  /** One-line, time-aware teaser shown when the Companion Card is collapsed (023 §Dynamic Brief). */
  teaser: string;
  greeting: string;
  heroStory: string;
  highlights: string[];
  aiRecommendation: string;
  hiddenGem: string;
  month: number;
}

const PERIOD_EMOJI: Record<BriefPeriod, string> = {
  morning:   "🌸",
  afternoon: "☀️",
  evening:   "🌙",
  weekend:   "🧭",
  holiday:   "🎉",
};

// Time-aware teaser prompts — the 1-line headline (023: 09:00 Good Morning · 15:00 "Chiều nay
// nên đi đâu?" · 20:00 "Khám phá Việt Nam về đêm").
const TEASERS: Record<BriefPeriod, string> = {
  morning:   "Chào buổi sáng",
  afternoon: "Chiều nay nên đi đâu?",
  evening:   "Khám phá Việt Nam về đêm",
  weekend:   "Cuối tuần — đi đâu đó thôi",
  holiday:   "Kỳ nghỉ đã đến",
};

type SeasonEntry = { destinationId: string; state: string; icon: string; mood: string };
type FestivalEntry = { id: string; name: string; months: number[]; icon: string; destinationIds: string[]; description: string };
type FlowerEntry  = { destinationId: string; flower: string; icon: string };

// Hardcoded destination name map for brief display
const DEST_NAMES: Record<string, string> = {
  "hoi-an-ancient-town":      "Hội An",
  "hue-imperial-city":        "Huế",
  "ha-long-bay":              "Hạ Long",
  "sa-pa-town":               "Sa Pa",
  "da-lat-city":              "Đà Lạt",
  "phu-quoc-island":          "Phú Quốc",
  "golden-bridge":            "Cầu Vàng Đà Nẵng",
  "phong-nha-cave":           "Phong Nha",
  "nha-trang-beach":          "Nha Trang",
  "old-quarter-hanoi":        "Hà Nội",
  "trang-an":                 "Tràng An",
  "moc-chau-plateau":         "Mộc Châu",
  "son-doong-cave":           "Sơn Đoòng",
  "lung-cu-flag-tower":       "Lũng Cú",
  "ma-pi-leng-pass":          "Mã Pì Lèng",
  "dong-van-old-town":        "Đồng Văn",
  "mui-ne-sand-dunes":        "Mũi Né",
  "bai-sao-beach":            "Bãi Sao Phú Quốc",
  "hon-mun-island":           "Hòn Mun",
  "tra-su-forest":            "Rừng Tràm Trà Sư",
  "buon-don":                 "Buôn Đôn",
  "dray-nur-waterfall":       "Thác Đray Nur",
  "cai-rang-floating-market": "Chợ nổi Cái Răng",
  "dien-bien-phu-battlefield":"Điện Biên Phủ",
  "mieu-ba-chua-xu":          "Miếu Bà Chúa Xứ",
  "hoan-kiem-lake":           "Hồ Hoàn Kiếm",
  "ben-thanh-market":         "Chợ Bến Thành",
  // IDs used by the living calendars (seasonal/festival/flower) — distinct from content IDs above.
  "cat-ba-island":            "Cát Bà",
  "da-nang-coast":            "Đà Nẵng",
  "ha-giang-loop":            "Hà Giang",
  "ha-noi-old-quarter":       "Hà Nội",
  "ho-chi-minh-city":         "TP. Hồ Chí Minh",
  "hoi-an-old-town":          "Hội An",
  "mu-cang-chai-terraces":    "Mù Cang Chải",
  "nha-trang-coast":          "Nha Trang",
  "ninh-binh-trang-an":       "Ninh Bình",
  "perfume-pagoda":           "Chùa Hương",
  "phan-thiet-coast":         "Phan Thiết",
  "phong-nha-caves":          "Phong Nha",
  "phu-yen-coast":            "Phú Yên",
  "sapa-terraces":            "Sa Pa",
};

function destName(id: string): string {
  return DEST_NAMES[id] ?? id;
}

function vietnamHour(): number {
  return (new Date().getUTCHours() + 7) % 24;
}
function currentMonth(): number {
  return new Date().getMonth() + 1;
}
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getBriefPeriod(): BriefPeriod {
  if (isWeekend()) return "weekend";
  const h = vietnamHour();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  return "evening";
}

const HIDDEN_GEMS = [
  "son-doong-cave",
  "tra-su-forest",
  "dray-nur-waterfall",
  "ma-pi-leng-pass",
  "bai-sao-beach",
  "hon-mun-island",
  "buon-don",
  "mieu-ba-chua-xu",
];

export function generateBrief(): BriefContent {
  const month  = currentMonth();
  const period = getBriefPeriod();

  const seasonal = ((seasonalCalendar as Record<string, SeasonEntry[]>)[String(month)] ?? []).slice(0, 3);
  const flowers  = ((flowerCalendar  as Record<string, FlowerEntry[]>)[String(month)]  ?? []).slice(0, 2);
  const festivals = (festivalCalendar as { festivals: FestivalEntry[] }).festivals
    .filter((f) => f.months.includes(month));

  // Hero story — best seasonal entry of the month
  const hero = seasonal[0];
  const heroName = hero ? destName(hero.destinationId) : "Việt Nam";
  const heroState = hero?.state ?? "luôn tươi đẹp";

  // Highlights
  const highlights: string[] = [];
  seasonal.forEach((s) => highlights.push(`${s.icon} ${destName(s.destinationId)} — ${s.state}`));
  festivals.slice(0, 2).forEach((f) => highlights.push(`${f.icon} ${f.name} — ${f.description.slice(0, 50)}…`));
  flowers.slice(0, 1).forEach((fl) => highlights.push(`${fl.icon} ${fl.flower} đang nở tại ${destName(fl.destinationId)}`));

  // AI recommendation text
  const aiRec = seasonal.length > 1
    ? `Tháng ${month} là thời điểm lý tưởng để khám phá ${destName(seasonal[0].destinationId)} và ${destName(seasonal[1].destinationId)}. ${seasonal[0].state}.`
    : `Tháng ${month}, đừng bỏ lỡ ${heroName} — ${heroState}.`;

  // Hidden gem of the day — rotate by day-of-year
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const gem = HIDDEN_GEMS[doy % HIDDEN_GEMS.length];

  // Greeting & heroStory by period
  const GREETINGS: Record<BriefPeriod, string> = {
    morning:   "Chào buổi sáng!",
    afternoon: "Buổi chiều bình yên.",
    evening:   "Chúc buổi tối tuyệt vời.",
    weekend:   "Cuối tuần rồi — đi đâu đó thôi!",
    holiday:   "Kỳ nghỉ đã đến!",
  };

  const HERO_INTROS: Record<BriefPeriod, string> = {
    morning:   `Hôm nay ${heroName} ${heroState.toLowerCase()}. Đây là những nơi đáng ghé thăm nhất trong ngày.`,
    afternoon: `Buổi chiều nay, ${heroName} ${heroState.toLowerCase()}. Còn rất nhiều nơi đang chờ bạn khám phá.`,
    evening:   `Đêm nay, ${heroName} ${heroState.toLowerCase()}. Một buổi tối không thể đẹp hơn.`,
    weekend:   `Cuối tuần này, ${heroName} ${heroState.toLowerCase()}. Hãy để chuyến đi bắt đầu.`,
    holiday:   `Kỳ nghỉ đặc biệt với ${heroName} — ${heroState.toLowerCase()}.`,
  };

  return {
    period,
    emoji:           PERIOD_EMOJI[period],
    teaser:          `${TEASERS[period]} · ${heroName} ${heroState.toLowerCase()}`,
    greeting:        GREETINGS[period],
    heroStory:       HERO_INTROS[period],
    highlights:      highlights.slice(0, 5),
    aiRecommendation: aiRec,
    hiddenGem:       destName(gem),
    month,
  };
}
