import { MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { mapLinks, type MapPlace } from "@/lib/maps/links";
import { naverPlaceId } from "@/lib/maps/naver-places";
import { googlePlaceId } from "@/lib/maps/google-places";
import { cn } from "@/lib/utils/cn";

/**
 * "Open this place" row — hands the place off to Google Maps (and Naver Map in Korea) so the user
 * can look it over there before deciding to go. Directions are that app's job, one tap further.
 * Which providers appear is decided by the active country; see src/lib/maps/links.ts.
 */
export function MapLinks({
  place,
  size = "md",
  className,
}: {
  place: MapPlace;
  size?: "sm" | "md";
  className?: string;
}) {
  const t = useT();
  const country = useCountryStore((s) => s.country);
  const links = mapLinks(place, country, {
    google: googlePlaceId(place.id),
    naver: naverPlaceId(place.id),
  });

  return (
    <div className={cn("flex gap-2", className)}>
      {links.map((link) => (
        <a
          key={link.provider}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("maps.viewOn", { provider: link.name, name: place.name })}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border font-semibold text-foreground transition-colors hover:bg-surface-2",
            size === "sm" ? "py-2 text-xs" : "h-11 px-4 text-sm",
          )}
        >
          <MapPin size={size === "sm" ? 13 : 15} className="text-primary" />
          {link.name}
        </a>
      ))}
    </div>
  );
}
