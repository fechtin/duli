import { Sparkles } from "lucide-react";
import type { AIContext } from "@/lib/ai";
import { useT } from "@/lib/i18n";

type TFn = (key: string, params?: Record<string, string | number>) => string;

function buildSummary(ctx: AIContext, t: TFn): string {
  const { destination: dest, provinceBundle: bundle } = ctx;
  if (dest) {
    const tip = dest.travelTips[0] ? ` ${dest.travelTips[0]}` : "";
    return t("ai.summary.dest", {
      summary: dest.summary,
      time: dest.bestTime.toLowerCase(),
      duration: dest.visitDuration.toLowerCase(),
      tip,
    });
  }
  if (bundle?.content) {
    return `${bundle.content.summary} ${bundle.content.story.split(".")[0]}.`;
  }
  return t("ai.summary.generic");
}

export function AISummary({ context }: { context: AIContext }) {
  const t = useT();
  const text = buildSummary(context, t);

  return (
    <div className="rounded-[var(--radius-md)] border border-primary/20 bg-primary-soft/60 p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-primary">
        <Sparkles size={14} />
        {t("panel.aiSummary")}
        <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
          {t("common.aiBadge")}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90">{text}</p>
    </div>
  );
}
