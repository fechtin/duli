import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AwardedBadge, Checkin, CountryCode, TastedDish } from "@/lib/types";
import { fetchServerCheckins, saveServerCheckin, deleteServerCheckin } from "@/lib/api/checkins";
import { activeCountry } from "./useCountryStore";

interface PassportState {
  /** Every check-in the user has, across atlases — read it through the country-scoped helpers. */
  checkins: Checkin[];
  /** Food Passport (026) — dishes the user has tasted, tagged with the atlas they belong to. */
  tasted: TastedDish[];
  synced: boolean; // true after first successful server sync
  /** `country` defaults to the atlas on screen. */
  addCheckin: (c: Omit<Checkin, "id" | "createdAt" | "country"> & { country?: CountryCode }) => void;
  removeCheckin: (id: string) => void;
  hasVisited: (destinationId: string) => boolean;
  hasTasted: (dishId: string) => boolean;
  toggleTasted: (dishId: string, country?: CountryCode) => void;
  visitedProvinceSlugs: (country?: CountryCode) => string[];
  badges: (country?: CountryCode) => AwardedBadge[];
  /** Called on login: fetch server checkins and merge (server wins for same id). */
  syncFromServer: () => Promise<void>;
  /** Called on logout: clear checkins from memory (localStorage keeps them offline). */
  clearForLogout: () => void;
}

/**
 * Country-flavoured milestones. The generic count badges are shared; these scale with how
 * many first-level units an atlas has, so "half the country" means the same thing in both.
 */
interface CountryBadgeSpec {
  flag: string;
  name: string;
  provinceTotal: number;
  spanAt: number; // provinces for the "end to end" badge
  halfAt: number; // provinces for the "half the country" badge
  conquerAt: number; // check-ins for the "conqueror" badge
}

const COUNTRY_BADGES: Record<CountryCode, CountryBadgeSpec> = {
  vn: { flag: "🇻🇳", name: "Việt Nam", provinceTotal: 63, spanAt: 10, halfAt: 30, conquerAt: 40 },
  kr: { flag: "🇰🇷", name: "Hàn Quốc", provinceTotal: 17, spanAt: 5, halfAt: 9, conquerAt: 20 },
};

let counter = 0;
const newId = () => `ci_${Date.now().toString(36)}_${(counter++).toString(36)}`;

export const usePassportStore = create<PassportState>()(
  persist(
    (set, get) => ({
      checkins: [],
      tasted: [],
      synced: false,

      addCheckin: (c) => {
        const checkin: Checkin = { ...c, country: c.country ?? activeCountry(), id: newId(), createdAt: Date.now() };
        set((s) => ({ checkins: [checkin, ...s.checkins] }));
        // Fire-and-forget server save when logged in
        saveServerCheckin(checkin).catch(() => {});
      },

      removeCheckin: (id) => {
        set((s) => ({ checkins: s.checkins.filter((c) => c.id !== id) }));
        deleteServerCheckin(id).catch(() => {});
      },

      hasVisited: (destinationId) => get().checkins.some((c) => c.destinationId === destinationId),

      hasTasted: (dishId) => get().tasted.some((d) => d.id === dishId),

      toggleTasted: (dishId, country = activeCountry()) =>
        set((s) => ({
          tasted: s.tasted.some((d) => d.id === dishId)
            ? s.tasted.filter((d) => d.id !== dishId)
            : [...s.tasted, { id: dishId, country }],
        })),

      visitedProvinceSlugs: (country = activeCountry()) => [
        ...new Set(get().checkins.filter((c) => c.country === country).map((c) => c.provinceSlug)),
      ],

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

      badges: (country = activeCountry()) => {
        const spec = COUNTRY_BADGES[country];
        const checkins = get().checkins.filter((c) => c.country === country);
        const provinces = new Set(checkins.map((c) => c.provinceSlug));
        const n = checkins.length;
        const p = provinces.size;
        const f = get().tasted.filter((d) => d.country === country).length;
        const out: AwardedBadge[] = [];
        // Food badges (026 §Food Badges)
        if (f >= 1)  out.push({ id: "first-bite",    emoji: "🥢", label: "Miếng đầu tiên",      description: "1 món đã thử" });
        if (f >= 5)  out.push({ id: "food-hunter",   emoji: "🍜", label: "Thợ săn ẩm thực",     description: `${f} món đã thử` });
        if (f >= 10) out.push({ id: "food-master",   emoji: "👨‍🍳", label: "Bậc thầy vị giác",  description: `${f} món đã thử` });
        if (n >= 1)  out.push({ id: "first-step",   emoji: "🧭", label: "Bước chân đầu tiên", description: "1 check-in" });
        if (n >= 3)  out.push({ id: "foodie",       emoji: "🍜", label: "Tín đồ ẩm thực",      description: `${n} check-in` });
        if (n >= 5)  out.push({ id: "explorer",     emoji: "🗺️", label: "Nhà khám phá",         description: `${n} check-in` });
        if (p >= 3)  out.push({ id: "wanderer",     emoji: "🚲", label: "Kẻ lữ hành",           description: `${p} tỉnh` });
        if (n >= 12) out.push({ id: "storyteller",  emoji: "📷", label: "Người kể chuyện",      description: `${n} check-in` });
        if (p >= spec.spanAt)     out.push({ id: "north-south",  emoji: spec.flag, label: `Dọc ${spec.name}`,       description: `${p} tỉnh` });
        if (n >= 20)              out.push({ id: "veteran",      emoji: "⛵", label: "Lữ hành kỳ cựu",             description: `${n} check-in` });
        if (p >= spec.halfAt)     out.push({ id: "half-country", emoji: "🌄", label: `Nửa ${spec.name}`,            description: `${p} tỉnh` });
        if (n >= spec.conquerAt)  out.push({ id: "conqueror",    emoji: "🏔️", label: `Chinh phục ${spec.name}`,     description: `${n} check-in` });
        if (p >= spec.provinceTotal) out.push({ id: "full-country", emoji: "💎", label: `Trọn vẹn ${spec.name}`,    description: `${spec.provinceTotal} tỉnh` });
        // Return by rarity desc (highest threshold first = end of array)
        return out.reverse();
      },
    }),
    {
      name: "via.passport",
      version: 1,
      partialize: (s) => ({ checkins: s.checkins, tasted: s.tasted }),
      // v0 predates the country dimension: every stored check-in and tasted dish is Vietnamese.
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as {
          checkins?: Checkin[];
          tasted?: TastedDish[];
          tastedDishes?: string[];
        };
        if (version >= 1) return { checkins: s.checkins ?? [], tasted: s.tasted ?? [] };
        return {
          checkins: (s.checkins ?? []).map((c) => ({ ...c, country: c.country ?? ("vn" as CountryCode) })),
          tasted: (s.tastedDishes ?? []).map((id) => ({ id, country: "vn" as CountryCode })),
        };
      },
    },
  ),
);
