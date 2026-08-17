import type { DestinationTranslation, ProvinceTranslation } from "@/lib/types";

export const destinations: Record<string, DestinationTranslation> = {
  gyeongbokgung: {
    name: "Gyeongbokgung Palace",
    summary:
      "The main palace of the Joseon dynasty, its curved tile roofs mirrored in the glass towers of modern Seoul.",
    story:
      "Step through Gwanghwamun gate and the traffic of central Seoul falls away behind you. Gyeongbokgung — the 'palace greatly blessed by heaven' — was raised in 1395, only three years after Joseon was founded. Geunjeongjeon Hall, where kings held court, stands on a double stone terrace flanked by rank stones marking where each official stood. Behind it, Gyeonghoeru pavilion floats on a square pond: lotus in summer, frozen and mirroring Bugaksan in winter. The palace burned in the Imjin War and was later dismantled under colonial rule; what you see today is a restoration that has run for decades and is still going on.",
    facts: [
      "Built in 1395, the first and largest of the five Joseon palaces.",
      "The Sumunjang changing of the guard takes place twice a day in front of Gwanghwamun.",
      "Gyeonghoeru pavilion rests on 48 stone pillars and once hosted royal banquets for foreign envoys.",
      "Entry is free for visitors wearing hanbok.",
      "The National Palace Museum and National Folk Museum sit inside the grounds.",
    ],
    travelTips: [
      "Rent hanbok near Anguk station — it waives the ticket and makes for better photos.",
      "Closed on Tuesdays; switch to Changdeokgung if your day falls wrong.",
      "Arrive at 9am to photograph Geunjeongjeon before the crowds.",
    ],
    bestTime: "April–May (spring blossom) and October–November (autumn colour)",
    visitDuration: "2–3 hours",
    ticket: "3,000 KRW (free in hanbok)",
    openingHours: "09:00–18:00 (to 17:00 Nov–Feb, to 18:30 Jun–Aug), closed Tuesdays",
  },
  changdeokgung: {
    name: "Changdeokgung Palace & Secret Garden",
    summary:
      "A UNESCO-listed palace famous for bending to the shape of the hill instead of forcing the hill to bend to it.",
    story:
      "If Gyeongbokgung was power on display, Changdeokgung was where the kings actually wanted to live — and they lived here longer than in any other palace. Rather than level the ground for a symmetrical axis, Joseon architects let the halls follow the slope, each roof at its own height. Behind them lies Huwon, the 'Secret Garden' of more than 30 hectares, open only by guided tour: a square pond for the earth, a round island for the heavens, and small pavilions where kings came to read. In autumn the whole garden turns copper.",
    facts: [
      "Inscribed as a UNESCO World Heritage Site in 1997.",
      "Joseon kings lived here for more than 250 years.",
      "The Secret Garden can only be entered on a guided tour with limited places.",
      "Injeongjeon Hall hosted the coronations of several kings.",
    ],
    travelTips: [
      "Book the Secret Garden tour online — English slots sell out quickly.",
      "Palace and garden tickets are separate; buy both.",
      "Wear comfortable shoes: the garden paths are gravel and packed earth.",
    ],
    bestTime: "Late October to mid-November (autumn leaves)",
    visitDuration: "2–3 hours",
    ticket: "3,000 KRW (Huwon guided tour a further 8,000 KRW)",
    openingHours: "09:00–18:00 (to 17:30 Nov–Jan, to 18:30 Jun–Aug), closed Mondays",
  },
  "bukchon-hanok-village": {
    name: "Bukchon Hanok Village",
    summary: "A hillside quarter of wooden hanok houses that people still live in, wedged between two palaces.",
    story:
      "Bukchon means 'northern village' — north of the Cheonggyecheon stream, where Joseon officials built their homes. Narrow stone lanes climb the slope between rows of curved black-tiled roofs, and when you turn around, N Seoul Tower rises behind them. This is not an open-air museum: residents still live in these houses, which is why the signs ask you to keep your voice down. Many hanok have become craft workshops, tea rooms or guesthouses — and the best way to understand a hanok is to sleep one night on its warm ondol floor.",
    facts: [
      "Around 900 hanok houses, most built in the early 20th century.",
      "Tucked between Gyeongbokgung and Changdeokgung palaces.",
      "Visiting hours are limited to protect residents' daily life.",
      "Several hanok open as workshops for knot-making, natural dyeing and tea ceremony.",
    ],
    travelTips: [
      "Avoid arriving after 5pm — access is restricted to keep the quarter quiet.",
      "Alley 8 (Bukchon-ro 11-gil) is the classic rooftop viewpoint.",
      "Combine it with Samcheong-dong next door for lunch.",
    ],
    bestTime: "Year-round, best in early morning",
    visitDuration: "1–2 hours",
    ticket: "",
    openingHours: "From 1 January 2026 tourists may enter the Bukchon-ro 11-gil zone only between 10:00 and 17:00; being there outside those hours carries a 100,000 KRW fine. This is enforced, not advisory",
  },
  "n-seoul-tower": {
    name: "N Seoul Tower (Namsan)",
    summary: "The peak in the middle of the city, where Seoul spreads out as a sea of lights with no visible end.",
    story:
      "Namsan is a mountain right in the centre of Seoul, and the cable car from Myeongdong gets you up it in minutes. The broadcast tower built in 1971 is now an observatory: from the top the Han River cuts the city in two, the towers of Gangnam rise on the south bank, and to the north the palace roofs sit low among the buildings. Sunset is the moment worth waiting for — the city lights come on in patches. Along the railings at the foot of the tower hang thousands of love padlocks, rusting in the weather.",
    facts: [
      "The tower is 236m tall, on top of Namsan's 243m peak.",
      "Opened in 1971, originally as a television broadcast tower.",
      "The tower lights change colour with the city's air quality index.",
      "Reachable by cable car, Namsan bus or a 40-minute walking trail.",
    ],
    travelTips: [
      "Go up an hour before sunset to see the city by day and by night.",
      "The cable car is busiest at weekends — the walking trail is a pleasant alternative.",
      "Clear air after rain gives the longest views.",
    ],
    bestTime: "September–November, on clear days",
    visitDuration: "2 hours",
    ticket: "Observatory 21,000 KRW (cable car extra)",
    openingHours: "10:30–22:30 weekdays, 10:00–23:00 weekends; last entry 30 min before closing",
  },
  myeongdong: {
    name: "Myeongdong Street",
    summary: "Seoul's loudest shopping quarter, which turns into a street of open-air kitchens after dark.",
    story:
      "By day Myeongdong is cosmetics: every shop hands out samples, staff call out in four languages from the doorways. At dusk food carts are wheeled into the middle of the street and the whole quarter changes smell — fiery red tteokbokki, cheese pulled into strings, crayfish grilled in garlic butter, hot gyeran-ppang egg bread. You eat standing up, napkin in hand, then move on. Above it all stands Myeongdong Cathedral in red brick, a quiet witness to the neighbourhood since 1898.",
    facts: [
      "One of the most expensive retail districts in Asia by rent.",
      "Myeongdong Cathedral, built in 1898, is the seat of the Archdiocese of Seoul.",
      "Street food carts mostly appear from 4pm until late.",
      "Tax refund counters for foreign visitors are in the district itself.",
    ],
    travelTips: [
      "Bring small cash — many carts don't take cards.",
      "Keep cosmetics receipts for the airport tax refund.",
      "Saturday night is the busiest; weekdays are far easier.",
    ],
    bestTime: "Evenings, year-round",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "There are no official hours; shops open between 10:00 and 11:00 and close between 21:00 and 22:00, while the street-food carts appear from late afternoon into the night",
  },
  "hangang-yeouido-park": {
    name: "Yeouido Hangang Park",
    summary: "The riverside lawn where Seoul spreads out mats, orders fried chicken and watches the sun set behind the bridges.",
    story:
      "The Han River is so wide that the far bank looks like a different city, and Seoulites have turned both banks into their shared living room. Late afternoon, the Yeouido lawn fills with mats and pop-up tents; ordering fried chicken delivered to you on the grass is a ritual. Rent a bike and ride the riverside path, or take a cruise past Banpo Bridge as it fountains water to music. At the end of March the Yunjung-ro road just behind the park turns white with cherry blossom and the whole city comes.",
    facts: [
      "One of Seoul's 11 Han River parks.",
      "The Yeouido Cherry Blossom Festival is held in early April each year.",
      "Nearby Banpo Bridge stages a rainbow fountain show on summer evenings.",
      "A Ttareungi public bike station sits inside the park.",
    ],
    travelTips: [
      "Weekends are packed — Thursday or Friday evening gives you a better spot.",
      "Easiest plan: buy a mat and food at the convenience store beside the lawn.",
      "Bring a light jacket; the river wind is cool even in summer.",
    ],
    bestTime: "April (cherry blossom) and September–October",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Open all day",
  },
  "jongmyo-shrine": {
    name: "Jongmyo Shrine",
    summary:
      "Where the spirit tablets of the Joseon kings are kept: one long wooden hall, so bare it becomes solemn.",
    story:
      "Jongmyo has no statues, no paintings, no gilding. Only Jeongjeon — a wooden colonnade over a hundred metres long with nineteen closed doors, each holding the tablets of one king and queen. The stone path in is split into three lanes: the raised middle one is for the spirits, the living walk to either side. The emptiness is deliberate; Confucian architecture uses proportion and silence instead of ornament. Each May the Jongmyo Jerye rite is performed exactly as it was in the 15th century, with court musicians and black-hatted dancers moving as slowly as clockwork.",
    facts: [
      "Inscribed as a UNESCO World Heritage Site in 1995.",
      "Jeongjeon hall is about 101m long — the longest traditional wooden building in Asia.",
      "The Jongmyo Jerye rite and its Jeryeak music are on UNESCO's intangible heritage list.",
      "On weekdays entry is by guided tour only; Saturdays are free-roaming.",
      "It was once joined to Changdeokgung by a strip of forest, now restored as a footbridge.",
    ],
    travelTips: [
      "Check the tour timetable by language before you go — English slots are limited.",
      "Come on a Saturday if you want to wander and linger in the Jeongjeon courtyard.",
      "Pair it with Changdeokgung; the two are a footbridge apart.",
    ],
    bestTime: "May (the Jongmyo Jerye rite) and October–November",
    visitDuration: "1–1.5 hours",
    ticket: "1,000 KRW (free under 19 and over 65)",
    openingHours: "09:00–18:00 (to 17:30 Nov–Jan, to 18:30 Jun–Aug), closed Tuesdays",
  },
  "ikseon-dong": {
    name: "Ikseon-dong Hanok Alleys",
    summary:
      "A working-class hanok quarter from the 1920s, now a maze of narrow lanes with cafés hidden behind wooden doors.",
    story:
      "If Bukchon is the hanok of officials, Ikseon-dong is the hanok of ordinary people: small houses with tiny square courtyards, built by the dozen in the 1920s for workers moving into the city. The quarter came close to demolition and was saved by the very thing that made it hard to clear — lanes too narrow for machinery. Now every wooden door opens onto a café, a bookshop or a makgeolli bar, the old tiled roofs untouched and the interiors entirely modern. The alleys are tight enough that two people must turn sideways to pass, which is exactly why it is best at night, when the paper lanterns come on.",
    facts: [
      "The hanok here were built mostly in the 1920s, for ordinary working families.",
      "The quarter was once slated for redevelopment and was preserved from the mid-2010s.",
      "The narrowest lane is barely a metre wide.",
      "It sits directly behind Jongno, a few dozen steps from Jongno 3-ga station.",
    ],
    travelTips: [
      "The cafés are small and fill up — go before 11am or after 8pm.",
      "Come in the evening: lamplight through paper doors beats the daytime view.",
      "The lanes are very tight; avoid suitcases and large groups.",
    ],
    bestTime: "Year-round; best in the evening",
    visitDuration: "1.5–2 hours",
    ticket: "",
    openingHours: "The alleys are open all day with no set hours; cafés and restaurants generally run 11:00–23:00",
  },
  insadong: {
    name: "Insa-dong",
    summary:
      "The street of hanji paper, ink brushes and tea — the one place in Seoul where even the Starbucks sign is written in Korean.",
    story:
      "Insa-dong has been Seoul's antiques and craft street since Joseon times, when impoverished officials brought the contents of their houses out to sell. The main run is about seven hundred metres, lined with hanji paper shops, potteries, brush makers and traditional tea houses set back in courtyards. District rules require every sign on the street to be written in hangul — foreign chains included — which gives the whole stretch its own visual rhythm. Ssamziegil, a building you climb by a spiral ramp rather than stairs, gathers the small craft studios. At weekends the main street closes to traffic and turns into an open-air stage.",
    facts: [
      "Seoul's oldest antiques and calligraphy quarter.",
      "Jongno district requires shop signs on the street to be written in hangul.",
      "The Ssamziegil building is climbed by a spiral ramp, with no main staircase.",
      "The main street is closed to vehicles at weekends.",
    ],
    travelTips: [
      "Turn into the side lanes — the best tea houses and potteries are tucked out of sight.",
      "Try omija five-flavour tea or jujube tea at a traditional tea house.",
      "Weekends are festive; weekdays are easier going.",
    ],
    bestTime: "Year-round",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "The street is always open; shops generally run 10:00–21:00. At weekends the main street is closed to cars and becomes pedestrian-only",
  },
  "gwangjang-market": {
    name: "Gwangjang Market",
    summary:
      "A covered market over a century old, where mung bean pancakes are fried on a hot griddle right in front of you.",
    story:
      "Gwangjang opened in 1905 as Korea's first permanent market, and its best part is the row of food stalls down the middle. You sit on a plastic stool shoulder to shoulder with strangers while the woman in front of you grinds mung beans in a stone mill and ladles the batter onto the griddle — bindaetteok comes off crisp, eaten with pickled onion. Beside it are mayak gimbap, finger-sized rice rolls dipped in mustard, and fermented skate pungent enough to make your eyes water. The floor above sells fabric and second-hand hanbok and sees almost no tourists. The market is both a place to eat and a slice of Seoul that was never tidied up.",
    facts: [
      "Opened in 1905 as Korea's first permanent market.",
      "Best known for bindaetteok, mayak gimbap and fermented skate.",
      "The second floor is a fabric and used-hanbok market, mostly for locals.",
      "It sits on the Cheonggyecheon stream, walkable from Jongno 5-ga station.",
    ],
    travelTips: [
      "Go before 11:30 or after 2pm to avoid queuing for a seat.",
      "Bring cash — many stalls still don't take cards.",
      "Some stalls add a seating charge; ask prices before ordering more drinks.",
    ],
    bestTime: "Year-round",
    visitDuration: "1.5 hours",
    ticket: "",
    openingHours: "The food alley runs 09:00–23:00 every day of the year; the fabric and general stalls run 09:00–18:00 and close on Sundays",
  },
  cheonggyecheon: {
    name: "Cheonggyecheon Stream",
    summary:
      "A stream once buried under an elevated motorway, now running again six metres below street level.",
    story:
      "For the second half of the 20th century Cheonggyecheon lay under an elevated motorway — the emblem of a city industrialising in a hurry. In 2003 Seoul did something few cities dare: it tore the motorway down and brought the stream back. The result is a corridor almost six kilometres long through the centre, sunk several metres below the road, so the traffic noise all but vanishes as you step down. There are stepping stones to cross, an artificial waterfall at the head, and in winter the whole channel is strung with lanterns for the festival. Seoulites walk here on their lunch break as a way of leaving the city without leaving it.",
    facts: [
      "The restoration was completed in 2005 after the elevated motorway was demolished.",
      "The stream runs about 11km; the central walkable stretch is close to 6km.",
      "Summer temperatures along the channel run several degrees below the street above.",
      "The Seoul Lantern Festival is held along the stream in winter.",
    ],
    travelTips: [
      "Drop down at Cheonggye Plaza and walk downstream towards Gwangjang Market.",
      "In the evening the underwater lighting comes on and it is cooler and quieter.",
      "The path can close after heavy rain — watch for the warning boards.",
    ],
    bestTime: "May–June, September–October and the lantern festival",
    visitDuration: "1 hour",
    ticket: "",
    openingHours: "Open all day",
  },
  bongeunsa: {
    name: "Bongeunsa Temple",
    summary:
      "A thousand-year-old temple facing the Gangnam convention centre, its 23-metre stone Buddha standing in a forest of glass.",
    story:
      "Nowhere in Seoul stacks two eras so plainly as Bongeunsa. The temple was founded in 794; directly across the road are COEX and the Gangnam towers, lit all night. Step through the Iljumun gate and the street noise fades; the courtyard fills with paper lanterns at Buddha's Birthday, and a twenty-three-metre stone Maitreya looks straight out over the financial district. The temple runs a templestay for foreign visitors: up at four in the morning, wooden gong, vegetarian meals eaten in complete silence. On Thursday evenings there is a meditation and tea session in English.",
    facts: [
      "Founded in 794 during Silla, originally as Gyeonseongsa.",
      "The stone Maitreya Buddha stands about 23m tall, completed in 1996.",
      "The temple holds more than 3,400 Buddhist woodblock scriptures.",
      "It offers a templestay and English-language meditation sessions.",
    ],
    travelTips: [
      "Book the templestay weeks ahead; English slots go quickly.",
      "Visit around Buddha's Birthday to see the courtyard under a roof of lanterns.",
      "Bongeunsa station (line 9) exits at the gate — no walk required.",
    ],
    bestTime: "April–May (lantern season) and October–November",
    visitDuration: "1.5 hours",
    ticket: "Free (Templelife programme 30,000 KRW)",
    openingHours: "03:00–22:00, open every day of the year",
  },
  "dongdaemun-ddp": {
    name: "Dongdaemun Design Plaza",
    summary:
      "Zaha Hadid's curving aluminium mass, set beside the foundations of the old city wall that were dug up while building it.",
    story:
      "DDP looks like something that landed in Dongdaemun: more than forty thousand curved aluminium panels, no two alike, and an interior in which a straight line is hard to find. While excavating the foundations, workers struck the base of Seoul's Joseon-era city wall along with barracks and a water conduit — instead of covering it over, the city kept it and turned it into a heritage park at the building's foot. At night the outer slope is lit with tens of thousands of LED flowers. The Dongdaemun district around it is a wholesale fabric and clothing market that trades until dawn, running on a clock entirely out of step with the rest of the city.",
    facts: [
      "Designed by Zaha Hadid and opened in 2014.",
      "The shell is made of more than 45,000 aluminium panels, each a different shape.",
      "Joseon city-wall remains found during construction were preserved as a history park.",
      "The surrounding Dongdaemun wholesale market trades from evening until dawn.",
    ],
    travelTips: [
      "Come in the evening for both the LED field and the Dongdaemun night market.",
      "Indoor exhibitions are ticketed separately; the grounds and roof slope are free.",
      "Dongdaemun History & Culture Park station connects straight into the basement.",
    ],
    bestTime: "Year-round; best in the evening",
    visitDuration: "1.5–2 hours",
    ticket: "Grounds free; exhibitions typically 8,000–15,000 KRW",
    openingHours: "Grounds open 24 hours; exhibition halls 10:00–19:00 (to 21:00 Wed and Fri), closed Mondays",
  },
  hongdae: {
    name: "Hongdae",
    summary:
      "The quarter around Hongik art university, where student bands set up amplifiers in the street and play until midnight.",
    story:
      "Hongdae takes its name from Hongik University, Korea's most respected art school, and the whole quarter has the character of art students: graffitied walls, cafés in converted workshops, record shops, and street stages that appear the moment it gets dark. At weekends the pedestrian street outside the university gate fills with crowds watching cover dance crews and indie bands — plenty of well-known Korean acts started on exactly this pavement. The further you walk into the lanes towards Yeonnam-dong, the slower the pace gets: small bars, trees, and a long park built on a disused railway line.",
    facts: [
      "Named after Hongik University, Korea's leading art school.",
      "Street performances happen outside the university gate almost every weekend night.",
      "Gyeongui Line Forest Park was converted from a disused railway.",
      "It has the highest concentration of live music and indie clubs in Seoul.",
    ],
    travelTips: [
      "Friday and Saturday nights have the most street performances.",
      "For something quieter, head towards Yeonnam-dong or Sangsu-dong.",
      "Hongik University station has many exits — exit 9 is closest to the walking street.",
    ],
    bestTime: "Year-round; weekend nights",
    visitDuration: "2–3 hours",
    ticket: "",
    openingHours: "The streets are always open; busking and live music run mainly from 19:00 to midnight, busiest at weekends",
  },
  "lotte-world-tower": {
    name: "Lotte World Tower & Seoul Sky",
    summary:
      "Korea's tallest building, with a glass floor almost half a kilometre up looking straight down onto Jamsil.",
    story:
      "Lotte World Tower stands 555 metres and tapers as it rises, a shape drawn from Korean writing brushes and ceramics. The double-decker lift to the Seoul Sky observatory takes under a minute, and on floor 118 there is a stretch of clear glass floor — stand on it and the traffic in Jamsil is the size of grain. On a clear day the view reaches Bukhansan in the north and the Gwanaksan ridge in the south. At the foot of the tower is Seokchon Lake, ringed with cherry blossom in early April, and the largest indoor amusement park in the world.",
    facts: [
      "555m tall with 123 floors, the tallest building in Korea.",
      "The Seoul Sky observatory occupies floors 117–123, with a glass floor on 118.",
      "The observatory lift travels at about 600m per minute.",
      "Lotte World at its base is the world's largest indoor amusement park.",
    ],
    travelTips: [
      "Book a timed ticket online; it is cheaper and faster than the counter.",
      "Choose a slot 45 minutes before sunset to catch both day and night.",
      "In early April, walk the loop around Seokchon Lake for the cherry blossom.",
    ],
    bestTime: "April (cherry blossom) and October–November (clear skies)",
    visitDuration: "2 hours",
    ticket: "Seoul Sky 31,000 KRW (adult)",
    openingHours: "10:30–22:00 (to 23:00 Fri, Sat and holidays); last ticket 1 hour before closing",
  },
  "national-museum-korea": {
    name: "National Museum of Korea",
    summary:
      "The country's largest museum, where two Pensive Bodhisattvas sit in a dark room kept for them alone.",
    story:
      "The National Museum runs like a three-hundred-metre stone wall, and the great opening at its centre frames Namsan and N Seoul Tower exactly — a very deliberate piece of staging. Inside is a walk from the stone age to late Joseon, but what brings people back is the Room of Quiet Contemplation: two gilt-bronze Pensive Bodhisattvas from the 6th and 7th centuries, set in a near-black room with no vitrine and no wall of text, only light falling on a half-smile. The ten-storey Gyeongcheonsa pagoda rising through the main hall is the one exhibit kept indoors because it is too large to stand outside.",
    facts: [
      "Korea's largest museum, on its present site since 2005.",
      "The Room of Quiet Contemplation holds two gilt-bronze Pensive Bodhisattvas, both national treasures.",
      "The ten-storey Gyeongcheonsa pagoda is about 13m tall and dates from 1348.",
      "Entry to the permanent galleries is free.",
    ],
    travelTips: [
      "Go to the Room of Quiet Contemplation first, early, while it is still empty.",
      "The museum is vast — pick two floors rather than trying to see everything.",
      "Ichon station (line 4 and Jungang) has an underground passage straight to the museum.",
    ],
    bestTime: "Year-round",
    visitDuration: "2–3 hours",
    ticket: "Free (permanent galleries); special exhibitions ticketed separately",
    openingHours: "09:30–17:30, until 21:00 Wed and Sat; outdoor garden 07:00–22:00",
  },
  bukhansan: {
    name: "Bukhansan National Park",
    summary:
      "A national park inside the capital's own boundary — forty minutes on the subway and you are at the foot of the granite trail.",
    story:
      "Very few capitals contain a real national park, and Bukhansan is why Seoulites are so devoted to hiking. From the subway station it is a few hundred metres to the park gate, then the trail steepens through pine forest and white granite slabs. Baegundae summit is 836 metres, and the last stretch means hauling yourself up bare rock on fixed cables — the reward is Seoul filling the entire southern horizon. Along the ridge the Joseon-era Bukhansanseong wall still runs. At weekends the trail is as busy as a street, everyone in bright hiking jackets with a flask of kimbap in the pack.",
    facts: [
      "The highest peak is Baegundae at 836m.",
      "It has the highest number of visitors per square kilometre of any national park in the world.",
      "Bukhansanseong fortress on the mountain was rebuilt in 1711 as a royal refuge.",
      "There are many routes up; the Bukhansanseong and Dobongsan trails are the most used.",
    ],
    travelTips: [
      "Wear hiking shoes with real grip — the granite is far more slippery than it looks.",
      "Avoid autumn weekends if you dislike crowds; early Tuesday is the calmest.",
      "In winter the trail ices over; crampons are sold at the park gate.",
    ],
    bestTime: "April–June and September–November",
    visitDuration: "Half to a full day",
    ticket: "",
    openingHours: "Entry 04:00–17:00 (to 16:00 Dec–Feb); the Baegundae route can close once its daily cap is reached",
  },
  "seoul-forest": {
    name: "Seoul Forest",
    summary:
      "A racecourse and waterworks turned into a large park, with a herd of deer living loose in a patch of woodland.",
    story:
      "Before 2005 this ground was, in turn, a Joseon royal hunting park, a racecourse, and a water treatment plant. The city folded all of it into a park of nearly a hundred hectares in five parts: woodland, a riverside garden on the Han, an ecological wetland, a sports area, and a deer park where sika deer wander behind a low fence. The old settling tanks of the waterworks were kept and planted, making a strange sunken garden. At weekends the crowd from Seongsu-dong — a district of old workshops now full of coffee roasters — comes over with picnic mats, and in autumn the ginkgo avenue along the main path turns brilliant yellow.",
    facts: [
      "Opened in 2005 on the site of a former racecourse and water treatment plant.",
      "About 116 hectares, divided into five distinct areas.",
      "There is a deer park with a resident herd of sika deer.",
      "The old settling tanks of the waterworks were kept as a sunken garden.",
    ],
    travelTips: [
      "Hire a public bike; walking all five areas is a long way.",
      "Combine it with the Seongsu-dong café district next door.",
      "Late October is when the ginkgo avenue is at its brightest.",
    ],
    bestTime: "April–May and October–November",
    visitDuration: "2 hours",
    ticket: "",
    openingHours: "Open all day",
  },
};

export const provinces: Record<string, ProvinceTranslation> = {
  seoul: {
    name: "Seoul",
    summary: "A capital where Joseon palaces, night markets and glass towers all crowd into the same frame.",
    story:
      "Seoul is a six-hundred-year-old city compressed into a very new shape. In the morning you stand in the court of Gyeongbokgung listening to the changing-of-the-guard drums; in the afternoon you get lost in the hanok lanes of Bukchon; at night you eat standing up in Myeongdong and then ride up Namsan to watch the city light up on both banks of the Han. The four seasons are sharply drawn: cherry blossom along the river in spring, downpours and humid nights in summer, high skies and red leaves in autumn, snow on palace roofs in winter. The subway is dense and punctual enough that getting around barely requires thought.",
    bestTime: "April–May (cherry blossom) and September–November (autumn colour)",
    specialties: ["Gimbap", "Tteokbokki", "Samgyetang", "Korean fried chicken"],
  },
};
