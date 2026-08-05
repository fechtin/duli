import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  haeinsa: {
    name: "Haeinsa Temple & the Tripitaka Koreana",
    summary:
      "Home to more than 81,000 13th-century woodblocks of the Buddhist canon, kept perfect by storehouses that breathe.",
    story:
      "Deep in the Gayasan mountains, in four surprisingly plain wooden halls, sit 81,258 woodblocks carved with the complete Buddhist canon — sixteen years of work finished in the 13th century, when Goryeo sought the Buddha's protection against the Mongols. The miracle is the storehouses: windows of different sizes above and below, floors layered with charcoal and salt, creating a natural airflow that has kept the blocks dry for seven centuries without machinery. Modern climate-controlled buildings failed; Janggyeong Panjeon still does its job.",
    facts: [
      "The Tripitaka Koreana comprises 81,258 woodblocks, carved 1237–1248.",
      "The Janggyeong Panjeon storehouses were inscribed by UNESCO in 1995.",
      "Natural ventilation has preserved the blocks for over 750 years.",
      "Haeinsa temple itself was founded in 802.",
    ],
    travelTips: [
      "Visitors look in through the lattice rather than entering — come while the light is good.",
      "Buses from Daegu (Seobu terminal) take about 1.5 hours.",
      "Autumn colour on the road up Gayasan is superb.",
    ],
    bestTime: "October–November",
    visitDuration: "2–3 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "08:30–18:00",
    galleryCaptions: ["The Janggyeong Panjeon woodblock hall"],
  },
  "tongyeong-dongpirang": {
    name: "Tongyeong & Dongpirang Village",
    summary: "A port town looking out on hundreds of islands, with a hillside village saved by its murals.",
    story:
      "Tongyeong sits where the land breaks up into the Hallyeohaesang archipelago, and the cable car up Mireuksan shows you the whole of it: hundreds of islands scattered over blue water. Below, Dongpirang village was scheduled for demolition until volunteer artists covered its walls with paintings — visitors came to see them, and the village was kept. Down at the fishing harbour they sell Chungmu gimbap, invented so that a fisherman's lunch would not spoil at sea.",
    facts: [
      "Tongyeong was Admiral Yi Sun-sin's naval headquarters in the Joseon era.",
      "The Mireuksan cable car is 1,975m long, the longest in Korea when it opened.",
      "Dongpirang village was saved by a mural campaign in 2007.",
      "Chungmu gimbap is the local dish, born of the fishing trade.",
    ],
    travelTips: [
      "Ride the cable car early on a clear morning to see the islands sharply.",
      "Direct coaches from Busan take about 1.5 hours.",
      "Ferries leave Tongyeong for Somaemuldo and Yokjido islands.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "Half a day",
    ticket: "The Mireuksan cable car is 17,000 KRW return (13,000 for ages 3–12); Dongpirang mural village is free",
    openingHours: "09:30–17:00 (cable car)",
    galleryCaptions: ["Murals in Dongpirang village"],
  },
  "geoje-oedo": {
    name: "Oedo Botania, Geoje",
    summary: "A rocky island turned into a Mediterranean garden by one couple over thirty years.",
    story:
      "In 1969 a married couple bought this barren rock after their boat sheltered here in a storm. They tried oranges and failed; tried other crops and failed; then spent three decades planting windbreaks and building terraces until the whole island became a garden of thousands of species, white statues and paths looking out to sea. It is reachable only by ferry, and each group has about ninety minutes ashore — just enough to walk the full circuit.",
    facts: [
      "Cultivated from 1969 and opened to visitors in 1995.",
      "More than 3,000 plant species, many of them subtropical.",
      "Reachable only by ferry from Geoje or Tongyeong.",
      "Time ashore is limited by the ferry schedule.",
    ],
    travelTips: [
      "Book ferry tickets ahead in high season.",
      "Ferries are cancelled in rough seas — keep a backup plan.",
      "Combine with Haegeumgang, the rock formation offshore nearby.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "Half a day including the ferry",
    ticket: "Around 38,000 KRW (ferry ~27,000 + island entry ~11,000); varies by harbour and operator",
    openingHours: "Ferry schedule, 08:00–17:00",
    galleryCaptions: ["Terraced gardens on Oedo island"],
  },
  "jinju-fortress": {
    name: "Jinju Fortress & the Namgang Lantern Festival",
    summary: "A riverside fortress tied to two brutal sieges, lit each October by thousands of lanterns.",
    story:
      "In 1592 three thousand defenders of Jinju threw back twenty thousand Japanese troops — one of the three great victories of the Imjin War. The following year the fortress fell, and the courtesan Non-gae pulled a Japanese commander into the Nam River with her from the rock beneath Chokseongnu pavilion. Today the fortress is a quiet park above the water. Each October the Jinju Lantern Festival floats thousands of paper lanterns on the river, a custom descended from wartime signal lamps.",
    facts: [
      "Site of the sieges of 1592 and 1593 during the Imjin War.",
      "Chokseongnu is one of the three most celebrated pavilions in Korea.",
      "The Namgang Lantern Festival is held each October.",
      "The Jinju National Museum inside the walls covers the Imjin War.",
    ],
    travelTips: [
      "Come in October for the lantern festival, and book a room early.",
      "The fortress is lit at night and pleasant to walk along the river.",
      "Jinju has its own style of bibimbap — try it at the central market.",
    ],
    bestTime: "October (lantern festival)",
    visitDuration: "2 hours",
    ticket: "2,000 KRW (1,000 teens, 600 children) between 09:00 and 18:00; outside those hours entry is free",
    openingHours: "05:00–23:00",
    galleryCaptions: ["Chokseongnu pavilion above the Nam River"],
  },
  "namhae-daraengi": {
    name: "Daraengi Terraced Fields, Namhae",
    summary: "More than a hundred tiny terraces stepping down the mountain to the sea.",
    story:
      "At Gacheon village the land is so steep that people cut the slope into more than a hundred terraces, some barely wide enough for a few rows of rice. Seen from the road above they stack like fish scales, and directly below them is the sea. Villagers still farm by hand because machinery cannot reach. The Namhae coastal road that passes here is one of the finest drives in Korea, particularly in June when the flooded terraces mirror the evening sky.",
    facts: [
      "About 108 terraces, the smallest only a few square metres.",
      "Designated National Scenic Site No. 15.",
      "Farmed largely by hand because the ground is too steep for machines.",
      "On the coastal road around Namhae island.",
    ],
    travelTips: [
      "June (flooded fields) and October (ripe rice) are the two best moments.",
      "You need your own car; buses to the village are infrequent.",
      "There are homestays in the village — book ahead at weekends.",
    ],
    bestTime: "June and October",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "Open all day",
    galleryCaptions: ["Terraces dropping to the sea"],
  },
  "gimhae-gaya-tombs": {
    name: "Daeseong-dong Gaya Tumuli, Gimhae",
    summary: "The burial mounds of a kingdom history pushed to the margins, inscribed by UNESCO in 2023.",
    story:
      "Before Silla unified the peninsula, the lower Nakdong belonged to the Gaya confederacy — a set of small states living on iron and sea trade with Japan and China. Because Silla absorbed Gaya and the winners wrote the histories, they were all but forgotten; only the mounds at Daeseong-dong kept the evidence. Inside were iron armour, helmets, thousands of iron ingots used as currency, and the bones of people buried alongside their lord. The museum next door cuts one mound in half so you can see four centuries of burials stacked on top of each other.",
    facts: [
      "Inscribed by UNESCO in 2023 as part of the Gaya Tumuli.",
      "Gimhae was the capital of Geumgwan Gaya, the strongest state in the confederacy.",
      "Iron armour, helmets and iron ingots used as currency were found in the tombs.",
      "The Daeseong-dong museum displays a mound sectioned in place.",
    ],
    travelTips: [
      "Take the Busan–Gimhae light rail to Gimhae National Museum station.",
      "Do the museum first and the mounds after; it makes far more sense that way.",
      "The mound field is open grass with no shade — bring a hat in summer.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2 hours",
    ticket: "Free",
    openingHours: "09:00–18:00, last entry 17:30; closed Mondays, 1 January, Seollal and Chuseok",
    galleryCaptions: ["The Daeseong-dong burial mounds"],
  },
  "jirisan-national-park": {
    name: "Jirisan National Park",
    summary: "Korea's first national park, the largest massif on the mainland, with a ridge walk that takes three days.",
    story:
      "Jirisan was Korea's first national park and is still the largest massif on the mainland: it spans three provinces, Cheonwangbong summit reaches 1,915 metres, and the main ridge runs more than forty kilometres — the walk Korean hikers treat as a once-in-a-lifetime obligation. Three days, sleeping in mountain huts you must book a month ahead. With only one day, go up from Jungsan-ri to Cheonwangbong and back. The mountain carries heavy history too: partisans hid here through the years after the war, and memorials still stand in the valleys.",
    facts: [
      "Designated in 1967 as Korea's first national park.",
      "Cheonwangbong summit is 1,915m, the highest point on the Korean mainland.",
      "The main ridge traverse is about 45km and usually walked over three days.",
      "The park spans three provinces: Gyeongnam, Jeonbuk and Jeonnam.",
    ],
    travelTips: [
      "Mountain huts must be booked through the national park system and fill early.",
      "The usual day route is Jungsan-ri to Cheonwangbong and back, 9–10 hours.",
      "Summit weather is nothing like the valley — always carry a windproof layer.",
    ],
    bestTime: "May–June (azaleas) and October (autumn colour)",
    visitDuration: "A full day to three days",
    ticket: "",
    openingHours: "The national park entry-time system applies: ascent opens at 04:00 (March–November) or 05:00 (December–February), and each section has its own turn-back time somewhere between 12:00 and 17:00. Check the trail-closure notices before setting out",
    galleryCaptions: ["The Jirisan ridge at dawn"],
  },
  "upo-wetland": {
    name: "Upo Wetland, Changnyeong",
    summary: "Korea's largest natural freshwater marsh, formed in the age of dinosaurs and never drained.",
    story:
      "Upo has existed for something like a hundred and forty million years, and the remarkable thing is that it still does — most Korean marshland was filled for farmland during the 20th century. The wetland covers more than two square kilometres, its surface so thick with grass and duckweed that from a distance it reads as a field; only up close do you see water beneath. This is where the crested ibis, extinct in the wild in Korea, has been reintroduced since 2019. A walking and cycling loop takes about three hours, and the dawn mist is why people get up at four.",
    facts: [
      "Korea's largest natural freshwater wetland at about 2.3km².",
      "Thought to have formed around 140 million years ago.",
      "Registered under the Ramsar Convention on wetlands in 1998.",
      "It is the reintroduction site for the crested ibis, once extinct in the wild in Korea.",
    ],
    travelTips: [
      "Hire a bike at the gate for the loop; walking it all is a long way.",
      "The mist is best on cold mornings from October to December.",
      "Bring insect repellent in summer.",
    ],
    bestTime: "October–December (mist and migratory birds)",
    visitDuration: "3 hours",
    ticket: "",
    openingHours: "The trails are open 24 hours; there are five routes, from 1 km (30 minutes) to 9.7 km (3 hours 30 minutes)",
    galleryCaptions: ["Dawn mist over Upo"],
  },
  "jinhae-cherry-blossom": {
    name: "Jinhae Cherry Blossom",
    summary: "Three hundred and sixty thousand cherry trees burying a naval town, including Korea's most photographed railway and stream.",
    story:
      "In late March the naval town of Jinhae disappears under blossom. More than three hundred and sixty thousand cherry trees flower at once and the whole country turns up for the Gunhangje festival. Two spots have queues: Gyeonghwa station, where an old railway line runs through eight hundred metres of blossom tunnel; and the Yeojwacheon stream, where branches lean over the water on either side of a small bridge made famous by a television drama. Outside blossom season Jinhae is an ordinary naval port town, quiet and largely unvisited.",
    facts: [
      "More than 360,000 cherry trees, the highest concentration in any Korean city.",
      "The Gunhangje festival runs from late March into early April.",
      "The Gyeonghwa station railway runs about 800m under blossom on both sides.",
      "Jinhae is the main base of the Republic of Korea Navy.",
    ],
    travelTips: [
      "Blossom season is extremely crowded — take a train to Changwon and a bus; don't drive.",
      "Gyeonghwa station is worst at midday; arrive by 7am for photographs.",
      "Bloom dates shift each year, so check the forecast before booking.",
    ],
    bestTime: "Late March to early April",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The Gyeonghwa station railway in blossom"],
  },
  "tongyeong-mireuksan": {
    name: "Mireuksan Cable Car, Tongyeong",
    summary: "From the summit, hundreds of islands scattered across the Hallyeohaesang sea like broken stone.",
    story:
      "Tongyeong sits in the middle of Hallyeohaesang — a sheltered stretch of sea strewn with hundreds of islands that Koreans like to call the Naples of the East. The best way to grasp that geography is from the top of Mireuksan: a cable car almost two kilometres long lifts you near the summit in ten minutes, then it is a fifteen-minute walk to the observation deck. From there the bay opens out with islands layering paler towards the horizon; on the clearest days you can see Tsushima. Below is a city of fish markets, boatyards and the famous chungmu gimbap.",
    facts: [
      "The cable car runs about 1.975km, one of the longest in Korea.",
      "Mireuksan summit is 461m, overlooking Hallyeohaesang National Marine Park.",
      "On very clear days the Japanese island of Tsushima is visible.",
      "Tongyeong is the home town of composer Yun Isang and of chungmu gimbap.",
    ],
    travelTips: [
      "Book the cable car ahead at weekends; the queue can reach an hour.",
      "It stops in strong wind — mornings are usually calmer.",
      "From the upper station it is a further 15-minute walk up steps to the deck.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2–3 hours",
    ticket: "Cable car 17,000 KRW return (adult)",
    openingHours: "09:30–17:00 (varies by season)",
    galleryCaptions: ["The Hallyeohaesang islands from the summit"],
  },
  "geoje-windy-hill": {
    name: "Windy Hill & Geoje Coast",
    summary: "A bare grass hill running out to sea with a wooden windmill, and wind strong enough to make standing hard.",
    story:
      "The name is accurate: the wind here does not stop. The grass hill juts into the sea at Dojangpo point, a wooden windmill stands on top as scenery, and the grass lies permanently flat one way. Looking out you have the Hallyeohaesang sea with Oedo and Haegeumgang just offshore — Haegeumgang being two rock masses split by a gap narrow enough for a small boat to pass through in calm water. Geoje is Korea's second largest island, known for its shipyards, but its southern coast is all cliffs and small bays.",
    facts: [
      "Windy Hill stands at Dojangpo point on Geoje island.",
      "Geoje is Korea's second largest island after Jeju.",
      "Haegeumgang, the famous split rock, lies just offshore nearby.",
      "Tour boats to Oedo and Haegeumgang leave from harbours close by.",
    ],
    travelTips: [
      "Hold onto your hat and your phone — the wind is genuinely strong.",
      "Boats to Haegeumgang cancel in rough sea; check at the harbour first.",
      "The path down to the rocks is steep and slippery in rain.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The windmill on Windy Hill"],
  },
  "namhae-german-village": {
    name: "German Village, Namhae",
    summary: "A village of red-tiled roofs built on the Namhae coast by returning miners and nurses who had worked in Germany.",
    story:
      "In the 1960s and 70s thousands of Koreans went to West Germany as miners and nurses, sending hard currency home through the country's poorest years. In the early 2000s South Gyeongsang province granted land to those among them who wanted to retire back home, and they built in the German manner — red tiles, white walls, timber joinery imported from Germany. The result is a hillside above Namhae bay holding a few dozen houses that look like Bavaria. Many are now guesthouses or cafés run by the elderly owners themselves, and there is a beer festival each October.",
    facts: [
      "Established in the early 2000s for Koreans returning from working in West Germany.",
      "The houses are built in German style, with much of the material imported from Germany.",
      "A small museum covers the history of Korean miners and nurses in Germany.",
      "A Namhae version of Oktoberfest is held each October.",
    ],
    travelTips: [
      "Combine it with the Daraengi terraced fields, about 30 minutes away by car.",
      "People live here — only enter houses with an open sign.",
      "The Namhae coast road is beautiful but full of bends; drive slowly.",
    ],
    bestTime: "April–June and September–October (beer festival in October)",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "All day (museum 09:00–18:00)",
    galleryCaptions: ["Red roofs above Namhae bay"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  gyeongnam: {
    name: "South Gyeongsang",
    summary: "The province of the southern archipelago, of Haeinsa's woodblocks and of coastal roads.",
    story:
      "South Gyeongsang embraces the sea where the land shatters into hundreds of islands. Tongyeong and Geoje live by fishing and ferries; Namhae has terraces that fall straight into the water; Jinju keeps a fortress bound up with the Imjin War and an October lantern festival. Deep in the Gayasan mountains sits Haeinsa, where 81,258 woodblocks of the Buddhist canon have survived seven centuries in naturally ventilated wooden halls. The food here tastes of the sea, and much of it is eaten raw.",
    bestTime: "April–June and September–November",
    specialties: ["Chungmu gimbap", "Jinju bibimbap", "Braised pufferfish", "Tongyeong oysters"],
  },
};
