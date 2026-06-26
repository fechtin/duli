import { cn } from "@/lib/utils/cn";

/** Layout-shaped skeleton (Bible 006 §12) — never a generic grey block. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[var(--radius-md)] bg-surface-2", className)} aria-hidden />;
}
