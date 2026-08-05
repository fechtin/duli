// Living layer cho atlas Hàn Quốc (027/025): lịch mùa, lễ hội, hero và hidden gem.
// Khác bản Việt Nam, các mục ở đây tham chiếu THẲNG id điểm đến trong src/data/kr —
// nên tên, toạ độ và ảnh được lấy từ chính dữ liệu điểm đến, không cần bảng ánh xạ riêng.

export interface KrSeasonEntry {
  destinationId: string;
  state: string;
  icon: string;
}

export interface KrFestivalEntry {
  id: string;
  name: string;
  months: number[];
  icon: string;
  destinationIds: string[];
  description: string;
}

/** Điểm đến "đang vào mùa" theo tháng. */
export const krSeasonalCalendar: Record<string, KrSeasonEntry[]> = {
  "1": [
    { destinationId: "daegwallyeong-sky-ranch", state: "Cao nguyên phủ tuyết dày", icon: "❄️" },
    { destinationId: "jeongdongjin", state: "Bình minh đầu năm trên biển", icon: "🌅" },
    { destinationId: "ganjeolgot", state: "Mặt trời mọc sớm nhất bán đảo", icon: "🌄" },
    { destinationId: "seoraksan", state: "Núi đá phủ băng, mùa leo tuyết", icon: "🏔" },
  ],
  "2": [
    { destinationId: "daegwallyeong-sky-ranch", state: "Mùa trượt tuyết cuối", icon: "⛷" },
    { destinationId: "bangudae-petroglyphs", state: "Nước hồ rút, dễ nhìn tranh khắc", icon: "🪨" },
    { destinationId: "haedong-yonggungsa", state: "Chùa biển vắng, sóng lớn", icon: "🌊" },
  ],
  "3": [
    { destinationId: "gyeongpo-beach", state: "Hoa anh đào quanh hồ chớm nở", icon: "🌸" },
    { destinationId: "hallasan", state: "Cải vàng nở khắp đảo Jeju", icon: "🌼" },
    { destinationId: "hyeopjae-beach", state: "Biển lặng, trời trong", icon: "🏖" },
  ],
  "4": [
    { destinationId: "hangang-yeouido-park", state: "Lễ hội hoa anh đào Yeouido", icon: "🌸" },
    { destinationId: "gyeongbokgung", state: "Hoa xuân trong sân cung điện", icon: "🌸" },
    { destinationId: "maisan", state: "Anh đào phủ kín đường vào chùa", icon: "🌸" },
    { destinationId: "ganjeolgot", state: "Đồng cải vàng sau hải đăng", icon: "🌼" },
  ],
  "5": [
    { destinationId: "hallasan", state: "Đỗ quyên nở tím sườn núi", icon: "🌺" },
    { destinationId: "boseong-tea-fields", state: "Lá chè non xanh nhất năm", icon: "🍵" },
    { destinationId: "bulguksa", state: "Đèn lồng lễ Phật đản", icon: "🏮" },
    { destinationId: "namhae-daraengi", state: "Ruộng bậc thang đổ nước", icon: "🌾" },
  ],
  "6": [
    { destinationId: "namhae-daraengi", state: "Ruộng ngập nước phản chiếu trời", icon: "💧" },
    { destinationId: "damyang-bamboo", state: "Rừng tre xanh mát nhất", icon: "🎋" },
    { destinationId: "udo-island", state: "Mùa đạp xe quanh đảo", icon: "🚲" },
  ],
  "7": [
    { destinationId: "daecheon-beach", state: "Lễ hội bùn Boryeong", icon: "🎉" },
    { destinationId: "buyeo-busosanseong", state: "Sen nở kín hồ Gungnamji", icon: "🪷" },
    { destinationId: "haeundae-beach", state: "Cao điểm mùa tắm biển", icon: "🏖" },
    { destinationId: "taehwagang-bamboo", state: "Rừng tre bên sông mát rượi", icon: "🎋" },
  ],
  "8": [
    { destinationId: "gwangalli-beach", state: "Đêm biển và trình diễn drone", icon: "🎆" },
    { destinationId: "hyeopjae-beach", state: "Nước ấm, hoàng hôn dài", icon: "🌇" },
    { destinationId: "gyeongpo-beach", state: "Bãi đông nhất mùa hè", icon: "🏄" },
  ],
  "9": [
    { destinationId: "seoraksan", state: "Lá đỏ bắt đầu từ đỉnh núi", icon: "🍁" },
    { destinationId: "cheomseongdae", state: "Ruộng hoa nở quanh đài thiên văn", icon: "🌼" },
    { destinationId: "hahoe-folk-village", state: "Mùa lễ hội mặt nạ Andong", icon: "🎭" },
    { destinationId: "gongju-tomb", state: "Lễ hội văn hoá Bách Tế", icon: "🏯" },
  ],
  "10": [
    { destinationId: "naejangsan", state: "Đường hầm phong đỏ rực", icon: "🍁" },
    { destinationId: "namhansanseong", state: "Tường thành giữa rừng lá đỏ", icon: "🍂" },
    { destinationId: "jinju-fortress", state: "Lễ hội đèn lồng sông Nam", icon: "🏮" },
    { destinationId: "gwangalli-beach", state: "Lễ hội pháo hoa Busan", icon: "🎆" },
  ],
  "11": [
    { destinationId: "haeinsa", state: "Lá đỏ trên đường lên Gayasan", icon: "🍁" },
    { destinationId: "suncheonman-bay", state: "Bãi lau chín vàng", icon: "🌾" },
    { destinationId: "dosan-seowon", state: "Thư viện Nho giáo soi bóng hồ thu", icon: "🍂" },
    { destinationId: "juwangsan", state: "Hẻm đá rực màu đồng đỏ", icon: "🍁" },
  ],
  "12": [
    { destinationId: "suncheonman-bay", state: "Sếu và chim di cư về trú đông", icon: "🦢" },
    { destinationId: "boseong-tea-fields", state: "Lễ hội ánh sáng đồi chè", icon: "✨" },
    { destinationId: "daegwallyeong-sky-ranch", state: "Tuyết đầu mùa trên cao nguyên", icon: "❄️" },
  ],
};

