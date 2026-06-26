import type { Destination, ProvinceContent } from "@/lib/types";

type ProvinceEditorial = Omit<ProvinceContent, "destinationIds">;

export const southeastDestinations: Destination[] = [
  {
    id: "vung-tau-bai-bien-tuong-chua",
    slug: "bai-bien-vung-tau-tuong-chua",
    provinceSlug: "ba-ria-vung-tau",
    name: "Bãi biển Vũng Tàu & Tượng Chúa Kitô",
    nameEn: "Vung Tau Beach & Christ the King Statue",
    type: "beach",
    lng: 107.0843,
    lat: 10.3349,
    summary:
      "Thành phố biển gần Sài Gòn với bãi tắm dài và tượng Chúa Kitô khổng lồ trên đỉnh Núi Nhỏ.",
    story:
      "Vũng Tàu là thành phố biển thân quen của người Sài Gòn, chỉ cách trung tâm vài giờ xe. Bãi Sau trải dài cát vàng, sóng êm, đông vui mỗi cuối tuần; Bãi Trước lại lặng lẽ với hàng dừa nghiêng đón hoàng hôn. Trên đỉnh Núi Nhỏ, tượng Chúa Kitô cao 32 mét dang tay nhìn ra biển, du khách leo gần 800 bậc thang để lên tới chân tượng và phóng tầm mắt khắp thành phố. Hải sản tươi rói, gió biển mặn mòi và những con đường ven biển làm nên một Vũng Tàu hào sảng, phóng khoáng rất Nam Bộ.",
    facts: [
      "Tượng Chúa Kitô Vũng Tàu cao 32 mét, hoàn thành năm 1994.",
      "Bên trong tượng có cầu thang xoắn dẫn lên hai cánh tay dang rộng.",
      "Bãi Sau (Thùy Vân) là bãi tắm chính, dài hơn 8 km.",
      "Hải đăng Vũng Tàu xây từ năm 1862 là một trong những ngọn cổ nhất Việt Nam.",
    ],
    travelTips: [
      "Leo lên tượng Chúa vào sáng sớm để tránh nắng và đông người.",
      "Thử bánh khọt Vũng Tàu, đặc sản trứ danh của thành phố.",
    ],
    bestTime: "Tháng 11 đến tháng 4 (mùa khô, biển êm)",
    visitDuration: "1–2 ngày",
    ticket: "",
    openingHours: "Tượng Chúa: 07:00–17:00",
    badges: ["popular", "trending", "verified"],
    tags: ["beach", "city", "nature", "food", "photography"],
    gallery: [
      { seed: "vungtau-baisau", caption: "Bãi Sau cát vàng đông vui", ratio: "16/9" },
      { seed: "vungtau-christ", caption: "Tượng Chúa Kitô trên Núi Nhỏ", ratio: "4/3" },
      { seed: "vungtau-banhkhot", caption: "Bánh khọt giòn rụm đặc sản", ratio: "1/1" },
    ],
    nearby: ["con-dao"],
    featured: true,
  },
  {
    id: "con-dao",
    slug: "con-dao",
    provinceSlug: "ba-ria-vung-tau",
    name: "Côn Đảo",
    nameEn: "Con Dao Islands",
    type: "island",
    lng: 106.6062,
    lat: 8.6831,
    summary:
      "Quần đảo hoang sơ giữa Biển Đông, nổi tiếng với bãi biển nguyên sơ, hệ sinh thái biển và di tích nhà tù lịch sử.",
    story:
      "Côn Đảo là quần đảo gồm 16 hòn đảo lớn nhỏ nằm ngoài khơi Biển Đông, từng được mệnh danh là 'địa ngục trần gian' với hệ thống nhà tù khắc nghiệt thời thực dân. Ngày nay, Côn Đảo hồi sinh thành điểm đến tâm linh và sinh thái bậc nhất: nghĩa trang Hàng Dương với mộ chị Võ Thị Sáu linh thiêng, những bãi biển nước trong vắt, rạn san hô và rùa biển lên đẻ trứng mỗi mùa. Vẻ đẹp tĩnh lặng, trầm mặc xen lẫn hoang sơ khiến Côn Đảo trở thành nơi vừa để chiêm nghiệm vừa để nghỉ dưỡng giữa thiên nhiên thuần khiết.",
    facts: [
      "Vườn quốc gia Côn Đảo bảo tồn rùa biển và rạn san hô quý hiếm.",
      "Nghĩa trang Hàng Dương là nơi an nghỉ của hàng nghìn tù nhân yêu nước.",
      "Du khách thường viếng mộ chị Võ Thị Sáu vào lúc nửa đêm.",
      "Côn Đảo từng được tạp chí du lịch quốc tế bình chọn là đảo bí ẩn nhất thế giới.",
    ],
    travelTips: [
      "Đặt vé máy bay hoặc tàu cao tốc sớm vì lượng khách giới hạn.",
      "Mang theo đồ lễ giản dị nếu muốn viếng nghĩa trang Hàng Dương ban đêm.",
    ],
    bestTime: "Tháng 3 đến tháng 9 (biển lặng, dễ ra đảo nhỏ)",
    visitDuration: "2–3 ngày",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["hidden-gem", "verified", "ai-recommended"],
    tags: ["island", "beach", "nature", "history", "photography"],
    gallery: [
      { seed: "condao-beach", caption: "Bãi biển nước trong nguyên sơ", ratio: "16/9" },
      { seed: "condao-prison", caption: "Di tích nhà tù Côn Đảo", ratio: "4/3" },
      { seed: "condao-hangduong", caption: "Nghĩa trang Hàng Dương linh thiêng", ratio: "1/1" },
    ],
    nearby: ["vung-tau-bai-bien-tuong-chua"],
  },
  {
    id: "cat-tien-national-park",
    slug: "vuon-quoc-gia-cat-tien",
    provinceSlug: "dong-nai",
    name: "Vườn quốc gia Cát Tiên",
    nameEn: "Cat Tien National Park",
    type: "park",
    lng: 107.4286,
    lat: 11.4231,
    summary:
      "Khu dự trữ sinh quyển rộng lớn với rừng nhiệt đới nguyên sinh, đa dạng động thực vật và khu cứu hộ gấu, voọc.",
    story:
      "Vườn quốc gia Cát Tiên trải rộng trên ba tỉnh, là một trong những khu rừng nhiệt đới nguyên sinh quý giá nhất còn sót lại ở Nam Bộ. Đây là khu dự trữ sinh quyển được UNESCO công nhận, mái nhà của hàng trăm loài chim, thú quý như voi, bò tót, vượn đen má vàng. Du khách đạp xe xuyên rừng tới cây tung cổ thụ ngàn năm, chèo thuyền trên Bàu Sấu ngắm cá sấu hoang dã, hay ghé Trung tâm cứu hộ Linh trưởng và gấu. Đêm xuống, tour soi đèn tìm thú hoang mang lại cảm giác phiêu lưu giữa thiên nhiên hoang dã đậm chất rừng già.",
    facts: [
      "Cát Tiên được UNESCO công nhận là khu dự trữ sinh quyển thế giới năm 2001.",
      "Bàu Sấu là vùng đất ngập nước Ramsar quan trọng quốc tế.",
      "Vườn là nơi cư trú của loài tê giác Java cuối cùng ở Việt Nam (đã tuyệt chủng năm 2010).",
      "Cây tung cổ thụ trong rừng có bộ rễ bạnh khổng lồ nổi tiếng.",
    ],
    travelTips: [
      "Đặt tour soi thú đêm và chèo thuyền Bàu Sấu trước với ban quản lý vườn.",
      "Mang giày leo núi, áo dài tay và thuốc chống vắt khi đi rừng sâu.",
    ],
    bestTime: "Tháng 12 đến tháng 5 (mùa khô, dễ di chuyển trong rừng)",
    visitDuration: "1–2 ngày",
    ticket: "60.000đ",
    openingHours: "07:00–17:00",
    badges: ["unesco", "verified", "ai-recommended"],
    tags: ["park", "nature", "photography"],
    gallery: [
      { seed: "cattien-forest", caption: "Rừng nguyên sinh xanh thẳm", ratio: "16/9" },
      { seed: "cattien-bausau", caption: "Bàu Sấu ngập nước mênh mông", ratio: "4/3" },
      { seed: "cattien-tung", caption: "Cây tung cổ thụ rễ bạnh", ratio: "1/1" },
    ],
    nearby: ["thac-giang-dien"],
    featured: true,
  },
  {
    id: "thac-giang-dien",
    slug: "thac-giang-dien",
    provinceSlug: "dong-nai",
    name: "Thác Giang Điền",
    nameEn: "Giang Dien Waterfall",
    type: "waterfall",
    lng: 107.0167,
    lat: 10.9333,
    summary:
      "Khu du lịch sinh thái với thác nước trải rộng, vườn hoa và không gian xanh mát gần Biên Hòa.",
    story:
      "Thác Giang Điền nằm giữa vùng quê Đồng Nai, là điểm đến quen thuộc cho những chuyến dã ngoại cuối tuần của người Sài Gòn và Biên Hòa. Dòng thác không quá hùng vĩ nhưng trải rộng, nước đổ qua các bậc đá tạo nên bức tranh êm dịu giữa rừng cây. Khu du lịch được quy hoạch thành những thảm cỏ xanh, vườn hoa rực rỡ, hồ nước và khu cắm trại lý tưởng cho gia đình. Vào mùa mưa, thác trở nên cuồn cuộn và đẹp nhất; mùa khô nước hiền hòa, thích hợp ngồi bên bờ nghe tiếng nước reo và tận hưởng không khí trong lành.",
    facts: [
      "Thác Giang Điền cao khoảng 20 mét, trải rộng nhiều tầng đá.",
      "Khu du lịch có dịch vụ cắm trại, picnic và teambuilding.",
      "Mùa mưa (tháng 6–10) là lúc thác đẹp và nhiều nước nhất.",
      "Nơi đây thường được chọn làm bối cảnh chụp ảnh cưới.",
    ],
    travelTips: [
      "Đi vào mùa mưa nếu muốn ngắm thác nhiều nước và hùng vĩ.",
      "Mang theo đồ ăn để picnic trên các thảm cỏ trong khu du lịch.",
    ],
    bestTime: "Tháng 6 đến tháng 10 (mùa mưa, thác nhiều nước)",
    visitDuration: "Nửa ngày",
    ticket: "70.000đ",
    openingHours: "07:00–17:30",
    badges: ["popular", "verified"],
    tags: ["waterfall", "nature", "photography"],
    gallery: [
      { seed: "giangdien-thac", caption: "Thác nước trải rộng nhiều tầng", ratio: "16/9" },
      { seed: "giangdien-vuonhoa", caption: "Vườn hoa rực rỡ trong khu", ratio: "4/3" },
      { seed: "giangdien-camtrai", caption: "Bãi cỏ cắm trại xanh mát", ratio: "1/1" },
    ],
    nearby: ["cat-tien-national-park"],
  },
  {
    id: "chua-ba-thien-hau-binh-duong",
    slug: "chua-ba-thien-hau",
    provinceSlug: "binh-duong",
    name: "Chùa Bà Thiên Hậu",
    nameEn: "Thien Hau Temple (Binh Duong)",
    type: "temple",
    lng: 106.6515,
    lat: 10.9787,
    summary:
      "Ngôi miếu cổ thờ Bà Thiên Hậu, trung tâm lễ hội rước kiệu lớn nhất Bình Dương dịp rằm tháng Giêng.",
    story:
      "Chùa Bà Thiên Hậu ở Thủ Dầu Một là ngôi miếu cổ do cộng đồng người Hoa lập nên để thờ Thiên Hậu Thánh Mẫu, vị thần bảo hộ cho người đi biển và cầu bình an. Kiến trúc đậm phong cách Hoa Nam với mái ngói âm dương, những hình rồng phượng tinh xảo và làn khói nhang nghi ngút quanh năm. Vào dịp rằm tháng Giêng, lễ rước kiệu Bà diễn ra tưng bừng, thu hút hàng vạn người từ khắp nơi đổ về, biến cả thành phố thành một biển người với cờ phướn, lân sư rồng rộn ràng. Đây là lễ hội văn hóa tâm linh lớn và đặc sắc bậc nhất miền Đông Nam Bộ.",
    facts: [
      "Lễ rước kiệu Bà rằm tháng Giêng là lễ hội lớn nhất Bình Dương.",
      "Miếu do bốn bang người Hoa ở Thủ Dầu Một cùng xây dựng.",
      "Kiến trúc mang đậm phong cách đền miếu Hoa Nam truyền thống.",
      "Người dân đến vay lộc đầu năm và trả lễ cuối năm tại miếu.",
    ],
    travelTips: [
      "Đến vào rằm tháng Giêng để xem lễ rước kiệu Bà hoành tráng.",
      "Ăn mặc lịch sự, kín đáo khi vào dâng hương trong miếu.",
    ],
    bestTime: "Rằm tháng Giêng âm lịch (mùa lễ hội)",
    visitDuration: "1–2 giờ",
    ticket: "",
    openingHours: "05:00–18:00",
    badges: ["festival", "verified", "popular"],
    tags: ["temple", "culture", "history", "photography"],
    gallery: [
      { seed: "thienhau-bd-mieu", caption: "Miếu cổ mái ngói âm dương", ratio: "4/3" },
      { seed: "thienhau-bd-leruoc", caption: "Lễ rước kiệu Bà tưng bừng", ratio: "16/9" },
      { seed: "thienhau-bd-nhang", caption: "Khói nhang nghi ngút trong miếu", ratio: "1/1" },
    ],
    nearby: ["dai-nam-binh-duong"],
  },
  {
    id: "dai-nam-binh-duong",
    slug: "khu-du-lich-dai-nam",
    provinceSlug: "binh-duong",
    name: "Khu du lịch Đại Nam",
    nameEn: "Dai Nam Tourist Park",
    type: "park",
    lng: 106.6219,
    lat: 11.0331,
    summary:
      "Khu du lịch khổng lồ kết hợp đền thờ, vườn thú, biển nhân tạo và công viên giải trí bậc nhất miền Nam.",
    story:
      "Khu du lịch Đại Nam (Lạc Cảnh Đại Nam Văn Hiến) là một trong những tổ hợp giải trí lớn nhất Việt Nam, trải rộng hàng trăm hecta giữa Bình Dương. Nơi đây quy tụ đủ mọi sắc thái: đền thờ Đại Nam Quốc Tự nguy nga dát vàng, dãy núi Ngũ Hành Sơn nhân tạo, vườn thú safari với cả nghìn loài, biển nhân tạo nhân tạo rộng nhất nước và khu trò chơi cảm giác mạnh. Một ngày ở Đại Nam có thể vừa chiêm bái tâm linh, vừa cho trẻ con vui chơi, vừa tắm biển nhân tạo, khiến đây thành điểm đến gia đình lý tưởng dịp cuối tuần và lễ tết.",
    facts: [
      "Đại Nam là một trong những khu du lịch có diện tích lớn nhất Việt Nam.",
      "Biển nhân tạo tại đây từng được ghi nhận là lớn nhất nước.",
      "Đền Đại Nam Quốc Tự được dát vàng và xây bằng vật liệu quý.",
      "Vườn thú safari nuôi nhiều loài quý hiếm trong môi trường bán hoang dã.",
    ],
    travelTips: [
      "Mua vé combo trọn gói để tiết kiệm khi chơi nhiều khu.",
      "Đi sớm và mang đồ bơi nếu muốn trải nghiệm khu biển nhân tạo.",
    ],
    bestTime: "Tháng 11 đến tháng 4 (mùa khô, trời mát)",
    visitDuration: "1 ngày",
    ticket: "150.000đ",
    openingHours: "08:00–17:00",
    badges: ["popular", "trending"],
    tags: ["park", "culture", "city"],
    gallery: [
      { seed: "dainam-den", caption: "Đền Đại Nam Quốc Tự dát vàng", ratio: "16/9" },
      { seed: "dainam-bien", caption: "Biển nhân tạo rộng lớn", ratio: "4/3" },
      { seed: "dainam-safari", caption: "Vườn thú safari bán hoang dã", ratio: "1/1" },
    ],
    nearby: ["chua-ba-thien-hau-binh-duong"],
  },
  {
    id: "bu-gia-map-national-park",
    slug: "vuon-quoc-gia-bu-gia-map",
    provinceSlug: "binh-phuoc",
    name: "Vườn quốc gia Bù Gia Mập",
    nameEn: "Bu Gia Map National Park",
    type: "park",
    lng: 107.1833,
    lat: 12.1833,
    summary:
      "Khu rừng nguyên sinh giáp biên giới Campuchia, giàu đa dạng sinh học với thác nước, suối ngầm và văn hóa người S'tiêng.",
    story:
      "Vườn quốc gia Bù Gia Mập nằm ở vùng cực bắc Bình Phước, giáp biên giới Campuchia, là vạt rừng nguyên sinh hiếm hoi còn giữ được vẻ hoang sơ của Đông Nam Bộ. Rừng ở đây xanh thẫm quanh năm, ẩn chứa nhiều loài thú quý, chim, bướm và cây gỗ cổ thụ. Du khách ưa khám phá có thể trekking xuyên rừng, lội suối, ngắm những thác nước và hang ngầm còn nguyên nét thiên nhiên. Vùng đệm là nơi cư trú của đồng bào S'tiêng và M'nông với văn hóa cồng chiêng, rượu cần độc đáo. Bù Gia Mập là điểm đến cho ai khao khát một chuyến đi thực sự gần gũi với rừng già.",
    facts: [
      "Bù Gia Mập giáp biên giới Campuchia và tỉnh Đắk Nông.",
      "Vườn bảo tồn nhiều loài linh trưởng và chim quý hiếm.",
      "Vùng đệm là địa bàn sinh sống của người S'tiêng và M'nông.",
      "Rừng còn giữ nhiều cây gỗ quý cổ thụ hàng trăm năm tuổi.",
    ],
    travelTips: [
      "Liên hệ ban quản lý vườn để có kiểm lâm dẫn đường trekking.",
      "Chuẩn bị đồ chống vắt, nước uống và giày lội suối chắc chắn.",
    ],
    bestTime: "Tháng 11 đến tháng 4 (mùa khô, an toàn khi đi rừng)",
    visitDuration: "1–2 ngày",
    ticket: "",
    openingHours: "07:00–16:30",
    badges: ["hidden-gem", "verified", "new"],
    tags: ["park", "nature", "culture", "photography"],
    gallery: [
      { seed: "bugiamap-rung", caption: "Rừng nguyên sinh xanh thẳm", ratio: "16/9" },
      { seed: "bugiamap-suoi", caption: "Suối trong giữa rừng già", ratio: "4/3" },
      { seed: "bugiamap-stieng", caption: "Văn hóa cồng chiêng S'tiêng", ratio: "1/1" },
    ],
    nearby: ["trang-co-bu-lach"],
    featured: true,
  },
  {
    id: "trang-co-bu-lach",
    slug: "trang-co-bu-lach",
    provinceSlug: "binh-phuoc",
    name: "Trảng cỏ Bù Lạch",
    nameEn: "Bu Lach Grasslands",
    type: "village",
    lng: 107.1167,
    lat: 11.8833,
    summary:
      "Quần thể trảng cỏ rộng mênh mông giữa rừng, gắn với đời sống và truyền thuyết của đồng bào M'nông ở Bình Phước.",
    story:
      "Trảng cỏ Bù Lạch là một quần thể gồm khoảng hai mươi trảng cỏ lớn nhỏ nằm xen giữa những cánh rừng ở huyện Bù Đăng, Bình Phước. Điều kỳ lạ là giữa rừng già lại trải ra những thảm cỏ xanh mượt phẳng lì như sân golf tự nhiên, ôm lấy hồ nước trong vắt soi bóng mây trời. Người M'nông bản địa lưu truyền nhiều truyền thuyết về sự hình thành huyền bí của các trảng cỏ này. Du khách đến đây để cắm trại, dã ngoại, ngắm hoàng hôn buông trên thảo nguyên thu nhỏ và trải nghiệm nét văn hóa mộc mạc của buôn làng M'nông quanh vùng.",
    facts: [
      "Bù Lạch gồm khoảng 20 trảng cỏ lớn nhỏ nối nhau giữa rừng.",
      "Giữa trảng cỏ có hồ nước tự nhiên trong vắt quanh năm.",
      "Người M'nông gắn nhiều truyền thuyết với sự hình thành trảng cỏ.",
      "Cỏ ở đây xanh mượt, phẳng lì như thảo nguyên tự nhiên.",
    ],
    travelTips: [
      "Mang lều và đồ ăn để cắm trại, ngắm hoàng hôn trên trảng cỏ.",
      "Thuê người địa phương dẫn đường vì lối vào khá hoang sơ.",
    ],
    bestTime: "Tháng 11 đến tháng 3 (cỏ xanh, trời mát)",
    visitDuration: "Nửa ngày đến 1 ngày",
    ticket: "",
    openingHours: "Cả ngày",
    badges: ["hidden-gem", "new", "ai-recommended"],
    tags: ["nature", "culture", "photography"],
    gallery: [
      { seed: "bulach-trangco", caption: "Thảm cỏ xanh mượt giữa rừng", ratio: "16/9" },
      { seed: "bulach-ho", caption: "Hồ nước trong soi bóng mây", ratio: "4/3" },
      { seed: "bulach-hoanghon", caption: "Hoàng hôn buông trên trảng cỏ", ratio: "1/1" },
    ],
    nearby: ["bu-gia-map-national-park"],
  },
  {
    id: "nui-ba-den-tay-ninh",
    slug: "nui-ba-den",
    provinceSlug: "tay-ninh",
    name: "Núi Bà Đen",
    nameEn: "Ba Den Mountain",
    type: "mountain",
    lng: 106.1719,
    lat: 11.3833,
    summary:
      "Ngọn núi cao nhất Nam Bộ, 'nóc nhà' miền Đông với hệ thống chùa linh thiêng, cáp treo hiện đại và biển mây huyền ảo.",
    story:
      "Núi Bà Đen cao 986 mét, là đỉnh núi cao nhất Nam Bộ và được mệnh danh là 'nóc nhà' của vùng đất này. Núi gắn với truyền thuyết về nàng Lý Thị Thiên Hương (Bà Đen) trinh tiết, linh thiêng, nên sườn núi là nơi quần tụ nhiều ngôi chùa cổ thu hút hành hương quanh năm. Ngày nay, hệ thống cáp treo hiện đại đưa du khách lên tận đỉnh, nơi đặt tượng Phật Bà Tây Bổ Đà Sơn bằng đồng cao nhất châu Á và quảng trường rộng lớn. Những sớm mai, biển mây trắng cuồn cuộn dưới chân khiến đỉnh Bà Đen như chốn bồng lai giữa miền Đông nắng gió.",
    facts: [
      "Núi Bà Đen cao 986 mét, là đỉnh cao nhất Nam Bộ.",
      "Tượng Phật Bà Tây Bổ Đà Sơn trên đỉnh là tượng Phật bằng đồng cao nhất châu Á.",
      "Hệ thống cáp treo tại đây từng lập nhiều kỷ lục thế giới.",
      "Hội xuân Núi Bà Đen diễn ra suốt tháng Giêng âm lịch.",
    ],
    travelTips: [
      "Lên đỉnh vào sáng sớm để có cơ hội ngắm biển mây tuyệt đẹp.",
      "Mua vé cáp treo khứ hồi và mang áo khoác vì đỉnh núi se lạnh.",
    ],
    bestTime: "Tháng 11 đến tháng 4 và mùa lễ hội tháng Giêng",
    visitDuration: "Nửa ngày đến 1 ngày",
    ticket: "350.000đ (cáp treo)",
    openingHours: "06:00–22:00",
    badges: ["festival", "trending", "popular", "verified"],
    tags: ["mountain", "temple", "culture", "nature", "photography"],
    gallery: [
      { seed: "badennui-bienmay", caption: "Biển mây trắng dưới chân núi", ratio: "16/9" },
      { seed: "badennui-phatba", caption: "Tượng Phật Bà trên đỉnh núi", ratio: "4/3" },
      { seed: "badennui-captreo", caption: "Cáp treo hiện đại lên đỉnh", ratio: "1/1" },
    ],
    nearby: ["toa-thanh-cao-dai-tay-ninh"],
    featured: true,
  },
  {
    id: "toa-thanh-cao-dai-tay-ninh",
    slug: "toa-thanh-cao-dai",
    provinceSlug: "tay-ninh",
    name: "Tòa Thánh Cao Đài Tây Ninh",
    nameEn: "Cao Dai Holy See (Tay Ninh)",
    type: "temple",
    lng: 106.1281,
    lat: 11.3036,
    summary:
      "Thánh địa trung tâm của đạo Cao Đài, công trình tôn giáo rực rỡ với kiến trúc giao thoa Đông – Tây độc nhất vô nhị.",
    story:
      "Tòa Thánh Cao Đài Tây Ninh là trung tâm tôn giáo của đạo Cao Đài, một tôn giáo bản địa ra đời tại Việt Nam đầu thế kỷ 20. Công trình đồ sộ với hai tháp chuông cao vút, mái ngói uốn lượn, sắc màu rực rỡ và những hoa văn rồng, hoa sen, Thiên Nhãn phủ khắp nội thất. Đặc biệt, kiến trúc giao thoa độc đáo giữa đền chùa Á Đông và nhà thờ phương Tây, mang vẻ đẹp huyền ảo khó nơi nào sánh được. Mỗi ngày bốn buổi, các tín đồ áo dài trắng cùng làm lễ trang nghiêm trong tiếng nhạc lễ, tạo nên khung cảnh thiêng liêng thu hút đông đảo du khách tới chiêm ngưỡng.",
    facts: [
      "Đạo Cao Đài là tôn giáo bản địa lớn của Việt Nam, lập năm 1926.",
      "Tòa Thánh khởi công năm 1933 và hoàn thành sau nhiều năm xây dựng.",
      "Biểu tượng Thiên Nhãn (con mắt) xuất hiện khắp công trình.",
      "Lễ đại đàn diễn ra bốn lần mỗi ngày với nghi thức trang nghiêm.",
    ],
    travelTips: [
      "Đến dự lễ trưa (12:00) để xem nghi thức cúng đông tín đồ nhất.",
      "Ăn mặc lịch sự, tháo giày và giữ trật tự khi vào bên trong điện.",
    ],
    bestTime: "Quanh năm, đẹp nhất mùa khô tháng 11–4",
    visitDuration: "1–2 giờ",
    ticket: "",
    openingHours: "06:00–18:00",
    badges: ["verified", "popular", "ai-recommended"],
    tags: ["temple", "culture", "history", "photography"],
    gallery: [
      { seed: "caodai-toathanh", caption: "Tòa Thánh Cao Đài rực rỡ sắc màu", ratio: "16/9" },
      { seed: "caodai-thiennhan", caption: "Biểu tượng Thiên Nhãn linh thiêng", ratio: "4/3" },
      { seed: "caodai-lehoi", caption: "Tín đồ áo trắng làm lễ trang nghiêm", ratio: "1/1" },
    ],
    nearby: ["nui-ba-den-tay-ninh"],
  },
];

