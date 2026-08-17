import { IllustratedImage, hasPhoto } from "@/components/ui/IllustratedImage";
import type { Tile } from "@/lib/media/gallery";
import { useUIStore } from "@/lib/store/useUIStore";
import { useT } from "@/lib/i18n";

/**
 * Asymmetric gallery (Bible 007 §17 — masonry feel, not a uniform grid).
 *
 * Ô nào có là việc của manifest, và ảnh bìa đã bị `galleryFor` loại ra rồi — xem
 * src/lib/media/gallery.ts.
 */
export function Gallery({ tiles }: { tiles: Tile[] }) {
  const t = useT();
  const openLightbox = useUIStore((s) => s.openLightbox);

  if (!tiles.length) return null;

  // Only photographed tiles open the viewer, and the viewer only ever pages through those:
  // a gradient tile is a caption waiting for a photo, and there is nothing in it to enlarge.
  const viewable = tiles.filter((tile) => hasPhoto(tile.seed));
  const open = (seed: string) => {
    const index = viewable.findIndex((v) => v.seed === seed);
    if (index >= 0) openLightbox(viewable, index);
  };

  const [lead, ...rest] = tiles;
  return (
    <div className="grid grid-cols-2 gap-2">
      <Tile tile={lead} span onOpen={open} label={t("lightbox.open")} />
      {rest.map((tile) => (
        <Tile key={tile.seed} tile={tile} onOpen={open} label={t("lightbox.open")} />
      ))}
    </div>
  );
}

function Tile({
  tile,
  span,
  onOpen,
  label,
}: {
  tile: { seed: string; caption: string; alt: string };
  span?: boolean;
  onOpen: (seed: string) => void;
  label: string;
}) {
  const ratio = span ? "4/3" : "1/1";
  if (!hasPhoto(tile.seed)) {
    return (
      <IllustratedImage
        seed={tile.seed}
        ratio={ratio}
        caption={tile.caption}
        alt={tile.alt}
        className={span ? "col-span-2" : undefined}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpen(tile.seed)}
      aria-label={`${label}: ${tile.alt}`}
      className={`block cursor-zoom-in rounded-[var(--radius-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        span ? "col-span-2" : ""
      }`}
    >
      <IllustratedImage seed={tile.seed} ratio={ratio} caption={tile.caption} alt={tile.alt} />
    </button>
  );
}
