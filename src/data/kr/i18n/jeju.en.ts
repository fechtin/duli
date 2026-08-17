import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  hallasan: {
    name: "Hallasan Mountain",
    summary: "Korea's highest peak — a dormant volcano with a crater lake sitting right on its summit.",
    story:
      "The whole of Jeju is really the flank of Hallasan; wherever you stand on the island the summit appears and disappears behind cloud. The climb to Baengnokdam crater takes about nine hours return, through broadleaf forest, then dwarf forest, then open windswept grass. At the top lies the crater lake — where, legend says, immortals rode down on white deer to drink. In spring azaleas turn the slopes purple; in winter deep snow makes Hallasan the country's favourite snow climb.",
    facts: [
      "At 1,947m it is the highest point in South Korea.",
      "Part of the UNESCO World Natural Heritage 'Jeju Volcanic Island and Lava Tubes'.",
      "The Baengnokdam crater lake is about 550m across.",
      "Only the Seongpanak and Gwaneumsa trails reach the summit.",
      "Park rangers cap departure times — late starters are turned back at the checkpoints.",
    ],
    travelTips: [
      "Reserve your climb online in advance; both summit trails limit numbers.",
      "Set out before 6am to be back down before the trail closes.",
      "Weather turns fast — always carry a windproof layer and water.",
    ],
    bestTime: "May (azaleas) and October (clear skies)",
    visitDuration: "Full day",
    ticket: "Free, but the two summit trails (Seongpanak and Gwaneumsa) require an advance reservation on the national park booking site",
    openingHours: "Ascent starts at 05:00 (06:00 in winter); control points turn hikers back around 12:00–14:00 depending on trail and season — on Seongpanak you must pass the Jindallaebat shelter by 11:30. Up and down the same day; camping is banned",
  },
  "seongsan-ilchulbong": {
    name: "Seongsan Ilchulbong (Sunrise Peak)",
    summary: "A volcanic crater rising straight out of the sea like a stone crown, at its best at sunrise.",
    story:
      "Seongsan Ilchulbong formed when lava erupted underwater some five thousand years ago, leaving a broad crater ringed by sheer cliffs. Twenty minutes of steps bring you to the rim: below is a green bowl of grass, beyond it the sea and the fishing village of Seongsan. People rise at four in the morning to catch the sunrise here — the sun comes straight up out of the eastern sea. At the foot of the peak, the haenyeo — Jeju's women divers, most of them well past sixty — still perform the abalone dive they have done all their lives.",
    facts: [
      "Part of Jeju's UNESCO World Natural Heritage listing.",
      "The crater is about 600m wide and the peak stands 182m above the sea.",
      "Formed by an underwater eruption roughly 5,000 years ago.",
      "Haenyeo culture was inscribed by UNESCO as intangible heritage in 2016.",
    ],
    travelTips: [
      "The gate opens before dawn — check sunrise times by season.",
      "The steps are steep; wear shoes with grip.",
      "Check the haenyeo demonstration schedule on the rocks below.",
    ],
    bestTime: "Year-round, best at sunrise",
    visitDuration: "1.5–2 hours",
    ticket: "5,000 KRW",
    openingHours: "07:30–20:00 (earlier closing in winter)",
  },
  manjanggul: {
    name: "Manjanggul Lava Tube",
    summary: "A tunnel carved underground by flowing lava, cold and pitch dark in every season.",
    story:
      "When lava flows, its outer skin cools into a crust while the river inside keeps moving, leaving a hollow pipe under the ground. Manjanggul is one of the largest lava tubes in the world still in original condition. The section open to visitors runs about a kilometre, its ceiling more than twenty metres high in places, the walls marked with lava lines like tide marks. The temperature holds at 11–14°C all year. At the far end stands a lava column 7.6 metres tall — the tallest known anywhere.",
    facts: [
      "Part of the Geomunoreum lava tube system, a UNESCO site.",
      "The cave runs about 7.4 km in total; roughly 1 km is open to visitors.",
      "The lava column at the end is 7.6m high, considered the world's tallest.",
      "The temperature stays a steady 11–14°C year-round.",
    ],
    travelTips: [
      "Bring a jacket even in midsummer — it is genuinely cold inside.",
      "The floor is damp and uneven; avoid smooth-soled shoes.",
      "The cave closes periodically for maintenance — check before travelling.",
    ],
    bestTime: "Year-round",
    visitDuration: "1 hour",
    ticket: "4,000 KRW (2,000 KRW teens and children)",
    openingHours: "09:00–18:00; the cave reopened on 30 May 2026 after repairs",
  },
  "jeongbang-waterfall": {
    name: "Jeongbang Waterfall",
    summary: "One of Asia's rare waterfalls that drops straight into the sea, on the edge of Seogwipo city.",
    story:
      "From the car park, stone steps lead down to a small bay of rounded pebbles where a fall of more than twenty metres drops off a black cliff into the surf. The sea wind blows the spray back at you, salt on your lips. Legend has it that an envoy of China's first emperor, sent to find the elixir of life, carved characters into this cliff before going home empty-handed — and that the name Seogwipo comes from that story. Late in the day, sunlight through the spray puts a rainbow right in front of you.",
    facts: [
      "About 23m high, one of the few waterfalls in Asia that falls directly into the sea.",
      "Tied to the legend of Xu Fu, the Qin envoy sent in search of immortality.",
      "Inside Seogwipo city, minutes from the centre.",
      "With Cheonjiyeon and Cheonjeyeon it forms Jeju's famous trio of waterfalls.",
    ],
    travelTips: [
      "The pebbles are slippery when wet — tread carefully and don't get too close.",
      "Come in the afternoon for the best chance of a rainbow in the spray.",
      "Combine with Seogwipo Olle Market a few minutes away.",
    ],
    bestTime: "June–September (highest flow)",
    visitDuration: "1 hour",
    ticket: "2,000 KRW",
    openingHours: "09:00–19:00, last entry 18:00",
  },
  "udo-island": {
    name: "Udo Island",
    summary: "A small island shaped like a lying cow, easy to circle by bike in half a day.",
    story:
      "The ferry from Seongsan takes fifteen minutes. Udo is small enough that its ring road is only about seventeen kilometres, and the best way round is a rented electric bike with stops wherever you feel like. Seobinbaeksa beach is startlingly white because the sand is crushed coral rather than ordinary grain, the water tropical turquoise. Across the island, black stone walls stacked without mortar shield fields of peanuts and carrots. The local speciality is peanut ice cream — rich, nutty, sold at every roadside stand.",
    facts: [
      "The name means 'cow island', after its shape seen from above.",
      "Seobinbaeksa beach is formed from crushed coral, rare in Korea.",
      "The ring road around the island is about 17 km.",
      "Famous for island-grown peanuts and peanut ice cream.",
    ],
    travelTips: [
      "Ferries run to a fixed timetable — note the last departure so you don't get stranded.",
      "You need photo ID to buy the ferry ticket.",
      "Some rental points require a licence for electric bikes; ordinary bicycles don't.",
    ],
    bestTime: "May–October",
    visitDuration: "Half a day",
    ticket: "Ferry about 10,500 KRW return; the crossing takes 15 minutes, every 30 minutes at busy times",
    openingHours: "Ferry schedule, usually 08:00–18:00",
  },
  "hyeopjae-beach": {
    name: "Hyeopjae Beach",
    summary: "White sand and shallow water facing Biyangdo island — the finest sunset on Jeju's west coast.",
    story:
      "The water at Hyeopjae is so shallow and clear that you can see the sand bottom a hundred metres out, the colour shifting from turquoise to deep blue. Just offshore sits the round hump of Biyangdo, and when the sun drops behind it the whole beach turns orange. Behind the sand a pine wood offers shade and camping ground, with Hallim Park next door. Because it faces west, this is one of the few Jeju beaches where you watch the sun set into the sea rather than rise out of it.",
    facts: [
      "The white sand comes from crushed shells, unlike the black volcanic sand elsewhere on the island.",
      "Long shallows make it good for small children.",
      "Faces Biyangdo island, reachable by ferry from Hallim port.",
      "Next door is Hallim Park with its botanical garden and small lava caves.",
    ],
    travelTips: [
      "Come late afternoon to swim and then stay for the sunset.",
      "Summer is crowded; June or September is far more comfortable.",
      "Public showers and changing rooms sit just behind the beach.",
    ],
    bestTime: "June–September",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "All day",
  },
  "jusangjeolli-cliff": {
    name: "Jusangjeolli Basalt Cliffs",
    summary: "Thousands of vertical hexagonal stone columns by the sea, formed as lava cooled.",
    story:
      "When Hallasan's lava reached here and met the sea it cooled abruptly and cracked vertically into even columns, most of them six-sided — the geological effect textbooks usually illustrate with photographs of Ireland, and which Jeju has to hand. The cliff stands about twenty metres and runs nearly a kilometre along the Daepo shore, with the swell throwing spray up the base of the columns. A wooden deck follows the cliff edge, so there is no scrambling; on rough days the waves stand up, and on calm ones you can count the faces of the columns through clear water.",
    facts: [
      "The columns formed as lava met seawater and cooled fast, cracking vertically.",
      "The cliff is about 20m high and runs nearly 1km along the Daepo coast.",
      "Designated Natural Monument No. 443.",
      "It lies in the Jungmun resort area on the island's south coast.",
    ],
    travelTips: [
      "Rough days give the best waves but strong wind — hold onto your hat.",
      "The wooden deck is easy going and works for pushchairs.",
      "Combine with Cheonjiyeon falls and Seogwipo market in one outing.",
    ],
    bestTime: "Year-round; best when the sea is rough",
    visitDuration: "1 hour",
    ticket: "2,000 KRW",
    openingHours: "09:00–18:00",
  },
  "cheonjiyeon-waterfall": {
    name: "Cheonjiyeon Waterfall",
    summary: "A waterfall in a subtropical gorge right behind the city, floodlit until late.",
    story:
      "Cheonjiyeon means 'the pond where sky meets earth'. It is only a fifteen-minute walk from central Seogwipo, along a gorge thick with subtropical growth — lianas, tree ferns and a strictly protected stand of Psilotum. At the end, the fall drops twenty-two metres into a pool twenty metres deep that never runs dry. Giant eels, themselves a protected natural monument, live under the rocks below. The falls stay open until ten at night and are lit, making this one of the few things on Jeju you can do after dinner.",
    facts: [
      "The fall is about 22m high, dropping into a pool some 20m deep.",
      "The gorge shelters a protected subtropical forest.",
      "Giant eels in the pool are themselves designated a natural monument.",
      "It stays open until 22:00 and is floodlit at night.",
    ],
    travelTips: [
      "Come in the evening to skip the heat and see the falls lit.",
      "The path in is flat and takes about 15 minutes.",
      "Don't confuse it with Cheonjeyeon falls at Jungmun — different place.",
    ],
    bestTime: "May–October; strongest flow after rain",
    visitDuration: "1 hour",
    ticket: "2,000 KRW (1,000 KRW ages 7–24)",
    openingHours: "09:00–21:20",
  },
  sanbangsan: {
    name: "Sanbangsan & Yongmeori Coast",
    summary: "A lava dome standing like a stone bell, above a shore of layered rock folded like dragon scales.",
    story:
      "Sanbangsan has no crater — it is a plug of stiff lava that pushed up and set where it stood, a bell nearly four hundred metres high standing alone in the fields. Legend says it is the summit of Hallasan, thrown here by an angry god. Halfway up is a cave holding a small temple that looks straight out to sea. Below the mountain is the Yongmeori coast — 'dragon's head' — where sedimentary rock has been cut by wind and waves into curving layers, walkable at low tide. Here too is a replica of the ship of Hendrick Hamel, the Dutchman wrecked on Jeju in 1653 who later wrote the first account of Korea for European readers.",
    facts: [
      "Sanbangsan is about 395m high and is a lava dome, with no crater.",
      "The Sanbanggulsa cave halfway up holds a temple facing the sea.",
      "The Yongmeori shore is only accessible at low tide in calm weather.",
      "A museum and replica ship nearby commemorate Hendrick Hamel, wrecked here in 1653.",
    ],
    travelTips: [
      "Check the tide table: Yongmeori closes at high water or in heavy swell.",
      "The cave temple is about 150 fairly steep stone steps up.",
      "Come in March for the rapeseed fields around the mountain.",
    ],
    bestTime: "March (rapeseed) and April–June, September–November",
    visitDuration: "2–3 hours",
    ticket: "Yongmeori coast 2,000 KRW (1,000 teens and children); the cave temple 1,000 KRW. Free under 6 and over 65",
    openingHours: "09:00–18:00",
  },
  "seongeup-folk-village": {
    name: "Seongeup Folk Village",
    summary: "A lived-in village of rope-lashed thatch and black stone walls stacked without mortar.",
    story:
      "Seongeup was the seat of Jeongui county for five centuries, and unlike villages rebuilt for visitors this is a real one with people still living in it. Jeju houses are unlike the mainland's: thatch is not laid thick but lashed down under a net of rope against the typhoons, walls of black basalt are stacked dry so the wind passes through the gaps rather than pushing them over, and three wooden bars sit across the gateway — all three down means the owner is home, all three up means away for days. The village also holds an old zelkova, a horse-drawn millstone and dol hareubang stone grandfathers at the gates.",
    facts: [
      "It was the seat of Jeongui county from 1423 to 1914.",
      "Thatch is lashed under a rope net against Jeju's typhoons.",
      "The three jeongnang bars at each gate signal whether the owner is at home.",
      "It is a preserved folk village where residents still live ordinary lives.",
    ],
    travelTips: [
      "Free volunteer guides wait at the village gate — worth asking for one.",
      "Be wary of hard-sell speciality tours inside the village.",
      "People live here; ask before stepping into a yard.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "09:00 until sunset; this is a village people actually live in, so keep the noise down",
  },
  "bijarim-forest": {
    name: "Bijarim Nutmeg Yew Forest",
    summary: "The world's largest pure stand of nutmeg yew — over two thousand trees, the oldest eight hundred years old.",
    story:
      "Bijarim is the largest single-species stand of bija in the world — more than two thousand eight hundred trees, between three and eight hundred years old, growing close together on flat ground. The paths are laid with crushed red volcanic scoria, and the air inside is thick with resin; it measures very high in phytoncides, which is why Koreans come here to take a forest bath. At the far end stands the ancestral bija, over eight hundred years old, with a trunk three people cannot reach around. The forest is said to have grown from bija seeds that villagers used as medicine and threw away.",
    facts: [
      "Over 2,800 bija trees, the world's largest pure stand of the species.",
      "The oldest tree in the forest is estimated at more than 800 years.",
      "Designated Natural Monument No. 374.",
      "The paths are laid with red volcanic scoria and run about 2.2km in total.",
    ],
    travelTips: [
      "The route is flat and suits both older visitors and small children.",
      "Come early, while the forest is still damp and the resin smell is strongest.",
      "There is no shade in the car park — park and go straight in.",
    ],
    bestTime: "Year-round; May–June and September–November are most comfortable",
    visitDuration: "1.5–2 hours",
    ticket: "3,000 KRW (1,500 teens and children); free under 6 and over 65",
    openingHours: "09:00–18:00, last entry 17:00",
  },
  "haenyeo-museum": {
    name: "Haenyeo Museum",
    summary: "A museum to the women who dive without air tanks — a trade fading with its last generation.",
    story:
      "Haenyeo are the Jeju women who dive ten metres down, holding their breath for two minutes, to gather abalone and sea cucumber — no tanks, no modern gear, only a net float and an iron hook. The trade once fed the whole island and inverted the order of the household: the wife went to sea for the money, the husband minded the children. The museum shows the cotton diving suits of earlier years, tewak floats made from dried gourds, and filmed interviews. The quietest thing in the building is the age chart: most working haenyeo today are over seventy.",
    facts: [
      "Haenyeo culture was inscribed on UNESCO's intangible heritage list in 2016.",
      "Haenyeo dive to about 10m and hold their breath around two minutes at a time.",
      "Most working haenyeo today are over seventy years old.",
      "The museum stands in Hado-ri, one of the oldest haenyeo villages.",
    ],
    travelTips: [
      "Check the schedule for live haenyeo diving demonstrations at nearby landings.",
      "Combine it with Udo island, where many haenyeo still work.",
      "The museum closes on Mondays.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5 hours",
    ticket: "1,100 KRW (500 for ages 13–24; free under 12)",
    openingHours: "09:00–18:00, closed Mondays",
  },
  "seogwipo-olle-market": {
    name: "Seogwipo Maeil Olle Market",
    summary: "Four hundred metres of covered market: hallabong tangerines, black pork and fish cakes stacked in heaps.",
    story:
      "Seogwipo market dates from the early 20th century and is now the best place on the island to eat your way through everything Jeju makes in a single afternoon. Four hundred metres of stalls sit under a roof, so weather is irrelevant. Hallabong tangerines are piled into orange pyramids, grilled black pork is sold on skewers, omegi cakes of glutinous millet are rolled in red bean, and stuffed fish cakes are eaten hot. One stall sells abalone the haenyeo brought up that morning. The market takes its name from Olle trail route 6, which runs straight through it, so long-distance walkers stop here for lunch mid-stage.",
    facts: [
      "The market dates from the early 20th century; the covered section runs about 400m.",
      "Jeju Olle trail route 6 passes directly through the market.",
      "Specialities include hallabong tangerines, black pork, omegi cakes and abalone.",
      "Many stalls cook to order for eating on the spot.",
    ],
    travelTips: [
      "Come between 4pm and 7pm, when the hot food stalls are all open.",
      "Buy hallabong tangerines to take home; some stalls box and ship them.",
      "There is communal seating in the middle of the market.",
    ],
    bestTime: "Year-round; tangerines are best December–February",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "Open year-round; most stalls run roughly 07:00–21:00, though each keeps its own hours",
  },
  "jeju-olle-trail": {
    name: "Jeju Olle Trail",
    summary: "Four hundred and twenty-five kilometres of walking trail around the island, in twenty-seven coastal stages.",
    story:
      "In 2007 a Jeju-born journalist left the profession after more than twenty years, walked the Camino in Spain, then came home and laid out a trail for her own island. 'Olle' in the Jeju dialect is the small lane that leads from the road to your front door — the implication being that this path leads you home. Twenty-seven stages link into a closed loop around the island, more than four hundred kilometres in total, past black rock shores, tangerine groves, fishing villages, oreum cones and even the airport. Stage 7 along the south coast from Oedolgae is the most walked; each stage takes four to six hours and is marked with blue-and-orange ribbons and small wooden ponies.",
    facts: [
      "27 stages totalling about 425km around the island.",
      "The first route opened in 2007, inspired by the Camino de Santiago.",
      "'Olle' in the Jeju dialect means the lane leading to a house.",
      "The route is marked with blue-and-orange ribbons and Ganse wooden pony figures.",
    ],
    travelTips: [
      "Stage 7 (Oedolgae–Wolpyeong) is the most popular, about five hours' walking.",
      "Buy an Olle passport at the centre and stamp each stage.",
      "Summer is hot with little shade — start early and carry plenty of water.",
    ],
    bestTime: "March–June and September–November",
    visitDuration: "4–6 hours per stage",
    ticket: "",
    openingHours: "Open all day (walk in daylight)",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  jeju: {
    name: "Jeju",
    summary:
      "A volcanic island in the south with a crater lake on Hallasan, lava tubes beneath the ground and haenyeo diving off its shores.",
    story:
      "Jeju is a short flight from the mainland but feels like its own country: a dialect even Seoulites struggle with, black stone walls stacked without mortar along every field, and dol hareubang stone grandfathers guarding the village gates. The island is one volcanic mass — Hallasan in the middle, more than three hundred small oreum cones scattered around it, and a system of lava tubes running underneath. Haenyeo women still dive without air tanks for abalone, a trade now fading. The east coast takes the sunrise, the west keeps the sunset, and the Olle trail stitches it all together in 27 coastal walking stages.",
    bestTime: "April–June and September–November",
    specialties: ["Grilled black pork", "Braised cutlassfish", "Jeju tangerines", "Abalone"],
  },
};
