// English translations for the Đà Nẵng hub depth pass (tasks/038).
// Covers src/data/regions/hubs/daNangCore.ts + daNangOuter.ts. Arrays are index-aligned
// with the Vietnamese source; any field left out simply falls back to Vietnamese.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "dragon-bridge": {
    name: "Dragon Bridge",
    summary: "A steel dragon across the Han River that lifts its head at weekends and breathes fire and water over the crowd.",
    story:
      "The Dragon Bridge opened on 29 March 2013, the anniversary of the city's liberation, and almost immediately became the first thing anyone pictures when Da Nang is mentioned. The dragon's body follows the shape of Ly-dynasty dragons, running the full length of the bridge and changing colour through the night. The moment worth waiting for is the weekend: the head turns to the river, breathes nine bursts of fire and then three of water, smoke drifting into the packed crowds on both banks while children shriek. By day it is simply a road — so if you only cross it at noon, you will not understand why the whole city is proud of it.",
    facts: [
      "The bridge is 666m long with six lanes, and opened on 29 March 2013.",
      "The dragon's form follows Ly-dynasty dragon motifs and runs the bridge's entire length.",
      "The fire-and-water show runs on weekend evenings, usually beginning at 21:00.",
      "It links the administrative centre on the west bank to the beaches on the east.",
    ],
    travelTips: [
      "Arrive before 20:30 for a spot near the dragon's head — after that both banks are full.",
      "Stand downwind to stay dry; the last three bursts of water carry a long way.",
    ],
    bestTime: "Saturday and Sunday evenings, for the fire show",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
  },
  "han-river-bridge": {
    name: "Han River Bridge",
    summary: "The first swing bridge designed and built by Vietnamese engineers, still turning sideways in the small hours.",
    story:
      "Before 2000, crossing to the east bank of the Han River meant taking a ferry. This bridge ended that, and it carries a meaning no other crossing in the city does: part of the money came from residents' own contributions, and both the design and the construction were Vietnamese. What makes visitors linger is the mechanism — around midnight the central span rotates ninety degrees to lie along the river so large vessels can pass, then closes again by morning. A whole bridge turning quietly in the middle of the night is not something many cities can show you.",
    facts: [
      "Opened on 29 March 2000, the first swing bridge designed and built by Vietnamese engineers.",
      "The central span rotates 90 degrees to let large boats through, usually around midnight.",
      "Part of the construction cost came from contributions by the city's own residents.",
      "It replaced the ferry that had been the only way to reach the east bank.",
    ],
    travelTips: [
      "The turning time shifts with shipping schedules and season — ask your hotel on the day.",
      "Walk the west bank along Bach Dang street for the view; it is airier and has less traffic.",
    ],
    bestTime: "Evening, around the time the span turns",
    visitDuration: "45 minutes",
    ticket: "",
    openingHours: "All day",
  },
  "cham-museum": {
    name: "Museum of Cham Sculpture",
    summary: "The largest collection of Cham sculpture in the world, in a French building open since 1915.",
    story:
      "This is the only place on earth where Champa sculpture can be seen whole, under one roof. The French began gathering pieces here from My Son, Tra Kieu and Dong Duong in the late nineteenth century, and the building — low, airy, wide-doored, colonial architecture with Cham motifs worked in — was put up for them in 1915. Inside are Apsara dancers caught mid-turn, altars carved across every stone face, heads of Shiva and Ganesha worn down by time but never quite erased. If you are going to My Son, come here first: the finest things from that temple complex are in these galleries.",
    facts: [
      "The museum building opened in 1915, initiated by the French School of the Far East.",
      "It holds the world's largest collection of Champa sculpture, around 2,000 objects.",
      "Several national treasures are displayed, including altars from My Son and Tra Kieu.",
      "The pieces came mainly from My Son, Tra Kieu, Dong Duong and Thap Mam.",
    ],
    travelTips: [
      "Take a guide or the audio guide — the objects cannot tell you their own story.",
      "Visit before going to My Son; each makes far more sense of the other.",
    ],
    bestTime: "Year-round; mornings are quieter",
    visitDuration: "1.5 - 2 hours",
    ticket: "60,000d (indicative — check at the counter)",
    openingHours: "07:30 - 17:00",
  },
  "da-nang-cathedral": {
    name: "Da Nang Cathedral",
    summary: "A pink Gothic church in the middle of town, known to everyone in Da Nang as the Rooster Church.",
    story:
      "Nobody in Da Nang calls this place by its official name. A metal rooster sits on the bell tower as lightning rod and weathervane, and that settled it: the Rooster Church. A French priest began the building in the early 1920s — powder-pink walls, stained glass telling scenes from scripture, a pointed spire rising over low shophouses. Behind the church is a grotto to Our Lady modelled on Lourdes. Late in the afternoon the sun comes through the coloured glass and lays red and blue bands across the tiled floor; that is the hour to go in.",
    facts: [
      "The church was built in the early 1920s under a French priest.",
      "Its popular name, the Rooster Church, comes from the rooster figure atop the bell tower.",
      "It is built in the Gothic style, with its distinctive pink-painted walls.",
      "Behind the grounds is a Marian grotto modelled on the one at Lourdes in France.",
    ],
    travelTips: [
      "This is a working church — avoid visiting during services and dress modestly.",
      "The best angle is from the pavement opposite on Tran Phu street, late in the day.",
    ],
    bestTime: "Late afternoon, when the sun angles through the stained glass",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "Outside service times; the schedule is posted at the gate",
  },
  "con-market": {
    name: "Con Market",
    summary: "Da Nang's largest market, and where locals go to eat — the food hall is the real destination here.",
    story:
      "The name sounds odd but means something plain: the market stands on a raised mound of earth, in a district that used to flood. Since the 1940s it has been the city's stomach — upstairs sells fabric, dried goods and packaged specialities, but what brings people back is the food hall on the ground floor. Suction snails, pork rice-paper rolls, fermented-fish noodle soup, jelly sweet soup, jackfruit salad: one dish per stall, prices posted, plastic stools shared with office workers at lunch. This is a market for eating, not for buying gifts, and you should arrive hungry.",
    facts: [
      "The market dates from around the 1940s; its name comes from the raised mound it stands on.",
      "It is the largest market in Da Nang by size.",
      "The food hall concentrates Quang-region dishes: suction snails, jackfruit salad, pork rice-paper rolls.",
      "The upper floor specialises in fabric, dried goods and packaged local produce.",
    ],
    travelTips: [
      "Come around 15:00 - 18:00: the food hall is at its liveliest but not yet crushed.",
      "Ask the price before ordering at stalls without posted prices — it heads off every misunderstanding.",
    ],
    bestTime: "Afternoon, when every food stall is open",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "06:00 - 20:00 (the food hall stays open later)",
  },
  "han-market": {
    name: "Han Market",
    summary: "A riverside market where visitors buy dried goods to take home, and haggling is simply expected.",
    story:
      "Han Market sits at the western foot of the Dragon Bridge, right on the river, which makes it the first market most visitors walk into. The ground floor is stacked with candied squid, dried shrimp, filefish, sesame crackers and Quang-style beef sausage — the things almost everyone carries out of Da Nang by the bagful. The second floor is fabric and tailoring; order an ao dai in the morning and collect it in the afternoon. It is smaller and tidier than Con Market, and asks higher opening prices — but it sits directly on the riverside walk, so it costs you no detour.",
    facts: [
      "The market stands on the west bank of the Han River, near both the Dragon and Han River bridges.",
      "The ground floor concentrates dried seafood, beef sausage and sesame crackers — Da Nang's classic gifts.",
      "The second floor sells fabric and does tailoring, with many shops finishing an ao dai the same day.",
      "It dates from around the 1940s, the same period as Con Market.",
    ],
    travelTips: [
      "Haggling is normal here; check a few stalls before settling.",
      "For a same-day ao dai, place the order before 10:00 in the morning.",
    ],
    bestTime: "Morning, when produce is fresh and the aisles are clear",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "06:00 - 19:00",
  },
  "apec-park": {
    name: "APEC Park",
    summary: "A sculpture garden from the APEC economies under a kite-shaped canopy, right on the Han River.",
    story:
      "The park began as a sculpture garden: when Da Nang hosted APEC in 2017, each member economy sent a work, and they were set out across a riverside plot south of the Dragon Bridge. A few years later the city expanded the site into a proper park and raised a curving steel canopy over it, shaped like a kite pulling against the wind — lit at night, it became the riverbank's second landmark after the dragon. This is where locals come to cool off and jog, and where children run around the base of sculptures without anyone much wondering where they came from.",
    facts: [
      "The original sculpture garden was created in 2017 for the APEC summit held in Da Nang.",
      "Each APEC member economy contributed one sculpture to the garden.",
      "The park was later expanded and given its curving kite-shaped steel canopy.",
      "It lies on the west bank of the Han River, south of the Dragon Bridge.",
    ],
    travelTips: [
      "Come at dusk: the canopy lights up and looks straight across at the Dragon Bridge.",
      "Combine it with the Bach Dang riverside walk up to Han Market, about fifteen minutes.",
    ],
    bestTime: "Early evening, when the canopy is lit",
    visitDuration: "45 minutes",
    ticket: "",
    openingHours: "All day",
  },
  "son-tra-night-market": {
    name: "Son Tra Night Market",
    summary: "A night market at the east foot of the Dragon Bridge — where to go once the dragon has finished breathing fire.",
    story:
      "The market opens at the eastern end of the Dragon Bridge, so its rhythm is tied to the bridge: the fire-show crowd pours straight across into it. Two rows of stalls run down a short street, food on one side — grilled seafood, grilled rice paper, snails, sugarcane juice — souvenirs, t-shirts and fridge magnets on the other. Nothing here is refined, and that is the point: it is loud, bright, cheap, and open late when everything else in the city has closed. For anyone walking in from the beach hotels on My Khe, it is the natural stop.",
    facts: [
      "The market is on the east bank of the Han River, at the foot of the Dragon Bridge.",
      "It operates only in the evening and stays open late.",
      "There are two main sections — food stalls and souvenir stalls — along one short street.",
      "It has been running since 2017 and serves mostly visitors.",
    ],
    travelTips: [
      "Agree the price per kilo of seafood before it goes on the grill — that is where disputes start.",
      "Go after 21:00, straight from the Dragon Bridge fire show, and do the two in one go.",
    ],
    bestTime: "Evening, especially at weekends",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "About 18:00 - 24:00",
  },
  "my-khe-beach": {
    name: "My Khe Beach",
    summary: "A long white-sand beach down the city's eastern edge, where Da Nang's day starts earliest.",
    story:
      "My Khe is that rare thing, a beach inside a major city: ten minutes by car from the centre. Fine white sand, a gentle slope and moderate surf for most of the year are why Forbes once ranked it among the most alluring beaches on the planet. But the thing worth remembering is not the harsh midday sun — it is five in the morning, when the whole city comes down to the water to swim and do exercises while basket boats land the night's catch. By half past six the beach thins out and hands itself back to the tourists. American troops stationed here during the war called this whole shore China Beach.",
    facts: [
      "The beach is about 3km from central Da Nang, roughly ten minutes by car.",
      "Forbes magazine once listed My Khe among the most alluring beaches in the world.",
      "During the war, American troops called this stretch of coast 'China Beach'.",
      "Locals come down to swim and exercise from around 5am.",
    ],
    travelTips: [
      "Come between 5:00 and 6:30 to see the real rhythm of Da Nang rather than the tourist version.",
      "From October to December surf is heavy with rip currents — swim between the flags where lifeguards are on duty.",
    ],
    bestTime: "April to August, when the sea is calm and clear",
    visitDuration: "2 - 3 hours",
    ticket: "",
    openingHours: "All day; lifeguards on duty during posted hours",
  },
  "linh-ung-pagoda-bai-but": {
    name: "Linh Ung Pagoda Bai But",
    summary: "A 67-metre Lady Buddha with her back to Son Tra mountain, facing the sea and watching over the city.",
    story:
      "Look north from anywhere on Da Nang's beaches and you will see a white figure standing on the flank of Son Tra — the Lady Buddha of Linh Ung Bai But pagoda, sixty-seven metres tall, about the height of a twenty-storey building. Fishermen here believe she faces the sea to protect those who go out on it, and the name Bai But comes from a legend of that kind. Inside the statue are seventeen floors, each holding a Buddha image. The courtyard is wide and open, and from the balustrade you see the whole bay of Da Nang curving along its white sand — the finest view over the city that needs no climbing.",
    facts: [
      "The Lady Buddha statue stands 67m tall, among the tallest Buddha figures in Vietnam.",
      "Seventeen floors inside the statue each house a Buddha image.",
      "The pagoda sits on the slope of the Son Tra peninsula and was completed in 2010.",
      "The statue faces the sea — in local belief, to watch over fishermen putting out from shore.",
    ],
    travelTips: [
      "This is an active place of worship: sleeved tops, and trousers or skirts below the knee.",
      "The road up is steep with tight bends — take a taxi unless you are confident on a motorbike.",
    ],
    bestTime: "Early morning or late afternoon, to avoid the sun on the open courtyard",
    visitDuration: "1 - 1.5 hours",
    ticket: "",
    openingHours: "06:00 - 21:00",
  },
  "ban-co-peak": {
    name: "Ban Co Peak",
    summary: "The highest point on the Son Tra peninsula, with an abandoned stone chess game and a view all the way round.",
    story:
      "On the highest point of Son Tra stands a stone chessboard and a statue of the god De Thich sitting alone beside it — in the folk telling, the immortal lost his game, walked away, and left the position unfinished for whoever climbs up next. The road there is a run of hard switchbacks through old-growth forest, where you may catch red-shanked doucs strung out along the branches. At the top the whole of Da Nang lies below: the bay, Thuan Phuoc bridge, the coastline running south toward the Marble Mountains, and on clear mornings the Hai Van pass across the water.",
    facts: [
      "This is the highest point of the Son Tra peninsula, at roughly 700m.",
      "The summit holds a stone chessboard and a statue of De Thich, tied to the legend of the unfinished game.",
      "Son Tra is home to the red-shanked douc, a rare primate.",
      "From the top you look out over Da Nang bay and the city's whole eastern shoreline.",
    ],
    travelTips: [
      "The climb is steep with hairpin bends; scooters under 50cc generally cannot make it.",
      "Go early — cloud usually rolls in after midday and closes the view over the bay.",
    ],
    bestTime: "Early morning on a clear day, March to August",
    visitDuration: "2 hours including the drive up",
    ticket: "",
    openingHours: "Daylight hours; do not go up after dark",
  },
  "non-nuoc-beach": {
    name: "Non Nuoc Beach",
    summary: "A quiet beach below the Marble Mountains, emptier than My Khe and right on the road to Hoi An.",
    story:
      "Non Nuoc starts at the foot of the five limestone peaks of the Marble Mountains and runs south toward Hoi An. It is markedly less crowded than My Khe — partly the distance from the centre, partly because most of the shore is now resort land, leaving a shorter public stretch. In exchange the water is clear, the sand clean, and sitting on the beach you look straight up at the sheer face of Thuy Son behind you. This is the sensible place to stop if you are driving from Da Nang to Hoi An and want one swim before you arrive.",
    facts: [
      "The beach lies directly below the Marble Mountains.",
      "It runs south along the coastal road connecting Da Nang with Hoi An.",
      "Most of the shore is resort land; the public stretch is near the Marble Mountains entrance.",
      "It is usually quieter than My Khe thanks to the distance from the city centre.",
    ],
    travelTips: [
      "Pair a morning climb up the Marble Mountains with a swim directly beneath them.",
      "Surf here is strong in the rough season at the end of the year — check with lifeguards first.",
    ],
    bestTime: "April to August",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "All day",
  },
  "non-nuoc-stone-village": {
    name: "Non Nuoc Stone Carving Village",
    summary: "A centuries-old stone-carving village under the Marble Mountains, chisels ringing the length of the street.",
    story:
      "Walking through Non Nuoc means walking between two ranks of stone figures: Buddhas, lions, young women, mortars, bangles — some taller than you, some the size of a fist, spilling over onto the pavement. Stone carving here goes back centuries, beginning with marble quarried straight out of the Marble Mountains and passed down through the village's families. The mountains are protected now, so the stone comes in from elsewhere, but the method has barely changed: chiselled, ground and polished by hand. You can step into any workshop and watch; they are used to visitors and do not mind.",
    facts: [
      "The craft village sits at the foot of the Marble Mountains and is centuries old.",
      "The original material was marble quarried from the Marble Mountains themselves.",
      "Since the mountains became protected, stone has had to be brought in from elsewhere.",
      "The craft passes down family lines and most stages are still done by hand.",
    ],
    travelTips: [
      "Stone is heavy — settle packing and shipping before buying anything large.",
      "Go in the morning while the workshops are working; many have shut by late afternoon.",
    ],
    bestTime: "Year-round, mornings during working hours",
    visitDuration: "45 minutes - 1 hour",
    ticket: "",
    openingHours: "Roughly 07:30 - 17:00, following workshop hours",
  },
  "ba-na-hills": {
    name: "Ba Na Hills",
    summary: "A mountaintop resort the French opened early last century, now an entertainment complex with the Golden Bridge.",
    story:
      "The French found Ba Na in 1901 and turned it into an escape from the heat: at nearly fifteen hundred metres the summit runs a good ten degrees cooler than the plain, and you can meet all four seasons in a single day. The old resort fell into ruin after the war, then was rebuilt as something entirely different — a cable car that has held several world records, a French Village with its mock-antique square and church, the indoor Fantasy Park, and the Golden Bridge, the span held up by two stone hands that put Da Nang on front pages around the world. This is a full day, not a stop along the way.",
    facts: [
      "The French discovered Ba Na in 1901 and developed it as a hill station from 1919.",
      "The summit is around 1,487m, typically about 10 degrees cooler than Da Nang below.",
      "The cable car to the top has held several world records for length and vertical rise.",
      "The Golden Bridge, opened in 2018, is what brought Ba Na international coverage.",
    ],
    travelTips: [
      "Take the very first cable car of the day — after 10am every queue is several times longer.",
      "Bring a jacket even in midsummer; the summit is cold and prone to sudden drizzle.",
    ],
    bestTime: "April to September, when cloud is least likely to cover the summit",
    visitDuration: "Full day",
    ticket: "Package ticket including the cable car, roughly 900,000 - 1,100,000d (varies by season — check the published price before you go)",
    openingHours: "Roughly 07:30 - 22:00, varies by season",
  },
  "hai-van-pass": {
    name: "Hai Van Pass",
    summary: "'The grandest gateway under heaven' — a pass over the Bach Ma range with mountain on one side and sea on the other.",
    story:
      "Hai Van is a real border. The range runs out into the sea here and blocks the north-east monsoon, so crossing the pass means crossing into different weather — steady rain on the north side, sun still on the south. Emperor Minh Mang had a gate built at the summit in 1826 and inscribed it himself: 'the grandest gateway under heaven'. That structure still stands, restored, looking down on the bays either side. Since the road tunnel opened, lorries and coaches all go underneath, leaving the pass almost empty for anyone who wants to drive slowly and stop at every bend. Which is exactly why you should take the pass and not the tunnel.",
    facts: [
      "The pass runs about 21km with a summit near 500m, marking the boundary between Da Nang and Thua Thien Hue.",
      "The Hai Van Gate at the summit was built in 1826 under Emperor Minh Mang.",
      "The four characters on the gate reading 'the grandest gateway under heaven' are attributed to Minh Mang.",
      "The range blocks the north-east monsoon, giving the two sides of the pass distinctly different weather.",
    ],
    travelTips: [
      "Take the pass road rather than the tunnel — the tunnel is faster and you will see nothing.",
      "Fog can drop over the summit very quickly; if visibility falls below a few dozen metres, pull over and wait.",
    ],
    bestTime: "March to August, on a clear morning",
    visitDuration: "Half a day including the drive",
    ticket: "",
    openingHours: "All day; cross in daylight",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
