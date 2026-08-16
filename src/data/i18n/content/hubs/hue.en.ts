// English translations for the Huế hub depth pass (tasks/038, wave 2).
// Covers regions/hubs/hue{Royal,Around}.ts. Arrays index-aligned with the Vietnamese source.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "tu-duc-tomb": {
    name: "Tomb of Tu Duc",
    summary: "The loveliest of the Nguyen tombs — a poet's garden the emperor used while still alive.",
    story:
      "Tu Duc had his tomb built while still on the throne and used it as a second palace: he came here to read, write poetry, fish on Luu Khiem lake and watch performances at the Minh Khiem theatre, the oldest surviving theatre in Vietnam. So the place has none of the cold grandeur of a mausoleum and feels instead like a garden: pines, a lotus lake, stone paths winding between nearly fifty structures. There is one bitter detail: the stele here was composed by the emperor himself, over four thousand characters long, and in it he sets out his own failings — and to this day nobody knows where he is actually buried.",
    facts: [
      "The tomb was built while Emperor Tu Duc was still reigning and served as a second palace.",
      "The grounds hold the Minh Khiem theatre, considered the oldest surviving theatre in Vietnam.",
      "The stone stele was composed by the emperor himself, runs over four thousand characters, and admits his own faults.",
      "The actual burial place of Emperor Tu Duc has never been identified.",
    ],
    travelTips: [
      "The grounds are large, with nearly fifty structures — allow at least an hour and a half.",
      "A combined ticket for three sites (the Citadel and two tombs) costs less than buying separately; ask at the counter.",
    ],
    bestTime: "January to April, in the morning",
    visitDuration: "1.5 hours",
    ticket: "150,000d (indicative; combined tickets available)",
    openingHours: "07:00 - 17:30",
    galleryCaptions: ["Luu Khiem lake and its pavilion", "The stele Emperor Tu Duc composed himself"],
  },
  "minh-mang-tomb": {
    name: "Tomb of Minh Mang",
    summary: "The most symmetrical of the Nguyen tombs — forty structures on a single straight axis.",
    story:
      "If Tu Duc's tomb is a garden, Minh Mang's is a drawing. Nearly forty structures sit on one straight axis over seven hundred metres long, perfectly symmetrical about it: gates, courtyards, the stele pavilion, halls, lakes, stone bridges, and finally the grave itself hidden behind a pine-planted hill. The emperor approved the design himself but died before the work was finished, and his successor built it out exactly to the drawing. The tomb stands at the fork where two branches of the Perfume River meet, so arriving by boat is the way it makes most sense.",
    facts: [
      "Nearly 40 structures are set symmetrically along one straight axis over 700m long.",
      "Emperor Minh Mang approved the design but died before the tomb was completed.",
      "His successor completed the work following the original drawings exactly.",
      "The tomb stands where two branches of the Perfume River meet.",
    ],
    travelTips: [
      "Arriving by boat along the Perfume River suits the spirit of the design.",
      "Stand at the main gate and look straight down the axis — that is where the symmetry reads clearest.",
    ],
    bestTime: "January to April, in the morning",
    visitDuration: "1.5 hours",
    ticket: "150,000d (indicative; combined tickets available)",
    openingHours: "07:00 - 17:30",
    galleryCaptions: ["The symmetrical main axis of the tomb", "A stone bridge over a lake in the grounds"],
  },
  "gia-long-tomb": {
    name: "Tomb of Gia Long",
    summary: "The founding emperor's tomb, wild among pine forest and almost without visitors.",
    story:
      "Gia Long founded the Nguyen dynasty, yet his is the emptiest tomb in the whole complex. The reason is distance: it lies furthest south, reached by ferry or a long detour, so tours skip it. In exchange, this is the one imperial tomb you can walk through without meeting anybody. The architecture is different too: few structures, little carving, the landscape left to speak — pine hills, mountains ringing the site, and two stone graves set side by side in the courtyard, the emperor's and the empress's. That is rare: every other Nguyen emperor lies alone.",
    facts: [
      "This is the tomb of Emperor Gia Long, founder of the Nguyen dynasty.",
      "It lies furthest south of all the imperial tombs around Hue.",
      "The emperor and empress lie side by side in one enclosure, unlike the other Nguyen tombs.",
      "The design relies on natural landscape, with pine hills and mountains ringing the site.",
    ],
    travelTips: [
      "The approach is long and poorly signed — use an offline map and allow extra time.",
      "This is the quietest of the tombs; choose it if you want to walk an imperial tomb alone.",
    ],
    bestTime: "January to April, on a dry day",
    visitDuration: "1.5 hours including the journey",
    ticket: "50,000d (indicative)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Two stone graves side by side in the courtyard", "Pine hills ringing the tomb"],
  },
  "an-dinh-palace": {
    name: "An Dinh Palace",
    summary: "Khai Dinh's European-style palace, its ceilings and walls covered in murals.",
    story:
      "An Dinh shows a different face of the late Nguyen court: instead of tiled roofs and courtyards, a three-storey European building with moulded columns, ceramic-inlay ornament and a spiral staircase. Khai Dinh built it as his private residence, and after his death Empress Nam Phuong and Emperor Bao Dai lived here for a time following the abdication. The best thing here is in the reception room on the first floor: six large murals depicting the six Nguyen imperial tombs, buried under whitewash for decades and only recovered during a recent restoration.",
    facts: [
      "The palace was built by Emperor Khai Dinh as his private residence, in European style.",
      "Empress Nam Phuong and Emperor Bao Dai lived here for a time after the abdication.",
      "The reception room holds six murals depicting the six imperial tombs of the Nguyen dynasty.",
      "The murals were covered in whitewash and only recovered during a recent restoration.",
    ],
    travelTips: [
      "The palace is inside the city, unlike the outlying tombs — easy to fit into an afternoon.",
      "Do not miss the six murals in the ground-floor reception room.",
    ],
    bestTime: "Year-round; afternoon light suits the reception room",
    visitDuration: "1 hour",
    ticket: "50,000d (indicative)",
    openingHours: "07:00 - 17:30",
    galleryCaptions: ["The European-style facade of An Dinh", "Murals in the reception room"],
  },
  "trang-tien-bridge": {
    name: "Truong Tien Bridge",
    summary: "Six spans and twelve sections of steel over the Perfume River, changing colour all night.",
    story:
      "Truong Tien has crossed the Perfume River since the end of the nineteenth century, built by Gustave Eiffel's firm, and the people of Hue count it in a set phrase: six spans, twelve sections. The bridge was brought down twice — once in 1946 and again during the Tet offensive of 1968 — and rebuilt both times to the same shape. By day it is an ordinary grey steel bridge; after dark, LED lighting washes the whole frame and cycles through colours, reflected in the water. Walking across it in the evening is something nearly every visitor to Hue does.",
    facts: [
      "The bridge was built at the end of the nineteenth century by the firm of Gustave Eiffel.",
      "People in Hue describe it with the set phrase 'six spans, twelve sections'.",
      "It was brought down in 1946 and again during the Tet offensive of 1968.",
      "In the evening LED lighting washes the whole steel frame and cycles through colours.",
    ],
    travelTips: [
      "Walk across after dark, once the lighting is on.",
      "Dong Ba market is at the northern end — do both in one outing.",
    ],
    bestTime: "Evening, year-round",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Truong Tien bridge changing colour over the river", "The six-span steel frame"],
  },
  "dong-ba-market": {
    name: "Dong Ba Market",
    summary: "Hue's largest market on the river bank, and a full circuit of everyday royal-city cooking.",
    story:
      "Dong Ba dates from the Nguyen period, stands at the northern end of Truong Tien bridge, and is a place to eat rather than to shop. The food section lays out all the Hue dishes you would otherwise chase across the city: bun bo, banh beo, banh nam, banh loc, banh khoai, lotus-seed sweet soup, com hen. Alongside are stalls of me xung candy, tom chua and Hue shrimp paste, and conical poem hats — thin palm hats with a picture and a line of verse pressed between the leaves, visible only when you hold them to the light. It is crowded, tight and quotes high; but it is the fastest way to understand what Hue eats.",
    facts: [
      "The market dates from the Nguyen dynasty and stands on the north bank of the Perfume River by Truong Tien bridge.",
      "Its food section concentrates most of the dishes characteristic of Hue.",
      "The market sells me xung candy, tom chua and Hue shrimp paste as regional gifts.",
      "The conical poem hats sold here hold a picture and a verse pressed between two layers of leaf.",
    ],
    travelTips: [
      "Ask prices before buying; the market quotes high to visitors.",
      "Go to the food section in the morning — many of the banh stalls sell out before noon.",
    ],
    bestTime: "Morning, year-round",
    visitDuration: "1 - 1.5 hours",
    ticket: "",
    openingHours: "06:00 - 19:00",
    galleryCaptions: ["The food section inside Dong Ba market", "Poem hats and me xung candy stalls"],
  },
  "quoc-hoc-hue": {
    name: "Quoc Hoc High School",
    summary: "A pink school on the Perfume River, open since 1896 and still teaching.",
    story:
      "Quoc Hoc opened in 1896, among the oldest secondary schools in Vietnam, and its alumni list reads almost as a cross-section of twentieth-century history: Ho Chi Minh, Ngo Dinh Diem, Vo Nguyen Giap, Pham Van Dong, To Huu — men who would later stand on opposing sides. The grounds keep their old form: deep pink walls, long arcaded corridors, flame trees, and an East Asian triple gate at the front facing the Perfume River. It is a working school, so visitors see only the front courtyard and should come outside teaching hours.",
    facts: [
      "The school opened in 1896 and is among the oldest secondary schools in Vietnam.",
      "Many figures of twentieth-century Vietnamese history studied here.",
      "The grounds keep their deep pink walls and arcaded corridors in colonial style.",
      "The main gate is an East Asian triple gate facing the Perfume River.",
    ],
    travelTips: [
      "This is a working school — visit only the front courtyard, and outside teaching hours.",
      "Pair it with An Dinh palace and the south bank for an afternoon on foot.",
    ],
    bestTime: "Late afternoon or weekends, outside teaching hours",
    visitDuration: "30 minutes",
    ticket: "",
    openingHours: "Outside teaching hours; front courtyard only",
    galleryCaptions: ["The triple gate and pink walls of the school", "Arcaded corridors in the grounds"],
  },
  "hon-chen-temple": {
    name: "Hon Chen Temple",
    summary: "A Mother Goddess temple against a cliff on the Perfume River, reachable only by boat.",
    story:
      "Hon Chen is pressed against the foot of Ngoc Tran mountain, facing straight onto the Perfume River, and there is no proper road to it — the only way is to hire a boat in the city and go upstream for about half an hour. It honours Thien Y A Na, a goddess of Cham origin absorbed by the Vietnamese as a Holy Mother, so the temple itself is a place where two cultures lie over one another. The architecture steps up the slope in tiers, curved roofs studded with ceramic. During the Mother Goddess festivals in the third and seventh lunar months, boats carrying pilgrims and spirit-medium rituals fill the whole reach of river.",
    facts: [
      "The temple sits against the foot of Ngoc Tran mountain, facing the Perfume River.",
      "It is normally reached by boat from central Hue, upstream along the river.",
      "It honours Thien Y A Na, a goddess of Cham origin absorbed by the Vietnamese as a Holy Mother.",
      "The Mother Goddess festivals fall in the third and seventh lunar months.",
    ],
    travelTips: [
      "Hire a boat at Toa Kham wharf and agree the price for the whole trip before setting off.",
      "Combine it in the same boat trip with Thien Mu pagoda downstream.",
    ],
    bestTime: "The Mother Goddess festivals in the third and seventh lunar months",
    visitDuration: "2 hours including the boat",
    ticket: "Entry and boat hire charged separately",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Hon Chen temple seen from the river", "Ceramic-studded curved roofs on the slope"],
  },
  "perfume-river": {
    name: "Perfume River",
    summary: "The river that splits Hue in two, and a floating stage for Hue song every evening.",
    story:
      "The Perfume River runs so slowly that in places it looks still, and the whole of Hue is arranged around it: the citadel on the north bank, the French quarter on the south, the imperial tombs strung along the upper reaches. The name, by the usual explanation, comes from the scent of plants carried down from upstream. The right way to experience it is in the evening: board a dragon boat, go out midstream, listen to a session of Hue song with zither, moon lute and old voices, then at the end float a paper lantern onto the water. By day this same river is the road to Thien Mu pagoda, Hon Chen temple and the tomb of Minh Mang.",
    facts: [
      "The river divides Hue into the north bank with the citadel and the south bank with the French quarter.",
      "By the usual explanation the name comes from the scent of plants carried down from upstream.",
      "Hue song performed on dragon boats is the musical form tied to this river.",
      "The river is the water route to Thien Mu pagoda, Hon Chen temple and the imperial tombs.",
    ],
    travelTips: [
      "Book a Hue song boat through your hotel or at Toa Kham wharf; agree the number of pieces and the length.",
      "By day use the river itself as the route to the tombs rather than going by road.",
    ],
    bestTime: "January to April; Hue song in the evening",
    visitDuration: "2 hours for a Hue song session",
    ticket: "Boat and performance priced by the trip, usually per boat",
    openingHours: "All day; Hue song performed in the evening",
    galleryCaptions: ["A dragon boat on the Perfume River at night", "Paper lanterns floated on the water"],
  },
  "thanh-toan-tile-bridge": {
    name: "Thanh Toan Bridge",
    summary: "An eighteenth-century tile-roofed wooden bridge among rice fields, paid for by a woman.",
    story:
      "Thanh Toan crosses a small canal in the middle of a village, only about eighteen metres long, roofed in tube tiles with wooden benches down both sides. It was built in the middle of the eighteenth century with money from Tran Thi Dao, a childless woman of the village who paid for it so people could cross and to earn merit; the emperor later issued an edict praising her. The form — a house above, a bridge below — survives in only a handful of examples in Vietnam. The bridge is about eight kilometres from central Hue, out among the rice fields, and late in the day villagers still sit on those wooden benches exactly as they did two centuries ago.",
    facts: [
      "The bridge was built in the mid-eighteenth century with money from Tran Thi Dao, a woman of the village.",
      "It is about 18m long, roofed in tube tiles, with wooden benches along both sides.",
      "It is built in the 'house above, bridge below' form, of which few examples survive in Vietnam.",
      "The bridge is about 8km from central Hue, among rice fields.",
    ],
    travelTips: [
      "Cycle out from Hue — the road is flat, through rice fields, about forty minutes.",
      "The country market beside the bridge only runs on certain occasions; ask first if you want to see it.",
    ],
    bestTime: "January to April, or the rice harvest",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Thanh Toan bridge among the rice fields", "Wooden benches along the bridge deck"],
  },
  "thuan-an-beach": {
    name: "Thuan An Beach",
    summary: "The beach nearest Hue, where the Tam Giang lagoon opens into the sea.",
    story:
      "Thuan An is Hue's sea mouth — where water from the Tam Giang lagoon runs out into the East Sea, and also the closest beach to the city, barely ten kilometres away. The sand here is coarser and the surf stronger than at other central beaches, so it feels less like a resort beach and more like a local one: in the afternoon people from Hue ride out to swim, eat seafood at shacks put up on the sand, and go home. Historically the Thuan An mouth was a key defensive point for the citadel, and it is where the French fleet landed in 1883 before the court had to sign a treaty.",
    facts: [
      "Thuan An is where the Tam Giang lagoon opens into the East Sea.",
      "It is the closest swimming beach to central Hue, just over 10km away.",
      "The river mouth was a key defensive point for the citadel of Hue.",
      "The French fleet landed at the Thuan An mouth in 1883.",
    ],
    travelTips: [
      "The surf here is stronger than at many central beaches — swim where lifeguards are on duty.",
      "Late afternoon is when locals come down, and when the seafood shacks are fullest.",
    ],
    bestTime: "April to August",
    visitDuration: "2 - 3 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The Thuan An mouth opening to the sea", "Seafood shacks on the sand"],
  },
  "tam-giang-lagoon": {
    name: "Tam Giang Lagoon",
    summary: "South-East Asia's largest lagoon, sunset seen through a forest of fishing stakes.",
    story:
      "Tam Giang is the largest lagoon system in South-East Asia, running nearly seventy kilometres along the coast of Thua Thien Hue, and it is neither sea nor lake: brackish, shallow, glassy, and planted thick with bamboo stakes strung with nets that locals call no sao. That forest of stakes makes the lagoon's famous sunset — the sun going down behind thousands of poles reflected on water flat as a mirror. People live off the lagoon by fishing and aquaculture; go out by boat late in the day and you will pass them emptying the nets, and eat that evening from the catch just lifted.",
    facts: [
      "This is the largest brackish lagoon system in South-East Asia, nearly 70km long.",
      "The lagoon is planted thick with bamboo stakes strung with nets, called no sao locally.",
      "People around the lagoon live by fishing and aquaculture.",
      "The lagoon opens to the East Sea through the Thuan An mouth.",
    ],
    travelTips: [
      "Take a boat out about an hour before sunset — that is the entire reason to come.",
      "Book at the Quang Loi or Ngu My Thanh landings and agree a price for the whole trip.",
    ],
    bestTime: "March to August, at sunset",
    visitDuration: "Half a day",
    ticket: "Boat hire priced by the trip",
    openingHours: "All day; best late in the afternoon",
    galleryCaptions: ["Sunset behind the forest of fishing stakes", "A boat emptying nets on the lagoon"],
  },
  "ru-cha-mangrove": {
    name: "Ru Cha Mangrove",
    summary: "The only remaining primary mangrove on the Tam Giang lagoon, turning gold in autumn.",
    story:
      "Ru Cha is the only patch of primary mangrove left on the whole Tam Giang lagoon system, only a few dozen hectares. The cha trees grow dense, their roots netted under the mud, and a narrow concrete path runs through the middle of the forest out to a watch hut at the lagoon's edge. What gets it talked about is colour: from around September to November the leaves turn gold and then copper red all at once, the whole wood changing over a few weeks before going green again. Outside that season Ru Cha is a quiet place with almost nobody in it, about fifteen kilometres from Hue.",
    facts: [
      "This is the only patch of primary mangrove left on the Tam Giang lagoon.",
      "The forest covers only a few dozen hectares, with a concrete path running through the middle.",
      "The cha leaves turn gold and red between about September and November.",
      "Ru Cha is about 15km from central Hue.",
    ],
    travelTips: [
      "Come between September and November for the colour change; outside that the forest is simply green.",
      "Bring insect repellent — mosquitoes in the mangrove are heavy.",
    ],
    bestTime: "September to November, when the leaves turn",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "All day; go in daylight",
    galleryCaptions: ["Cha leaves turning gold in autumn", "The path running through the mangrove"],
  },
  "lang-co-beach": {
    name: "Lang Co Beach",
    summary: "A curved sand spit between a brackish lagoon and the sea, at the foot of Hai Van pass.",
    story:
      "Lang Co lies exactly where the Bach Ma range comes down to the sea, wedged between Lap An lagoon on one side and the East Sea on the other, forming a ten-kilometre curve of sand only a few hundred metres wide. From up on Hai Van pass the whole bay appears at once — and it is that view that got Lang Co onto lists of the world's beautiful bays. Lap An lagoon behind is known for oysters grown on racks of stakes, and the stalls along it grill them with spring onion oil on the spot. Lang Co sits between Hue and Da Nang, which makes it the sensible stop when travelling between the two.",
    facts: [
      "The beach is a sand spit about 10km long, between Lap An lagoon and the East Sea.",
      "Lang Co lies at the foot of Hai Van pass, between Hue and Da Nang.",
      "Lang Co bay has been included in listings of the world's beautiful bays.",
      "Lap An lagoon behind the beach is known for oysters farmed on racks of stakes.",
    ],
    travelTips: [
      "Stop at the top of Hai Van pass for the whole bay before descending to the beach.",
      "Eat the grilled oysters at the stalls along Lap An lagoon, not on the beach side.",
    ],
    bestTime: "April to August",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Lang Co bay seen from Hai Van pass", "Oyster racks on Lap An lagoon"],
  },
  "bach-ma-national-park": {
    name: "Bach Ma National Park",
    summary: "A French hill station at 1,450m, now primary forest with the Do Quyen waterfall.",
    story:
      "The French established the Bach Ma hill station in the 1930s and put up a hundred villas on a summit of nearly 1,450 metres, where the temperature runs a good ten degrees below the plain. The war erased almost all of it; what remains are mossy foundations scattered through the forest, and that is precisely what gives Bach Ma its atmosphere. This is among the wettest places in Vietnam, so the forest is exceptionally dense and varied. Two routes are worth doing: Hai Vong Dai at the summit looking down over Lang Co bay, and the descent to the Do Quyen waterfall, over three hundred metres high, down thousands of steps.",
    facts: [
      "The French established a hill station here in the 1930s, on a summit of nearly 1,450m.",
      "Foundations of the old French villas are still scattered through the forest.",
      "This is among the highest-rainfall areas in Vietnam.",
      "The Do Quyen waterfall within the park is over 300m high.",
    ],
    travelTips: [
      "Private vehicles cannot go to the summit — you must use the park's shuttle.",
      "Bring a rain jacket even in the dry season; Bach Ma gets sudden rain all year.",
    ],
    bestTime: "March to August, the least wet season",
    visitDuration: "Full day",
    ticket: "Park entry and shuttle charged separately",
    openingHours: "07:00 - 16:00",
    galleryCaptions: ["Hai Vong Dai at the Bach Ma summit", "The Do Quyen waterfall through the forest"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
