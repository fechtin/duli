import { normalize } from "../utils/normalize";
import type { Destination, ProvinceBundle } from "@/lib/types";
import type { AIContext, AIProvider, AISuggestion } from "./types";

// Mock guide grounded in content PASSED IN via context (Bible 010 §5). The provider is
// data-source agnostic: the client passes fetched content, the Worker passes D1 content.

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

/** Stream a finished string as words, simulating LLM streaming (Bible 010 §13/17). */
async function* streamText(text: string): AsyncGenerator<string> {
  const tokens = text.split(/(\s+)/);
  for (const tk of tokens) {
    await wait(14 + Math.min(40, tk.length * 4));
    yield tk;
  }
}

/** Per-locale connector phrases used in mock AI responses. */
const phrases = {
  vi: {
    bestTime: (t: string, n: string) => `Thời điểm đẹp nhất để đến ${n} là ${t}. Bạn nên đi vào sáng sớm để ánh sáng dịu và tránh đông người.`,
    food: (n: string, list: string) => `Đừng bỏ lỡ hương vị địa phương của ${n}: ${list}. Buổi tối, các hàng quán vỉa hè là nơi thú vị nhất.`,
    itinerary: (n: string, list: string) => `Một ngày quanh ${n}, mình gợi ý: ${list}. Hãy bắt đầu sớm, ăn trưa nhẹ nhàng và để dành điểm đẹp nhất cho lúc hoàng hôn.`,
    photo: (n: string, tip: string) => `Để chụp ảnh đẹp ở ${n}, ${tip}`,
    fact: (f: string) => `Một điều thú vị: ${f}`,
    summaryDest: (s: string, bt: string, vd: string, tip: string) => `${s} Nên đến vào ${bt}, dành khoảng ${vd}.${tip}`,
    summaryBundle: (s: string, bt: string) => `${s} Thời điểm đẹp nhất là ${bt}.`,
    empty: "Hãy phóng to vào một vùng bất kỳ và chọn một địa điểm — mình sẽ kể cho bạn câu chuyện, thời điểm đẹp nhất và món nên thử.",
  },
  en: {
    bestTime: (t: string, n: string) => `The best time to visit ${n} is ${t}. Go early in the day for softer light and fewer crowds.`,
    food: (n: string, list: string) => `Don't miss the local flavours of ${n}: ${list}. Street stalls in the evening are where the magic happens.`,
    itinerary: (n: string, list: string) => `For a day around ${n}, I'd suggest: ${list}. Start early, keep lunch light, and save the most scenic spot for golden hour.`,
    photo: (n: string, tip: string) => `For photos at ${n}, ${tip}`,
    fact: (f: string) => `Here's something special: ${f}`,
    summaryDest: (s: string, bt: string, vd: string, tip: string) => `${s} Best visited ${bt}, plan about ${vd}.${tip}`,
    summaryBundle: (s: string, bt: string) => `${s} The best time is ${bt}.`,
    empty: "Zoom into any region and pick a place — I'll tell you its story, the best time to go and what to eat.",
  },
};

/** For locales without specific connector strings, just join the data fields directly. */
function genericPhrases(_locale: string) {
  return {
    bestTime: (t: string, _n: string) => t,
    food: (_n: string, list: string) => list,
    itinerary: (_n: string, list: string) => list,
    photo: (_n: string, tip: string) => tip,
    fact: (f: string) => f,
    summaryDest: (s: string, bt: string, vd: string, tip: string) => `${s} ${bt}. ${vd}.${tip}`,
    summaryBundle: (s: string, bt: string) => `${s} ${bt}.`,
    empty: "",
  };
}

function getPhrases(locale: string) {
  if (locale === "vi") return phrases.vi;
  if (locale === "en") return phrases.en;
  return genericPhrases(locale);
}

function answerFor(question: string, ctx: AIContext): string {
  const q = normalize(question);
  const dest: Destination | undefined = ctx.destination;
  const bundle: ProvinceBundle | undefined = ctx.provinceBundle;
  const ph = getPhrases(ctx.locale);
  const topic = dest?.name ?? bundle?.meta.name ?? "Vietnam";

  if (/(thoi diem|khi nao|mua nao|best time|when)/.test(q)) {
    const t = dest?.bestTime ?? bundle?.content?.bestTime;
    if (t) return ph.bestTime(t, topic);
  }

  if (/(mon|an gi|food|eat|cuisine|dac san|specialt)/.test(q)) {
    const foods = bundle?.content?.specialties;
    if (foods && foods.length) return ph.food(bundle!.meta.name, foods.slice(0, 4).join(", "));
  }

  if (/(lich trinh|di dau|ke hoach|itinerary|plan|route|1 ngay|one day)/.test(q) && bundle) {
    const list = bundle.destinations.slice(0, 3).map((d) => d.name);
    if (list.length) return ph.itinerary(bundle.meta.name, list.join(" → "));
  }

  if (/(chup anh|goc anh|photo|picture|instagram)/.test(q) && dest) {
    const tip = dest.travelTips[1] ?? dest.travelTips[0] ?? "";
    return ph.photo(dest.name, tip);
  }

  if (/(thu vi|dac biet|tai sao|interesting|why|special|fact)/.test(q)) {
    const fact = dest?.facts[0] ?? bundle?.content?.story?.split(".")[0];
    if (fact) return ph.fact(fact);
  }

  if (dest) return `${dest.summary} ${dest.travelTips[0] ?? ""}`.trim();
  if (bundle?.content) return ph.summaryBundle(bundle.content.summary, bundle.content.bestTime);
  return ph.empty || (ctx.locale === "en"
    ? "Zoom into any region and pick a place — I'll tell you its story, the best time to go and what to eat."
    : "Hãy phóng to vào một vùng bất kỳ và chọn một địa điểm — mình sẽ kể cho bạn câu chuyện.");
}

