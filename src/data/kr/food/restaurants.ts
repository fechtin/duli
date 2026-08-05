// Food Explorer — quán ăn Hàn Quốc (026 §Atlas Score).
// Chỉ chọn những địa chỉ lâu năm, nổi tiếng và dễ kiểm chứng. Giá và giờ mở cửa là ước lượng
// tham khảo, có thể đổi — luôn kiểm tra lại trước khi đi.
import type { Restaurant } from "@/lib/types";

export const krRestaurants: Restaurant[] = [
  // Samgyetang — Seoul
  {
    id: "kr-tosokchon", dishId: "kr-samgyetang", name: "Tosokchon Samgyetang", provinceSlug: "seoul",
    address: "5 Jahamun-ro 5-gil, Jongno-gu (gần Gyeongbokgung)", lng: 126.9709, lat: 37.5773,
    priceRange: "20.000–25.000 KRW", openHours: "10:00–22:00",
    labels: ["local-favorite", "atlas-pick"], atlasScore: 90,
    reasons: [
      "Quán samgyetang được nhắc tới nhiều nhất Seoul, mở từ thập niên 1980",
      "Ngay cạnh cung Gyeongbokgung — ghép rất gọn vào buổi sáng tham quan",
      "Hàng dài nhưng bàn xoay nhanh, chờ trung bình 15–30 phút",
    ],
  },
  // Tteokbokki — Seoul
  {
    id: "kr-sindang-tteokbokki-town", dishId: "kr-tteokbokki", name: "Phố tteokbokki Sindang", provinceSlug: "seoul",
    address: "Sindang-dong, Jung-gu", lng: 127.0176, lat: 37.5657,
    priceRange: "10.000–15.000 KRW", openHours: "11:00–22:00",
    labels: ["street-food", "local-favorite"], atlasScore: 86,
    reasons: [
      "Nơi khai sinh tteokbokki sốt gochujang vào thập niên 1950",
      "Cả một dãy phố cùng bán một món — dễ so sánh khẩu vị từng quán",
      "Nồi nấu ngay tại bàn, gọi thêm mì và chả cá tuỳ ý",
    ],
  },
  // Jjajangmyeon — Incheon
  {
    id: "kr-gonghwachun", dishId: "kr-jjajangmyeon", name: "Gonghwachun (Phố người Hoa)", provinceSlug: "incheon",
    address: "43 Chinatown-ro, Jung-gu, Incheon", lng: 126.6175, lat: 37.4742,
    priceRange: "8.000–15.000 KRW", openHours: "11:00–21:00",
    labels: ["atlas-pick", "family"], atlasScore: 88,
    reasons: [
      "Đứng ngay nơi món jjajangmyeon ra đời cuối thế kỷ 19",
      "Bảo tàng Jjajangmyeon nằm sát bên, đi cùng một buổi rất hợp",
      "Cách ga Incheon vài phút đi bộ, tiện cho chuyến trong ngày từ Seoul",
    ],
  },
  // Dakgalbi — Chuncheon, Gangwon
  {
    id: "kr-chuncheon-myeongdong-dakgalbi", dishId: "kr-dakgalbi", name: "Phố dakgalbi Myeongdong Chuncheon", provinceSlug: "gangwon",
    address: "Myeongdong-gil, Chuncheon", lng: 127.7295, lat: 37.8795,
    priceRange: "14.000–18.000 KRW/người", openHours: "11:00–22:00",
    labels: ["local-favorite", "street-food"], atlasScore: 89,
    reasons: [
      "Cả con phố chỉ bán dakgalbi — nơi món này thành danh từ thập niên 1960",
      "Chảo xào ngay giữa bàn, kết thúc bằng cơm rang trên phần sốt còn lại",
      "Đi tàu ITX từ Seoul tới Chuncheon chỉ hơn một giờ",
    ],
  },
  // Bánh mì — Daejeon
  {
    id: "kr-sungsimdang", dishId: "kr-sungsimdang-bread", name: "Sungsimdang (tiệm chính)", provinceSlug: "daejeon",
    address: "15 Daejong-ro 480beon-gil, Jung-gu, Daejeon", lng: 127.4272, lat: 36.3277,
    priceRange: "2.000–8.000 KRW/bánh", openHours: "08:00–22:00",
    labels: ["atlas-pick", "family"], atlasScore: 91,
    reasons: [
      "Tiệm bánh mở từ 1956, biến Daejeon thành 'thành phố bánh mì'",
      "Twigim-soboro và bánh nhân kem là hai món phải thử",
      "Cách ga Daejeon khoảng 10 phút — hợp cho điểm dừng giữa hành trình KTX",
    ],
  },
  // Bibimbap — Jeonju
  {
    id: "kr-gogung-jeonju", dishId: "kr-jeonju-bibimbap", name: "Gogung (làng hanok Jeonju)", provinceSlug: "jeonbuk",
    address: "63 Jeonjugaeksa 3-gil, Wansan-gu, Jeonju", lng: 127.1425, lat: 35.8195,
    priceRange: "13.000–20.000 KRW", openHours: "10:30–21:30",
    labels: ["atlas-pick", "family"], atlasScore: 89,
    reasons: [
      "Bibimbap dọn trong tô đồng đúng lối Jeonju, cơm nấu bằng nước hầm xương",
      "Nằm ngay khu làng hanok, đi bộ được tới mọi điểm tham quan",
      "Có suất chay và suất không cay cho khách nước ngoài",
    ],
  },
  // Dwaeji-gukbap — Busan
  {
    id: "kr-ssangdungi-dwaeji-gukbap", dishId: "kr-dwaeji-gukbap", name: "Phố canh xương heo Seomyeon", provinceSlug: "busan",
    address: "Seomyeon, Busanjin-gu, Busan", lng: 129.0595, lat: 35.1575,
    priceRange: "9.000–12.000 KRW", openHours: "24 giờ (nhiều quán)",
    labels: ["local-favorite", "street-food"], atlasScore: 90,
    reasons: [
      "Khu tập trung nhiều quán dwaeji-gukbap lâu năm nhất Busan",
      "Nhiều quán mở suốt đêm — món giải rượu kinh điển của dân địa phương",
      "Mỗi bàn có mắm tôm và hẹ để tự nêm theo khẩu vị",
    ],
  },
  // Chả cá — Busan
  {
    id: "kr-samjin-eomuk", dishId: "kr-eomuk", name: "Samjin Eomuk (Yeongdo)", provinceSlug: "busan",
    address: "36 Taejong-ro 99beon-gil, Yeongdo-gu, Busan", lng: 129.0435, lat: 35.0905,
    priceRange: "3.000–10.000 KRW", openHours: "09:00–19:00",
    labels: ["atlas-pick", "family"], atlasScore: 87,
    reasons: [
      "Hãng chả cá lâu đời nhất Hàn Quốc, hoạt động từ năm 1953",
      "Có bảo tàng nhỏ và lớp làm chả cá ngay tại xưởng",
      "Chả cá nhiều loại ăn nóng tại chỗ, mua mang đi cũng tiện",
    ],
  },
  // Jjimdak — Andong
  {
    id: "kr-andong-jjimdak-alley", dishId: "kr-andong-jjimdak", name: "Phố jjimdak chợ cũ Andong", provinceSlug: "gyeongbuk",
    address: "Chợ Andong Gu, Andong", lng: 128.7285, lat: 36.5695,
    priceRange: "30.000–45.000 KRW/chảo (2–3 người)", openHours: "11:00–21:00",
    labels: ["local-favorite", "family"], atlasScore: 88,
    reasons: [
      "Nơi món jjimdak ra đời, cả dãy quán trong khu chợ cũ",
      "Một chảo đủ cho 3 người — hợp đi nhóm",
      "Ghép rất gọn với làng Hahoe và Dosan Seowon trong cùng ngày",
    ],
  },
  // Heo đen — Jeju
  {
    id: "kr-jeju-black-pork-street", dishId: "kr-jeju-heukdwaeji", name: "Phố heo đen Jeju (Geonip-dong)", provinceSlug: "jeju",
    address: "Geonip-dong, thành phố Jeju", lng: 126.5285, lat: 33.5145,
    priceRange: "18.000–25.000 KRW/phần", openHours: "12:00–23:00",
    labels: ["local-favorite", "atlas-pick"], atlasScore: 88,
    reasons: [
      "Dãy quán chuyên heo đen bản địa, thịt cắt dày nướng than",
      "Chấm melchijeot — mắm cá cơm đun nóng, cách ăn riêng của Jeju",
      "Gần cảng và sân bay Jeju, tiện cho tối đầu tiên trên đảo",
    ],
  },
  // Hàu — Tongyeong
  {
    id: "kr-tongyeong-jungang-market", dishId: "kr-tongyeong-gul", name: "Chợ Jungang Tongyeong", provinceSlug: "gyeongnam",
    address: "12 Tongyeonghaean-ro, Tongyeong", lng: 128.4245, lat: 34.8455,
    priceRange: "10.000–30.000 KRW", openHours: "06:00–20:00",
    labels: ["street-food", "local-favorite"], atlasScore: 86,
    reasons: [
      "Hàu từ vịnh Tongyeong — vùng nuôi hàu lớn nhất Hàn Quốc",
      "Mua hàu tươi tại quầy rồi ăn ngay ở hàng chế biến bên cạnh",
      "Ngay dưới chân làng bích hoạ Dongpirang",
    ],
  },
  // Lòng nướng — Daegu
  {
    id: "kr-anjirang-gopchang", dishId: "kr-daegu-makchang", name: "Phố lòng nướng Anjirang", provinceSlug: "daegu",
    address: "Anjirang-dong, Nam-gu, Daegu", lng: 128.5745, lat: 35.8305,
    priceRange: "12.000–18.000 KRW/phần", openHours: "16:00–02:00",
    labels: ["local-favorite", "street-food"], atlasScore: 85,
    reasons: [
      "Cả con phố hơn 50 quán chỉ nướng lòng, mở tới rạng sáng",
      "Giá rẻ hơn hẳn Seoul với cùng chất lượng",
      "Không khí nhậu đặc trưng nhất Daegu",
    ],
  },
];
