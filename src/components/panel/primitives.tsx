import { type ReactNode } from "react";
import { motion } from "motion/react";
import { duration, easeOut } from "@/design/motion";

/** A revealed section — progressive disclosure with a gentle rise (Bible 003 §2.4). */
export function Section({ title, index = 0, children }: { title?: string; index?: number; children: ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.medium, ease: easeOut, delay: Math.min(index * 0.05, 0.3) }}
      className="px-5 py-4"
    >
      {title && <h3 className="mb-2.5 text-sm font-semibold text-foreground">{title}</h3>}
      {children}
    </motion.section>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export function Divider() {
  return <div className="mx-5 h-px bg-border" />;
}
