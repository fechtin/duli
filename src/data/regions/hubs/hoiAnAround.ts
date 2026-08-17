// Hội An hub depth, cluster 2 of 2: the villages, beaches and river outside the old town
// (spec tasks/038-vn-hubs.md). These are the half-day trips that let a Hội An itinerary run
// past the second day without repeating the same three streets.
//
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`.
// Làng gốm Thanh Hà was dropped from this batch: the resolver's only hit was a POI named
// "thanh hà" at latitude 16.10 — inside Đà Nẵng, 25km from Hội An. Plausible name, wrong
// place; per the 033 rule the candidate goes rather than the coordinate gets guessed.
import type { Destination } from "@/lib/types";

export const hoiAnAroundDestinations: Destination[] = [
  {
    id: "tra-que-vegetable-village",
    slug: "lang-rau-tra-que",
    provinceSlug: "quang-nam",
    name: "Làng rau Trà Quế",
    nameEn: "Tra Que Vegetable Village",
    type: "village",
    lng: 108.336,
    lat: 15.9027,
    summary:
      "Làng rau thơm bón bằng rong vớt dưới đầm — mùi của làng là mùi của mọi đĩa ăn ở Hội An.",
    story:
      "Trà Quế nằm giữa Hội An và biển An Bàng, kẹp giữa một con sông và một cái đầm, và toàn bộ danh tiếng của nó nằm ở thứ phân bón mà dân làng dùng: rong vớt từ đầm Trà Quế, không phân hoá học. Rau ở đây lá nhỏ, thân giòn và thơm gắt hơn hẳn rau chợ — chính nó là thứ làm nên đĩa rau sống ăn kèm cao lầu, mì Quảng, bánh xèo khắp phố cổ. Làng mở cửa cho khách vào làm nông dân thật sự: đội nón, gánh nước tưới bằng đôi thùng, cuốc luống, rồi ngồi ăn bữa trưa nấu bằng chính rau vừa hái. Chỉ cách phố cổ vài cây số nhưng ở đây không còn tiếng xe nào.",
    facts: [
      "Làng nằm cách phố cổ Hội An khoảng 3km, trên đường ra biển An Bàng.",
      "Rau được bón bằng rong vớt từ đầm Trà Quế thay cho phân hoá học.",
      "Rau Trà Quế là rau sống ăn kèm truyền thống của cao lầu, mì Quảng và bánh xèo xứ Quảng.",
      "Làng tổ chức các buổi trải nghiệm để khách trực tiếp trồng, tưới và thu hoạch rau.",
    ],
    travelTips: [
      "Đi buổi sáng sớm khi dân làng đang tưới rau — giữa trưa luống rau vắng người.",
      "Thuê xe đạp từ phố cổ, đường bằng phẳng và chỉ mất khoảng hai mươi phút.",
    ],
    bestTime: "Tháng 2 đến tháng 8, buổi sáng sớm",
    visitDuration: "2 - 3 giờ nếu tham gia trải nghiệm làm nông",
    ticket: "Vé tham quan làng khoảng 35.000đ; buổi trải nghiệm tính riêng",
    openingHours: "07:00 - 17:00",
    badges: ["verified", "hidden-gem"],
    tags: ["village", "food", "nature", "family"],
    nearby: ["an-bang-beach", "hoi-an-ancient-town", "cua-dai-beach"],
    sourceUrl: "https://www.openstreetmap.org/node/3079969135",
    verifiedAt: "2026-08-16",
  },
  {
    id: "kim-bong-carpentry-village",
    slug: "lang-moc-kim-bong",
    provinceSlug: "quang-nam",
    name: "Làng mộc Kim Bồng",
    nameEn: "Kim Bong Carpentry Village",
    type: "village",
    lng: 108.3253,
    lat: 15.8645,
    summary:
      "Làng thợ mộc bên kia sông Thu Bồn, nơi ra đời những bộ khung nhà đang chống đỡ cả phố cổ.",
    story:
      "Từ bến sông trong phố cổ, một chuyến đò ngang chừng mười phút là sang cù lao Cẩm Kim — và sang một nhịp sống khác hẳn. Kim Bồng là làng mộc lâu đời của xứ Quảng, và phần lớn những bộ vì kèo, cột, cửa bức bàn chạm trổ trong các ngôi nhà cổ Hội An đều từ tay thợ làng này mà ra. Danh tiếng của họ vượt khỏi vùng: theo lưu truyền địa phương, thợ Kim Bồng từng được triệu ra Huế góp sức dựng các công trình của triều Nguyễn. Đi trong làng bây giờ vẫn nghe tiếng đục lách cách từ các xưởng mở cửa ra đường, mùi gỗ mới, và những pho tượng đang đẽo dở dựng ngoài sân.",
    facts: [
      "Làng nằm trên cù lao Cẩm Kim, bên kia sông Thu Bồn so với phố cổ Hội An.",
      "Thợ Kim Bồng làm phần lớn khung nhà và chi tiết chạm gỗ trong các nhà cổ Hội An.",
      "Theo lưu truyền địa phương, thợ làng từng được triệu ra Huế dựng các công trình triều Nguyễn.",
      "Nghề mộc ở đây được truyền qua nhiều đời trong các dòng họ của làng.",
    ],
    travelTips: [
      "Đi đò ngang từ bến trong phố cổ là cách sang làng nhanh và hay nhất, khoảng mười phút.",
      "Ghé vào giờ hành chính; nhiều xưởng nghỉ sớm và làng rất vắng sau 17:00.",
    ],
    bestTime: "Quanh năm, buổi sáng khi các xưởng đang làm",
    visitDuration: "2 giờ kể cả đò",
    ticket: "",
    openingHours: "Khoảng 07:30 - 17:00 theo giờ làm của các xưởng",
    badges: ["verified", "hidden-gem"],
    tags: ["village", "culture", "history", "shopping"],
    nearby: ["hoi-an-ancient-town", "bay-mau-coconut-forest", "japanese-covered-bridge"],
    sourceUrl: "https://www.openstreetmap.org/node/10709738006",
    verifiedAt: "2026-08-16",
  },
  {
    id: "bay-mau-coconut-forest",
    slug: "rung-dua-bay-mau",
    provinceSlug: "quang-nam",
    name: "Rừng dừa Bảy Mẫu",
    nameEn: "Bay Mau Coconut Forest",
    type: "park",
    lng: 108.3742,
    lat: 15.875,
    summary:
      "Rừng dừa nước ngập mặn đi bằng thuyền thúng — từng là căn cứ kháng chiến, nay là buổi chiều ồn ào nhất Hội An.",
    story:
      "Rừng dừa nước mọc ở vùng nước lợ nơi sông Thu Bồn gặp biển, lá cao quá đầu người, rễ chằng chịt dưới mặt nước — một địa hình mà chỉ người thuộc đường mới đi được. Chính vì thế trong chiến tranh nơi này là căn cứ, quân giải phóng ém trong rừng dừa ngay sát Hội An. Ngày nay khách xuống thúng, một người chèo đưa luồn qua các lạch nhỏ, dạy đan châu chấu bằng lá dừa, rồi tới quãng nước rộng thì thúng xoay tít theo nhịp trống. Nên biết trước để chọn đúng: đây là một trải nghiệm vui và rất ồn, không phải một chuyến đi rừng yên tĩnh.",
    facts: [
      "Rừng dừa nước mọc ở vùng nước lợ nơi hạ lưu sông Thu Bồn đổ ra biển.",
      "Khu vực từng là căn cứ kháng chiến nhờ địa hình lạch nước chằng chịt khó tiếp cận.",
      "Khách tham quan bằng thuyền thúng, mỗi thúng có một người chèo.",
      "Màn múa thúng xoay theo nhịp trống là tiết mục quen thuộc của các tour tại đây.",
    ],
    travelTips: [
      "Chốt giá trọn gói cho cả thúng trước khi xuống, gồm cả tiền boa và tiết mục múa thúng.",
      "Muốn yên tĩnh thì đi buổi sáng sớm; buổi chiều là lúc đông đoàn và ồn nhất.",
    ],
    bestTime: "Tháng 2 đến tháng 8, buổi sáng",
    visitDuration: "2 giờ",
    ticket: "Vé vào cửa và tiền thuê thúng tính riêng, khoảng 150.000đ - 250.000đ mỗi thúng",
    openingHours: "07:30 - 17:00",
    badges: ["popular", "verified"],
    tags: ["nature", "adventure", "family", "history"],
    nearby: ["cua-dai-beach", "hoi-an-ancient-town", "kim-bong-carpentry-village"],
    sourceUrl: "https://www.wikidata.org/wiki/Q138660353",
    verifiedAt: "2026-08-16",
  },
  {
    id: "an-bang-beach",
    slug: "bien-an-bang",
    provinceSlug: "quang-nam",
    name: "Biển An Bàng",
    nameEn: "An Bang Beach",
    type: "beach",
    lng: 108.3369,
    lat: 15.9157,
    summary:
      "Bãi biển của Hội An sau khi Cửa Đại bị xói lở — hàng quán thấp, ghế gỗ, hoàng hôn ngay trên cát.",
    story:
      "Khi bờ Cửa Đại bị biển ăn mòn dần, An Bàng lặng lẽ thay chỗ và trở thành bãi tắm chính của Hội An. Nó vẫn giữ được dáng một làng chài: đường vào hẹp, hai bên là những quán ăn mái lá thấp, ghế gỗ kê thẳng trên cát, thuyền thúng úp ngược nằm cuối bãi. Nước trong, bãi thoải, và vì bờ quay hướng đông bắc nên buổi chiều mặt trời lặn xuống phía sau lưng, để lại cả một dải trời hồng trên mặt biển. Từ phố cổ đạp xe ra chỉ khoảng hai mươi phút, đủ gần để chiều nào cũng ra được mà không thấy phiền.",
    facts: [
      "An Bàng trở thành bãi tắm chính của Hội An sau khi bờ biển Cửa Đại bị xói lở nặng.",
      "Bãi cách phố cổ Hội An khoảng 4km, đi xe đạp mất chừng hai mươi phút.",
      "Khu vực vẫn giữ nếp làng chài với các quán ăn mái lá và thuyền thúng cuối bãi.",
      "Bãi biển nằm ngay cạnh làng rau Trà Quế trên cùng một trục đường.",
    ],
    travelTips: [
      "Đạp xe từ phố cổ ra, có bãi gửi xe ở đầu đường xuống biển.",
      "Từ tháng 10 đến tháng 12 biển động và sóng lớn — nhiều quán trên bãi cũng đóng cửa.",
    ],
    bestTime: "Tháng 3 đến tháng 8",
    visitDuration: "Nửa ngày",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["popular", "verified"],
    tags: ["beach", "nature", "sunset", "food"],
    nearby: ["tra-que-vegetable-village", "cua-dai-beach", "hoi-an-ancient-town"],
    sourceUrl: "https://www.openstreetmap.org/node/4343966693",
    verifiedAt: "2026-08-16",
  },
  {
    id: "cua-dai-beach",
    slug: "bien-cua-dai",
    provinceSlug: "quang-nam",
    name: "Biển Cửa Đại",
    nameEn: "Cua Dai Beach",
    type: "beach",
    lng: 108.3662,
    lat: 15.8981,
    summary:
      "Nơi sông Thu Bồn đổ ra biển, và cũng là nơi thấy rõ nhất chuyện xói lở bờ biển miền Trung.",
    story:
      "Cửa Đại là chỗ sông Thu Bồn kết thúc hành trình của mình. Suốt nhiều năm đây là bãi tắm đẹp nhất Hội An, cho tới khi biển bắt đầu ăn vào bờ: từng đoạn cát biến mất, hàng dừa đổ xuống nước, các khu nghỉ dưỡng phải dựng kè và bơm cát bù. Đi dọc bờ bây giờ vẫn thấy những đoạn kè đá và bao cát chạy dài — một bài học về bờ biển miền Trung mà không tấm biển thuyết minh nào nói rõ bằng. Bãi vẫn đẹp ở những đoạn còn cát, và đây vẫn là nơi tốt nhất để nhìn ra Cù Lao Chàm nằm mờ ngoài khơi, cũng là bến đi cano ra đảo.",
    facts: [
      "Cửa Đại là nơi sông Thu Bồn đổ ra biển, cách phố cổ Hội An khoảng 5km.",
      "Bờ biển tại đây bị xói lở nghiêm trọng trong nhiều năm, phải dựng kè và bơm cát bù.",
      "Từ bờ có thể nhìn thấy Cù Lao Chàm nằm ngoài khơi.",
      "Bến tàu đi Cù Lao Chàm nằm ở khu vực Cửa Đại.",
    ],
    travelTips: [
      "Nếu định ra Cù Lao Chàm thì đây là bến xuất phát; cano thường chạy vào buổi sáng.",
      "Tránh bơi gần cửa sông — dòng chảy ở khu vực giao nhau giữa sông và biển rất mạnh.",
    ],
    bestTime: "Tháng 3 đến tháng 8",
    visitDuration: "2 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["verified"],
    tags: ["beach", "nature", "photography"],
    nearby: ["cu-lao-cham", "an-bang-beach", "bay-mau-coconut-forest"],
    sourceUrl: "https://www.openstreetmap.org/node/4171964292",
    verifiedAt: "2026-08-16",
  },
];
