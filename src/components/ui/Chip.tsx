import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Small pill action — used for AI suggestions and tags (Bible 007 §22). */
export function Chip({ className, active, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition-colors duration-[120ms]",
        active
          ? "border-primary bg-primary-soft text-primary"
          : "border-border bg-surface text-muted hover:border-border-strong hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
