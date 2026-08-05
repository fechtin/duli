import type { ContentLocale, RestaurantI18n, RestaurantTranslation } from "@/lib/types";

// Korea's 12 editorial restaurant picks, translated. Small enough to keep every locale in one
// file (the Vietnam set lives in four separate files only because it is far larger).

const en: Record<string, RestaurantTranslation> = {
  "kr-tosokchon": {
    name: "Tosokchon Samgyetang",
    address: "5 Jahamun-ro 5-gil, Jongno-gu (near Gyeongbokgung)",
    reasons: [
      "The most talked-about samgyetang house in Seoul, open since the 1980s",
      "Right beside Gyeongbokgung — slots neatly into a morning of sightseeing",
      "Long queue but fast turnover; typically 15–30 minutes",
    ],
  },
  "kr-sindang-tteokbokki-town": {
    name: "Sindang Tteokbokki Town",
    address: "Sindang-dong, Jung-gu",
    reasons: [
      "Where gochujang tteokbokki was created in the 1950s",
      "A whole street cooking one dish — easy to compare houses",
      "Cooked at your table; add noodles and fish cake as you like",
    ],
  },
  "kr-gonghwachun": {
    name: "Gonghwachun (Chinatown)",
    address: "43 Chinatown-ro, Jung-gu, Incheon",
    reasons: [
      "Standing where jjajangmyeon was invented in the late 19th century",
      "The Jjajangmyeon Museum is next door — pair them in one visit",
      "Minutes from Incheon station, easy as a day trip from Seoul",
    ],
  },
  "kr-chuncheon-myeongdong-dakgalbi": {
    name: "Chuncheon Myeongdong Dakgalbi Street",
    address: "Myeongdong-gil, Chuncheon",
    reasons: [
      "A whole street of dakgalbi, where the dish made its name in the 1960s",
      "Stir-fried at your table and finished with fried rice in the sauce",
      "Just over an hour from Seoul on the ITX train",
    ],
  },
  "kr-sungsimdang": {
    name: "Sungsimdang (main store)",
    address: "15 Daejong-ro 480beon-gil, Jung-gu, Daejeon",
    reasons: [
      "Open since 1956; the bakery that made Daejeon the 'bread city'",
      "Twigim-soboro and the cream pastry are the two to try",
      "Ten minutes from Daejeon station — ideal for a KTX stopover",
    ],
  },
  "kr-gogung-jeonju": {
    name: "Gogung (Jeonju Hanok Village)",
    address: "63 Jeonjugaeksa 3-gil, Wansan-gu, Jeonju",
    reasons: [
      "Bibimbap in a brass bowl, rice cooked in beef stock, the Jeonju way",
      "Inside the hanok village, walkable to everything",
      "Vegetarian and non-spicy versions available for visitors",
    ],
  },
  "kr-ssangdungi-dwaeji-gukbap": {
    name: "Seomyeon Pork Soup Rice Street",
    address: "Seomyeon, Busanjin-gu, Busan",
    reasons: [
      "The densest cluster of long-running dwaeji-gukbap houses in Busan",
      "Many open around the clock — the classic local hangover cure",
      "Salted shrimp and chives on every table so you season it yourself",
    ],
  },
  "kr-samjin-eomuk": {
    name: "Samjin Eomuk (Yeongdo)",
    address: "36 Taejong-ro 99beon-gil, Yeongdo-gu, Busan",
    reasons: [
      "Korea's oldest fish cake maker, in business since 1953",
      "A small museum and fish-cake making classes at the factory",
      "Many varieties to eat hot on the spot or take away",
    ],
  },
  "kr-andong-jjimdak-alley": {
    name: "Andong Old Market Jjimdak Alley",
    address: "Andong Gu Market, Andong",
    reasons: [
      "The birthplace of jjimdak, a whole row of shops in the old market",
      "One pan feeds three — good for groups",
      "Fits neatly with Hahoe village and Dosan Seowon in one day",
    ],
  },
  "kr-jeju-black-pork-street": {
    name: "Jeju Black Pork Street (Geonip-dong)",
    address: "Geonip-dong, Jeju City",
    reasons: [
      "A row of specialists in native black pork, thick-cut over charcoal",
      "Dipped in melchijeot anchovy sauce — the Jeju way of eating it",
      "Near the port and airport, easy for your first night on the island",
    ],
  },
  "kr-tongyeong-jungang-market": {
    name: "Tongyeong Jungang Market",
    address: "12 Tongyeonghaean-ro, Tongyeong",
    reasons: [
      "Oysters from Tongyeong bay, Korea's largest oyster-farming area",
      "Buy them fresh at a stall and eat at the cooking counters beside it",
      "Right below the Dongpirang mural village",
    ],
  },
  "kr-anjirang-gopchang": {
    name: "Anjirang Grilled Intestine Street",
    address: "Anjirang-dong, Nam-gu, Daegu",
    reasons: [
      "More than 50 shops on one street, grilling until dawn",
      "Far cheaper than Seoul for the same quality",
      "The most characteristic drinking street in Daegu",
    ],
  },
};

