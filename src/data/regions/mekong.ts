import type { Destination, ProvinceContent } from "@/lib/types";

type ProvinceEditorial = Omit<ProvinceContent, "destinationIds">;

export const mekongDestinations: Destination[] = [
  {
    id: "long-an-lang-noi-tan-lap",
    slug: "lang-noi-tan-lap",
    provinceSlug: "long-an",
    name: "Làng nổi Tân Lập",
    nameEn: "Tan Lap Floating Village",
    type: "park",
    lng: 105.8214,
    lat: 10.7689,
    summary:
      "Rừng tràm xanh ngút ngàn của Đồng Tháp Mười, với con đường xuyên rừng và tháp ngắm cảnh trên vùng đất ngập nước.",
    story:
      "Nằm giữa lòng Đồng Tháp Mười, Làng nổi Tân Lập là khu sinh thái rừng tràm rộng hơn 600 hecta. Du khách đi bộ trên con đường bê tông dài gần năm cây số luồn lách giữa hai hàng tràm xanh mát, ánh nắng len qua tán lá tạo nên khung cảnh huyền ảo. Một chuyến xuồng nhỏ len lỏi qua những rạch nước phủ kín bèo, tiếng chim ríu rít hòa cùng hương tràm thoang thoảng. Lên đỉnh tháp quan sát cao gần ba mươi mét, cả vùng đất ngập nước mênh mông hiện ra như một tấm thảm xanh trải dài tới chân trời. Đây là nơi lý tưởng để cảm nhận nhịp sống chậm rãi của miền Tây sông nước.",
    facts: [
      "Khu rừng tràm rộng khoảng 635 hecta thuộc vùng Đồng Tháp Mười.",
      "Con đường xuyên rừng dài gần 5 km được đổ bê tông giữa rừng tràm.",
      "Tháp quan sát cao gần 30 mét cho tầm nhìn toàn cảnh vùng đất ngập nước.",
      "Là điểm quay nhiều bộ phim và MV nhờ cảnh rừng tràm thơ mộng.",
    ],
    travelTips: [
      "Mang theo nón, áo chống nắng và thuốc chống côn trùng khi đi sâu vào rừng.",
      "Đi sớm buổi sáng để có ánh sáng đẹp và tránh nắng gắt giữa trưa.",
    ],
    bestTime: "Tháng 9 đến tháng 11, mùa nước nổi rừng tràm xanh tốt nhất",
    visitDuration: "Nửa ngày",
    ticket: "60.000đ",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["popular", "verified", "hidden-gem"],
    tags: ["nature", "park", "photography"],
    gallery: [
      { seed: "tanlap-tram-road", caption: "Con đường bê tông xuyên rừng tràm", ratio: "16/9" },
      { seed: "tanlap-watchtower", caption: "Tháp quan sát giữa vùng đất ngập nước", ratio: "4/3" },
      { seed: "tanlap-boat", caption: "Xuồng nhỏ len qua rạch nước phủ bèo", ratio: "1/1" },
    ],
    nearby: ["long-an-lang-sen"],
    featured: true,
  },
  {
    id: "long-an-lang-sen",
    slug: "lang-sen",
    provinceSlug: "long-an",
    name: "Khu bảo tồn đất ngập nước Láng Sen",
    nameEn: "Lang Sen Wetland Reserve",
    type: "park",
    lng: 105.7333,
    lat: 10.7667,
    summary:
      "Vùng lõi Đồng Tháp Mười với hệ sinh thái đất ngập nước phong phú, nơi trú ngụ của nhiều loài chim nước quý hiếm.",
    story:
      "Khu bảo tồn đất ngập nước Láng Sen được ví như một Đồng Tháp Mười thu nhỏ, lưu giữ gần như nguyên vẹn hệ sinh thái ngập nước đặc trưng của miền Tây. Trên diện tích hơn năm nghìn hecta, nơi đây là mái nhà của hàng trăm loài thực vật, cá nước ngọt và nhiều loài chim quý như cò, vạc, điên điển. Vào mùa nước nổi, những cánh đồng sen, súng và lúa ma trải dài bất tận, từng đàn chim bay rợp trời lúc chiều buông. Đi xuồng giữa kênh rạch yên ả, du khách có thể quan sát đời sống hoang dã nguyên sơ và lắng nghe thiên nhiên thở nhẹ giữa vùng đồng bưng.",
    facts: [
      "Diện tích bảo tồn rộng hơn 5.000 hecta thuộc vùng lõi Đồng Tháp Mười.",
      "Được công nhận là khu Ramsar - vùng đất ngập nước có tầm quan trọng quốc tế.",
      "Là nơi trú ngụ của nhiều loài chim nước và cá nước ngọt quý hiếm.",
      "Cảnh quan sen, súng và lúa ma đặc trưng cho hệ sinh thái đồng bưng.",
    ],
    travelTips: [
      "Liên hệ trước với ban quản lý để được bố trí xuồng và hướng dẫn.",
      "Mang ống nhòm nếu muốn quan sát chim, đẹp nhất lúc bình minh và hoàng hôn.",
    ],
    bestTime: "Tháng 8 đến tháng 11 mùa nước nổi, nhiều chim về trú ngụ",
    visitDuration: "Nửa ngày",
    ticket: "",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["verified", "hidden-gem", "ai-recommended"],
    tags: ["nature", "park", "photography"],
    gallery: [
      { seed: "langsen-birds", caption: "Lạch nước lặng lờ len giữa bụi cây ngập nước", ratio: "16/9" },
      { seed: "langsen-lotus", caption: "Đồng cỏ ngập nước xanh trải tới chân trời", ratio: "4/3" },
      { seed: "langsen-canal", caption: "Xuồng len giữa kênh rạch yên ả", ratio: "1/1" },
    ],
    nearby: ["long-an-lang-noi-tan-lap"],
  },

  {
    id: "tien-giang-cu-lao-thoi-son",
    slug: "cu-lao-thoi-son",
    provinceSlug: "tien-giang",
    name: "Cù lao Thới Sơn",
    nameEn: "Thoi Son Islet",
    type: "village",
    lng: 106.3636,
    lat: 10.3389,
    summary:
      "Cù lao xanh mát giữa sông Tiền nổi tiếng với vườn cây trái, mật ong và những điệu đờn ca tài tử ngọt ngào.",
    story:
      "Cù lao Thới Sơn, hay còn gọi là cồn Lân, là một trong tứ linh nổi giữa dòng sông Tiền hiền hòa. Đặt chân lên cù lao, du khách lạc vào miệt vườn sum suê nhãn, sầu riêng và bưởi da xanh. Người dân mời khách thưởng trà mật ong pha tắc, nếm trái cây hái tận vườn và nghe các nghệ nhân ngân nga đờn ca tài tử, di sản văn hóa của vùng Nam Bộ. Thú vị nhất là ngồi xuồng ba lá để các cô gái mặc áo bà ba chèo len lỏi qua những con rạch nhỏ rợp bóng dừa nước. Một ngày ở Thới Sơn gói trọn hồn quê miền Tây chân chất và mến khách.",
    facts: [
      "Là một trong bốn cù lao mang tên tứ linh Long, Lân, Quy, Phụng trên sông Tiền.",
      "Nổi tiếng với nghề nuôi ong lấy mật và các vườn cây ăn trái sum suê.",
      "Đờn ca tài tử Nam Bộ thường được biểu diễn phục vụ du khách tại đây.",
      "Trải nghiệm chèo xuồng ba lá qua rạch dừa nước là đặc trưng không thể bỏ qua.",
    ],
    travelTips: [
      "Đi tàu từ bến Mỹ Tho để ngắm cảnh sông Tiền trên đường ra cù lao.",
      "Nên đi theo tour ghép để trải nghiệm trọn gói vườn trái cây và đờn ca tài tử.",
    ],
    bestTime: "Tháng 5 đến tháng 8, mùa trái cây chín rộ",
    visitDuration: "Nửa ngày",
    ticket: "150.000đ trọn gói tour",
    openingHours: "08:00 - 17:00 hằng ngày",
    badges: ["popular", "verified", "trending"],
    tags: ["village", "culture", "nature", "food"],
    gallery: [
      { seed: "thoison-sampan", caption: "Chèo xuồng ba lá qua rạch dừa nước", ratio: "16/9" },
      { seed: "thoison-honey", caption: "Thưởng trà mật ong và trái cây miệt vườn", ratio: "4/3" },
      { seed: "thoison-music", caption: "Nghệ nhân biểu diễn đờn ca tài tử", ratio: "1/1" },
    ],
    nearby: ["tien-giang-cho-noi-cai-be"],
    featured: true,
  },
  {
    id: "tien-giang-cho-noi-cai-be",
    slug: "cho-noi-cai-be",
    provinceSlug: "tien-giang",
    name: "Chợ nổi Cái Bè",
    nameEn: "Cai Be Floating Market",
    type: "market",
    lng: 105.9486,
    lat: 10.3556,
    summary:
      "Chợ nổi lâu đời trên sông Tiền, nơi ghe thuyền tấp nập buôn bán trái cây và đặc sản miền Tây từ tinh mơ.",
    story:
      "Chợ nổi Cái Bè từng là một trong những chợ nổi sầm uất nhất đồng bằng sông Cửu Long, nằm ở ngã ba sông giáp ranh Tiền Giang, Vĩnh Long và Bến Tre. Từ lúc trời còn nhập nhoạng, hàng trăm ghe thuyền chở đầy trái cây, rau củ đã tụ về, mỗi ghe treo một cây bẹo cắm hàng hóa lủng lẳng để rao bán. Tiếng máy nổ, tiếng cười nói và mùi hủ tiếu nóng hổi từ ghe hàng rong tạo nên một bức tranh sông nước sống động. Du khách ngồi trên thuyền nhỏ luồn giữa chợ, mua trái cây tươi rói và cảm nhận nhịp giao thương đậm chất miền Tây vẫn còn được gìn giữ qua bao thế hệ.",
    facts: [
      "Nằm ở ngã ba sông giáp ranh ba tỉnh Tiền Giang, Vĩnh Long và Bến Tre.",
      "Các ghe dùng cây bẹo treo hàng hóa để giới thiệu mặt hàng đang bán.",
      "Là một trong những chợ nổi hình thành sớm nhất ở miền Tây Nam Bộ.",
      "Chuyên buôn bán sỉ trái cây, rau củ và đặc sản vùng đồng bằng.",
    ],
    travelTips: [
      "Đi từ 5h đến 7h sáng để thấy chợ nổi nhộn nhịp nhất.",
      "Kết hợp tham quan lò kẹo dừa và làng nghề thủ công ven sông gần đó.",
    ],
    bestTime: "Quanh năm, sáng sớm là thời điểm chợ đông nhất",
    visitDuration: "2-3 giờ",
    ticket: "",
    openingHours: "Họp chợ từ 04:00 - 08:00 hằng ngày",
    badges: ["popular", "verified"],
    tags: ["market", "culture", "food", "photography"],
    gallery: [
      { seed: "caibe-floating", caption: "Ghe thuyền tấp nập họp chợ trên sông", ratio: "16/9" },
      { seed: "caibe-beo", caption: "Người chèo ghe nón lá qua sông dưới chân cầu", ratio: "4/3" },
      { seed: "caibe-fruits", caption: "Trái cây tươi chất đầy ghe", ratio: "1/1" },
    ],
    nearby: ["tien-giang-cu-lao-thoi-son"],
  },

  {
    id: "ben-tre-con-phung",
    slug: "con-phung-xu-dua",
    provinceSlug: "ben-tre",
    name: "Cồn Phụng - xứ dừa",
    nameEn: "Con Phung - Coconut Land",
    type: "village",
    lng: 106.3756,
    lat: 10.3303,
    summary:
      "Cù lao trên sông Tiền nổi tiếng với di tích đạo Dừa, làng nghề thủ công từ dừa và đặc sản kẹo dừa Bến Tre.",
    story:
      "Cồn Phụng là một cù lao xanh mướt giữa sông Tiền, gắn liền với câu chuyện kỳ lạ về ông Đạo Dừa và những công trình kiến trúc độc đáo còn sót lại. Đến đây, du khách được dạo qua khu di tích với tháp Hòa bình chạm khắc rồng phượng cầu kỳ, rồi lạc vào không gian xứ dừa đặc sệt của Bến Tre. Khắp nơi là tiếng máy ép kẹo dừa thơm lừng, những bàn tay khéo léo đan giỏ, làm đồ mỹ nghệ từ thân và xơ dừa. Khách có thể nhâm nhi nước dừa mát lạnh, xem nuôi ong lấy mật và đi xuồng qua rạch dừa nước rợp bóng. Cồn Phụng là nơi cảm nhận trọn vẹn hồn cốt của quê hương xứ dừa.",
    facts: [
      "Gắn với di tích đạo Dừa do ông Nguyễn Thành Nam lập nên từ giữa thế kỷ 20.",
      "Tháp Hòa bình với hoa văn rồng phượng là công trình biểu tượng của cồn.",
      "Bến Tre được mệnh danh là xứ dừa với hàng loạt làng nghề thủ công từ dừa.",
      "Kẹo dừa Bến Tre là đặc sản nổi tiếng được sản xuất ngay tại các lò trên cồn.",
    ],
    travelTips: [
      "Mua kẹo dừa và đồ mỹ nghệ làm quà ngay tại các lò sản xuất trên cồn.",
      "Kết hợp đi tour 4 cù lao Long Lân Quy Phụng để khám phá trọn vùng sông Tiền.",
    ],
    bestTime: "Tháng 11 đến tháng 4, mùa khô mát mẻ thuận tiện đi lại",
    visitDuration: "Nửa ngày",
    ticket: "20.000đ tham quan di tích",
    openingHours: "07:30 - 17:00 hằng ngày",
    badges: ["popular", "verified", "trending"],
    tags: ["village", "culture", "history", "food"],
    gallery: [
      { seed: "conphung-tower", caption: "Tháp Hòa bình của di tích đạo Dừa", ratio: "16/9" },
      { seed: "conphung-candy", caption: "Lò làm kẹo dừa thơm lừng", ratio: "4/3" },
      { seed: "conphung-handicraft", caption: "Đồ thủ công mỹ nghệ từ dừa", ratio: "1/1" },
    ],
    nearby: ["tien-giang-cu-lao-thoi-son"],
    featured: true,
  },

  {
    id: "tra-vinh-ao-ba-om",
    slug: "ao-ba-om",
    provinceSlug: "tra-vinh",
    name: "Ao Bà Om",
    nameEn: "Ba Om Pond",
    type: "lake",
    lng: 106.3186,
    lat: 9.9183,
    summary:
      "Hồ nước cổ linh thiêng của người Khmer, bao quanh bởi rừng cây cổ thụ với bộ rễ trồi lên kỳ vĩ.",
    story:
      "Ao Bà Om là thắng cảnh nổi tiếng nhất của Trà Vinh, gắn liền với truyền thuyết về cuộc thi đào ao giữa phe nam và phe nữ để phân định việc cưới hỏi. Hồ nước hình chữ nhật rộng lớn quanh năm trong xanh, soi bóng những hàng sao, dầu cổ thụ hàng trăm năm tuổi. Điều kỳ lạ khiến du khách trầm trồ là bộ rễ khổng lồ của các cây cổ thụ trồi hẳn lên khỏi mặt đất, uốn lượn tạo nên những hình thù độc đáo như tác phẩm điêu khắc của thiên nhiên. Bên cạnh ao là ngôi chùa Khmer cổ kính và bảo tàng văn hóa dân tộc, nơi lưu giữ hồn cốt của cộng đồng Khmer Nam Bộ giữa lòng Trà Vinh thanh bình.",
    facts: [
      "Hồ nước cổ gắn với truyền thuyết cuộc thi đào ao giữa phe nam và phe nữ.",
      "Bao quanh là rừng cây sao, dầu cổ thụ hàng trăm năm tuổi.",
      "Bộ rễ cây trồi lên mặt đất tạo hình thù độc đáo là điểm nhấn nổi tiếng.",
      "Gắn liền với văn hóa Khmer Nam Bộ và chùa Âng cổ kính bên cạnh.",
    ],
    travelTips: [
      "Ghé chùa Âng và bảo tàng văn hóa Khmer ngay cạnh ao để hiểu thêm văn hóa địa phương.",
      "Đến vào dịp lễ Ok Om Bok để hòa mình vào không khí lễ hội của người Khmer.",
    ],
    bestTime: "Tháng 11 đến tháng 1, dịp lễ Ok Om Bok của người Khmer",
    visitDuration: "1-2 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["verified", "hidden-gem", "festival"],
    tags: ["lake", "culture", "nature", "photography"],
    gallery: [
      { seed: "baom-roots", caption: "Bộ rễ cây cổ thụ trồi lên kỳ vĩ", ratio: "16/9" },
      { seed: "baom-pond", caption: "Hồ nước trong xanh soi bóng cây", ratio: "4/3" },
      { seed: "baom-khmer", caption: "Chùa Khmer cổ kính bên ao", ratio: "1/1" },
    ],
    nearby: ["tra-vinh-chua-vam-ray"],
    featured: true,
  },
  {
    id: "tra-vinh-chua-vam-ray",
    slug: "chua-vam-ray",
    provinceSlug: "tra-vinh",
    name: "Chùa Vàm Ray",
    nameEn: "Vam Ray Pagoda",
    type: "temple",
    lng: 106.2461,
    lat: 9.7547,
    summary:
      "Ngôi chùa Khmer dát vàng lộng lẫy, được xem là một trong những chùa Khmer lớn và đẹp bậc nhất Việt Nam.",
    story:
      "Chùa Vàm Ray tọa lạc tại huyện Trà Cú, là ngôi chùa Khmer mang vẻ đẹp tráng lệ hiếm có ở miền Tây. Toàn bộ ngôi chùa được sơn son thếp vàng rực rỡ, lấp lánh dưới ánh nắng với kiến trúc Angkor đặc trưng, mái nhọn nhiều tầng và những phù điêu chạm khắc tinh xảo. Bên trong chính điện là tượng Phật nằm dài hơn năm mươi mét uy nghi, một trong những tượng Phật nằm lớn nhất Việt Nam. Khắp khuôn viên là tượng tiên nữ Kẽn nair, thần rắn Naga và những hoa văn dát vàng cầu kỳ. Đến đây, du khách không chỉ chiêm bái mà còn được chiêm ngưỡng đỉnh cao nghệ thuật kiến trúc và điêu khắc của văn hóa Phật giáo Nam tông Khmer.",
    facts: [
      "Mang kiến trúc Angkor đặc trưng với mái nhọn nhiều tầng dát vàng rực rỡ.",
      "Tượng Phật nằm trong chùa dài hơn 50 mét, thuộc loại lớn nhất Việt Nam.",
      "Khuôn viên trang trí tượng tiên nữ Kẽn nair và thần rắn Naga tinh xảo.",
      "Là chùa Phật giáo Nam tông Khmer tiêu biểu của tỉnh Trà Vinh.",
    ],
    travelTips: [
      "Ăn mặc kín đáo, lịch sự khi vào tham quan và chiêm bái trong chính điện.",
      "Đến vào buổi sáng để ánh nắng làm nổi bật vẻ lộng lẫy dát vàng của chùa.",
    ],
    bestTime: "Quanh năm, đẹp nhất vào mùa khô tháng 11 đến tháng 4",
    visitDuration: "1-2 giờ",
    ticket: "",
    openingHours: "06:00 - 18:00 hằng ngày",
    badges: ["verified", "hidden-gem"],
    tags: ["temple", "culture", "history", "photography"],
    gallery: [
      { seed: "vamray-golden", caption: "Kiến trúc Angkor dát vàng rực rỡ", ratio: "16/9" },
      { seed: "vamray-buddha", caption: "Tượng Phật nằm uy nghi trong chính điện", ratio: "4/3" },
      { seed: "vamray-naga", caption: "Phù điêu thần rắn Naga tinh xảo", ratio: "1/1" },
    ],
    nearby: ["tra-vinh-ao-ba-om"],
  },

  {
    id: "vinh-long-cu-lao-an-binh",
    slug: "cu-lao-an-binh",
    provinceSlug: "vinh-long",
    name: "Cù lao An Bình",
    nameEn: "An Binh Islet",
    type: "village",
    lng: 106.0,
    lat: 10.2667,
    summary:
      "Cù lao trù phú giữa sông Tiền và sông Cổ Chiên, thiên đường miệt vườn với homestay sinh thái và trái cây bốn mùa.",
    story:
      "Cù lao An Bình nằm giữa hai dòng sông Tiền và Cổ Chiên, là vùng đất phù sa màu mỡ với những vườn cây trái sai trĩu quanh năm. Đây là điểm đến lý tưởng cho ai muốn trải nghiệm cuộc sống miệt vườn đích thực: ngủ homestay nhà sàn ven sông, đạp xe qua những con đường làng rợp bóng cây, hái chôm chôm, nhãn, bòn bon ngay trong vườn. Buổi tối, khách quây quần thưởng thức cá tai tượng chiên xù, cá lóc nướng trui và nghe đờn ca tài tử bên ánh đèn dầu. Sáng sớm, một chuyến xuồng len qua rạch nhỏ đưa du khách ra chợ nổi Trà Ôn gần đó. An Bình là nơi nhịp sống miền Tây chậm rãi và đong đầy tình người.",
    facts: [
      "Nằm giữa sông Tiền và sông Cổ Chiên, đối diện thành phố Vĩnh Long.",
      "Nổi tiếng với mô hình du lịch homestay miệt vườn đầu tiên ở miền Tây.",
      "Vườn trái cây cho thu hoạch chôm chôm, nhãn, bòn bon quanh năm.",
      "Là điểm trải nghiệm đờn ca tài tử và ẩm thực sông nước đặc trưng.",
    ],
    travelTips: [
      "Đặt homestay trước để có trải nghiệm ngủ lại nhà vườn ven sông trọn vẹn.",
      "Thuê xe đạp dạo quanh cù lao và hái trái cây tại vườn vào buổi sáng.",
    ],
    bestTime: "Tháng 5 đến tháng 8, mùa trái cây chín rộ",
    visitDuration: "1-2 ngày",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["popular", "verified", "trending"],
    tags: ["village", "nature", "food", "culture"],
    gallery: [
      { seed: "anbinh-orchard", caption: "Vườn trái cây sai trĩu quả", ratio: "16/9" },
      { seed: "anbinh-homestay", caption: "Homestay nhà sàn ven sông", ratio: "4/3" },
      { seed: "anbinh-bike", caption: "Đạp xe qua con đường làng rợp bóng cây", ratio: "1/1" },
    ],
    nearby: ["vinh-long-lo-gach-mang-thit"],
    featured: true,
  },
  {
    id: "vinh-long-lo-gach-mang-thit",
    slug: "lo-gach-mang-thit",
    provinceSlug: "vinh-long",
    name: "Lò gạch Mang Thít",
    nameEn: "Mang Thit Brick Kilns",
    type: "village",
    lng: 106.0639,
    lat: 10.1414,
    summary:
      "Vương quốc lò gạch gốm trăm năm tuổi ven sông Cổ Chiên, với những tháp lò màu gạch đỏ cam đẹp như cổ tích.",
    story:
      "Làng nghề gạch gốm Mang Thít được mệnh danh là vương quốc lò gạch của miền Tây, hình thành cách đây hơn một thế kỷ ven dòng sông Cổ Chiên. Hàng nghìn lò nung hình tròn cao vút bằng gạch đỏ cam nằm san sát nhau, soi bóng xuống mặt nước, tạo nên một khung cảnh vừa hoài niệm vừa siêu thực. Những lò gạch hình củ tỏi cũ kỹ rêu phong này từng đỏ lửa ngày đêm, làm ra loại gạch và gốm đỏ nức tiếng khắp Nam Bộ. Ngày nay, dù nhiều lò đã ngưng hoạt động, khung cảnh kỳ vĩ ấy lại trở thành điểm check-in được giới trẻ săn đón, đồng thời được tỉnh quy hoạch thành di sản đương đại để gìn giữ hồn nghề cho mai sau.",
    facts: [
      "Làng nghề gạch gốm hình thành hơn 100 năm bên sông Cổ Chiên.",
      "Từng có hàng nghìn lò nung hình tròn nằm san sát thành vương quốc lò gạch.",
      "Gạch và gốm đỏ Mang Thít nổi tiếng khắp vùng Nam Bộ một thời.",
      "Đang được quy hoạch thành di sản đương đại gắn với phát triển du lịch.",
    ],
    travelTips: [
      "Đi xuồng dọc sông Cổ Chiên để ngắm toàn cảnh những hàng lò gạch ven nước.",
      "Đến lúc hoàng hôn khi ánh nắng nhuộm vàng cam các tháp lò để chụp ảnh đẹp nhất.",
    ],
    bestTime: "Tháng 11 đến tháng 4, mùa khô thuận tiện tham quan",
    visitDuration: "2-3 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["hidden-gem", "trending", "verified"],
    tags: ["village", "culture", "history", "photography"],
    gallery: [
      { seed: "mangthit-kilns", caption: "Hàng lò gạch đỏ cam ven sông", ratio: "16/9" },
      { seed: "mangthit-sunset", caption: "Tháp lò nhuộm vàng lúc hoàng hôn", ratio: "4/3" },
      { seed: "mangthit-old", caption: "Lò nung cũ kỹ rêu phong", ratio: "1/1" },
    ],
    nearby: ["vinh-long-cu-lao-an-binh"],
  },

  {
    id: "dong-thap-tram-chim",
    slug: "vuon-quoc-gia-tram-chim",
    provinceSlug: "dong-thap",
    name: "Vườn quốc gia Tràm Chim",
    nameEn: "Tram Chim National Park",
    type: "park",
    lng: 105.5,
    lat: 10.7167,
    summary:
      "Khu Ramsar tái hiện thu nhỏ Đồng Tháp Mười, thiên đường của sếu đầu đỏ và hàng trăm loài chim nước quý.",
    story:
      "Vườn quốc gia Tràm Chim là vùng đất ngập nước nổi tiếng nhất Đồng Tháp, được công nhận là khu Ramsar quan trọng của thế giới. Trên diện tích hơn bảy nghìn hecta, nơi đây tái hiện sinh động hệ sinh thái Đồng Tháp Mười nguyên thủy với rừng tràm, đồng cỏ năng, lúa ma và sen súng bạt ngàn. Tràm Chim là ngôi nhà của hơn hai trăm loài chim, trong đó quý giá nhất là sếu đầu đỏ, loài chim trong sách đỏ thường về đây tìm ăn vào mùa khô. Ngồi tắc ráng lướt trên kênh nước, du khách được ngắm những đàn cò, vạc, điên điển bay rợp trời và đắm mình giữa thiên nhiên hoang dã thuần khiết của miền Tây sông nước.",
    facts: [
      "Diện tích hơn 7.300 hecta, được công nhận là khu Ramsar thứ tư của Việt Nam.",
      "Là nơi trú ngụ của hơn 200 loài chim, nổi bật là sếu đầu đỏ quý hiếm.",
      "Tái hiện hệ sinh thái Đồng Tháp Mười nguyên thủy với rừng tràm và đồng năng.",
      "Mùa nước nổi và mùa sen nở là hai mùa cảnh quan đẹp nhất trong năm.",
    ],
    travelTips: [
      "Đi tắc ráng vào sáng sớm để ngắm chim và tránh nắng gắt buổi trưa.",
      "Mùa sếu về thường từ tháng 12 đến tháng 4, cần liên hệ trước để quan sát.",
    ],
    bestTime: "Tháng 12 đến tháng 4 mùa sếu về, hoặc tháng 9-11 mùa nước nổi",
    visitDuration: "Nửa ngày",
    ticket: "10.000đ vé vào, thuê tắc ráng riêng",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["unesco", "verified", "popular", "ai-recommended"],
    tags: ["nature", "park", "photography"],
    gallery: [
      { seed: "tramchim-crane", caption: "Sếu đầu đỏ về tìm ăn mùa khô", ratio: "16/9" },
      { seed: "tramchim-lotus", caption: "Cánh đồng sen súng bạt ngàn", ratio: "4/3" },
      { seed: "tramchim-boat", caption: "Tháp canh gỗ giữa đầm sen ngày mưa", ratio: "1/1" },
    ],
    nearby: ["dong-thap-lang-hoa-sa-dec"],
    featured: true,
  },
  {
    id: "dong-thap-lang-hoa-sa-dec",
    slug: "lang-hoa-sa-dec",
    provinceSlug: "dong-thap",
    name: "Làng hoa Sa Đéc",
    nameEn: "Sa Dec Flower Village",
    type: "village",
    lng: 105.7556,
    lat: 10.3,
    summary:
      "Làng hoa trăm năm tuổi rực rỡ sắc màu, một trong những vựa hoa kiểng lớn nhất miền Tây Nam Bộ.",
    story:
      "Làng hoa Sa Đéc, hay làng hoa Tân Quy Đông, là một trong những vựa hoa kiểng lâu đời và lớn nhất đồng bằng sông Cửu Long, đã có hơn một trăm năm tuổi. Trải dài bên dòng sông Sa Giang, hàng trăm hecta vườn hoa khoe sắc quanh năm với cúc mâm xôi, hồng, vạn thọ, cát tường và vô số loại kiểng quý. Điều độc đáo là người dân trồng hoa trên những giàn cao để tránh ngập nước, tạo nên khung cảnh hoa nở lơ lửng trên mặt nước rất riêng. Vào dịp giáp Tết, cả làng rộn ràng nhộn nhịp, ghe thuyền chở hoa tỏa đi khắp miền Nam. Dạo bước giữa biển hoa muôn màu, du khách như lạc vào một khu vườn cổ tích rực rỡ và đầy hương sắc.",
    facts: [
      "Làng nghề trồng hoa kiểng có lịch sử hơn 100 năm bên sông Sa Giang.",
      "Là một trong những vựa hoa lớn nhất miền Tây, cung cấp hoa cho cả miền Nam.",
      "Người dân trồng hoa trên giàn cao để tránh ngập nước, tạo cảnh quan độc đáo.",
      "Sa Đéc còn gắn với bối cảnh tiểu thuyết Người Tình của Marguerite Duras.",
    ],
    travelTips: [
      "Đến vào dịp giáp Tết để thấy làng hoa rực rỡ và nhộn nhịp nhất.",
      "Ghé nhà cổ Huỳnh Thủy Lê gần đó để tìm hiểu câu chuyện Người Tình nổi tiếng.",
    ],
    bestTime: "Tháng 12 đến tháng 1, dịp giáp Tết hoa nở rộ",
    visitDuration: "2-3 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["popular", "verified", "festival"],
    tags: ["village", "nature", "culture", "photography"],
    gallery: [
      { seed: "sadec-flowers", caption: "Biển hoa muôn màu rực rỡ", ratio: "16/9" },
      { seed: "sadec-racks", caption: "Hoa trồng trên giàn cao tránh ngập", ratio: "4/3" },
      { seed: "sadec-boat", caption: "Ghe thuyền chở hoa trên sông", ratio: "1/1" },
    ],
    nearby: ["dong-thap-tram-chim"],
  },

  {
    id: "hau-giang-cho-noi-nga-bay",
    slug: "cho-noi-nga-bay",
    provinceSlug: "hau-giang",
    name: "Chợ nổi Ngã Bảy",
    nameEn: "Nga Bay Floating Market",
    type: "market",
    lng: 105.8175,
    lat: 9.8156,
    summary:
      "Chợ nổi huyền thoại nơi bảy nhánh sông gặp nhau, từng là chợ nổi sầm uất và nổi tiếng bậc nhất miền Tây.",
    story:
      "Chợ nổi Ngã Bảy, còn gọi là chợ nổi Phụng Hiệp, là một biểu tượng văn hóa sông nước của Hậu Giang, hình thành từ đầu thế kỷ hai mươi tại nơi bảy con sông tụ về một điểm. Đây từng là chợ nổi lớn và sầm uất nhất miền Tây, đi vào câu hát Tình anh bán chiếu nổi tiếng của soạn giả Viễn Châu. Sáng sớm, hàng trăm ghe thuyền chở đầy nông sản, trái cây, đồ gia dụng tấp nập mua bán, mỗi ghe treo cây bẹo rao hàng đặc trưng. Du khách ngồi thuyền len giữa chợ, thưởng thức tô bún riêu nóng hổi ngay trên sông và cảm nhận nhịp sống thương hồ phóng khoáng, nghĩa tình của người dân miền Tây sông nước.",
    facts: [
      "Hình thành đầu thế kỷ 20 tại nơi bảy nhánh sông gặp nhau ở Phụng Hiệp.",
      "Từng là chợ nổi lớn và sầm uất bậc nhất đồng bằng sông Cửu Long.",
      "Đi vào bài vọng cổ Tình anh bán chiếu nổi tiếng của soạn giả Viễn Châu.",
      "Các ghe dùng cây bẹo treo hàng hóa làm dấu hiệu rao bán trên sông.",
    ],
    travelTips: [
      "Đi từ 5h đến 7h sáng để bắt trọn không khí chợ nổi đông đúc nhất.",
      "Thử ăn sáng ngay trên thuyền với bún riêu, hủ tiếu để trải nghiệm trọn vẹn.",
    ],
    bestTime: "Quanh năm, sáng sớm là lúc chợ nhộn nhịp nhất",
    visitDuration: "2-3 giờ",
    ticket: "",
    openingHours: "Họp chợ từ 05:00 - 08:00 hằng ngày",
    badges: ["popular", "verified", "festival"],
    tags: ["market", "culture", "food", "photography"],
    gallery: [
      { seed: "ngabay-market", caption: "Ghe thuyền tấp nập nơi bảy sông gặp nhau", ratio: "16/9" },
      { seed: "ngabay-beo", caption: "Cây bẹo treo hàng hóa rao bán", ratio: "4/3" },
      { seed: "ngabay-noodle", caption: "Ăn sáng bún riêu ngay trên thuyền", ratio: "1/1" },
    ],
    nearby: ["hau-giang-lung-ngoc-hoang"],
    featured: true,
  },
  {
    id: "hau-giang-lung-ngoc-hoang",
    slug: "lung-ngoc-hoang",
    provinceSlug: "hau-giang",
    name: "Khu bảo tồn Lung Ngọc Hoàng",
    nameEn: "Lung Ngoc Hoang Nature Reserve",
    type: "park",
    lng: 105.6539,
    lat: 9.7197,
    summary:
      "Lá phổi xanh của Hậu Giang với hệ sinh thái đất ngập nước nguyên sinh, được ví như Đồng Tháp Mười thu nhỏ.",
    story:
      "Khu bảo tồn thiên nhiên Lung Ngọc Hoàng được mệnh danh là lá phổi xanh của vùng Tây sông Hậu, lưu giữ một trong những mảng đất ngập nước nguyên sinh hiếm hoi còn sót lại ở đồng bằng. Trải rộng trên hơn hai nghìn tám trăm hecta, nơi đây là vùng trũng tự nhiên với rừng tràm, đồng năng, lung bàu chằng chịt và thảm thực vật phong phú. Lung Ngọc Hoàng là mái nhà của hàng trăm loài động thực vật, trong đó có nhiều loài chim, cá và bò sát quý hiếm. Đi xuồng len lỏi giữa rừng tràm tĩnh lặng, du khách được hòa mình vào thiên nhiên hoang sơ, lắng nghe tiếng chim gọi bầy và cảm nhận sự trong lành nguyên thủy của vùng đồng bưng Nam Bộ.",
    facts: [
      "Diện tích hơn 2.800 hecta, là khu bảo tồn thiên nhiên trọng điểm của Hậu Giang.",
      "Được ví như Đồng Tháp Mười thu nhỏ với hệ sinh thái đất ngập nước nguyên sinh.",
      "Là nơi trú ngụ của hàng trăm loài động thực vật, nhiều loài quý hiếm.",
      "Lung là tên gọi địa phương chỉ những vùng trũng ngập nước tự nhiên.",
    ],
    travelTips: [
      "Liên hệ ban quản lý trước để được sắp xếp xuồng và hướng dẫn tham quan.",
      "Mang giày chống trơn và đồ chống muỗi khi đi sâu vào rừng tràm.",
    ],
    bestTime: "Tháng 8 đến tháng 11, mùa nước nổi cảnh quan đẹp nhất",
    visitDuration: "Nửa ngày",
    ticket: "",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["verified", "hidden-gem", "ai-recommended"],
    tags: ["nature", "park", "photography"],
    gallery: [
      { seed: "lungngochoang-tram", caption: "Rừng tràm nguyên sinh tĩnh lặng", ratio: "16/9" },
      { seed: "lungngochoang-canal", caption: "Xuồng len giữa lung bàu chằng chịt", ratio: "4/3" },
      { seed: "lungngochoang-birds", caption: "Cầu tre len giữa rừng tràm dưới trời xanh", ratio: "1/1" },
    ],
    nearby: ["hau-giang-cho-noi-nga-bay"],
  },

  {
    id: "soc-trang-chua-doi",
    slug: "chua-doi",
    provinceSlug: "soc-trang",
    name: "Chùa Dơi",
    nameEn: "Bat Pagoda",
    type: "temple",
    lng: 105.9869,
    lat: 9.5908,
    summary:
      "Ngôi chùa Khmer cổ kính nổi tiếng với hàng nghìn con dơi quạ treo mình trên những tán cây cổ thụ.",
    story:
      "Chùa Dơi, tên Khmer là Mahatup, là một trong những ngôi chùa Khmer cổ và linh thiêng nhất Sóc Trăng, có lịch sử hơn bốn trăm năm. Chùa mang kiến trúc Phật giáo Nam tông đặc trưng với mái cong nhiều tầng, cột chạm tiên nữ và những hoa văn rực rỡ. Điều khiến nơi đây nổi tiếng khắp cả nước là hàng nghìn con dơi quạ khổng lồ treo mình lủng lẳng trên các tán sao, dầu cổ thụ trong khuôn viên chùa. Mỗi chiều, đàn dơi đồng loạt thức giấc, bay rợp trời đi kiếm ăn tạo nên cảnh tượng kỳ thú. Người dân tin rằng đàn dơi là điềm lành, được nhà chùa che chở qua bao thế kỷ. Chùa Dơi là điểm đến giao hòa giữa tâm linh, văn hóa Khmer và thiên nhiên kỳ diệu.",
    facts: [
      "Tên Khmer là chùa Mahatup, có lịch sử hơn 400 năm tại Sóc Trăng.",
      "Hàng nghìn con dơi quạ khổng lồ treo mình trên cây cổ thụ trong khuôn viên.",
      "Mang kiến trúc Phật giáo Nam tông Khmer với mái cong nhiều tầng đặc trưng.",
      "Người dân xem đàn dơi là điềm lành và được nhà chùa bảo vệ qua nhiều thế kỷ.",
    ],
    travelTips: [
      "Đến lúc chiều tà để xem đàn dơi đồng loạt bay đi kiếm ăn rợp trời.",
      "Ăn mặc lịch sự và giữ yên tĩnh khi tham quan khuôn viên chùa.",
    ],
    bestTime: "Quanh năm, dịp lễ Khmer và buổi chiều là thời điểm đẹp nhất",
    visitDuration: "1-2 giờ",
    ticket: "5.000đ",
    openingHours: "07:00 - 18:00 hằng ngày",
    badges: ["popular", "verified", "trending"],
    tags: ["temple", "culture", "history", "nature"],
    gallery: [
      { seed: "chuadoi-bats", caption: "Đàn dơi quạ treo mình trên cây cổ thụ", ratio: "16/9" },
      { seed: "chuadoi-temple", caption: "Kiến trúc Khmer mái cong nhiều tầng", ratio: "4/3" },
      { seed: "chuadoi-flight", caption: "Dơi bay rợp trời lúc chiều tà", ratio: "1/1" },
    ],
    nearby: ["soc-trang-chua-dat-set"],
    featured: true,
  },
  {
    id: "soc-trang-chua-dat-set",
    slug: "chua-dat-set",
    provinceSlug: "soc-trang",
    name: "Chùa Đất Sét",
    nameEn: "Clay Pagoda",
    type: "temple",
    lng: 105.9764,
    lat: 9.6022,
    summary:
      "Ngôi chùa độc đáo với hàng nghìn tượng nặn từ đất sét và những cây nến khổng lồ cháy suốt hàng chục năm.",
    story:
      "Chùa Đất Sét, tên chính thức là Bửu Sơn Tự, là ngôi chùa có một không hai ở Sóc Trăng và cả Việt Nam. Suốt mấy chục năm ròng, một người trong dòng họ cai quản chùa đã miệt mài nặn nên hàng nghìn pho tượng Phật, linh thú, tháp và đồ thờ hoàn toàn bằng đất sét pha bột nhang, tô màu tỉ mỉ. Nổi bật là tháp Đa Bảo và bảo tòa Liên Hoa đồ sộ với hàng nghìn cánh sen đất sét. Chùa còn lưu giữ những cây nến khổng lồ nặng hàng trăm ký, có cây thắp liên tục đã mấy chục năm vẫn chưa cháy hết, cùng những cây hương cao vút. Mỗi chi tiết đều là kết tinh của lòng thành kính và sự kiên nhẫn phi thường, khiến du khách không khỏi thán phục khi ghé thăm.",
    facts: [
      "Tên chính thức là Bửu Sơn Tự, nổi tiếng với tượng nặn hoàn toàn từ đất sét.",
      "Có hàng nghìn pho tượng Phật, linh thú và tháp được nặn thủ công tỉ mỉ.",
      "Lưu giữ những cây nến khổng lồ nặng hàng trăm ký, cháy liên tục hàng chục năm.",
      "Tháp Đa Bảo và bảo tòa Liên Hoa là hai công trình đất sét tiêu biểu của chùa.",
    ],
    travelTips: [
      "Quan sát kỹ các cây nến và cây hương khổng lồ, điểm độc đáo nhất của chùa.",
      "Kết hợp tham quan cùng Chùa Dơi gần đó trong một buổi khám phá Sóc Trăng.",
    ],
    bestTime: "Quanh năm, mát mẻ nhất vào mùa khô tháng 11 đến tháng 4",
    visitDuration: "1 giờ",
    ticket: "",
    openingHours: "07:00 - 18:00 hằng ngày",
    badges: ["verified", "hidden-gem"],
    tags: ["temple", "culture", "history"],
    gallery: [
      { seed: "datset-statues", caption: "Tượng Phật nặn từ đất sét tỉ mỉ", ratio: "16/9" },
      { seed: "datset-candles", caption: "Cây nến khổng lồ cháy hàng chục năm", ratio: "4/3" },
      { seed: "datset-tower", caption: "Bảo tòa Liên Hoa bằng đất sét", ratio: "1/1" },
    ],
    nearby: ["soc-trang-chua-doi"],
  },

  {
    id: "bac-lieu-canh-dong-dien-gio",
    slug: "canh-dong-dien-gio",
    provinceSlug: "bac-lieu",
    name: "Cánh đồng điện gió Bạc Liêu",
    nameEn: "Bac Lieu Wind Farm",
    type: "park",
    lng: 105.7842,
    lat: 9.1986,
    summary:
      "Cánh đồng quạt gió khổng lồ vươn ra biển, biểu tượng năng lượng xanh và điểm check-in mê hoặc của Bạc Liêu.",
    story:
      "Cánh đồng điện gió Bạc Liêu là một trong những nhà máy điện gió ven biển đầu tiên và lớn nhất Việt Nam, nằm trên vùng bãi bồi ven biển huyện Hòa Bình. Hàng chục tua bin gió khổng lồ cao hơn tám mươi mét sừng sững vươn lên giữa mênh mông trời nước, những cánh quạt trắng quay đều trong gió biển tạo nên khung cảnh vừa hùng vĩ vừa nên thơ. Du khách đi trên con đường dẫn ra giữa cánh đồng quạt gió, phóng tầm mắt ra biển và đắm mình trong làn gió mặn mòi. Đây không chỉ là biểu tượng cho khát vọng phát triển năng lượng sạch của miền Tây, mà còn trở thành điểm check-in cực kỳ ấn tượng, nhất là khi hoàng hôn buông xuống nhuộm đỏ cả chân trời.",
    facts: [
      "Là một trong những nhà máy điện gió ven biển đầu tiên và lớn của Việt Nam.",
      "Hàng chục tua bin gió cao hơn 80 mét đặt trên vùng bãi bồi ven biển.",
      "Biểu tượng cho phát triển năng lượng sạch của tỉnh Bạc Liêu.",
      "Trở thành điểm check-in nổi tiếng, đẹp nhất vào lúc hoàng hôn.",
    ],
    travelTips: [
      "Đến vào cuối chiều để ngắm hoàng hôn tuyệt đẹp giữa cánh đồng quạt gió.",
      "Mang theo áo khoác mỏng vì gió biển khá mạnh, nhất là buổi chiều tối.",
    ],
    bestTime: "Tháng 11 đến tháng 4, mùa khô trời trong gió đẹp",
    visitDuration: "1-2 giờ",
    ticket: "60.000đ tham quan",
    openingHours: "07:00 - 18:00 hằng ngày",
    badges: ["trending", "verified", "popular"],
    tags: ["nature", "photography", "city"],
    gallery: [
      { seed: "baclieu-turbines", caption: "Tua bin gió vươn ra biển", ratio: "16/9" },
      { seed: "baclieu-path", caption: "Con đường dẫn ra giữa cánh đồng quạt gió", ratio: "4/3" },
      { seed: "baclieu-sunset", caption: "Hàng tuabin điện gió mọc sau rặng cây xanh", ratio: "1/1" },
    ],
    nearby: ["bac-lieu-nha-cong-tu"],
    featured: true,
  },
  {
    id: "bac-lieu-nha-cong-tu",
    slug: "nha-cong-tu-bac-lieu",
    provinceSlug: "bac-lieu",
    name: "Nhà Công tử Bạc Liêu",
    nameEn: "House of Bac Lieu's Prince",
    type: "museum",
    lng: 105.7244,
    lat: 9.2853,
    summary:
      "Dinh thự cổ bề thế của Công tử Bạc Liêu, lưu giữ giai thoại ăn chơi lừng lẫy một thời của giới điền chủ Nam Bộ.",
    story:
      "Nhà Công tử Bạc Liêu là một dinh thự cổ tráng lệ tọa lạc bên dòng sông Bạc Liêu, gắn liền với giai thoại nổi tiếng về Trần Trinh Huy, vị công tử ăn chơi khét tiếng nhất Nam Bộ đầu thế kỷ hai mươi. Ngôi nhà được xây dựng theo lối kiến trúc phương Tây sang trọng với vật liệu nhập từ Pháp, nội thất gỗ quý chạm trổ tinh xảo, đèn chùm pha lê lộng lẫy. Bên trong còn lưu giữ nhiều kỷ vật quý như bộ bàn ghế cẩn xà cừ, chiếc giường nóng lạnh và những món đồ cổ giá trị. Câu chuyện về vị công tử đốt tiền nấu trứng, lái máy bay riêng đi thăm ruộng đã trở thành huyền thoại. Tham quan nơi đây, du khách như ngược dòng thời gian về thời vàng son của tầng lớp đại điền chủ miền Tây.",
    facts: [
      "Gắn với giai thoại về Trần Trinh Huy, công tử ăn chơi nổi tiếng nhất Nam Bộ.",
      "Dinh thự xây theo kiến trúc phương Tây với vật liệu nhập khẩu từ Pháp.",
      "Lưu giữ nhiều cổ vật quý như bàn ghế cẩn xà cừ, đèn chùm pha lê.",
      "Giai thoại đốt tiền nấu trứng và sở hữu máy bay riêng đã thành huyền thoại.",
    ],
    travelTips: [
      "Thuê hướng dẫn viên tại chỗ để nghe trọn vẹn các giai thoại thú vị về công tử.",
      "Có thể nghỉ lại khách sạn trong khuôn viên để trải nghiệm không gian xưa.",
    ],
    bestTime: "Quanh năm, mát mẻ nhất vào mùa khô tháng 11 đến tháng 4",
    visitDuration: "1 giờ",
    ticket: "30.000đ",
    openingHours: "07:00 - 17:30 hằng ngày",
    badges: ["popular", "verified"],
    tags: ["museum", "history", "culture", "city"],
    gallery: [
      { seed: "congtu-mansion", caption: "Dinh thự cổ kiến trúc phương Tây", ratio: "16/9" },
      { seed: "congtu-interior", caption: "Nội thất gỗ quý chạm trổ tinh xảo", ratio: "4/3" },
      { seed: "congtu-antiques", caption: "Cổ vật cẩn xà cừ giá trị", ratio: "1/1" },
    ],
    nearby: ["bac-lieu-canh-dong-dien-gio"],
  },

  {
    id: "ca-mau-mui-ca-mau",
    slug: "mui-ca-mau",
    provinceSlug: "ca-mau",
    name: "Mũi Cà Mau",
    nameEn: "Ca Mau Cape",
    type: "park",
    lng: 104.7233,
    lat: 8.6,
    summary:
      "Điểm cực Nam thiêng liêng của Tổ quốc, nơi đất rừng ngập mặn lấn biển và mặt trời mọc lặn cùng nhìn thấy.",
    story:
      "Mũi Cà Mau là vùng đất cực Nam thiêng liêng của Tổ quốc, điểm mà mỗi người Việt đều mong một lần đặt chân tới. Nằm trong vườn quốc gia Mũi Cà Mau, khu Ramsar và dự trữ sinh quyển thế giới, nơi đây là vùng đất bãi bồi liên tục lấn ra biển nhờ phù sa, với rừng đước, rừng mắm ngập mặn xanh thẳm. Du khách check-in bên cột mốc tọa độ quốc gia hình con tàu, đứng trên đài quan sát phóng tầm mắt ra biển Đông và vịnh Thái Lan, nơi hiếm hoi có thể ngắm cả bình minh lẫn hoàng hôn trên biển. Đi cano xuyên rừng ngập mặn, thưởng thức cua, ba khía, ốc len tươi rói, du khách cảm nhận trọn vẹn vẻ hoang sơ và niềm tự hào nơi chót mũi đất nước.",
    facts: [
      "Là điểm cực Nam trên đất liền của Việt Nam, thuộc vườn quốc gia Mũi Cà Mau.",
      "Được công nhận là khu Ramsar và khu dự trữ sinh quyển thế giới.",
      "Vùng bãi bồi liên tục lấn ra biển nhờ phù sa, mỗi năm thêm vài chục mét.",
      "Nơi hiếm hoi có thể ngắm cả mặt trời mọc và lặn trên biển trong cùng một ngày.",
    ],
    travelTips: [
      "Check-in cột mốc tọa độ quốc gia và biểu tượng con tàu Mũi Cà Mau.",
      "Đi cano xuyên rừng ngập mặn và thưởng thức hải sản tươi như cua, ba khía.",
    ],
    bestTime: "Tháng 12 đến tháng 4, mùa khô biển êm thuận tiện đi lại",
    visitDuration: "Nửa ngày",
    ticket: "50.000đ vào khu du lịch",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["unesco", "verified", "popular", "trending"],
    tags: ["park", "nature", "photography", "island"],
    gallery: [
      { seed: "muicamau-landmark", caption: "Cột mốc tọa độ quốc gia cực Nam", ratio: "16/9" },
      { seed: "muicamau-mangrove", caption: "Rừng đước ngập mặn xanh thẳm", ratio: "4/3" },
      { seed: "muicamau-ship", caption: "Biểu tượng con tàu nơi chót mũi", ratio: "1/1" },
    ],
    nearby: ["ca-mau-rung-u-minh-ha"],
    featured: true,
  },
  {
    id: "ca-mau-rung-u-minh-ha",
    slug: "rung-u-minh-ha",
    provinceSlug: "ca-mau",
    name: "Rừng U Minh Hạ",
    nameEn: "U Minh Ha Forest",
    type: "park",
    lng: 104.9667,
    lat: 9.3167,
    summary:
      "Rừng tràm nguyên sinh trên đất than bùn nổi tiếng với mật ong rừng, cá đồng và hệ sinh thái độc đáo.",
    story:
      "Rừng U Minh Hạ là cánh rừng tràm ngập nước nổi tiếng của Cà Mau, được công nhận là vườn quốc gia và nằm trong khu dự trữ sinh quyển thế giới. Đặc trưng của U Minh Hạ là lớp đất than bùn dày, nước có màu đỏ nâu như nước trà, nuôi dưỡng rừng tràm bạt ngàn cùng hệ động thực vật phong phú. Đây là vùng đất gắn với nghề gác kèo ong lấy mật truyền thống, với những giọt mật vàng óng thơm lừng nức tiếng. Du khách đi xuồng len qua rừng tràm tĩnh lặng, ngắm chim, câu cá đồng và thưởng thức đặc sản dân dã như cá lóc nướng trui, lươn um, mật ong rừng. U Minh Hạ là nơi cảm nhận trọn vẹn vẻ đẹp hoang sơ và đời sống mộc mạc của vùng đất phương Nam.",
    facts: [
      "Vườn quốc gia rừng tràm trên đất than bùn, thuộc khu dự trữ sinh quyển thế giới.",
      "Nước rừng có màu đỏ nâu như nước trà do ngấm chất từ lớp than bùn.",
      "Nổi tiếng với nghề gác kèo ong lấy mật truyền thống lâu đời.",
      "Hệ sinh thái phong phú với nhiều loài chim, cá đồng và động vật quý hiếm.",
    ],
    travelTips: [
      "Thử trải nghiệm ăn ong rừng và mua mật ong nguyên chất làm quà.",
      "Đi xuồng xuyên rừng vào mùa khô để câu cá và thưởng thức ẩm thực đồng quê.",
    ],
    bestTime: "Tháng 12 đến tháng 4, mùa khô thuận tiện đi rừng và bắt cá",
    visitDuration: "Nửa ngày",
    ticket: "30.000đ",
    openingHours: "07:00 - 17:00 hằng ngày",
    badges: ["verified", "hidden-gem", "ai-recommended"],
    tags: ["park", "nature", "food", "photography"],
    gallery: [
      { seed: "uminh-tram", caption: "Rừng tràm nguyên sinh trên đất than bùn", ratio: "16/9" },
      { seed: "uminh-honey", caption: "Nghề gác kèo ong lấy mật truyền thống", ratio: "4/3" },
      { seed: "uminh-fishing", caption: "Câu cá đồng giữa rừng tràm", ratio: "1/1" },
    ],
    nearby: ["ca-mau-mui-ca-mau"],
  },
];

