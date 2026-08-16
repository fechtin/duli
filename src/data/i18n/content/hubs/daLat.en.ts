// English translations for the Đà Lạt hub depth pass (tasks/038, wave 2).
// Covers regions/hubs/daLat{City,Around}.ts. Arrays index-aligned with the Vietnamese source.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "xuan-huong-lake": {
    name: "Xuan Huong Lake",
    summary: "A crescent-shaped artificial lake in the middle of Da Lat — the axis the whole town turns on.",
    story:
      "Xuan Huong is not a natural lake: the French dammed the Cam Ly stream in the 1920s to create it, and all of Da Lat was then laid out around that water. The lake curves like a crescent, the road around it runs about five kilometres, lined with pines and cherry-apricot trees that turn the whole shore pink around January. At dawn mist lifts off the surface and the town jogs round it; in the evening it is where people sit over coffee looking at the water. Almost every other destination in town measures its distance from this lake.",
    facts: [
      "The lake is artificial, formed by damming the Cam Ly stream in the 1920s.",
      "It curves in a crescent, with a shore road of about 5km.",
      "The cherry-apricot trees around the lake bloom around January.",
      "Central Da Lat was planned around this body of water.",
    ],
    travelTips: [
      "Walk or cycle the full loop early, while mist is still lifting off the water.",
      "January is the cherry-apricot bloom — and also the busiest time of the year.",
    ],
    bestTime: "December to March; blossom around January",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "All day",
    galleryCaptions: ["Morning mist on Xuan Huong lake", "Cherry-apricot blossom along the shore"],
  },
  "da-lat-market": {
    name: "Da Lat Market",
    summary: "A three-storey central market, and after dark the whole area around it becomes the Underworld Market.",
    story:
      "Da Lat market, which the architect Ngo Viet Thu helped design, sits at the bottom of a small valley in the middle of town, joined to the main street by a broad staircase. By day the ground floor is Da Lat produce — artichoke, strawberries, crisp persimmon, avocado, temperate vegetables that will not grow in the lowlands; upstairs is jam, tea, coffee and knitwear. But the name people remember is Cho Am Phu, the Underworld Market: from dusk, stalls fill the whole area in front and trade until late under yellow light, in a cold only Da Lat has. Hot soy milk and grilled rice paper are the two dishes tied to this spot.",
    facts: [
      "The market stands in the middle of town, joined to the main street by a broad staircase.",
      "The ground floor sells temperate produce typical of Da Lat — artichoke, strawberries, crisp persimmon.",
      "The area in front becomes the night market known as Cho Am Phu, trading until late.",
      "Hot soy milk and grilled rice paper are the dishes associated with the night market here.",
    ],
    travelTips: [
      "Taste before buying jam and tea — quality varies a lot between stalls.",
      "Come to the night market after 19:00 and dress warmly; Da Lat drops below 15 degrees late on.",
    ],
    bestTime: "Evening, year-round",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "06:00 - 19:00; night market about 17:00 - 23:00",
    galleryCaptions: ["Temperate produce stalls inside the market", "The Underworld Market under yellow light"],
  },
  "da-lat-railway-station": {
    name: "Da Lat Railway Station",
    summary: "A 1938 art déco station with three peaked roofs, and the steam engine of a lost rack railway.",
    story:
      "Da Lat station opened in 1938 with three peaked roofs echoing the shape of Lang Biang mountain — or, by another reading, the roofs of a Central Highlands communal house — and was considered the handsomest station in Indochina. It was the terminus of the Phan Rang–Da Lat rack railway, one of only two such lines that ever existed, using a toothed rail to climb the steep gradient. The line was dismantled after the war and the engines sold to Switzerland. Today only a seven-kilometre stretch to Trai Mat still runs, pulled by diesel, but the station itself, with its stained glass and the steam engine displayed in the yard, is worth the visit.",
    facts: [
      "The station opened in 1938, its three peaked roofs inspired by Lang Biang mountain.",
      "It was the terminus of the Phan Rang–Da Lat rack railway.",
      "The rack railway used a toothed rail to climb steep gradients, one of very few such lines worldwide.",
      "Today the station operates only a stretch of about 7km to Trai Mat.",
    ],
    travelTips: [
      "The Trai Mat train only runs with enough passengers — ask departure times at the counter.",
      "Pair the train with Linh Phuoc pagoda at Trai Mat, right by the far terminus.",
    ],
    bestTime: "Year-round; morning light suits the stained glass",
    visitDuration: "1 hour; add 1.5 hours for the Trai Mat train",
    ticket: "Station entry and the Trai Mat train charged separately",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["The three peaked roofs of Da Lat station", "The steam engine displayed in the station yard"],
  },
  "crazy-house-dalat": {
    name: "Crazy House",
    summary: "A building shaped like a giant tree stump with spiralling walkways — and still a working hotel.",
    story:
      "The architect Dang Viet Nga designed this and began building in 1990, not from conventional drawings but by moulding concrete onto a steel frame, so the form resembles a giant tree stump that has grown up and then crawled off in several directions. Inside are narrow spiralling corridors, railless staircases running outdoors, caves, concrete spiderwebs, and bedrooms named after animals — the Bear room, the Kangaroo room, the Eagle room. It is still a hotel taking guests, which means that by day you tour the very rooms somebody sleeps in that night.",
    facts: [
      "The building was designed by architect Dang Viet Nga and begun in 1990.",
      "It was moulded from concrete over a steel frame rather than built to conventional forms.",
      "Bedrooms are named after animals such as the bear, kangaroo and eagle.",
      "It is at the same time a working hotel.",
    ],
    travelTips: [
      "Many staircases are narrow, unrailed and slippery in rain — not for anyone afraid of heights.",
      "Go before 9am; after that the narrow walkways jam with visitors.",
    ],
    bestTime: "Early morning, before the crowds",
    visitDuration: "1 hour",
    ticket: "70,000d (indicative)",
    openingHours: "08:30 - 19:00",
    galleryCaptions: ["The building shaped like a giant tree stump", "A spiral staircase running outdoors"],
  },
  "bao-dai-summer-palace": {
    name: "Bao Dai Summer Palace",
    summary: "The last emperor's art déco summer residence, its interiors almost entirely original.",
    story:
      "Palace III was built at the end of the 1930s as a summer residence for Bao Dai, the last emperor of Vietnam, and what makes it worth the visit is how little has changed: the desk with its telephone and seals, Empress Nam Phuong's bedroom, the rooms of the princes and princesses, the ballroom, all still hold their original furniture. The architecture is squared-off art déco, set on a pine hill with gardens in front. After the abdication Bao Dai continued to use the house during his period as Head of State. Walking these rooms is the closest you can get to picturing the late Nguyen royal household.",
    facts: [
      "The palace was built at the end of the 1930s as a summer residence for Emperor Bao Dai.",
      "The furniture in most of the rooms is still original.",
      "The building is in art déco style, set on a pine-covered hill.",
      "Bao Dai continued to use the palace during his period as Head of State after abdicating.",
    ],
    travelTips: [
      "You must remove shoes or wear covers in the rooms — bring socks.",
      "Pair it with the Crazy House and the cathedral; all three are within two kilometres.",
    ],
    bestTime: "Year-round, in the morning",
    visitDuration: "1 hour",
    ticket: "50,000d (indicative)",
    openingHours: "07:00 - 17:30",
    galleryCaptions: ["The art déco facade of Palace III", "The study with its original furniture"],
  },
  "da-lat-cathedral": {
    name: "Da Lat Cathedral",
    summary: "A tall pink cathedral with a rooster on its spire — also known as the Rooster Church.",
    story:
      "Like Da Nang, Da Lat has a Rooster Church, and for the same reason: an alloy rooster stands on a bell tower nearly forty-seven metres tall, turning with the wind. The cathedral was built in the 1930s in Romanesque style with pink-washed walls, and the best thing about it is some seventy panels of stained glass made by a French workshop, which flood the nave with colour when the sun comes through. Its position on a high slope means the bell tower is visible from many points in town, including from across Xuan Huong lake.",
    facts: [
      "The cathedral was built in the 1930s in Romanesque style.",
      "The bell tower stands nearly 47m, with a rooster figure serving as a weathervane.",
      "It has around seventy stained-glass panels made by a French workshop.",
      "It stands on a high slope and is visible from many parts of town.",
    ],
    travelTips: [
      "This is a working cathedral — avoid service times and dress modestly.",
      "Come in the morning, when the sun comes through the eastern glass.",
    ],
    bestTime: "Morning, year-round",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "Outside service times; the schedule is posted at the gate",
    galleryCaptions: ["The pink bell tower and its rooster", "Light through the stained-glass panels"],
  },
  "domaine-de-marie-church": {
    name: "Domaine de Marie Church",
    summary: "A steep-roofed Nordic-looking church in earth pink, on a flower hill above the town.",
    story:
      "Domaine de Marie is unlike any other church in Vietnam: no pointed bell tower, no gothic vault, but a single mass with a very steep roof in the manner of Normandy, walls washed earth pink, triangular stained-glass windows. Nuns of the Daughters of Charity built it in the 1940s, and in the grounds is the grave of Suzanne Humbert, wife of the Governor-General of Indochina Jean Decoux, who funded most of the construction. The whole church stands on a hill planted with flowers, so from the forecourt you look down on the town sitting among its pine hills.",
    facts: [
      "The church was built in the 1940s by nuns of the Daughters of Charity.",
      "Its architecture follows the Normandy manner, with a steep roof and no pointed bell tower.",
      "The walls are washed in a distinctive earth pink.",
      "The grounds hold the grave of the wife of Governor-General Jean Decoux.",
    ],
    travelTips: [
      "The flower gardens around the church are tended by the nuns and are at their best in the dry season.",
      "It gets far fewer visitors than the Rooster Church — good if you want quiet.",
    ],
    bestTime: "December to March, in the morning",
    visitDuration: "30 - 45 minutes",
    ticket: "",
    openingHours: "07:00 - 17:00, outside service times",
    galleryCaptions: ["The steep roof and earth-pink walls", "Flower gardens in the forecourt"],
  },
  "linh-phuoc-pagoda": {
    name: "Linh Phuoc Pagoda",
    summary: "The Bottle Pagoda — every surface inlaid with broken pottery, glass and ceramic shards.",
    story:
      "People call Linh Phuoc the Bottle Pagoda because nearly every surface here — walls, columns, roofs, statues, the forty-metre dragon in the courtyard — is inlaid with shards of pottery, ceramic and broken bottles set into multicoloured patterns. The pagoda has the tallest seven-tier bell tower in Vietnam, holding a bell of eight tonnes on which visitors paste written prayers. Below the main hall a walk-through tunnel represents the eighteen levels of hell. The pagoda is at Trai Mat, exactly at the far terminus of the train line from Da Lat station.",
    facts: [
      "Nearly the whole structure is inlaid with pottery shards, ceramic and broken glass, giving it the name Bottle Pagoda.",
      "The inlaid dragon in the courtyard is over 40m long.",
      "Its seven-tier bell tower is among the tallest in Vietnam.",
      "The pagoda is at Trai Mat, at the far terminus of the train from Da Lat station.",
    ],
    travelTips: [
      "Take the train from Da Lat station to Trai Mat and walk over — the most enjoyable way to arrive.",
      "The eighteen levels of hell tunnel is dark and tight; not for easily frightened children.",
    ],
    bestTime: "Year-round, in the morning",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["The ceramic-inlaid dragon in the courtyard", "The seven-tier bell tower in inlaid ceramic"],
  },
  "tuyen-lam-lake": {
    name: "Tuyen Lam Lake",
    summary: "Da Lat's largest lake among pine forest, its water broken into dozens of inlets.",
    story:
      "Tuyen Lam is about five kilometres south of the centre, and it differs from Xuan Huong in being large and wild: the water works its way between pine hills into dozens of winding inlets, many reachable only by boat. It is usually paired with Truc Lam monastery on the hill to the north — the standard route is the cable car from Robin hill down to the monastery, then the steps down to the boat landing. Walking trails through the pines run around the lake, and early in the morning mist covers the water until nearly noon.",
    facts: [
      "This is the largest lake in Da Lat, about 5km south of the centre.",
      "The water works between pine hills into many winding inlets.",
      "Truc Lam monastery stands on the hill to the north, linked to the boat landing by steps.",
      "A cable car from Robin hill leads to the monastery and lake area.",
    ],
    travelTips: [
      "Take the cable car from Robin hill down to the monastery and then to the lake — the neatest route.",
      "Hire a boat for the deeper inlets; you cannot reach them walking the shore.",
    ],
    bestTime: "November to March, early morning while mist holds",
    visitDuration: "Half a day",
    ticket: "Cable car and boat charged separately",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Morning mist over Tuyen Lam lake", "Inlets working between the pine hills"],
  },
  "truc-lam-monastery": {
    name: "Truc Lam Zen Monastery",
    summary: "A Zen monastery on a pine hill above Tuyen Lam lake, reached by cable car.",
    story:
      "Truc Lam is among the largest Zen monasteries in Vietnam, founded in 1994 on Phung Hoang hill looking straight down onto Tuyen Lam lake. It belongs to the Truc Lam Yen Tu Zen lineage founded by King Tran Nhan Tong, and the place reflects that: plain architecture, little carving, an open main hall, and most of the grounds given to flower gardens and pines. The finest approach is the two-kilometre cable car from Robin hill, flying over pine forest with the town behind you. The monks and nuns here keep a strict schedule, so visitors are asked to stay silent in the inner precinct.",
    facts: [
      "The monastery was founded in 1994 on Phung Hoang hill, overlooking Tuyen Lam lake.",
      "It is among the largest Zen monasteries in Vietnam.",
      "It belongs to the Truc Lam Yen Tu Zen lineage founded by King Tran Nhan Tong.",
      "The cable car from Robin hill to the monastery runs about 2km.",
    ],
    travelTips: [
      "Take the cable car from Robin hill rather than the road — it flies over pine forest.",
      "Keep silence in the inner precinct; this is a place of practice with a fixed schedule, not just a sight.",
    ],
    bestTime: "November to March, in the morning",
    visitDuration: "1 - 1.5 hours",
    ticket: "",
    openingHours: "05:00 - 21:00; the inner precinct keeps its own hours",
    galleryCaptions: ["The monastery looking down on Tuyen Lam lake", "The cable car over pine forest"],
  },
  "valley-of-love": {
    name: "Valley of Love",
    summary: "A pine valley around Da Thien lake, the oldest landscaped garden in Da Lat.",
    story:
      "The Valley of Love is one of Da Lat's oldest attractions: the French called it the Vallée d'Amour from the early twentieth century, and Da Thien lake was later dammed in the middle of it. The landscape is pine slopes running gently down to a small lake, with clipped flower gardens between. The site has been heavily commercialised with photo sets, electric buggies, a glass bridge and various added structures — so if you are after untouched nature, this is not the place. But for families with young children, or anyone wanting an easy walk among pines, it is pleasant.",
    facts: [
      "The French called this area the Vallée d'Amour from the early twentieth century.",
      "Da Thien lake in the middle of the valley is artificial, dammed later.",
      "The landscape is pine slopes running down to the lake, with clipped flower gardens between.",
      "Many structures and photo sets have been added to the site over time.",
    ],
    travelTips: [
      "This is a heavily commercialised site — for untouched nature choose Tuyen Lam lake instead.",
      "Go early in the day; at weekends the photo areas are crowded and you queue for pictures.",
    ],
    bestTime: "November to March",
    visitDuration: "2 hours",
    ticket: "About 250,000d (indicative, several ticket tiers)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Pine slopes running down to Da Thien lake", "Clipped flower gardens in the valley"],
  },
  "pongour-waterfall": {
    name: "Pongour Waterfall",
    summary: "A seven-tier stepped waterfall almost a hundred metres wide — the finest in Lam Dong.",
    story:
      "Pongour falls over seven stepped tiers of rock, spread almost a hundred metres wide, so unlike the tall narrow falls you usually see, this is a wall of water. The French once called it the most beautiful waterfall in Indochina, and Emperor Bao Dai came here repeatedly. The stepped rock face is covered in green moss and in the rainy season water sheets evenly across the whole surface; in the dry season the flow drops and the tiers of rock show clearly. The falls are about fifty kilometres south of Da Lat, so they take a half day — but this is the one waterfall near Da Lat worth that distance.",
    facts: [
      "The falls drop over seven stepped tiers of rock, spread almost 100m wide.",
      "The French once described Pongour as the most beautiful waterfall in Indochina.",
      "The falls are about 50km south of Da Lat.",
      "The volume of water changes markedly between the rainy and dry seasons.",
    ],
    travelTips: [
      "Come at the end of the rainy season, around September to November, when water sheets across the whole rock face.",
      "The mossy stepped rock is very slippery — wear grippy shoes and do not climb out midstream.",
    ],
    bestTime: "September to November, end of the rainy season",
    visitDuration: "Half a day including the journey",
    ticket: "About 50,000d (indicative)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["The seven stepped tiers of Pongour", "Water sheeting over mossy rock"],
  },
  "elephant-waterfall-dalat": {
    name: "Elephant Waterfall",
    summary: "A thirty-metre fall into a rock gorge, reached by slippery stone steps to the base.",
    story:
      "Elephant Waterfall is about thirty metres high and drops straight into a narrow rock gorge; the name comes from the large boulders below, which locals see as a herd of elephants kneeling. What sets it apart from other falls near Da Lat is that you can go right down to the base and in behind the sheet of water by a rock passage — but the way down is natural stone steps, steep, wet and mossy all year, needing both hands. Above the falls is Linh An pagoda with its large Maitreya Buddha, and nearby the K'Ho people's Chicken Village, with its statue of a nine-spurred rooster from a local legend.",
    facts: [
      "The falls are about 30m high, dropping into a narrow rock gorge below.",
      "The name comes from the large boulders below, said to resemble kneeling elephants.",
      "A stone passage leads down to the base and in behind the sheet of water.",
      "Linh An pagoda and the K'Ho Chicken Village are nearby.",
    ],
    travelTips: [
      "The descent is steep, wet and slippery all year — wear grippy shoes, not sandals.",
      "Combine it with Linh An pagoda above the falls and the Chicken Village nearby.",
    ],
    bestTime: "September to December, when the falls run full",
    visitDuration: "2 hours",
    ticket: "About 30,000d (indicative)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Elephant Waterfall dropping into the gorge", "Stone steps down to the base"],
  },
  "cau-dat-tea-hill": {
    name: "Cau Dat Tea Hill",
    summary: "A century-old tea estate at 1,650m, where cloud rolls in at first light.",
    story:
      "The French established tea plantations at Cau Dat in 1927, and those flat-clipped rows of tea across the hillsides are still there, along with the old tea factory and its colonial-era machinery. Cau Dat sits at about 1,650 metres, higher than central Da Lat, which makes it one of the best-known cloud-hunting spots: from about five in the morning cloud rises and fills the valleys below, leaving the tops of the tea hills standing out like islands. By day it is simply a beautiful stretch of tea hills twenty-five kilometres from the centre, several degrees colder than Da Lat.",
    facts: [
      "The French established tea plantations at Cau Dat in 1927.",
      "The area sits at about 1,650m, higher than central Da Lat.",
      "The old tea factory still holds machinery from the colonial period.",
      "Cau Dat is about 25km from central Da Lat.",
    ],
    travelTips: [
      "For cloud hunting leave Da Lat about 4am — you want to arrive while it is still dark.",
      "It is cold and windy on the hills at first light; dress warmer than you think you need to.",
    ],
    bestTime: "October to March, at first light for the cloud",
    visitDuration: "Half a day",
    ticket: "Entry varies by site, around 50,000d",
    openingHours: "About 05:00 - 17:00",
    galleryCaptions: ["A sea of cloud over the tea hills at dawn", "Flat-clipped rows of tea on the slopes"],
  },
  "me-linh-coffee-garden": {
    name: "Me Linh Coffee Garden",
    summary: "A hillside café looking down a valley, drinking weasel coffee in the plantation itself.",
    story:
      "The café is at Ta Nung, about fifteen kilometres from central Da Lat, on a hillside opening straight onto the coffee valley below. Its strength is not the interior but the terrain: terraces step down the slope, each with its own row of tables, so almost every seat looks straight out. Early in the morning the valley below fills with cloud and the cloud drifts past where you are sitting. The place grows its own coffee and serves weasel coffee — the most expensive thing on the menu — alongside arabica grown on the hill itself. This is a café to sit in for a long time, not to drop into.",
    facts: [
      "The café is at Ta Nung, about 15km from central Da Lat.",
      "Its terraces step down the hillside, looking out over a coffee valley.",
      "The place grows its own arabica on the hill and serves it on site.",
      "Weasel coffee is the most expensive item on the menu.",
    ],
    travelTips: [
      "Come early in the morning to see cloud drifting through the valley below your seat.",
      "The road there has steep bends; be confident on a motorbike or take a car.",
    ],
    bestTime: "November to March, early morning",
    visitDuration: "1 - 2 hours",
    ticket: "",
    openingHours: "Café hours, generally morning until late afternoon",
    galleryCaptions: ["Terraces looking down over the coffee valley", "Cloud drifting through the valley at dawn"],
  },
  "clay-tunnel-dalat": {
    name: "Da Lat Clay Tunnel",
    summary: "A kilometre of sculpture in red basalt clay retelling the whole history of Da Lat.",
    story:
      "This is an odd piece of work: nearly a kilometre of walkway between two banks of red basalt clay, packed and carved into a continuous relief that retells the history of Da Lat — from Dr Yersin first reaching the plateau, through the French laying out the town, to its landmark buildings: the Rooster Church, the railway station, Bao Dai's palace, the teachers' college, all rebuilt in earth. The material is only rammed basalt clay, unfired, so the work has to be repaired continuously after each rainy season. It sits beside Tuyen Lam lake, which makes it easy to fit into the same outing.",
    facts: [
      "The work runs nearly 1km and is made entirely of rammed, unfired basalt clay.",
      "The reliefs retell the history of Da Lat from Dr Yersin's arrival on the plateau.",
      "Many of Da Lat's landmark buildings are rebuilt in clay along the tunnel.",
      "The site lies beside the Tuyen Lam lake area.",
    ],
    travelTips: [
      "Combine it with Tuyen Lam lake and Truc Lam monastery — the three sit close together.",
      "After rain the walkway is muddy and slippery; pick a dry day if you can.",
    ],
    bestTime: "November to March, the dry season",
    visitDuration: "1 - 1.5 hours",
    ticket: "About 80,000d (indicative)",
    openingHours: "07:00 - 17:00",
    galleryCaptions: ["Red clay reliefs along the tunnel", "Da Lat station rebuilt in clay"],
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
