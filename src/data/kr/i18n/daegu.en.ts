import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  "seomun-market": {
    name: "Seomun Market",
    summary: "Daegu's oldest cloth market, which becomes one of Korea's best night markets after dark.",
    story:
      "Seomun has traded since the Joseon dynasty, beginning with cloth — Daegu was the textile capital of Korea. By day the halls are stacked with fabric rolls, bedding and dried goods. After dark more than eighty food stalls open as a night market: chive pancakes, Daegu-style spicy cold noodles, grilled skewers, stir-fried squid. People here eat spicier than the rest of the country, and you notice from the first bite.",
    facts: [
      "One of the three great markets of the Joseon era.",
      "The night market runs from about 7pm to midnight with 80+ food stalls.",
      "Daegu is known for spicy jjolmyeon noodles and chive pancakes.",
      "Right beside Seomun Market station on metro Line 3.",
    ],
    travelTips: [
      "Come in the evening for the night market; daytime is mostly fabric.",
      "Bring cash — most food stalls don't take cards.",
      "Daegu food is spicier than Seoul's; ask for the heat level before ordering.",
    ],
    bestTime: "Year-round, evenings",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Day market 09:00–18:00 (varies by stall); the night market runs only Friday and Saturday 19:00–23:30 and Sunday 19:00–22:00",
  },
  "palgongsan-gatbawi": {
    name: "Palgongsan & the Gatbawi Buddha",
    summary: "A stone Buddha wearing a stone hat on a mountain top, said to grant each visitor one wish.",
    story:
      "Climb more than a thousand stone steps to Gwanbong peak and you meet a Buddha carved in the 9th century, with a flat slab on its head that looks like the gat hat of a Joseon scholar. Legend says Gatbawi grants each person exactly one wish, so during exam season the slope fills with praying parents. From up there the whole of Daegu lies below with the Palgongsan range running away behind — in autumn the range turns red and the cable car on the western side is always full.",
    facts: [
      "The Gatbawi Buddha was carved in the 9th century and stands about 4m tall.",
      "The path up has more than 1,000 stone steps.",
      "Palgongsan became Korea's 23rd national park in 2023.",
      "Donghwasa temple at its foot was founded in 493.",
    ],
    travelTips: [
      "Exam season in November brings crowds of praying families.",
      "Carry water; the final stairway is steep.",
      "If you'd rather not climb, take the cable car on the Donghwasa side.",
    ],
    bestTime: "October–November (autumn colour)",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "Open all day",
  },
  "kim-gwang-seok-street": {
    name: "Kim Kwang-seok Street",
    summary: "A 350-metre alley honouring the singer who put a generation's sadness into song.",
    story:
      "Kim Kwang-seok died in 1996 at the age of thirty-one, leaving songs Koreans still sing when they are sad. In the alley where he grew up in Daegu, the walls carry his portraits and lyrics, and small speakers play his music all day. There is a statue of him seated with his guitar for photographs, and a small stage where young musicians play live at weekends. It is the kind of place where, if you understand Korean, you will stand for a long time.",
    facts: [
      "The alley runs about 350m in Daegu's Bangcheon district.",
      "Kim Kwang-seok (1964–1996) was an icon of Korean folk music.",
      "There is an open-air stage with weekend performances.",
      "Bangcheon Market, with its long-established eateries, is next door.",
    ],
    travelTips: [
      "Come at the weekend for the outdoor performances.",
      "Have dinner at Bangcheon Market next door.",
      "The alley is lit at night and photographs better than by day.",
    ],
    bestTime: "Year-round",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
  },
  "apsan-park": {
    name: "Apsan Park",
    summary: "The mountain on the city's southern edge, with a cable car to a viewpoint over all of Daegu.",
    story:
      "Apsan simply means 'the mountain in front' — the one every Daegu resident sees from their window. The cable car lifts you close to the summit in seven minutes, and from the observation deck the entire Daegu basin appears, ringed by mountains. The park also holds the Nakdonggang Victory War Memorial, remembering the last defensive line of 1950, along with plenty of short trails that suit an afternoon.",
    facts: [
      "The Apsan cable car runs about 790m to a height of 660m.",
      "The park contains the Nakdonggang Victory War Memorial.",
      "Daegu sits in a basin, so the view from here takes in the whole city.",
      "Several walking trails run under two hours.",
    ],
    travelTips: [
      "Go up at sunset to watch the city lights come on.",
      "The cable car stops running in high wind.",
      "Daegu summers are very hot — go late in the afternoon.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2 hours",
    ticket: "Cable car 14,000 KRW return (10,000 one way); the park itself is free",
    openingHours: "10:30–18:00 (cable car)",
  },
  "daegu-yangnyeongsi": {
    name: "Yangnyeongsi Herbal Medicine Market",
    summary: "A herbal medicine street trading since 1658, where the whole quarter smells of drying roots.",
    story:
      "In 1658 the Joseon court set up a market in Daegu to buy medicinal herbs for the whole country, meeting twice a year in spring and autumn. Three hundred and fifty years later it is still in the same place: a hundred-odd herb shops and oriental clinics along one street, and the first thing you notice is the smell — liquorice root, cinnamon and dried ginseng combining into something sweet and sharp that reaches you from the end of the block. The traditional medicine museum halfway along will take your pulse and blend you a tea to match. This is why Daegu calls itself Korea's capital of oriental medicine.",
    facts: [
      "Established in 1658 under Joseon, the oldest herbal medicine market in Korea.",
      "It originally met only twice a year, in spring and autumn.",
      "Over 100 herb shops and oriental clinics operate on the street today.",
      "The Yangnyeongsi festival is held each May.",
    ],
    travelTips: [
      "Go into the traditional medicine museum for a pulse reading and a herbal tea.",
      "Many shops close on Sundays; a weekday is safer.",
      "It is minutes from Seomun market, so pair the two.",
    ],
    bestTime: "Year-round; the festival is in May",
    visitDuration: "1.5 hours",
    ticket: "The museum is free",
    openingHours: "The medicine market runs by day; the museum is 09:00–18:00, last entry 17:30, closed Mondays, 1 January, Seollal and Chuseok",
  },
  "daegu-modern-alley": {
    name: "Daegu Modern History Alleys",
    summary: "A walking route past a red-brick church, missionary houses and the ninety steps schoolchildren used in 1919.",
    story:
      "Daegu's 'modern alley' route 2 runs about four kilometres through a hundred years of history. It starts at Gyesan church, red brick, built in 1902, then climbs Cheongna hill where three American missionary houses still stand with the first apple tree brought into Korea growing in the garden. The most affecting stretch is the 3·1 Manse Undong-gil — ninety steps that schoolchildren slipped down to join the independence demonstrations of 1919. It ends in the Jingolmok lanes of colonial-era merchant houses, now cafés. The route is free and signposted in English the whole way.",
    facts: [
      "Gyesan church, built in 1902, was the first red-brick Gothic church in the Yeongnam region.",
      "The first apple tree brought to Korea was planted at the missionary houses on Cheongna hill.",
      "The 3·1 steps were the route schoolchildren took to join the 1919 independence movement.",
      "Walking route 2 is about 4km and signposted bilingually.",
    ],
    travelTips: [
      "Take route 2 if you only have one afternoon — it is the best of the five.",
      "Free guided walks leave from Banwoldang station; book ahead.",
      "Finish at Seomun market for dinner.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "The alleys are open all day. The three missionary houses on Cheongna hill are closed while they are converted into a museum — only the exteriors can be seen",
  },
  "bullo-tumuli": {
    name: "Bullo-dong Tumuli Park",
    summary: "Two hundred grass-covered burial mounds on a hill in the suburbs, and almost nobody there.",
    story:
      "In the middle of Daegu's northern suburbs is a hill covered in burial mounds — more than two hundred round grassy humps, dating from the 5th and 6th centuries when this was one of the small states at Silla's edge. There is no fence, no ticket, no audio guide; just paths between the mounds and locals walking dogs in the evening. The strange part is that you can walk right among them — something Gyeongju does not allow. Late in the day the mounds throw long shadows across the grass and the whole hill looks like a blanket someone gathered into folds.",
    facts: [
      "Over 200 burial mounds dating from the 5th–6th centuries.",
      "They belong to the small border states absorbed into Silla.",
      "The site is open, unticketed and unfenced.",
      "It sits inside a residential district in northern Daegu.",
    ],
    travelTips: [
      "Come late in the day — the shadows are what make the mounds read.",
      "There is no shade; avoid midday in summer.",
      "The nearest metro is Ayanggyo, then about 15 minutes on foot.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "All day",
  },
  "biseulsan-azalea": {
    name: "Biseulsan Azalea Ridge",
    summary: "Thirty hectares of azalea on a plateau near the summit, turning the whole tableland pink each April.",
    story:
      "Biseulsan has something rare in Korea: a flat plateau just below the summit, some thirty hectares of it, entirely covered in chamkkot azalea. In late April the whole tableland turns pink at once — not scattered bushes but an unbroken pink plane running to the skyline, which is why people come. Outside flower season the mountain is known for its 'sea of stones', an enormous granite river left running down the slope from the ice age and designated a natural monument. A shuttle runs to near the summit during the peak season.",
    facts: [
      "The azalea plateau covers about 30 hectares near the Biseulsan summit.",
      "Peak bloom is in late April, with an annual azalea festival.",
      "Biseulsan's 'sea of stones' is an ice-age granite flow, a designated natural monument.",
      "Cheonwangbong summit reaches 1,084m.",
    ],
    travelTips: [
      "The bloom lasts only about ten days — watch Dalseong county's announcements.",
      "A shuttle runs near the summit during the festival, but the queue is long.",
      "Walking up from Yuga temple takes about two hours at a moderate gradient.",
    ],
    bestTime: "Late April (azaleas)",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "The mountain is open by day. The azaleas start in early April and peak around 20 April; the festival falls in mid-April, with shuttle buses every 5–10 minutes from 08:30 to 17:30 on the two main days",
  },
  "daegu-arboretum": {
    name: "Daegu Arboretum",
    summary: "The city's rubbish tip for seven years, now an arboretum with more than eighteen hundred plant species.",
    story:
      "From 1986 to 1990 this ground was where Daegu dumped its rubbish — over four hundred thousand tonnes of it. When the tip closed the city laid a thick cap of soil over it and started planting, and in 2002 it opened as an arboretum. On top of the old landfill there are now more than eighteen hundred plant species, a cactus glasshouse, a herb garden, and an autumn chrysanthemum display the whole city turns out for. Entry is free. Daegu tells this story with some pride, and fairly — few cities manage to turn their tip into the place people walk on a Sunday.",
    facts: [
      "The site was Daegu's landfill from 1986 to 1990, holding over 400,000 tonnes of waste.",
      "It was capped with soil, planted, and opened as an arboretum in 2002.",
      "More than 1,800 plant species grow across about 24 hectares.",
      "Entry is free.",
    ],
    travelTips: [
      "Late October is chrysanthemum season and the busiest time of year.",
      "The cactus glasshouse is worth a look even in winter.",
      "Parking is free but fills up on flower-season weekends.",
    ],
    bestTime: "April–May and October (chrysanthemums)",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "09:00–18:00 (to 17:00 in winter), closed Mondays",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  daegu: {
    name: "Daegu",
    summary: "A basin city known as Korea's hottest, with an old textile market and the country's spiciest food.",
    story:
      "Daegu sits in a bowl of mountains, so its summers are hot enough that Koreans joke about 'Daefrica'. It was long the centre of textiles and of the peninsula's largest herbal medicine market — Yangnyeongsi still smells of liquorice. The food is hot and salty: spicy noodles, beef bone soup, grilled offal. And the city is ringed by mountains, with Palgongsan and Apsan half an hour away.",
    bestTime: "April–May and September–November",
    specialties: ["Daegu spicy noodles", "Beef bone soup", "Chive pancakes", "Grilled makchang"],
  },
};
