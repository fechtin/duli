// Huế, Nha Trang and Ninh Bình — tour stops the 038 hub pass missed (tasks/039).
//
// Three hubs in one file because each contributed a single row that survived coordinate
// resolution: the rest of their candidates could not be looked up and were dropped rather than
// guessed (tasks/039-tour-stops.md lists them). A file per hub would be three files of one entry.
import type { Destination } from "@/lib/types";

export const centralTourDestinations: Destination[] = [
  {
    id: "thuy-xuan-incense-village",
    slug: "lang-huong-thuy-xuan",
    provinceSlug: "thua-thien-hue",
    name: "Làng hương Thủy Xuân",
    nameEn: "Thuy Xuan Incense Village",
    type: "village",
    lng: 107.5627,
    lat: 16.434,
    summary: "Xóm làm hương trên đường lên lăng Tự Đức, nhận ra ngay bởi những bó chân hương xoè màu.",
    story:
      "Thủy Xuân nằm trên con đường từ thành phố lên lăng Tự Đức và đồi Vọng Cảnh, nên hầu như đoàn nào đi lăng cũng dừng ở đây. Nghề làm hương ở xóm này có từ nhiều đời, phục vụ chính các lăng tẩm và chùa quanh Huế — nơi hương đốt quanh năm chứ không chỉ dịp lễ. Chân hương được nhuộm phẩm rồi xoè ra thành từng bó hình quạt hong nắng trước cửa, và chính hình ảnh ấy đã biến cái xóm nghề thành điểm dừng chụp ảnh. Vẫn có người ngồi se hương bằng tay để khách xem, và mua được hương thật; nhưng nên hiểu rằng phần lớn những bó màu rực bày ra mặt đường bây giờ là để chụp chứ không phải để đốt.",
    facts: [
      "Làng nằm trên đường từ trung tâm Huế lên lăng Tự Đức và đồi Vọng Cảnh, cách Đại Nội khoảng 7 km.",
      "Nghề làm hương ở đây có truyền thống nhiều đời, cung cấp cho các lăng tẩm và chùa quanh Huế.",
      "Chân hương nhuộm màu được xoè thành bó hình quạt để hong nắng trước cửa nhà.",
      "Nhiều hộ vẫn se hương bằng tay ngay tại chỗ cho khách xem.",
    ],
    travelTips: [
      "Ghép cùng buổi đi lăng Tự Đức và đồi Vọng Cảnh — cả ba nằm trên một tuyến.",
      "Hỏi giá trước nếu muốn chụp ảnh với nón lá và áo dài cho mượn; đó là dịch vụ tính tiền.",
    ],
    bestTime: "Buổi sáng nắng, khi các bó hương được bày ra hong",
    visitDuration: "45 phút",
    ticket: "Miễn phí (trả tiền nếu mua hương hoặc thuê đồ chụp ảnh)",
    openingHours: "07:00 - 18:00",
    badges: ["verified"],
    tags: ["village", "culture", "photography", "shopping"],
    nearby: ["tu-duc-tomb", "khai-dinh-tomb", "hue-imperial-city"],
    sourceUrl: "https://www.openstreetmap.org/way/1473275556",
    verifiedAt: "2026-08-16",
  },
  {
    id: "hon-tam-island",
    slug: "dao-hon-tam",
    provinceSlug: "khanh-hoa",
    name: "Đảo Hòn Tằm",
    nameEn: "Hon Tam Island",
    type: "island",
    lng: 109.2447,
    lat: 12.1747,
    summary: "Hòn đảo trong vịnh Nha Trang, tên đặt theo dáng nhìn từ bờ giống một con tằm nằm.",
    story:
      "Từ bờ Nha Trang nhìn ra, Hòn Tằm là khối đảo thấp nằm dài giữa vịnh — và cái dáng ấy là lý do có tên: người ta thấy nó giống một con tằm đang nằm. Đảo cách bờ khoảng bảy cây số, đi ca nô chừng mười lăm phút, và là chặng gần bờ nhất trong các tour đảo của vịnh. Mặt đảo hướng vào bờ có bãi cát và nước lặng, phía sau là đồi rừng còn nguyên, đi bộ lên được. Thứ khiến Hòn Tằm khác các hòn còn lại là dịch vụ tắm bùn khoáng đặt ngay trên đảo — nên đây thường là chặng cuối của một ngày trên vịnh, sau khi đã lặn ngắm san hô ở Hòn Mun.",
    facts: [
      "Đảo nằm trong vịnh Nha Trang, cách bờ khoảng 7 km, đi ca nô chừng 15 phút.",
      "Tên đảo đặt theo dáng nhìn từ bờ, giống hình một con tằm nằm.",
      "Đây là chặng gần bờ nhất trong các tour đảo của vịnh Nha Trang.",
      "Trên đảo có khu tắm bùn khoáng, thường là chặng cuối sau khi lặn ở Hòn Mun.",
    ],
    travelTips: [
      "Đi ghép trong tour đảo rẻ hơn nhiều so với thuê ca nô riêng.",
      "Xếp Hòn Tằm vào cuối ngày — tắm bùn sau khi lặn hợp hơn là ngược lại.",
    ],
    bestTime: "Tháng 3 đến tháng 8, khi biển lặng nhất",
    visitDuration: "3 giờ",
    ticket: "Tuỳ gói tour và dịch vụ trên đảo (giá tham khảo tại bến)",
    openingHours: "07:30 - 17:00",
    badges: ["verified"],
    tags: ["island", "beach", "nature", "family"],
    nearby: ["hon-mun-island", "nha-trang-beach", "oceanographic-museum-vn"],
    sourceUrl: "https://www.openstreetmap.org/way/147536067",
    verifiedAt: "2026-08-16",
  },
  {
    id: "van-long-lagoon",
    slug: "dam-van-long",
    provinceSlug: "ninh-binh",
    name: "Đầm Vân Long",
    nameEn: "Van Long Lagoon",
    type: "lake",
    lng: 105.8606,
    lat: 20.3859,
    summary: "Khu ngập nước lớn nhất đồng bằng Bắc Bộ, mặt nước phẳng lặng dưới chân núi đá vôi.",
    story:
      "Vân Long là khu bảo tồn đất ngập nước nội địa lớn nhất miền Bắc, và khác hẳn Tràng An hay Tam Cốc ở một điểm: ở đây không có hang để chui qua, nên cũng không có đám đông. Thuyền nan chèo tay đi trên mặt nước gần như không gợn, giữa những khối núi đá vôi dựng thẳng — người ta gọi đây là vịnh không sóng, và đúng là mặt đầm phản chiếu núi rõ như gương. Giá trị thật của Vân Long nằm ở chỗ ít ai để ý: đây là nơi cư trú của quần thể voọc mông trắng lớn nhất thế giới, loài đặc hữu Việt Nam đang cực kỳ nguy cấp. Chèo chậm và im lặng thì có cơ hội thấy chúng trên vách đá.",
    facts: [
      "Đây là khu bảo tồn thiên nhiên đất ngập nước nội địa lớn nhất đồng bằng Bắc Bộ.",
      "Đầm là nơi cư trú của quần thể voọc mông trắng lớn nhất thế giới, loài đặc hữu Việt Nam.",
      "Thuyền ở đây chèo tay, đi giữa các khối núi đá vôi trên mặt nước gần như không gợn sóng.",
      "Khác Tràng An và Tam Cốc, tuyến thuyền Vân Long không xuyên qua hang động nào.",
    ],
    travelTips: [
      "Đi sáng sớm và giữ yên lặng — đó là lúc dễ thấy voọc trên vách đá nhất.",
      "Mang ống nhòm nếu có; vách đá cách thuyền khá xa.",
    ],
    bestTime: "Sáng sớm, từ tháng 10 đến tháng 4",
    visitDuration: "2 giờ",
    ticket: "80.000đ vé tham quan + tiền thuyền (giá tham khảo)",
    openingHours: "07:00 - 17:00",
    badges: ["verified"],
    tags: ["nature", "park", "photography"],
    nearby: ["trang-an", "hoa-lu-ancient-capital", "bai-dinh-pagoda"],
    sourceUrl: "https://www.openstreetmap.org/relation/13552106",
    verifiedAt: "2026-08-16",
  },
];
