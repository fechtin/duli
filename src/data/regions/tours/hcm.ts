// TP. Hồ Chí Minh — tour stops the 038 hub pass missed (tasks/039).
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`.
import type { Destination } from "@/lib/types";

export const hcmTourDestinations: Destination[] = [
  {
    id: "nguyen-van-binh-book-street",
    slug: "duong-sach-nguyen-van-binh",
    provinceSlug: "ho-chi-minh",
    name: "Đường sách Nguyễn Văn Bình",
    nameEn: "Nguyen Van Binh Book Street",
    type: "street",
    lng: 106.6997,
    lat: 10.7806,
    summary: "Con đường một trăm mét cạnh Nhà thờ Đức Bà, hai bên là ki-ốt sách dưới tán me.",
    story:
      "Đường sách mở đầu năm 2016 trên một đoạn phố ngắn nối Nhà thờ Đức Bà với Bưu điện Thành phố — trước đó chỉ là chỗ đỗ xe. Thành phố cấm xe, dựng hai dãy ki-ốt gỗ kính cho các nhà xuất bản, xen vào đó vài quán cà phê, rồi để nguyên hàng me cổ thụ che kín trên đầu. Kết quả là một trong số ít khoảng dừng chân có bóng mát ở trung tâm quận 1, và cũng là nơi hiếm hoi trong thành phố mà người ta ngồi đọc thay vì đi ngang. Cuối tuần đường sách có phiên sách cũ, ra mắt sách và ký tặng; ngày thường thì vắng và mát, hợp để nghỉ chân giữa hai điểm tham quan ngay bên cạnh.",
    facts: [
      "Đường sách khai trương tháng 1 năm 2016, trên đoạn phố dài khoảng 100 mét.",
      "Phố cấm xe hoàn toàn, hai bên là các ki-ốt của nhà xuất bản và quán cà phê.",
      "Hàng me cổ thụ giữ nguyên, tạo bóng mát gần như kín mặt đường.",
      "Nằm giữa Nhà thờ Đức Bà và Bưu điện Trung tâm, cách mỗi nơi vài chục mét.",
    ],
    travelTips: [
      "Ghé xen giữa Nhà thờ Đức Bà và Bưu điện — cả ba nằm trên cùng một đoạn đi bộ.",
      "Cuối tuần đông và có sự kiện; ngày thường mới đúng là chỗ ngồi đọc.",
    ],
    bestTime: "Sáng sớm hoặc chiều muộn, khi nắng đã xiên qua tán me",
    visitDuration: "45 phút",
    ticket: "Miễn phí",
    openingHours: "08:00 - 22:00",
    badges: ["verified"],
    tags: ["culture", "city", "photography"],
    gallery: [
      { seed: "nguyen-van-binh-book-street-1", caption: "Dãy ki-ốt sách dưới tán me", ratio: "16/9" },
      { seed: "nguyen-van-binh-book-street-2", caption: "Quán cà phê giữa đường sách", ratio: "4/3" },
    ],
    nearby: ["notre-dame-saigon", "saigon-central-post-office", "independence-palace"],
    sourceUrl: "https://www.openstreetmap.org/node/11708010270",
    verifiedAt: "2026-08-16",
  },
  {
    id: "turtle-lake-hcm",
    slug: "ho-con-rua",
    provinceSlug: "ho-chi-minh",
    name: "Hồ Con Rùa",
    nameEn: "Turtle Lake",
    type: "city",
    lng: 106.6958,
    lat: 10.7828,
    summary: "Vòng xoay có hồ nước và tháp bê tông hình cánh sen, tối đến thành chỗ ngồi ăn vặt.",
    story:
      "Tên chính thức của nơi này là Công trường Quốc tế, nhưng không ai gọi thế. Công trình xây trong khoảng 1965–1967: một hồ nước hình bát giác giữa vòng xoay, ở giữa là khối bê tông vươn lên xoè ra như cánh hoa, dưới chân từng có tượng một con rùa lớn đội bia. Con rùa bị phá trong một vụ nổ năm 1978 và không bao giờ được dựng lại — nhưng cái tên dân gian thì ở lại, nên bây giờ Hồ Con Rùa là một nơi mang tên thứ không còn ở đó. Ban ngày nó chỉ là vòng xoay; từ chập tối trở đi, bậc thềm quanh hồ kín người ngồi, xe đẩy bánh tráng nướng và các quán ốc quanh đó mở tới khuya.",
    facts: [
      "Tên hành chính là Công trường Quốc tế; 'Hồ Con Rùa' là tên dân gian.",
      "Công trình hoàn thành trong khoảng năm 1965 đến 1967.",
      "Tượng rùa đội bia dưới chân tháp bị phá trong một vụ nổ năm 1978 và không được dựng lại.",
      "Từ chiều tối, bậc thềm quanh hồ trở thành nơi tụ tập ăn vặt của sinh viên quanh vùng.",
    ],
    travelTips: [
      "Đến sau 19:00 mới đúng lúc — ban ngày đây chỉ là một vòng xoay giao thông.",
      "Quanh hồ là khu nhiều trường đại học, nên giá quà vặt ở đây rẻ hơn khu trung tâm.",
    ],
    bestTime: "Buổi tối, khi các hàng ăn vặt bày ra quanh hồ",
    visitDuration: "45 phút",
    ticket: "Miễn phí",
    openingHours: "Cả ngày",
    badges: ["verified"],
    tags: ["city", "food", "nightlife"],
    gallery: [
      { seed: "turtle-lake-hcm-1", caption: "Tháp bê tông hình cánh sen giữa hồ", ratio: "16/9" },
      { seed: "turtle-lake-hcm-2", caption: "Bậc thềm quanh hồ lúc chập tối", ratio: "4/3" },
    ],
    nearby: ["notre-dame-saigon", "independence-palace", "nguyen-hue-walking-street"],
    sourceUrl: "https://vi.wikipedia.org/wiki/H%E1%BB%93_Con_R%C3%B9a",
    verifiedAt: "2026-08-16",
  },
];
