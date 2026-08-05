import { useEffect, useMemo, useState } from "react";
import { Gem, ArrowRight } from "lucide-react";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { useI18n } from "@/lib/i18n";
import { fetchDestination } from "@/lib/api/content";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { useContentStore } from "@/lib/store/useContentStore";
import { SectionTitle } from "./primitives";
import { gemOfTheDay, focusDestinationById } from "./navHelpers";

/** Hidden Gem — an image-led editorial card (027 §Hidden Gem — "ảnh bắt buộc"). */
export function HiddenGemSection() {
  const { t, locale } = useI18n();
  const country = useCountryStore((s) => s.country);
  const destinations = useContentStore((s) => s.destinations);
  const gem = useMemo(() => gemOfTheDay(country), [country, destinations]);
  // The gem is a real content destination, so its name/summary live in D1 with per-locale
  // translations. gemOfTheDay() gives the Vietnamese baseline instantly; overlay the localized
  // copy from the API (skipped for vi, which is already the base).
  const [tr, setTr] = useState<{ name: string; summary: string } | null>(null);

  useEffect(() => {
    setTr(null);
    if (!gem || locale === "vi") return;
    let alive = true;
    fetchDestination(gem.id, locale, country).then((d) => {
      if (alive && d) setTr({ name: d.name, summary: d.summary });
    });
    return () => {
      alive = false;
    };
  }, [gem, locale, country]);

  if (!gem) return null;
  const name = tr?.name ?? gem.name;
  const summary = tr?.summary ?? gem.summary;

  return (
    <section id="sb-gem">
      <SectionTitle icon={<Gem size={12} />}>{t("sidebar.hiddenGemTitle")}</SectionTitle>
      <button
        onClick={() => focusDestinationById(gem.id, country)}
        className="group block w-full overflow-hidden rounded-[20px] border border-[var(--sb-border)] bg-[var(--sb-surface)] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--sb-shadow-hover)]"
      >
        <div className="h-[130px] w-full overflow-hidden">
          <IllustratedImage
            seed={gem.seed}
            ratio="16/9"
            rounded={false}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        </div>
        <div className="p-3">
          <p className="font-display text-[15px] font-semibold text-[color:var(--sb-text)]">{name}</p>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[color:var(--sb-text-dim)]">{summary}</p>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--sb-gold)]">
            {t("nav.explore")} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </section>
  );
}