const ko: Record<string, RestaurantTranslation> = {
  "kr-tosokchon": {
    name: "토속촌 삼계탕",
    address: "서울 종로구 자하문로5길 5 (경복궁 인근)",
    reasons: ["1980년대부터 이어온 서울에서 가장 유명한 삼계탕집", "경복궁 바로 옆이라 오전 관람과 묶기 좋다", "줄은 길지만 회전이 빨라 보통 15~30분"],
  },
  "kr-sindang-tteokbokki-town": {
    name: "신당동 떡볶이 골목",
    address: "서울 중구 신당동",
    reasons: ["1950년대 고추장 떡볶이가 태어난 곳", "한 골목에서 같은 음식을 비교해 먹을 수 있다", "테이블에서 직접 끓이고 사리와 어묵을 추가할 수 있다"],
  },
  "kr-gonghwachun": {
    name: "공화춘 (차이나타운)",
    address: "인천 중구 차이나타운로 43",
    reasons: ["19세기 말 짜장면이 탄생한 자리", "바로 옆 짜장면박물관과 함께 보기 좋다", "인천역에서 도보 몇 분, 서울 당일치기로 충분"],
  },
  "kr-chuncheon-myeongdong-dakgalbi": {
    name: "춘천 명동 닭갈비 골목",
    address: "강원 춘천시 명동길",
    reasons: ["1960년대 닭갈비가 자리 잡은 골목 전체", "테이블에서 볶아 마지막에 밥까지 볶아 먹는다", "서울에서 ITX로 한 시간 남짓"],
  },
  "kr-sungsimdang": {
    name: "성심당 본점",
    address: "대전 중구 대종로480번길 15",
    reasons: ["1956년 문을 연, 대전을 '빵의 도시'로 만든 빵집", "튀김소보로와 생크림빵이 대표", "대전역에서 10분, KTX 경유 코스로 최적"],
  },
  "kr-gogung-jeonju": {
    name: "고궁 (전주한옥마을)",
    address: "전북 전주시 완산구 전주객사3길 63",
    reasons: ["놋그릇에 담고 사골로 지은 밥, 전주식 비빔밥", "한옥마을 안이라 도보 이동이 편하다", "채식과 덜 매운 메뉴도 준비되어 있다"],
  },
  "kr-ssangdungi-dwaeji-gukbap": {
    name: "서면 돼지국밥 골목",
    address: "부산 부산진구 서면",
    reasons: ["부산에서 오래된 돼지국밥집이 가장 많이 모인 곳", "24시간 영업하는 집이 많아 해장으로 제격", "새우젓과 부추가 상마다 있어 취향대로 간을 맞춘다"],
  },
  "kr-samjin-eomuk": {
    name: "삼진어묵 (영도)",
    address: "부산 영도구 태종로99번길 36",
    reasons: ["1953년부터 이어온 한국에서 가장 오래된 어묵 회사", "작은 박물관과 어묵 만들기 체험이 있다", "즉석에서 먹거나 포장하기도 편하다"],
  },
  "kr-andong-jjimdak-alley": {
    name: "안동 구시장 찜닭 골목",
    address: "경북 안동시 안동구시장",
    reasons: ["찜닭이 태어난 구시장의 골목 전체", "한 판이면 세 명이 먹어 단체 여행에 좋다", "하회마을, 도산서원과 하루에 묶기 좋다"],
  },
  "kr-jeju-black-pork-street": {
    name: "제주 흑돼지 거리 (건입동)",
    address: "제주시 건입동",
    reasons: ["두툼하게 썰어 숯불에 굽는 흑돼지 전문점 거리", "멜젓에 찍어 먹는 제주식 그대로", "항구와 공항이 가까워 제주 첫날 저녁에 좋다"],
  },
  "kr-tongyeong-jungang-market": {
    name: "통영 중앙시장",
    address: "경남 통영시 통영해안로 12",
    reasons: ["한국 최대 굴 양식지 통영 앞바다의 굴", "좌판에서 사서 옆 식당에서 바로 먹을 수 있다", "동피랑 벽화마을 바로 아래"],
  },
  "kr-anjirang-gopchang": {
    name: "안지랑 곱창 골목",
    address: "대구 남구 안지랑동",
    reasons: ["한 골목에 50곳이 넘는 가게가 새벽까지 굽는다", "같은 품질에 서울보다 훨씬 저렴하다", "가장 대구다운 술 골목"],
  },
};

