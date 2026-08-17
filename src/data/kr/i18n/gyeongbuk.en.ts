import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  bulguksa: {
    name: "Bulguksa Temple, Gyeongju",
    summary: "The masterpiece of 8th-century Silla Buddhist architecture, with two stone stairways to the 'Buddha land'.",
    story:
      "Bulguksa means 'temple of the Buddha land', and the whole layout is a sermon in stone: the Cheongungyo–Baegungyo stairways stand for the passage from the human world to the Buddha's, and the pagodas Dabotap and Seokgatap face each other across the court in two completely different styles. The wooden halls burned in the Imjin War and were rebuilt, but the stone platforms, stairs and pagodas have been in place since 751. Sitting on those steps, you are touching something almost thirteen centuries old.",
    facts: [
      "Completed in 774 and inscribed by UNESCO in 1995.",
      "Both the Seokgatap and Dabotap pagodas are national treasures.",
      "The wooden architecture was burned in 1593 and rebuilt several times.",
      "About 3 km from the Seokguram grotto on Mount Toham.",
    ],
    travelTips: [
      "Do Bulguksa and Seokguram in the same morning.",
      "Arrive early to get ahead of the school groups.",
      "From Singyeongju KTX station, buses take about 40 minutes.",
    ],
    bestTime: "April (cherry blossom) and October–November",
    visitDuration: "2 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "09:00–18:00",
  },
  seokguram: {
    name: "Seokguram Grotto",
    summary: "A granite Buddha in a man-made cave on a mountain top, facing straight out to the East Sea.",
    story:
      "In the 8th century Silla masons cut granite blocks, assembled them into a domed chamber on Mount Toham, and set inside it a Buddha three and a half metres tall. It faces east, and on the winter solstice the first light off the sea once struck it between the eyes. The jointing and natural ventilation were so refined that modern restoration upset the humidity balance and a glass screen had to be installed. You see the Buddha through that glass — still enough to register the astonishing calm of its face.",
    facts: [
      "Completed around 774, at the same time as Bulguksa.",
      "The main Buddha is 3.5m tall, carved from granite.",
      "Inscribed by UNESCO in 1995.",
      "It is now separated by glass to control humidity.",
    ],
    travelTips: [
      "A 3 km trail climbs from Bulguksa in about an hour.",
      "Photography is not permitted inside the grotto.",
      "Sunrise here is famous, but gate hours vary — check first.",
    ],
    bestTime: "April–May and October–November",
    visitDuration: "1.5 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "09:00–17:30",
  },
  daereungwon: {
    name: "Daereungwon Tomb Complex",
    summary: "Twenty-three Silla royal tombs rising out of the city like enormous grass hills.",
    story:
      "Gyeongju is called a museum without walls, and Daereungwon is its opening chapter: round earth mounds tens of metres high, covered in smooth green grass, sitting in the middle of the town. One of them — Cheonmachong, the 'heavenly horse tomb' — was excavated and opened, and you can walk inside to see the coffin, the gold crown and the painted saddle flap showing a winged white horse. At sunset the mounds throw long shadows across the grass and the whole place turns unreal.",
    facts: [
      "Twenty-three large burial mounds of the Silla aristocracy.",
      "Cheonmachong, excavated in 1973, yielded a gold crown and the 'Heavenly Horse' painting.",
      "The mounds are built of stone and earth, some over 20m high.",
      "Part of the UNESCO Gyeongju Historic Areas.",
    ],
    travelTips: [
      "Walking or cycling is the best way to see Gyeongju.",
      "Late afternoon light is best for photographing the mounds.",
      "Donggung Palace and Wolji Pond are next door and best seen after dark.",
    ],
    bestTime: "April and October–November",
    visitDuration: "1.5 hours",
    ticket: "3,000 KRW",
    openingHours: "09:00–22:00, last entry 21:30",
  },
  cheomseongdae: {
    name: "Cheomseongdae Observatory",
    summary: "East Asia's oldest surviving astronomical observatory, built in the 7th century from 362 stones.",
    story:
      "Nine metres tall and shaped like a bottle, Cheomseongdae was raised around 634 under Queen Seondeok to observe the stars and set the farming calendar. Every number in it means something: 362 stones for the days of the lunar year, twelve courses below and twelve above for the months, and a window that divides the tower into two equal halves. It stands alone on the grass, ringed by flowers in summer and floodlit at night — the single most recognisable image of Gyeongju.",
    facts: [
      "Built around 634 under Queen Seondeok.",
      "The oldest surviving astronomical observatory in East Asia.",
      "Assembled from 362 granite stones and standing 9.17m tall.",
      "National Treasure No. 31 of Korea.",
    ],
    travelTips: [
      "Come at night to see it lit on the open lawn.",
      "Flower fields bloom beside it in September–October.",
      "Combine it with Daereungwon and Wolji Pond in one walking loop.",
    ],
    bestTime: "September–October",
    visitDuration: "45 minutes",
    ticket: "Free",
    openingHours: "09:00–22:00, open year-round; it is floodlit after dark and worth a second visit at night",
  },
  "hahoe-folk-village": {
    name: "Hahoe Folk Village, Andong",
    summary: "A Confucian village wrapped in a loop of river, where the Hahoe masks were born.",
    story:
      "The Nakdong River bends almost the whole way around Hahoe — the name means 'river turning'. Inside sits the village of the Ryu clan, its layout unchanged since the 15th century: tiled houses of the gentry among the thatched homes of tenants, mud walls, a shared well. People still live and farm here. The village is famous for the byeolsingut mask dance, a peasant satire in which even aristocrats could be mocked, and its wooden Hahoe masks are now national treasures.",
    facts: [
      "Inscribed by UNESCO in 2010 together with Yangdong village.",
      "Home of the Ryu clan of Pungsan since the 14th–15th centuries.",
      "The Hahoe wooden masks date from the Goryeo period and are national treasures.",
      "Mask dance performances are staged regularly in the village.",
    ],
    travelTips: [
      "Check the mask dance schedule before you go.",
      "Climb the Buyongdae cliff across the river for the full view of the village.",
      "Andong is also known for jjimdak braised chicken and Andong soju.",
    ],
    bestTime: "September–October (Andong Mask Dance Festival)",
    visitDuration: "3 hours",
    ticket: "5,000 KRW",
    openingHours: "Sunrise to sunset, open year-round",
  },
  "dosan-seowon": {
    name: "Dosan Seowon Confucian Academy, Andong",
    summary: "The academy of Yi Hwang — the face on the 1,000 won note — beside a still lake.",
    story:
      "Yi Hwang (pen name Toegye), the greatest philosopher of Korean Confucianism, turned away from office and went home to teach. The school he built beside the Nakdong River is almost austere: plain wood, low tiled roofs, a bare earth yard and a lecture hall facing the water. Students boarded in the small buildings on either side. That architecture is his philosophy — inward, restrained, following nature. Both Yi Hwang's portrait and this academy appear on the 1,000 won banknote.",
    facts: [
      "Built by Yi Hwang's students in 1574, after his death.",
      "One of nine seowon inscribed by UNESCO in 2019.",
      "Yi Hwang (1501–1570) is the face on the 1,000 won note.",
      "About 40 minutes by car from Hahoe village.",
    ],
    travelTips: [
      "Do it on the same day as Hahoe village if you are staying in Andong.",
      "Weekdays are very quiet — the best time to feel the stillness.",
      "Autumn colour reflected in the lake in front is superb.",
    ],
    bestTime: "October–November",
    visitDuration: "1.5 hours",
    ticket: "1,500 KRW",
    openingHours: "09:00–18:00 (to 17:00 in winter)",
  },
  juwangsan: {
    name: "Juwangsan National Park",
    summary: "A gorge of vertical rock with three waterfalls — the smallest national park in Korea, and the most dramatic.",
    story:
      "Juwangsan is not high, but its rock stands in sheer walls on either side of a narrow cleft, and the main trail runs straight through it. About an hour in you reach three waterfalls in succession, each dropping into a green rock pool. Legend tells of a Chinese prince named Juwang who hid in a cave here, and the mountain took his name. In autumn the gorge burns red; in early summer the falls run strongest.",
    facts: [
      "The smallest national park in the Korean system.",
      "Known for the Yongyeon, Jeolgu and Yongchu waterfalls.",
      "The rock walls formed in ancient volcanic activity and are a recognised geopark.",
      "Daejeonsa temple at the foot dates from the Silla period.",
    ],
    travelTips: [
      "The trail to the three waterfalls is easy and suits families.",
      "You need a car or an intercity bus to Cheongsong.",
      "Late October has the best colour and the biggest weekend crowds.",
    ],
    bestTime: "June and October–November",
    visitDuration: "Half a day",
    ticket: "",
    openingHours: "Entry 04:00–15:00 (April–October) and 05:00–14:00 (November–March)",
  },
  "anapji-donggung": {
    name: "Donggung Palace & Wolji Pond",
    summary: "A Silla palace pond dug in the 7th century, three halls reflected at night in water like glass.",
    story:
      "In 674 King Munmu had a pond dug in the eastern palace, with three islands and twelve artificial hills around it. The banks were deliberately made to wind, so that from no single point can you see the whole surface — an old trick that makes the pond read as larger than it is. When Silla fell the palace was abandoned and the pond dried; a dredging in the 1970s recovered more than thirty thousand objects, among them a fourteen-sided wooden die inscribed with forfeits for losers at a drinking party. Three halls have been rebuilt and are lit from dusk — this is the most photographed night scene in Gyeongju.",
    facts: [
      "The pond was dug in 674 under King Munmu of Silla.",
      "A dredging in the 1970s recovered over 30,000 artefacts.",
      "Among them was a 14-sided wooden die used at court drinking parties.",
      "The banks wind deliberately so the whole surface is never visible at once.",
    ],
    travelTips: [
      "Come after full dark — the reflection is the whole point.",
      "Still air gives the flattest water; after 9pm it thins out.",
      "Cheap and open late, so it slots neatly into the end of a Gyeongju day.",
    ],
    bestTime: "Year-round; evenings",
    visitDuration: "1 hour",
    ticket: "3,000 KRW",
    openingHours: "09:00–22:00, last entry 21:30",
  },
  "gyeongju-national-museum": {
    name: "Gyeongju National Museum",
    summary: "Home of the Silla gold crowns and of Korea's largest bronze bell, cast for a dead king's soul.",
    story:
      "Gyeongju was the Silla capital for nearly a thousand years, and everything dug from the mounds around the city ends up here. The gold room holds the Silla crowns — thin sheet gold bent into trees and antlers, hung with curved jade commas — so fragile that scholars believe they were made for burial rather than wearing. Outside hangs the Emille bell, cast in 771 and weighing close to nineteen tonnes; a grim legend says a child had to be given to the furnace before it would ring, and that its tone is the child calling for its mother. The bell is no longer struck; a recording is played instead.",
    facts: [
      "It displays the gold crowns excavated from the Silla mounds at Gyeongju.",
      "The Emille bell (Divine Bell of King Seongdeok) was cast in 771 and weighs about 18.9 tonnes.",
      "It is Korea's oldest national museum, with roots going back to 1913.",
      "Entry to the permanent galleries is free.",
    ],
    travelTips: [
      "Start in the gold room, then go out to the bell.",
      "The bell is no longer rung; a recording plays at set times.",
      "It is minutes from Wolji pond, so pair them in one late afternoon.",
    ],
    bestTime: "Year-round",
    visitDuration: "2 hours",
    ticket: "Free",
    openingHours: "10:00–18:00; to 19:00 on Sundays and holidays; late opening to 21:00 on Saturdays (March–December) and the last Wednesday of the month",
  },
  "yangdong-folk-village": {
    name: "Yangdong Folk Village",
    summary: "An intact Joseon clan village on a hillside — the gentry above, their tenants below.",
    story:
      "Yangdong was inscribed by UNESCO alongside Hahoe but gets far fewer visitors, and keeps the quiet of a real village because of it. The thing to read here is the terrain: the gentry houses stand high up, tiled, with inner courtyards and their own study halls; the tenants' thatched houses sit at the bottom of the hill. Joseon's social order is written straight into the layout of the land, and you read it simply by walking uphill. The village was founded in the 15th century by the Wolseong Son and Yeogang Yi clans, and their descendants still live in the same houses.",
    facts: [
      "Inscribed by UNESCO in 2010 together with Hahoe village.",
      "Founded in the 15th century by the Wolseong Son and Yeogang Yi clans.",
      "Gentry houses stand high on the slope, thatched tenant houses at the bottom.",
      "About 160 historic houses remain, most of them still lived in.",
    ],
    travelTips: [
      "Far quieter than Hahoe — that is the main reason to choose Yangdong.",
      "The village spreads over a hillside with a lot of climbing; wear easy shoes.",
      "People live here; don't wander into yards or shoot through windows.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "2–3 hours",
    ticket: "4,000 KRW",
    openingHours: "09:00–18:00",
  },
  "bunhwangsa-hwangnyongsa": {
    name: "Bunhwangsa Pagoda & Hwangnyongsa Site",
    summary: "Korea's oldest stone pagoda, beside an empty field that was once East Asia's largest temple.",
    story:
      "Two sites side by side tell the same story two ways. Bunhwangsa pagoda was built in 634 of andesite cut into brick-like blocks — a technique learned from China — and of its original nine storeys only three remain, with stone lions at the corners. A few hundred metres away is Hwangnyongsa: an enormous field of grass with stone column bases set out in rows. A nine-storey wooden pagoda eighty metres tall once stood here, the tallest in East Asia, until the Mongols burned it in 1238. Standing among the column bases and trying to picture that height affects you far more than an intact building would.",
    facts: [
      "Bunhwangsa pagoda was built in 634 and is Korea's oldest surviving stone pagoda.",
      "It originally had nine storeys; three remain.",
      "Hwangnyongsa temple once held a nine-storey wooden pagoda about 80m tall.",
      "Hwangnyongsa was burned by the Mongols in 1238, leaving only the stone bases.",
    ],
    travelTips: [
      "Do both together — they are a few minutes' walk apart.",
      "The Hwangnyongsa field has no shade; avoid midday in summer.",
      "There is an interpretation centre nearby with a model of the nine-storey pagoda.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "1.5 hours",
    ticket: "Both free (Bunhwangsa's heritage fee was abolished in May 2023)",
    openingHours: "09:00–18:00",
  },
  "andong-woryeonggyo": {
    name: "Woryeonggyo Bridge, Andong",
    summary: "Korea's longest wooden footbridge, built after a letter and a pair of woven shoes were found in a grave.",
    story:
      "In 1998 a 16th-century grave was excavated at Andong, and on the man's chest lay a letter from his wife along with a pair of shoes woven from her hair. In it the pregnant widow wrote to her newly dead husband: 'You always said we would live together until our hair turned white — how could you go before me?' The letter moved the whole country, and the city built this wooden bridge across the Nakdong in its memory, its shape taken from those woven shoes. It runs three hundred and eighty-seven metres, is for pedestrians only, and has a roofed pavilion halfway across. At night it is lit and mist rises off the river.",
    facts: [
      "About 387m long, Korea's longest wooden pedestrian bridge.",
      "Built in memory of a 16th-century wife's letter discovered in 1998.",
      "Its shape was inspired by the hair-woven shoes found in the grave.",
      "The Woryeongjeong pavilion sits halfway across for resting.",
    ],
    travelTips: [
      "Come at dusk, as the lights come on and the river mist starts to rise.",
      "Combine it with Hahoe village, about 30 minutes away by car.",
      "There is a fountain and music show on summer weekend evenings.",
    ],
    bestTime: "April–June and September–November; evenings",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "Open all day (lit from dusk)",
  },
  buseoksa: {
    name: "Buseoksa Temple, Yeongju",
    summary: "Korea's oldest wooden building, its swelling columns holding a roof above range upon range of mountains.",
    story:
      "Buseoksa's Muryangsujeon was rebuilt in 1376 and is among the oldest wooden buildings still standing in Korea. What fascinates architects are the columns: they swell at the middle and taper at both ends — entasis, the same correction the ancient Greeks used — so the eye does not read them as pinched. Leaning on the rail in front of the hall you look down over a sea of Sobaeksan ridges fading paler into the distance, which is why people say Buseoksa has the finest view of any Korean temple. The name means 'floating stone', after the large rock beside the hall that legend says once hung in the air.",
    facts: [
      "Muryangsujeon hall was rebuilt in 1376 and is among Korea's oldest wooden structures.",
      "Its columns use entasis — a swelling at the middle of the shaft.",
      "Inscribed by UNESCO in 2018 as part of the Sansa, Buddhist Mountain Monasteries of Korea.",
      "The name means 'floating stone', after the rock beside the main hall.",
    ],
    travelTips: [
      "Reaching the hall means climbing a lot of stone steps; allow an extra 20 minutes.",
      "Late afternoon, with the light raking across the ridges, is the best hour.",
      "Yeongju is far from the other sights — you really want your own car.",
    ],
    bestTime: "October–November (autumn colour)",
    visitDuration: "2 hours",
    ticket: "Free (the cultural heritage fee was abolished in May 2023); parking charged separately",
    openingHours: "08:00–18:00",
  },
  "pohang-homigot": {
    name: "Homigot Cape, Pohang",
    summary: "The easternmost point of mainland Korea, where a giant bronze hand rises out of the sea to catch the New Year sun.",
    story:
      "Homigot is where the sun first touches mainland Korea each day, and on New Year's Eve the country comes here. On the headland stands 'The Hands of Harmony': two large bronze hands, one on the shore and one rising out of the water some tens of metres off, positioned so that at sunrise the sun sits exactly between the fingers of the seaward hand. Outside the New Year it is very quiet, just sea wind and a few stalls selling dried squid. Pohang next door is Korea's steel city, so there is always a smokestack somewhere at the edge of the view.",
    facts: [
      "The easternmost point of the Korean mainland.",
      "'The Hands of Harmony' is a pair of bronze hands, one on shore and one in the sea.",
      "A sunrise festival is held here every 1 January.",
      "Pohang is Korea's largest steel-producing centre.",
    ],
    travelTips: [
      "1 January is extremely busy; almost every other day is empty.",
      "The seaward hand photographs best just as the sun clears the horizon.",
      "The wind on the cape is strong year-round — dress warmer than you expect.",
    ],
    bestTime: "Sunrise, especially 1 January",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "All day",
  },
  ulleungdo: {
    name: "Ulleungdo Island",
    summary: "A volcanic island nearly three hundred kilometres offshore, ringed by cliffs with almost no flat ground.",
    story:
      "Ulleungdo sits in the East Sea nearly three hundred kilometres from the mainland — the fast ferry takes two and a half hours and cancels often for swell. The island is a volcano rising out of deep water, so there is barely a level place on it: the ring road is cut straight into the cliffs through a run of short tunnels, and houses cling to steep gullies. The one real piece of flat ground is the Nari basin in the middle, where wild greens are grown and houses are roofed with bark shingles. It is one of the rare Korean islands tourism has not flattened — partly because getting there is so hard.",
    facts: [
      "About 290km from the mainland; the fast ferry takes 2.5–3 hours.",
      "A volcanic island whose highest point, Seonginbong, reaches 984m.",
      "The Nari basin is the only substantial area of flat ground on the island.",
      "Local specialities include wild mountain greens, squid and free-ranging Ulleung beef.",
    ],
    travelTips: [
      "Ferries cancel frequently for swell — leave at least a spare day in your plan.",
      "If you get seasick, take something before boarding; the crossing is rough.",
      "Boats run on to Dokdo from here, but only land when the sea is calm.",
    ],
    bestTime: "May–June and September–October",
    visitDuration: "2–3 days",
    ticket: "Ferry around 160,000–180,000 KRW return (80,000–90,000 each way), depending on port and operator",
    openingHours: "By ferry schedule, usually 1–3 sailings a day",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  gyeongbuk: {
    name: "North Gyeongsang",
    summary: "The cradle of the Silla kingdom and Korean Confucianism — Gyeongju, Andong and villages still lived in.",
    story:
      "North Gyeongsang is where Korean history lies thickest. Gyeongju was the Silla capital for nearly a thousand years, and the city today is an open-air museum: royal mounds among the streets, a 7th-century observatory, Bulguksa temple and the Seokguram grotto on the mountain. Further north, Andong keeps Hahoe village and its Confucian academies, where clan rites are still genuinely practised rather than performed for visitors. In between are mountains, old temples and rock gorges like Juwangsan.",
    bestTime: "April (cherry blossom) and October–November",
    specialties: ["Andong jjimdak", "Andong salted mackerel", "Gyeongju rice bread", "Andong soju"],
  },
};
