import { motion } from "motion/react";
import { tripDayColor } from "@/lib/map/tripPalette";
import { cn } from "@/lib/utils/cn";

/**
 * Small pieces used only by the trip panel. Deliberately not promoted to `components/ui/` —
 * that folder stays minimal until a second feature needs one of these.
 */

/** One number in the result header. */
export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 rounded-[var(--radius-md)] bg-surface-2 px-3 py-2">
      <div className="type-heading text-foreground">{value}</div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}

/**
 * A day tab, coloured by its own day colour.
 *
 * The inline `style` out-specifies `Chip`'s hard-coded active classes, which is why this is a
 * plain button rather than a `Chip` — leaning on specificity to defeat a sibling component would
 * be the kind of trick that breaks silently when `Chip` is restyled.
 */
export function DayTab({
  n,
  labelShort,
  labelLong,
  active,
  dark,
  onClick,
}: {
  n: number;
  labelShort: string;
  labelLong: string;
  active: boolean;
  dark: boolean;
  onClick: () => void;
}) {
  const c = tripDayColor(n - 1, dark);
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 snap-start items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
        active ? "text-foreground" : "border-border text-muted hover:bg-surface-2",
      )}
      style={active ? { borderColor: c.line, background: c.soft } : undefined}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.line }} />
      <span className="md:hidden">{labelShort}</span>
      <span className="hidden md:inline">{labelLong}</span>
    </button>
  );
}

/**
 * The numbered medallion on the timeline rail. Visually identical to the map badge, which is what
 * makes panel and map read as one object rather than two lists of the same places.
 */
export function RailNode({ order, dark, dayIndex }: { order: number; dark: boolean; dayIndex: number }) {
  const c = tripDayColor(dayIndex, dark);
  return (
    <span
      className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
      style={{ background: c.line, boxShadow: "0 0 0 3px var(--color-surface)" }}
    >
      {order}
    </span>
  );
}

/** A hollow node — used for the overnight marker that closes each day. */
export function RailDot({ dark, dayIndex }: { dark: boolean; dayIndex: number }) {
  const c = tripDayColor(dayIndex, dark);
  return (
    <span
      className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 bg-surface"
      style={{ borderColor: c.line, boxShadow: "0 0 0 3px var(--color-surface)" }}
    />
  );
}

/** A notice the plan makes about itself — never styled as an error; these are honest caveats. */
export function TripNotice({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-[var(--radius-md)] bg-surface-2 px-3 py-2 text-[11px] leading-relaxed text-muted"
    >
      {children}
    </motion.p>
  );
}