const ja: Record<string, RestaurantTranslation> = {
  "kr-tosokchon": {
    name: "土俗村 参鶏湯",
    address: "ソウル鍾路区紫霞門路5ギル5（景福宮の近く）",
    reasons: ["1980年代から続く、ソウルで最も名高い参鶏湯の店", "景福宮のすぐ隣で午前の観光と組みやすい", "行列は長いが回転が速く、待ち時間は15〜30分ほど"],
  },
  "kr-sindang-tteokbokki-town": {
    name: "新堂洞トッポッキ横丁",
    address: "ソウル中区新堂洞",
    reasons: ["1950年代にコチュジャン味のトッポッキが生まれた場所", "同じ料理を並べて食べ比べできる通り", "卓上で煮ながら、麺や練り物を追加できる"],
  },
  "kr-gonghwachun": {
    name: "共和春（チャイナタウン）",
    address: "仁川広域市中区チャイナタウン路43",
    reasons: ["19世紀末にジャージャー麺が生まれた場所そのもの", "隣のジャージャー麺博物館と一緒に回れる", "仁川駅から徒歩数分、ソウルからの日帰りに最適"],
  },
  "kr-chuncheon-myeongdong-dakgalbi": {
    name: "春川明洞タッカルビ通り",
    address: "江原道春川市明洞ギル",
    reasons: ["1960年代にタッカルビが定着した通りそのもの", "卓上で炒め、締めに残ったたれでご飯を炒める", "ソウルからITXで1時間あまり"],
  },
  "kr-sungsimdang": {
    name: "聖心堂 本店",
    address: "大田広域市中区大宗路480番ギル15",
    reasons: ["1956年開業、大田を「パンの街」にした店", "トゥィギムソボロと生クリームパンが看板", "大田駅から10分、KTX の乗り継ぎに最適"],
  },
  "kr-gogung-jeonju": {
    name: "古宮（全州韓屋村）",
    address: "全羅北道全州市完山区全州客舎3ギル63",
    reasons: ["真鍮の器に牛骨で炊いたご飯、全州式のビビンバ", "韓屋村の中にあり徒歩で回れる", "ベジタリアン向け・辛くない仕立ても用意がある"],
  },
  "kr-ssangdungi-dwaeji-gukbap": {
    name: "西面テジクッパ横丁",
    address: "釜山広域市釜山鎮区西面",
    reasons: ["釜山で老舗のテジクッパ店が最も集まる一角", "24時間営業の店が多く、締めや迎え酒に最適", "アミの塩辛とにらが卓上にあり、味は自分で決める"],
  },
  "kr-samjin-eomuk": {
    name: "三進オムク（影島）",
    address: "釜山広域市影島区太宗路99番ギル36",
    reasons: ["1953年創業、韓国で最も古い練り物メーカー", "小さな博物館と手作り体験教室がある", "その場で温かく食べても持ち帰っても良い"],
  },
  "kr-andong-jjimdak-alley": {
    name: "安東旧市場チムタク横丁",
    address: "慶尚北道安東市安東旧市場",
    reasons: ["チムタク発祥の旧市場、店が一列に並ぶ", "一皿で三人前、グループ旅行に向く", "河回村や陶山書院と同じ日に回りやすい"],
  },
  "kr-jeju-black-pork-street": {
    name: "済州 黒豚通り（健入洞）",
    address: "済州市健入洞",
    reasons: ["在来黒豚を厚切りで炭火焼きにする専門店街", "メルジョッに付ける済州式の食べ方そのまま", "港と空港が近く、島の初日の夜に良い"],
  },
  "kr-tongyeong-jungang-market": {
    name: "統営中央市場",
    address: "慶尚南道統営市統営海岸路12",
    reasons: ["韓国最大のカキ養殖地、統営湾のカキ", "売り場で買い、隣の調理場ですぐ食べられる", "東ピラン壁画村のすぐ下"],
  },
  "kr-anjirang-gopchang": {
    name: "安吉郎コプチャン横丁",
    address: "大邱広域市南区安吉郎洞",
    reasons: ["一つの通りに50軒以上、明け方まで焼き続ける", "同じ質でソウルよりずっと安い", "最も大邱らしい酒の通り"],
  },
};

