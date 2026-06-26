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

function answerFor(question: string, ctx: AIContext): string {
  const q = normalize(question);
  const dest: Destination | undefined = ctx.destination;
  const bundle: ProvinceBundle | undefined = ctx.provinceBundle;
  const en = ctx.locale === "en";
  const topic = dest?.name ?? bundle?.meta.name ?? (en ? "Vietnam" : "Việt Nam");

  if (/(thoi diem|khi nao|mua nao|best time|when)/.test(q)) {
    const t = dest?.bestTime ?? bundle?.content?.bestTime;
    if (t)
      return en
        ? `The best time to visit ${topic} is ${t}. Go early in the day for softer light and fewer crowds.`
        : `Thời điểm đẹp nhất để đến ${topic} là ${t}. Bạn nên đi vào sáng sớm để ánh sáng dịu và tránh đông người.`;
  }

  if (/(mon|an gi|food|eat|cuisine|dac san|specialt)/.test(q)) {
    const foods = bundle?.content?.specialties;
    if (foods && foods.length)
      return en
        ? `Don't miss the local flavours of ${bundle?.meta.name}: ${foods.slice(0, 4).join(", ")}. Street stalls in the evening are where the magic happens.`
        : `Đừng bỏ lỡ hương vị địa phương của ${bundle?.meta.name}: ${foods.slice(0, 4).join(", ")}. Buổi tối, các hàng quán vỉa hè là nơi thú vị nhất.`;
  }

  if (/(lich trinh|di dau|ke hoach|itinerary|plan|route|1 ngay|one day)/.test(q) && bundle) {
    const list = bundle.destinations.slice(0, 3).map((d) => d.name);
    if (list.length)
      return en
        ? `For a day around ${bundle.meta.name}, I'd suggest: ${list.join(" → ")}. Start early, keep lunch light, and save the most scenic spot for golden hour.`
        : `Một ngày quanh ${bundle.meta.name}, mình gợi ý: ${list.join(" → ")}. Hãy bắt đầu sớm, ăn trưa nhẹ nhàng và để dành điểm đẹp nhất cho lúc hoàng hôn.`;
  }

  if (/(chup anh|goc anh|photo|picture|instagram)/.test(q) && dest) {
    const tip = dest.travelTips[1] ?? dest.travelTips[0];
    return en
      ? `For photos at ${dest.name}, ${tip ?? "arrive at golden hour and look for reflections and leading lines."}`
      : `Để chụp ảnh đẹp ở ${dest.name}, ${tip ?? "hãy đến vào giờ vàng và tìm những đường dẫn, mặt nước phản chiếu."}`;
  }

  if (/(thu vi|dac biet|tai sao|interesting|why|special|fact)/.test(q)) {
    const fact = dest?.facts[0] ?? bundle?.content?.story?.split(".")[0];
    if (fact) return en ? `Here's something special: ${fact}` : `Một điều thú vị: ${fact}`;
  }

  if (dest) return `${dest.summary} ${dest.travelTips[0] ?? ""}`.trim();
  if (bundle?.content)
    return en
      ? `${bundle.content.summary} The best time is ${bundle.content.bestTime}.`
      : `${bundle.content.summary} Thời điểm đẹp nhất là ${bundle.content.bestTime}.`;
  return en
    ? "Zoom into any region and pick a place — I'll tell you its story, the best time to go and what to eat."
    : "Hãy phóng to vào một vùng bất kỳ và chọn một địa điểm — mình sẽ kể cho bạn câu chuyện, thời điểm đẹp nhất và món nên thử.";
}

export const mockProvider: AIProvider = {
  async *streamChat(messages, ctx) {
    const last = [...messages].reverse().find((m) => m.role === "user");
    yield* streamText(answerFor(last?.content ?? "", ctx));
  },

  async *summary(ctx) {
    const dest = ctx.destination;
    const bundle = ctx.provinceBundle;
    const en = ctx.locale === "en";
    let text: string;
    if (dest) {
      const tip = dest.travelTips[0] ? ` ${dest.travelTips[0]}` : "";
      text = en
        ? `${dest.summary} Best visited ${dest.bestTime.toLowerCase()}, plan about ${dest.visitDuration.toLowerCase()}.${tip}`
        : `${dest.summary} Nên đến vào ${dest.bestTime.toLowerCase()}, dành khoảng ${dest.visitDuration.toLowerCase()}.${tip}`;
    } else if (bundle?.content) {
      text = `${bundle.content.summary} ${bundle.content.story.split(".")[0]}.`;
    } else {
      text = en ? "A place waiting to be explored." : "Một nơi đang chờ được khám phá.";
    }
    yield* streamText(text);
  },

  suggestions(ctx): AISuggestion[] {
    const en = ctx.locale === "en";
    if (ctx.destination) {
      return en
        ? [
            { label: "Best time?", prompt: "When is the best time to visit?" },
            { label: "Photo spots", prompt: "Where are the best photo spots?" },
            { label: "Nearby", prompt: "What's interesting nearby?" },
          ]
        : [
            { label: "Thời điểm đẹp?", prompt: "Thời điểm nào đẹp nhất để đến?" },
            { label: "Góc chụp ảnh", prompt: "Góc chụp ảnh đẹp ở đâu?" },
            { label: "Điều thú vị", prompt: "Có điều gì thú vị ở đây?" },
          ];
    }
    return en
      ? [
          { label: "When to go", prompt: "When is the best time to visit?" },
          { label: "What to eat", prompt: "What food should I try here?" },
          { label: "One-day plan", prompt: "Suggest a one-day plan." },
        ]
      : [
          { label: "Khi nào nên đi", prompt: "Thời điểm nào đẹp nhất để đến?" },
          { label: "Ăn gì ngon", prompt: "Nên thử món gì ở đây?" },
          { label: "Lịch trình 1 ngày", prompt: "Gợi ý lịch trình một ngày." },
        ];
  },

  async caption(ctx) {
    await wait(450);
    const name = ctx.destination?.name ?? ctx.destinationName;
    const en = ctx.locale === "en";
    if (!name) return en ? "Somewhere in beautiful Vietnam ✨" : "Đâu đó trên dải đất Việt Nam xinh đẹp ✨";
    const lines = en
      ? [
          `Lost in the beauty of ${name} 🇻🇳`,
          `${name} — a memory I'll keep forever ✨`,
          `Some places stay with you. ${name} is one of them.`,
        ]
      : [
          `Lạc giữa vẻ đẹp của ${name} 🇻🇳`,
          `${name} — một ký ức mình sẽ giữ mãi ✨`,
          `Có những nơi khiến ta nhớ mãi. ${name} là một trong số đó.`,
        ];
    return lines[name.length % lines.length];
  },
};
