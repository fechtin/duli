import { LoginButton } from "@/components/auth/LoginButton";

/** Mobile header (029) — account avatar floating over the map.
 *  Search now lives in the bottom nav; language & theme in the Settings sheet. */
export function MobileTopBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-end p-3 pt-safe md:hidden">
      <div className="pointer-events-auto grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface/90 shadow-[var(--shadow-e2)] backdrop-blur-xl">
        <LoginButton />
      </div>
    </div>
  );
}
