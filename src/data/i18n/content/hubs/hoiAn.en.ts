// English translations for the Hội An hub depth pass (tasks/038).
// Covers src/data/regions/hubs/hoiAnOldTown.ts + hoiAnAround.ts. Arrays are index-aligned
// with the Vietnamese source; any field left out simply falls back to Vietnamese.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "japanese-covered-bridge": {
    name: "Japanese Covered Bridge",
    summary: "A roofed bridge raised by Japanese merchants over four centuries ago — Hoi An's emblem, printed on the 20,000-dong note.",
    story:
      "The bridge crosses a narrow creek, linking what was once the Japanese quarter to the Chinese one, and it has stood there since the early seventeenth century. It is called a pagoda but is really a covered bridge, with a small shrine set into its middle to Bac De Tran Vu, the deity who governs waters. Statues of dogs and monkeys guard each end, commonly read as marking the years the work began and finished. In 1719 Lord Nguyen Phuc Chu visited and gave it the literary name Lai Vien Kieu, 'the bridge for welcoming guests from afar'; those characters still hang above the doorway. The bridge is startlingly small for its fame, and that is what everyone remembers.",
    facts: [
      "The bridge was built by Japanese merchants around the early seventeenth century.",
      "A shrine in the middle of the bridge honours Bac De Tran Vu, deity of rivers and seas.",
      "In 1719 Lord Nguyen Phuc Chu gave the bridge the literary name Lai Vien Kieu.",
      "The bridge appears on Vietnam's 20,000-dong polymer banknote.",
    ],
    travelTips: [
      "Come before 7am if you want a photograph without people in the frame.",
      "Going inside the bridge needs the old-town ticket; walking past it does not.",
    ],
    bestTime: "Early morning, or after 21:00 when the old town empties",
    visitDuration: "30 minutes",
    ticket: "Included in the Hoi An old-town ticket (see Hoi An Ancient Town)",
    openingHours: "All day; the interior follows old-town ticket hours",
  },
  "tan-ky-house": {
    name: "Tan Ky House",
    summary: "A merchant house nearly two centuries old, where Vietnamese, Chinese and Japanese architecture meet under one roof.",
    story:
      "Tan Ky was built by a trading family at the end of the eighteenth century and their descendants still live in it — you are visiting an inhabited house, not a museum reconstruction. The front opens onto Nguyen Thai Hoc street for selling; the back opens straight onto the Thu Bon river for unloading cargo from boats, exactly as a trading house in a working port should. Inside: ironwood columns on stone bases, Vietnamese-carved beams, Chinese yin-yang roof tiles, a Japanese crab-shell ceiling, couplets inlaid with mother-of-pearl. On the wall by the back door are ink marks recording the height of each year's flood, some of them well above head height.",
    facts: [
      "The house was built at the end of the eighteenth century and has passed through generations of one merchant family.",
      "Its architecture blends Vietnamese, Chinese and Japanese styles.",
      "It has two faces: the street front for trade, the rear opening onto the Thu Bon river for cargo.",
      "Marks on the wall record the water level of major historical floods.",
    ],
    travelTips: [
      "People live here — ask before photographing the family's living areas.",
      "The house is one of the sites the old-town ticket lets you choose; pick it if you will only see one.",
    ],
    bestTime: "Morning, before the tour groups arrive",
    visitDuration: "30 - 45 minutes",
    ticket: "Included in the Hoi An old-town ticket",
    openingHours: "08:00 - 17:30",
  },
  "phuc-kien-assembly-hall": {
    name: "Fujian Assembly Hall",
    summary: "The largest assembly hall in the old town, dedicated to Thien Hau, protector of those who go to sea.",
    story:
      "Chinese merchants from Fujian who traded in Hoi An built this as both a meeting place for their community and a temple, and of the halls left in the old town it is the grandest. A pink triple gate stands right on Tran Phu street, and beyond it a sequence of courtyards and shrine halls; the main altar holds Thien Hau, the goddess sailors pray to in a storm. Flanking her are Thien Ly Nhan and Thuan Phong Nhi — one who sees a thousand miles, one who hears the wind. The ceiling is hung solid with spiral incense coils burning slowly all day, drawing the smoke into bands in the light from the skywell.",
    facts: [
      "The hall was founded by the Fujianese Chinese community as both a meeting place and a temple.",
      "The main altar is dedicated to Thien Hau, protector goddess of seafarers.",
      "Thien Ly Nhan and Thuan Phong Nhi stand on either side of her.",
      "It is the largest of the assembly halls remaining in Hoi An's old town.",
    ],
    travelTips: [
      "Dress modestly and keep quiet — this is still an active place of worship.",
      "The incense smoke in the main hall is thick; if it bothers you, stay near the skywell.",
    ],
    bestTime: "Morning; busiest on the full moon and first of the lunar month",
    visitDuration: "30 - 45 minutes",
    ticket: "Included in the Hoi An old-town ticket",
    openingHours: "07:00 - 17:30",
  },
  "hoi-an-night-market": {
    name: "Hoi An Night Market",
    summary: "The lantern street across An Hoi bridge, where Hoi An lights up once the sun is gone.",
    story:
      "Cross the An Hoi bridge to the islet and you reach the street every photograph of Hoi An is taken on: hundreds of silk lanterns in every colour strung along both sides, lit from dusk until late. The market sells collapsible lanterns you can actually pack, handicrafts, clothes, and a row of food stalls — cao lau, white rose dumplings, sweet corn pudding, herbal 'mot' tea. On the river below, boats carry visitors out to float paper lanterns, candlelight breaking into streaks across the water. It is busy and loud, quite unlike the hush of the old town on the other bank — except on full-moon nights, when the whole town cuts its electric lights and the two sides become one.",
    facts: [
      "The market is on the An Hoi islet, across the bridge from the old town.",
      "Its signature is the hundreds of silk lanterns hung along both sides of the street.",
      "Stalls sell lanterns, handicrafts and Hoi An street food.",
      "On the full moon of the lunar month, the old town switches off electric lighting and uses lanterns only.",
    ],
    travelTips: [
      "Collapsible lanterns travel home far better than the rigid-framed kind.",
      "If you take a boat to float lanterns, agree the price for the whole boat before getting in.",
    ],
    bestTime: "Evening; best on the full moon of the lunar month",
    visitDuration: "1.5 - 2 hours",
    ticket: "",
    openingHours: "About 17:00 - 23:00",
  },
  "faifo-coffee": {
    name: "Faifo Coffee",
    summary: "A café with a rooftop over the sea of old-town tiles — Hoi An seen from above.",
    story:
      "At street level, Hoi An is yellow walls and moving crowds. From this rooftop it becomes something else entirely: old tiled roofs spread out to the horizon, layer overlapping layer, moss and grass growing along the ridges, an areca palm or the roof of an assembly hall breaking through here and there. It is one of very few places in the old town that opens a view from above, so the terrace is usually full by late afternoon. The name Faifo is what Western traders called this port in the seventeenth century, before Hoi An became Hoi An on any map.",
    facts: [
      "The café is inside the old town, on Tran Phu street.",
      "Its rooftop is one of the few high viewpoints over the old town's tiled roofs.",
      "'Faifo' is the name Western traders used for Hoi An from the seventeenth century.",
      "It serves Vietnamese coffee alongside cold drinks.",
    ],
    travelTips: [
      "Get up to the terrace before 16:30 for a seat at the railing at sunset.",
      "You will normally need to order a drink to go up — this is not a public viewing platform.",
    ],
    bestTime: "Late afternoon, about an hour before sunset",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "Café hours, generally morning until evening",
  },
  "reaching-out-teahouse": {
    name: "Reaching Out Teahouse",
    summary: "A silent teahouse staffed by deaf servers — you order with engraved wooden blocks, without saying a word.",
    story:
      "The first thing you notice on stepping inside is that sound has gone. The teahouse is staffed by deaf employees and the whole room is designed around that silence: on each table sits a tray of wooden blocks engraved with phrases — 'more hot water', 'the bill', 'thank you' — and you push the one you need across instead of calling out. Tea and coffee arrive on wooden trays with an hourglass timing the steep exactly. The teahouse belongs to a social enterprise that has worked in Hoi An since the early 2000s creating employment for people with disabilities, and runs a craft workshop nearby. In one of Vietnam's noisiest old towns, twenty silent minutes here is hard to forget.",
    facts: [
      "The teahouse is staffed by deaf employees; guests order using engraved wooden blocks left on the table.",
      "The room is kept silent as part of the experience.",
      "It belongs to a social enterprise creating work for people with disabilities, active in Hoi An since the early 2000s.",
      "Tea is served with an hourglass to time the steep.",
    ],
    travelTips: [
      "Stay quiet and silence your phone — this is the house rule, not a suggestion.",
      "The same organisation's craft workshop nearby sells goods made by its own disabled artisans.",
    ],
    bestTime: "Year-round; mid-morning or early afternoon are the quietest",
    visitDuration: "45 minutes - 1 hour",
    ticket: "",
    openingHours: "Teahouse hours, generally morning until evening",
  },
  "tra-que-vegetable-village": {
    name: "Tra Que Vegetable Village",
    summary: "A herb village fertilised with weed dredged from the lagoon — the smell of this village is the smell of every plate in Hoi An.",
    story:
      "Tra Que lies between Hoi An and An Bang beach, wedged between a river and a lagoon, and its entire reputation rests on what the villagers fertilise with: algae raked out of the Tra Que lagoon, and no chemical fertiliser. The herbs here have small leaves, crisp stems and a far sharper scent than market produce — and they are exactly what fills the plate of raw herbs served with cao lau, mi Quang and banh xeo across the old town. The village opens itself to visitors as working farmers: conical hat on, water carried in a shoulder-pole pair of cans, beds hoed, then lunch cooked from what you just picked. It is a few kilometres from the old town and there is no traffic noise at all.",
    facts: [
      "The village is about 3km from Hoi An old town, on the road out to An Bang beach.",
      "Vegetables are fertilised with algae dredged from the Tra Que lagoon instead of chemical fertiliser.",
      "Tra Que herbs are the traditional raw-herb accompaniment to cao lau, mi Quang and banh xeo.",
      "The village runs hands-on sessions where visitors plant, water and harvest.",
    ],
    travelTips: [
      "Come early while the villagers are watering; by midday the beds are empty of people.",
      "Rent a bicycle from the old town — the road is flat and takes about twenty minutes.",
    ],
    bestTime: "February to August, early morning",
    visitDuration: "2 - 3 hours with the farming session",
    ticket: "Village entry around 35,000d; hands-on sessions charged separately",
    openingHours: "07:00 - 17:00",
  },
  "kim-bong-carpentry-village": {
    name: "Kim Bong Carpentry Village",
    summary: "A carpenters' village across the Thu Bon, where the frames holding up the old town were made.",
    story:
      "From a jetty in the old town, a ten-minute ferry crosses to Cam Kim islet — and into a different pace entirely. Kim Bong is the Quang region's old carpentry village, and most of the roof trusses, columns and carved panel doors inside Hoi An's ancient houses came from hands in this village. Their reputation travelled: by local tradition, Kim Bong carpenters were summoned to Hue to work on Nguyen-dynasty buildings. Walk through the village today and you still hear chisels ticking from workshops opening onto the road, smell fresh timber, and pass half-finished figures standing out in the yards.",
    facts: [
      "The village is on Cam Kim islet, across the Thu Bon river from Hoi An old town.",
      "Kim Bong carpenters made most of the house frames and carved woodwork in Hoi An's ancient houses.",
      "By local tradition, its carpenters were summoned to Hue to work on Nguyen-dynasty buildings.",
      "The craft has been handed down through the village's families for generations.",
    ],
    travelTips: [
      "The ferry from the old-town jetty is the quickest and best way across, about ten minutes.",
      "Visit during working hours; many workshops finish early and the village is very quiet after 17:00.",
    ],
    bestTime: "Year-round, mornings while the workshops are running",
    visitDuration: "2 hours including the ferry",
    ticket: "",
    openingHours: "Roughly 07:30 - 17:00, following workshop hours",
  },
  "bay-mau-coconut-forest": {
    name: "Bay Mau Coconut Forest",
    summary: "A brackish water-coconut forest travelled by basket boat — once a wartime base, now Hoi An's loudest afternoon.",
    story:
      "Water coconut grows in the brackish reach where the Thu Bon meets the sea: fronds well above head height, roots tangled beneath the surface, terrain only someone who knows the channels can move through. That is precisely why it served as a base during the war, with liberation forces hidden in the palms within sight of Hoi An. Today visitors board round basket boats and a rower threads them through the narrow channels, teaches them to fold grasshoppers from coconut leaf, then reaches open water and spins the basket flat out to a drumbeat. Know what you are choosing: this is a fun and very noisy outing, not a quiet trip into the forest.",
    facts: [
      "The water-coconut forest grows in the brackish lower reaches where the Thu Bon river meets the sea.",
      "The area served as a wartime base thanks to a maze of channels that made it hard to enter.",
      "Visitors travel by round basket boat, one rower per boat.",
      "The spinning basket-boat display, performed to drums, is a fixture of the tours here.",
    ],
    travelTips: [
      "Agree an all-in price for the whole boat first, including tips and the spinning display.",
      "For quiet, go early in the morning; afternoons are when the groups and the noise arrive.",
    ],
    bestTime: "February to August, in the morning",
    visitDuration: "2 hours",
    ticket: "Entry and boat hire charged separately, roughly 150,000 - 250,000d per basket boat",
    openingHours: "07:30 - 17:00",
  },
  "an-bang-beach": {
    name: "An Bang Beach",
    summary: "Hoi An's beach since Cua Dai eroded away — low thatched bars, wooden chairs, sunset straight off the sand.",
    story:
      "As the sea ate away at Cua Dai, An Bang quietly took over as Hoi An's main swimming beach. It still keeps the shape of a fishing village: a narrow lane in, low thatched-roof eateries either side, wooden chairs set straight on the sand, basket boats turned upside down at the far end. The water is clear, the slope gentle, and because the shore faces north-east the sun sets behind you in the afternoon and leaves a whole band of pink over the sea. It is about twenty minutes by bicycle from the old town — close enough to come out every afternoon without it feeling like an outing.",
    facts: [
      "An Bang became Hoi An's main swimming beach after severe erosion at Cua Dai.",
      "It is about 4km from Hoi An old town, roughly twenty minutes by bicycle.",
      "The area keeps its fishing-village character, with thatched eateries and basket boats at the end of the sand.",
      "It sits next to Tra Que vegetable village on the same road out of town.",
    ],
    travelTips: [
      "Cycle out from the old town; there is parking at the head of the beach lane.",
      "From October to December the sea is rough and many beach bars close.",
    ],
    bestTime: "March to August",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "All day",
  },
  "cua-dai-beach": {
    name: "Cua Dai Beach",
    summary: "Where the Thu Bon river reaches the sea — and where central Vietnam's coastal erosion is most plainly visible.",
    story:
      "Cua Dai is where the Thu Bon river ends its journey. For years this was Hoi An's finest beach, until the sea began eating into the shore: stretches of sand vanished, coconut palms toppled into the water, and resorts had to build revetments and pump sand back. Walk the shore now and you still pass long runs of stone armouring and sandbags — a lesson about the central Vietnamese coast that no interpretation board explains half as clearly. The beach is still lovely where sand remains, and it is the best place to look out at Cham Island offshore, as well as the departure point for boats there.",
    facts: [
      "Cua Dai is where the Thu Bon river meets the sea, about 5km from Hoi An old town.",
      "The shoreline has suffered severe erosion for years, requiring revetments and sand replenishment.",
      "Cham Island is visible offshore from the beach.",
      "The boat pier for Cham Island is in the Cua Dai area.",
    ],
    travelTips: [
      "If you are going to Cham Island this is the departure point; boats generally run in the morning.",
      "Do not swim near the river mouth — currents where river meets sea are strong.",
    ],
    bestTime: "March to August",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "All day",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
