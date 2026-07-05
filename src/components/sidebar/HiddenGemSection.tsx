import { Gem, ArrowRight } from "lucide-react";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { SectionTitle } from "./primitives";
import { gemOfTheDay, focusDestinationById } from "./navHelpers";

/** Hidden Gem — an image-led editorial card (027 §Hidden Gem — "ảnh bắt buộc"). */
export function HiddenGemSection() {
  const gem = gemOfTheDay();
  if (!gem) return null;

  return (
    <section id="sb-gem">
      <SectionTitle icon={<Gem size={12} />}>Điểm ẩn hôm nay</SectionTitle>
      <button
        onClick={() => focusDestinationById(gem.id)}
        className="group block w-full overflow-hidden rounded-[20px] border border-[var(--sb-border)] bg-[var(--sb-surface)] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--sb-shadow-hover)]"
      >
        <div className="h-[130px] w-full overflow-hidden">
          <IllustratedImage
            seed={gem.seed}
            ratio="16/9"
            rounded={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
        <div className="p-3">
          <p className="font-display text-[15px] font-semibold text-[color:var(--sb-text)]">{gem.name}</p>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[color:var(--sb-text-dim)]">{gem.summary}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--sb-gold)]">
            Khám phá <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </section>
  );
}
