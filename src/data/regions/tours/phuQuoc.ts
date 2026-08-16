// Phú Quốc — tour stops the 038 hub pass missed (tasks/039).
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`. Note the
// province centroid is on the mainland, so every Phú Quốc row sits ~110-135 km from it; the
// sanity check for these was distance from `phu-quoc-island`, not from the centroid.
import type { Destination } from "@/lib/types";

export const phuQuocTourDestinations: Destination[] = [
  {
    id: "bai-dai-phu-quoc",
    slug: "bai-dai-phu-quoc",
    provinceSlug: "kien-giang",
    name: "Bãi Dài",
    nameEn: "Long Beach",
    type: "beach",
    lng: 103.8491,
    lat: 10.3359,
    summary: "Dải cát dài ở bờ tây bắc đảo, quay mặt về hướng tây nên đón trọn hoàng hôn.",
    story:
      "Bãi Dài chạy dọc bờ tây bắc Phú Quốc, và đúng như tên gọi, nó dài — dài đến mức đi bộ hết một đầu sang đầu kia là chuyện của cả buổi. Cát ở đây vàng và thoải, nước nông ra khá xa, nên đây là bãi dễ tắm hơn hẳn phía nam đảo. Vì quay mặt về hướng tây, chiều nào trời quang cũng có hoàng hôn rơi thẳng xuống biển — thứ mà bờ đông của đảo không bao giờ có. Hai chục năm trước đây còn là bãi hoang; giờ phần lớn chiều dài đã thuộc về các khu nghỉ dưỡng lớn, nhưng vẫn còn những đoạn lối xuống công cộng, và đó là chỗ nên tìm.",
    facts: [
      "Bãi nằm ở bờ tây bắc đảo Phú Quốc, thuộc xã Gành Dầu và Cửa Cạn.",
      "Bãi quay mặt hướng tây, nên là một trong những nơi ngắm hoàng hôn rõ nhất trên đảo.",
      "Nước nông và thoải dần, dễ tắm hơn các bãi phía nam đảo.",
      "Phần lớn chiều dài bãi hiện nằm trong các khu nghỉ dưỡng, xen kẽ vài lối xuống công cộng.",
    ],
    travelTips: [
      "Tìm các lối xuống công cộng nếu không ở resort — không phải đoạn nào cũng vào được.",
      "Đi cuối chiều: đây là bãi để xem hoàng hôn chứ không phải bãi để tắm giữa trưa.",
    ],
    bestTime: "Cuối chiều mùa khô, từ tháng 11 đến tháng 4",
    visitDuration: "2 giờ",
    ticket: "Miễn phí",
    openingHours: "Cả ngày",
    badges: ["verified"],
    tags: ["beach", "nature", "photography"],
    gallery: [
      { seed: "bai-dai-phu-quoc-1", caption: "Hoàng hôn rơi xuống biển ở bờ tây", ratio: "16/9" },
      { seed: "bai-dai-phu-quoc-2", caption: "Dải cát thoải chạy dài về phía bắc", ratio: "4/3" },
    ],
    nearby: ["phu-quoc-island", "ganh-dau-cape", "vinwonders-phu-quoc"],
    sourceUrl: "https://www.openstreetmap.org/way/451452488",
    verifiedAt: "2026-08-16",
  },
  {
    id: "grand-world-phu-quoc",
    slug: "grand-world-phu-quoc",
    provinceSlug: "kien-giang",
    name: "Grand World Phú Quốc",
    nameEn: "Grand World Phu Quoc",
    type: "themepark",
    lng: 103.8581,
    lat: 10.3256,
    summary: "Khu phức hợp giải trí ở Gành Dầu với kênh đào kiểu Venice và mái vòm tre Nón Lá.",
    story:
      "Grand World mở năm 2021 ở phía bắc đảo, và là kiểu điểm đến chia rẽ người xem: hoặc thấy nó vui, hoặc thấy nó giả. Trung tâm khu là một con kênh đào có thuyền gondola chèo qua những dãy nhà sơn màu phỏng theo Venice. Thứ đáng xem hơn cả lại là công trình ít bị chú ý nhất — mái vòm Nón Lá, một kết cấu tre khổng lồ do kiến trúc sư Võ Trọng Nghĩa thiết kế, dùng đúng kỹ thuật tre mà ông theo đuổi nhiều năm. Buổi tối có show diễn ngoài trời Tinh Hoa Việt Nam trên mặt nước. Cả khu vào cửa tự do, chỉ trả tiền cho từng dịch vụ bên trong.",
    facts: [
      "Khu phức hợp khai trương năm 2021, thuộc xã Gành Dầu phía bắc đảo Phú Quốc.",
      "Kênh đào trung tâm có thuyền gondola, mô phỏng theo hình ảnh Venice.",
      "Mái vòm Nón Lá là kết cấu tre do kiến trúc sư Võ Trọng Nghĩa thiết kế.",
      "Show diễn ngoài trời Tinh Hoa Việt Nam biểu diễn trên mặt nước vào buổi tối.",
    ],
    travelTips: [
      "Vào cửa khu không mất phí; các dịch vụ và show bên trong tính tiền riêng.",
      "Đi từ chiều muộn để xem được cả khu lúc lên đèn lẫn show buổi tối.",
    ],
    bestTime: "Chiều muộn tới tối, khi cả khu lên đèn",
    visitDuration: "3 giờ",
    ticket: "Miễn phí vào khu; show và dịch vụ tính riêng",
    openingHours: "09:00 - 23:00",
    badges: ["verified"],
    tags: ["family", "nightlife", "architecture", "photography"],
    gallery: [
      { seed: "grand-world-phu-quoc-1", caption: "Kênh đào và thuyền gondola lúc lên đèn", ratio: "16/9" },
      { seed: "grand-world-phu-quoc-2", caption: "Mái vòm tre Nón Lá", ratio: "4/3" },
    ],
    nearby: ["vinwonders-phu-quoc", "bai-dai-phu-quoc", "ganh-dau-cape"],
    sourceUrl: "https://en.wikipedia.org/wiki/Grand_World_Ph%C3%BA_Qu%E1%BB%91c",
    verifiedAt: "2026-08-16",
  },
  {
    id: "ho-quoc-pagoda",
    slug: "thien-vien-truc-lam-ho-quoc",
    provinceSlug: "kien-giang",
    name: "Thiền viện Trúc Lâm Hộ Quốc",
    nameEn: "Ho Quoc Pagoda",
    type: "temple",
    lng: 104.0275,
    lat: 10.1092,
    summary: "Ngôi chùa lớn nhất đảo, lưng tựa núi và mặt quay thẳng ra biển đông Phú Quốc.",
    story:
      "Chùa Hộ Quốc dựng trong khoảng 2011–2012 ở xã Dương Tơ, bờ đông đảo, và điều làm nên nó là thế đất chứ không phải tuổi: lưng dựa vào dãy núi Hàm Ninh, mặt quay thẳng ra biển, nên từ sân chùa nhìn ra chỉ có nước và trời. Kiến trúc theo lối thiền viện Trúc Lâm — dòng thiền do vua Trần Nhân Tông lập từ thế kỷ 13 — với cột gỗ lim và mái ngói, dựng theo bậc thang men theo sườn dốc. Vì mới nên chùa không có cái cũ kỹ của các chùa cổ; thứ người ta tới tìm là khoảng sân trên cao vào lúc sáng sớm, khi mặt trời lên từ phía biển ngay trước mặt.",
    facts: [
      "Chùa được xây trong khoảng năm 2011 đến 2012 tại xã Dương Tơ, bờ đông đảo Phú Quốc.",
      "Đây là công trình tôn giáo lớn nhất trên đảo.",
      "Chùa theo lối thiền viện Trúc Lâm, dòng thiền do vua Trần Nhân Tông lập ở thế kỷ 13.",
      "Chùa dựng theo bậc thang men sườn núi Hàm Ninh, mặt hướng thẳng ra biển.",
    ],
    travelTips: [
      "Đi sáng sớm để đón mặt trời lên từ biển — đó là lý do chính người ta tới đây.",
      "Mặc kín đáo; đây là nơi thờ tự đang hoạt động chứ không phải điểm chụp ảnh.",
    ],
    bestTime: "Sáng sớm, lúc mặt trời mọc trên biển",
    visitDuration: "1 giờ",
    ticket: "Miễn phí",
    openingHours: "06:00 - 18:00",
    badges: ["verified"],
    tags: ["temple", "culture", "photography"],
    gallery: [
      { seed: "ho-quoc-pagoda-1", caption: "Sân chùa trên cao nhìn thẳng ra biển", ratio: "16/9" },
      { seed: "ho-quoc-pagoda-2", caption: "Bậc thang và cột gỗ lim dẫn lên chánh điện", ratio: "4/3" },
    ],
    nearby: ["bai-sao-beach", "ham-ninh-fishing-village", "phu-quoc-island"],
    sourceUrl: "https://www.openstreetmap.org/way/1489845999",
    verifiedAt: "2026-08-16",
  },
];
