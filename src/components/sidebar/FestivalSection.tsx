import { PartyPopper, ArrowRight } from "lucide-react";
import festivalCalendar from "@/data/living/festival-calendar.json";
import { IllustratedImage } from "@/components/ui/IllustratedImage";
import { useI18n } from "@/lib/i18n";
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
  const month = new Date().getMonth() + 1;
  const festivals = (festivalCalendar as { festivals: FestivalEntry[] }).festivals
    .filter((f) => f.months.includes(month))
    .slice(0, 3);
  if (festivals.length === 0) return null;

  return (
    <section id="sb-festival">
      <SectionTitle icon={<PartyPopper size={12} />}>{t("sidebar.festivalsTitle")}</SectionTitle>
      <div className="flex flex-col gap-2">
        {festivals.map((f) => (
          <button
            key={f.id}
            onClick={() => focusDestinationById(f.destinationIds[0])}
            className="group relative block h-[110px] w-full overflow-hidden rounded-[18px] text-left shadow-[var(--sb-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <IllustratedImage
              seed={calendarSeed(f.destinationIds[0] ?? f.id)}
              ratio="16/9"
              rounded={false}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="font-display text-[15px] font-bold text-white drop-shadow-sm">
                {f.icon} {localizeFestivalName(f.id, f.name, locale)}
              </p>
              <p className="mt-0.5 line-clamp-1 text-[11.5px] text-white/85 drop-shadow-sm">
                {localizeFestivalDescription(f.id, f.description, locale)}
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
