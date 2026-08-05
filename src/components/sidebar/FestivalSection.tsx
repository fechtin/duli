import { PartyPopper, ArrowRight } from "lucide-react";
import festivalCalendar from "@/data/living/festival-calendar.json";
import { krFestivals } from "@/data/kr/living";
import { krFestivalName, krFestivalDescription } from "@/data/kr/living-i18n";
import { destinationsKr } from "@/data/kr";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { useI18n } from "@/lib/i18n";
import { useCountryStore } from "@/lib/store/useCountryStore";
import { localizeFestivalName, localizeFestivalDescription } from "@/lib/living/livingI18n";
import { SectionTitle } from "./primitives";
import { focusDestinationById, calendarSeed } from "./navHelpers";

type FestivalEntry = {
  id: string;
  name: string;
  months: number[];
  icon: string;
  destinationIds: string[];
  description: string;
};

/** Festivals this month — banner cards, not bare icons (027 §Festival Section). */
export function FestivalSection() {
  const { t, locale } = useI18n();
  const country = useCountryStore((s) => s.country);
  const month = new Date().getMonth() + 1;
  // Korea's calendar points at real destination ids, so its card photo comes from the
  // destination's own gallery seed instead of the Vietnam calendar seed map.
  const source: FestivalEntry[] =
    country === "kr" ? krFestivals : (festivalCalendar as { festivals: FestivalEntry[] }).festivals;
  const festivals = source.filter((f) => f.months.includes(month)).slice(0, 3);
  const seedFor = (f: FestivalEntry) => {
    if (country !== "kr") return calendarSeed(f.destinationIds[0] ?? f.id);
    const d = destinationsKr.find((x) => x.id === f.destinationIds[0]);
    return d?.gallery?.[0]?.seed ?? f.destinationIds[0] ?? f.id;
  };
  if (festivals.length === 0) return null;

  return (
    <section id="sb-festival">
      <SectionTitle icon={<PartyPopper size={12} />}>{t("sidebar.festivalsTitle")}</SectionTitle>
      <div className="flex flex-col gap-2">
        {festivals.map((f) => (
          <button
            key={f.id}
            onClick={() => focusDestinationById(f.destinationIds[0], country)}
            className="group relative block h-[110px] w-full overflow-hidden rounded-[18px] text-left shadow-[var(--sb-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <IllustratedImage
              seed={seedFor(f)}
              ratio="16/9"
              rounded={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-[15px] font-bold text-white drop-shadow-sm">
                {f.icon} {country === "kr" ? krFestivalName(f.id, f.name, locale) : localizeFestivalName(f.id, f.name, locale)}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[11.5px] text-white/85 drop-shadow-sm">
                {country === "kr"
                  ? krFestivalDescription(f.id, f.description, locale)
                  : localizeFestivalDescription(f.id, f.description, locale)}
              </p>
            </div>
            <ArrowRight
              size={15}
              className="absolute right-3 top-3 text-white/80 transition-transform group-hover:translate-x-0.5"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
