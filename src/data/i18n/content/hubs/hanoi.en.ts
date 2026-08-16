// English translations for the Hà Nội hub depth pass (tasks/038, wave 2).
// Covers regions/hubs/hanoi{OldQuarter,Citadel,Outer}.ts. Arrays index-aligned with the
// Vietnamese source; anything omitted falls back to Vietnamese.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "ngoc-son-temple": {
    name: "Ngoc Son Temple",
    summary: "A temple on Jade Island in Hoan Kiem Lake, reached by the red-painted The Huc bridge.",
    story:
      "The temple sits on a small island at the northern end of Hoan Kiem Lake, and to reach it you cross The Huc — the curved, red-lacquered wooden bridge on almost every Hanoi postcard. The name means the place that catches the morning sun, and it is true: at first light the bridge blazes red as the sun clears the trees. Inside, the temple honours Tran Hung Dao, the general who beat the Mongols three times, alongside Van Xuong, the deity of examinations, so students come to pray before exams all year round. A side room holds a preserved Hoan Kiem turtle, the creature tied to the legend of the returned sword that gives the lake its name.",
    facts: [
      "The temple stands on Jade Island at the north end of Hoan Kiem Lake, linked by The Huc bridge.",
      "'The Huc' means the place that catches the morning light.",
      "It honours Tran Hung Dao and Van Xuong, the deity of study and examinations.",
      "A preserved Hoan Kiem turtle is displayed here, tied to the legend of King Le returning the sword.",
    ],
    travelTips: [
      "Come early: The Huc bridge is empty and catches the best light of the day.",
      "At weekends the lakeside becomes a pedestrian zone closed to traffic — plan your route.",
    ],
    bestTime: "Early morning, or weekends when the lakeside goes car-free",
    visitDuration: "45 minutes",
    ticket: "50,000d (indicative — check at the counter)",
    openingHours: "07:00 - 18:00",
    galleryCaptions: ["The red The Huc bridge to Jade Island", "The temple courtyard looking over the lake"],
  },
  "dong-xuan-market": {
    name: "Dong Xuan Market",
    summary: "The Old Quarter's biggest wholesale market, its five-arched French facade still standing.",
    story:
      "The French built Dong Xuan in the late nineteenth century to gather the scattered street markets around the old city gates under one roof, and that five-arched frontage has become one of Hanoi's most familiar images. Inside are three floors of wholesale trade: fabric, clothing, accessories, dried goods — stock that goes out to the provinces rather than to shoppers, so the pace is fast and makes little allowance for visitors. The market burned badly in 1994 and was rebuilt. What is most worth a visitor's time is actually outside it: the night food alley along one flank, and at weekends the whole street from here down to Hoan Kiem turning into a pedestrian night market.",
    facts: [
      "The market was built by the French in the late nineteenth century; its five-arched facade is its signature.",
      "It is the largest wholesale market in the Old Quarter, supplying traders across several provinces.",
      "A major fire destroyed much of the market in 1994, after which it was rebuilt.",
      "At weekends the street from the market down to Hoan Kiem Lake becomes a pedestrian night market.",
    ],
    travelTips: [
      "This is a wholesale market — buying one or two items rarely gets you a good price.",
      "The night food alley beside the market is more rewarding than the stalls inside it.",
    ],
    bestTime: "Friday to Sunday evenings, during the night market",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "06:00 - 18:00; weekend night market until about 23:00",
    galleryCaptions: ["The five-arched facade of Dong Xuan Market", "The weekend night market outside the gates"],
  },
  "ta-hien-street": {
    name: "Ta Hien Street",
    summary: "The pavement beer street they call the 'international crossroads' — the Old Quarter at its loudest.",
    story:
      "By day Ta Hien is an ordinary narrow lane among the thirty-six streets. From about seven in the evening it becomes something else: red plastic stools spilling across both pavements, packed so tight that walkers have to weave, and on those stools Hanoians sit mixed in with Western, Korean and Japanese visitors — hence the nickname, the international crossroads. The drink is bia hoi, fresh beer brewed and sold the same day, poured from a tap into thick glass tumblers at a price that seems impossible. It comes with fried fermented pork rolls, grilled chicken feet, roasted peanuts. Do not come here for quiet; come to see the Old Quarter at full volume.",
    facts: [
      "The street lies in the Old Quarter and is nicknamed the 'international crossroads' for its foreign crowd.",
      "The signature drink is bia hoi — fresh draught beer brewed and sold within the day.",
      "Bars set low plastic stools out across the pavement; it is busiest from about 19:00.",
      "Common snacks include fried fermented pork rolls, grilled chicken feet and roasted peanuts.",
    ],
    travelTips: [
      "Keep your wallet and phone in a front pocket — the street is very tight and very crowded.",
      "Bia hoi runs out and most places pack up before midnight; go before 22:00.",
    ],
    bestTime: "Evening from about 19:00; busiest at weekends",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "About 17:00 - 24:00",
    galleryCaptions: ["Red plastic stools filling the Ta Hien pavement", "Ta Hien Street in the early morning", "A glass of bia hoi in the Old Quarter at night"],
  },
  "hanoi-train-street": {
    name: "Hanoi Train Street",
    summary: "A stretch of working railway running between two rows of houses, less than a metre from the doorsteps.",
    story:
      "The North–South railway runs straight through an old residential block here, and the houses have grown so close that a passing train clears the doorsteps by a hand's width. The people who live on either side treat it as normal: they hang washing on the rails, put tea tables between the sleepers, then hear the warning horn, clear everything in half a minute and press themselves against the wall. That scene spread across social media, bringing a row of cafés along the track — and bringing repeated closures by the authorities on safety grounds. This is a destination whose status keeps changing: sometimes open, sometimes barriered off completely.",
    facts: [
      "The track is part of the North–South railway line, running through an inner-city residential block.",
      "The gap between a passing train and the doorsteps on either side is measured in hand-widths.",
      "Cafés along the track have been suspended repeatedly on safety grounds.",
      "Residents on both sides carry on daily life on the rails between trains.",
    ],
    travelTips: [
      "Check whether it is open right before you go — the area has been barriered off more than once.",
      "If you can get in, stand inside a house or hard against the wall as the train comes; never on the track for a photo.",
    ],
    bestTime: "Around train times — ask locally, the timetable changes",
    visitDuration: "45 minutes",
    ticket: "",
    openingHours: "Varies; the area may be barriered off entirely",
    galleryCaptions: ["The track running between two rows of houses", "Daily life alongside the rails"],
  },
  "the-note-coffee": {
    name: "The Note Coffee",
    summary: "A café papered wall to ceiling in customers' sticky notes, written in every language going.",
    story:
      "Every surface in the place — walls, ceiling, stair treads, banister — is covered in coloured sticky notes left by customers. There are good wishes, declarations of love, the email address of someone met on the road that morning, written in Vietnamese, English, Korean, Japanese, Hebrew, Arabic. Staff hand you a note and a pen along with your coffee, and old layers get stripped away periodically to make room, so what you are reading is the last few months rather than the café's whole history. It sits right by Hoan Kiem Lake, which makes it an easy stop midway through a walk around the Old Quarter.",
    facts: [
      "The walls, ceiling and staircase are entirely covered in sticky notes written by customers.",
      "The notes here are written in a great many different languages.",
      "Old layers are stripped periodically, so what is on display is always recent.",
      "The café is beside Hoan Kiem Lake, in the Old Quarter.",
    ],
    travelTips: [
      "It is small and spread over several narrow floors — larger groups should avoid the afternoon peak.",
      "Try the egg coffee here if you have not made it to the original cafés on Nguyen Huu Huan street.",
    ],
    bestTime: "Year-round; mid-morning is quietest",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "Café hours, generally morning until evening",
    galleryCaptions: ["Café walls papered in coloured sticky notes", "The note-covered staircase to the upper floors"],
  },
  "st-joseph-cathedral-hanoi": {
    name: "St Joseph's Cathedral",
    summary: "A neo-Gothic cathedral with weather-stained grey walls, modelled on Notre-Dame de Paris, from the 1880s.",
    story:
      "The cathedral was consecrated in the late 1880s, and the French took Notre-Dame de Paris as the model: two square bell towers, a rose window, pointed arches. But Hanoi's climate has done its own work — the render outside is blotched and blackened in patches, and that weathering makes the building look far more real than the original. The forecourt is a standing meeting place for young Hanoians, and the streets around it — Nha Tho, Au Trieu, Nha Chung — are dense with lemon-tea and coffee places. On Christmas Eve the whole area is impassable.",
    facts: [
      "The cathedral was consecrated in the late 1880s during the French colonial period.",
      "It is built in the neo-Gothic style, modelled on Notre-Dame de Paris.",
      "The weather-blotched render on the exterior has become the building's signature look.",
      "The streets around the cathedral are known for their pavement lemon-tea and coffee spots.",
    ],
    travelTips: [
      "This is a working cathedral — avoid visiting during services.",
      "Sitting over a lemon tea on Nha Tho street late in the day is part of the experience here.",
    ],
    bestTime: "Late afternoon; packed solid on Christmas Eve",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "Outside service times; the schedule is posted at the gate",
    galleryCaptions: ["The weather-stained grey bell towers", "St Joseph's Cathedral from Nha Tho street", "A lemon-tea spot on Nha Tho street"],
  },
  "hanoi-opera-house": {
    name: "Hanoi Opera House",
    summary: "A pale-yellow Beaux-Arts opera house modelled on the Palais Garnier, completed in 1911.",
    story:
      "It took the French over a decade to finish this building, with the Palais Garnier in Paris as the template: paired columns, a domed roof, stone balconies, pale yellow walls picked out in white. The opera house opened in 1911, and it was never only a theatre — it was from this building's balcony, in August 1945, that a proclamation was read to the crowd packing the square below. Inside, the U-shaped auditorium with its crystal chandeliers and red velvet seats keeps its original form. Daytime access is limited to a restricted tour schedule, so the surest way inside is to buy a ticket for a performance.",
    facts: [
      "The opera house was completed in 1911, modelled on the Palais Garnier in Paris.",
      "It is built in the Beaux-Arts style, with pale yellow walls trimmed in white.",
      "In August 1945 the square in front of the building was the setting for events of the August Revolution.",
      "The U-shaped auditorium inside keeps its crystal chandeliers and red velvet seating.",
    ],
    travelTips: [
      "Buy a ticket to a performance if you want to see inside — daytime tours are very limited.",
      "The facade looks best lit at night, shot from the square in front.",
    ],
    bestTime: "Evening, when the facade is lit",
    visitDuration: "30 - 45 minutes",
    ticket: "Ticket prices depend on the performance",
    openingHours: "According to the published performance and tour schedule",
    galleryCaptions: ["The lit facade of the Opera House", "Paired columns and stone balconies"],
  },
  "ho-chi-minh-mausoleum": {
    name: "Ho Chi Minh Mausoleum",
    summary: "A block of grey granite on Ba Dinh Square, holding the body of President Ho Chi Minh.",
    story:
      "The mausoleum stands on the exact spot where, in 1945, Ho Chi Minh read the Declaration of Independence to the crowd on Ba Dinh Square. It was completed in 1975, built from stone gathered from regions across the country; the squared-off mass recalls Lenin's mausoleum in Moscow, while the sloping roof borrows the line of a stilt house. Entry is tightly regulated: a long queue, no large bags or cameras, no stopping, no talking, filing two abreast past the body in a matter of seconds. Outside, the changing of the guard runs to a fixed rhythm, and Vietnamese visitors from distant provinces still queue here from dawn.",
    facts: [
      "The mausoleum was completed in 1975 on Ba Dinh Square.",
      "This is where Ho Chi Minh read the Declaration of Independence on 2 September 1945.",
      "The stone used in its construction was brought from regions across the country.",
      "The mausoleum closes for a period each year for scheduled maintenance.",
    ],
    travelTips: [
      "Check the opening calendar before you go — it closes for maintenance for months at a time.",
      "No large bags or cameras inside; wear long trousers and sleeves, and keep absolute silence.",
    ],
    bestTime: "Early morning, before the queue builds",
    visitDuration: "1 - 1.5 hours including the queue",
    ticket: "",
    openingHours: "Mornings on most weekdays, closed Monday and Friday; check the published calendar",
    galleryCaptions: ["The mausoleum seen from Ba Dinh Square", "Ba Dinh Square in front of the mausoleum", "The changing of the guard outside"],
  },
  "one-pillar-pagoda": {
    name: "One Pillar Pagoda",
    summary: "A small wooden shrine on a single stone pillar, built after a king's dream of a lotus.",
    story:
      "The story goes that King Ly Thai Tong, old and without an heir, dreamed one night of Quan Am seated on a lotus throne handing him a child. A prince was born, and in thanks the king had this pagoda built in 1049: one square wooden chamber on top of a single stone pillar rising from a pond, the whole thing shaped as a lotus emerging from the water. It is small enough that people are startled when they stand before it — only a few metres each way. The present structure was rebuilt after the original was destroyed in 1954, but it follows the old form exactly.",
    facts: [
      "The pagoda was built in 1049 under King Ly Thai Tong.",
      "Its design represents a lotus rising from the water, set on a single stone pillar.",
      "It is tied to the legend of a dream in which Quan Am handed the king a son.",
      "The original was destroyed in 1954 and the pagoda was rebuilt to the same form.",
    ],
    travelTips: [
      "It is very small and sits inside the mausoleum grounds — do it in one go with the Ba Dinh sites.",
      "Go early: every tour group stops here for a photograph.",
    ],
    bestTime: "Morning, together with the Ba Dinh area",
    visitDuration: "20 - 30 minutes",
    ticket: "",
    openingHours: "07:00 - 18:00",
    galleryCaptions: ["The pagoda on its stone pillar above the pond", "The wooden steps up to the shrine"],
  },
  "imperial-citadel-thang-long": {
    name: "Imperial Citadel of Thang Long",
    summary: "A World Heritage site where thirteen centuries of power are stacked on one patch of ground.",
    story:
      "What earned Thang Long its UNESCO listing in 2010 is not any single building but the continuity: this same ground has been the seat of power from the seventh century into the modern era, each layer built over the last. You pass through the Le dynasty's Doan Mon gate, look up at the Nguyen-era flag tower, stand on the platform of Kinh Thien palace where only the carved stone dragons of the stairway survive — and then go down into House D67, the concrete command bunker where the Politburo met during the war, its maps and rotary telephones still on the table. Across the road, the excavation at 18 Hoang Dieu lays bare palace foundations, wells and ceramics from several dynasties at once.",
    facts: [
      "The site was inscribed as a UNESCO World Heritage Site in 2010.",
      "The same ground has been a continuous seat of power since around the seventh century.",
      "House D67 within the grounds is a wartime command bunker, preserved as it was.",
      "The 18 Hoang Dieu excavation exposes palace foundations from several dynasties layered together.",
    ],
    travelTips: [
      "Do not skip House D67 and the bunker below it — most people walk past the part they would remember.",
      "The grounds are large with little shade; come in the morning and bring water.",
    ],
    bestTime: "Morning, to avoid harsh sun on the open courtyards",
    visitDuration: "2 hours",
    ticket: "70,000d (indicative — check at the counter)",
    openingHours: "08:00 - 17:00, closed Monday",
    galleryCaptions: ["Doan Mon gate from the inner courtyard", "Carved stone dragons of the Kinh Thien stairway", "The main gate of the Thang Long citadel", "The D67 command bunker"],
  },
  "hanoi-flag-tower": {
    name: "Hanoi Flag Tower",
    summary: "A Nguyen-dynasty watchtower, one of very few parts of the old Hanoi citadel left standing whole.",
    story:
      "The flag tower was raised in the early nineteenth century under the Nguyen dynasty as a lookout for the Hanoi citadel. When the French demolished almost the entire fortress to cut new streets through, this was one of the very few structures they kept — because it made a convenient observation post. So it survives intact: three square tiers stepping inward, an octagonal shaft pierced by flower-shaped and fan-shaped openings for light, and a spiral stair inside climbing to the top. From the lookout at the summit you look straight across to the Imperial Citadel and out over a whole quarter of the old city.",
    facts: [
      "The tower was built in the early nineteenth century under the Nguyen dynasty.",
      "It is one of the few structures of the old Hanoi citadel that the French did not demolish.",
      "The shaft is octagonal, pierced with flower-shaped and fan-shaped openings for light.",
      "A spiral staircase inside leads up to the lookout at the top.",
    ],
    travelTips: [
      "The tower stands in the grounds of the Military History Museum — do both together.",
      "The inner staircase is narrow and dark; wear grippy shoes and use the handrail.",
    ],
    bestTime: "Year-round, mornings",
    visitDuration: "30 - 45 minutes",
    ticket: "Covered by the ticket for the museum in the same grounds",
    openingHours: "08:00 - 16:30, closed some days of the week",
    galleryCaptions: ["The flag tower seen from its base", "Flower-shaped openings in the octagonal shaft"],
  },
  "hoa-lo-prison": {
    name: "Hoa Lo Prison",
    summary: "A prison the French built in 1896, later nicknamed the 'Hanoi Hilton' by the American pilots held here.",
    story:
      "The French built Hoa Lo at the end of the nineteenth century to hold Vietnamese political prisoners and called it Maison Centrale — the words are still over the gate. Inside are rows of dark cells, concrete floors fitted with ranks of iron ankle shackles, solitary blocks, and a guillotine standing in one of the display rooms. Most of the prison was demolished in the 1990s to make way for a tower block; what remains is the memorial. The museum also covers the later period, when captured American pilots were held here and sardonically named the place the Hanoi Hilton — among them John McCain, later a US senator.",
    facts: [
      "The prison was built by the French in 1896 under the name Maison Centrale.",
      "It held many Vietnamese revolutionaries during the colonial period.",
      "American pilots held here during the war sardonically nicknamed it the 'Hanoi Hilton'.",
      "Most of the prison was demolished in the 1990s; the remaining section is preserved as a memorial.",
    ],
    travelTips: [
      "Take the audio guide — the interpretation here is noticeably better than average.",
      "The displays are heavy going; think twice about bringing young children.",
    ],
    bestTime: "Year-round; mornings are quieter",
    visitDuration: "1 - 1.5 hours",
    ticket: "50,000d (indicative — check at the counter)",
    openingHours: "08:00 - 17:00",
    galleryCaptions: ["The prison gate reading Maison Centrale", "Rows of ankle shackles in a communal cell"],
  },
  "quan-thanh-temple": {
    name: "Quan Thanh Temple",
    summary: "The northern guardian of old Thang Long, holding a four-metre black bronze statue cast in 1677.",
    story:
      "The old citadel of Thang Long had four temples guarding its four directions — the four wards — and Quan Thanh is the guardian of the north. It is dedicated to Huyen Thien Tran Vu, the deity who subdues water demons and evil spirits. What people remember is the black bronze statue in the rear sanctuary: nearly four metres tall, around four tonnes, cast in 1677, showing the god seated with his hair loose, one hand resting on a sword hilt wound about by a snake, his feet on the back of a turtle. The statue's left foot is polished bright against the rest, worn by generations of hands touching it for luck. The temple stands on the corner of West Lake, a few minutes' walk from Tran Quoc Pagoda.",
    facts: [
      "The temple is the northern guardian among the four wards of the old Thang Long citadel.",
      "It is dedicated to Huyen Thien Tran Vu, subduer of water demons and evil spirits.",
      "Its black bronze statue is nearly 4m tall, weighs around 4 tonnes and was cast in 1677.",
      "The temple stands at the southern corner of West Lake, near Tran Quoc Pagoda.",
    ],
    travelTips: [
      "Pair Quan Thanh with Tran Quoc Pagoda — they are a few minutes apart on foot.",
      "This is an active place of worship: dress modestly and keep quiet.",
    ],
    bestTime: "Morning; busy on the full moon and first of the lunar month",
    visitDuration: "30 - 45 minutes",
    ticket: "10,000d (indicative)",
    openingHours: "08:00 - 17:00",
    galleryCaptions: ["The temple gate beside West Lake", "The black bronze statue of Huyen Thien Tran Vu"],
  },
  "tran-quoc-pagoda": {
    name: "Tran Quoc Pagoda",
    summary: "The oldest pagoda in Hanoi, standing on a small peninsula reaching into West Lake.",
    story:
      "Tran Quoc traces its origins to the sixth century, which makes it the oldest pagoda in Hanoi. It first stood on the bank of the Red River; when the bank eroded in the seventeenth century it was moved onto a mound in West Lake, where it stands today — a small peninsula joined to Thanh Nien road by a causeway. In the courtyard rises an eleven-tier stupa, each tier holding six arched niches with an Amitabha Buddha carved in precious stone, topped by a nine-tier lotus. Late in the day, when West Lake turns orange and the stupa is silhouetted against it, is the moment to be standing here.",
    facts: [
      "The pagoda traces its origins to the sixth century and is considered the oldest in Hanoi.",
      "It originally stood by the Red River and was moved onto a mound in West Lake in the seventeenth century after erosion.",
      "The stupa in the courtyard has eleven tiers, each holding Amitabha Buddha images in arched niches.",
      "A bodhi tree in the grounds was grown from a cutting of the tree under which the Buddha attained enlightenment.",
    ],
    travelTips: [
      "Arrive about half an hour before sunset — this is one of the classic spots for it over West Lake.",
      "Thanh Nien road is heavy with traffic at rush hour; walk over from the Quan Thanh side.",
    ],
    bestTime: "Late afternoon, at sunset over West Lake",
    visitDuration: "45 minutes",
    ticket: "",
    openingHours: "08:00 - 16:00",
    galleryCaptions: ["The eleven-tier stupa beside West Lake", "Tran Quoc Pagoda at sunset"],
  },
  "west-lake-hanoi": {
    name: "West Lake",
    summary: "Hanoi's largest lake — nearly eighteen kilometres around, and a different sunset every evening.",
    story:
      "West Lake is wide enough that from one shore you cannot make out the other, and the road around it runs nearly eighteen kilometres — a full afternoon's cycling. It is an old meander of the Red River, left behind when the current shifted, which is why its shape is lopsided rather than round. Different layers of Hanoi sit side by side around it: Tran Quoc Pagoda and Quan Thanh Temple at the southern corner, the flower villages of Nghi Tam and Quang Ba to the north-east, and the bars and expatriate quarter of Tay Ho to the west. Late in the day the whole city comes out to sit along the shore, and the sheer width of water makes sunset here unlike anywhere else in the city.",
    facts: [
      "It is the largest freshwater lake in Hanoi, with a shore road of roughly 18km.",
      "The lake is an old meander of the Red River, cut off when the river changed course.",
      "Tran Quoc Pagoda, Quan Thanh Temple and the Nghi Tam and Quang Ba flower villages ring the lake.",
      "The Tay Ho district on the western shore is where much of Hanoi's expatriate community lives.",
    ],
    travelTips: [
      "Rent a bicycle and ride the full loop early in the morning, before the heat.",
      "Thanh Nien road, running between West Lake and Truc Bach, is the classic sunset spot.",
    ],
    bestTime: "September to November, late afternoon",
    visitDuration: "2 - 3 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Sunset over West Lake", "Thanh Nien road running between the two lakes"],
  },
  "long-bien-bridge": {
    name: "Long Bien Bridge",
    summary: "A steel bridge the French raised early last century, still carrying trains and motorbikes over the Red River.",
    story:
      "Long Bien was completed in 1902, then among the longest steel bridges in Asia, and for decades it was the only crossing of the Red River at Hanoi. That made it a target: it was bombed heavily during the war, spans collapsed and were patched back with girders of a different pattern, so even today you can read along its length which parts are original and which are healed wounds. It now carries only trains, motorbikes, bicycles and pedestrians; cars use other bridges. Walking out to the middle late in the day, looking down on the green market gardens of the river's mid-stream island, is about as Hanoi as anything left.",
    facts: [
      "The bridge was completed in 1902 and was among the longest steel bridges in Asia at the time.",
      "For decades it was the only crossing of the Red River in Hanoi.",
      "It was bombed repeatedly during the war; the repaired spans differ visibly from the originals.",
      "Today it carries only trains, motorbikes, bicycles and pedestrians.",
    ],
    travelTips: [
      "Walk out to the middle late in the day for the mid-river island and the sunset.",
      "The footway is narrow and close to the track — stand against the railing when a train passes.",
    ],
    bestTime: "Late afternoon, year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Long Bien's steel trusses over the Red River", "The mid-river island seen from the bridge"],
  },
  "vietnam-museum-ethnology": {
    name: "Vietnam Museum of Ethnology",
    summary: "A museum of the 54 ethnic groups, with a garden of full-size traditional houses outdoors.",
    story:
      "This is the museum that does the best job of explaining who Vietnam actually consists of. The indoor galleries show clothing, farm tools, instruments and funerary objects from all fifty-four ethnic groups, decently captioned in two languages. But the part people remember is outside: a large garden of real houses — a Bahnar communal house with a dizzyingly steep roof, an Ede longhouse, a Tay stilt house, a Ha Nhi rammed-earth house, a Jarai tomb house ringed by carved wooden figures. Each one was built on site by craftsmen of that group, using materials brought from their home region, and visitors can climb up and go inside.",
    facts: [
      "The museum presents the cultures of all 54 ethnic groups of Vietnam.",
      "Its outdoor section holds traditional houses built at full scale.",
      "Each outdoor house was built by craftsmen of that ethnic group using materials from their home region.",
      "The museum is in Cau Giay district, about 7km from the city centre.",
    ],
    travelTips: [
      "Allow at least an hour for the outdoor section — that is the part worth coming for.",
      "It is well outside the centre; a taxi or ride-hailing car is far easier.",
    ],
    bestTime: "Year-round; avoid midday, as the outdoor section has little shade",
    visitDuration: "2 - 3 hours",
    ticket: "40,000d (indicative — check at the counter)",
    openingHours: "08:30 - 17:30, closed Monday",
    galleryCaptions: ["A Bahnar communal house in the outdoor gallery", "A Jarai tomb house ringed by carved figures"],
  },
  "lotte-observation-deck": {
    name: "Lotte Observation Deck",
    summary: "A glass floor on the 65th storey, where the Red River and West Lake come into view at once.",
    story:
      "Hanoi is a low city, most of it only a few storeys, so climbing two hundred metres puts almost all of it in front of you at once: the wide sheet of West Lake to the north, the Red River curving away east, the crowded tiled roofs of the Old Quarter, and the new districts rising to the west. The deck on the 65th floor has several panels of glass floor looking straight down — the point at which everybody hesitates before stepping on. Arriving about forty minutes before sunset is the sensible plan: you catch the city in daylight, in the colour change, and lit up, all on one ticket.",
    facts: [
      "The observation deck is on the 65th floor of the Lotte Center Hanoi in Ba Dinh district.",
      "Sections of the deck floor are glass, looking straight down to the ground.",
      "West Lake, the Red River and the Old Quarter can all be seen from here at once.",
      "The tower stands at the Dao Tan – Lieu Giai junction, west of the city centre.",
    ],
    travelTips: [
      "Go up about 40 minutes before sunset to get the city in daylight and lit up on one ticket.",
      "On days when Hanoi's air quality is poor, visibility is bad — check the index first.",
    ],
    bestTime: "Late afternoon on a clear autumn day",
    visitDuration: "1 hour",
    ticket: "About 230,000d (indicative, varies by period)",
    openingHours: "09:00 - 23:00",
    galleryCaptions: ["Hanoi from the 65th floor", "A glass floor panel looking straight down"],
  },
  "bat-trang-pottery-village": {
    name: "Bat Trang Pottery Village",
    summary: "Seven centuries of pottery beside the Red River, where you can sit at a wheel and throw a bowl yourself.",
    story:
      "Bat Trang has been making pottery since about the fourteenth century, and what made its name is white clay together with its distinctive crackle glaze — a glaze that cracks into a fine net as it cools, an effect the potters here produce deliberately rather than by accident. Bat Trang ware once travelled by trading junk across South-East Asia and to Japan. Walking the village now means narrow brick-paved lanes with round coal briquettes drying against the walls to fire the kilns, and workshops open for visitors to look in. Most have a wheel area for guests: you pay a small amount, sit down, ruin a few, and take home the one that survives after firing.",
    facts: [
      "The village has made pottery since about the fourteenth century, on the Red River south-east of Hanoi.",
      "Crackle glaze is Bat Trang's signature — the glaze cracks into a fine net as it cools.",
      "Bat Trang ceramics were once exported by sea across South-East Asia and to Japan.",
      "Many workshops in the village have wheels where visitors can throw their own pieces.",
    ],
    travelTips: [
      "Pieces you throw yourself need firing time — ask first whether same-day collection is possible.",
      "The ceramics market inside the village is cheaper than the shops on the main road.",
    ],
    bestTime: "Year-round, mornings while the workshops are running",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "08:00 - 17:30, following workshop hours",
    galleryCaptions: ["A potter's wheel in a Bat Trang workshop", "Coal briquettes drying along a lane wall"],
  },
  "duong-lam-ancient-village": {
    name: "Duong Lam Ancient Village",
    summary: "An old Vietnamese village built of laterite, birthplace of two kings, forty kilometres from central Hanoi.",
    story:
      "Duong Lam was the first ancient village in Vietnam to be listed as a national heritage site, and what sets it apart from every other village is the material: laterite. This pitted red-brown stone was cut from the hills around the village, dried hard, and built into house walls, lane walls and village wells — which gives the whole place a red-brown tone you will not mistake for anywhere else. The village keeps its old gate, its banyan tree, the communal house at Mong Phu, and timber houses centuries old still lived in by the families' descendants. Duong Lam is also called the land of two kings: Phung Hung and Ngo Quyen both came from here, and both have temples in the village.",
    facts: [
      "This was the first ancient village in Vietnam to be classified as a national heritage site.",
      "Houses, lane walls and village wells are all built from laterite quarried locally.",
      "The village is known as the 'land of two kings', for Phung Hung and Ngo Quyen.",
      "It lies in Son Tay, about 40km west of central Hanoi.",
    ],
    travelTips: [
      "Rent a bicycle at the village entrance — the lanes are narrow and walking it all is a long way.",
      "Many old houses are still lived in; ask the owner before entering and before photographing.",
    ],
    bestTime: "October to December, or the rice harvest in May",
    visitDuration: "Half a day",
    ticket: "20,000d (indicative)",
    openingHours: "07:00 - 18:00",
    galleryCaptions: ["The laterite village gate at Mong Phu", "Red-brown laterite walls along a village lane"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
