import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { SectionTitle } from "./primitives";
import { seasonalHighlights, focusDestinationById } from "./navHelpers";

/** Today's Highlights — seasonal cards, image-forward (027 §Today's Highlights). */
export function HighlightsSection() {
  const items = seasonalHighlights(4);
  if (items.length === 0) return null;

  return (
    <section>
      <SectionTitle icon={<span>🌸</span>}>Nổi bật hôm nay</SectionTitle>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => focusDestinationById(it.id)}
            className="group flex items-center gap-3 rounded-[18px] border border-[var(--sb-border)] bg-[var(--sb-surface)] p-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--sb-hover)] hover:shadow-[var(--sb-shadow-hover)]"
          >
            <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px]">
              <IllustratedImage seed={it.seed} ratio="1/1" rounded={false} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-[14.5px] font-semibold text-[color:var(--sb-text)]">
                {it.name}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[color:var(--sb-text-dim)]">
                {it.icon} {it.state}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
