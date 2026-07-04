// Food Explorer restaurants (026) — editorial Phase-1 picks; each belongs to a dish.
import type { Restaurant } from "@/lib/types";

export const restaurants: Restaurant[] = [
  // Phở — Hà Nội
  {
    id: "pho-thin-lo-duc", dishId: "pho-bo", name: "Phở Thìn 13 Lò Đúc", provinceSlug: "ha-noi",
    address: "13 Lò Đúc, Hai Bà Trưng", lng: 105.8577, lat: 21.0155,
    priceRange: "60-90k", openHours: "05:30–21:00",
    labels: ["local-favorite", "atlas-pick"], atlasScore: 92,
    reasons: ["Phở tái lăn xào lửa lớn — đặc trưng không nơi nào giống", "Người Hà Nội ăn ở đây từ 1979", "Luôn đông nhưng phục vụ rất nhanh"],
  },
  {
    id: "pho-bat-dan", dishId: "pho-bo", name: "Phở Bát Đàn", provinceSlug: "ha-noi",
    address: "49 Bát Đàn, Hoàn Kiếm", lng: 105.8461, lat: 21.0338,
    priceRange: "50-80k", openHours: "06:00–10:00, 18:00–20:30",
    labels: ["local-favorite", "street-food"], atlasScore: 90,
    reasons: ["Phở 'xếp hàng trả tiền trước' trứ danh phố cổ", "Nước dùng trong, chuẩn vị Hà Nội xưa", "Trải nghiệm văn hóa xếp hàng đáng thử"],
  },
  // Bún chả — Hà Nội
  {
    id: "bun-cha-huong-lien", dishId: "bun-cha", name: "Bún chả Hương Liên", provinceSlug: "ha-noi",
    address: "24 Lê Văn Hưu, Hai Bà Trưng", lng: 105.8551, lat: 21.0180,
    priceRange: "50-100k", openHours: "08:00–20:30",
    labels: ["ai-pick", "family"], atlasScore: 88,
    reasons: ["'Bún chả Obama' — bàn ăn của Tổng thống vẫn được giữ nguyên", "Combo Obama: bún chả + nem hải sản + bia Hà Nội", "Không gian rộng, phù hợp nhóm đông"],
  },
  {
    id: "bun-cha-dac-kim", dishId: "bun-cha", name: "Bún chả Đắc Kim", provinceSlug: "ha-noi",
    address: "1 Hàng Mành, Hoàn Kiếm", lng: 105.8482, lat: 21.0322,
    priceRange: "60-90k", openHours: "09:00–21:00",
    labels: ["local-favorite", "street-food"], atlasScore: 86,
    reasons: ["Suất đầy đặn nổi tiếng từ 1966", "Chả nướng than hoa ngay trước cửa", "Giữa lòng phố cổ, tiện ghé khi dạo bộ"],
  },
  // Chả cá — Hà Nội
  {
    id: "cha-ca-la-vong", dishId: "cha-ca", name: "Chả Cá Lã Vọng", provinceSlug: "ha-noi",
    address: "14 Chả Cá, Hoàn Kiếm", lng: 105.8477, lat: 21.0356,
    priceRange: "120-200k", openHours: "11:00–14:00, 17:00–21:00",
    labels: ["atlas-pick", "fine-dining"], atlasScore: 89,
    reasons: ["Nhà hàng hơn 100 năm khai sinh ra món ăn", "Chảo chả cá xèo xèo ngay tại bàn", "Một món duy nhất — không cần menu"],
  },
  // Cà phê trứng — Hà Nội
  {
    id: "cafe-giang", dishId: "ca-phe-trung", name: "Café Giảng", provinceSlug: "ha-noi",
    address: "39 Nguyễn Hữu Huân, Hoàn Kiếm", lng: 105.8531, lat: 21.0333,
    priceRange: "25-45k", openHours: "07:00–22:00",
    labels: ["atlas-pick", "local-favorite"], atlasScore: 93,
    reasons: ["Nơi khai sinh cà phê trứng từ 1946", "Công thức gia truyền của cụ Nguyễn Văn Giảng", "Ngõ nhỏ sâu hun hút — đúng chất Hà Nội"],
  },
  {
    id: "cafe-dinh", dishId: "ca-phe-trung", name: "Café Đinh", provinceSlug: "ha-noi",
    address: "13 Đinh Tiên Hoàng, gác 2", lng: 105.8524, lat: 21.0299,
    priceRange: "25-40k", openHours: "07:00–21:00",
    labels: ["local-favorite"], atlasScore: 87,
    reasons: ["Ban công nhìn thẳng ra Hồ Gươm", "Cùng gia đình sáng lập Café Giảng", "Không gian căn gác cổ nguyên bản"],
  },
  // Bún bò — Huế
  {
    id: "bun-bo-ba-tuyet", dishId: "bun-bo-hue", name: "Bún bò Bà Tuyết", provinceSlug: "thua-thien-hue",
    address: "47 Nguyễn Công Trứ, TP. Huế", lng: 107.5909, lat: 16.4674,
    priceRange: "35-55k", openHours: "06:00–11:00",
    labels: ["local-favorite", "street-food"], atlasScore: 90,
    reasons: ["Nước dùng ruốc sả chuẩn vị mệ Huế", "Người địa phương ăn sáng mỗi ngày", "Hết hàng trước trưa — dậy sớm mới kịp"],
  },
  {
    id: "bun-bo-dong-ba", dishId: "bun-bo-hue", name: "Bún bò chợ Đông Ba", provinceSlug: "thua-thien-hue",
    address: "Chợ Đông Ba, TP. Huế", lng: 107.5876, lat: 16.4712,
    priceRange: "30-45k", openHours: "05:30–10:00",
    labels: ["street-food", "ai-pick"], atlasScore: 85,
    reasons: ["Ăn giữa chợ trăm năm — trải nghiệm trọn vẹn", "Giá bình dân, tô đầy đặn", "Kết hợp dạo chợ mua đặc sản Huế"],
  },
  // Nem lụi — Huế
  {
    id: "quan-hanh-nem-lui", dishId: "nem-lui", name: "Quán Hạnh", provinceSlug: "thua-thien-hue",
    address: "11 Phó Đức Chính, TP. Huế", lng: 107.5926, lat: 16.4589,
    priceRange: "60-120k", openHours: "10:00–21:00",
    labels: ["atlas-pick", "family"], atlasScore: 88,
    reasons: ["Set món Huế đủ vị cho người mới bắt đầu", "Nước lèo đậu phộng được khen nức tiếng", "Nhân viên hướng dẫn cách cuốn tận tình"],
  },
  // Cao lầu — Hội An
  {
    id: "cao-lau-ba-be", dishId: "cao-lau", name: "Cao lầu Bà Bé", provinceSlug: "quang-nam",
    address: "Chợ Hội An, 19 Trần Phú", lng: 108.3298, lat: 15.8772,
    priceRange: "25-40k", openHours: "10:00–18:00",
    labels: ["street-food", "local-favorite"], atlasScore: 89,
    reasons: ["Quầy nhỏ trong chợ — vị cao lầu nguyên bản", "Sợi mì lấy từ lò gia truyền mỗi sáng", "Giá địa phương thật sự"],
  },
  {
    id: "cao-lau-thanh", dishId: "cao-lau", name: "Cao lầu Thanh", provinceSlug: "quang-nam",
    address: "26 Thái Phiên, Hội An", lng: 108.3312, lat: 15.8790,
    priceRange: "30-50k", openHours: "08:00–20:00",
    labels: ["ai-pick"], atlasScore: 86,
    reasons: ["Tóp mỡ giòn tự thắng mỗi ngày", "Ít khách đoàn, không phải chờ lâu", "Gần phố cổ, tiện ghé sau khi tham quan"],
  },
  // Mì Quảng — Đà Nẵng
  {
    id: "mi-quang-ba-mua", dishId: "mi-quang", name: "Mì Quảng Bà Mua", provinceSlug: "da-nang",
    address: "19-21 Trần Bình Trọng, Đà Nẵng", lng: 108.2178, lat: 16.0665,
    priceRange: "35-60k", openHours: "06:00–21:00",
    labels: ["local-favorite", "family"], atlasScore: 88,
    reasons: ["Thương hiệu mì Quảng lâu đời của Đà Nẵng", "Đủ biến tấu: tôm thịt, gà, ếch, cá lóc", "Không gian rộng rãi cho gia đình"],
  },
  {
    id: "mi-quang-1a", dishId: "mi-quang", name: "Mì Quảng 1A", provinceSlug: "da-nang",
    address: "1A Hải Phòng, Đà Nẵng", lng: 108.2153, lat: 16.0712,
    priceRange: "30-55k", openHours: "06:30–21:00",
    labels: ["street-food", "ai-pick"], atlasScore: 85,
    reasons: ["Quán ruột của dân văn phòng Đà Nẵng", "Nước lèo sắc, đậm chuẩn xứ Quảng", "Phục vụ nhanh, hợp lịch trình dày"],
  },
  // Bánh mì
  {
    id: "banh-mi-phuong", dishId: "banh-mi", name: "Bánh mì Phượng", provinceSlug: "quang-nam",
    address: "2B Phan Châu Trinh, Hội An", lng: 108.3334, lat: 15.8785,
    priceRange: "25-45k", openHours: "06:30–21:30",
    labels: ["atlas-pick", "street-food"], atlasScore: 94,
    reasons: ["Được Anthony Bourdain gọi là 'bánh mì ngon nhất thế giới'", "Hơn 20 loại nhân, pa tê nhà làm", "Xếp hàng nhanh hơn vẻ ngoài của nó"],
  },
  {
    id: "banh-mi-huynh-hoa", dishId: "banh-mi", name: "Bánh mì Huỳnh Hoa", provinceSlug: "ho-chi-minh",
    address: "26 Lê Thị Riêng, Quận 1", lng: 106.6907, lat: 10.7714,
    priceRange: "58-68k", openHours: "06:00–22:00",
    labels: ["local-favorite"], atlasScore: 90,
    reasons: ["Ổ 'bánh mì full topping' nổi tiếng nhất Sài Gòn", "Pa tê và bơ nhà làm béo ngậy", "Mở tới khuya — cứu đói mọi khung giờ"],
  },
  // Cơm tấm — Sài Gòn
  {
    id: "com-tam-ba-ghien", dishId: "com-tam", name: "Cơm tấm Ba Ghiền", provinceSlug: "ho-chi-minh",
    address: "84 Đặng Văn Ngữ, Phú Nhuận", lng: 106.6823, lat: 10.7937,
    priceRange: "60-90k", openHours: "07:00–21:00",
    labels: ["atlas-pick", "local-favorite"], atlasScore: 91,
    reasons: ["Miếng sườn 'khổng lồ' được Michelin Bib Gourmand", "Nướng than liên tục — lúc nào cũng nóng", "Chuẩn cơm tấm Sài Gòn từ nước mắm tới mỡ hành"],
  },
  {
    id: "com-tam-phuc-loc-tho", dishId: "com-tam", name: "Cơm tấm Phúc Lộc Thọ", provinceSlug: "ho-chi-minh",
    address: "235 Nguyễn Trãi, Quận 1", lng: 106.6879, lat: 10.7663,
    priceRange: "45-75k", openHours: "06:00–22:00",
    labels: ["family", "ai-pick"], atlasScore: 84,
    reasons: ["Chuỗi sạch sẽ, ổn định — hợp gia đình có trẻ nhỏ", "Menu đa dạng ngoài sườn bì chả", "Nhiều chi nhánh, gần các điểm tham quan"],
  },
  // Bánh xèo
  {
    id: "banh-xeo-46a", dishId: "banh-xeo", name: "Bánh xèo 46A", provinceSlug: "ho-chi-minh",
    address: "46A Đinh Công Tráng, Quận 1", lng: 106.6898, lat: 10.7908,
    priceRange: "80-120k", openHours: "10:00–21:00",
    labels: ["atlas-pick", "family"], atlasScore: 87,
    reasons: ["Bánh xèo 'chảo khổng lồ' nổi tiếng với du khách quốc tế", "Vỏ giòn rụm, nhân tôm thịt đầy đặn", "Rau sống tươi đầy bàn"],
  },
  {
    id: "banh-xeo-7-toi", dishId: "banh-xeo", name: "Bánh xèo 7 Tới", provinceSlug: "can-tho",
    address: "45 Hoàng Quốc Việt, Cần Thơ", lng: 105.7710, lat: 10.0126,
    priceRange: "40-70k", openHours: "10:00–21:00",
    labels: ["local-favorite", "street-food"], atlasScore: 88,
    reasons: ["Bánh xèo miền Tây đúng điệu, to vàng nước cốt dừa", "Nhân củ hủ dừa đặc sản", "Giá miệt vườn dễ chịu"],
  },
  // Hủ tiếu
  {
    id: "hu-tieu-hong-phat", dishId: "hu-tieu", name: "Hủ tiếu Hồng Phát", provinceSlug: "ho-chi-minh",
    address: "389 Võ Văn Tần, Quận 3", lng: 106.6816, lat: 10.7728,
    priceRange: "55-85k", openHours: "06:00–13:00",
    labels: ["local-favorite"], atlasScore: 85,
    reasons: ["Hủ tiếu khô trộn xì dầu được dân sành ăn mê", "Sợi dai chuẩn, tôm thịt tươi mỗi sáng", "Bán hết là nghỉ — đi trước 11h"],
  },
  {
    id: "hu-tieu-my-tho-tuyet", dishId: "hu-tieu", name: "Hủ tiếu Mỹ Tho cô Tuyết", provinceSlug: "tien-giang",
    address: "Đường Ấp Bắc, TP. Mỹ Tho", lng: 106.3594, lat: 10.3623,
    priceRange: "30-50k", openHours: "05:30–11:00",
    labels: ["street-food", "ai-pick"], atlasScore: 84,
    reasons: ["Ăn hủ tiếu ngay tại quê hương của nó", "Sợi gạo Gò Cát dai trong đặc trưng", "Tiện ghé trên đường du lịch miền Tây"],
  },
  // Bánh căn
  {
    id: "banh-can-le", dishId: "banh-can", name: "Bánh căn Lệ", provinceSlug: "lam-dong",
    address: "27/44 Yersin, Đà Lạt", lng: 108.4419, lat: 11.9440,
    priceRange: "30-50k", openHours: "06:30–11:00, 14:00–19:00",
    labels: ["local-favorite", "street-food"], atlasScore: 87,
    reasons: ["Ngồi quanh lò than ấm giữa Đà Lạt se lạnh", "Xíu mại nước mắm chan là điểm nhấn", "Quán hẻm nhỏ đúng chất địa phương"],
  },
  {
    id: "banh-can-51", dishId: "banh-can", name: "Bánh căn 51 Tô Hiến Thành", provinceSlug: "khanh-hoa",
    address: "51 Tô Hiến Thành, Nha Trang", lng: 109.1917, lat: 12.2431,
    priceRange: "30-60k", openHours: "14:00–21:00",
    labels: ["street-food", "ai-pick"], atlasScore: 83,
    reasons: ["Bánh căn mực tươi kiểu biển Nha Trang", "Đổ tại chỗ, nóng giòn từng mẻ", "Gần biển, tiện ghé buổi chiều"],
  },
  // Cà phê sữa đá — Sài Gòn
  {
    id: "cheo-leo-cafe", dishId: "ca-phe-sua-da", name: "Cheo Leo Café", provinceSlug: "ho-chi-minh",
    address: "109/36 Nguyễn Thiện Thuật, Quận 3", lng: 106.6800, lat: 10.7702,
    priceRange: "20-35k", openHours: "05:30–18:00",
    labels: ["atlas-pick", "local-favorite"], atlasScore: 92,
    reasons: ["Quán cà phê vợt lâu đời nhất Sài Gòn (1938)", "Pha bằng siêu đất trên bếp than như 80 năm trước", "Ba thế hệ gia đình vẫn đứng quán"],
  },
  // Bún quậy — Phú Quốc
  {
    id: "bun-quay-kien-xay", dishId: "bun-quay", name: "Bún quậy Kiến Xây", provinceSlug: "kien-giang",
    address: "28 Bạch Đằng, Dương Đông, Phú Quốc", lng: 103.9598, lat: 10.2166,
    priceRange: "40-70k", openHours: "24/7",
    labels: ["local-favorite", "street-food"], atlasScore: 86,
    reasons: ["Nơi khai sinh trào lưu bún quậy Phú Quốc", "Mở xuyên đêm — cứu đói sau chuyến câu mực", "Tự pha nước chấm theo 'công thức' riêng của bạn"],
  },
];
