import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  seoraksan: {
    name: "Seoraksan National Park",
    summary: "Granite walls rising close to the sea, where every Korean autumn begins.",
    story:
      "Seoraksan is the mountain Koreans think of first when they say 'let's go hiking'. White granite faces stand vertical, pines grow out of the cracks, and one trail leads to Ulsanbawi — six huge rocks that legend says were on their way to Geumgangsan, arrived late, and stayed. A cable car carries you to Gwongeumseong if you would rather not climb. Every late September the red leaves start at Seoraksan's summit and spread south over the following month — the country's autumn map is drawn from here.",
    facts: [
      "Daecheongbong peak reaches 1,708m, the third highest in South Korea.",
      "Designated a UNESCO Biosphere Reserve in 1982.",
      "Sinheungsa temple at the foot holds a 14.6m bronze Buddha.",
      "Autumn colour usually starts here first in the country, in late September.",
    ],
    travelTips: [
      "The Ulsanbawi route ends with more than 800 steps; allow four hours return.",
      "Autumn weekends are extremely busy — go on a weekday if you can.",
      "Intercity buses from Seoul reach Sokcho in about 2.5 hours.",
    ],
    bestTime: "Late September to mid-October",
    visitDuration: "Full day",
    ticket: "Park entry is free; the Gwongeumseong cable car is 16,000 KRW return (12,000 for children)",
    openingHours: "06:00–20:00; the cable car usually runs 09:00–17:30",
  },
  "gyeongpo-beach": {
    name: "Gyeongpo Beach, Gangneung",
    summary: "Gangneung's long stretch of sand, with a brackish lagoon and a pine wood right behind it.",
    story:
      "Gangneung is where Seoul goes when it needs the sea — since the high-speed train arrived the trip takes under two hours. Gyeongpo beach runs almost two kilometres, backed by Gyeongpo lagoon with a walking loop and the Gyeongpodae pavilion that has stood there since the 14th century. The old saying goes that here you can see five moons at once: in the sky, on the sea, on the lake, in your cup and in the eyes of the person opposite. The city is also Korea's coffee capital, with a whole café street at Anmok just around the bay.",
    facts: [
      "The beach runs about 1.8 km, the largest on the east coast.",
      "Gyeongpodae pavilion was built in 1326, overlooking the lagoon.",
      "Anmok coffee street, minutes away, is famous across Korea.",
      "The KTX from Seoul reaches Gangneung in about two hours.",
    ],
    travelTips: [
      "Take the KTX from Seoul station — fast and convenient.",
      "Cherry blossom rings the lagoon in April.",
      "Stop at Gangneung Jungang Market for fish cakes and stuffed squid.",
    ],
    bestTime: "June–September (swimming), April (cherry blossom)",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "All day",
  },
  ojukheon: {
    name: "Ojukheon House",
    summary:
      "A 500-year-old wooden house, birthplace of Yi I and the painter Shin Saimdang — two faces on Korean banknotes.",
    story:
      "Very few houses anywhere produced two people printed on their country's currency: Shin Saimdang (50,000 won) and her son, the scholar Yi I (5,000 won). Ojukheon is among the oldest wooden houses left standing in Korea, named for the black bamboo around its yard. Inside hang Shin Saimdang's paintings of plants and insects — a 16th-century woman respected as an artist and not only as a mother, which was rare indeed in her time.",
    facts: [
      "The main house dates from the early 16th century and is National Treasure No. 165.",
      "Birthplace of the scholar Yi I (Yulgok) in 1536.",
      "Shin Saimdang was the first woman to appear on a Korean banknote.",
      "The grounds include the Gangneung municipal museum.",
    ],
    travelTips: [
      "Combine with Gyeongpo beach, about ten minutes away by car.",
      "English guided tours run at fixed times.",
      "The bamboo grove behind the house is the best photo spot.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5 hours",
    ticket: "3,000 KRW (free for over 65s)",
    openingHours: "08:00–18:00 (to 17:30 in winter), last admission 30 min before closing",
  },
  "daegwallyeong-sky-ranch": {
    name: "Daegwallyeong Sky Ranch, Pyeongchang",
    summary: "Sheep pasture on a 1,000-metre plateau — and the snow country of the 2018 Winter Olympics.",
    story:
      "Cross the Daegwallyeong pass and the climate changes outright: a broad plateau, hard wind, grass to the horizon and white turbines turning slowly. The farms here raise sheep and dairy cattle and open their hills to visitors who walk up to feed hay to the flock. In winter the snow lies a metre deep — this is the region that hosted the Pyeongchang 2018 Winter Olympics, and the ski resorts run all season. On summer mornings mist fills the valley below while the hilltops are already in sun.",
    facts: [
      "Sits at around 1,000m on the Daegwallyeong pass.",
      "Pyeongchang hosted the 2018 Winter Olympic Games.",
      "Several sheep farms in the area open to visitors.",
      "The Daegwallyeong wind farm is one of Korea's largest turbine clusters.",
    ],
    travelTips: [
      "The wind is strong all year — bring a jacket even in summer.",
      "The farm loop trails run 1.2–2 km and are easy walking.",
      "In winter you need snow tyres or an organised tour.",
    ],
    bestTime: "June–September (green pasture), December–February (snow)",
    visitDuration: "2–3 hours",
    ticket: "8,000 KRW (6,000 children and seniors); the tractor wagon and hay-feeding cost extra",
    openingHours: "09:00–17:30",
  },
  jeongdongjin: {
    name: "Jeongdongjin",
    summary: "The railway station closest to the sea in the world, where the country gathers for New Year sunrise.",
    story:
      "The platform at Jeongdongjin is only a few steps from the surf — a Guinness record for the station nearest the sea. After a hit television drama was filmed here in the nineties the place became a meeting point for couples and sunrise-watchers. On the night of 31 December trains run through the dark from Seoul carrying people out to the beach to wait for the first sun of the year. On the hill behind, an enormous cruise ship built as a hotel looks down over the water.",
    facts: [
      "Recognised by Guinness as the railway station closest to the sea.",
      "Made famous by the 1995 drama 'Hourglass'.",
      "The giant hourglass in the park beside it turns once a year.",
      "The New Year's Eve train from Seoul is a Korean tradition.",
    ],
    travelTips: [
      "Book the New Year's Eve train months ahead if you want to go then.",
      "Sunrise is around 5am in summer, 7:30am in winter.",
      "Rail bikes run along the coast nearby.",
    ],
    bestTime: "Sunrise; especially 1 January",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "All day",
  },
  naksansa: {
    name: "Naksansa Temple",
    summary: "A clifftop temple with a 15-metre white Avalokiteshvara looking out over the East Sea.",
    story:
      "Naksansa was founded in 671 on a cliff facing the sea, and its Uisangdae pavilion on the edge is one of the country's best-known sunrise spots. In 2005 a great forest fire burned most of the temple down; the 15-metre white stone Avalokiteshvara stood untouched in the middle of the flames, and that image became the symbol of the rebuilding. The temple has since been restored and a new bronze bell cast, but blackened pine stumps still stand on the hillside.",
    facts: [
      "Founded in 671 by the monk Uisang of Silla.",
      "The white stone Avalokiteshvara, 15m tall, was completed in 1977.",
      "A 2005 forest fire destroyed much of the temple, which was then rebuilt.",
      "Uisangdae pavilion on the cliff is a famous sunrise viewpoint.",
    ],
    travelTips: [
      "Come at sunrise and combine it with Naksan beach below.",
      "About 20 minutes from Sokcho, easy to pair with Seoraksan.",
      "A templestay programme runs here, facing the sea.",
    ],
    bestTime: "Year-round, best at sunrise",
    visitDuration: "1.5 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "05:00–19:00",
  },
  "nami-island": {
    name: "Nami Island",
    summary: "A crescent island of dead-straight tree avenues that change colour four times a year.",
    story:
      "Nami is a man-made island — it appeared when the Cheongpyeong dam filled and drowned the land that joined it to the shore. What made its name are the avenues planted arrow-straight: ginkgo, metasequoia, birch, each a few hundred metres long and each turning with the season. A television drama shot here in the early 2000s made the island a pilgrimage for Asian visitors, and it still is. The island declares itself the 'Naminara Republic', with its own passport and stamps — a joke maintained so seriously that there is a customs desk.",
    facts: [
      "A man-made island, formed when the Cheongpyeong dam filled in 1944.",
      "Named after the tomb of General Nami of the Joseon era, which lies on the island.",
      "It has styled itself the 'Naminara Republic' since 2006, with its own passport and stamps.",
      "You can arrive by ferry or by zipline from the shore.",
    ],
    travelTips: [
      "Take the zipline over if you'd rather not join the ferry queue.",
      "Weekends bring coach parties — come on a weekday or on the first ferry.",
      "Combine it with the Garden of Morning Calm and Petite France in the Gapyeong area.",
    ],
    bestTime: "Late October to mid-November (autumn colour)",
    visitDuration: "Half a day",
    ticket: "19,000 KRW including the return ferry (up 3,000 on last year)",
    openingHours: "08:00–21:00, open year-round; last ferry 21:05",
  },
  "chuncheon-soyang": {
    name: "Chuncheon & Soyang Lake",
    summary: "A city ringed by three lakes, and the birthplace of dakgalbi.",
    story:
      "Chuncheon is surrounded by water on every side — three dams on the Bukhan turned the valleys around the city into lakes, and morning mist rolling off the water into the streets is routine. Soyang is Korea's largest artificial lake; a ferry runs from Soyang pier to Cheongpyeongsa temple hidden up in the mountains, and the walk up from the landing passes a small waterfall. In the centre of town there is a whole street of dakgalbi — chicken fried with cabbage, sweet potato and rice cake on a large iron pan, finished by tipping rice in to fry up whatever sauce is left.",
    facts: [
      "Soyang Lake is Korea's largest artificial lake, created by the Soyanggang dam in 1973.",
      "Chuncheon is the capital of Gangwon province.",
      "Dakgalbi was invented here in the 1960s.",
      "Cheongpyeongsa temple is reached by ferry and then about a 20-minute walk.",
    ],
    travelTips: [
      "The ITX from Yongsan station in Seoul takes about 1 hour 10 minutes.",
      "Eat dakgalbi on Chuncheon's Myeongdong street, and order the fried rice at the end.",
      "Ferries to Cheongpyeongsa thin out in winter — check the last departure.",
    ],
    bestTime: "May–June and September–November",
    visitDuration: "Half a day",
    ticket: "The ferry to Cheongpyeongsa is about 5,500–6,000 KRW return (3,000 one way), a 10-minute crossing",
    openingHours: "Ferry 09:00–17:00",
  },
  "hwanseongul-cave": {
    name: "Hwanseongul Cave, Samcheok",
    summary: "East Asia's largest limestone cave, with chambers thirty metres high and a waterfall inside the mountain.",
    story:
      "Hwanseongul is the largest limestone cave system in East Asia: over six kilometres surveyed, of which about a quarter is open. This is not a cave of delicate formations but a cave of scale — chambers like cathedrals with ceilings thirty metres up, steel stairs bridging drops, and an underground waterfall falling in the dark. To reach the entrance you first ride a monorail up a slope of nearly forty degrees. The cave holds around ten degrees all year, making it one of the coolest places in Gangwon in summer.",
    facts: [
      "East Asia's largest limestone cave, with over 6.2km surveyed.",
      "Designated Natural Monument No. 178.",
      "The cave holds about 10–12°C year-round.",
      "Access is by a monorail climbing a slope of roughly 38 degrees.",
    ],
    travelTips: [
      "Bring a jacket — it is cold inside even in August.",
      "There are many steep, damp steel stairways; not for anyone uneasy with heights.",
      "Add the nearby Daegeumgul cave if you have time.",
    ],
    bestTime: "June–September to escape the heat, or year-round",
    visitDuration: "2 hours",
    ticket: "4,500 KRW; the monorail up to the cave is 7,000 KRW return (4,000 one way)",
    openingHours: "08:30–17:00",
  },
  "odaesan-woljeongsa": {
    name: "Odaesan & Woljeongsa Temple",
    summary: "A kilometre of ancient pines leading to a temple that holds a nine-storey octagonal stone pagoda.",
    story:
      "Before you reach Woljeongsa you pass the most memorable part: a kilometre of dirt track between two ranks of old red pines, trunks running straight up, the ground soft with needles. They call it the thousand-year road. At the end is the temple, and in its courtyard a nine-storey octagonal stone pagoda from the Goryeo era — unusual, since Korean pagodas are normally square — with a stone bodhisattva kneeling in offering before it. Odaesan is a large massif holding Korea's most extensive red pine forest, and the trail from the temple up to Sangwonsa and on to Birobong summit takes a full day.",
    facts: [
      "The 'thousand-year' red pine road into the temple runs about 1km.",
      "Woljeongsa's nine-storey octagonal pagoda is a national treasure of the Goryeo era.",
      "Odaesan holds the largest area of red pine forest in Korea.",
      "The temple runs a templestay open to foreign visitors.",
    ],
    travelTips: [
      "Come early, while mist still hangs between the pines.",
      "A shuttle bus runs from Woljeongsa up to Sangwonsa if you'd rather not walk.",
      "The trail ices over in winter; crampons are needed.",
    ],
    bestTime: "May–June and October (autumn colour)",
    visitDuration: "Half a day",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "08:00–18:00",
  },
  "gangneung-anmok-coffee": {
    name: "Anmok Coffee Street, Gangneung",
    summary: "A beach with a whole street of roasteries, which began with vending machines on the sand.",
    story:
      "It started plainly enough: in the 1980s a few coffee vending machines were installed along Anmok beach so people could drink something while watching the sea, and it turned into a regional habit. Then roasters moved in, opening right at the edge of the sand, and Gangneung now calls itself Korea's coffee capital, with its own festival each October. The good part is that the old vending machines are still there, standing beside the elaborate roasteries — and plenty of locals still choose the machine. A cup, then a walk along the shore into the East Sea wind, is how Gangneung starts the morning.",
    facts: [
      "The coffee street grew out of vending machines installed on the beach in the 1980s.",
      "Gangneung holds the Gangneung Coffee Festival each October.",
      "Dozens of cafés roast their own beans along Anmok beach.",
      "The beach faces east and is a sunrise spot.",
    ],
    travelTips: [
      "The KTX from Seoul to Gangneung takes only about 2 hours.",
      "Come early and drink your coffee as the sun comes up over the sea.",
      "Combine with Gyeongpo beach and the Ojukheon house on the same day.",
    ],
    bestTime: "Year-round; the coffee festival is in October",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "There are no shared hours — each café sets its own, most running roughly 09:00 to 22:00; the beach in front is open all day",
  },
  "cheongoksan-mureung": {
    name: "Mureung Valley, Donghae",
    summary: "A flat slab of rock the size of a football pitch mid-stream, covered in the carved names of old scholars.",
    story:
      "Mureung — 'the valley of the immortals' — opens with an enormous white slab lying flat in the stream, wide enough to hold a thousand people. For centuries scholars passing through carved their names into it, and the surface is now dense with overlapping Chinese characters, a visitors' book written in stone. Deeper in the valley comes a chain of falls: Ssangpokpo, where two streams drop into the same rock pool, and Yongchupokpo at the end. The water runs green from the limestone and is bitterly cold even in August.",
    facts: [
      "The Mureungbanseok slab covers about 5,000m² in the streambed.",
      "Hundreds of Chinese inscriptions were carved into it by scholars over the centuries.",
      "Ssangpokpo and Yongchupokpo falls lie deeper in the valley.",
      "The valley sits below Dutasan, near the city of Donghae.",
    ],
    travelTips: [
      "Wear grippy shoes: the streambed rock is very slippery when wet.",
      "Summer brings crowds who come to swim; June or September is far quieter.",
      "The far waterfall is about an hour's walk from the gate.",
    ],
    bestTime: "June–September and October for autumn colour",
    visitDuration: "3 hours",
    ticket: "2,000 KRW (1,500 teens, 700 children)",
    openingHours: "Summer 09:00–20:00 (in July–August ticketing opens at 06:00), winter 09:00–18:00",
  },
  "taebaeksan-snow": {
    name: "Taebaeksan National Park",
    summary: "A sacred mountain with a sky altar on its summit, where yews freeze into a crystal forest in winter.",
    story:
      "Taebaeksan is sacred in Korean belief: on the summit stands Cheonjedan, a stone altar to heaven said to date to the time of Dangun, and an official rite is still held there each October. But the reason most people climb it is winter. The mountain catches damp sea wind, so snow lies thick, and the ancient yews on its flanks — many dead upright for centuries without falling — ice over into white sculptures. The route from Danggol takes about two hours and is not steep, which makes this the friendliest snow mountain in the country for a first attempt.",
    facts: [
      "Janggunbong summit is 1,567m, among Korea's highest peaks.",
      "The Cheonjedan sky altar on the summit is still used for an annual rite.",
      "The ancient yew forest on its flanks is famous for winter ice.",
      "The Taebaeksan Snow Festival is held each January.",
    ],
    travelTips: [
      "Crampons are essential in winter and are sold at the foot of the mountain.",
      "January weekends are very busy; a weekday is a different mountain.",
      "Weather turns fast on the summit — carry an extra insulating layer.",
    ],
    bestTime: "January–February (ice and snow) and June (azaleas)",
    visitDuration: "Half to a full day",
    ticket: "",
    openingHours: "The national park entry-time system applies: ascent opens at 04:00 (March–November) or 05:00 (December–February), and each section has its own turn-back time somewhere between 12:00 and 17:00. Check the trail-closure notices before setting out",
  },
  "sokcho-abai-village": {
    name: "Abai Village, Sokcho",
    summary: "A village of northern refugees, crossed for seventy years by a raft pulled hand over hand on a steel hook.",
    story:
      "In December 1950 thousands of people from Hamgyong province in the north came down to Sokcho aboard warships, believing they would be home again within weeks. They put up shelters on the sandspit at the harbour mouth and named the village after their word for father — abai. Seventy years on their descendants are still there, and nobody has gone home. You cross to it on the galbae: an engineless steel raft that passengers haul themselves, hooking a cable and pulling it across fifty metres of channel. The village sells Hamgyong food found nowhere else in Korea: ojingeo sundae, sausage stuffed into a squid's body, and Hamhung cold noodles made from potato starch.",
    facts: [
      "The village dates from December 1950, when Hamgyong refugees arrived at Sokcho by ship.",
      "'Abai' is the Hamgyong dialect word for father.",
      "The galbae raft has no engine; passengers pull it across on a cable themselves.",
      "Ojingeo sundae and Hamhung cold noodles are the village's northern specialities.",
    ],
    travelTips: [
      "Take the galbae at least one way — it is the memorable part.",
      "Try ojingeo sundae at the village market; it is best hot.",
      "Combine it with Seoraksan, about 20 minutes away by car.",
    ],
    bestTime: "May–June and September–October",
    visitDuration: "2 hours",
    ticket: "The hand-pulled ferry across the channel costs 500 KRW each way",
    openingHours: "Raft runs roughly 06:00–23:00",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  gangwon: {
    name: "Gangwon",
    summary:
      "A province of high mountains and the East Sea — Seoraksan, the snow plateau of Pyeongchang and beaches made for sunrise.",
    story:
      "Gangwon is the emptiest half of the country's east: the Taebaek range runs its whole length, forest on one side, a drop into the East Sea on the other. In autumn the red leaves start at Seoraksan and spread down the peninsula. In winter deep snow covers the Pyeongchang plateau — host of the 2018 Olympics — and the ski resorts stay open all season. The coast at Gangneung, Sokcho and Jeongdongjin is where Seoul takes the train to watch the sunrise, eat squid straight off the boat and drink coffee facing the waves.",
    bestTime: "September–October (autumn colour) and December–February (snow)",
    specialties: ["Chuncheon makguksu", "Dakgalbi", "Sokcho squid", "Gangwon potatoes"],
  },
};
