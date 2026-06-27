import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AwardedBadge, Checkin } from "@/lib/types";
import { fetchServerCheckins, saveServerCheckin, deleteServerCheckin } from "@/lib/api/checkins";

interface PassportState {
  checkins: Checkin[];
  synced: boolean; // true after first successful server sync
  addCheckin: (c: Omit<Checkin, "id" | "createdAt">) => void;
  removeCheckin: (id: string) => void;
  hasVisited: (destinationId: string) => boolean;
  visitedProvinceSlugs: () => string[];
  badges: () => AwardedBadge[];
  /** Called on login: fetch server checkins and merge (server wins for same id). */
  syncFromServer: () => Promise<void>;
  /** Called on logout: clear checkins from memory (localStorage keeps them offline). */
  clearForLogout: () => void;
}

let counter = 0;
const newId = () => `ci_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      checkins: [],
      synced: false,

      addCheckin: (c) => {
        const checkin: Checkin = { ...c, id: newId(), createdAt: Date.now() };
        set((s) => ({ checkins: [checkin, ...s.checkins] }));
        // Fire-and-forget server save when logged in
        saveServerCheckin(checkin).catch(() => {});
      },

      removeCheckin: (id) => {
        set((s) => ({ checkins: s.checkins.filter((c) => c.id !== id) }));
        deleteServerCheckin(id).catch(() => {});
      },

      hasVisited: (destinationId) => get().checkins.some((c) => c.destinationId === destinationId),

      visitedProvinceSlugs: () => [...new Set(get().checkins.map((c) => c.provinceSlug))],

      syncFromServer: async () => {
        try {
          const serverCheckins = await fetchServerCheckins();
          if (serverCheckins.length === 0 && get().synced) return;

          set((s) => {
            // Merge: server wins for same id, keep local-only items
            const serverIds = new Set(serverCheckins.map((c) => c.id));
            const localOnly = s.checkins.filter((c) => !serverIds.has(c.id));
            const merged = [...serverCheckins, ...localOnly].sort((a, b) => b.createdAt - a.createdAt);
            return { checkins: merged, synced: true };
          });

          // Push any local-only checkins up to server
          const serverIds = new Set(serverCheckins.map((c) => c.id));
          const localOnly = get().checkins.filter((c) => !serverIds.has(c.id));
          await Promise.all(localOnly.map((c) => saveServerCheckin(c).catch(() => {})));
        } catch {
          // Offline — keep local state
        }
      },

      clearForLogout: () => set({ checkins: [], synced: false }),

      badges: () => {
        const { checkins } = get();
        const provinces = new Set(checkins.map((c) => c.provinceSlug));
        const out: AwardedBadge[] = [];
        if (checkins.length >= 1)  out.push({ id: "first-step",   emoji: "🧭", label: "Bước chân đầu tiên" });
        if (checkins.length >= 5)  out.push({ id: "explorer",     emoji: "🗺️", label: "Nhà khám phá" });
        if (checkins.length >= 20) out.push({ id: "veteran",      emoji: "⛵", label: "Lữ hành kỳ cựu" });
        if (checkins.length >= 40) out.push({ id: "conqueror",    emoji: "🏔️", label: "Chinh phục Việt Nam" });
        if (provinces.size >= 3)   out.push({ id: "wanderer",     emoji: "🚲", label: "Kẻ lữ hành" });
        if (provinces.size >= 10)  out.push({ id: "north-south",  emoji: "🇻🇳", label: "Dọc miền đất nước" });
        if (provinces.size >= 30)  out.push({ id: "half-country", emoji: "🌄", label: "Nửa dải đất nước" });
        if (provinces.size >= 63)  out.push({ id: "full-country", emoji: "💎", label: "Trọn vẹn Việt Nam" });
        if (checkins.length >= 12) out.push({ id: "storyteller",  emoji: "📷", label: "Người kể chuyện" });
        if (checkins.length >= 3)  out.push({ id: "foodie",       emoji: "🍜", label: "Tín đồ ẩm thực" });
        return out;
      },
    }),
    {
      name: "via.passport",
      partialize: (s) => ({ checkins: s.checkins }),
    },
  ),
);
