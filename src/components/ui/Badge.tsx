import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/lib/i18n";
import type { BadgeKind } from "@/lib/types";

const meta: Record<BadgeKind, { vi: string; en: string; className: string }> = {
  unesco: { vi: "UNESCO", en: "UNESCO", className: "bg-secondary/12 text-secondary" },
  trending: { vi: "Thịnh hành", en: "Trending", className: "bg-danger/12 text-danger" },
  festival: { vi: "Lễ hội", en: "Festival", className: "bg-lotus/15 text-lotus" },
  popular: { vi: "Nổi bật", en: "Popular", className: "bg-accent/15 text-accent" },
  verified: { vi: "Đã xác minh", en: "Verified", className: "bg-success/12 text-success" },
  new: { vi: "Mới", en: "New", className: "bg-primary/12 text-primary" },
  "hidden-gem": { vi: "Viên ngọc ẩn", en: "Hidden gem", className: "bg-primary/12 text-primary" },
  "ai-recommended": { vi: "AI gợi ý", en: "AI pick", className: "bg-secondary/12 text-secondary" },
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const { locale } = useI18n();
  const m = meta[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-tight",
        m.className,
        className,
      )}
    >
      {locale === "en" ? m.en : m.vi}
    </span>
  );
}
