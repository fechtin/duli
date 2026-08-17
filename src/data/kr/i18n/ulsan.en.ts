import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "daewangam-park": {
    name: "Daewangam Park",
    summary: "A century-old pine wood leading to red rocks where a Silla queen is said to have become a sea dragon.",
    story:
      "Legend holds that the queen of King Munmu vowed to become a dragon guarding the coast, and that the great rock offshore at Ulsan is where she rests. A red iron bridge crosses to it, with surf breaking white on all sides. Behind stands a black pine forest of more than ten thousand trees, cool even at noon in summer, with a path to a white lighthouse — one of the oldest in Korea. This is also one of the first places on the mainland to catch the sunrise.",
    facts: [
      "The park's black pine forest holds more than 15,000 trees, many over a century old.",
      "Ulgi lighthouse has been in service since 1906.",
      "Tied to the legend of a Silla queen turning into a dragon.",
      "One of the earliest sunrise points on the peninsula.",
    ],
    travelTips: [
      "Come early for sunrise over the rocks.",
      "The coastal path is slippery in heavy surf — hold the railing.",
      "Combine with Ilsan beach next door.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Open all day",
  },
  "taehwagang-bamboo": {
    name: "Taehwagang Bamboo Grove",
    summary: "A ten-mile bamboo belt along a river that once died of pollution and now fills with egrets.",
    story:
      "The Taehwa River used to be the price of industrialisation: black water, dead fish, nobody near it. Two decades of cleaning brought it back, and the Simnidaebat bamboo belt along its banks became the first national garden of an industrial city. Walking inside, sunlight filters through the stems in green stripes; towards evening thousands of white egrets come back to roost in the tops. This is the recovery story Ulsan is proudest of.",
    facts: [
      "The bamboo belt runs about 4 km along the river ('Simnidaebat' means ten-mile bamboo field).",
      "The Taehwa River was heavily polluted and was restored from the early 2000s.",
      "Thousands of egrets and herons roost here each season.",
      "Recognised as a national urban garden of Korea.",
    ],
    travelTips: [
      "Late afternoon, when the birds return, is the sight worth timing for.",
      "A cycle path runs the length of the river.",
      "Fireworks and spring flower festivals are held on the riverbank.",
    ],
    bestTime: "May–October",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "Open all day",
  },
  ganjeolgot: {
    name: "Ganjeolgot Cape",
    summary: "The cape that takes the peninsula's first sunrise every New Year's Day.",
    story:
      "Every 1 January tens of thousands of people crowd this headland to watch the year's first sun come out of the East Sea — at Ganjeolgot it rises earlier than anywhere else on the Korean mainland. On ordinary days it is quiet: a white lighthouse, fields of yellow rape flowers in April, and a giant postbox where visitors write letters to their future selves, posted once a year.",
    facts: [
      "The earliest sunrise point on the Korean mainland.",
      "Ganjeolgot lighthouse, 17m tall, has operated since 1920.",
      "There is a 'letters to the future' postbox more than 5m high.",
      "The New Year sunrise festival draws tens of thousands.",
    ],
    travelTips: [
      "1 January is crowded and cold — arrive early and dress warmly.",
      "In April a field of rape flowers blooms behind the lighthouse.",
      "Buses from Ulsan KTX station take about an hour.",
    ],
    bestTime: "Sunrise; best in April and on New Year's Day",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "Open all day",
  },
  "bangudae-petroglyphs": {
    name: "Bangudae Petroglyphs",
    summary: "Prehistoric whale-hunting scenes carved into a cliff — the world's oldest record of whaling.",
    story:
      "On a cliff above a river, Neolithic people carved more than three hundred figures: whales with calves on their backs, boats with rowers, deer, tigers, traps. It is regarded as the oldest pictorial record of whaling anywhere. The irony is that a reservoir built in 1965 submerges the cliff for months each year, and the argument over how to save the carvings has run for decades. Visitors view them by telescope from an observation point across the water; a museum nearby holds a full-size replica.",
    facts: [
      "More than 300 carvings, dated to roughly 6,000–3,500 years ago.",
      "Considered the earliest pictorial record of whaling in the world.",
      "National Treasure No. 285 of Korea.",
      "Submerged for months each year by the Sayeon reservoir.",
    ],
    travelTips: [
      "Bring binoculars, or use the telescopes at the viewpoint.",
      "Visit the petroglyph museum nearby to see the replica in detail.",
      "The dry season (winter to early spring) lowers the water and improves the view.",
    ],
    bestTime: "November–April (low reservoir)",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "The petroglyph museum runs 09:00–18:00, Tuesday to Sunday; closed Mondays and 1 January. The outdoor viewpoint over the cliff is freely accessible",
  },
  "jangsaengpo-whale-village": {
    name: "Jangsaengpo Whale Culture Village",
    summary: "Korea's last whaling port, now a museum to a trade banned since 1986.",
    story:
      "Jangsaengpo was the centre of Korean whaling until the international ban took effect in 1986, when an entire trade and an entire way of life vanished within a season. Rather than let it go quietly, the city rebuilt a whole 1960s whalers' quarter — barber's shop, bar, processing plant, cinema — and opened a whale museum beside it, where a complete large whale skeleton hangs. There is also a boat out into the bay to look for wild dolphins. The telling here is unexpectedly frank: part memorial to a lost trade, part lesson in where hunting took the animals.",
    facts: [
      "Jangsaengpo was Korea's main whaling base until the 1986 ban.",
      "A 1960s whalers' quarter has been rebuilt in full as an open-air museum.",
      "The Whale Museum displays a complete whale skeleton and an old whaling boat.",
      "Boat tours run into Ulsan bay to look for wild dolphins.",
    ],
    travelTips: [
      "Dolphin trips depend on weather and guarantee nothing — ask before buying.",
      "The museum and the village are ticketed separately; a combined ticket is cheaper.",
      "Combine it with the Ulsan Bridge Observatory, 15 minutes away by car.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "2–3 hours",
    ticket: "3,000 KRW for the culture village and 3,000 KRW for the whale museum, bought separately",
    openingHours: "09:00–18:00, closed Mondays",
  },
  "ganwoljae-silver-grass": {
    name: "Ganwoljae & the Yeongnam Alps",
    summary: "A field of silver grass on a nine-hundred-metre saddle, turning silver in October and rolling in the wind.",
    story:
      "'Yeongnam Alps' is what Koreans call the cluster of nine thousand-metre peaks around the borders of Ulsan, North and South Gyeongsang. The best-loved spot among them is Ganwoljae, a saddle at about nine hundred metres covered in eoksae silver grass. In October the whole slope turns silver and, when the wind crosses it, the grass falls in waves — which is why thousands climb up here on autumn weekends. The route from Baenaegol takes about two hours and is not hard; there is a shelter on the saddle and a stall selling hot instant noodles.",
    facts: [
      "Ganwoljae is a saddle at about 900m within the Yeongnam Alps.",
      "The 'Yeongnam Alps' are nine peaks over 1,000m across three provincial borders.",
      "The eoksae silver grass is at its best in October.",
      "A cable car runs to near the summit of nearby Sinbulsan.",
    ],
    travelTips: [
      "October weekends are packed — go on a weekday or set off at dawn.",
      "The saddle is windy and several degrees colder than the valley; bring a layer.",
      "There is no water on the trail; carry enough with you.",
    ],
    bestTime: "October (silver grass season)",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "Open all day (best climbed in daylight)",
  },
  "ulsan-bridge-observatory": {
    name: "Ulsan Bridge Observatory",
    summary: "The one place to see Ulsan's industrial machine whole: shipyards, refineries and the country's longest suspension bridge.",
    story:
      "Ulsan is Korea's heavy industrial city — home to the largest car plant in the world on a single site, one of the biggest shipyards, and a full petrochemical complex. From the observatory on Hwajeongsan the entire apparatus appears at once: gantry cranes lined along the bay, refinery stacks, and the 1,150-metre Ulsan suspension bridge across the harbour mouth. By day it is a lesson in how Korea industrialised; by night, when the petrochemical plants light up, it becomes something else entirely — cold, brilliant and hard to look away from.",
    facts: [
      "The Ulsan Bridge spans about 1,150m and was Korea's longest single-span suspension bridge when it opened in 2015.",
      "The observatory tower is 63m tall, on Hwajeongsan hill.",
      "The Hyundai shipyard and the Ulsan petrochemical complex are both visible.",
      "Entry to the observatory is free.",
    ],
    travelTips: [
      "Go after dark to see the industrial complex lit up.",
      "There is no convenient public transport; take a taxi or drive.",
      "Visibility drops badly on high fine-dust days — check the index first.",
    ],
    bestTime: "October–March (clearer air)",
    visitDuration: "1 hour",
    ticket: "Free",
    openingHours: "09:00–21:00, last entry 20:30; closed the second and fourth Monday of each month and on Seollal and Chuseok",
  },
  "jujeon-pebble-beach": {
    name: "Jujeon Pebble Beach",
    summary: "A beach with no sand at all, only round black pebbles — and the sound the backwash leaves behind.",
    story:
      "There is not a grain of sand at Jujeon. The whole kilometre and a half is covered in smooth round black pebbles the size of a fist, and what makes people sit for a while is the sound: as each wave draws back, millions of pebbles knock together in a long rattle like applause heard from far off. The beach sits on the coast road north of Ulsan and faces east, so it is one of the region's sunrise spots. Along the shore are stalls selling grilled clams and seaweed gathered on the spot; in summer people pitch tents straight onto the stones.",
    facts: [
      "The beach runs about 1.5km and is covered entirely in black pebbles rather than sand.",
      "The rattle of pebbles in the backwash has its own name in Korean.",
      "Facing east, it is one of the Ulsan region's sunrise viewing spots.",
      "It lies on the coastal road linking Ulsan with Gyeongju.",
    ],
    travelTips: [
      "Wear thick soles — the pebbles are harder on the feet than you expect.",
      "Arrive about 30 minutes before dawn if you want the sunrise.",
      "Combine it with Daewangam Park along the same coast road.",
    ],
    bestTime: "May–September; sunrise year-round",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "All day",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  ulsan: {
    name: "Ulsan",
    summary: "An industrial capital on the East Sea that also holds prehistoric rock art and the earliest sunrises.",
    story:
      "Ulsan builds the ships and cars of Korea, but beside its factories lies some of the finest rocky coast on the peninsula. The Taehwa River, once killed by pollution, runs clear again with its ten-mile bamboo belt and its evening egrets. Upstream is the Bangudae cliff, carved with whale hunts six thousand years ago — Ulsan was once a great whaling port, a history now left to a museum and a controversial dish. Ganjeolgot cape takes the country's first sunrise.",
    bestTime: "April–June and September–November",
    specialties: ["Ulsan hot fish soup", "Chive pancakes", "Grilled seafood"],
  },
};
