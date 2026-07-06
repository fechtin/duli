import { ArrowRight } from "lucide-react";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { useT } from "@/lib/i18n";
import { heroOfTheDay, focusPoint } from "./navHelpers";

/** Daily Hero Banner — the sidebar's focal point (027 §Hero Banner / Hero Image). */
export function HeroBanner() {
  const t = useT();
  const hero = heroOfTheDay();

  return (
    <button
      onClick={() => focusPoint(hero.lng, hero.lat)}
      className="group relative block h-[220px] w-full overflow-hidden rounded-[24px] text-left shadow-[var(--sb-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.05]">
        <IllustratedImage seed={hero.seed} ratio="16/9" rounded={false} className="h-full w-full object-cover" />
      </div>
      {/* Dark overlay for legible white text (027 §Hero Image overlay). */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h2 className="font-display text-[22px] font-bold leading-tight text-white drop-shadow-sm">{hero.name}</h2>
        <p className="mt-0.5 text-[12.5px] text-white/85 drop-shadow-sm">{hero.subtitle}</p>
        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white backdrop-blur-sm transition-colors group-hover:bg-[var(--sb-gold)] group-hover:text-[#102b30]">
          {t("nav.explore")}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}