const zh: Record<string, RestaurantTranslation> = {
  "kr-tosokchon": {
    name: "土俗村蔘雞湯",
    address: "首爾鍾路區紫霞門路5街5號（景福宮附近）",
    reasons: ["1980年代營業至今，首爾最知名的蔘雞湯店", "就在景福宮旁，適合接在上午遊覽之後", "隊伍雖長但翻桌快，通常等15至30分鐘"],
  },
  "kr-sindang-tteokbokki-town": {
    name: "新堂洞辣炒年糕街",
    address: "首爾中區新堂洞",
    reasons: ["1950年代辣椒醬炒年糕誕生的地方", "一整條街做同一道菜，方便比較口味", "在桌邊現煮，可加麵條與魚板"],
  },
  "kr-gonghwachun": {
    name: "共和春（中華街）",
    address: "仁川中區中華街路43號",
    reasons: ["就站在十九世紀末炸醬麵誕生的位置", "隔壁就是炸醬麵博物館，可一併參觀", "距仁川站步行數分鐘，適合自首爾一日遊"],
  },
  "kr-chuncheon-myeongdong-dakgalbi": {
    name: "春川明洞辣炒雞排街",
    address: "江原道春川市明洞街",
    reasons: ["一整條街都是雞排，1960年代這道菜在此成名", "在桌邊現炒，最後用剩醬炒飯收尾", "自首爾搭ITX一小時多可達"],
  },
  "kr-sungsimdang": {
    name: "聖心堂（本店）",
    address: "大田中區大宗路480號街15",
    reasons: ["1956年開業，讓大田成為「麵包之城」的店", "炸紅豆酥粒麵包與奶油夾心麵包最值得嘗", "距大田站十分鐘，最適合KTX中途停留"],
  },
  "kr-gogung-jeonju": {
    name: "古宮（全州韓屋村）",
    address: "全羅北道全州市完山區全州客舍3街63號",
    reasons: ["黃銅碗、牛骨高湯炊飯的正統全州拌飯", "位在韓屋村內，步行即可逛遍周邊", "備有素食與不辣的版本"],
  },
  "kr-ssangdungi-dwaeji-gukbap": {
    name: "西面豬肉湯飯街",
    address: "釜山釜山鎮區西面",
    reasons: ["釜山老字號豬肉湯飯最密集的一區", "許多店24小時營業，是在地經典解酒餐", "每桌備有蝦醬與韭菜，自行調味"],
  },
  "kr-samjin-eomuk": {
    name: "三進魚糕（影島）",
    address: "釜山影島區太宗路99號街36",
    reasons: ["1953年創立，韓國歷史最久的魚糕品牌", "設有小型博物館與手作體驗課", "可現場趁熱吃，也方便外帶"],
  },
  "kr-andong-jjimdak-alley": {
    name: "安東舊市場燉雞街",
    address: "慶尚北道安東市安東舊市場",
    reasons: ["燉雞的發源地，舊市場裡整排店家", "一鍋足夠三人享用，適合團體", "可與河回村、陶山書院安排在同一天"],
  },
  "kr-jeju-black-pork-street": {
    name: "濟州黑豬肉街（健入洞）",
    address: "濟州市健入洞",
    reasons: ["專賣在地黑豬、厚切炭烤的一整條街", "沾鯷魚醬吃，正是濟州的吃法", "鄰近港口與機場，適合上島第一晚"],
  },
  "kr-tongyeong-jungang-market": {
    name: "統營中央市場",
    address: "慶尚南道統營市統營海岸路12號",
    reasons: ["來自統營灣的牡蠣，韓國最大的牡蠣養殖區", "在攤位買新鮮的，旁邊料理攤即可代客烹調", "就在東皮廊壁畫村下方"],
  },
  "kr-anjirang-gopchang": {
    name: "安吉朗烤腸街",
    address: "大邱南區安吉朗洞",
    reasons: ["一條街超過50家店，一路烤到天亮", "同樣品質比首爾便宜許多", "最具大邱風味的宵夜街"],
  },
};

const byLocale: Record<ContentLocale, Record<string, RestaurantTranslation>> = { en, ko, ja, zh };

export const restaurantI18nKr: Record<string, RestaurantI18n> = {};
for (const locale of Object.keys(byLocale) as ContentLocale[]) {
  for (const [id, tr] of Object.entries(byLocale[locale])) {
    (restaurantI18nKr[id] ??= {})[locale] = tr;
  }
}
