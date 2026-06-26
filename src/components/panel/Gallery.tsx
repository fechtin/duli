import { IllustratedImage } from "@/components/ui/IllustratedImage";
import type { GalleryImage } from "@/lib/types";

/** Asymmetric gallery (Bible 007 §17 — masonry feel, not a uniform grid). */
export function Gallery({ images }: { images: GalleryImage[] }) {
  if (!images.length) return null;
  const [lead, ...rest] = images;
  return (
    <div className="grid grid-cols-2 gap-2">
      <IllustratedImage seed={lead.seed} ratio="4/3" caption={lead.caption} className="col-span-2" />
      {rest.slice(0, 4).map((img) => (
        <IllustratedImage key={img.seed} seed={img.seed} ratio="1/1" caption={img.caption} />
      ))}
    </div>
  );
}
