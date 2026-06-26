import { Sparkles } from "lucide-react";
import { ai, type AIContext } from "@/lib/ai";
import { useStreamedText } from "@/lib/ai/useStreamedText";
import { useI18n, useT } from "@/lib/i18n";

/** Streaming AI summary block (Bible 003 §9 step 4, marked as AI per 004 §20). */
export function AISummary({ context }: { context: AIContext }) {
  const t = useT();
  const { locale } = useI18n();
  const key = `${context.destinationId ?? context.provinceSlug ?? ""}-${locale}`;
  const { text, done } = useStreamedText(() => ai.summary(context), [key]);

  return (
    <div className="rounded-[var(--radius-md)] border border-primary/20 bg-primary-soft/60 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Sparkles size={14} />
        {t("panel.aiSummary")}
        <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          {t("common.aiBadge")}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">
        {text}
        {!done && <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-primary align-middle" />}
      </p>
    </div>
  );
}
