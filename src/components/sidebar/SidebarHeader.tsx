import { Compass } from "lucide-react";
import { useMapStore } from "@/lib/store/useMapStore";
import { useUIStore } from "@/lib/store/useUIStore";

/** Sidebar header — logo + a time-aware greeting (027 §Sidebar Header). */
export function SidebarHeader({ greeting, collapsed }: { greeting: string; collapsed: boolean }) {
  const reset = useMapStore((s) => s.reset);
  const closeMobile = useUIStore((s) => s.setSidebarMobileOpen);

  return (
    <button
      onClick={() => {
        reset();
        closeMobile(false);
      }}
      className="flex w-full items-center gap-2.5 rounded-[16px] px-1.5 py-1 text-left transition-colors hover:bg-[var(--sb-hover)]"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--sb-gold)] text-[#102b30] shadow-[0_2px_8px_rgba(212,168,75,0.35)]">
        <Compass size={19} />
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate font-display text-[15px] font-bold text-[color:var(--sb-text)]">
            FechTin Go
          </span>
          <span className="block truncate text-[11.5px] text-[color:var(--sb-text-dim)]">{greeting}</span>
        </span>
      )}
    </button>
  );
}
