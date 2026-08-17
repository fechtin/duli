// Hà Nội hub depth, cluster 3 of 3: hồ Tây, sông Hồng and the villages outside the centre
// (spec tasks/038-vn-hubs.md). Old Quarter is ./hanoiOldQuarter.ts, Ba Đình ./hanoiCitadel.ts.
//
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`.
// Đường Lâm took two rounds: the first pass matched an OSM point at longitude 106.10 — east of
// Hà Nội, the wrong side of the city entirely. Đường Lâm is at 105.47, out in Sơn Tây.
import type { Destination } from "@/lib/types";

export const hanoiOuterDestinations: Destination[] = [
  {
    id: "west-lake-hanoi",
    slug: "ho-tay",
    provinceSlug: "ha-noi",
    name: "Hồ Tây",
    nameEn: "West Lake",
    type: "lake",
    lng: 105.82,
    lat: 21.055,
    summary:
      "Hồ lớn nhất Hà Nội, đường vòng quanh gần mười tám cây số và một hoàng hôn khác mỗi chiều.",
    story:
      "Hồ Tây rộng đến mức đứng bờ bên này không nhìn rõ bờ bên kia, và con đường chạy vòng quanh nó dài gần mười tám cây số — đủ để thành một buổi đạp xe trọn vẹn. Đây vốn là một khúc uốn cũ của sông Hồng bị bỏ lại khi dòng chảy đổi hướng, nên hồ có hình thù méo mó chứ không tròn trịa. Quanh hồ là những lớp Hà Nội khác nhau xếp cạnh nhau: chùa Trấn Quốc và đền Quán Thánh ở góc nam, làng hoa Nghi Tàm và Quảng Bá ở phía đông bắc, khu Tây Hồ với quán xá và người nước ngoài ở phía tây. Chiều muộn, cả thành phố kéo ra bờ hồ ngồi, và mặt nước rộng khiến hoàng hôn ở đây khác hẳn mọi nơi khác trong nội thành.",
    facts: [
      "Đây là hồ nước ngọt lớn nhất Hà Nội, đường vòng quanh hồ dài khoảng 18km.",
      "Hồ vốn là một khúc uốn cũ của sông Hồng bị bỏ lại khi dòng chảy đổi hướng.",
      "Quanh hồ có chùa Trấn Quốc, đền Quán Thánh và các làng hoa Nghi Tàm, Quảng Bá.",
      "Khu Tây Hồ ven bờ tây là nơi tập trung đông người nước ngoài sinh sống tại Hà Nội.",
    ],
    travelTips: [
      "Thuê xe đạp và đi trọn vòng hồ vào sáng sớm, trước khi nắng lên.",
      "Đoạn đường Thanh Niên giữa hồ Tây và hồ Trúc Bạch là chỗ ngắm hoàng hôn quen thuộc nhất.",
    ],
    bestTime: "Tháng 9 đến tháng 11, chiều muộn",
    visitDuration: "2 - 3 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["popular", "verified"],
    tags: ["lake", "nature", "sunset", "city"],
    nearby: ["tran-quoc-pagoda", "quan-thanh-temple", "long-bien-bridge"],
    sourceUrl: "https://www.wikidata.org/wiki/Q1187394",
    verifiedAt: "2026-08-16",
    featured: true,
  },
  {
    id: "long-bien-bridge",
    slug: "cau-long-bien",
    provinceSlug: "ha-noi",
    name: "Cầu Long Biên",
    nameEn: "Long Bien Bridge",
    type: "bridge",
    lng: 105.8589,
    lat: 21.0433,
    summary:
      "Cây cầu thép người Pháp dựng đầu thế kỷ 20, vẫn cõng tàu hoả và xe máy qua sông Hồng mỗi ngày.",
    story:
      "Long Biên hoàn thành năm 1902, khi ấy là một trong những cây cầu thép dài nhất châu Á, và suốt nhiều thập kỷ nó là con đường duy nhất bắc qua sông Hồng ở Hà Nội. Chính vì thế nó bị ném bom dữ dội trong chiến tranh — nhiều nhịp bị đánh sập rồi vá lại bằng những đoạn dầm khác kiểu, nên đến hôm nay nhìn dọc thân cầu vẫn thấy rõ chỗ nào là nguyên bản, chỗ nào là vết thương đã lành. Cầu nay chỉ còn dành cho tàu hoả, xe máy, xe đạp và người đi bộ; ô tô đi cầu khác. Đi bộ ra giữa cầu lúc chiều muộn, nhìn xuống bãi giữa sông Hồng xanh mướt rau màu, là một trong những cảnh Hà Nội nhất còn lại.",
    facts: [
      "Cầu hoàn thành năm 1902, từng là một trong những cây cầu thép dài nhất châu Á.",
      "Trong nhiều thập kỷ, đây là cây cầu duy nhất bắc qua sông Hồng tại Hà Nội.",
      "Cầu bị ném bom nhiều lần trong chiến tranh; các nhịp vá lại có kiểu dáng khác nhịp nguyên bản.",
      "Ngày nay cầu chỉ dành cho tàu hoả, xe máy, xe đạp và người đi bộ.",
    ],
    travelTips: [
      "Đi bộ ra giữa cầu lúc chiều muộn để ngắm bãi giữa sông Hồng và hoàng hôn.",
      "Lối đi bộ hẹp và sát đường ray — đứng sát lan can khi có tàu.",
    ],
    bestTime: "Chiều muộn, quanh năm",
    visitDuration: "1 giờ",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["verified", "popular"],
    tags: ["bridge", "history", "city", "photography"],
    nearby: ["old-quarter-hanoi", "dong-xuan-market", "west-lake-hanoi"],
    sourceUrl: "https://en.wikipedia.org/wiki/Long_Bi%C3%AAn_Bridge",
    verifiedAt: "2026-08-16",
  },
  {
    id: "vietnam-museum-ethnology",
    slug: "bao-tang-dan-toc-hoc",
    provinceSlug: "ha-noi",
    name: "Bảo tàng Dân tộc học Việt Nam",
    nameEn: "Vietnam Museum of Ethnology",
    type: "museum",
    lng: 105.7987,
    lat: 21.0406,
    summary:
      "Bảo tàng về 54 dân tộc, với cả một khu vườn dựng nhà thật của các tộc người ngoài trời.",
    story:
      "Đây là bảo tàng làm tốt nhất việc giải thích Việt Nam gồm những ai. Toà nhà trong nhà trưng bày trang phục, nông cụ, nhạc cụ, đồ tang lễ của cả năm mươi tư dân tộc, chú thích song ngữ tử tế. Nhưng phần khiến người ta nhớ nằm ngoài trời: một khu vườn rộng dựng những ngôi nhà thật — nhà rông Bana mái vút cao chóng mặt, nhà dài Êđê, nhà sàn Tày, nhà trình tường Hà Nhì, nhà mồ Giarai với các bức tượng gỗ quanh mộ. Mỗi ngôi nhà đều do chính thợ của tộc người ấy đến dựng bằng vật liệu mang từ quê ra, và khách được leo lên, bước vào bên trong.",
    facts: [
      "Bảo tàng giới thiệu văn hoá của cả 54 dân tộc Việt Nam.",
      "Khu trưng bày ngoài trời dựng các kiểu nhà truyền thống với kích thước thật.",
      "Mỗi ngôi nhà ngoài trời do chính thợ của tộc người đó dựng, bằng vật liệu mang từ bản làng ra.",
      "Bảo tàng nằm ở quận Cầu Giấy, cách trung tâm khoảng 7km.",
    ],
    travelTips: [
      "Dành ít nhất một giờ cho khu ngoài trời — đó mới là phần đáng giá nhất.",
      "Bảo tàng nằm xa trung tâm; đi taxi hoặc xe công nghệ sẽ tiện hơn nhiều.",
    ],
    bestTime: "Quanh năm; tránh giữa trưa vì khu ngoài trời nắng",
    visitDuration: "2 - 3 giờ",
    ticket: "40.000đ (giá tham khảo, kiểm tra lại tại quầy)",
    openingHours: "08:30 - 17:30, đóng cửa thứ Hai",
    badges: ["verified"],
    tags: ["museum", "culture", "family", "history"],
    nearby: ["temple-of-literature", "ho-chi-minh-mausoleum", "lotte-observation-deck"],
    sourceUrl: "https://en.wikipedia.org/wiki/Vietnam_Museum_of_Ethnology",
    verifiedAt: "2026-08-16",
  },
  {
    id: "lotte-observation-deck",
    slug: "dai-quan-sat-lotte",
    provinceSlug: "ha-noi",
    name: "Đài quan sát Lotte",
    nameEn: "Lotte Observation Deck",
    type: "viewpoint",
    lng: 105.8126,
    lat: 21.0324,
    summary:
      "Sàn kính trên tầng 65, nơi thấy Hà Nội trải ra tới tận sông Hồng và hồ Tây cùng lúc.",
    story:
      "Hà Nội là một thành phố thấp, phần lớn nhà chỉ vài tầng, nên leo lên độ cao hai trăm mét là thấy gần như tất cả cùng lúc: hồ Tây rộng ở phía bắc, sông Hồng uốn ở phía đông, những mái ngói chen chúc của khu phố cổ, và các khu đô thị mới mọc lên phía tây. Sàn quan sát ở tầng 65 có mấy ô sàn kính nhìn thẳng xuống dưới chân — chỗ mà ai cũng ngập ngừng một nhịp trước khi bước lên. Đến trước hoàng hôn khoảng bốn mươi phút là hợp lý nhất: bạn kịp thấy thành phố lúc còn sáng, lúc chuyển màu, rồi lúc lên đèn, cả ba trong một lượt vé.",
    facts: [
      "Đài quan sát nằm ở tầng 65 của toà Lotte Center Hanoi, quận Ba Đình.",
      "Sàn quan sát có các ô lát kính nhìn thẳng xuống mặt đất.",
      "Từ đây có thể nhìn thấy hồ Tây, sông Hồng và khu phố cổ trong cùng một tầm mắt.",
      "Toà nhà nằm ở nút giao Đào Tấn – Liễu Giai, phía tây trung tâm thành phố.",
    ],
    travelTips: [
      "Lên trước hoàng hôn khoảng 40 phút để thấy cả thành phố ban ngày lẫn lúc lên đèn.",
      "Những hôm Hà Nội nhiều bụi mịn thì tầm nhìn rất kém — kiểm tra chỉ số chất lượng không khí trước.",
    ],
    bestTime: "Chiều muộn vào ngày trời trong, mùa thu",
    visitDuration: "1 giờ",
    ticket: "Khoảng 230.000đ (giá tham khảo, thay đổi theo thời điểm)",
    openingHours: "09:00 - 23:00",
    badges: ["verified"],
    tags: ["viewpoint", "city", "sunset", "photography"],
    nearby: ["ho-chi-minh-mausoleum", "vietnam-museum-ethnology", "west-lake-hanoi"],
    sourceUrl: "https://en.wikipedia.org/wiki/Lotte_Center_Hanoi",
    verifiedAt: "2026-08-16",
  },
  {
    id: "bat-trang-pottery-village",
    slug: "lang-gom-bat-trang",
    provinceSlug: "ha-noi",
    name: "Làng gốm Bát Tràng",
    nameEn: "Bat Trang Pottery Village",
    type: "village",
    lng: 105.9331,
    lat: 20.9866,
    summary:
      "Làng gốm bảy thế kỷ bên sông Hồng, nơi bạn có thể tự ngồi vào bàn xoay nặn lấy một cái bát.",
    story:
      "Bát Tràng làm gốm từ khoảng thế kỷ 14, và cái làm nên tên tuổi của làng là đất sét trắng cùng lớp men rạn đặc trưng — men nứt thành mạng lưới nhỏ li ti khi nguội, thứ mà thợ ở đây chủ động tạo ra chứ không phải lỗi. Gốm Bát Tràng từng theo thuyền buôn đi khắp Đông Nam Á và Nhật Bản. Đi trong làng bây giờ là đi qua những con ngõ hẹp lát gạch, hai bên tường phơi than tổ ong hình tròn để đốt lò, và các xưởng mở cửa cho khách vào xem. Hầu hết xưởng đều có khu bàn xoay cho khách tự nặn: bạn trả một khoản nhỏ, ngồi xuống, làm hỏng vài cái, rồi mang về cái thành phẩm sau khi nung.",
    facts: [
      "Làng làm gốm từ khoảng thế kỷ 14, bên bờ sông Hồng phía đông nam Hà Nội.",
      "Men rạn là đặc trưng của gốm Bát Tràng — lớp men nứt thành mạng lưới nhỏ khi nguội.",
      "Gốm Bát Tràng từng được xuất khẩu theo đường biển đi nhiều nước Đông Nam Á và Nhật Bản.",
      "Nhiều xưởng trong làng mở khu bàn xoay cho khách tự tay làm gốm.",
    ],
    travelTips: [
      "Đồ tự nặn cần thời gian nung — hỏi trước xem lấy trong ngày được không.",
      "Chợ gốm trong làng bán rẻ hơn các cửa hàng ngoài mặt đường lớn.",
    ],
    bestTime: "Quanh năm, buổi sáng khi các xưởng đang làm",
    visitDuration: "Nửa ngày",
    ticket: "",
    openingHours: "08:00 - 17:30 theo giờ làm của các xưởng",
    badges: ["verified"],
    tags: ["village", "culture", "shopping", "family"],
    nearby: ["old-quarter-hanoi", "long-bien-bridge", "hoan-kiem-lake"],
    sourceUrl: "https://vi.wikipedia.org/wiki/B%C3%A1t_Tr%C3%A0ng",
    verifiedAt: "2026-08-16",
  },
  {
    id: "duong-lam-ancient-village",
    slug: "lang-co-duong-lam",
    provinceSlug: "ha-noi",
    name: "Làng cổ Đường Lâm",
    nameEn: "Duong Lam Ancient Village",
    type: "village",
    lng: 105.4747,
    lat: 21.1542,
    summary:
      "Làng Việt cổ xây bằng đá ong, quê hương của hai vị vua, cách trung tâm Hà Nội bốn mươi cây số.",
    story:
      "Đường Lâm là làng cổ đầu tiên của Việt Nam được xếp hạng di tích quốc gia, và thứ khiến nó khác mọi làng khác là vật liệu: đá ong. Loại đá đỏ nâu rỗ lỗ này được xắn lên từ chính đất đồi quanh làng, phơi cho rắn lại rồi xây thành tường nhà, tường ngõ, giếng làng — cả làng vì thế mang một sắc nâu đỏ không lẫn đi đâu được. Làng còn giữ cổng làng cổ, cây đa, đình Mông Phụ và những ngôi nhà gỗ hàng trăm năm mà con cháu vẫn ở. Đường Lâm cũng được gọi là 'đất hai vua': Phùng Hưng và Ngô Quyền, hai người đều xuất thân từ vùng này, đều có đền thờ trong làng.",
    facts: [
      "Đây là làng cổ đầu tiên của Việt Nam được xếp hạng di tích quốc gia.",
      "Nhà cửa, tường ngõ và giếng làng đều xây bằng đá ong khai thác tại chỗ.",
      "Làng được gọi là 'đất hai vua', gắn với Phùng Hưng và Ngô Quyền.",
      "Làng nằm ở thị xã Sơn Tây, cách trung tâm Hà Nội khoảng 40km về phía tây.",
    ],
    travelTips: [
      "Thuê xe đạp ở đầu làng — ngõ nhỏ và đi bộ hết làng thì khá xa.",
      "Nhiều nhà cổ vẫn có người ở; hỏi chủ nhà trước khi vào và trước khi chụp ảnh.",
    ],
    bestTime: "Tháng 10 đến tháng 12, hoặc mùa lúa chín tháng 5",
    visitDuration: "Nửa ngày",
    ticket: "20.000đ (giá tham khảo)",
    openingHours: "07:00 - 18:00",
    badges: ["verified", "hidden-gem"],
    tags: ["village", "history", "culture", "architecture"],
    nearby: ["bat-trang-pottery-village", "vietnam-museum-ethnology", "temple-of-literature"],
    sourceUrl: "https://www.openstreetmap.org/relation/18772124",
    verifiedAt: "2026-08-16",
  },
  {
    // Do not confuse with `chua-huong-tich` in Hà Tĩnh (northCentral.ts) — a different pagoda
    // 230km south whose name is one word longer. tasks/039-coords.json already rejected an OSM
    // match on that basis once, and the festival card here pointed at its photos until now.
    id: "chua-huong",
    slug: "chua-huong",
    provinceSlug: "ha-noi",
    name: "Chùa Hương",
    nameEn: "Perfume Pagoda",
    type: "temple",
    lng: 105.7497,
    lat: 20.6225,
    summary:
      "Quần thể chùa và động rải khắp vùng núi Hương Sơn, bắt đầu bằng một chặng đò trên suối Yến chứ không bằng đường bộ.",
    story:
      "Chùa Hương không phải một ngôi chùa mà là cả một vùng: hàng chục chùa, động và đền nằm rải trong núi Hương Sơn, và cách vào là xuống đò ở bến Đục rồi trôi trên suối Yến. Chặng đò ấy là thứ khiến nơi này khác mọi ngôi chùa khác — hai bên là núi đá dựng lên từ đồng nước, người chèo đứng phía sau, và cả đoạn đường không có tiếng động cơ nào. Đò cập bến rồi đường lên mới chia nhánh: chùa Thiên Trù nằm ở lưng chừng, còn động Hương Tích, chỗ được xem là trung tâm của cả quần thể, nằm cao hơn nữa, leo bộ hoặc đi cáp treo. Vào hội, dòng người kéo dài từ bến đò lên tận cửa động và đi một đoạn ngắn cũng mất hàng giờ; ngoài hội, vẫn con đường đó lại thành một buổi đi núi yên tĩnh.",
    facts: [
      "Đây là một quần thể gồm nhiều chùa, động và đền ở xã Hương Sơn, Hà Nội, không phải một công trình đơn lẻ.",
      "Động Hương Tích được xem là trung tâm của quần thể, nằm cao hơn chùa Thiên Trù.",
      "Lễ hội chùa Hương khai hội ngày mồng sáu tháng giêng và kéo đến hạ tuần tháng ba âm lịch.",
      "Cao điểm của hội là từ sau Tết Nguyên Đán đến hết tháng hai âm lịch.",
      "Quần thể được xếp hạng di tích quốc gia đặc biệt năm 2017, theo Quyết định 2082/QĐ-TTg.",
      "Ngoài Thiên Trù và Hương Tích, quần thể còn có đền Trình Ngũ Nhạc, chùa Giải Oan, đền Cửa Võng, chùa Tiên Sơn và chùa Hinh Bồng.",
    ],
    travelTips: [
      "Đi ngoài mùa hội nếu muốn yên tĩnh — vẫn chặng đò ấy và vẫn con đường lên động, nhưng vắng người.",
      "Có cáp treo lên động Hương Tích; leo bộ một chiều rồi đi cáp chiều còn lại là cách nhiều người chọn.",
    ],
    bestTime: "Tháng giêng đến tháng ba âm lịch nếu muốn xem hội, còn lại đẹp nhất vào mùa thu",
    visitDuration: "Cả ngày",
    // No price asserted: "" would mean free, and this is not. Wikidata carries no fee, so the
    // shape of the cost is described and the number left to the reader (see Destination.sourceUrl).
    ticket: "Vé thắng cảnh và vé đò tính riêng, cáp treo mua thêm",
    openingHours: "Ban ngày, theo giờ chạy đò trên suối Yến",
    badges: ["verified", "popular", "festival"],
    tags: ["temple", "cave", "mountain", "nature", "history", "culture"],
    // Captions are left empty on purpose. These seeds have no photo yet, and a caption written
    // before the photo exists is precisely what produced the 109 mismatched tiles that 044 had
    // to split apart. The reviewer writes the caption onto the photo at approval time.
    nearby: ["hn-tam-chuc"],
    sourceUrl: "https://www.wikidata.org/wiki/Q7168306",
    verifiedAt: "2026-08-17",
    featured: true,
  },
];
