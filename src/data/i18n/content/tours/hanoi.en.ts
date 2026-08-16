// English translations for the Hà Nội tour-stop batch (tasks/039).
// Covers regions/tours/hanoi.ts. Arrays index-aligned with the Vietnamese source;
// anything omitted falls back to Vietnamese.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "ho-chi-minh-museum": {
    name: "Ho Chi Minh Museum",
    summary:
      "A white lotus-shaped block behind the mausoleum, telling Ho Chi Minh's life against the century he lived through.",
    story:
      "The museum opened in 1990, on the hundredth anniversary of Ho Chi Minh's birth, and stands directly behind the mausoleum — so almost everyone who visits one continues to the other. The building is a squared white concrete mass raised on piers, meant to read as an opening lotus; Soviet architects designed it, and the heaviness is very much of its moment. Inside it is stranger than a biographical museum usually is: objects from his life are set among installation-style rooms staging the twentieth-century upheavals he passed through — Paris in the 1920s, the Russian revolution, the wars. That approach makes it worth an hour even for visitors with no interest in the politics.",
    facts: [
      "The museum opened on 19 May 1990, the centenary of Ho Chi Minh's birth.",
      "The raised white cube was designed to evoke an opening lotus flower.",
      "It sits in the Ba Dinh complex alongside the mausoleum, the One Pillar Pagoda and the Presidential Palace.",
      "Displays mix biographical objects with staged rooms about the wider twentieth-century world.",
    ],
    travelTips: [
      "Do it in the same visit as the mausoleum and the One Pillar Pagoda — all three are a few minutes' walk apart.",
      "The museum closes on Monday and Friday afternoons; check before you go.",
    ],
    bestTime: "Morning, straight after the mausoleum",
    visitDuration: "1 hour 30 minutes",
    ticket: "40,000d (indicative — check at the counter)",
    openingHours: "08:00 - 12:00, 14:00 - 16:30",
    galleryCaptions: ["The white lotus block seen from the Ba Dinh grounds", "An exhibition room inside"],
  },
  "thang-long-water-puppet": {
    name: "Thang Long Water Puppet Theatre",
    summary:
      "A water-puppet house on the east shore of Hoan Kiem Lake, performing year-round on a pool instead of a stage.",
    story:
      "Water puppetry was born in the Red River Delta, where flooded paddy was a stage you already had: the puppeteers stand waist-deep behind a screen, working the figures with poles and strings hidden under the surface. It was once performed only in village ponds at festival time, and had nearly died out by the mid-twentieth century before being rebuilt. The Thang Long theatre at 57B Dinh Tien Hoang is where the craft is kept going most consistently — several shows a day, around 50 minutes each, made of familiar episodes: the clown Teu, dragon dances, and the legend of King Le returning the sword to the golden turtle of the very lake outside the door. A traditional ensemble plays live beside the water, never to tape.",
    facts: [
      "The theatre is at 57B Dinh Tien Hoang, on the eastern shore of Hoan Kiem Lake.",
      "Puppeteers stand in the water behind a screen, working poles and strings below the surface.",
      "Each performance runs about 50 minutes and is built from short episodes rather than one long piece.",
      "Musicians play traditional instruments live beside the stage throughout.",
    ],
    travelTips: [
      "Book ahead, especially for evening shows — the hall is small and often sells out.",
      "The front rows catch spray; sitting a few rows back gives a better view of the whole pool.",
    ],
    bestTime: "An evening show, paired with a walk around the lake",
    visitDuration: "1 hour",
    ticket: "100,000d - 200,000d by seat class (indicative)",
    openingHours: "Several shows daily, typically 15:00 - 21:00",
    galleryCaptions: ["The water stage and its puppets", "Musicians playing live beside the stage"],
  },
  "phu-tay-ho": {
    name: "Tay Ho Temple",
    summary:
      "A temple to the mother goddess Lieu Hanh on a spit of land in West Lake, busiest on the first and fifteenth of the lunar month.",
    story:
      "The temple sits at the end of a narrow spit reaching into West Lake, so water lies on both sides of the approach. It honours Lieu Hanh, one of the Four Immortals of Vietnamese belief and the most widely venerated figure in the mother-goddess religion — the indigenous tradition UNESCO has since recognised. Unlike a pagoda, this is not a quiet place: on the first and fifteenth of the lunar month the lane in is packed with worshippers, votive paper and flowers stacked along both sides, and inside you may find a spirit-possession ritual under way with its chau van musicians. That is the time to come if you want to see a living practice, and the time to avoid if you want calm.",
    facts: [
      "The temple honours Lieu Hanh, one of the Four Immortals of Vietnamese folk belief.",
      "It stands on a small peninsula reaching into West Lake, with a single lane in.",
      "The mother-goddess religion was inscribed by UNESCO as intangible cultural heritage in 2016.",
      "The first and fifteenth of each lunar month are the two busiest worship days.",
    ],
    travelTips: [
      "Avoid the first and fifteenth if crowds put you off — the approach is barely passable by vehicle then.",
      "Eat West Lake shrimp cakes at the stalls by the top of the lane; that is the dish tied to this corner.",
    ],
    bestTime: "Late afternoon on a weekday, as the light drops onto the lake",
    visitDuration: "45 minutes",
    ticket: "Free",
    openingHours: "05:00 - 19:00",
    galleryCaptions: ["The temple gate facing out over West Lake", "The West Lake shore near the temple", "The mother-goddess altar inside"],
  },
  "national-history-museum-vn": {
    name: "Vietnam National Museum of History",
    summary:
      "A 1932 Indochinese-style building behind the Opera House, holding the country's finest Dong Son drums and Cham sculpture.",
    story:
      "The building began as the museum of the French School of the Far East, designed by Ernest Hébrard and finished in 1932. Hébrard was the architect who proposed Indochinese Architecture — a French frame given curved tile roofs, deep verandas and ventilation suited to the tropics — and this is the most complete surviving example of it in Hanoi. Inside is the national historical collection, running from prehistory to the twentieth century, and its strongest part comes first: the Dong Son bronze drums, ritual objects cast more than two thousand years ago and worked with sun motifs and figures in feather headdresses. The Cham stone sculpture here is bettered only by the museum in Da Nang.",
    facts: [
      "The building was designed by Ernest Hébrard and completed in 1932 for the French School of the Far East.",
      "It is the definitive example of Indochinese Architecture in Hanoi.",
      "Its collection of Dong Son bronze drums is among the most complete in Vietnam.",
      "The museum stands directly behind the Opera House, about a kilometre from Hoan Kiem Lake.",
    ],
    travelTips: [
      "The collection is split across two buildings on either side of the road — ask when buying your ticket so you do not miss half of it.",
      "Combine it with the Opera House and the lake; all three sit on one walkable line.",
    ],
    bestTime: "Morning, while the galleries are still empty",
    visitDuration: "2 hours",
    ticket: "40,000d (indicative — check at the counter)",
    openingHours: "08:00 - 12:00, 13:30 - 17:00",
    galleryCaptions: ["Hébrard's Indochinese facade", "Dong Son bronze drums on display"],
  },
  "tong-duy-tan-food-street": {
    name: "Tong Duy Tan Street",
    summary: "Hanoi's late-opening food street, known above all for herbal chicken soup and wonton noodles.",
    story:
      "Tong Duy Tan is a short street running into Cam Chi alley, and the first in Hanoi to be formally designated a food street. What makes it worth the walk is not the menu but the clock: when most of the Old Quarter has shut, this stretch is still lit, so it became the default late meal for Hanoians and visitors alike. The dish tied to the street is ga tan — a small chicken stewed in a Chinese herbal broth, served scalding in a clay bowl — alongside wonton noodles and rice porridge stalls. The street is narrow, the plastic stools spill across the pavement, and the late-night noise is precisely what people come for.",
    facts: [
      "This was the first street in Hanoi to be formally designated a food street.",
      "It runs into Cam Chi alley, a late-night eating lane that predates the designation.",
      "The signature dish is ga tan, chicken stewed in Chinese medicinal herbs, alongside wonton noodles and porridge.",
      "Stalls here stay open considerably later than the Old Quarter average.",
    ],
    travelTips: [
      "Come after 21:00 — before that the street is quiet and misses the point.",
      "Ask the price before ordering; not every stall here posts one.",
    ],
    bestTime: "Late at night, once the Old Quarter has closed",
    visitDuration: "1 hour",
    ticket: "Free (pay per dish)",
    openingHours: "17:00 - 02:00",
    galleryCaptions: ["The food street lit up at midnight", "A café on Tong Duy Tan street", "A bowl of herbal chicken soup"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
