import { motion } from "motion/react";
import { tripDayColor } from "@/lib/map/tripPalette";
import { cn } from "@/lib/utils/cn";

/**
 * Small pieces of the trip panel. Deliberately not promoted to `components/ui/` — that folder
 * stays minimal until a second feature needs one of these.
 *
 * `StopLabel` is the one exception that leaves this folder: the map badge imports it, because the
 * panel and the map must spell a stop's number the same way or it is not a name.
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
 * `day.order` — the identifier of one stop, e.g. `2.3`.
 *
 * Shared with the map badge on purpose, and exported for it: this string is the stop's NAME. Day
 * colour alone cannot answer "which day is this?" without a trip back to the day tabs, and answers
 * nothing at all to a red-green colour-blind reader. If the two surfaces ever formatted it
 * differently, pointing at "2.3" would stop meaning one place.
 *
 * The day segment is dimmed so the stop number still reads first — at 11px and equal weight, `1.1`
 * is easy to take for `11`.
 */
export function StopLabel({ day, order }: { day: number; order: number }) {
  return (
    <span className="tabular-nums">
      <span className="opacity-70">{day}</span>.{order}
    </span>
  );
}

/**
 * The numbered medallion on the timeline rail. Visually identical to the map badge, which is what
 * makes panel and map read as one object rather than two lists of the same places.
 *
 * `min-w-7` rather than `w-7`: it is a circle at one digit and a pill at `10.3`. It overflows its
 * `w-7` rail column by a couple of pixels, symmetrically — both wrappers centre it, so it stays on
 * the same axis as the dashed drive line above it.
 */
export function RailNode({ order, dark, dayIndex }: { order: number; dark: boolean; dayIndex: number }) {
  const c = tripDayColor(dayIndex, dark);
  return (
    <span
      className="relative z-10 grid h-7 min-w-7 shrink-0 place-items-center rounded-full px-1.5 text-[11px] font-bold"
      style={{ background: c.line, color: c.ink, boxShadow: "0 0 0 3px var(--color-surface)" }}
    >
      <StopLabel day={dayIndex + 1} order={order} />
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
