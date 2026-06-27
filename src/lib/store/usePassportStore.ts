import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AwardedBadge, Checkin } from "@/lib/types";

interface PassportState {
  checkins: Checkin[];
  addCheckin: (c: Omit<Checkin, "id" | "createdAt">) => void;
  removeCheckin: (id: string) => void;
  hasVisited: (destinationId: string) => boolean;
  visitedProvinceSlugs: () => string[];
  badges: () => AwardedBadge[];
}

let counter = 0;
const newId = () => `ci_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      checkins: [],

      addCheckin: (c) =>
        set((s) => ({
          checkins: [{ ...c, id: newId(), createdAt: Date.now() }, ...s.checkins],
        })),

      removeCheckin: (id) => set((s) => ({ checkins: s.checkins.filter((c) => c.id !== id) })),

      hasVisited: (destinationId) => get().checkins.some((c) => c.destinationId === destinationId),

      visitedProvinceSlugs: () => [...new Set(get().checkins.map((c) => c.provinceSlug))],

      badges: () => {
        const { checkins } = get();
        const provinces = new Set(checkins.map((c) => c.provinceSlug));
        const out: AwardedBadge[] = [];
        // Khám phá
        if (checkins.length >= 1)  out.push({ id: "first-step",   emoji: "🧭", label: "Bước chân đầu tiên" });
        if (checkins.length >= 5)  out.push({ id: "explorer",     emoji: "🗺️", label: "Nhà khám phá" });
        if (checkins.length >= 20) out.push({ id: "veteran",      emoji: "⛵", label: "Lữ hành kỳ cựu" });
        if (checkins.length >= 40) out.push({ id: "conqueror",    emoji: "🏔️", label: "Chinh phục Việt Nam" });
        // Tỉnh thành
        if (provinces.size >= 3)  out.push({ id: "wanderer",     emoji: "🚲", label: "Kẻ lữ hành" });
        if (provinces.size >= 10) out.push({ id: "north-south",  emoji: "🇻🇳", label: "Dọc miền đất nước" });
        if (provinces.size >= 30) out.push({ id: "half-country", emoji: "🌄", label: "Nửa dải đất nước" });
        if (provinces.size >= 63) out.push({ id: "full-country", emoji: "💎", label: "Trọn vẹn Việt Nam" });
        // Trải nghiệm
        if (checkins.length >= 12) out.push({ id: "storyteller", emoji: "📷", label: "Người kể chuyện" });
        if (checkins.length >= 3)  out.push({ id: "foodie",      emoji: "🍜", label: "Tín đồ ẩm thực" });
        return out;
      },
    }),
    {
      name: "via.passport",
      partialize: (s) => ({ checkins: s.checkins }),
    },
  ),
);
