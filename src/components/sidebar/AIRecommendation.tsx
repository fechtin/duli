import { Sparkles, ArrowRight } from "lucide-react";
import { useUIStore } from "@/lib/store/useUIStore";

/** AI Recommendation card — gold-edged, deep-teal panel (027 §AI Recommendation). */
export function AIRecommendation({ text }: { text: string }) {
  const setAiOpen = useUIStore((s) => s.setAiOpen);

  return (
    <section
      className="overflow-hidden rounded-[20px] border border-[var(--sb-border)] bg-[var(--sb-surface)] p-3.5"
      style={{ borderLeft: "3px solid var(--sb-gold)" }}
    >
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[color:var(--sb-gold)]">
        <Sparkles size={13} /> AI đề xuất
      </p>
      <p className="text-[12.5px] leading-relaxed text-[color:var(--sb-text-dim)]">{text}</p>
      <button
        onClick={() => setAiOpen(true)}
        className="mt-2.5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[color:var(--sb-text)] transition-colors hover:text-[color:var(--sb-gold)]"
      >
        Lên lịch trình
        <ArrowRight size={14} />
      </button>
    </section>
  );
}
