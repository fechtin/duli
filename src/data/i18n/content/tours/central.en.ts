// English translations for the Huế / Nha Trang / Ninh Bình tour stops (tasks/039).
// Covers regions/tours/central.ts. Arrays index-aligned with the Vietnamese source.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "thuy-xuan-incense-village": {
    name: "Thuy Xuan Incense Village",
    summary:
      "An incense-making hamlet on the road up to Tu Duc's tomb, recognisable at once by its fanned bundles of dyed sticks.",
    story:
      "Thuy Xuan sits on the road from the city up to Tu Duc's tomb and Vong Canh hill, so almost every tour heading for the tombs stops here. Incense has been made in this hamlet for generations, supplying the tombs and pagodas around Hue — places where it burns all year, not only at festivals. The bamboo cores are dyed and then fanned out into bundles to dry in the sun outside each house, and it is that image which turned a working craft hamlet into a photo stop. People still roll incense by hand for visitors to watch, and you can buy the real thing; but it is worth understanding that most of the brightly coloured fans set out along the road now are there to be photographed rather than burnt.",
    facts: [
      "The village is on the road from central Hue to Tu Duc's tomb and Vong Canh hill, about 7 km from the citadel.",
      "Incense has been made here for generations, supplying the tombs and pagodas around Hue.",
      "Dyed bamboo cores are fanned into bundles to dry in the sun outside the houses.",
      "Several households still roll incense by hand on site for visitors to watch.",
    ],
    travelTips: [
      "Combine it with Tu Duc's tomb and Vong Canh hill — all three are on one route.",
      "Ask the price first if you want photos in the borrowed conical hat and ao dai; that is a paid service.",
    ],
    bestTime: "A sunny morning, when the bundles are set out to dry",
    visitDuration: "45 minutes",
    ticket: "Free (pay only for incense or photo costume hire)",
    openingHours: "07:00 - 18:00",
    galleryCaptions: ["Fanned bundles of dyed incense outside a house", "A worker rolling incense by hand"],
  },
  "hon-tam-island": {
    name: "Hon Tam Island",
    summary: "An island in Nha Trang bay, named for looking like a resting silkworm when seen from shore.",
    story:
      "Seen from the Nha Trang shore, Hon Tam is the low mass lying out in the bay — and that shape is where the name comes from: people saw a silkworm at rest. The island is about seven kilometres out, fifteen minutes by speedboat, and the nearest stop on the bay's island tours. The side facing shore has sand and calm water; behind it the forested hill is intact and can be walked. What sets Hon Tam apart from the other islands is the mineral mud bath on it — which is why it usually comes last in a day on the bay, after the snorkelling at Hon Mun.",
    facts: [
      "The island lies in Nha Trang bay, about 7 km offshore and 15 minutes by speedboat.",
      "It is named for its shape seen from shore, resembling a resting silkworm.",
      "It is the closest stop to shore on the Nha Trang bay island tours.",
      "A mineral mud-bath complex on the island usually makes it the last stop after Hon Mun.",
    ],
    travelTips: [
      "Joining an island tour costs far less than chartering a speedboat.",
      "Put Hon Tam at the end of the day — a mud bath after snorkelling works better than the reverse.",
    ],
    bestTime: "March to August, when the sea is calmest",
    visitDuration: "3 hours",
    ticket: "Depends on the tour package and on-island services (check at the pier)",
    openingHours: "07:30 - 17:00",
    galleryCaptions: ["The island's shore-facing beach", "The forested hill behind the beach"],
  },
  "van-long-lagoon": {
    name: "Van Long Lagoon",
    summary: "The largest wetland in the northern delta, its water dead flat beneath limestone towers.",
    story:
      "Van Long is the largest inland wetland reserve in northern Vietnam, and it differs from Trang An or Tam Coc in one decisive way: there are no caves to pass through, and so there are no crowds. Hand-rowed sampans move across water that barely ripples, between limestone towers rising straight out of it — people call it the bay without waves, and the surface really does hold the reflection like a mirror. Van Long's real value is the part few notice: it holds the world's largest population of the Delacour's langur, a critically endangered species found only in Vietnam. Row slowly and stay quiet and there is a chance of seeing them on the cliffs.",
    facts: [
      "This is the largest inland wetland nature reserve in the northern delta.",
      "It holds the world's largest population of Delacour's langur, a species found only in Vietnam.",
      "Boats here are rowed by hand, crossing near-motionless water between limestone towers.",
      "Unlike Trang An and Tam Coc, the Van Long boat route passes through no caves.",
    ],
    travelTips: [
      "Go early and keep quiet — that is when the langurs are most likely to be visible on the cliffs.",
      "Bring binoculars if you have them; the cliffs are a long way from the boat.",
    ],
    bestTime: "Early morning, October to April",
    visitDuration: "2 hours",
    ticket: "80,000d entry plus the boat fee (indicative)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Limestone towers mirrored in the still lagoon", "A hand-rowed sampan crossing the water"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