export const mekongProvinces: Record<string, ProvinceEditorial> = {
  "long-an": {
    slug: "long-an",
    summary:
      "Cửa ngõ miền Tây giáp Sài Gòn, nổi tiếng với vùng Đồng Tháp Mười, rừng tràm và những cánh đồng lúa trải dài.",
    story:
      "Long An là tỉnh cửa ngõ nối Thành phố Hồ Chí Minh với đồng bằng sông Cửu Long, mang đặc trưng vùng Đồng Tháp Mười với rừng tràm, đất ngập nước và đồng lúa bát ngát. Nơi đây có làng nổi Tân Lập thơ mộng và khu bảo tồn Láng Sen hoang sơ, là điểm đến lý tưởng cho du lịch sinh thái. Người Long An hiền hòa, mến khách, gìn giữ nếp sống nông nghiệp đậm chất miền Tây giữa nhịp phát triển hối hả của vùng kinh tế trọng điểm phía Nam.",
    bestTime: "Tháng 9 đến tháng 11, mùa nước nổi rừng tràm xanh tốt",
    specialties: ["Gạo nàng thơm Chợ Đào", "Rượu đế Gò Đen", "Lạp xưởng Cần Đước", "Đậu phộng Đức Hòa"],
  },
  "tien-giang": {
    slug: "tien-giang",
    summary:
      "Vựa trái cây của miền Tây bên sông Tiền, với các cù lao trù phú, chợ nổi sầm uất và đờn ca tài tử ngọt ngào.",
    story:
      "Tiền Giang nằm bên dòng sông Tiền hiền hòa, là một trong những vựa trái cây lớn nhất đồng bằng sông Cửu Long. Tỉnh nổi tiếng với các cù lao xanh mát như Thới Sơn, chợ nổi Cái Bè trăm năm tuổi và những vườn cây ăn trái sai trĩu quanh năm. Du lịch miệt vườn sông nước nơi đây gắn liền với đờn ca tài tử, ẩm thực dân dã và lòng hiếu khách của người miền Tây. Tiền Giang là điểm khởi đầu quen thuộc cho hành trình khám phá đồng bằng.",
    bestTime: "Tháng 5 đến tháng 8, mùa trái cây chín rộ",
    specialties: ["Hủ tiếu Mỹ Tho", "Trái cây miệt vườn", "Mắm còng", "Bánh giá Gò Công"],
  },
  "ben-tre": {
    slug: "ben-tre",
    summary:
      "Xứ dừa của miền Tây với những cù lao xanh mát, làng nghề thủ công từ dừa và đặc sản kẹo dừa nức tiếng.",
    story:
      "Bến Tre được mệnh danh là xứ dừa, nơi những rặng dừa xanh trải dài bất tận trên ba cù lao lớn giữa các nhánh sông Tiền. Cây dừa gắn bó mật thiết với đời sống người dân, từ nước dừa, kẹo dừa đến đồ thủ công mỹ nghệ tinh xảo làm từ thân, lá và xơ dừa. Du khách đến Bến Tre để đi xuồng qua rạch dừa nước, thăm các lò kẹo dừa thơm lừng và cảm nhận hồn quê mộc mạc, nghĩa tình của vùng đất ba dải cù lao Bảo, Minh và An Hóa.",
    bestTime: "Tháng 11 đến tháng 4, mùa khô mát mẻ",
    specialties: ["Kẹo dừa Bến Tre", "Bánh tráng Mỹ Lồng", "Bánh phồng Sơn Đốc", "Đuông dừa"],
  },
  "tra-vinh": {
    slug: "tra-vinh",
    summary:
      "Vùng đất văn hóa Khmer đặc sắc với những ngôi chùa cổ kính, hàng cây cổ thụ và lễ hội truyền thống độc đáo.",
    story:
      "Trà Vinh là tỉnh ven biển mang đậm bản sắc văn hóa Khmer Nam Bộ, nổi tiếng với hàng trăm ngôi chùa cổ kính nằm giữa những hàng cây sao, dầu trăm tuổi. Thắng cảnh Ao Bà Om huyền thoại, chùa Vàm Ray dát vàng lộng lẫy cùng các lễ hội Ok Om Bok, Chôl Chnăm Thmây tạo nên một không gian văn hóa đặc sắc hiếm có. Người Kinh, Khmer và Hoa cùng sinh sống hòa thuận, gìn giữ những giá trị truyền thống và nét đẹp tâm linh độc đáo của vùng đất hiền hòa này.",
    bestTime: "Tháng 11 đến tháng 1, dịp lễ Ok Om Bok của người Khmer",
    specialties: ["Bún nước lèo", "Bánh canh Bến Có", "Dừa sáp Cầu Kè", "Cốm dẹp"],
  },
  "vinh-long": {
    slug: "vinh-long",
    summary:
      "Trái tim miệt vườn của miền Tây giữa hai dòng sông, nổi tiếng với cù lao trái cây và làng nghề gạch gốm trăm năm.",
    story:
      "Vĩnh Long nằm giữa sông Tiền và sông Hậu, là vùng đất phù sa trù phú bậc nhất đồng bằng sông Cửu Long. Tỉnh nổi tiếng với cù lao An Bình xanh mát, cái nôi của du lịch homestay miệt vườn, cùng vương quốc lò gạch gốm Mang Thít độc đáo ven sông Cổ Chiên. Vĩnh Long còn là quê hương của nhiều danh nhân và là vùng đất hiếu học. Đến đây, du khách được đắm mình trong những vườn trái cây sum suê, nghe đờn ca tài tử và cảm nhận nhịp sống sông nước chân chất, đậm đà tình người.",
    bestTime: "Tháng 5 đến tháng 8, mùa trái cây chín rộ",
    specialties: ["Cá tai tượng chiên xù", "Bưởi năm roi Bình Minh", "Khoai lang Bình Tân", "Tàu hủ ky"],
  },
  "dong-thap": {
    slug: "dong-thap",
    summary:
      "Đất sen hồng của miền Tây với vườn quốc gia Tràm Chim, làng hoa Sa Đéc rực rỡ và những cánh đồng sen bát ngát.",
    story:
      "Đồng Tháp được mệnh danh là đất sen hồng, vùng đất thuần khiết với những cánh đồng sen bát ngát và hệ sinh thái Đồng Tháp Mười nổi tiếng. Tỉnh sở hữu vườn quốc gia Tràm Chim, ngôi nhà của sếu đầu đỏ quý hiếm, cùng làng hoa Sa Đéc trăm năm tuổi rực rỡ sắc màu. Con người Đồng Tháp chân chất, nghĩa tình, gắn bó với ruộng đồng và hoa sen. Đến đây, du khách được hòa mình vào thiên nhiên trong lành, thưởng thức ẩm thực từ sen và cảm nhận vẻ đẹp bình yên của miền sông nước.",
    bestTime: "Tháng 9 đến tháng 11 mùa nước nổi, hoặc tháng 12-4 mùa sếu về",
    specialties: ["Hủ tiếu Sa Đéc", "Các món từ sen", "Nem Lai Vung", "Quýt hồng Lai Vung", "Khô cá lóc"],
  },
  "hau-giang": {
    slug: "hau-giang",
    summary:
      "Vùng đất sông nước trù phú với chợ nổi Ngã Bảy huyền thoại, khu bảo tồn Lung Ngọc Hoàng và những vườn cây xanh mát.",
    story:
      "Hậu Giang là tỉnh nằm ở trung tâm vùng Tây sông Hậu, mang đậm nét đẹp sông nước miệt vườn đồng bằng. Nơi đây có chợ nổi Ngã Bảy huyền thoại đi vào câu vọng cổ, khu bảo tồn thiên nhiên Lung Ngọc Hoàng được ví như lá phổi xanh và những vườn khóm, vườn cây trái xanh ngút ngàn. Người dân Hậu Giang phóng khoáng, nghĩa tình, gắn bó với nghề nông và sông nước. Đến Hậu Giang, du khách được trải nghiệm văn hóa thương hồ, ẩm thực đồng quê và vẻ đẹp yên bình của vùng đất phương Nam.",
    bestTime: "Tháng 11 đến tháng 4, mùa khô thuận tiện du lịch",
    specialties: ["Khóm Cầu Đúc", "Cá thát lát Hậu Giang", "Bưởi Năm Roi Phú Hữu", "Đọt choại"],
  },
  "soc-trang": {
    slug: "soc-trang",
    summary:
      "Vùng đất giao thoa văn hóa Kinh, Khmer, Hoa với những ngôi chùa độc đáo, lễ hội đua ghe ngo và đặc sản trứ danh.",
    story:
      "Sóc Trăng là tỉnh ven biển nổi tiếng với sự giao thoa đặc sắc của ba dân tộc Kinh, Khmer và Hoa, thể hiện rõ qua hệ thống chùa chiền độc đáo bậc nhất miền Tây. Nơi đây có Chùa Dơi với hàng nghìn con dơi quạ, Chùa Đất Sét kỳ lạ cùng nhiều ngôi chùa Khmer rực rỡ. Lễ hội đua ghe ngo dịp Ok Om Bok thu hút đông đảo du khách mỗi năm. Sóc Trăng còn nổi tiếng với những đặc sản trứ danh như bánh pía, lạp xưởng, mang đến hành trình khám phá văn hóa và ẩm thực đầy thú vị.",
    bestTime: "Tháng 11 đến tháng 1, dịp lễ Ok Om Bok và đua ghe ngo",
    specialties: ["Bánh pía Sóc Trăng", "Bún nước lèo", "Lạp xưởng", "Mè láo", "Bánh cống"],
  },
  "bac-lieu": {
    slug: "bac-lieu",
    summary:
      "Quê hương bản Dạ cổ hoài lang và giai thoại Công tử Bạc Liêu, với cánh đồng điện gió ven biển độc đáo.",
    story:
      "Bạc Liêu là vùng đất ven biển giàu bản sắc văn hóa, được biết đến là cái nôi của bản Dạ cổ hoài lang, khởi nguồn của nghệ thuật đờn ca tài tử và cải lương Nam Bộ. Tỉnh gắn liền với giai thoại nổi tiếng về Công tử Bạc Liêu ăn chơi khét tiếng một thời, cùng dinh thự cổ tráng lệ còn lưu giữ. Bạc Liêu ngày nay còn nổi bật với cánh đồng điện gió ven biển hùng vĩ, biểu tượng cho năng lượng xanh. Đến đây, du khách được hòa mình vào không gian văn hóa nghệ thuật và vẻ đẹp hiện đại đan xen truyền thống.",
    bestTime: "Tháng 11 đến tháng 4, mùa khô trời trong gió đẹp",
    specialties: ["Bún bò cay", "Bánh tằm Ngan Dừa", "Ba khía muối", "Nhãn Bạc Liêu"],
  },
  "ca-mau": {
    slug: "ca-mau",
    summary:
      "Vùng đất cực Nam thiêng liêng của Tổ quốc với rừng ngập mặn bạt ngàn, hải sản trù phú và đời sống sông nước mộc mạc.",
    story:
      "Cà Mau là tỉnh cực Nam của Tổ quốc, vùng đất ba mặt giáp biển với hệ sinh thái rừng ngập mặn và rừng tràm độc đáo bậc nhất Việt Nam. Mũi Cà Mau thiêng liêng, vườn quốc gia U Minh Hạ và những cánh rừng đước, rừng mắm xanh thẳm tạo nên cảnh quan hoang sơ kỳ vĩ, được công nhận là khu dự trữ sinh quyển thế giới. Đất Mũi trù phú với cua, ba khía, tôm cá tươi rói cùng mật ong rừng U Minh nức tiếng. Con người Cà Mau chân chất, phóng khoáng, gắn bó với rừng, với biển nơi chót cùng đất nước.",
    bestTime: "Tháng 12 đến tháng 4, mùa khô biển êm thuận tiện đi lại",
    specialties: ["Cua Cà Mau", "Ba khía muối", "Mật ong rừng U Minh", "Cá thòi lòi", "Tôm khô Rạch Gốc"],
  },
};
