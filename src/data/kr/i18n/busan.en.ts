import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "haeundae-beach": {
    name: "Haeundae Beach",
    summary: "Korea's most famous beach, a crescent of golden sand under a wall of high-rises.",
    story:
      "In summer Haeundae is a solid field of blue-and-white parasols, loudspeakers, surf and grilled seafood. Out of season it goes back to being where Busan walks in the morning, and the coastal path leads on to Dongbaekseom — once an island, now joined to the shore — with a boardwalk around the cliffs looking straight at Gwangan Bridge. Behind the sand is Haeundae market and lanes of fish-cake shops; to the east, a disused coastal railway has become a walking line above the sea.",
    facts: [
      "The beach runs about 1.5 km and is the busiest in Korea each summer.",
      "The Busan Sea Festival and the sand festival are both held here.",
      "Dongbaekseom next door has a cliffside walkway and the APEC House.",
      "The Blue Line Park train runs along the old coastal railway towards Songjeong.",
    ],
    travelTips: [
      "July–August is packed; June and September have warm water and far fewer people.",
      "Ride the Blue Line Park train late in the afternoon for sea views from a glass carriage.",
      "Metro Line 2 to Haeundae station, then a ten-minute walk.",
    ],
    bestTime: "June–September",
    visitDuration: "2–4 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Haeundae beach from Dongbaekseom"],
  },
  "gamcheon-culture-village": {
    name: "Gamcheon Culture Village",
    summary: "Stepped houses painted in every colour on a hillside, once a refugee settlement, now an art village.",
    story:
      "After the Korean War, refugees packed houses onto this slope, roof stacked above roof in terraces. In 2009 a community art project repainted the whole village and invited artists to move in; today the narrow lanes are full of murals, small sculptures and cafés looking down the valley. The Little Prince statue on the railing draws the longest photo queue. Residents still live here, which is why signs asking for quiet hang everywhere.",
    facts: [
      "Formed in the 1950s by refugees from the war.",
      "Regenerated as an art village from 2009.",
      "The houses are painted from a coordinated palette so they read as one composition from afar.",
      "A stamp map is sold at the entrance for finding the art installations.",
    ],
    travelTips: [
      "Take a minibus from Toseong station (Line 1) to the top and walk down.",
      "The lanes are narrow and steep — shoes with grip help.",
      "Afternoon light brings out the colours best.",
    ],
    bestTime: "Year-round",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "The village is open all day; the information centre and Haneulmaru viewpoint run 09:00–16:00",
    galleryCaptions: ["Painted houses on the hillside"],
  },
  "jagalchi-market": {
    name: "Jagalchi Fish Market",
    summary: "Korea's largest seafood market, where you pick your fish downstairs and eat it upstairs.",
    story:
      "Jagalchi was built up after the war by the women who sold the fish — the jagalchi ajumma — and it is still they who stand behind the tanks. The ground floor is hundreds of stalls of octopus, flounder, sea cucumber and shellfish; you point at what you want, they prepare it on the spot, and you carry it upstairs where a small fee turns it into a plate of sashimi. Outside is Nampo fishing harbour, where the boats come in at dawn and the auction rings down the quay.",
    facts: [
      "The largest seafood market in Korea, trading since 1945.",
      "The current building, shaped like a wave, opened in 2006.",
      "Level one sells live seafood; level two prepares it for you.",
      "The Jagalchi Festival is held each October.",
    ],
    travelTips: [
      "Agree the price and the preparation fee before anything is cut.",
      "Come before 9am to see the market working properly.",
      "Combine with Gukje Market and BIFF Square next door.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "05:00–22:00, closed the first and third Tuesday of each month",
    galleryCaptions: ["Live seafood stalls at Jagalchi"],
  },
  "haedong-yonggungsa": {
    name: "Haedong Yonggungsa Temple",
    summary: "A rare temple built at the water's edge rather than in the mountains, catching Busan's first sunrise.",
    story:
      "Most Korean temples sit deep in the hills; Yonggungsa clings to the rocks facing the East Sea. You descend 108 steps — one for each affliction — to a courtyard where waves break against the wall. It is said that a prayer offered here will grant one wish, so there is always someone bowing before the seaside Buddha. It is at its best at sunrise, or at Buddha's Birthday when thousands of paper lanterns cover every path.",
    facts: [
      "First founded in 1376 during the Goryeo dynasty.",
      "One of very few Korean temples built right on the sea.",
      "The entrance has 108 stone steps, for the 108 afflictions.",
      "Extremely busy at Buddha's Birthday and on New Year's Day.",
    ],
    travelTips: [
      "Come at sunrise for the light and the smaller crowd.",
      "Bus 181 from Haeundae takes about 30 minutes.",
      "The stone steps are slippery in the rain.",
    ],
    bestTime: "Year-round; lantern season in April–May",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "04:30–19:00 daily",
    galleryCaptions: ["The temple on its sea rocks"],
  },
  "gwangalli-beach": {
    name: "Gwangalli Beach & Gwangan Bridge",
    summary: "A beach facing a two-tier suspension bridge, where Busan flies drones and fireworks every weekend.",
    story:
      "Gwangalli is smaller than Haeundae but has something Haeundae doesn't: a 7.4 km bridge strung across the eye line, its lights changing colour all night. The cafés and bars along the shore all face the water through glass, and on Saturday evenings the city usually stages a drone show over the bay. In late October the Busan Fireworks Festival turns this beach into the city's biggest grandstand — arrive hours early for a seat.",
    facts: [
      "Gwangan Bridge is 7.42 km long, Korea's first two-tier suspension bridge.",
      "Its lights change colour by day of the week and by season.",
      "The Busan Fireworks Festival takes place in late October.",
      "Drone shows are usually held over the bay on weekend evenings.",
    ],
    travelTips: [
      "Book a seafront restaurant in advance if you want to watch fireworks indoors.",
      "Metro Line 2 to Gwangan station, then a ten-minute walk.",
      "Night is the time to come — it is a different place from the daytime.",
    ],
    bestTime: "May–October, weekend evenings",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Gwangan Bridge from the beach"],
  },
  beomeosa: {
    name: "Beomeosa Temple",
    summary: "A 1,300-year-old head temple under Geumjeongsan, on the very edge of the city.",
    story:
      "Less than an hour from central Busan, Beomeosa feels like leaving the city altogether: a stream through pine forest, the Iljumun gate standing on four stone pillars, and the main hall Daeungjeon with its dancheong painting faded by time. The temple runs a templestay where guests wake at three in the morning for the service and eat monastic meals in silence. From here a trail climbs to Geumjeongsanseong, the longest fortress wall in Korea.",
    facts: [
      "Founded in 678, during the Unified Silla period.",
      "A major head temple of the Jogye Order of Korean Buddhism.",
      "The four-pillared Iljumun gate is a national treasure.",
      "Runs templestay programmes for foreign visitors.",
    ],
    travelTips: [
      "Metro Line 1 to Beomeosa station, then bus 90 up to the temple.",
      "Book templestay at least a few days ahead.",
      "Add the Geumjeongsanseong wall walk if you have the energy.",
    ],
    bestTime: "April–May and October–November",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Open from early morning to dusk; admission is free",
    galleryCaptions: ["The main hall at Beomeosa"],
  },
  taejongdae: {
    name: "Taejongdae",
    summary: "The rocky headland at the end of Yeongdo, where sheer cliffs drop straight into the sea and a white lighthouse stands alone.",
    story:
      "Taejongdae is Busan's southern full stop: pine forest covers a headland, then the ground gives out into cliffs a hundred metres high standing over the water. A road train loops the point, but walking shows you more — the path follows the edge of the wood and now and then opens onto the open sea. Below the lighthouse, stone steps lead down to a rock shelf where women sell live seafood, squid and sea cucumber laid out straight on the stone. The name comes from King Taejong Muyeol of Silla, said to have practised archery here.",
    facts: [
      "The cliffs are about 100m high, at the southern tip of Yeongdo island.",
      "Named after King Taejong Muyeol of Silla.",
      "The Danubi road train loops the headland, stopping at the viewpoints.",
      "On a clear day you can see the Japanese island of Tsushima.",
    ],
    travelTips: [
      "Walk down and ride the train back up if you'd rather skip the climb.",
      "The rock shelf below the lighthouse is slippery — wear shoes with grip.",
      "Some paths close on very windy days.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2–3 hours",
    ticket: "Park entry is free; the Danubi train is 4,000 KRW for the full loop (2,000 for one leg)",
    openingHours: "05:00–24:00 (road train 09:00–18:00)",
    galleryCaptions: ["The lighthouse on the Taejongdae cliffs"],
  },
  "huinnyeoul-culture-village": {
    name: "Huinnyeoul Culture Village",
    summary: "A run of white houses clinging to Yeongdo's sea cliff, with a narrow path running right above the waves.",
    story:
      "Huinnyeoul means 'white stream', after the brooks that once fell from the cliff into the sea. After the Korean War refugees built here, on the slope, because there was nowhere else; now those stacked white houses look straight out at Busan harbour with container ships anchored offshore. The coastal path is narrow enough that two people must turn sideways, and below it the swell hits the sea wall. Many houses are cafés with windows onto the water. It appeared in Korean films, so the crowd skews young.",
    facts: [
      "It grew out of a post-Korean War refugee settlement.",
      "The name means 'white stream', after the brooks that fell down the sea cliff.",
      "The Huinnyeoul coastal path runs about 1.5km right along the water.",
      "It has been used as a location in several Korean films.",
    ],
    travelTips: [
      "Come late afternoon: raking light is best on the white walls and the sea.",
      "People live here — don't knock on doors or film into the houses.",
      "Combine it with Taejongdae on the same trip out to Yeongdo.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The coastal path below the village"],
  },
  "oryukdo-skywalk": {
    name: "Oryukdo Skywalk",
    summary: "A glass deck jutting out from the cliff, above the point where the Yellow Sea and the Sea of Japan officially meet.",
    story:
      "Oryukdo means 'five or six islands' — depending on the tide you count five or six, because one splits in two at high water. Korean hydrography treats this as the boundary between the South Sea and the East Sea, and a sign here says so outright. From the cliff, a horseshoe of glass extends about nine metres over water thirty-five metres below; visitors wear cloth slippers over their shoes to keep the glass clear. Standing at the edge and looking down, the sense of nothing underfoot is entirely real.",
    facts: [
      "The name reflects counting five or six islands depending on the tide.",
      "The glass deck extends about 9m, some 35m above the sea.",
      "Korean hydrography treats it as the boundary between the South Sea and the East Sea.",
      "It is the starting point of the Galmaetgil coastal trail.",
    ],
    travelTips: [
      "Cloth overshoes are compulsory and handed out free at the entrance.",
      "The deck can close in strong wind or rain.",
      "Add the Igidae trail next door if you still have legs for walking.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "1 hour",
    ticket: "Free",
    openingHours: "09:00–19:00 (1 Jun–30 Sep), 09:00–18:00 (1 Oct–31 May); last entry 10 minutes before closing, closed Mondays",
    galleryCaptions: ["The glass deck looking down on Oryukdo"],
  },
  "igidae-coastal-walk": {
    name: "Igidae Coastal Walk",
    summary: "A path over volcanic rock along the shore, facing the wall of Haeundae towers across the bay.",
    story:
      "Igidae is about four kilometres of rocky shoreline that spent decades sealed off as a military zone, so when it reopened in 2001 it was still wild. The trail follows the waterline over cracked volcanic rock, sometimes on a boardwalk across a gully, sometimes up steps onto a headland. What sets it apart is the angle: to your left, surf on black rock; to your right, across the bay, the entire Haeundae skyline and the Gwangan bridge — nature and city in one frame. The name is tied to a legend of two courtesans who pulled an enemy general into the sea.",
    facts: [
      "About 4km of coastal trail over volcanic rock.",
      "Formerly a closed military zone, reopened to the public in 2001.",
      "It forms one stage of Busan's Galmaetgil trail network.",
      "The name is linked to a legend from the Imjin War.",
    ],
    travelTips: [
      "Walk from the Oryukdo end towards Gwangalli so you finish where the restaurants are.",
      "Lots of steps and slick rock — not for pushchairs or smooth soles.",
      "Carry water; there is almost nothing to buy along the way.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "3 hours",
    ticket: "",
    openingHours: "Open all day (best walked in daylight)",
    galleryCaptions: ["The trail looking across to Haeundae"],
  },
  "yongdusan-busan-tower": {
    name: "Yongdusan Park & Busan Tower",
    summary: "A hill in the old quarter reached by outdoor escalator, topped by a tower over the whole harbour.",
    story:
      "Yongdusan means 'dragon's head mountain', and it rises right in the middle of the old Nampo-dong quarter. You don't have to climb: a run of outdoor escalators lifts you to the top, where there is a paved plaza, pigeons and a statue of Admiral Yi Sun-sin. Busan Tower, 120 metres and built in 1973, has an observation deck taking in the whole port — the container cranes, the ferries to Japan, and the housing running up the hillsides behind. At the foot of the hill are Gukje market and BIFF Square, where film stars have pressed their handprints into the pavement.",
    facts: [
      "Busan Tower is 120m tall and opened in 1973.",
      "The hill is reached by a system of outdoor escalators rather than on foot.",
      "The park holds a statue of Admiral Yi Sun-sin and the Citizens' Bell.",
      "Gukje market and BIFF film street are right below.",
    ],
    travelTips: [
      "Go at dusk to watch the port turn from daylight to lights.",
      "The park is free; only the tower's observation deck is ticketed.",
      "Combine with Gukje market and Jagalchi fish market in one outing.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5 hours",
    ticket: "The park is free; the observatory is about 12,000 KRW at the gate, usually cheaper booked online",
    openingHours: "Park open all day; the tower 10:00–23:00",
    galleryCaptions: ["Busan harbour from the tower"],
  },
  "bosu-dong-book-street": {
    name: "Bosu-dong Book Street",
    summary: "A narrow lane of a few dozen second-hand bookshops, stacked floor to ceiling since the war years.",
    story:
      "In 1950, when Busan became the provisional capital and refugees poured in, a couple spread sacking in this lane and sold used books. Seventy years on there are still about thirty shops, the lane is still narrow, and the books still run floor to ceiling in walls of paper that leave a gap wide enough for one person. There are old schoolbooks, Japanese novels, magazines from the seventies, old maps; many owners are the second or third generation. Nobody looks anything up on a computer — ask for a title and the owner thinks for a second, then pulls it straight out of the wall.",
    facts: [
      "It began in 1950, when Busan was the wartime provisional capital.",
      "Around 30 second-hand bookshops remain in the lane.",
      "Many shops are run by the second or third generation of the same family.",
      "It sits directly behind Gukje market and BIFF Square.",
    ],
    travelTips: [
      "A few shops carry second-hand foreign-language books; just ask the owner.",
      "Most close early and some shut on Sundays.",
      "Bring cash; many shops don't take cards.",
    ],
    bestTime: "Year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "09:00–21:00; closed the first and third Sunday of each month and over Seollal and Chuseok",
    galleryCaptions: ["Walls of books in the Bosu-dong lane"],
  },
  "songdo-cable-car": {
    name: "Songdo Beach & Marine Cable Car",
    summary: "Korea's first public bathing beach, now crossed by a glass-floored cable car straight over the bay.",
    story:
      "Songdo opened in 1913 as Korea's first public beach, then faded late in the 20th century as Haeundae took over. The city started again: sand was pumped back in, a curving boardwalk was pushed out over the water, and in 2017 a cable car a kilometre and a half long opened between the headlands on either side of the bay. The glass-floored cabin is worth the surcharge — you watch the swell run underneath your feet. At night the cable car lights and the bridge lights sit on the water, and the shellfish restaurants along the shore fill up.",
    facts: [
      "Opened in 1913 as Korea's first public bathing beach.",
      "The Songdo cable car runs about 1.6km and opened in 2017.",
      "Glass-floored cabins are available for a higher fare.",
      "The Songdo Cloud Trails boardwalk reaches out over the sea from the north shore.",
    ],
    travelTips: [
      "Pay extra for the glass-floored cabin; the difference is obvious.",
      "Ride at sunset, then eat at the seafood places along the shore.",
      "The cable car stops in high wind — check before setting out.",
    ],
    bestTime: "May–September for swimming, year-round for the cable car",
    visitDuration: "2–3 hours",
    ticket: "Cable car around 17,000 KRW return; the glass-floored Crystal cabin 22,000 KRW",
    openingHours: "Beach all day, cable car 09:00–22:00",
    galleryCaptions: ["The cable car crossing Songdo bay"],
  },
  "busan-cinema-center": {
    name: "Busan Cinema Center",
    summary: "An 85-metre unsupported cantilever roof covered in LEDs — home of the Busan film festival.",
    story:
      "The Busan Cinema Center has one detail that makes every engineer look up: an enormous roof cantilevering eighty-five metres with no column under its tip, its underside carrying tens of thousands of LEDs that run animations each night. Beneath it is an outdoor plaza seating more than four thousand, where the Busan International Film Festival — the largest in Asia — opens each October. Outside festival season it screens independent and classic films all year at low prices, and there are always skateboarders on the plaza.",
    facts: [
      "Opened in 2011, designed by the practice Coop Himmelb(l)au.",
      "The roof cantilevers about 85m with no column at its tip.",
      "Its underside carries more than 40,000 LEDs that play a show each evening.",
      "It is the main venue of the Busan International Film Festival each October.",
    ],
    travelTips: [
      "Arrive after 7pm for the roof light show.",
      "Tickets in the centre's own cinemas are cheaper than commercial chains.",
      "The area is very busy during the October festival.",
    ],
    bestTime: "October for the festival, year-round otherwise",
    visitDuration: "1–2 hours",
    ticket: "Plaza free",
    openingHours: "Plaza all day, cinemas by screening schedule",
    galleryCaptions: ["The LED roof at night"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  busan: {
    name: "Busan",
    summary: "Korea's biggest port city — beaches, fish markets, hillside villages and nightlife at the water's edge.",
    story:
      "Busan is stretched between mountains and sea, so the city is always climbing or descending. Morning at the Jagalchi fish auction, midday lost in the coloured lanes of Gamcheon, afternoon flat out on Haeundae, evening at Gwangalli watching the bridge change colour. People here speak with a heavy accent, eat spicier and saltier than Seoul, and are proud of dwaeji-gukbap — pork bone soup with rice, a dish born of the refugee years. Each October the city runs on the rhythm of the Busan International Film Festival.",
    bestTime: "May–June and September–October",
    specialties: ["Dwaeji-gukbap", "Milmyeon noodles", "Busan fish cakes", "Seed hotteok"],
  },
};
