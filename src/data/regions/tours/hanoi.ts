// Hà Nội — places published itineraries visit that the 038 hub pass did not cover (tasks/039).
//
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`. Candidates whose
// coordinate could not be resolved were dropped, not guessed — tasks/039-tour-stops.md lists them.
//
// These ship without photographs: vivel-33's image run fixed its list before these rows existed, so
// the galleries fall back to IllustratedImage placeholders until a later pass.
import type { Destination } from "@/lib/types";

export const hanoiTourDestinations: Destination[] = [
  {
    id: "ho-chi-minh-museum",
    slug: "bao-tang-ho-chi-minh",
    provinceSlug: "ha-noi",
    name: "Bảo tàng Hồ Chí Minh",
    nameEn: "Ho Chi Minh Museum",
    type: "museum",
    lng: 105.8326,
    lat: 21.0357,
    summary:
      "Khối nhà trắng hình bông sen ngay sau Lăng, kể lại cuộc đời Hồ Chí Minh trong bối cảnh thế kỷ 20.",
    story:
      "Bảo tàng mở cửa năm 1990, đúng dịp một trăm năm ngày sinh Hồ Chí Minh, và nằm ngay sau Lăng nên hầu như ai vào Lăng cũng đi tiếp sang đây. Toà nhà là một khối bê tông trắng vuông vức đặt trên trụ, hình dung theo bông sen đang nở — kiến trúc sư Liên Xô thiết kế, và cái vẻ nặng nề ấy rất đặc trưng cho thời điểm nó ra đời. Bên trong thì khác hẳn với những gì người ta chờ đợi ở một bảo tàng danh nhân: hiện vật về cuộc đời ông được đặt xen giữa những gian trưng bày dựng theo lối sắp đặt, tái hiện các biến động của thế kỷ 20 mà ông đi qua — Paris những năm 1920, cách mạng Nga, chiến tranh. Cách kể đó khiến bảo tàng đáng xem cả với người không quan tâm chính trị.",
    facts: [
      "Bảo tàng khánh thành ngày 19/5/1990, kỷ niệm 100 năm ngày sinh Hồ Chí Minh.",
      "Khối nhà trắng hình vuông đặt trên trụ được thiết kế phỏng theo hình bông sen nở.",
      "Nằm trong quần thể Ba Đình cùng Lăng Chủ tịch, Chùa Một Cột và Phủ Chủ tịch.",
      "Trưng bày kết hợp hiện vật tiểu sử với các gian sắp đặt về bối cảnh thế giới thế kỷ 20.",
    ],
    travelTips: [
      "Đi cùng buổi với Lăng và Chùa Một Cột — ba nơi nằm sát nhau, đi bộ vài phút.",
      "Bảo tàng nghỉ chiều thứ Hai và chiều thứ Sáu; kiểm tra lại trước khi tới.",
    ],
    bestTime: "Buổi sáng, ngay sau khi viếng Lăng",
    visitDuration: "1 giờ 30 phút",
    ticket: "40.000đ (giá tham khảo, kiểm tra lại tại quầy)",
    openingHours: "08:00 - 12:00, 14:00 - 16:30",
    badges: ["verified"],
    tags: ["museum", "history", "culture"],
    gallery: [
      { seed: "ho-chi-minh-museum-1", caption: "Khối nhà trắng hình sen nhìn từ sân Ba Đình", ratio: "16/9" },
      { seed: "ho-chi-minh-museum-2", caption: "Gian trưng bày bên trong", ratio: "4/3" },
    ],
    nearby: ["ho-chi-minh-mausoleum", "one-pillar-pagoda", "imperial-citadel-thang-long"],
    sourceUrl: "https://en.wikipedia.org/wiki/Ho_Chi_Minh_Museum",
    verifiedAt: "2026-08-16",
  },
  {
    id: "thang-long-water-puppet",
    slug: "nha-hat-mua-roi-nuoc-thang-long",
    provinceSlug: "ha-noi",
    name: "Nhà hát Múa rối nước Thăng Long",
    nameEn: "Thang Long Water Puppet Theatre",
    type: "city",
    lng: 105.8535,
    lat: 21.0317,
    summary:
      "Rạp múa rối nước ngay bờ đông hồ Gươm, diễn quanh năm trên một bể nước thay cho sân khấu.",
    story:
      "Múa rối nước sinh ra ở đồng bằng sông Hồng, nơi ruộng ngập nước là sân khấu có sẵn: người điều khiển đứng sau tấm mành, ngâm mình trong nước, giật con rối bằng hệ sào và dây chìm dưới mặt nước. Nghề này từng chỉ diễn ở ao làng vào hội, và gần như mất hẳn giữa thế kỷ 20 trước khi được dựng lại. Nhà hát Thăng Long ở 57B Đinh Tiên Hoàng là nơi giữ nghề đều đặn nhất — diễn nhiều suất mỗi ngày, mỗi suất khoảng 50 phút, gồm những tích quen thuộc: chú Tễu, múa rồng, truyền thuyết vua Lê trả gươm cho rùa vàng ngay cái hồ ngoài cửa rạp. Dàn nhạc dân tộc ngồi bên chơi trực tiếp, không thu sẵn.",
    facts: [
      "Nhà hát nằm ở 57B Đinh Tiên Hoàng, sát bờ đông hồ Hoàn Kiếm.",
      "Người điều khiển đứng ngâm trong nước sau mành, dùng sào và dây chìm dưới mặt nước.",
      "Mỗi suất diễn kéo dài khoảng 50 phút, gồm nhiều tích ngắn thay vì một vở dài.",
      "Nhạc công chơi nhạc cụ dân tộc trực tiếp bên sân khấu trong suốt buổi diễn.",
    ],
    travelTips: [
      "Đặt vé trước, nhất là các suất chiều tối — rạp nhỏ và thường kín chỗ.",
      "Hàng ghế đầu dễ bị nước bắn; ngồi lùi vài hàng nhìn tổng thể sân khấu rõ hơn.",
    ],
    bestTime: "Suất tối, gộp cùng buổi dạo hồ Gươm",
    visitDuration: "1 giờ",
    ticket: "100.000đ - 200.000đ tuỳ hạng ghế (giá tham khảo)",
    openingHours: "Nhiều suất mỗi ngày, thường 15:00 - 21:00",
    badges: ["popular", "verified"],
    tags: ["culture", "history", "family"],
    gallery: [
      { seed: "thang-long-water-puppet-1", caption: "Sân khấu nước và dàn rối", ratio: "16/9" },
      { seed: "thang-long-water-puppet-2", caption: "Nhạc công chơi trực tiếp bên sân khấu", ratio: "4/3" },
    ],
    nearby: ["hoan-kiem-lake", "ngoc-son-temple", "old-quarter-hanoi"],
    sourceUrl: "https://www.openstreetmap.org/way/1190941789",
    verifiedAt: "2026-08-16",
  },
  {
    id: "phu-tay-ho",
    slug: "phu-tay-ho",
    provinceSlug: "ha-noi",
    name: "Phủ Tây Hồ",
    nameEn: "Tay Ho Temple",
    type: "temple",
    lng: 105.8196,
    lat: 21.0557,
    summary:
      "Đền thờ Mẫu Liễu Hạnh trên doi đất nhô ra hồ Tây, đông nhất vào mùng một và rằm.",
    story:
      "Phủ nằm cuối một doi đất hẹp chìa ra hồ Tây, nên đi tới đâu cũng thấy mặt nước hai bên. Nơi này thờ Mẫu Liễu Hạnh — một trong Tứ bất tử của tín ngưỡng Việt, và là vị được thờ phụng rộng nhất trong tín ngưỡng thờ Mẫu, thứ tín ngưỡng bản địa mà UNESCO đã ghi danh. Khác với chùa, phủ không tĩnh: vào mùng một và ngày rằm âm lịch, con đường dẫn ra phủ kẹt cứng người đi lễ, hàng mã và hoa bày kín hai bên, và trong phủ có thể gặp một giá hầu đồng đang diễn ra với âm nhạc chầu văn. Đó là lúc nên tới nếu muốn thấy tín ngưỡng đang sống, và là lúc nên tránh nếu muốn yên tĩnh.",
    facts: [
      "Phủ thờ Mẫu Liễu Hạnh, một trong Tứ bất tử của tín ngưỡng dân gian Việt Nam.",
      "Công trình nằm trên một bán đảo nhỏ nhô ra hồ Tây, đường vào chỉ một lối.",
      "Tín ngưỡng thờ Mẫu Tam phủ được UNESCO ghi danh là di sản văn hoá phi vật thể năm 2016.",
      "Mùng một và ngày rằm âm lịch là hai ngày đông người đi lễ nhất trong tháng.",
    ],
    travelTips: [
      "Tránh mùng một và rằm nếu ngại đông; đường ra phủ khi ấy gần như không đi xe được.",
      "Ăn bánh tôm hồ Tây ở các quán ngay đầu đường vào — đó là món gắn với khu này.",
    ],
    bestTime: "Chiều muộn ngày thường, khi nắng xuống mặt hồ",
    visitDuration: "45 phút",
    ticket: "Miễn phí",
    openingHours: "05:00 - 19:00",
    badges: ["verified"],
    tags: ["temple", "culture", "history"],
    gallery: [
      { seed: "phu-tay-ho-1", caption: "Cổng phủ nhìn ra mặt hồ Tây", ratio: "16/9" },
      { seed: "phu-tay-ho-2", caption: "Ven hồ Tây gần phủ", ratio: "4/3" },
      { seed: "phu-tay-ho-3", caption: "Ban thờ Mẫu trong phủ", ratio: "4/3" },
    ],
    nearby: ["west-lake-hanoi", "tran-quoc-pagoda", "quan-thanh-temple"],
    sourceUrl: "https://www.openstreetmap.org/way/941901613",
    verifiedAt: "2026-08-16",
  },
  {
    id: "national-history-museum-vn",
    slug: "bao-tang-lich-su-quoc-gia",
    provinceSlug: "ha-noi",
    name: "Bảo tàng Lịch sử Quốc gia",
    nameEn: "Vietnam National Museum of History",
    type: "museum",
    lng: 105.8597,
    lat: 21.0247,
    summary:
      "Toà nhà Đông Dương 1932 sau Nhà hát Lớn, giữ bộ trống đồng Đông Sơn và điêu khắc Chăm quan trọng nhất nước.",
    story:
      "Toà nhà này vốn là bảo tàng của Viện Viễn Đông Bác cổ, do Ernest Hébrard thiết kế và hoàn thành năm 1932. Hébrard là người đề xướng phong cách Kiến trúc Đông Dương — lấy khung nhà Pháp rồi gắn lên đó mái ngói cong, hiên rộng và hệ thông gió hợp khí hậu nhiệt đới — và đây là ví dụ hoàn chỉnh nhất của phong cách ấy còn đứng ở Hà Nội. Bên trong là bộ sưu tập lịch sử quốc gia đi từ thời tiền sử tới thế kỷ 20, mà phần đáng xem nhất nằm ở đầu: trống đồng Đông Sơn, những chiếc trống nghi lễ đúc cách đây hơn hai nghìn năm với hoa văn mặt trời và người hoá trang lông chim. Bộ điêu khắc đá Chăm ở đây cũng chỉ đứng sau bảo tàng Đà Nẵng.",
    facts: [
      "Toà nhà do kiến trúc sư Ernest Hébrard thiết kế, hoàn thành năm 1932 cho Viện Viễn Đông Bác cổ.",
      "Đây là công trình tiêu biểu nhất của phong cách Kiến trúc Đông Dương tại Hà Nội.",
      "Bộ sưu tập trống đồng Đông Sơn ở đây thuộc loại đầy đủ nhất Việt Nam.",
      "Bảo tàng nằm ngay sau Nhà hát Lớn, cách hồ Hoàn Kiếm khoảng một cây số.",
    ],
    travelTips: [
      "Phần trưng bày chia hai toà nhà hai bên đường — hỏi rõ khi mua vé để không bỏ sót nửa kia.",
      "Đi cùng buổi với Nhà hát Lớn và hồ Gươm, cả ba nằm trên một trục đi bộ.",
    ],
    bestTime: "Buổi sáng, khi các gian trưng bày còn vắng",
    visitDuration: "2 giờ",
    ticket: "40.000đ (giá tham khảo, kiểm tra lại tại quầy)",
    openingHours: "08:00 - 12:00, 13:30 - 17:00",
    badges: ["verified"],
    tags: ["museum", "history", "culture", "architecture"],
    gallery: [
      { seed: "national-history-museum-vn-1", caption: "Mặt tiền Kiến trúc Đông Dương của Hébrard", ratio: "16/9" },
      { seed: "national-history-museum-vn-2", caption: "Trống đồng Đông Sơn trong gian trưng bày", ratio: "4/3" },
    ],
    nearby: ["hanoi-opera-house", "hoan-kiem-lake", "hoa-lo-prison"],
    sourceUrl: "https://en.wikipedia.org/wiki/Vietnam_National_Museum_of_History",
    verifiedAt: "2026-08-16",
  },
  {
    id: "tong-duy-tan-food-street",
    slug: "pho-tong-duy-tan",
    provinceSlug: "ha-noi",
    name: "Phố Tống Duy Tân",
    nameEn: "Tong Duy Tan Street",
    type: "street",
    lng: 105.8437,
    lat: 21.0294,
    summary: "Con phố ẩm thực mở khuya của Hà Nội, nổi nhất là gà tần và mì vằn thắn.",
    story:
      "Tống Duy Tân là con phố ngắn nối ra ngõ Cấm Chỉ, và là tuyến phố đầu tiên Hà Nội chính thức quy hoạch thành phố ẩm thực. Điều khiến nó đáng đi không phải là danh sách món mà là giờ giấc: khi phần lớn hàng quán trong phố cổ đã đóng, đoạn phố này vẫn sáng đèn, nên nó trở thành chỗ ăn khuya mặc định của cả người Hà Nội lẫn khách. Món gắn với phố là gà tần thuốc bắc — con gà nhỏ hầm trong thang thuốc, ăn nóng trong bát đất — cùng mì vằn thắn và các hàng cháo. Phố hẹp, bàn ghế nhựa tràn ra vỉa hè, và cái nhịp ồn ào lúc nửa đêm mới là thứ người ta tới tìm.",
    facts: [
      "Đây là tuyến phố đầu tiên của Hà Nội được quy hoạch chính thức thành phố ẩm thực.",
      "Phố nối liền với ngõ Cấm Chỉ, khu hàng ăn khuya có từ trước đó.",
      "Món đặc trưng của phố là gà tần thuốc bắc, bên cạnh mì vằn thắn và cháo.",
      "Hàng quán ở đây mở muộn hơn hẳn mặt bằng chung của khu phố cổ.",
    ],
    travelTips: [
      "Tới sau 21:00 — trước đó phố khá vắng và mất đúng cái không khí đáng đến.",
      "Hỏi giá trước khi gọi món; các hàng ở đây không phải nơi nào cũng niêm yết.",
    ],
    bestTime: "Đêm muộn, sau khi phố cổ đã đóng cửa",
    visitDuration: "1 giờ",
    ticket: "Miễn phí (trả tiền theo món)",
    openingHours: "17:00 - 02:00",
    badges: ["verified"],
    tags: ["food", "nightlife", "city"],
    gallery: [
      { seed: "tong-duy-tan-food-street-1", caption: "Phố ẩm thực sáng đèn lúc nửa đêm", ratio: "16/9" },
      { seed: "tong-duy-tan-food-street-2", caption: "Quán cà phê trên phố Tống Duy Tân", ratio: "4/3" },
      { seed: "tong-duy-tan-food-street-3", caption: "Bát gà tần thuốc bắc", ratio: "4/3" },
    ],
    nearby: ["old-quarter-hanoi", "hoa-lo-prison", "hoan-kiem-lake"],
    sourceUrl: "https://www.openstreetmap.org/way/28924633",
    verifiedAt: "2026-08-16",
  },
];