export const mockProvider: AIProvider = {
  async *streamChat(messages, ctx) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    yield* streamText(answerFor(last?.content ?? "", ctx));
  },

  async *summary(ctx) {
    const dest = ctx.destination;
    const bundle = ctx.provinceBundle;
    const ph = getPhrases(ctx.locale);
    let text: string;
    if (dest) {
      const tip = dest.travelTips[0] ? ` ${dest.travelTips[0]}` : "";
      text = ph.summaryDest(dest.summary, dest.bestTime.toLowerCase(), dest.visitDuration.toLowerCase(), tip);
    } else if (bundle?.content) {
      text = `${bundle.content.summary} ${bundle.content.story.split(".")[0]}.`;
    } else {
      text = ctx.locale === "en" ? "A place waiting to be explored." : "Một nơi đang chờ được khám phá.";
    }
    yield* streamText(text);
  },

  suggestions(ctx): AISuggestion[] {
    const destSuggestions: Record<string, AISuggestion[]> = {
      vi: [
        { label: "Thời điểm đẹp?", prompt: "Thời điểm nào đẹp nhất để đến?" },
        { label: "Góc chụp ảnh", prompt: "Góc chụp ảnh đẹp ở đâu?" },
        { label: "Điều thú vị", prompt: "Có điều gì thú vị ở đây?" },
      ],
      en: [
        { label: "Best time?", prompt: "When is the best time to visit?" },
        { label: "Photo spots", prompt: "Where are the best photo spots?" },
        { label: "Nearby", prompt: "What's interesting nearby?" },
      ],
      ko: [
        { label: "최적 방문시기?", prompt: "When is the best time to visit?" },
        { label: "포토스팟", prompt: "Where are the best photo spots?" },
        { label: "주변 볼거리", prompt: "What's interesting nearby?" },
      ],
      ja: [
        { label: "ベストシーズン?", prompt: "When is the best time to visit?" },
        { label: "撮影スポット", prompt: "Where are the best photo spots?" },
        { label: "周辺情報", prompt: "What's interesting nearby?" },
      ],
      zh: [
        { label: "最佳时机?", prompt: "When is the best time to visit?" },
        { label: "拍照胜地", prompt: "Where are the best photo spots?" },
        { label: "周边景点", prompt: "What's interesting nearby?" },
      ],
    };
    const provinceSuggestions: Record<string, AISuggestion[]> = {
      vi: [
        { label: "Khi nào nên đi", prompt: "Thời điểm nào đẹp nhất để đến?" },
        { label: "Ăn gì ngon", prompt: "Nên thử món gì ở đây?" },
        { label: "Lịch trình 1 ngày", prompt: "Gợi ý lịch trình một ngày." },
      ],
      en: [
        { label: "When to go", prompt: "When is the best time to visit?" },
        { label: "What to eat", prompt: "What food should I try here?" },
        { label: "One-day plan", prompt: "Suggest a one-day plan." },
      ],
      ko: [
        { label: "방문 시기", prompt: "When is the best time to visit?" },
        { label: "먹을거리", prompt: "What food should I try here?" },
        { label: "하루 일정", prompt: "Suggest a one-day plan." },
      ],
      ja: [
        { label: "旅行時期", prompt: "When is the best time to visit?" },
        { label: "グルメ", prompt: "What food should I try here?" },
        { label: "1日プラン", prompt: "Suggest a one-day plan." },
      ],
      zh: [
        { label: "旅行时机", prompt: "When is the best time to visit?" },
        { label: "特色美食", prompt: "What food should I try here?" },
        { label: "一日行程", prompt: "Suggest a one-day plan." },
      ],
    };
    const locale = ctx.locale in destSuggestions ? ctx.locale : "en";
    return ctx.destination ? destSuggestions[locale] : provinceSuggestions[locale];
  },

  async caption(ctx) {
    await wait(450);
    const name = ctx.destination?.name ?? ctx.destinationName;
    if (!name) {
      return ctx.locale === "en"
        ? "Somewhere in beautiful Vietnam ✨"
        : "Đâu đó trên dải đất Việt Nam xinh đẹp ✨";
    }
    const lines = ctx.locale === "en"
      ? [
          `Lost in the beauty of ${name} 🇻🇳`,
          `${name} — a memory I'll keep forever ✨`,
          `Some places stay with you. ${name} is one of them.`,
        ]
      : ctx.locale === "ko"
      ? [
          `${name}의 아름다움에 빠져들다 🇻🇳`,
          `${name} — 영원히 간직할 추억 ✨`,
          `어떤 곳은 마음속에 영원히 남는다. ${name}이 그런 곳이다.`,
        ]
      : ctx.locale === "ja"
      ? [
          `${name}の美しさに魅せられて 🇻🇳`,
          `${name} — いつまでも心に残る思い出 ✨`,
          `ずっと忘れられない場所がある。${name}はその一つ。`,
        ]
      : ctx.locale === "zh"
      ? [
          `沉醉在${name}的美丽之中 🇻🇳`,
          `${name} — 永远珍藏的回忆 ✨`,
          `有些地方会永远留在心里。${name}就是其中之一。`,
        ]
      : [
          `Lạc giữa vẻ đẹp của ${name} 🇻🇳`,
          `${name} — một ký ức mình sẽ giữ mãi ✨`,
          `Có những nơi khiến ta nhớ mãi. ${name} là một trong số đó.`,
        ];
    return lines[name.length % lines.length];
  },
};
