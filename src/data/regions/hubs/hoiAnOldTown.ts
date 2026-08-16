// Hội An hub depth, cluster 1 of 2: inside the old town (spec tasks/038-vn-hubs.md).
// The atlas had one entry for all of Hội An — "Phố cổ Hội An" — which an itinerary cannot
// break into a day. These six are what a walk through the old town actually stops at,
// including the two cafés that are destinations rather than meal stops (see the `cafe`
// DestinationType added in this batch; a Restaurant must belong to a Dish, and neither of
// these does). The villages, beaches and river live in ./hoiAnAround.ts.
//
// Coordinates from scripts/resolve-sources.mjs --candidates, cited in `sourceUrl`. Chùa Cầu
// took its coordinate from OSM rather than vi.wikipedia: the Wikipedia value sits ~900m south
// of every neighbour on the same street, which in a town you cross in fifteen minutes is the
// difference between a correct cluster and a wrong one.
import type { Destination } from "@/lib/types";

export const hoiAnOldTownDestinations: Destination[] = [
  {
    id: "japanese-covered-bridge",
    slug: "chua-cau",
    provinceSlug: "quang-nam",
    name: "Chùa Cầu",
    nameEn: "Japanese Covered Bridge",
    type: "bridge",
    lng: 108.326,
    lat: 15.8771,
    summary:
      "Cây cầu có mái do thương nhân Nhật dựng hơn bốn thế kỷ trước — biểu tượng của Hội An, in trên tờ hai mươi nghìn đồng.",
    story:
      "Chùa Cầu bắc qua một con lạch nhỏ, nối khu phố người Nhật xưa với khu phố người Hoa, và đã đứng đó từ khoảng đầu thế kỷ 17. Gọi là chùa nhưng thực ra là cầu có mái che, giữa cầu dựng một miếu nhỏ thờ Bắc Đế Trấn Vũ — vị thần trấn giữ vùng sông nước. Hai đầu cầu đặt tượng chó và tượng khỉ, theo cách hiểu phổ biến là ứng với những năm khởi công và hoàn thành. Năm 1719 chúa Nguyễn Phúc Chu đến thăm và đặt tên chữ là Lai Viễn Kiều, 'cầu đón khách phương xa', ba chữ ấy nay vẫn treo trên cửa. Cây cầu nhỏ đến bất ngờ so với danh tiếng của nó, và đó là điều khiến ai cũng nhớ.",
    facts: [
      "Cầu được thương nhân Nhật Bản dựng vào khoảng đầu thế kỷ 17.",
      "Giữa cầu có miếu thờ Bắc Đế Trấn Vũ, vị thần trấn giữ vùng sông nước.",
      "Năm 1719, chúa Nguyễn Phúc Chu đặt tên chữ cho cầu là Lai Viễn Kiều.",
      "Hình cây cầu được in trên tờ tiền polymer mệnh giá 20.000 đồng.",
    ],
    travelTips: [
      "Đến trước 7 giờ sáng nếu muốn chụp cầu mà không có người trong khung hình.",
      "Vào bên trong cầu cần vé tham quan phố cổ; đi ngang qua thì không.",
    ],
    bestTime: "Sáng sớm hoặc sau 21:00, khi phố cổ vãn khách",
    visitDuration: "30 phút",
    ticket: "Nằm trong vé tham quan phố cổ (xem mục Phố cổ Hội An)",
    openingHours: "Cả ngày; bên trong cầu mở theo giờ bán vé phố cổ",
    badges: ["unesco", "popular", "verified"],
    tags: ["bridge", "culture", "history", "architecture"],
    gallery: [
      { seed: "japanese-covered-bridge-1", caption: "Chùa Cầu soi bóng xuống lạch nước", ratio: "16/9" },
      { seed: "japanese-covered-bridge-2", caption: "Miếu thờ giữa lòng cầu", ratio: "4/3" },
    ],
    nearby: ["hoi-an-ancient-town", "tan-ky-house", "phuc-kien-assembly-hall"],
    sourceUrl: "https://www.openstreetmap.org/way/39268284",
    verifiedAt: "2026-08-16",
    featured: true,
  },
  {
    id: "tan-ky-house",
    slug: "nha-co-tan-ky",
    provinceSlug: "quang-nam",
    name: "Nhà cổ Tấn Ký",
    nameEn: "Tan Ky House",
    type: "museum",
    lng: 108.3278,
    lat: 15.8765,
    summary:
      "Ngôi nhà thương gia gần hai trăm tuổi, nơi ba lối kiến trúc Việt – Hoa – Nhật gặp nhau dưới một mái.",
    story:
      "Nhà Tấn Ký được một gia đình buôn dựng vào cuối thế kỷ 18 và vẫn do con cháu họ ở cho tới nay — bạn tham quan một ngôi nhà đang có người sống, không phải một mô hình bảo tàng. Mặt trước quay ra phố Nguyễn Thái Học để bán hàng, mặt sau mở thẳng ra bờ sông Thu Bồn để bốc dỡ hàng từ ghe, đúng cách một thương điếm thời cảng thị hoạt động. Trong nhà, cột gỗ lim kê trên đá, xà chạm theo lối Việt, mái ngói âm dương kiểu Hoa, trần vỏ cua kiểu Nhật, các câu đối khảm xà cừ. Trên bức tường sát cửa sau còn những vạch mực đánh dấu đỉnh lũ từng năm, có vạch cao quá đầu người.",
    facts: [
      "Ngôi nhà được xây vào cuối thế kỷ 18 và đã qua nhiều đời một gia đình thương nhân.",
      "Kiến trúc pha trộn ba phong cách Việt Nam, Trung Hoa và Nhật Bản.",
      "Nhà có hai mặt: mặt phố để buôn bán, mặt sau mở ra sông Thu Bồn để nhận hàng.",
      "Trên tường còn lưu các vạch đánh dấu mực nước những trận lũ lớn trong lịch sử.",
    ],
    travelTips: [
      "Đây là nhà đang có người ở — hỏi trước khi chụp ảnh vào khu vực sinh hoạt.",
      "Nhà nằm trong nhóm điểm mà vé phố cổ cho chọn; cân nhắc chọn nơi này nếu chỉ vào được một nhà cổ.",
    ],
    bestTime: "Buổi sáng, khi chưa đông đoàn khách",
    visitDuration: "30 - 45 phút",
    ticket: "Nằm trong vé tham quan phố cổ",
    openingHours: "08:00 - 17:30",
    badges: ["unesco", "verified"],
    tags: ["museum", "architecture", "history", "culture"],
    gallery: [
      { seed: "tan-ky-house-1", caption: "Gian giữa nhà cổ Tấn Ký", ratio: "16/9" },
      { seed: "tan-ky-house-2", caption: "Cột gỗ và câu đối khảm xà cừ", ratio: "4/3" },
    ],
    nearby: ["hoi-an-ancient-town", "japanese-covered-bridge", "phuc-kien-assembly-hall"],
    sourceUrl: "https://www.openstreetmap.org/way/595299310",
    verifiedAt: "2026-08-16",
  },
  {
    id: "phuc-kien-assembly-hall",
    slug: "hoi-quan-phuc-kien",
    provinceSlug: "quang-nam",
    name: "Hội quán Phúc Kiến",
    nameEn: "Fujian Assembly Hall",
    type: "temple",
    lng: 108.331,
    lat: 15.8781,
    summary:
      "Hội quán lớn nhất phố cổ, thờ Thiên Hậu — bà chúa che chở cho người đi biển.",
    story:
      "Người Hoa gốc Phúc Kiến sang buôn ở Hội An dựng nơi này vừa làm chỗ hội họp đồng hương vừa làm nơi thờ tự, và trong các hội quán còn lại của phố cổ thì đây là nơi bề thế nhất. Cổng tam quan sơn màu hồng đứng ngay mặt đường Trần Phú, qua đó là một chuỗi sân và điện thờ nối nhau, chính điện thờ Thiên Hậu Thánh Mẫu — vị thần mà thương nhân đi biển cầu khi gặp bão. Hai bên bà là Thiên Lý Nhãn và Thuận Phong Nhĩ, một vị nhìn xa nghìn dặm, một vị nghe được tiếng gió. Trên trần treo kín những vòng hương xoắn ốc cháy âm ỉ suốt ngày, khói kéo thành từng dải trong ánh sáng hắt từ giếng trời.",
    facts: [
      "Hội quán do cộng đồng người Hoa gốc Phúc Kiến lập, vừa là nơi hội họp vừa là nơi thờ tự.",
      "Chính điện thờ Thiên Hậu Thánh Mẫu, vị thần bảo hộ người đi biển.",
      "Hai bên tượng Thiên Hậu là Thiên Lý Nhãn và Thuận Phong Nhĩ.",
      "Đây là hội quán có quy mô lớn nhất trong số các hội quán còn lại ở phố cổ Hội An.",
    ],
    travelTips: [
      "Ăn mặc kín đáo và giữ trật tự — đây vẫn là nơi thờ tự đang hoạt động.",
      "Khói hương trong chính điện khá dày; ai nhạy cảm với khói nên đứng gần giếng trời.",
    ],
    bestTime: "Buổi sáng; đông nhất vào rằm và mùng một âm lịch",
    visitDuration: "30 - 45 phút",
    ticket: "Nằm trong vé tham quan phố cổ",
    openingHours: "07:00 - 17:30",
    badges: ["unesco", "verified"],
    tags: ["temple", "culture", "history", "architecture"],
    gallery: [
      { seed: "phuc-kien-assembly-hall-1", caption: "Cổng tam quan hội quán Phúc Kiến", ratio: "4/3" },
      { seed: "phuc-kien-assembly-hall-2", caption: "Vòng hương treo kín trần chính điện", ratio: "16/9" },
    ],
    nearby: ["hoi-an-ancient-town", "japanese-covered-bridge", "tan-ky-house"],
    sourceUrl: "https://www.openstreetmap.org/way/320722329",
    verifiedAt: "2026-08-16",
  },
  {
    id: "hoi-an-night-market",
    slug: "cho-dem-hoi-an",
    provinceSlug: "quang-nam",
    name: "Chợ đêm Hội An",
    nameEn: "Hoi An Night Market",
    type: "nightlife",
    lng: 108.3259,
    lat: 15.8758,
    summary:
      "Con phố đèn lồng bên kia cầu An Hội, nơi cả Hội An sáng lên sau khi trời tắt nắng.",
    story:
      "Qua cầu An Hội sang cù lao là tới con phố mà mọi tấm ảnh Hội An đều chụp: hai bên đường treo kín đèn lồng lụa đủ màu, hàng trăm chiếc, sáng từ chập tối tới khuya. Chợ bán đèn lồng gấp gọn được để mang về, đồ thủ công, quần áo, và một dãy hàng ăn vặt — cao lầu, bánh vạc, chè bắp, nước mót. Dưới sông, thuyền chở khách thả hoa đăng trôi lập lờ, đèn nến in xuống mặt nước thành từng vệt. Chợ đông và ồn, khác hẳn sự tĩnh lặng của phố cổ bên kia sông, nhưng đúng vào những tối rằm khi cả phố tắt điện chỉ thắp lồng đèn thì hai bờ hoà làm một.",
    facts: [
      "Chợ nằm trên cù lao An Hội, qua cầu từ khu phố cổ.",
      "Đặc trưng của chợ là hàng trăm chiếc đèn lồng lụa treo dọc hai bên đường.",
      "Chợ bán đèn lồng, đồ thủ công và các món ăn vặt đặc trưng Hội An.",
      "Vào đêm rằm âm lịch, phố cổ tắt đèn điện và chỉ thắp đèn lồng.",
    ],
    travelTips: [
      "Đèn lồng loại gấp gọn dễ mang về hơn nhiều so với loại khung cứng.",
      "Nếu đi thuyền thả hoa đăng, chốt giá cho cả thuyền trước khi xuống.",
    ],
    bestTime: "Tối, đẹp nhất vào đêm rằm âm lịch",
    visitDuration: "1,5 - 2 giờ",
    ticket: "",
    openingHours: "Khoảng 17:00 - 23:00",
    badges: ["popular", "verified"],
    tags: ["nightlife", "market", "shopping", "photography"],
    gallery: [
      { seed: "hoi-an-night-market-1", caption: "Phố đèn lồng bên cù lao An Hội", ratio: "16/9" },
      { seed: "hoi-an-night-market-2", caption: "Hoa đăng trôi trên sông Hoài", ratio: "4/3" },
    ],
    nearby: ["hoi-an-ancient-town", "japanese-covered-bridge", "faifo-coffee"],
    sourceUrl: "https://www.openstreetmap.org/node/6099308589",
    verifiedAt: "2026-08-16",
  },
  {
    id: "faifo-coffee",
    slug: "faifo-coffee",
    provinceSlug: "quang-nam",
    name: "Faifo Coffee",
    nameEn: "Faifo Coffee",
    type: "cafe",
    lng: 108.3281,
    lat: 15.8772,
    summary:
      "Quán cà phê có sân thượng nhìn xuống biển mái ngói phố cổ — góc nhìn Hội An từ trên cao.",
    story:
      "Ở dưới đường, Hội An là những bức tường vàng và dòng người. Lên tới sân thượng quán này, nó thành một thứ khác hẳn: mái ngói cũ trải ra tới tận chân trời, lớp nọ gối lên lớp kia, rêu và cỏ mọc trên sống mái, thỉnh thoảng nhô lên một cây cau hay một mái hội quán. Đây là một trong số rất ít chỗ trong khu phố cổ mở được tầm nhìn từ trên xuống, nên buổi chiều muộn sân thượng thường kín chỗ. Cái tên Faifo là tên mà thương nhân phương Tây thế kỷ 17 dùng để gọi cảng thị này, trước khi Hội An trở thành Hội An trên bản đồ.",
    facts: [
      "Quán nằm trong khu phố cổ, trên trục đường Trần Phú.",
      "Sân thượng là một trong số ít điểm nhìn từ trên cao xuống mái ngói phố cổ.",
      "'Faifo' là tên gọi Hội An mà thương nhân phương Tây dùng từ thế kỷ 17.",
      "Quán phục vụ cà phê Việt Nam cùng các loại đồ uống lạnh.",
    ],
    travelTips: [
      "Lên sân thượng trước 16:30 nếu muốn có chỗ ngồi sát lan can vào giờ hoàng hôn.",
      "Quán thường yêu cầu gọi đồ uống mới được lên sân thượng — đây không phải đài quan sát công cộng.",
    ],
    bestTime: "Chiều muộn, khoảng một giờ trước hoàng hôn",
    visitDuration: "1 giờ",
    ticket: "",
    openingHours: "Theo giờ mở cửa của quán, thường từ sáng tới tối",
    badges: ["verified"],
    tags: ["cafe", "viewpoint", "photography", "sunset"],
    gallery: [
      { seed: "faifo-coffee-1", caption: "Mái ngói phố cổ nhìn từ sân thượng", ratio: "16/9" },
      { seed: "faifo-coffee-2", caption: "Cà phê bên lan can nhìn xuống phố", ratio: "4/3" },
    ],
    nearby: ["hoi-an-ancient-town", "japanese-covered-bridge", "reaching-out-teahouse"],
    sourceUrl: "https://www.openstreetmap.org/node/4889357333",
    verifiedAt: "2026-08-16",
  },
  {
    id: "reaching-out-teahouse",
    slug: "reaching-out-teahouse",
    provinceSlug: "quang-nam",
    name: "Reaching Out Teahouse",
    nameEn: "Reaching Out Teahouse",
    type: "cafe",
    lng: 108.3272,
    lat: 15.877,
    summary:
      "Quán trà im lặng do người khiếm thính phục vụ — gọi đồ bằng khối gỗ khắc chữ, không nói một lời.",
    story:
      "Bước vào đây, việc đầu tiên bạn nhận ra là âm thanh biến mất. Quán do nhân viên khiếm thính phục vụ và cả không gian được thiết kế quanh sự im lặng đó: trên bàn có một khay khối gỗ khắc chữ — 'thêm nước nóng', 'tính tiền', 'cảm ơn' — bạn đẩy khối gỗ tương ứng ra thay cho lời gọi. Trà và cà phê được bày trên khay gỗ với đồng hồ cát đo đúng thời gian hãm. Quán thuộc một doanh nghiệp xã hội hoạt động ở Hội An từ đầu những năm 2000, tạo việc làm cho người khuyết tật, và có một xưởng thủ công riêng ở gần đó. Giữa một phố cổ ồn ào bậc nhất Việt Nam, hai mươi phút ngồi im ở đây là một trải nghiệm khó quên.",
    facts: [
      "Quán do nhân viên khiếm thính phục vụ; khách gọi đồ bằng các khối gỗ khắc chữ đặt sẵn trên bàn.",
      "Không gian quán được giữ im lặng như một phần của trải nghiệm.",
      "Quán thuộc một doanh nghiệp xã hội tạo việc làm cho người khuyết tật, hoạt động tại Hội An từ đầu những năm 2000.",
      "Trà được phục vụ kèm đồng hồ cát để canh đúng thời gian hãm.",
    ],
    travelTips: [
      "Giữ yên lặng và tắt chuông điện thoại — đó là quy ước của quán, không phải gợi ý.",
      "Xưởng thủ công của cùng tổ chức ở gần đó bán đồ do chính nhân viên khuyết tật làm.",
    ],
    bestTime: "Quanh năm; giữa buổi sáng hoặc đầu giờ chiều là lúc yên nhất",
    visitDuration: "45 phút - 1 giờ",
    ticket: "",
    openingHours: "Theo giờ mở cửa của quán, thường từ sáng tới tối",
    badges: ["verified", "hidden-gem"],
    tags: ["cafe", "culture", "shopping"],
    gallery: [
      { seed: "reaching-out-teahouse-1", caption: "Khay khối gỗ khắc chữ dùng để gọi đồ", ratio: "4/3" },
      { seed: "reaching-out-teahouse-2", caption: "Bộ trà và đồng hồ cát trên khay gỗ", ratio: "16/9" },
    ],
    nearby: ["hoi-an-ancient-town", "faifo-coffee", "tan-ky-house"],
    sourceUrl: "https://www.openstreetmap.org/way/632030501",
    verifiedAt: "2026-08-16",
  },
];
