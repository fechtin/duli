// Second wave of North Central Coast destinations (spec tasks/033). Separate from
// northCentral.ts to keep both files under the 500-LOC ceiling. Coordinates verified per the
// chain in the task doc (vi/en Wikipedia -> Wikidata -> OSM); see `sourceUrl` on each entry.
import type { Destination } from "@/lib/types";

export const northCentralCoastDepthDestinations: Destination[] = [
  {
    id: "vung-chua-dao-yen",
    slug: "vung-chua-dao-yen",
    provinceSlug: "quang-binh",
    name: "Vũng Chùa – Đảo Yến",
    nameEn: "Vung Chua - Yen Island",
    type: "beach",
    lng: 106.5167,
    lat: 17.9333,
    summary:
      "Vụng biển lặng dưới chân Đèo Ngang, nơi an nghỉ của Đại tướng Võ Nguyên Giáp.",
    story:
      "Vũng Chùa là một vụng biển kín gió nằm dưới chân dãy Hoành Sơn, được ba hòn đảo nhỏ — La, Gió và Yến — chắn ngoài nên mặt nước gần như luôn lặng. Năm 2013, Đại tướng Võ Nguyên Giáp được an táng trên sườn núi nhìn ra vụng biển này theo đúng di nguyện của ông, và từ đó nơi đây trở thành điểm viếng của hàng triệu người. Con đường dẫn lên phần mộ đi giữa rừng phi lao, cuối đường là khoảng sân nhỏ nhìn thẳng ra biển Đông. Phía dưới, bãi cát trắng chạy dài và Đảo Yến nằm cách bờ chừng một cây số — hòn đảo vẫn còn chim yến làm tổ, đúng như cái tên của nó.",
    facts: [
      "Vụng biển nằm dưới chân dãy Hoành Sơn, gần Đèo Ngang.",
      "Ba đảo nhỏ La, Gió và Yến chắn ngoài khiến mặt nước quanh năm lặng.",
      "Đại tướng Võ Nguyên Giáp được an táng tại đây năm 2013.",
      "Đảo Yến cách bờ khoảng 1km và vẫn có chim yến làm tổ.",
    ],
    travelTips: [
      "Ăn mặc chỉnh tề khi lên khu mộ; đây là nơi viếng chứ không phải điểm chụp ảnh.",
      "Kết hợp Đèo Ngang và biển Nhật Lệ trên đường vào Đồng Hới.",
    ],
    bestTime: "Tháng 4 đến tháng 8",
    visitDuration: "2 - 3 giờ",
    ticket: "",
    openingHours: "06:00 - 18:00",
    badges: ["verified", "popular"],
    tags: ["beach", "history", "nature"],
    gallery: [
      { seed: "vung-chua-dao-yen-1", caption: "Vụng biển lặng nhìn ra Đảo Yến", ratio: "16/9" },
      { seed: "vung-chua-dao-yen-2", caption: "Đường phi lao dẫn lên khu mộ", ratio: "4/3" },
    ],
    nearby: ["phong-nha-cave", "son-doong-cave"],
    sourceUrl: "https://vi.wikipedia.org/wiki/Vũng_Chùa",
    verifiedAt: "2026-08-06",
  },
  {
    id: "thien-mu-pagoda",
    slug: "chua-thien-mu",
    provinceSlug: "thua-thien-hue",
    name: "Chùa Thiên Mụ",
    nameEn: "Thien Mu Pagoda",
    type: "temple",
    lng: 107.54483,
    lat: 16.45318,
    summary:
      "Ngôi chùa biểu tượng của Huế trên đồi Hà Khê, với tháp Phước Duyên bảy tầng soi bóng sông Hương.",
    story:
      "Chùa Thiên Mụ dựng năm 1601 theo lệnh chúa Nguyễn Hoàng, gắn với truyền thuyết bà lão áo đỏ báo rằng sẽ có vị chân chúa tới đây lập chùa để giữ long mạch. Tháp Phước Duyên bảy tầng cao hai mươi mốt mét, xây năm 1844, mỗi tầng thờ một vị Phật và đã thành hình ảnh nhận diện của cả xứ Huế. Sau tháp là khuôn viên yên tĩnh với vườn thông, bia đá đội rùa và quả đại hồng chung đúc năm 1710 nặng hơn hai tấn. Trong sân sau còn chiếc ô tô Austin đã chở Hòa thượng Thích Quảng Đức vào Sài Gòn năm 1963 — một hiện vật khiến nhiều khách đứng lặng rất lâu.",
    facts: [
      "Chùa được dựng năm 1601 dưới thời chúa Nguyễn Hoàng.",
      "Tháp Phước Duyên bảy tầng, cao 21m, xây năm 1844.",
      "Chùa giữ quả đại hồng chung đúc năm 1710, nặng hơn 2 tấn.",
      "Trong khuôn viên trưng bày chiếc xe Austin liên quan sự kiện năm 1963.",
      "Chùa nằm trên đồi Hà Khê, bên bờ bắc sông Hương.",
    ],
    travelTips: [
      "Đi thuyền rồng trên sông Hương tới chùa thay vì đi đường bộ.",
      "Ghé sáng sớm để nghe chuông công phu và tránh các đoàn khách.",
    ],
    bestTime: "Tháng 1 đến tháng 4",
    visitDuration: "1 giờ",
    ticket: "",
    openingHours: "08:00 - 18:00",
    badges: ["popular", "verified"],
    tags: ["temple", "history", "culture"],
    gallery: [
      { seed: "thien-mu-pagoda-1", caption: "Tháp Phước Duyên bên sông Hương", ratio: "16/9" },
      { seed: "thien-mu-pagoda-2", caption: "Đại hồng chung đúc năm 1710", ratio: "4/3" },
    ],
    nearby: ["hue-imperial-city", "khai-dinh-tomb"],
    featured: true,
    sourceUrl: "https://vi.wikipedia.org/wiki/Chùa_Thiên_Mụ",
    verifiedAt: "2026-08-06",
  },
  {
    id: "khai-dinh-tomb",
    slug: "lang-khai-dinh",
    provinceSlug: "thua-thien-hue",
    name: "Lăng Khải Định",
    nameEn: "Tomb of Khai Dinh",
    type: "palace",
    lng: 107.5903,
    lat: 16.3989,
    summary:
      "Lăng vua duy nhất ở Huế pha bê tông và sành sứ châu Âu, lộng lẫy đến mức gây tranh cãi.",
    story:
      "Lăng Khải Định mất mười một năm để xây và trông không giống bất kỳ lăng vua nào khác ở Huế: bê tông cốt thép thay cho gỗ, cầu thang rồng kiểu Á Đông dẫn lên những khối kiến trúc mang dáng dấp châu Âu, mặt ngoài đen sạm vì vật liệu. Nhưng bước vào cung Thiên Định thì mọi thứ đảo ngược — toàn bộ tường và trần được ghép bằng hàng vạn mảnh sành sứ và thủy tinh màu thành tranh tứ quý, bát bửu, cả bức 'Cửu long ẩn vân' trên trần. Giữa phòng là pho tượng đồng vua Khải Định ngồi trên ngai, đúc tại Pháp năm 1920, và thi hài ông nằm ngay bên dưới. Người thời ấy chê lăng xa hoa và lai căng; giờ nó là công trình được chụp ảnh nhiều nhất trong hệ thống lăng tẩm Huế.",
    facts: [
      "Lăng được xây trong 11 năm, từ 1920 đến 1931.",
      "Là lăng vua duy nhất ở Huế dùng bê tông cốt thép làm vật liệu chính.",
      "Nội thất cung Thiên Định ghép từ hàng vạn mảnh sành sứ và thủy tinh màu.",
      "Tượng đồng vua Khải Định trong lăng được đúc tại Pháp năm 1920.",
      "Thuộc Quần thể di tích Cố đô Huế — Di sản thế giới UNESCO.",
    ],
    travelTips: [
      "Dành phần lớn thời gian trong cung Thiên Định; phần ngoài chỉ là vỏ.",
      "Đi buổi chiều để tránh đoàn khách buổi sáng từ trung tâm Huế.",
    ],
    bestTime: "Tháng 1 đến tháng 4",
    visitDuration: "1 - 2 giờ",
    ticket: "150.000đ",
    openingHours: "07:00 - 17:30",
    badges: ["unesco", "popular", "verified"],
    tags: ["history", "culture", "temple"],
    gallery: [
      { seed: "khai-dinh-tomb-1", caption: "Mặt ngoài lăng với cầu thang rồng", ratio: "16/9" },
      { seed: "khai-dinh-tomb-2", caption: "Tranh ghép sành sứ trong cung Thiên Định", ratio: "4/3" },
      { seed: "khai-dinh-tomb-3", caption: "Tượng đồng vua Khải Định trên ngai", ratio: "1/1" },
    ],
    nearby: ["hue-imperial-city", "thien-mu-pagoda"],
    featured: true,
    sourceUrl: "https://vi.wikipedia.org/wiki/Lăng_Khải_Định",
    verifiedAt: "2026-08-06",
  },
];
