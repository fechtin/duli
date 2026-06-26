import type { ProvinceContent } from "@/lib/types";
import { northMountainsProvinces } from "./regions/northMountains.ts";
import { redRiverDeltaProvinces } from "./regions/redRiverDelta.ts";
import { northCentralProvinces } from "./regions/northCentral.ts";
import { southCentralHighlandsProvinces } from "./regions/southCentralHighlands.ts";
import { southeastProvinces } from "./regions/southeast.ts";
import { mekongProvinces } from "./regions/mekong.ts";

// Province-level editorial content. destinationIds are derived at runtime from the
// destinations dataset, so they are omitted here.
type ProvinceEditorial = Omit<ProvinceContent, "destinationIds">;

export const provinceContent: Record<string, ProvinceEditorial> = {
  ...northMountainsProvinces,
  ...redRiverDeltaProvinces,
  ...northCentralProvinces,
  ...southCentralHighlandsProvinces,
  ...southeastProvinces,
  ...mekongProvinces,
  "ha-giang": {
    slug: "ha-giang",
    summary: "Vùng địa đầu Tổ quốc với cao nguyên đá hùng vĩ, những cung đèo huyền thoại và sắc màu văn hóa vùng cao.",
    story:
      "Hà Giang là nơi đất trời gặp nhau ở tận cùng phía Bắc. Cao nguyên đá Đồng Văn — công viên địa chất toàn cầu — trải dài những dãy núi tai mèo trùng điệp. Mùa thu, hoa tam giác mạch phủ hồng các triền đồi; mùa lúa chín, ruộng bậc thang vàng rực. Đây là vùng đất của những con đường đẹp đến nghẹt thở và những con người mộc mạc, hiếu khách.",
    bestTime: "Tháng 9 (lúa chín) và tháng 10–12 (hoa tam giác mạch)",
    specialties: ["Thắng cố", "Cháo ấu tẩu", "Rượu ngô", "Bánh tam giác mạch"],
  },
  "lao-cai": {
    slug: "lao-cai",
    summary: "Quê hương của Sa Pa mờ sương và đỉnh Fansipan — nóc nhà Đông Dương.",
    story:
      "Lào Cai là vùng núi non hùng vĩ nơi Tây Bắc, nổi danh với thị trấn Sa Pa trong mây và những thửa ruộng bậc thang được xem là đẹp bậc nhất thế giới. Văn hóa của người Mông, Dao, Tày tạo nên bức tranh đa sắc, ấm áp giữa đại ngàn Hoàng Liên Sơn.",
    bestTime: "Tháng 9 (lúa chín) và tháng 3–5 (trời trong)",
    specialties: ["Thắng cố", "Cá hồi Sa Pa", "Đồ nướng", "Rượu táo mèo"],
  },
  "quang-ninh": {
    slug: "quang-ninh",
    summary: "Nơi có kỳ quan thiên nhiên thế giới Vịnh Hạ Long và những bãi biển, hải đảo tuyệt đẹp.",
    story:
      "Quảng Ninh là vùng đất của biển và đảo. Vịnh Hạ Long với hàng nghìn hòn đảo đá vôi là niềm tự hào của cả Việt Nam. Bên cạnh đó là Bái Tử Long hoang sơ, đảo Cô Tô cát trắng và nền văn hóa vùng mỏ giàu bản sắc.",
    bestTime: "Tháng 10–12, biển êm và trời trong",
    specialties: ["Chả mực Hạ Long", "Sá sùng", "Ngán", "Bánh gật gù"],
  },
  "ninh-binh": {
    slug: "ninh-binh",
    summary: "‘Hạ Long trên cạn’ với non nước hữu tình, cố đô Hoa Lư và những hang động kỳ vĩ.",
    story:
      "Ninh Bình mê hoặc bằng vẻ đẹp của núi đá vôi soi bóng xuống những dòng sông lặng lờ. Tràng An, Tam Cốc, Hang Múa là những bức tranh thủy mặc sống động. Đây từng là kinh đô đầu tiên của nước Đại Cồ Việt, mang trong mình bề dày lịch sử ngàn năm.",
    bestTime: "Tháng 1–3 và mùa lúa chín tháng 5–6",
    specialties: ["Thịt dê núi", "Cơm cháy", "Ốc núi", "Rượu Kim Sơn"],
  },
  "ha-noi": {
    slug: "ha-noi",
    summary: "Thủ đô ngàn năm văn hiến, nơi giao thoa giữa nét cổ kính và nhịp sống hiện đại.",
    story:
      "Hà Nội là nơi thời gian như chậm lại. Phố cổ rêu phong, hồ Hoàn Kiếm thơ mộng, những hàng cây cổ thụ và mùi hương hoa sữa mỗi độ thu về. Ẩm thực Hà Nội tinh tế với phở, bún chả, cà phê trứng. Mỗi góc phố đều có một câu chuyện đáng để lắng nghe.",
    bestTime: "Mùa thu (tháng 9–11), tiết trời mát dịu",
    specialties: ["Phở", "Bún chả", "Cà phê trứng", "Bánh cuốn", "Chả cá Lã Vọng"],
  },
  "thua-thien-hue": {
    slug: "thua-thien-hue",
    summary: "Cố đô trầm mặc bên dòng sông Hương, nơi lưu giữ di sản cung đình và ẩm thực tinh tế.",
    story:
      "Huế mang vẻ đẹp cổ kính, hoài niệm. Quần thể di tích triều Nguyễn, lăng tẩm uy nghiêm, chùa Thiên Mụ soi bóng sông Hương. Người Huế nhẹ nhàng, giọng nói ngọt ngào, và ẩm thực cung đình cầu kỳ đến từng chi tiết. Đến Huế là để sống chậm và lắng nghe.",
    bestTime: "Tháng 1–4, tránh mùa mưa cuối năm",
    specialties: ["Bún bò Huế", "Cơm hến", "Bánh bèo, nậm, lọc", "Chè Huế"],
  },
  "da-nang": {
    slug: "da-nang",
    summary: "Thành phố biển đáng sống với bãi Mỹ Khê, bán đảo Sơn Trà và Bà Nà Hills trên mây.",
    story:
      "Đà Nẵng năng động và hiện đại, nhưng vẫn giữ được sự thư thái của một thành phố biển. Bãi biển Mỹ Khê trải dài cát trắng, cầu Rồng phun lửa cuối tuần, và Bà Nà Hills với Cầu Vàng nổi tiếng thế giới. Đây là điểm trung chuyển lý tưởng để khám phá miền Trung.",
    bestTime: "Tháng 3–8, biển đẹp và ít mưa",
    specialties: ["Mì Quảng", "Bánh tráng cuốn thịt heo", "Bún chả cá", "Hải sản"],
  },
  "quang-nam": {
    slug: "quang-nam",
    summary: "Vùng đất di sản với phố cổ Hội An và thánh địa Mỹ Sơn, đậm đà văn hóa và ẩm thực.",
    story:
      "Quảng Nam là nơi hội tụ hai di sản văn hóa thế giới: phố cổ Hội An lung linh đèn lồng và thánh địa Mỹ Sơn của vương quốc Chăm Pa cổ. Những làng nghề, bãi biển An Bàng và đồng quê yên ả tạo nên một Quảng Nam vừa cổ kính vừa thanh bình.",
    bestTime: "Tháng 2–4, khô ráo dễ chịu",
    specialties: ["Cao lầu", "Mì Quảng", "Bánh mì Hội An", "Cơm gà"],
  },
  "lam-dong": {
    slug: "lam-dong",
    summary: "Cao nguyên Đà Lạt ngàn hoa trong sương, lãng mạn với rừng thông và khí hậu mát quanh năm.",
    story:
      "Lâm Đồng là xứ sở của Đà Lạt mộng mơ — thành phố ngàn hoa, ngàn thông trên cao nguyên Lang Biang. Khí hậu mát mẻ quanh năm, những đồi chè, vườn dâu, thác nước và hồ trong xanh khiến nơi đây trở thành điểm hẹn của những tâm hồn yêu sự lãng mạn và bình yên.",
    bestTime: "Quanh năm; đẹp nhất tháng 10–12 mùa dã quỳ",
    specialties: ["Bánh tráng nướng", "Lẩu gà lá é", "Dâu tây", "Cà phê", "Atisô"],
  },
  "ho-chi-minh": {
    slug: "ho-chi-minh",
    summary: "Đầu tàu kinh tế sôi động, hào sảng và không bao giờ ngủ — nơi cũ và mới đan xen.",
    story:
      "Sài Gòn — TP. Hồ Chí Minh là thành phố của năng lượng. Từ những tòa nhà chọc trời đến con hẻm nhỏ thơm mùi cà phê, từ chợ Bến Thành nhộn nhịp đến những quán ăn vỉa hè hấp dẫn. Người Sài Gòn phóng khoáng, hiếu khách. Đây là nơi mọi ước mơ đều có chỗ đứng.",
    bestTime: "Mùa khô tháng 12–4",
    specialties: ["Cơm tấm", "Hủ tiếu", "Bánh mì", "Phá lấu", "Cà phê sữa đá"],
  },
  "quang-binh": {
    slug: "quang-binh",
    summary: "Vương quốc hang động của thế giới với Phong Nha - Kẻ Bàng và hang Sơn Đoòng kỳ vĩ.",
    story:
      "Quảng Bình là miền đất của những kỳ quan dưới lòng đất. Vườn quốc gia Phong Nha - Kẻ Bàng ẩn giấu hàng trăm hang động đá vôi tráng lệ, trong đó Sơn Đoòng là hang lớn nhất hành tinh. Bên cạnh đó là bãi biển Nhật Lệ cát trắng, sông Son trong xanh và những làng quê yên bình. Vùng đất khắc nghiệt nắng gió này đã sản sinh ra nhiều con người kiên cường, hiếu khách.",
    bestTime: "Tháng 2–8, mùa khô ráo",
    specialties: ["Cháo canh", "Bánh bột lọc", "Khoai deo", "Hải sản Nhật Lệ"],
  },
  "khanh-hoa": {
    slug: "khanh-hoa",
    summary: "Thiên đường biển đảo miền Trung với vịnh Nha Trang trong xanh và những rạn san hô rực rỡ.",
    story:
      "Khánh Hòa được thiên nhiên ưu ái ban tặng đường bờ biển dài tuyệt đẹp cùng vịnh Nha Trang thuộc hàng đẹp nhất thế giới. Làn nước xanh ngọc, bãi cát trắng mịn, những hòn đảo hoang sơ và rạn san hô đa sắc là thiên đường nghỉ dưỡng và lặn biển. Bên cạnh đó, Khánh Hòa còn có tháp Bà Ponagar cổ kính, suối khoáng nóng và nền ẩm thực hải sản phong phú.",
    bestTime: "Tháng 3–9, biển êm và nắng đẹp",
    specialties: ["Bún cá", "Bún sứa", "Nem nướng Ninh Hòa", "Yến sào", "Hải sản"],
  },
  "kien-giang": {
    slug: "kien-giang",
    summary: "Vùng biển đảo Tây Nam với đảo Ngọc Phú Quốc, quần đảo Nam Du và những bãi biển hoang sơ.",
    story:
      "Kiên Giang là tỉnh có biển đảo trù phú nhất miền Tây Nam Bộ. Nổi bật là đảo Phú Quốc — hòn đảo lớn nhất Việt Nam với bãi biển tuyệt đẹp, rừng nguyên sinh và nước mắm trứ danh. Ngoài ra còn có quần đảo Nam Du hoang sơ, Hà Tiên thơ mộng với 'Hà Tiên thập cảnh'. Vùng đất này hội tụ vẻ đẹp biển trời cùng nền văn hóa giao thoa Kinh - Khmer - Hoa độc đáo.",
    bestTime: "Tháng 11–4, mùa khô biển đẹp",
    specialties: ["Nước mắm Phú Quốc", "Hồ tiêu", "Bún cá Kiên Giang", "Hải sản", "Gỏi cá trích"],
  },
  "an-giang": {
    slug: "an-giang",
    summary: "Miền đất Bảy Núi linh thiêng với rừng tràm Trà Sư, miếu Bà Chúa Xứ và mùa nước nổi trù phú.",
    story:
      "An Giang là vùng đất đầu nguồn sông Cửu Long, nơi có vùng Bảy Núi (Thất Sơn) huyền bí và những cánh đồng lúa bát ngát. Rừng tràm Trà Sư xanh mướt mùa nước nổi, miếu Bà Chúa Xứ Núi Sam linh thiêng thu hút hàng triệu khách hành hương. Đây cũng là nơi giao thoa văn hóa của người Kinh, Khmer, Chăm và Hoa, tạo nên bản sắc đa dạng và những lễ hội đặc sắc.",
    bestTime: "Tháng 9–11, mùa nước nổi",
    specialties: ["Bún cá Châu Đốc", "Mắm Châu Đốc", "Bò bảy món Núi Sam", "Đường thốt nốt", "Bánh bò thốt nốt"],
  },
  "dak-lak": {
    slug: "dak-lak",
    summary: "Thủ phủ cà phê Tây Nguyên với những buôn làng, thác nước hùng vĩ và văn hóa cồng chiêng.",
    story:
      "Đắk Lắk là trái tim của vùng đất đỏ bazan Tây Nguyên, thủ phủ cà phê của Việt Nam. Những đồi cà phê bạt ngàn, thác nước Dray Nur, Dray Sáp hùng vĩ, buôn làng Ê Đê, M'Nông với nhà sàn dài và tiếng cồng chiêng vang vọng. Đến với Buôn Ma Thuột và Buôn Đôn, bạn sẽ được sống trong không gian văn hóa cồng chiêng — Di sản của nhân loại — và cảm nhận sự hào sảng của con người đại ngàn.",
    bestTime: "Tháng 11–4, mùa khô Tây Nguyên",
    specialties: ["Cà phê Buôn Ma Thuột", "Bún đỏ", "Gà nướng cơm lam", "Rượu cần", "Bơ sáp"],
  },
  "son-la": {
    slug: "son-la",
    summary: "Cao nguyên Tây Bắc với thảo nguyên Mộc Châu xanh mướt, đồi chè và những mùa hoa nối tiếp.",
    story:
      "Sơn La là vùng cao nguyên rộng lớn của Tây Bắc, nổi tiếng nhất với cao nguyên Mộc Châu — thảo nguyên xanh mênh mông với đồi chè, rừng mận và các mùa hoa rực rỡ quanh năm. Khí hậu mát mẻ, cảnh sắc nên thơ cùng văn hóa các dân tộc Thái, Mông tạo nên sức hút đặc biệt. Đây cũng là vùng đất của những bản làng yên bình và đặc sản núi rừng độc đáo.",
    bestTime: "Tháng 11–2 (mùa hoa mận, hoa cải)",
    specialties: ["Bê chao Mộc Châu", "Sữa tươi", "Bắp cải mèo", "Cá hồi, cá tầm", "Thịt trâu gác bếp"],
  },
  "binh-thuan": {
    slug: "binh-thuan",
    summary: "Xứ sở nắng gió với đồi cát Mũi Né, biển xanh và những làng chài đậm chất Nam Trung Bộ.",
    story:
      "Bình Thuận là vùng đất của nắng, gió và biển xanh. Mũi Né nổi tiếng với những đồi cát vàng, cát đỏ uốn lượn như sa mạc, cùng làng chài Mũi Né đầy sắc màu và bãi biển trải dài. Đây là thiên đường của các môn thể thao biển như lướt ván diều. Bình Thuận còn có tháp Chăm Po Sah Inư cổ kính và đặc sản hải sản tươi ngon, nước mắm Phan Thiết trứ danh.",
    bestTime: "Tháng 11–4, mùa khô ít mưa",
    specialties: ["Nước mắm Phan Thiết", "Bánh canh chả cá", "Gỏi cá mai", "Mực một nắng", "Thanh long"],
  },
  "can-tho": {
    slug: "can-tho",
    summary: "Thủ phủ miền Tây sông nước với chợ nổi Cái Răng, vườn trái cây trĩu quả và nhịp sống miệt vườn.",
    story:
      "Cần Thơ — 'Tây Đô' của Đồng bằng sông Cửu Long — là nơi nhịp sống sông nước hiện lên rõ nét nhất. Chợ nổi Cái Răng nhộn nhịp từ tinh mơ, bến Ninh Kiều thơ mộng bên dòng sông Hậu, những vườn trái cây trĩu quả và nhà cổ Bình Thủy trăm tuổi. Người miền Tây phóng khoáng, hiếu khách, đờn ca tài tử ngọt ngào trong đêm — tất cả tạo nên một Cần Thơ trù phú và đậm tình.",
    bestTime: "Quanh năm; mùa nước nổi tháng 9–11 đẹp nhất",
    specialties: ["Bánh xèo", "Lẩu mắm", "Bánh cống", "Nem nướng Cái Răng", "Trái cây miệt vườn"],
  },
  "dien-bien": {
    slug: "dien-bien",
    summary: "Vùng đất lịch sử Tây Bắc với chiến trường Điện Biên Phủ lừng lẫy và cảnh sắc núi rừng hùng vĩ.",
    story:
      "Điện Biên là vùng đất ghi dấu chiến thắng Điện Biên Phủ 'lừng lẫy năm châu, chấn động địa cầu' năm 1954. Quần thể di tích chiến trường xưa — Đồi A1, Hầm De Castries, Bảo tàng Chiến thắng — là điểm đến thiêng liêng. Bên cạnh đó, Điện Biên còn có cánh đồng Mường Thanh rộng lớn, đèo Pha Đin hùng vĩ và sắc màu văn hóa của người Thái, Mông giữa núi rừng Tây Bắc.",
    bestTime: "Tháng 3–5; dịp 7/5 lễ kỷ niệm chiến thắng",
    specialties: ["Xôi nếp nương", "Gạo Điện Biên", "Pa pỉnh tộp (cá nướng)", "Thịt trâu gác bếp", "Rượu sâu chít"],
  },
};
