import { cn } from "@/lib/utils/cn";
import { useT } from "@/lib/i18n";
import type { BadgeKind } from "@/lib/types";

// Visual style per badge; the label comes from the i18n dictionary (badge.<kind>).
const badgeClass: Record<BadgeKind, string> = {
  unesco: "bg-secondary/12 text-secondary",
  trending: "bg-danger/12 text-danger",
  festival: "bg-lotus/15 text-lotus",
  popular: "bg-accent/15 text-accent",
  verified: "bg-success/12 text-success",
  new: "bg-primary/12 text-primary",
  "hidden-gem": "bg-primary/12 text-primary",
  "ai-recommended": "bg-secondary/12 text-secondary",
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const t = useT();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight",
        badgeClass[kind],
        className,
      )}
    >
      {t(`badge.${kind}`)}
    </span>
  );
}
