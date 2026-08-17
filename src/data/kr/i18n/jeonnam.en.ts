import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "suncheonman-bay": {
    name: "Suncheonman Bay Wetland",
    summary: "A vast field of reeds on tidal flats, where hooded cranes come to winter.",
    story:
      "Suncheonman is one of the five largest intact coastal wetlands in the world. Boardwalks lead through reeds taller than you are, and from the Yongsan observatory on the hill the whole bay opens up, the reed beds curling across the mud like wood grain — the classic Korean sunset photograph. In winter thousands of hooded and white-naped cranes arrive. The city moved an entire residential district away from the shore to protect the birds' ground.",
    facts: [
      "Part of the UNESCO World Heritage 'Getbol, Korean Tidal Flats' (2021).",
      "The reed field covers about 3 km², one of the largest in the country.",
      "A wintering site for hooded cranes and many rare migratory birds.",
      "Suncheonman National Garden opened next door in 2013.",
    ],
    travelTips: [
      "Climb to the Yongsan observatory for sunset — about 30 minutes up.",
      "Winter is the birdwatching season; bring binoculars.",
      "A shuttle links the garden with the wetland.",
    ],
    bestTime: "October–November (reeds) and December–February (migratory birds)",
    visitDuration: "Half a day",
    ticket: "8,000 KRW; the 12,000 KRW Suncheon integrated ticket also covers the national garden",
    openingHours: "08:00–19:00",
  },
  "boseong-tea-fields": {
    name: "Boseong Green Tea Fields",
    summary: "Rows of tea curving around the hills — the largest tea-growing area in Korea.",
    story:
      "Boseong has grown tea since the early 20th century, and the rows here are cut along the contours so that they wrap the hillsides in green ribbons. Climbing the steps to the top of the Daehan Dawon estate takes about twenty minutes, and from there the tea runs on and on to a cedar wood. People eat green tea ice cream, green tea noodles, rice mixed with tea leaves — a whole town living off one leaf. In winter the slopes are strung with lights for a festival.",
    facts: [
      "Korea's largest tea region, producing around 40% of the national crop.",
      "The Daehan Dawon plantation has been cultivated since 1939.",
      "The cedar avenue leading in has appeared in many films and adverts.",
      "A winter light festival is held across the tea hills.",
    ],
    travelTips: [
      "Come early while mist still hangs for the best photographs.",
      "May is when the new leaves are greenest.",
      "Buses from Suncheon or Gwangju take 1–1.5 hours.",
    ],
    bestTime: "May–June and September–October",
    visitDuration: "2–3 hours",
    ticket: "4,000–5,000 KRW depending on source (3,000 children)",
    openingHours: "09:00–18:00",
  },
  "yeosu-night-sea": {
    name: "Yeosu Night Sea & Cable Car",
    summary: "A southern port famous for its night sea, with a glass-floored cable car across the strait.",
    story:
      "A well-known song turned 'the night sea of Yeosu' into a phrase every Korean knows, and the city has lived up to it. After dark Dolsan Bridge lights up, fishing boats fill the harbour and restaurants along the quay serve seafood at the water's edge. The cable car linking the mainland to Dolsan island has glass-floored cabins that cross the strait with ships passing beneath. Yeosu also hosted Expo 2012; the old exhibition grounds are now a seaside park.",
    facts: [
      "Yeosu hosted the 2012 World Expo on the theme of the ocean.",
      "The Yeosu cable car runs 1.5 km with glass-floored cabins.",
      "Dolsan Bridge, 450m long, changes colour each evening.",
      "The city was Admiral Yi Sun-sin's naval base.",
    ],
    travelTips: [
      "Ride the cable car at dusk to catch both sunset and city lights.",
      "The KTX from Seoul to Yeosu-Expo takes about three hours.",
      "Try gat-kimchi and pufferfish soup, the local specialities.",
    ],
    bestTime: "May–October",
    visitDuration: "Half a day",
    ticket: "Cable car 17,000 KRW return (glass-floor cabin costs more)",
    openingHours: "09:30–22:00 (cable car)",
  },
  hyangiram: {
    name: "Hyangiram Hermitage",
    summary: "A small hermitage clinging to a cliff at the end of the peninsula, reached through narrow rock clefts.",
    story:
      "Hyangiram means 'the hermitage facing the sun', and it sits on a cliff at the southern tip of Dolsan island, looking east. The path up passes through four rock clefts so narrow that larger visitors have to turn sideways — tradition holds that squeezing through all four clears your worldly troubles. From the courtyard there is nothing below but sea and rock. This is one of Korea's four great sunrise spots, and on 1 January people start walking up at three in the morning.",
    facts: [
      "Founded in 644 by the monk Wonhyo.",
      "The approach passes through four very narrow natural rock clefts.",
      "One of the four most famous sunrise viewpoints in Korea.",
      "At the southern end of Dolsan island, about 40 minutes from central Yeosu.",
    ],
    travelTips: [
      "Wear shoes with grip: the steps and clefts get slippery.",
      "New Year's Day is extremely busy — come early or choose another date.",
      "Combine it with the Yeosu night sea on the same trip.",
    ],
    bestTime: "Year-round, best at sunrise",
    visitDuration: "2 hours",
    ticket: "2,000 KRW",
    openingHours: "05:00–19:00",
  },
  "damyang-bamboo": {
    name: "Juknokwon Bamboo Forest, Damyang",
    summary: "A 31-hectare planted bamboo forest with eight trails, cool even in high summer.",
    story:
      "Damyang has lived off bamboo for centuries — basketry, chopsticks, fans, and rice steamed inside a bamboo tube. Juknokwon is its bamboo forest opened to visitors, with eight paths bearing names like 'the lovers' way' and 'the path of contemplation'. Inside, the sound of leaves rubbing together is unlike anything else, and the temperature drops a few degrees. Nearby runs the two-kilometre metasequoia avenue, one of the most beautiful roads in Korea.",
    facts: [
      "A planted bamboo forest of about 31 hectares with eight walking trails.",
      "Damyang is the best-known bamboo region in Korea.",
      "The nearby metasequoia avenue runs about 2 km.",
      "Rice steamed in a bamboo tube (daetongbap) is the local speciality.",
    ],
    travelTips: [
      "Eat bamboo-tube rice at the restaurants by the forest gate.",
      "Do the metasequoia avenue the same afternoon, ten minutes away.",
      "Buses from Gwangju take about 40 minutes.",
    ],
    bestTime: "May–October",
    visitDuration: "2 hours",
    ticket: "3,000 KRW (1,500 children); free for over-65s",
    openingHours: "09:00–19:00 (March–October), 09:00–18:00 (November–February)",
  },
  songgwangsa: {
    name: "Songgwangsa Temple",
    summary: "One of Korea's three jewel temples, which produced sixteen national preceptors in succession.",
    story:
      "Korean Buddhism has three 'jewel temples', each standing for one of the Three Jewels. Songgwangsa is the Sangha jewel — the temple of the monastic community — because over two centuries it produced sixteen national preceptors one after another, which no other temple managed. It remains one of the strictest meditation centres in Korea, and part of the compound is closed to visitors so the monks can practise. The roofed wooden bridge Cheongnyanggak over the stream at the gate is the most photographed view. It was also here that Master Kusan opened meditation courses to foreigners in the 1970s, earlier than almost any Korean temple.",
    facts: [
      "One of Korean Buddhism's three jewel temples, representing the Sangha.",
      "It produced sixteen national preceptors in succession during the Goryeo era.",
      "Inscribed by UNESCO in 2018 as part of the Sansa mountain monasteries.",
      "The roofed wooden Cheongnyanggak bridge crosses the stream at the gate.",
    ],
    travelTips: [
      "Parts of the compound are closed while the monks are in retreat.",
      "Multi-day templestays are offered; book ahead.",
      "Combine it with Suncheonman bay, about 40 minutes away by car.",
    ],
    bestTime: "April–June and October–November",
    visitDuration: "2 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "07:00–19:00",
  },
  naganeupseong: {
    name: "Naganeupseong Walled Town",
    summary: "An intact Joseon town wall — and inside it, a village people still live in.",
    story:
      "Naganeupseong is a rare thing: an eupseong — a wall around an entire administrative town rather than a military fort — still complete, with about a hundred families living inside it. You walk the four-metre wall looking down on thatched roofs laid out as streets, cooking smoke rising in the evening, and people actually drying chillies in their yards. Not one house has aluminium windows or a tin roof. It is a familiar backdrop for historical dramas, but unlike a film set it never stopped being a village.",
    facts: [
      "The wall dates from 1397, runs about 1.4km and stands 4m high.",
      "Around 100 households still live inside the walls.",
      "One of very few intact eupseong (town-enclosing walls) left in Korea.",
      "The houses keep their thatch, with no modern materials permitted.",
    ],
    travelTips: [
      "Walking the full circuit of the wall takes about 30 minutes; go late in the day.",
      "You can stay overnight in some of the thatched houses; book ahead.",
      "People live here — don't wander into yards or open doors.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2 hours",
    ticket: "4,000 KRW; included in the 12,000 KRW Suncheon integrated ticket",
    openingHours: "09:00–18:00",
  },
  "wando-cheongsando": {
    name: "Cheongsando Island, Wando",
    summary: "Asia's first 'slow' island, with terraced paddies watered through an ancient stone conduit system.",
    story:
      "Cheongsando was designated Asia's first Slow City, and the title is not a tourism slogan — the island really is slow. Its gudeuljangnon terraced paddies use a system found nowhere else: stones are laid as hidden channels beneath the soil, exactly the way an ondol underfloor heating system is built, to hold water on ground that will not otherwise keep it. The FAO recognises it as a globally important agricultural heritage system. Eleven walking stages ring the island, past the terraces, rapeseed fields in April, and low stone walls set against the sea wind. Several Korean films were shot here.",
    facts: [
      "Designated Asia's first Cittaslow in 2007.",
      "The gudeuljangnon terraces use hidden stone channels on the ondol principle.",
      "The FAO recognises the system as Globally Important Agricultural Heritage.",
      "Eleven walking stages ring the island's coast.",
    ],
    travelTips: [
      "The ferry from Wando takes about 50 minutes; check ahead, it is weather-dependent.",
      "April is when rapeseed flowers cover the terraces.",
      "There is little transport on the island — a bike or your own feet make most sense.",
    ],
    bestTime: "April (rapeseed) and September–October",
    visitDuration: "A full day",
    ticket: "The ferry is about 8,700 KRW one way (roughly 17,400 return); taking a car costs far more",
    openingHours: "By ferry schedule",
  },
  "jindo-sea-parting": {
    name: "Jindo Sea Parting",
    summary: "A few times a year the tide drops to reveal a rock road nearly three kilometres long between two islands.",
    story:
      "A few times a year, when the moon is in the right place, the water between Jindo and Modo island falls far enough to expose a reef about forty metres wide and nearly three kilometres long — and people walk across it, out in the sea. It lasts about an hour before the water returns. Local legend says villagers fleeing tigers to Modo left an old woman behind; she prayed to the Dragon King for days, and the sea opened for her. A festival with lanterns and drum troupes is held for the occasion. Jindo is also home to the Jindo dog, a designated natural monument.",
    facts: [
      "The exposed road is about 2.8km long and some 40m wide.",
      "It happens a few times a year and lasts roughly an hour.",
      "The Jindo sea-parting festival is held at the lowest tides, usually March–April.",
      "The Jindo dog is Korea's Natural Monument No. 53.",
    ],
    travelTips: [
      "The dates and times shift each year — check Jindo county's calendar before booking.",
      "Bring rubber boots; the organisers also rent them on site.",
      "The water returns quickly; don't linger past the announced window.",
    ],
    bestTime: "March–April (the sea-parting festival)",
    visitDuration: "Half a day",
    ticket: "Free; only some of the hands-on activities are ticketed",
    openingHours: "The sea road only opens at the lowest tide, for about an hour, and the time shifts every day. The festival runs four days in spring — look up that year's tide table and arrive one or two hours early, since the path emerges gradually rather than all at once",
  },
  "mokpo-modern-history": {
    name: "Mokpo Modern History Quarter",
    summary: "A port opened in 1897, with a Japanese consulate, tunnels dug into the hill and lanes running down to the sea.",
    story:
      "Mokpo opened as a port in 1897 and quickly became the place from which the Japanese shipped Jeolla's rice home. The red-brick Japanese consulate on the flank of Yudalsan is now the modern history museum, and directly behind it are tunnels driven into the hill by forced labour at the end of the Second World War. Downhill lies the old quarter of warehouses, banks and intact Japanese houses. Mokpo is also a city of trot music and of hongeo, fermented skate — which reduces first-timers to tears. At night the Mokpo suspension bridge lights up and the whole bay with it.",
    facts: [
      "Mokpo port opened by treaty in 1897.",
      "The Japanese consulate, built in 1900, is now the Mokpo Modern History Museum.",
      "Tunnels behind the consulate were driven into Yudalsan late in the Second World War.",
      "Mokpo is known for fermented skate (hongeo) and for trot music.",
    ],
    travelTips: [
      "Climb Yudalsan at sunset for the view over the port and the offshore islands.",
      "Hongeo is pungent — beginners should try it as 'samhap', with boiled pork and kimchi.",
      "The KTX from Yongsan to Mokpo takes about 2.5 hours.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "Half a day",
    ticket: "2,000 KRW (1,000 teens and soldiers, 500 primary pupils, free for preschoolers)",
    openingHours: "09:00–18:00, museum closed Mondays",
  },
  "gurye-sansuyu": {
    name: "Gurye Sansuyu Village",
    summary: "A village below Jirisan where cornelian cherry blooms yellow before anything else in the Korean spring.",
    story:
      "Every March, while the rest of Korea is still grey, the Sandong valley at Gurye turns yellow. The sansuyu cornelian cherries here were planted more than a thousand years ago and now number in the tens of thousands around stone-walled hamlets — they flower before they leaf, so each tree is nothing but yellow. Villagers live on the dried fruit, sold as medicine, and they will tell you that the daughters of the village used to separate the stones with their teeth, so marrying a Sandong woman meant marrying a trade. Dry-stone walls between the orchards frame the whole scene.",
    facts: [
      "Sansuyu blooms from mid to late March, earliest of Korea's spring flowers.",
      "The Sandong area of Gurye has grown sansuyu for over a thousand years.",
      "The dried fruit is sold as medicine and is the villages' main income.",
      "The Gurye Sansuyu Festival is held each March.",
    ],
    travelTips: [
      "The bloom lasts about two weeks in mid-March — follow the festival dates.",
      "Walk the stone walls between the orchards rather than standing in the festival area.",
      "Combine it with Jirisan National Park next door.",
    ],
    bestTime: "Mid to late March",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "All day",
  },
  "suncheon-national-garden": {
    name: "Suncheon Bay National Garden",
    summary: "Korea's first national garden, built as a belt to stop the city creeping into the wetland.",
    story:
      "Suncheon had a problem: its wetland is where hooded cranes winter, and the city was spreading towards it. Their answer was unusual — rather than simply ban building, they laid an enormous garden across the gap as a buffer, and moved a residential district out of the way. The garden covers nearly a hundred and ten hectares, opened in 2013, and holds gardens themed by country, an artificial hill shaped after Suncheon's own topography, and a small train running out to the wetland. In 2015 it became Korea's first national garden. It is a rare case of a city stepping back to leave room for birds.",
    facts: [
      "Designated Korea's first National Garden in 2015.",
      "About 110 hectares, opened in 2013.",
      "Built as a buffer belt to stop urban sprawl reaching Suncheonman wetland.",
      "A small train links the garden with the wetland.",
    ],
    travelTips: [
      "Buy the combined garden and wetland ticket; it is cheaper than separate entries.",
      "The garden is large — use the train or hire a bike.",
      "October–November gives you chrysanthemums in the garden and ripe reeds in the bay.",
    ],
    bestTime: "April–June and October–November",
    visitDuration: "Half a day",
    ticket: "8,000 KRW; the Suncheon integrated ticket is 12,000 KRW (garden + wetland + Naganeupseong, valid 2 days)",
    openingHours: "09:00–19:00 (until 18:00 in winter)",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  jeonnam: {
    name: "South Jeolla",
    summary: "The far south, with thousands of islands, the Boseong tea hills and UNESCO-listed tidal flats.",
    story:
      "South Jeolla has more islands than any other province — over two thousand scattered across the southwestern sea — and its coast is tidal flats stretching for tens of kilometres, now part of a world natural heritage site. Suncheonman receives its cranes every winter, Boseong wears its green tea hills, and Yeosu shines all night beside its harbour. Many Koreans consider this the best place in the country to eat: seafood straight from the water, dozens of side dishes at every meal, and the most divisive dish of all, fermented skate.",
    bestTime: "May–June and September–November",
    specialties: ["Fermented skate (hongeo)", "Muan baby octopus", "Boseong green tea", "Damyang bamboo rice"],
  },
};