export const southeastProvinces: Record<string, ProvinceEditorial> = {
  "ba-ria-vung-tau": {
    slug: "ba-ria-vung-tau",
    summary:
      "Tỉnh ven biển miền Đông với thành phố biển Vũng Tàu sầm uất và quần đảo Côn Đảo hoang sơ huyền thoại.",
    story:
      "Bà Rịa – Vũng Tàu là cửa ngõ biển của miền Đông Nam Bộ, nơi thành phố Vũng Tàu hào sảng đón du khách bằng những bãi tắm dài, hải sản tươi ngon và tượng Chúa Kitô sừng sững trên núi. Ngoài khơi, quần đảo Côn Đảo vừa thiêng liêng với di tích lịch sử, vừa nguyên sơ với biển xanh và rùa biển. Đây là vùng đất của biển cả, dầu khí và những chuyến nghỉ dưỡng cuối tuần thân quen của người phương Nam.",
    bestTime: "Tháng 11 đến tháng 4 (mùa khô, biển êm)",
    specialties: ["Bánh khọt Vũng Tàu", "Hải sản tươi sống", "Mứt hạt bàng Côn Đảo"],
  },
  "dong-nai": {
    slug: "dong-nai",
    summary:
      "Vùng đất công nghiệp năng động bên sông Đồng Nai, ẩn chứa rừng quốc gia Cát Tiên và những thác nước sinh thái xanh mát.",
    story:
      "Đồng Nai là tỉnh công nghiệp sầm uất bậc nhất phía Nam, nhưng vẫn giữ được những mảng xanh quý giá. Vườn quốc gia Cát Tiên với rừng nguyên sinh và khu dự trữ sinh quyển là điểm đến hàng đầu cho người yêu thiên nhiên. Bên cạnh đó, những thác nước như Giang Điền, các khu du lịch sinh thái và dòng sông Đồng Nai hiền hòa tạo nên không gian dã ngoại lý tưởng cho người dân Sài Gòn mỗi dịp cuối tuần.",
    bestTime: "Tháng 12 đến tháng 5 (mùa khô)",
    specialties: ["Bưởi Tân Triều", "Chôm chôm Long Khánh", "Gỏi cá Biên Hòa"],
  },
  "binh-duong": {
    slug: "binh-duong",
    summary:
      "Thủ phủ công nghiệp miền Đông với lễ hội chùa Bà Thiên Hậu sôi động và khu du lịch Đại Nam khổng lồ.",
    story:
      "Bình Dương là một trong những trung tâm công nghiệp và đô thị phát triển nhanh nhất Việt Nam, nhưng vẫn đậm chất văn hóa truyền thống. Thủ Dầu Một nổi tiếng với nghề gốm sứ, sơn mài lâu đời và miếu Bà Thiên Hậu, nơi diễn ra lễ rước kiệu rằm tháng Giêng tưng bừng nhất miền Đông. Khu du lịch Đại Nam quy mô khổng lồ là điểm vui chơi giải trí gia đình hấp dẫn, hòa quyện giữa tâm linh, thiên nhiên và giải trí hiện đại.",
    bestTime: "Tháng 11 đến tháng 4 (mùa khô) và rằm tháng Giêng",
    specialties: ["Gốm sứ Lái Thiêu", "Sơn mài truyền thống", "Trái cây Lái Thiêu"],
  },
  "binh-phuoc": {
    slug: "binh-phuoc",
    summary:
      "Tỉnh biên giới với rừng nguyên sinh Bù Gia Mập, những trảng cỏ kỳ thú và văn hóa S'tiêng, M'nông đậm đà.",
    story:
      "Bình Phước nằm ở vùng biên giới Tây Nam, là cửa ngõ nối Đông Nam Bộ với Tây Nguyên và Campuchia. Đây là xứ sở của những đồi điều, vườn tiêu bạt ngàn và những cánh rừng nguyên sinh quý giá như Bù Gia Mập. Thiên nhiên hoang sơ với trảng cỏ Bù Lạch, thác ghềnh, suối rừng cùng đời sống văn hóa cồng chiêng của đồng bào S'tiêng, M'nông tạo nên bản sắc riêng cho vùng đất biên cương trầm mặc mà cuốn hút này.",
    bestTime: "Tháng 11 đến tháng 4 (mùa khô)",
    specialties: ["Hạt điều rang muối", "Tiêu Lộc Ninh", "Cơm lam, rượu cần S'tiêng"],
  },
  "tay-ninh": {
    slug: "tay-ninh",
    summary:
      "Vùng đất tâm linh miền Đông với 'nóc nhà Nam Bộ' Núi Bà Đen và Tòa Thánh Cao Đài rực rỡ độc đáo.",
    story:
      "Tây Ninh là tỉnh biên giới Tây Nam nổi danh là trung tâm tâm linh của miền Đông Nam Bộ. Núi Bà Đen – đỉnh cao nhất Nam Bộ – thu hút hàng triệu lượt hành hương và du khách mỗi năm với chùa chiền linh thiêng và cáp treo hiện đại. Tòa Thánh Cao Đài, trung tâm của một tôn giáo bản địa độc đáo, mang vẻ đẹp kiến trúc giao thoa Đông – Tây có một không hai. Tây Ninh còn nổi tiếng với bánh tráng phơi sương và muối tôm đậm đà.",
    bestTime: "Tháng 11 đến tháng 4 và mùa lễ hội tháng Giêng",
    specialties: ["Bánh tráng phơi sương Trảng Bàng", "Muối tôm Tây Ninh", "Bánh canh Trảng Bàng"],
  },
};
