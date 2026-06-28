import { Sparkles } from "lucide-react";
import type { AIContext } from "@/lib/ai";
import { useT } from "@/lib/i18n";

function buildSummary(ctx: AIContext): string {
  const { destination: dest, provinceBundle: bundle, locale } = ctx;
  if (dest) {
    const tip = dest.travelTips[0] ? ` ${dest.travelTips[0]}` : "";
    if (locale === "vi")
      return `${dest.summary} Nên đến vào ${dest.bestTime.toLowerCase()}, dành khoảng ${dest.visitDuration.toLowerCase()}.${tip}`;
    return `${dest.summary} Best visited ${dest.bestTime.toLowerCase()}, plan about ${dest.visitDuration.toLowerCase()}.${tip}`;
  }
  if (bundle?.content) {
    return `${bundle.content.summary} ${bundle.content.story.split(".")[0]}.`;
  }
  return locale === "vi" ? "Một nơi đang chờ được khám phá." : "A place waiting to be explored.";
}

export function AISummary({ context }: { context: AIContext }) {
  const t = useT();
  const text = buildSummary(context);

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
