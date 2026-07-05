import type { ReactNode } from "react";

/** Small uppercase gold section label used across the sidebar feed (027 typography). */
export function SectionTitle({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-[color:var(--sb-gold)]">
      {icon}
      {children}
    </h3>
  );
}