/** Lễ hội theo tháng — hiển thị ở mục Lễ hội của sidebar. */
export const krFestivals: KrFestivalEntry[] = [
  {
    id: "kr-seollal", name: "Seollal (Tết âm lịch)", months: [1, 2], icon: "🏮",
    destinationIds: ["gyeongbokgung", "bukchon-hanok-village"],
    description: "Tết âm lịch Hàn Quốc: mặc hanbok, ăn canh bánh gạo tteokguk, cung điện mở cửa miễn phí.",
  },
  {
    id: "kr-jinhae-cherry", name: "Mùa hoa anh đào", months: [3, 4], icon: "🌸",
    destinationIds: ["hangang-yeouido-park", "gyeongpo-beach"],
    description: "Cuối tháng 3 đến giữa tháng 4, hoa anh đào nở dọc sông Hàn và các bờ biển phía đông.",
  },
  {
    id: "kr-buddha-birthday", name: "Lễ Phật đản (đèn lồng)", months: [4, 5], icon: "🪔",
    destinationIds: ["bulguksa", "haedong-yonggungsa", "beomeosa"],
    description: "Hàng nghìn đèn lồng giấy phủ kín sân chùa, kèm diễu hành đèn lồng ở Seoul.",
  },
  {
    id: "kr-boryeong-mud", name: "Lễ hội bùn Boryeong", months: [7], icon: "🎉",
    destinationIds: ["daecheon-beach"],
    description: "Bãi biển Daecheon thành sân chơi bùn khổng lồ suốt hai tuần giữa tháng 7.",
  },
  {
    id: "kr-chuseok", name: "Chuseok (Trung thu)", months: [9, 10], icon: "🌕",
    destinationIds: ["hahoe-folk-village", "korean-folk-village"],
    description: "Tết mùa màng lớn nhất năm: về quê tảo mộ, làm bánh songpyeon, chơi trò dân gian.",
  },
  {
    id: "kr-andong-mask", name: "Lễ hội mặt nạ Andong", months: [9, 10], icon: "🎭",
    destinationIds: ["hahoe-folk-village"],
    description: "Múa mặt nạ byeolsingut cùng các đoàn nghệ thuật quốc tế tại làng Hahoe.",
  },
  {
    id: "kr-busan-fireworks", name: "Lễ hội pháo hoa Busan", months: [10], icon: "🎆",
    destinationIds: ["gwangalli-beach"],
    description: "Pháo hoa bắn từ cầu Gwangan, cả bãi biển Gwangalli thành khán đài.",
  },
  {
    id: "kr-jinju-lantern", name: "Lễ hội đèn lồng sông Nam", months: [10], icon: "🏮",
    destinationIds: ["jinju-fortress"],
    description: "Hàng nghìn đèn lồng giấy thả trôi trên sông Nam quanh thành Jinju.",
  },
  {
    id: "kr-autumn-foliage", name: "Mùa lá đỏ", months: [10, 11], icon: "🍁",
    destinationIds: ["naejangsan", "seoraksan", "namhansanseong"],
    description: "Lá đỏ bắt đầu từ Seoraksan cuối tháng 9 rồi lan dần xuống phía nam suốt tháng 11.",
  },
  {
    id: "kr-winter-lights", name: "Mùa tuyết & lễ hội ánh sáng", months: [12, 1, 2], icon: "❄️",
    destinationIds: ["daegwallyeong-sky-ranch", "boseong-tea-fields"],
    description: "Cao nguyên Pyeongchang vào mùa trượt tuyết, đồi chè Boseong thắp đèn suốt mùa đông.",
  },
];

/** Hero banner xoay theo ngày — chỉ chọn điểm đến tiêu biểu nhất. */
export const krHeroIds = [
  "gyeongbokgung",
  "seongsan-ilchulbong",
  "seoraksan",
  "bulguksa",
  "haeundae-beach",
  "jeonju-hanok-village",
  "hahoe-folk-village",
];

/** Hidden gem xoay theo ngày — những nơi ít khách nước ngoài biết. */
export const krHiddenGemIds = [
  "bangudae-petroglyphs",
  "juwangsan",
  "guinsa",
  "namhae-daraengi",
  "maisan",
  "yangnim-dong",
  "haemieupseong",
  "cheongju-jikji",
];
