import type { DishTranslation } from "@/lib/types";

export const dishes: Record<string, DishTranslation> = {
  "kr-kimchi-jjigae": {
    name: "Kimchi jjigae",
    summary: "A bubbling pot of sour kimchi with pork and tofu — the most familiar home meal in Korea.",
    story:
      "The sourer the kimchi, the better the stew, so this dish was born from using up old kimchi. Pork belly is rendered, the kimchi fried in the fat, then water, tofu and spring onion go in. At restaurants it arrives still boiling on a portable burner, with rice and a few side dishes.",
    ingredients: ["Sour kimchi", "Pork belly", "Tofu", "Spring onion", "Gochugaru chilli flakes"],
    flavor: "Sour, spicy, deeply savoury",
    bestTime: "Lunch or dinner",
  },
  "kr-samgyetang": {
    name: "Samgyetang (ginseng chicken soup)",
    summary: "A young chicken stuffed with glutinous rice, ginseng and jujube, simmered in a stone pot — food for the hottest days.",
    story:
      "Koreans eat hot food to beat the heat: on the three hottest 'sambok' days of summer, samgyetang shops have queues down the street. The bird is stuffed with rice, fresh ginseng, chestnuts and jujube, then simmered until the meat falls off the bone and the broth turns milky. You season it yourself with salt and pepper at the table.",
    ingredients: ["Young chicken", "Ginseng", "Glutinous rice", "Jujube", "Garlic"],
    flavor: "Clean, lightly rich, fragrant with ginseng",
    bestTime: "Summer",
  },
  "kr-tteokbokki": {
    name: "Tteokbokki (spicy rice cakes)",
    summary: "Chewy rice cake sticks in a sweet-hot chilli sauce — Korea's national street food.",
    story:
      "The original palace version was stir-fried in soy sauce and wasn't spicy at all. The red gochujang version appeared in Sindang market in the 1950s and spread across the country. The rice cakes cook with fish cake, boiled egg and spring onion, and everybody orders a plate of fried snacks to dip in the sauce.",
    ingredients: ["Tteok rice cakes", "Gochujang", "Fish cake", "Boiled egg", "Spring onion"],
    flavor: "Sweet-hot and chewy",
    bestTime: "Late afternoon and evening",
  },
  "kr-gimbap": {
    name: "Gimbap",
    summary: "Seaweed rice rolls with egg, carrot and pickled radish — every family's packed lunch.",
    story:
      "Gimbap belongs to day trips: mothers rise early, roll a stack and cut them into a box. The rice is seasoned with sesame oil and salt rather than vinegar, and the filling changes from house to house — fish cake, stir-fried beef, rolled egg, spinach, yellow pickled radish. Gimbap shops open all day and are the cheapest quick meal in Korea.",
    ingredients: ["Rice with sesame oil", "Gim seaweed", "Rolled egg", "Pickled radish", "Carrot"],
    flavor: "Light, fragrant with sesame",
    bestTime: "Lunch, or to take away",
  },
  "kr-fried-chicken": {
    name: "Korean fried chicken (chimaek)",
    summary: "Double-fried chicken with a thin, crackling crust, eaten with beer — Korea's Friday-night ritual.",
    story:
      "Chimaek joins 'chicken' and 'maekju' (beer). The bird is fried twice so the crust stays crisp, then either left plain or coated in sweet-spicy yangnyeom sauce. People have it delivered onto the grass beside the Han River, or sit in a shop until late. This is the dish that made Korea's fried chicken chains outnumber McDonald's worldwide.",
    ingredients: ["Chicken", "Frying batter", "Yangnyeom sauce", "Pickled radish", "Beer"],
    flavor: "Crisp, salty-sweet, gently spicy",
    bestTime: "Evening",
  },
  "kr-bossam": {
    name: "Bossam (boiled pork wraps)",
    summary: "Sliced boiled pork belly wrapped in cabbage leaves with radish kimchi and salted shrimp.",
    story:
      "Bossam comes from gimjang day, when a household salts a hundred cabbages at once and lunch is boiled pork with the kimchi still fresh from the mixing bowl. The pork is simmered with soybean paste, tea leaves and cinnamon so it never feels heavy; you wrap it with cabbage, raw garlic, green chilli and a dab of salted shrimp.",
    ingredients: ["Pork belly", "Napa cabbage", "Radish kimchi", "Salted shrimp", "Raw garlic"],
    flavor: "Soft and rich, savoury and fresh",
    bestTime: "Winter evenings",
  },
  "kr-jjajangmyeon": {
    name: "Jjajangmyeon (black bean noodles)",
    summary: "Noodles in black chunjang sauce with pork and onion — a Chinese dish born in Incheon's Chinatown.",
    story:
      "In the late 19th century, Shandong merchants at Incheon port mixed black bean paste with onion, pork and Korean noodles to feed dock workers. The dish spread nationwide and became the thing Koreans order for delivery more than anything else. On 14 April — 'Black Day' — single people gather to eat it together.",
    ingredients: ["Fresh noodles", "Chunjang black bean paste", "Pork", "Onion", "Shredded cucumber"],
    flavor: "Salty-sweet and rich",
    bestTime: "Lunch",
  },
  "kr-suwon-galbi": {
    name: "Suwon galbi (grilled beef ribs)",
    summary: "Large-cut beef ribs, lightly seasoned and charcoal-grilled so the meat speaks for itself.",
    story:
      "Suwon once had the largest cattle market in the capital region, established by King Jeongjo to supply Hwaseong fortress. Galbi here is marinated more lightly than elsewhere, cut in big pieces, seasoned mainly with salt and grilled over charcoal until the edges char. It comes with rib soup and rice steamed in a stone pot.",
    ingredients: ["Beef short ribs", "Salt", "Sesame oil", "Spring onion", "Soy dipping sauce"],
    flavor: "Sweet with beef, smoky from charcoal",
    bestTime: "Evening",
  },
  "kr-dakgalbi": {
    name: "Chuncheon dakgalbi",
    summary: "Chicken stir-fried in chilli paste on a great iron pan with cabbage, sweet potato and rice cake — finished with fried rice.",
    story:
      "Born in Chuncheon in the 1960s as a cheap dish for soldiers and students, dakgalbi is cooked on a cast-iron pan in the middle of your table. When it is nearly finished you ask for rice and seaweed to fry in what remains of the sauce — the best part of the meal. A whole street in Chuncheon sells nothing else.",
    ingredients: ["Chicken", "Gochujang", "Cabbage", "Sweet potato", "Rice cake"],
    flavor: "Sweet-hot and full-bodied",
    bestTime: "Evening",
  },
  "kr-makguksu": {
    name: "Makguksu (cold buckwheat noodles)",
    summary: "Buckwheat noodles tossed cold with kimchi and cucumber in chilled broth — Gangwon's summer dish.",
    story:
      "Gangwon is mountainous and grows buckwheat better than rice, so buckwheat noodles are everyday food. Makguksu means 'noodles made in a hurry': boiled, rinsed cold, then either tossed with chilli paste or served in chilled broth with kimchi, cucumber and boiled egg. Paired with dakgalbi it is the classic Chuncheon meal.",
    ingredients: ["Buckwheat noodles", "Kimchi", "Cucumber", "Boiled egg", "Chilled broth"],
    flavor: "Cool, gently sour and spicy",
    bestTime: "Summer",
  },
  "kr-ojingeo-sundae": {
    name: "Sokcho squid sundae",
    summary: "Fresh squid stuffed with vegetables and glass noodles, steamed and sliced — a Sokcho fish-market speciality.",
    story:
      "On the Gangwon coast squid is so plentiful that people invented something better than grilling it: the body is stuffed with glass noodles, tofu, vegetables and the chopped tentacles, steamed, then dipped in egg and pan-fried. Sliced into rounds, each piece shows a pretty ring of filling. Sokcho's fish market sells it alongside fish cakes and snow crab.",
    ingredients: ["Fresh squid", "Glass noodles", "Tofu", "Garlic chives", "Egg"],
    flavor: "Sweet with squid, soft and moist",
    bestTime: "Year-round",
  },
  "kr-gamja-ongsimi": {
    name: "Potato ongsimi soup",
    summary: "Chewy potato-starch dumplings in a vegetable broth — filling food from the Gangwon mountains.",
    story:
      "Gangwon potatoes are famous across Korea, and in the mountains people grate them for starch and roll it into balls dropped in soup. The ongsimi are chewy and translucent, cooked with courgette, onion and dried anchovy. This was food for the lean season; now it is a speciality you have to find a specialist shop to eat.",
    ingredients: ["Potato", "Courgette", "Dried anchovy", "Spring onion", "Seaweed"],
    flavor: "Clean broth, chewy and soft",
    bestTime: "Winter",
  },
  "kr-sungsimdang-bread": {
    name: "Sungsimdang bread (Daejeon)",
    summary: "A deep-fried red bean bun and a crisp cream pastry — the reason people get off the train at Daejeon.",
    story:
      "The bakery opened in 1956 with a rented steamer and is now the symbol that earned Daejeon the nickname 'bread city'. Two things to try: twigim-soboro, a red bean bun deep-fried and coated in crumbs, and the layered pastry filled with fresh cream. Queues stretching onto the pavement are normal.",
    ingredients: ["Wheat flour", "Red bean paste", "Fresh cream", "Soboro crumb"],
    flavor: "Sweet, crisp outside and soft within",
    bestTime: "Morning",
  },
  "kr-daejeon-kalguksu": {
    name: "Daejeon kalguksu (knife-cut noodles)",
    summary: "Hand-cut noodles in anchovy or seafood broth — Daejeon has a whole street of them.",
    story:
      "Kalguksu means 'knife noodles': the dough is rolled flat and cut by hand, so the strands are uneven and the broth always thickens slightly with flour. Daejeon is famous enough for it to hold its own kalguksu festival, with each shop keeping to its own stock — anchovy, clam, chicken or beef.",
    ingredients: ["Hand-cut wheat noodles", "Dried anchovy", "Courgette", "Clams", "Kimchi on the side"],
    flavor: "Clean and warming",
    bestTime: "Lunch",
  },
  "kr-doenjang-jjigae": {
    name: "Doenjang jjigae (soybean paste stew)",
    summary: "A daily stew of fermented soybean paste with tofu and courgette, made from paste aged a whole year.",
    story:
      "Doenjang is made by boiling soybeans, pressing them into meju blocks, drying them and steeping them in brine for months. The Chungcheong countryside around Sejong still has houses that ferment their own, with rows of earthenware jars in the yard. The stew itself is simple — paste, tofu, courgette, potato — but its flavour depends entirely on that family's jar.",
    ingredients: ["Doenjang paste", "Tofu", "Courgette", "Potato", "Green chilli"],
    flavor: "Gently salty, fragrant with fermentation",
    bestTime: "Year-round",
  },
  "kr-danyang-garlic": {
    name: "Danyang garlic dishes",
    summary: "Garlic grown on limestone soil — roasted, fried in batter or stewed with chicken.",
    story:
      "The limestone ground around Danyang gives firm garlic that is sharper and more fragrant than elsewhere, so the whole town sells food made from it: roasted cloves with salt, garlic tempura, chicken stewed with garlic, even garlic ice cream. At Danyang market the smell of roasting garlic drifts down the whole row and everyone is offered a taste.",
    ingredients: ["Danyang garlic", "Chicken", "Frying batter", "Sesame oil", "Salt and pepper"],
    flavor: "Pungent and aromatic, sweet after the heat",
    bestTime: "June–October",
  },
  "kr-olgaengi-guk": {
    name: "Chungju olgaengi soup",
    summary: "Freshwater snail soup with soybean paste and greens — the hangover cure of landlocked Chungbuk.",
    story:
      "Chungbuk is the only province without a coast, so its 'seafood' comes from streams: olgaengi snails the size of a fingertip, boiled for stock, then picked and simmered into a soybean-paste soup with leafy greens. The broth is pale green, mineral and cooling, and is considered the region's finest cure for a hangover.",
    ingredients: ["Freshwater olgaengi snails", "Doenjang paste", "Leafy greens", "Bean flour", "Spring onion"],
    flavor: "Clean, slightly bitter with a sweet finish",
    bestTime: "Year-round",
  },
  "kr-hodu-gwaja": {
    name: "Cheonan walnut cakes",
    summary: "Small walnut-shaped cakes filled with red bean and a piece of walnut — the classic travel snack.",
    story:
      "Created in Cheonan in 1934, hodu-gwaja is baked in walnut-shaped moulds, the smooth red bean paste wrapping a nub of walnut. Because Cheonan is a major road junction, the cakes became the snack people buy on the way through, sold at every motorway service area in the country.",
    ingredients: ["Wheat flour", "Red bean paste", "Walnut", "Milk", "Honey"],
    flavor: "Mildly sweet and nutty",
    bestTime: "Year-round",
  },
  "kr-seosan-gulbap": {
    name: "Seosan oyster rice",
    summary: "Rice cooked with oysters from the Seosan tidal flats, mixed with soy and spring onion before eating.",
    story:
      "The west coast of Chungnam has wide tidal flats where oysters grow small but intensely flavoured. In the cold months they are cooked into rice in a stone pot; when it is done you pour over soy sauce with spring onion and sesame oil and mix. Served with seaweed soup and cabbage kimchi, it is the classic winter meal of the west coast.",
    ingredients: ["Fresh oysters", "Rice", "Soy sauce", "Spring onion", "Sesame oil"],
    flavor: "Sweet with the sea, fragrant with sesame",
    bestTime: "November–February",
  },
  "kr-hobakjuk": {
    name: "Pumpkin porridge",
    summary: "Golden, silky pumpkin porridge dotted with small rice cake balls.",
    story:
      "Chungnam is a major pumpkin-growing region, and this porridge is what you give someone recovering, or eat as a light breakfast. The pumpkin is steamed, puréed and thickened with glutinous rice flour, then finished with tiny rice balls called saealsim. The sweetness is natural enough that it needs almost no sugar.",
    ingredients: ["Pumpkin", "Glutinous rice flour", "Small rice cakes", "Red beans", "Salt"],
    flavor: "Gently sweet and silky",
    bestTime: "Autumn and winter",
  },
  "kr-jeonju-bibimbap": {
    name: "Jeonju bibimbap",
    summary: "Rice cooked in beef broth, served in a brass bowl with more than thirty ingredients.",
    story:
      "Bibimbap is everywhere, but the Jeonju version is treated as the standard: the rice is cooked in beef stock so it is already seasoned, then topped with bean sprouts, seasonal wild greens, mushrooms, a raw egg yolk, slivers of raw beef and a spoon of chilli paste. Mix it thoroughly before eating — the more you mix, the better it gets.",
    ingredients: ["Rice cooked in beef stock", "Bean sprouts", "Seasonal greens", "Beef", "Gochujang"],
    flavor: "Balanced, gently rich, fragrant with sesame",
    bestTime: "Lunch",
  },
  "kr-kongnamul-gukbap": {
    name: "Jeonju bean sprout soup rice",
    summary: "Hot bean sprout soup poured over rice with a poached egg — Jeonju's morning hangover cure.",
    story:
      "Jeonju's bean sprouts are grown with local well water and come out thick and crunchy. The soup is simple — dried anchovy, sprouts, spring onion — poured over rice and eaten hot, often with a small bowl of poached egg to sip first. The shops open before dawn, serving early workers and people coming off a long night.",
    ingredients: ["Bean sprouts", "Rice", "Dried anchovy", "Egg", "Kimchi"],
    flavor: "Clean, warming, gently spicy",
    bestTime: "Early morning",
  },
  "kr-makgeolli": {
    name: "Jeonju makgeolli",
    summary: "Cloudy rice wine drunk from a bowl — order one kettle and a table of food arrives with it.",
    story:
      "On Jeonju's makgeolli streets there is an unwritten rule: order the first kettle and the house brings a tray of dishes; order a second and a new tray appears with different food. The wine is lightly fermented, cloudy, faintly sweet and naturally fizzy, drunk from bowls rather than glasses. This is how Jeonju receives visitors.",
    ingredients: ["Rice", "Nuruk starter", "Water"],
    flavor: "Lightly sweet and tart, softly sparkling",
    bestTime: "Evening",
  },
  "kr-oritang": {
    name: "Gwangju duck soup",
    summary: "Duck simmered with herbs and thickened with rice flour — the dish Gwangju is proudest of.",
    story:
      "Gwangju is famous for tables crowded with side dishes, but the main course people talk about is oritang. Duck is simmered soft with onion, garlic and aromatic leaves, the broth thickened with rice flour, and the meat dipped in mustard soy. When the meat is gone, the remaining broth is used to cook rice porridge or noodles.",
    ingredients: ["Duck", "Rice flour", "Onion", "Aromatic herbs", "Mustard"],
    flavor: "Rich and tender, fragrant with herbs",
    bestTime: "Autumn and winter",
  },
  "kr-hanjeongsik": {
    name: "Honam banquet table (hanjeongsik)",
    summary: "A table covered with twenty or thirty small dishes — the speciality of Korea's best-eating region.",
    story:
      "In Gwangju and South Jeolla a hanjeongsik meal can run to thirty dishes: braised fish, grilled meat, seasoned greens, salted seafood, several kimchi, soup and a sweet to finish. Plates have to be stacked because the table runs out of room. The land is rich and the sea is close, so this tradition of abundance is old and still going.",
    ingredients: ["Braised fish", "Seasonal greens", "Jeotgal salted seafood", "Several kimchi", "Soup"],
    flavor: "Every register at once: salty, sour, spicy, sweet",
    bestTime: "Lunch or dinner",
  },
  "kr-hongeo-samhap": {
    name: "Hongeo samhap (fermented skate)",
    summary: "Fermented skate eaten with boiled pork and kimchi — the most divisive dish on a Korean table.",
    story:
      "The skate is fermented in a crock until it gives off enough ammonia to sting your nose. 'Samhap' means the set of three: a piece of skate, a slice of boiled pork and a leaf of cabbage kimchi eaten together, chased with makgeolli. In Jeonnam it is the prestige dish served at weddings and memorial rites; outsiders usually need a few attempts.",
    ingredients: ["Fermented skate", "Boiled pork", "Cabbage kimchi", "Makgeolli"],
    flavor: "Pungent and salty with a sweet finish",
    bestTime: "Year-round",
  },
  "kr-nakji": {
    name: "Muan baby octopus",
    summary: "Octopus caught by hand on the mudflats — eaten raw, grilled, or in a spicy soup.",
    story:
      "In Muan people catch octopus by reaching into mud holes on the tidal flats. It is eaten as fresh as possible: cut up while still moving and dipped in sesame oil, wound around a chopstick and grilled, or cooked into a fiery soup with vegetables. Locals say one nakji in summer is worth a whole course of medicine.",
    ingredients: ["Baby octopus", "Sesame oil", "Chilli paste", "Herbs", "Garlic"],
    flavor: "Sweet, fresh, springy",
    bestTime: "May–September",
  },
  "kr-daetongbap": {
    name: "Damyang bamboo rice",
    summary: "Glutinous rice steamed inside a fresh bamboo tube with chestnut and jujube.",
    story:
      "Damyang has the largest bamboo groves in Korea, so the tube becomes the pot: glutinous rice with chestnuts, jujube, beans and pine nuts is packed into fresh bamboo, sealed with paper and steamed. Opened at the table, the rice carries a faint scent of bamboo. It comes with a dozen mountain vegetable dishes — the most elegant vegetarian meal in Korea.",
    ingredients: ["Glutinous rice", "Fresh bamboo tube", "Chestnuts", "Jujube", "Pine nuts"],
    flavor: "Fragrant with bamboo, sweet and nutty",
    bestTime: "May–October",
  },
  "kr-boseong-tea": {
    name: "Boseong green tea",
    summary: "Tea from Korea's largest plantation — brewed hot, churned into ice cream, even mixed into rice.",
    story:
      "Boseong produces most of Korea's tea, and the whole town lives around the leaf: tea brewed traditionally in small pots, green tea ice cream at the plantation gate, green tea noodles, even pork raised on tea residue. Leaves picked in early May (ujeon) are the most prized, sweet in the finish with little astringency.",
    ingredients: ["Boseong green tea leaves", "Spring water", "Milk (for ice cream)"],
    flavor: "Lightly astringent with a sweet finish",
    bestTime: "May–June",
  },
  "kr-andong-jjimdak": {
    name: "Andong jjimdak",
    summary: "Chicken braised in soy sauce with glass noodles, potato and dried chilli — one big pan for the table.",
    story:
      "Jjimdak was invented in Andong's old market, reputedly when the chicken shops needed something new to compete with fried chicken. Chicken is braised in sweet soy with potato, carrot, onion and sweet potato noodles, warmed by dried chilli. One order feeds three or four, and the sauce-soaked noodles always go first.",
    ingredients: ["Chicken", "Soy sauce", "Sweet potato noodles", "Potato", "Dried chilli"],
    flavor: "Salty-sweet with mild heat",
    bestTime: "Year-round",
  },
  "kr-andong-mackerel": {
    name: "Andong salted mackerel",
    summary: "Mackerel salted on the road from the sea into the mountains — a preservation method that became a delicacy.",
    story:
      "Andong lies far inland, and fish carried from the east sea took a full day to arrive. Traders salted the mackerel along the way to stop it spoiling, and that salt and time firmed the flesh into something better than fresh grilled fish. Today salted Andong mackerel is produced to a standard recipe and sold nationwide.",
    ingredients: ["Mackerel", "Sea salt", "Cooking oil"],
    flavor: "Deeply salty, firm and rich",
    bestTime: "Year-round",
  },
  "kr-daegu-makchang": {
    name: "Daegu makchang (grilled beef intestine)",
    summary: "Grilled beef intestine dipped in soybean paste — the definitive Daegu drinking food.",
    story:
      "Makchang is the last section of beef intestine, grilled over charcoal until the edges char, crisp outside and soft within, dipped in soybean paste mixed with spring onion. Daegu has whole streets that sell nothing else, smoke pouring out from late afternoon until the small hours. It goes with the city's reputation: blunt, hearty, soju in hand.",
    ingredients: ["Beef intestine", "Soybean dipping paste", "Spring onion", "Garlic", "Green chilli"],
    flavor: "Rich, smoky, deeply savoury",
    bestTime: "Evening",
  },
  "kr-daegu-jjim-galbi": {
    name: "Daegu spicy braised ribs",
    summary: "Beef ribs braised with a fistful of garlic and coarse chilli — searing, and impossible to stop eating.",
    story:
      "On Dongin-dong street, jjim-galbi is cooked the Daegu way: ribs braised tender with minced garlic and coarse chilli flakes, almost none of the sweet sauce that a Seoul-style galbijjim would have. It is hot enough to keep you drinking water, and Daegu is proud of exactly that. At the end, ask for rice to fry in the remaining sauce.",
    ingredients: ["Beef short ribs", "Garlic", "Chilli flakes", "Soy sauce", "Spring onion"],
    flavor: "Fiercely spicy and heavy with garlic",
    bestTime: "Evening",
  },
  "kr-napjak-mandu": {
    name: "Daegu flat dumplings",
    summary: "Paper-thin dumplings with almost no filling, pan-fried and dressed in a spicy sauce.",
    story:
      "Born in hard times when meat filling was a luxury: the wrapper is rolled thin, the filling is little more than glass noodles and spring onion, and the dumplings are pan-fried crisp then drizzled with soy-chilli sauce and scattered with spring onion. You find them almost nowhere but Daegu, in markets and street stalls, usually alongside tteokbokki.",
    ingredients: ["Thin dumpling wrappers", "Glass noodles", "Spring onion", "Soy-chilli sauce"],
    flavor: "Lightly crisp, salty and spicy",
    bestTime: "Afternoon",
  },
  "kr-dwaeji-gukbap": {
    name: "Busan pork soup rice",
    summary: "Milky pork bone broth over rice, seasoned at the table with salted shrimp and chives — a refugee's dish.",
    story:
      "During the Korean War, refugees crowded into Busan and made soup from pork bones, the cheapest thing left. The broth is simmered for hours until it turns milky, poured over rice with thin slices of boiled pork. Every table has salted shrimp, chopped chives and chilli powder so you season it your own way. This is the dish that defines Busan.",
    ingredients: ["Pork bones", "Boiled pork", "Rice", "Chopped chives", "Salted shrimp"],
    flavor: "Gently rich and savoury, seasoned to taste",
    bestTime: "Year-round",
  },
  "kr-milmyeon": {
    name: "Busan milmyeon (cold wheat noodles)",
    summary: "Busan's take on cold noodles: softer wheat strands, a sweeter broth, shaved ice on top.",
    story:
      "Refugees from the north brought naengmyeon made with buckwheat, but wartime Busan only had aid wheat flour, so they made the noodles from that — and milmyeon was born. The broth is simmered from bones with medicinal herbs, sweet and fragrant, served with shaved ice, a spoon of chilli paste and a slice of boiled pork.",
    ingredients: ["Wheat noodles", "Bone broth", "Shaved ice", "Cucumber", "Chilli paste"],
    flavor: "Sweet, cooling, gently spicy",
    bestTime: "Summer",
  },
  "kr-eomuk": {
    name: "Busan fish cake",
    summary: "Fish cake on skewers dipped in hot broth — a winter snack nationwide, originally from Busan.",
    story:
      "Busan is Korea's largest fishing port, so its fish cake carries more fish and less flour, springier and sweeter than elsewhere. At markets and street stalls the skewers sit in a pot of hot radish broth; when you finish, you pour yourself a cup of the broth to warm up. Busan's fish cake brands are now sold across the country.",
    ingredients: ["Minced fish", "Flour", "Radish", "Kelp", "Soy dipping sauce"],
    flavor: "Sweet with fish, lightly salty",
    bestTime: "Winter",
  },
  "kr-ssiat-hotteok": {
    name: "Busan seed hotteok",
    summary: "A syrup-filled fried pancake, split open and packed with sunflower, pumpkin seeds and peanuts.",
    story:
      "Hotteok — a fried pancake filled with brown sugar syrup — is winter food all over Korea, but at Busan's Gukje Market they add one step: the pancake is pulled from the oil, slit open and stuffed full of roasted seeds. One bite gives you molten syrup and crunchy nuts at the same time.",
    ingredients: ["Wheat flour", "Brown sugar", "Cinnamon", "Sunflower seeds", "Pumpkin seeds and peanuts"],
    flavor: "Hot and sweet, crunchy and nutty",
    bestTime: "Winter",
  },
  "kr-eonyang-bulgogi": {
    name: "Eonyang bulgogi (Ulsan)",
    summary: "Coarsely minced beef pressed into patties and grilled over charcoal — Ulsan's own style of bulgogi.",
    story:
      "In Eonyang the cattle are raised locally, and the beef is coarsely minced, pressed into rounds, lightly seasoned and grilled on a rack over charcoal rather than cooked in liquid like Seoul-style bulgogi. That method keeps the juice in the meat and gives a fragrant char. It is eaten wrapped in lettuce with ssamjang.",
    ingredients: ["Coarsely minced beef", "Soy sauce", "Garlic", "Sugar", "Lettuce for wrapping"],
    flavor: "Sweet with beef, smoky from the charcoal",
    bestTime: "Year-round",
  },
  "kr-mulhoe": {
    name: "Mulhoe (cold raw fish soup)",
    summary: "Slivers of raw fish in an ice-cold sweet-sour broth, drunk like soup on a hot day.",
    story:
      "Fishermen on the east coast invented this to eat quickly on the boat: raw fish sliced thin, tossed with vegetables and dropped into iced water spiked with chilli paste and vinegar. The sour, icy heat cuts the summer, and at the end you add noodles or rice to the bowl. Ulsan and Pohang are the two places best known for it.",
    ingredients: ["Sliced raw fish", "Iced water", "Chilli paste", "Vinegar", "Shredded vegetables"],
    flavor: "Sour, spicy, icy and fresh",
    bestTime: "Summer",
  },
  "kr-chungmu-gimbap": {
    name: "Chungmu gimbap (Tongyeong)",
    summary: "Plain rice rolls served with spicy squid and radish kimchi on the side.",
    story:
      "Fishermen from Tongyeong (formerly Chungmu) took rice rolls to sea, but filled rolls spoiled quickly in the sun. The solution: roll the rice plain and keep the spicy squid and radish kimchi separate, picking them up as you eat. That practical fix became the local speciality, sold all along the harbour.",
    ingredients: ["Plain rice", "Seaweed", "Spicy squid", "Radish kimchi", "Fish cake"],
    flavor: "Mild rice with sharp, spicy sides",
    bestTime: "Year-round",
  },
  "kr-jinju-bibimbap": {
    name: "Jinju bibimbap (hwaban)",
    summary: "The Jinju version, with raw beef, seasonal greens and a small clam soup on the side.",
    story:
      "The Jinju bowl is called 'hwaban' — flower rice — because the vegetables are arranged in a coloured ring. Unlike Jeonju, it carries raw beef dressed in sesame oil in the centre and always comes with a small bowl of clam soup. Tradition holds that the dish descends from the meals of the soldiers defending Jinju fortress.",
    ingredients: ["Rice", "Raw beef", "Seasonal greens", "Clam soup", "Gochujang"],
    flavor: "Fresh and clean, fragrant with sesame",
    bestTime: "Lunch",
  },
  "kr-tongyeong-gul": {
    name: "Tongyeong oysters",
    summary: "Oysters farmed in a sheltered bay — eaten raw, grilled, or cooked into stone-pot rice.",
    story:
      "The waters around Tongyeong are shielded by islands, so the sea stays calm — this is the largest oyster-farming area in Korea. In the cold months the oysters are at their fattest and sweetest: eaten raw with vinegared soy, grilled in the shell over charcoal, or cooked with rice in a stone pot. Tongyeong's Jungang market sells them fresh from early morning.",
    ingredients: ["Fresh oysters", "Vinegared soy sauce", "Rice", "Seaweed", "Garlic"],
    flavor: "Sweet with the sea, lightly rich",
    bestTime: "November–March",
  },
  "kr-jeju-heukdwaeji": {
    name: "Jeju black pork",
    summary: "Native black pork grilled over charcoal, dipped in warm anchovy sauce.",
    story:
      "Black pigs are the island's native breed, raised longer than ordinary pigs, so the meat is firm, the fat crisp and even the skin is eaten. The cuts are grilled thick over charcoal, snipped with scissors at the table, and dipped in melchijeot — anchovy sauce kept simmering right beside the grill. Wrap it with perilla leaves and roasted garlic.",
    ingredients: ["Black pork", "Melchijeot anchovy sauce", "Perilla leaves", "Garlic", "Spring onion salad"],
    flavor: "Rich and crisp, deeply savoury",
    bestTime: "Year-round",
  },
  "kr-jeonbok-juk": {
    name: "Jeju abalone porridge",
    summary: "Rice porridge cooked with abalone and its liver, which gives it a distinctive green tint.",
    story:
      "The haenyeo — Jeju's women divers — collect abalone without air tanks, and this porridge uses the whole animal: the flesh sliced in, the liver stirred through to give the pale green colour and a deep taste of the sea. It is what you serve to the ill and the elderly, and what visitors eat for breakfast on the island.",
    ingredients: ["Abalone", "Rice", "Sesame oil", "Abalone liver", "Salt"],
    flavor: "Gently rich, deeply of the sea",
    bestTime: "Year-round",
  },
  "kr-galchi-jorim": {
    name: "Jeju braised cutlassfish",
    summary: "Silver cutlassfish braised with radish and courgette in chilli — the classic Jeju fish dish.",
    story:
      "Cutlassfish caught around Jeju is larger and meatier than elsewhere. The steaks are braised in a pot with radish, courgette, chilli flakes and soy until the radish has taken on all the flavour of the fish. At restaurants along the island's south coast, a pot of galchi-jorim with rice and a dozen side dishes is the standard lunch.",
    ingredients: ["Cutlassfish", "Radish", "Chilli flakes", "Soy sauce", "Green chilli"],
    flavor: "Spicy and savoury, sweet with fish",
    bestTime: "September–December",
  },
};
