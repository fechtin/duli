// English translations for the southern half of the tour-stop batch (tasks/039).
// Covers regions/tours/{hcm,daLat,phuQuoc}.ts. Arrays index-aligned with the Vietnamese source.
import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "nguyen-van-binh-book-street": {
    name: "Nguyen Van Binh Book Street",
    summary: "A hundred-metre street beside Notre-Dame, lined with book kiosks under tamarind trees.",
    story:
      "The book street opened in 2016 on a short stretch linking Notre-Dame Cathedral to the Central Post Office — until then, a car park. The city closed it to traffic, put up two rows of glass-and-timber kiosks for publishers with a few cafés between them, and left the old tamarinds arching overhead. The result is one of the few shaded places to stop in central District 1, and one of the very few spots in the city where people sit and read rather than pass through. At weekends there are secondhand stalls, launches and signings; on a weekday it is quiet and cool, and makes a good pause between the two landmarks either side of it.",
    facts: [
      "The book street opened in January 2016 along a stretch of roughly 100 metres.",
      "It is fully pedestrianised, with publisher kiosks and cafés down both sides.",
      "The mature tamarind trees were kept, shading almost the whole width of the street.",
      "It sits between Notre-Dame Cathedral and the Central Post Office, metres from each.",
    ],
    travelTips: [
      "Slot it between the cathedral and the post office — all three are on one short walk.",
      "Weekends are busy with events; a weekday is when it actually works as a place to read.",
    ],
    bestTime: "Early morning or late afternoon, once the light slants through the tamarinds",
    visitDuration: "45 minutes",
    ticket: "Free",
    openingHours: "08:00 - 22:00",
  },
  "turtle-lake-hcm": {
    name: "Turtle Lake",
    summary: "A roundabout with a pool and a concrete lotus tower that becomes a street-food spot after dark.",
    story:
      "The official name here is International Square, but nobody uses it. The structure went up between roughly 1965 and 1967: an octagonal pool in the middle of a traffic circle, with a concrete mass rising and opening out like petals, and at its foot a large turtle carrying a stele. The turtle was destroyed in a 1978 explosion and never replaced — but the popular name stayed, so Turtle Lake is now a place named after something no longer there. By day it is just a roundabout; from dusk the steps around the pool fill up, grilled rice-paper carts appear, and the snail restaurants nearby stay open late.",
    facts: [
      "Its administrative name is International Square; 'Turtle Lake' is the popular one.",
      "The structure was completed between about 1965 and 1967.",
      "The turtle-and-stele sculpture at the tower's base was destroyed in a 1978 explosion and never rebuilt.",
      "From early evening the steps around the pool become a gathering place for students from the nearby universities.",
    ],
    travelTips: [
      "Come after 19:00 — by day this is only a traffic circle.",
      "The area is full of universities, so snacks here cost less than in the tourist centre.",
    ],
    bestTime: "Evening, once the food carts set up around the pool",
    visitDuration: "45 minutes",
    ticket: "Free",
    openingHours: "All day",
  },
  "lam-vien-square": {
    name: "Lam Vien Square",
    summary: "A lakeside square with two glass buildings shaped as an artichoke bud and a wild sunflower.",
    story:
      "The square sits on the southern shore of Xuan Huong Lake, and what makes it unmistakable is the pair of glass buildings: one an artichoke bud, one a wild sunflower — the two plants most tied to Da Lat. By day they are simply large glass volumes; after dark the lighting inside cycles through colours and the whole square lifts, which is when people come. This is Da Lat's default evening gathering place: families letting children run across the open deck, carts selling ice cream and hot soy milk around the edges, and from the steps a view down onto the dark lake with the lakeside road curving around it.",
    facts: [
      "The square lies on the southern shore of Xuan Huong Lake in central Da Lat.",
      "Its two glass buildings are shaped as an artichoke bud and a wild sunflower.",
      "Colour-changing lighting inside both buildings comes on at night, when the square is busiest.",
      "Tiered steps lead from the square down to the water's edge.",
    ],
    travelTips: [
      "Go in the evening — by day the square is empty and exposed, and the point is lost.",
      "Da Lat cools fast after sunset; bring a layer if you plan to sit for a while.",
    ],
    bestTime: "Evening, once the two glass buildings light up",
    visitDuration: "1 hour",
    ticket: "Free",
    openingHours: "All day",
  },
  "da-lat-flower-garden": {
    name: "Da Lat Flower Garden",
    summary: "A long-established garden on the north shore of Xuan Huong Lake, in flower year-round rather than seasonally.",
    story:
      "The garden was established in 1966 on the northern shore of Xuan Huong Lake, and it is the shortest answer to why Da Lat is called the city of flowers. A temperate climate all year lets it grow what will not survive in the lowlands: hydrangea, roses, mimosa, and orchid houses under glass. The garden is laid out in sections by species, linked by walking paths, with a few points looking down over the lake. This is not a one-photo stop — it is large, and the value is in walking the whole circuit early, while dew is still on the flowers and before the tour groups arrive.",
    facts: [
      "The garden was established in 1966, on the northern shore of Xuan Huong Lake.",
      "Da Lat's year-round temperate climate allows species that cannot survive in the lowlands.",
      "It is divided into sections by species, including glasshouses given over to orchids.",
      "It is one of the oldest public flower gardens still operating in Vietnam.",
    ],
    travelTips: [
      "Come early: dew is still on the flowers and the tour groups have not arrived.",
      "It is bigger than it looks — allow about an hour and a half to walk it properly.",
    ],
    bestTime: "Early morning, or hydrangea season from May to August",
    visitDuration: "1 hour 30 minutes",
    ticket: "50,000d (indicative — check at the gate)",
    openingHours: "07:30 - 17:00",
  },
  "cu-lan-village": {
    name: "Cu Lan Village",
    summary: "A built tourist village in the Suoi Vang valley, reached by jeep through pine forest and across a stream.",
    story:
      "Cu Lan Village lies about twenty kilometres north of Da Lat in the Suoi Vang valley — far enough out that the air and the landscape are different from the centre. The name comes from the cu lan plant that grows around here, not from the animal of the same name. This is a built attraction rather than an existing settlement, and it is worth knowing that before you go: the stilt houses, wooden bridges, lake and staged scenes of K'Ho life are all constructed. What is real is the terrain — pine forest, a stream over rock, grass slopes — and the experience people talk about most is the jolting jeep ride across the stream and deeper into the valley.",
    facts: [
      "The village sits in the Suoi Vang valley, about 20 km north of central Da Lat.",
      "It is named after the cu lan plant that grows widely in the area.",
      "It is a constructed tourist attraction, not an existing K'Ho settlement.",
      "The jeep ride across the stream and into the valley is what the place is known for.",
    ],
    travelTips: [
      "The road in is a narrow mountain descent — ride carefully, or hire a car.",
      "Go in the morning: afternoons in the valley often bring rain and fast-falling mist.",
    ],
    bestTime: "Morning in the dry season, November to March",
    visitDuration: "2 hours 30 minutes",
    ticket: "100,000d (indicative, jeep ride not included)",
    openingHours: "07:00 - 17:00",
  },
  "bai-dai-phu-quoc": {
    name: "Long Beach",
    summary: "A long stretch of sand on the island's northwest coast, facing west and so catching the full sunset.",
    story:
      "Long Beach runs down Phu Quoc's northwest coast and, as the name promises, it is long — long enough that walking one end to the other is a morning's work. The sand is golden and the shelf is gentle, with shallow water a good way out, which makes it easier swimming than the south of the island. Because it faces west, every clear afternoon ends with the sun dropping straight into the sea — something the island's east coast never gets. Twenty years ago this was empty shore; most of its length now belongs to large resorts, but public access points remain, and those are what to look for.",
    facts: [
      "The beach runs along the northwest coast of Phu Quoc, in Ganh Dau and Cua Can communes.",
      "It faces west, making it one of the clearest places on the island to watch the sunset.",
      "The water is shallow and shelves gently, easier for swimming than the beaches in the south.",
      "Most of its length now sits within resorts, with public access points in between.",
    ],
    travelTips: [
      "Look for the public access points if you are not staying at a resort — not every stretch is open.",
      "Come late in the day: this is a sunset beach rather than a midday swimming one.",
    ],
    bestTime: "Late afternoon in the dry season, November to April",
    visitDuration: "2 hours",
    ticket: "Free",
    openingHours: "All day",
  },
  "grand-world-phu-quoc": {
    name: "Grand World Phu Quoc",
    summary: "An entertainment complex in Ganh Dau with a Venice-style canal and the Non La bamboo dome.",
    story:
      "Grand World opened in 2021 at the north of the island, and it is the kind of place that divides visitors: you either find it fun or find it fake. At its centre is a cut canal with gondolas rowed past painted terraces borrowed from Venice. The most rewarding thing here is also the least noticed — the Non La dome, an enormous bamboo structure by the architect Vo Trong Nghia, built with exactly the bamboo techniques he has spent years developing. In the evening there is an open-air show, The Quintessence of Vietnam, staged over water. Entry to the complex is free; you pay for the individual attractions inside.",
    facts: [
      "The complex opened in 2021, in Ganh Dau commune at the north of Phu Quoc.",
      "Its central canal carries gondolas, in an evocation of Venice.",
      "The Non La dome is a bamboo structure designed by the architect Vo Trong Nghia.",
      "The open-air show The Quintessence of Vietnam is performed over water in the evening.",
    ],
    travelTips: [
      "Entry to the complex is free; the attractions and the show are charged separately.",
      "Arrive in the late afternoon to catch both the lights coming on and the evening show.",
    ],
    bestTime: "Late afternoon into the evening, once the lights come on",
    visitDuration: "3 hours",
    ticket: "Free entry; shows and attractions charged separately",
    openingHours: "09:00 - 23:00",
  },
  "ho-quoc-pagoda": {
    name: "Ho Quoc Pagoda",
    summary: "The island's largest pagoda, its back against the hills and its front facing straight out to sea.",
    story:
      "Ho Quoc was built between about 2011 and 2012 in Duong To commune on the island's east coast, and what makes it is the siting rather than the age: it backs onto the Ham Ninh range and faces directly out to sea, so from the courtyard there is nothing but water and sky. It follows the Truc Lam Zen style — the school founded by King Tran Nhan Tong in the thirteenth century — with ironwood columns and tiled roofs, terraced up the slope. Being new, it lacks the weathering of the old pagodas; what people come for is the upper courtyard at first light, when the sun rises out of the sea directly ahead.",
    facts: [
      "The pagoda was built between about 2011 and 2012 in Duong To commune, on Phu Quoc's east coast.",
      "It is the largest religious building on the island.",
      "It follows the Truc Lam Zen school, founded by King Tran Nhan Tong in the thirteenth century.",
      "It is terraced up the slope of the Ham Ninh range, facing directly out to sea.",
    ],
    travelTips: [
      "Come at dawn for the sunrise over the sea — that is the reason people make the trip.",
      "Dress modestly; this is a working place of worship, not a photo stop.",
    ],
    bestTime: "Dawn, as the sun comes up over the sea",
    visitDuration: "1 hour",
    ticket: "Free",
    openingHours: "06:00 - 18:00",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {};
