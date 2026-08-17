import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "sejong-lake-park": {
    name: "Sejong Lake Park",
    summary: "A large artificial lake at the heart of the new administrative city, with a floating stage shaped like a leaf.",
    story:
      "Sejong was built from scratch to take pressure off the capital: ministries moved here from 2012, and the whole city is a single continuous plan. At its centre lies a broad lake with five small islands, a running loop and a floating stage. The architecture is unlike anywhere else in Korea: the government complex runs more than three kilometres with a rooftop garden you can walk along. This is where you see what Korea builds when it starts a city over.",
    facts: [
      "Sejong became a special self-governing city in 2012.",
      "The lake covers about 32 hectares of water.",
      "The Sejong government complex is over 3.5 km long with a walkable roof garden.",
      "The National Library of Sejong stands beside the lake.",
    ],
    travelTips: [
      "Rent a public bike to circle the lake and the centre.",
      "The lake is lit at night, with outdoor performances at weekends.",
      "BRT buses from Daejeon take about 40 minutes.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Open all day",
  },
  "sejong-arboretum": {
    name: "Sejong National Arboretum",
    summary: "Korea's first urban national arboretum, with a 30-metre glasshouse shaped like flower petals.",
    story:
      "Opened in 2020, this is the country's first national arboretum built inside a city. Its centrepiece is the petal-shaped glasshouse: inside, a Mediterranean zone gives way to a tropical one, so you pass from olive trees to palms in a few dozen steps. Outside are more than twenty themed gardens, including a Korean garden laid out in the traditional way with a square pond and a round island. Tulips in spring, silver grass in autumn — the garden changes face with the season.",
    facts: [
      "The first national arboretum located within an urban area.",
      "The main glasshouse is about 32m tall and petal-shaped.",
      "More than 2,000 plant species across 20 themed gardens.",
      "Opened in 2020.",
    ],
    travelTips: [
      "Book online at weekends and during flower festivals.",
      "Pair it with Sejong Lake Park next door in one outing.",
      "The tropical house is very humid — leave your coat in a locker.",
    ],
    bestTime: "April–May and September–October",
    visitDuration: "2–3 hours",
    ticket: "5,000 KRW (4,000 teens, 1,000 children)",
    openingHours: "09:00–17:00; closed Mondays, 1 January and the main holidays",
  },
  "government-complex-rooftop": {
    name: "Sejong Government Complex Rooftop Garden",
    summary: "A rooftop garden three and a half kilometres long linking the ministries, and a Guinness record.",
    story:
      "When Korea moved most of its ministries out of Seoul it did not build separate blocks but one continuous curving structure — and covered the entire roof with a garden. The result is the longest rooftop garden in the world by Guinness: three and a half kilometres of walkway running over the ministries, with grass, shrubs, small ponds and viewpoints over the new city. Civil servants walk it at lunch. Visitors must register in advance and bring ID because this is still a government building, but the process is simple. Standing on the roof looking down, you can see a city drawn whole before anyone lived in it.",
    facts: [
      "The rooftop garden runs about 3.6km, recognised by Guinness as the world's longest.",
      "It covers the continuous roofline of the Sejong government ministries.",
      "The garden area is about 7.9 hectares.",
      "Visitors must register in advance and carry identification.",
    ],
    travelTips: [
      "Register through the government complex website; daily places are limited.",
      "Bring a passport or ID card — required to pass security.",
      "Come on a weekday; some sections close at weekends.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "1.5 hours",
    ticket: "Free, but bring photo ID and book ahead on Naver (50 people per session) or register on site",
    openingHours: "Three guided sessions a day at 10:00, 13:30 and 15:30, weekdays and weekends alike, each lasting 60–90 minutes. It only runs in seasonal windows: in 2026, 14 March–14 June and 31 August–29 November; closed on major holidays and during extreme heat or cold",
  },
  "bimatgil-geumgang": {
    name: "Geumgang Riverside & Ihan Bridge",
    summary: "A two-level footbridge over the Geumgang, its upper deck roofed and looped into an ellipse.",
    story:
      "The Geumgang runs through Sejong and divides the city in two, so the planners put a bridge across it for pedestrians and cyclists only. Ihan bridge has two levels: bicycles below, a roofed walkway above, and both curve into a closed ellipse, so walking the full loop brings you back without retracing your steps. At night it lights in shifting colours reflected on the water. Both banks carry riverside paths running tens of kilometres, with rapeseed fields in spring, silver grass in autumn, and public bike stations along the way.",
    facts: [
      "Ihan bridge is a two-level footbridge, about 1.4km including the elliptical loop.",
      "The lower deck is for bicycles, the roofed upper deck for pedestrians.",
      "The closed elliptical form lets you walk a full circuit without turning back.",
      "The Geumgang riverside path has public bike hire stations along it.",
    ],
    travelTips: [
      "Come in the evening to see the bridge lights shift on the water.",
      "Hire a public bike to cover the riverside route properly.",
      "April brings rapeseed fields, October silver grass along the banks.",
    ],
    bestTime: "April–June and September–October",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "All day",
  },
  "birds-nest-library": {
    name: "National Library of Korea, Sejong",
    summary: "A library shaped like a turning page, built to serve the country's policy-making.",
    story:
      "The building is designed as a page being turned — the roof lifts in a curve and settles, and the glass beneath reflects Sejong lake in front of it. This is not an ordinary public library: it is the policy branch of the National Library, serving the ministries newly moved to Sejong, so the collection leans heavily towards policy research and administrative records. But the public floor is open to everyone, and the reading space facing the lake is probably the finest place to read in this city. Plenty of people come only to sit there.",
    facts: [
      "Opened in 2013 as the policy branch of the National Library of Korea.",
      "The building's form is modelled on a page being turned.",
      "It mainly serves the ministries based in Sejong.",
      "The public floor is freely open and faces Sejong lake.",
    ],
    travelTips: [
      "No card is needed for the public floor.",
      "Seats facing the lake go quickly at weekends.",
      "It sits beside Sejong Lake Park, easy to combine.",
    ],
    bestTime: "Year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "09:00–21:00 on weekdays, 09:00–18:00 at weekends; closed the second and fourth Monday of each month and on public holidays",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  sejong: {
    name: "Sejong",
    summary: "A purpose-built administrative city — Korea's experiment in designing an urban centre from zero.",
    story:
      "Sejong exists because of a political decision: move most ministries out of Seoul to relieve the capital. The result is a fully planned city named after the king who created the Hangeul alphabet. The government complex runs more than three kilometres with a walkable roof garden, a large lake sits at the centre, and housing is arranged in clusters, with a national arboretum alongside. There is no old town and no century-old market — but this is where you see how Korea imagines its urban future.",
    bestTime: "April–June and September–October",
    specialties: ["Sejong soybean stew", "Steamed rice cakes", "Local mushrooms"],
  },
};
