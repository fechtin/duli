import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "hwaseong-fortress": {
    name: "Suwon Hwaseong Fortress",
    summary: "Nearly six kilometres of stone wall built by King Jeongjo out of filial duty — and a wish to move the capital.",
    story:
      "In the late 18th century King Jeongjo moved his wronged father's tomb to Suwon and built a new kind of fortress around it. Hwaseong was unlike the old walls: the engineer Jeong Yak-yong used homemade pulleys and cranes, combined stone with fired brick, and borrowed technique from both Europe and China. Walking the full circuit takes about two hours, past four great gates, watchtowers, artillery bastions and a seven-arch bridge over a stream. The strange part is that this fortress never had to withstand a siege.",
    facts: [
      "Inscribed as a UNESCO World Heritage Site in 1997.",
      "Built in only two and a half years (1794–1796), remarkably fast for its scale.",
      "The wall runs about 5.7 km with 48 defensive structures.",
      "The construction record 'Hwaseong Seongyeok Uigwe' survives intact, making restoration unusually accurate.",
    ],
    travelTips: [
      "Take Line 1 to Suwon station, then a bus to Paldalmun gate.",
      "Walk anticlockwise from Paldalmun to climb first and descend later.",
      "A tourist trolley circles the fortress if you'd rather not walk.",
    ],
    bestTime: "April–May and September–November",
    visitDuration: "3 hours",
    ticket: "1,000 KRW (4-site combined ticket 3,500 KRW); walking the wall itself is free",
    openingHours: "09:00–18:00",
    galleryCaptions: ["Paldalmun gate and the fortress wall"],
  },
  "korean-folk-village": {
    name: "Korean Folk Village",
    summary: "A Joseon village rebuilt in full at Yongin, where blacksmiths, scholars and tightrope walkers still work every day.",
    story:
      "More than 260 buildings were moved here or rebuilt in the styles of each region: thick-thatched southern cottages, officials' houses with inner courtyards, ox sheds, mills and a village well. What makes the place live, though, is the people: a potter at his wheel, a taffy-puller telling stories, and several times a day a jultagi tightrope walk with a nongak farmers' band drumming its way around the yard. Many Korean historical dramas are filmed here, so the scenery will feel oddly familiar.",
    facts: [
      "Opened in 1974 and covering about 100 hectares.",
      "More than 260 structures reproduce regional folk architecture.",
      "A filming location for a great many Korean historical dramas.",
      "Nongak, jultagi and traditional wedding performances run on a fixed daily schedule.",
    ],
    travelTips: [
      "Check the performance schedule at the gate and plan your route around it.",
      "A free shuttle bus runs from Suwon station.",
      "The village is large — allow half a day and wear walking shoes.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "Half a day",
    ticket: "32,000 KRW (26,000 children, 22,000 over-65s); includes the amusement village",
    openingHours: "10:00–18:00",
    galleryCaptions: ["Thatched houses in the folk village"],
  },
  namhansanseong: {
    name: "Namhansanseong Fortress",
    summary: "A mountain fortress that served as Joseon's emergency capital, now the favourite hiking wall of Seoul.",
    story:
      "Namhansanseong was raised on the ridges southeast of Seoul as a refuge for the court should the capital fall. In the winter of 1636 King Injo and his ministers held out here for 47 days against the Qing army before surrendering — one of the bitterest chapters in Joseon history. Today the wall follows the crest as a long trail through pine forest; the full circuit takes about four hours. At the foot of the mountain waits a row of restaurants specialising in tofu and mushroom rice, the familiar reward after the climb.",
    facts: [
      "Inscribed as a UNESCO World Heritage Site in 2014.",
      "The wall runs about 12 km along the mountain ridges.",
      "Served as the temporary capital during the 1636 Qing invasion.",
      "Inside Namhansanseong Provincial Park, about an hour from central Seoul.",
    ],
    travelTips: [
      "Line 8 to Sanseong station, then bus 9 up to the gate.",
      "Walk the South Gate to East Gate stretch if you only have half a day.",
      "Autumn colour is superb but weekends are very crowded.",
    ],
    bestTime: "October–November (autumn leaves)",
    visitDuration: "3–4 hours",
    ticket: "The fortress has been free since 2007; the royal lodge charges 2,000 KRW (1,000 teens), free for under-6s, over-65s and visitors in hanbok",
    openingHours: "The fortress is open all day; the royal lodge runs 10:00–18:00 (April–October) and 10:00–17:00 (November–March), closed Mondays",
    galleryCaptions: ["The wall following the mountain ridge"],
  },
  "imjingak-dmz": {
    name: "Imjingak & the DMZ",
    summary: "The last point civilians can reach before the line that splits the peninsula, less than an hour from Seoul.",
    story:
      "At Imjingak the railway simply stops: a bullet-riddled steam locomotive sits on a severed track, and behind it the Freedom Bridge crosses the Imjin River, where prisoners of war came home in 1953. The barbed wire is covered with ribbons and handwritten letters from separated families, and many come here at Lunar New Year to bow towards home in the north. From the observatory, binoculars point straight across. The paradox is that seven decades of empty buffer zone have made an accidental nature reserve, where red-crowned cranes winter.",
    facts: [
      "About 7 km from the military demarcation line; civilians need no permit.",
      "Some 12,773 prisoners of war returned across the Freedom Bridge in 1953.",
      "The Demilitarized Zone is about 4 km wide and 250 km long across the peninsula.",
      "Tours into the JSA or the Third Tunnel must be booked in advance with a passport.",
    ],
    travelTips: [
      "Carry your passport — it is required for every tour that goes deeper into the DMZ.",
      "Book a few days ahead; schedules can be cancelled at short notice for security reasons.",
      "There are dress and photography rules in some areas — listen to your guide.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "Half a day",
    ticket: "Free at Imjingak (DMZ tours priced separately)",
    openingHours: "Pyeonghwa-Nuri park is open all day and free to enter; DMZ tours and the sites inside the controlled zone must be booked in advance and run to fixed departure times",
    galleryCaptions: ["The Freedom Bridge over the Imjin River"],
  },
  everland: {
    name: "Everland",
    summary:
      "Korea's largest theme park, with the steepest wooden roller coaster in the world and a flower garden that changes face four times a year.",
    story:
      "Everland is not just an amusement park — it is how Koreans measure the season. In April tulips cover the hillside, in June roses, in autumn chrysanthemums and silver grass, and in winter the whole park is strung with lights. The ride everyone talks about is T Express, a wooden-framed coaster with a 77-degree drop so near vertical that you leave your seat for a beat. Beside it is Zootopia, with a bus tour that runs among lions and bears and a white tiger enclosure. Weekends are packed, but the park is big enough to absorb it.",
    facts: [
      "Opened in 1976 and is Korea's largest theme park.",
      "T Express had the steepest drop of any wooden coaster in the world when it opened, at 77 degrees.",
      "The flower garden is replanted by season: tulips, roses, chrysanthemums, winter lights.",
      "Zootopia includes a bus safari through the predator enclosure and a white tiger area.",
    ],
    travelTips: [
      "Book online ahead — noticeably cheaper than the gate.",
      "Head straight for T Express on arrival; the queue is longest from midday.",
      "There is a direct bus from Gangnam station, about an hour.",
    ],
    bestTime: "April (tulips) and October–November",
    visitDuration: "A full day",
    ticket: "Gate day pass around 62,000 KRW; pre-booked tickets are considerably cheaper",
    openingHours: "Varies by season and by day — check the official calendar before you go",
    galleryCaptions: ["The spring tulip garden"],
  },
  "gwangmyeong-cave": {
    name: "Gwangmyeong Cave",
    summary:
      "A colonial-era gold mine left empty for forty years, now a man-made cave with a wine cellar and a wall of light.",
    story:
      "The Gwangmyeong mine was opened by the Japanese in 1912 for gold, silver and zinc; after it closed in 1972 it spent four decades as a store for salted shrimp, because the tunnels hold a steady twelve degrees. In 2011 the city bought it back and turned the workings into an exhibition space: a cellar for Korean winemakers, a cave with a water-and-music show, an art lighting section, and an enormous dragon left over from a film. When it is forty degrees outside it is still twelve in here — reason enough to come in summer.",
    facts: [
      "The mine opened in 1912 for gold, silver and zinc, and closed in 1972.",
      "The tunnels stay around 12°C all year.",
      "It was used as a salted shrimp store for nearly 40 years.",
      "Gwangmyeong city reopened it as a visitor attraction in 2011.",
    ],
    travelTips: [
      "Bring a jacket even in midsummer — it is genuinely cold inside.",
      "The tunnel is long and sloping; flat shoes help.",
      "Weekends are busy, so come early in the morning.",
    ],
    bestTime: "June–August (to escape the heat), or year-round",
    visitDuration: "2 hours",
    ticket: "6,000 KRW",
    openingHours: "09:00–18:00, last entry 17:00, closed Mondays",
    galleryCaptions: ["The lit mine tunnel"],
  },
  oido: {
    name: "Oido & the Siheung Tidal Flats",
    summary:
      "A red hourglass-shaped lighthouse at the end of a causeway, with vast tidal flats and clam beds behind it.",
    story:
      "Oido was once a real island; land reclamation joined it to the mainland and turned it into a standard day trip for the capital region. The causeway runs straight out to sea, and at its end stands the red hourglass lighthouse that has become the local emblem. At low tide the mudflat runs to the horizon and people wade out to rake for clams; at high tide the water slaps just under the railing. Grilled seafood restaurants line the shore, and the sun sets straight into the Yellow Sea — something Korea's east coast cannot offer.",
    facts: [
      "Formerly an island, joined to the mainland by reclamation projects.",
      "The hourglass-shaped Oido lighthouse is about 30m tall and has a viewing deck.",
      "The Siheung flats are part of the extensive west coast tidal system.",
      "Prehistoric shell middens have been excavated in the area.",
    ],
    travelTips: [
      "Check the tide table: low water for the flats, high water for lighthouse photos.",
      "Take the Suin-Bundang line to Oido station, then a bus to the shore.",
      "At weekends the seafood restaurants fill up from the afternoon.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The red lighthouse at the end of the Oido causeway"],
  },
  dumulmeori: {
    name: "Dumulmeori Confluence",
    summary:
      "Where the two branches of the Han meet, with a four-hundred-year-old zelkova and mist thick enough to erase the far bank.",
    story:
      "Dumulmeori means 'the head of two waters': the North Han flowing down from Kumgangsan meets the South Han from Taebaeksan, and together they become the river that runs through Seoul. The junction is wide as a lake, and on cold mornings the vapour rising off it covers the water so completely that only the crown of the four-hundred-year-old zelkova shows above it. People arrive before dawn with tripods. On an ordinary day it is simply calm: a waterside path, wooden boats moored for effect, lotus fields flowering in July, and cafés facing the river.",
    facts: [
      "It is where the North Han and South Han rivers join to form the Han.",
      "The zelkova on the bank is said to be more than 400 years old.",
      "River mist on cold early mornings is the region's best-known photographic sight.",
      "The Semiwon lotus gardens next door bloom in July and August.",
    ],
    travelTips: [
      "Arrive before dawn for the mist — it is gone by 8am.",
      "Take the Gyeongui-Jungang line to Yangsu station, then walk about 20 minutes.",
      "Add the Semiwon lotus garden (separate ticket) to the same morning.",
    ],
    bestTime: "October–February (morning mist) and July–August (lotus)",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["The zelkova in river mist"],
  },
  yongmunsa: {
    name: "Yongmunsa Temple & the Great Ginkgo",
    summary:
      "A ginkgo over forty metres tall, the oldest in Korea, shading most of a mountain temple's courtyard.",
    story:
      "The path up to Yongmunsa follows a clear stream for about twenty minutes, then the courtyard opens and you understand why everyone talks about the tree before the temple. This ginkgo is over forty metres tall, more than fourteen metres around the trunk, and is held to be over eleven hundred years old — planted, the story goes, when Prince Maui of Silla pushed his staff into the ground. It survived the burning of the temple in the Korean War, when everything around it went up. In mid-November the whole canopy turns gold and drops across the courtyard, and the entire valley comes to look.",
    facts: [
      "The ginkgo is about 42m tall with a trunk over 14m in girth.",
      "It is thought to be more than 1,100 years old, the oldest ginkgo in Korea.",
      "It is designated Natural Monument No. 30.",
      "The tree survived when Yongmunsa temple was burned down during the Korean War.",
    ],
    travelTips: [
      "Come in mid-November for the brightest gold.",
      "The walk from the park gate to the temple is a gentle 20–30 minute climb.",
      "Take the Gyeongui-Jungang line to Yongmun station, then a local bus.",
    ],
    bestTime: "Mid-November (golden leaves)",
    visitDuration: "2–3 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "08:00–18:00",
    galleryCaptions: ["The thousand-year ginkgo before the temple"],
  },
  "paju-book-city": {
    name: "Paju Book City",
    summary:
      "A whole town built by the publishing industry, where every building is a publisher and the architects were let loose.",
    story:
      "In the early 1990s Korean publishers did something nobody had done: they moved out together and built a city for books. The result is a few hundred hectares at Paju holding printers, warehouses, editorial offices and publishing houses — and because each commissioned its own architect under a shared code, the whole place became an open-air museum of contemporary architecture: raw concrete, bare brick, weathered steel, no two buildings alike. At its centre is the Forest of Wisdom, a three-storey hall of shelves running floor to ceiling, open through the night for anyone who wants to read.",
    facts: [
      "Planned from the early 1990s as a publishing-industry cluster.",
      "More than 250 publishers, printers and related businesses are based here.",
      "The Forest of Wisdom library has three-storey shelving and stays open 24 hours.",
      "A shared architectural code turned the district into a contemporary architecture destination.",
    ],
    travelTips: [
      "Come on a weekday; many publishers close their showrooms at the weekend.",
      "The Forest of Wisdom is open all night and worth a late visit.",
      "Combine it with Heyri Art Valley, about 15 minutes away by car.",
    ],
    bestTime: "Year-round",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "The district is open all day; Forest of Wisdom halls 1 and 2 run 10:00–20:00 and hall 3 is open 24 hours. Individual publishers and bookshops keep their own hours",
    galleryCaptions: ["The Forest of Wisdom reading hall"],
  },
  "heyri-art-valley": {
    name: "Heyri Art Valley",
    summary:
      "A village the artists built themselves, under a rule that nothing rises above three storeys and no wall gets painted white.",
    story:
      "Heyri is a village of some three hundred artists, writers, musicians and architects who bought the land themselves and then agreed the rules: nothing over three storeys, no fences between plots, materials left raw instead of painted, and the existing trees kept. The result is at once housing, studio and gallery — you push open the door of a concrete house and find a toy museum; the next is a café that is also a pottery workshop; the one after that is somebody's home, so don't knock. Sitting close to the DMZ belt, the village takes its name from an old rice-planting song of the Paju area.",
    facts: [
      "Begun in the late 1990s by a cooperative of artists.",
      "The building code limits height to three storeys and bans fences between plots.",
      "The name comes from 'Heyri Sori', an old Paju rice-planting song.",
      "Dozens of small private museums and galleries are open to visitors.",
    ],
    travelTips: [
      "Many galleries close on Mondays — avoid the start of the week.",
      "People live here; look for the 'private residence' signs before walking in.",
      "There is a direct bus from Hapjeong station in Seoul, about an hour.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "3 hours",
    ticket: "Village free, museums ticketed separately",
    openingHours: "The village is open all day; every gallery, museum and café sets its own hours, and most close on Mondays",
    galleryCaptions: ["A concrete studio house in Heyri"],
  },
  "petite-france": {
    name: "Petite France, Gapyeong",
    summary:
      "A Provençal village built on a Korean hillside, made in memory of The Little Prince.",
    story:
      "The founder of Petite France loved The Little Prince enough to license the imagery and build an entire French village on a hillside above Cheongpyeong lake: orange-tiled roofs, blue shutters, a small square with a fountain, and a little museum about Saint-Exupéry alongside a collection of antique music boxes played to a timetable. It is entirely staged and makes no secret of it — yet on an autumn afternoon, standing in the square looking down at the lake, it carries its own conviction. Many Korean films and shows were filmed here, so Asian visitors come in numbers.",
    facts: [
      "Opened in 2008, themed on Saint-Exupéry's The Little Prince.",
      "It has an antique music box museum with scheduled daily performances.",
      "The architecture copies Provençal villages, including houses moved over from France.",
      "It has been the setting for numerous Korean television dramas.",
    ],
    travelTips: [
      "Pair it with the Garden of Morning Calm, about 20 minutes away by car.",
      "The Gapyeong tourist shuttle bus loops between the area's sights.",
      "Late afternoon is quieter and the light is better.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "1.5–2 hours",
    ticket: "12,000 KRW",
    openingHours: "09:00–18:00",
    galleryCaptions: ["The village square above the lake"],
  },
  "garden-of-morning-calm": {
    name: "The Garden of Morning Calm",
    summary:
      "Korea's oldest private botanical garden, lit in winter by millions of bulbs strung through the pines.",
    story:
      "A horticulture professor bought this hillside in 1996 meaning to make a garden that expressed the 'Korean curve' — not symmetrical, not clipped square, but following the ground the way a mountain ridge does. Twenty themed gardens run across the slope, among them the Garden Beside the House, which recreates the back yard of a rural home. The name comes from the old epithet for Korea, the land of morning calm. From December to March the whole place is lit by millions of bulbs for the light festival — the busiest time, and the coldest.",
    facts: [
      "Opened in 1996, Korea's oldest private botanical garden.",
      "About 33 hectares with more than 20 themed gardens.",
      "The winter light festival runs from December to March.",
      "The name comes from the old epithet for Korea, the land of morning calm.",
    ],
    travelTips: [
      "In winter the garden stays open late for the lights — dress properly warm.",
      "May is when the azaleas and peonies are at their peak.",
      "Take the ITX to Cheongpyeong, then the Gapyeong tourist shuttle.",
    ],
    bestTime: "May (flowers) and December–February (light festival)",
    visitDuration: "2–3 hours",
    ticket: "9,000–11,000 KRW depending on season",
    openingHours: "08:30–19:00, until 21:00 during the light festival",
    galleryCaptions: ["The winter light festival"],
  },
  "pocheon-art-valley": {
    name: "Pocheon Art Valley",
    summary:
      "An abandoned granite quarry flooded into a jade-green lake, walled on all sides by sheer cut rock.",
    story:
      "For decades Pocheon granite was cut to build Seoul; when the quarry ran out and was abandoned, groundwater rose and filled the pit, making a strangely jade-coloured lake ringed by vertical faces still showing the saw marks. Rather than fill it in, the county turned it into an arts park: a monorail crawls up to the rim, an open-air stage uses the rock face as its backdrop, there is a small observatory, and stone sculptures line the paths. The water is deep and cold year-round so swimming is banned, but seen from the viewing deck the colour is hard to believe.",
    facts: [
      "Formerly a granite quarry, abandoned and then naturally flooded.",
      "Cheonjuho lake formed in the old pit; the water is deep and cold all year.",
      "It opened as a cultural park in 2009.",
      "A monorail carries visitors to the rim, and there is a small observatory.",
    ],
    travelTips: [
      "Ride the monorail up and walk down — the descent is gentle with the better views.",
      "The jade colour only appears in sunshine; on grey days it goes dull.",
      "Combine it with the nearby Bidulginang falls on the same trip.",
    ],
    bestTime: "May–June and September–October",
    visitDuration: "2 hours",
    ticket: "5,000 KRW (3,000 teens, 1,500 children); the monorail is a further 5,300 KRW return",
    openingHours: "09:00–19:00",
    galleryCaptions: ["The jade lake in the old quarry"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  gyeonggi: {
    name: "Gyeonggi",
    summary: "The province that wraps around Seoul, holding UNESCO fortresses, a folk village and the line that divides the peninsula.",
    story:
      "Gyeonggi encircles the capital, and almost every day trip from Seoul ends up here. Suwon has Hwaseong, the most refined piece of defensive engineering of the Joseon era. Yongin has a folk village where old crafts are genuinely practised. To the east rise the mountains of Namhansanseong; to the north the highway runs straight to Imjingak and the Demilitarized Zone, where history has not yet closed. In between are farms, reservoirs and the hillside cafés Seoulites drive out to at weekends.",
    bestTime: "April–June and September–November",
    specialties: ["Suwon galbi", "Namhansanseong tofu", "Mushroom rice"],
  },
};
