// English translations for the TP.HCM hub depth pass (tasks/038, wave 2).
// Covers regions/hubs/hcm{Center,Outer}.ts. Arrays index-aligned with the Vietnamese source.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "notre-dame-saigon": {
    name: "Saigon Notre-Dame Basilica",
    summary: "A red-brick cathedral with twin bell towers downtown, its bricks shipped in from Marseille.",
    story:
      "The French built this at the end of the nineteenth century and used not a single local brick: all of the red brick came from Marseille, unrendered, and it still holds its colour with almost no moss on it. The two pointed bell towers, over sixty metres, were the tallest thing in Saigon for decades. In front stands a statue of Our Lady of Peace carved from Italian granite, facing down the boulevard. The building is in the middle of a restoration running for years, so most of the time you will find it inside scaffolding — check before making a trip for photographs.",
    facts: [
      "The cathedral was built at the end of the nineteenth century under French rule.",
      "All of its red brick was shipped from Marseille and left unrendered.",
      "The two bell towers stand over 60m and were once the tallest structures in Saigon.",
      "The statue of Our Lady of Peace in front is carved from Italian granite.",
    ],
    travelTips: [
      "The cathedral is under a long restoration — check the scaffolding situation before coming to photograph it.",
      "The Central Post Office is right next door; do both in one stop.",
    ],
    bestTime: "Early morning, before the heat and the crowds",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "Outside service times; the schedule is posted at the gate",
  },
  "saigon-central-post-office": {
    name: "Saigon Central Post Office",
    summary: "A French-era post office with a steel vault, hand-painted maps, and still open for business.",
    story:
      "This is a real post office — it still takes letters and sells stamps — not a museum. But stepping inside is hard to believe: a curved steel vault runs the length of the hall in the manner of a late nineteenth-century European railway station, patterned tiles underfoot, wooden telephone booths down each side, and on the wall two hand-painted maps from 1892 — one of the telegraph lines of Cochinchina, one of Saigon and its surroundings. For years an elderly letter-writer worked from a corner of the hall, composing letters for customers in French and English.",
    facts: [
      "The building dates from the end of the nineteenth century and is still a working post office.",
      "The main hall has a curved steel vault in the manner of European stations of the same period.",
      "Two hand-painted maps from 1892 hang on the wall, showing telegraph lines and old Saigon.",
      "It stands next to Notre-Dame Cathedral on the same square.",
    ],
    travelTips: [
      "You can still post a real postcard from here — buy stamps at the counter in the hall.",
      "Come early; from mid-morning tour groups fill the main hall.",
    ],
    bestTime: "Early on a weekday morning",
    visitDuration: "30 minutes",
    ticket: "",
    openingHours: "07:00 - 19:00",
  },
  "saigon-opera-house": {
    name: "Saigon Opera House",
    summary: "A Belle Époque opera house at the head of Dong Khoi street, two goddesses carved into the facade.",
    story:
      "The opera house opened in 1900, built in the Belle Époque style then fashionable in France: a curved facade, tall arched doors, and two carved goddesses holding up the entablature above the entrance. Over a century it has been in turn a theatre, the seat of the Lower House under the Republic of Vietnam, and a theatre again. Today it stages À Ố Show — bamboo circus crossed with contemporary dance, drawn from village life in the southern delta, and the easiest show to follow for anyone without Vietnamese. It is closed by day, so the lit facade in the evening is what there is to see.",
    facts: [
      "The opera house opened in 1900 in the French Belle Époque style.",
      "Two carved goddesses hold up the entablature above the main entrance.",
      "The building served as the seat of the Lower House under the Republic of Vietnam.",
      "It regularly stages contemporary bamboo circus productions.",
    ],
    travelTips: [
      "Buy a ticket to a performance if you want to see inside — there are no daytime tours.",
      "The bamboo circus shows are wordless, so they work for visitors without Vietnamese.",
    ],
    bestTime: "Evening, when the facade is lit",
    visitDuration: "30 - 45 minutes",
    ticket: "Ticket prices depend on the performance",
    openingHours: "According to the published performance schedule",
  },
  "nguyen-hue-walking-street": {
    name: "Nguyen Hue Walking Street",
    summary: "A seven-hundred-metre paved boulevard — the city's outdoor living room.",
    story:
      "Nguyen Hue was once a canal, filled in to make a boulevard, then paved and closed to traffic in 2015. The result is seven hundred metres of open ground running from the City Hall down to the river — and all of Saigon uses it as a shared yard. In the evening teenagers skateboard, children run toy cars, dance crews rehearse in front of the glass frontages, balloon sellers work the crowd. At Tet the whole street becomes a flower avenue. Standing at the top and looking down, French-era buildings alternate with glass towers — nowhere else are the two layers of Saigon as visible at once.",
    facts: [
      "The boulevard was originally a canal, later filled in to make a street.",
      "It was paved and turned into a pedestrian street in 2015.",
      "It runs about 700m from the City Hall down to the Saigon river.",
      "At Lunar New Year the whole street is decorated as the Nguyen Hue flower avenue.",
    ],
    travelTips: [
      "Come from dusk onward — by day the paving throws back the heat and there is almost no shade.",
      "The café apartment at 42 Nguyen Hue is right off the street: one old block with dozens of cafés stacked up its floors.",
    ],
    bestTime: "Early evening; busiest and best at Tet",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "All day; closed to traffic at weekends during posted hours",
  },
  "bach-dang-wharf": {
    name: "Bach Dang Wharf",
    summary: "A riverside park at the foot of the walking street, facing Landmark 81 and Thu Thiem.",
    story:
      "Bach Dang is where Nguyen Hue boulevard meets the Saigon river. After redevelopment the whole bank became a walking park with steps down to the water's edge, and it immediately became where the city goes to catch the breeze in the evening. Across the river is the Thu Thiem peninsula with its new towers, and off to the right Landmark 81 stands alone, far above everything else. The wharf is also where the river buses and dinner boats dock, so if you want to see the city from the water this is the departure point.",
    facts: [
      "The wharf is where Nguyen Hue boulevard meets the Saigon river.",
      "The bank was redeveloped into a riverside park with steps down to the water.",
      "From here you look straight across to Thu Thiem peninsula and Landmark 81.",
      "River buses and restaurant boats dock here.",
    ],
    travelTips: [
      "The river bus leaves from here and costs far less than a tourist cruise.",
      "Evenings are breezy but also the busiest; come early morning for quiet.",
    ],
    bestTime: "Early evening, when the far bank lights up",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
  },
  "bitexco-tower": {
    name: "Bitexco Financial Tower",
    summary: "A lotus-bud tower with a helipad jutting out of its side, observation deck on floor 49.",
    story:
      "Bitexco was Vietnam's tallest building when it was completed in 2010, and although Landmark 81 has passed it, it remains the most recognisable shape on the District 1 skyline — a shaft curved like a lotus bud, with a helipad on the 52nd floor sticking straight out like a saucer. The Saigon Skydeck observation level is on floor 49, glazed all the way round. Bitexco's advantage over Landmark 81 is its position: it stands in the middle of District 1, so you look down on old rooftops, the river and Nguyen Hue directly beneath you, rather than at the city from a distance.",
    facts: [
      "The tower was completed in 2010 and was then the tallest building in Vietnam.",
      "It is designed in the shape of a lotus bud, with a helipad projecting from the 52nd floor.",
      "The Saigon Skydeck observation level is on the 49th floor, glazed on all sides.",
      "It stands in central District 1, near Bach Dang wharf and Nguyen Hue.",
    ],
    travelTips: [
      "Several high-floor cafés in the building give a comparable view without the observation-deck ticket.",
      "Go up before sunset to see the city both in daylight and lit.",
    ],
    bestTime: "Late afternoon on a clear day",
    visitDuration: "1 hour",
    ticket: "About 240,000d for the observation deck (indicative)",
    openingHours: "09:30 - 21:30",
  },
  "war-remnants-museum": {
    name: "War Remnants Museum",
    summary: "The Vietnam War told through documentary photography — heavy, direct and hard to forget.",
    story:
      "Many international visitors rank this among the most worthwhile places in Vietnam, and it is also the one that leaves people silent longest. The yard outside displays captured aircraft, tanks, helicopters and ordnance. But the weight is in the photographic rooms upstairs: the room on the consequences of Agent Orange, and the Requiem room of work by photojournalists killed covering the war on both sides. The presentation takes a clear side and does not hide it, but most of what is on the walls is documentary photography taken by Western correspondents. Not suitable for young children.",
    facts: [
      "The museum displays objects and documentary photography from the Vietnam War.",
      "The outdoor yard holds captured aircraft, tanks, helicopters and ordnance.",
      "The Requiem room gathers work by photojournalists killed during the war on both sides.",
      "A separate section covers the consequences of Agent Orange.",
    ],
    travelTips: [
      "The material is heavy, especially the Agent Orange section — think carefully about bringing young children.",
      "Allow at least two hours; rushing it means understanding almost nothing.",
    ],
    bestTime: "Year-round; mornings are quieter",
    visitDuration: "2 hours",
    ticket: "40,000d (indicative — check at the counter)",
    openingHours: "07:30 - 17:30",
  },
  "tao-dan-park": {
    name: "Tao Dan Park",
    summary: "A large green space in District 1, with a corner given over to bird keepers at dawn.",
    story:
      "Tao Dan is District 1's lung: old broad-crowned trees, shaded paths, and a replica Cham temple complex set among the gardens. But the thing worth waking for is the bird café in one corner — from about five in the morning, bird keepers arrive and hang their cages across the frames, then sit over filter coffee listening to the birds compete. At the same hour the rest of the park fills with groups doing exercises, playing shuttlecock, practising tai chi. By seven it has all dissolved and Tao Dan goes back to being an ordinary park.",
    facts: [
      "The park is the largest green space in central District 1.",
      "A replica of Cham temple architecture stands among the gardens.",
      "The bird café corner operates from about 5am, when keepers arrive and hang their cages.",
      "In the early morning the park fills with exercise, shuttlecock and tai chi groups.",
    ],
    travelTips: [
      "Arrive before 6am if you want the bird café at its fullest.",
      "The park is beside the Independence Palace — pair the two in one morning.",
    ],
    bestTime: "Early morning, year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
  },
  "fine-arts-museum-hcm": {
    name: "Ho Chi Minh City Museum of Fine Arts",
    summary: "A Chinese merchant's yellow mansion, now a museum — and home to Saigon's oldest lift.",
    story:
      "The building was the residence of the family of Hui Bon Hoa, among the wealthiest Chinese merchants in early twentieth-century Saigon and known to everyone as Uncle Hoa. The architecture is French with East Asian detail: patterned tiles, stained glass, wrought-iron balconies, and a light well bringing daylight down through all three floors. Inside is a wooden lift considered the first in Saigon. The collection runs from Oc Eo and Champa sculpture to lacquer, silk painting and wartime sketches. Even with no interest in fine art, the building alone justifies going in.",
    facts: [
      "The building was the residence of the family of merchant Hui Bon Hoa, known as Uncle Hoa.",
      "Its architecture mixes French and East Asian elements, with a light well serving all three floors.",
      "Inside is a wooden lift considered the first installed in Saigon.",
      "The collection runs from Oc Eo and Champa sculpture to lacquer work and wartime sketches.",
    ],
    travelTips: [
      "Walk all three buildings in the grounds — many visitors see only the first and leave.",
      "The light well and staircase are the best photographs, best lit mid-morning.",
    ],
    bestTime: "Mid-morning, when the light well catches the sun",
    visitDuration: "1.5 hours",
    ticket: "30,000d (indicative)",
    openingHours: "08:00 - 17:00",
  },
  "bui-vien-street": {
    name: "Bui Vien Street",
    summary: "Saigon's backpacker street — speakers at full volume, chairs into the road, open until dawn.",
    story:
      "Bui Vien has been where backpackers land in Saigon since the 1990s, and it has never calmed down. At weekends the whole street closes to traffic and becomes a pedestrian zone: bars packed shoulder to shoulder, each with its speakers aimed straight out into the road, plastic chairs set right down the middle, balloon sellers and sunglasses hawkers working the crowd. This is not a street for conversation — the volume makes you shout. But if you want to understand why Saigon is called the city that does not sleep, you have to walk through it once, and before midnight is enough.",
    facts: [
      "The street is in District 1 and has been Saigon's backpacker quarter since the 1990s.",
      "At weekends the entire street closes to traffic and becomes a pedestrian zone.",
      "Bars line both sides with loud music and tables set out into the roadway.",
      "The street runs until dawn, later than almost anywhere else in the city.",
    ],
    travelTips: [
      "It is very loud — if you want to talk, sit at the De Tham end of the street.",
      "Watch your belongings and confirm drink prices yourself; billing disputes are common here.",
    ],
    bestTime: "Weekend evenings, when the street is closed to traffic",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "About 18:00 until dawn",
  },
  "landmark-81": {
    name: "Landmark 81",
    summary: "Vietnam's tallest building, eighty-one floors bound together like a sheaf of bamboo.",
    story:
      "Landmark 81 rises over four hundred and sixty metres and leaves everything else on the Saigon skyline far behind — from anywhere in the city, including Thu Duc or across the river, you can see it. The design takes its idea from a bundle of bamboo: blocks of uneven height bound tightly together and shooting upward, so in profile the building is not a box but a sheaf. The observation deck occupies three floors at the top and includes an open-air terrace, which Bitexco does not have. From up here the Saigon river curves away like a strip of silver, and at night the city spreads out with no visible edge.",
    facts: [
      "The building rises over 460m across 81 floors and is the tallest in Vietnam.",
      "Its design takes its idea from a bundle of bamboo bound together.",
      "The observation deck occupies three floors at the top and includes an open-air area.",
      "The tower stands in Binh Thanh district on the bank of the Saigon river.",
    ],
    travelTips: [
      "Go up about 45 minutes before sunset for the city in daylight and lit.",
      "Cafés on the building's high floors cost less than the observation ticket for a near-identical view.",
    ],
    bestTime: "Late afternoon on a clear day",
    visitDuration: "1 - 1.5 hours",
    ticket: "About 300,000d for the observation deck (indicative)",
    openingHours: "08:30 - 23:00",
  },
  "jade-emperor-pagoda": {
    name: "Jade Emperor Pagoda",
    summary: "A Chinese temple thick with incense smoke, full of carved wooden figures and a turtle pond.",
    story:
      "The temple was built by the Chinese community in the early twentieth century to honour the Jade Emperor, and inside it is dark, cramped and so thick with incense smoke that your eyes sting. The main hall is packed with gilded carved wooden figures, and a side chamber holds the Hall of the Ten Kings of Hell, with wooden reliefs depicting the levels of the underworld in unnerving detail. Many people come to pray for children, and the chamber of Kim Hoa Thanh Mau is always the busiest. Out front is a turtle pond, the shells carved with the names of those who released them. This is a temple where the atmosphere matters more than the architecture.",
    facts: [
      "The temple was built by the Chinese community in the early twentieth century, dedicated to the Jade Emperor.",
      "The main hall holds many gilded carved wooden figures.",
      "The Hall of the Ten Kings of Hell has wooden reliefs depicting the levels of the underworld.",
      "A turtle pond in front of the temple is tied to the practice of releasing animals for merit.",
    ],
    travelTips: [
      "The incense smoke is very thick — think twice if you have asthma or are sensitive to smoke.",
      "Do not buy turtles to release here; the practice harms the pond's own population.",
    ],
    bestTime: "Morning; busiest on the full moon and first of the lunar month",
    visitDuration: "45 minutes",
    ticket: "",
    openingHours: "07:00 - 18:00",
  },
  "saigon-zoo": {
    name: "Saigon Zoo and Botanical Gardens",
    summary: "A zoo and botanical garden open since 1864 — among the oldest still running anywhere.",
    story:
      "The gardens opened in 1864, only a few years after the French arrived in Saigon, which puts them among the oldest continuously operating zoos in the world. The name is accurate: this is both a zoo and a botanical garden, and it is the botanical half that most people walk past — rows of century-old trees, trunks several arm-spans around, shading the paths completely. The grounds also hold the Museum of Vietnamese History and a temple to the Hung Kings. For families with young children this is the easiest place in District 1 to give a whole morning to.",
    facts: [
      "The gardens opened in 1864 and are among the oldest continuously operating zoos in the world.",
      "The site is both a zoo and a botanical garden, with many trees over a century old.",
      "The Museum of Vietnamese History stands within the grounds.",
      "A temple to the Hung Kings is also inside the grounds.",
    ],
    travelTips: [
      "The History Museum charges separately but sits right by the gate, so it pairs easily.",
      "Go in the morning: afternoons are hot and most animals move into the shade to rest.",
    ],
    bestTime: "Morning, year-round",
    visitDuration: "2 - 3 hours",
    ticket: "60,000d (indicative — check at the counter)",
    openingHours: "07:00 - 18:00",
  },
  "binh-tay-market": {
    name: "Binh Tay Market",
    summary: "Cho Lon's wholesale market, Chinese tiled roofs around a courtyard with a clock tower.",
    story:
      "Binh Tay is the largest market in Cho Lon and a genuine wholesale operation — goods from here go all over southern Vietnam and across into Cambodia. A Chinese merchant paid to build it in the 1920s, and the architecture is unusual: curved yin-yang Chinese roof tiles set on a French concrete frame, four ranges enclosing a courtyard with a clock tower and a statue of the founder. Walking the market means walking between bales stacked over head height, through the smell of Chinese medicine, dried shrimp and sandalwood incense. Very few visitors buy anything here, but that is not the reason to come.",
    facts: [
      "The market was funded and built by a Chinese merchant in the 1920s.",
      "Its architecture combines Chinese yin-yang roof tiles with a French concrete frame.",
      "Four ranges enclose a courtyard with a clock tower.",
      "It is a wholesale market, supplying southern Vietnam and Cambodia.",
    ],
    travelTips: [
      "This is a wholesale market — come to look and photograph, not for retail bargains.",
      "Go before 10am, when stock is arriving and the market is at its most active.",
    ],
    bestTime: "Early morning, year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "06:00 - 19:00",
  },
  "cho-lon-district": {
    name: "Cho Lon",
    summary: "Vietnam's largest Chinatown — assembly halls, herbal medicine shops and Chinese shop signs.",
    story:
      "Cho Lon was once a separate city, only absorbed into Saigon in 1931, and it still keeps its own rhythm. Walking here means passing rows of low buildings with Chinese shop signs, herbal medicine shops with doors thrown open letting the smell of cinnamon and star anise onto the pavement, gold shops, incense workshops, and the assembly halls of the Chinese congregations tucked between them. Mornings bring hu tieu noodles and sock-filtered coffee; in the afternoon the small alleys open into a world entirely unlike District 1 a few kilometres away. This is a quarter to wander without an itinerary.",
    facts: [
      "Cho Lon was a separate city until it was merged into Saigon in 1931.",
      "It is the largest Chinatown in Vietnam.",
      "The area holds many Chinese congregation halls, herbal medicine shops and incense workshops.",
      "Hu tieu noodles and sock-filtered coffee are tied to the quarter's breakfast habits.",
    ],
    travelTips: [
      "Walk or cycle — the small alleys are the best part and cars cannot get in.",
      "Combine Cho Lon with Binh Tay market and Giac Lam pagoda in one outing.",
    ],
    bestTime: "Morning; at its most vivid at the Lantern Festival",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "All day",
  },
  "giac-lam-pagoda": {
    name: "Giac Lam Pagoda",
    summary: "Saigon's oldest pagoda, founded 1744, with over a hundred wooden statues and porcelain-studded walls.",
    story:
      "Giac Lam was founded in 1744, before Saigon was a city at all, and is the oldest pagoda here. The atmosphere is nothing like the busy Chinese temples of Cho Lon: a wide courtyard, a large bodhi tree, and a row of stupas holding former abbots. The main hall keeps over a hundred wooden statues, most carved in the eighteenth and nineteenth centuries, alongside dozens of gilded boards and couplets. The oddest feature is that the outer faces of the stupas and the walls are studded all over with porcelain plates and coloured ceramic shards — a southern folk decoration rarely seen elsewhere.",
    facts: [
      "The pagoda was founded in 1744 and is the oldest in Ho Chi Minh City.",
      "The main hall holds over a hundred wooden statues, mostly from the eighteenth and nineteenth centuries.",
      "The outer faces of the stupas and walls are studded with porcelain plates and coloured ceramic shards.",
      "A row of stupas in the grounds holds generations of former abbots.",
    ],
    travelTips: [
      "The pagoda is well out of the centre; pair it with Cho Lon and Binh Tay market.",
      "Go in the morning to avoid the sun on the open courtyard and to photograph the ceramic work.",
    ],
    bestTime: "Morning, year-round",
    visitDuration: "45 minutes - 1 hour",
    ticket: "",
    openingHours: "07:00 - 17:00",
  },
  "can-gio-mangrove": {
    name: "Can Gio Mangrove Forest",
    summary: "A world biosphere reserve inside the city limits — a forest replanted from dead ground.",
    story:
      "During the war the Rung Sac forest at Can Gio was sprayed with defoliant until almost nothing was left. From 1978 onward it was replanted, one stand of mangrove at a time, and today it is Vietnam's first UNESCO-recognised world biosphere reserve — a large mangrove forest brought back entirely by hand. Taking a boat through the channels you pass mangrove roots braced across the mud, long-tailed macaques used to people at Vam Sat, and a reconstruction of the wartime Rung Sac base set among the trees. Can Gio is about fifty kilometres from the centre and requires a ferry crossing.",
    facts: [
      "The forest was sprayed with defoliant during the war and replanted from 1978 onward.",
      "It is Vietnam's first UNESCO-recognised world biosphere reserve.",
      "The Vam Sat area holds a semi-wild population of long-tailed macaques.",
      "A reconstruction of the wartime Rung Sac base stands within the forest.",
    ],
    travelTips: [
      "You must cross on the Binh Khanh ferry; allow extra time, as weekend queues are long.",
      "Hold on to bags and food at Vam Sat — the macaques there are bold and snatch things.",
    ],
    bestTime: "December to April, the dry season",
    visitDuration: "Full day",
    ticket: "Entry and boat fares charged separately, depending on route",
    openingHours: "07:00 - 17:00",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
