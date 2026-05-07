export type EstateRegion = "ภาคกลาง" | "ภาคตะวันออก" | "ภาคใต้" | "ภาคเหนือ";

export type EstateMasterRecord = {
  code: string;
  region: EstateRegion;
  nameTh: string;
  nameEn: string;
  province: string;
  areaRai: number;
  latitude: number;
  longitude: number;
};

export const estateMasterList: EstateMasterRecord[] = [
  {
    code: "BCH",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมบางชัน",
    nameEn: "Bang Chan Industrial Estate",
    province: "กรุงเทพมหานคร",
    areaRai: 678,
    latitude: 13.812,
    longitude: 100.69
  },
  {
    code: "BPL",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมบางพลี",
    nameEn: "Bang Phli Industrial Estate",
    province: "สมุทรปราการ",
    areaRai: 1004,
    latitude: 13.611,
    longitude: 100.721
  },
  {
    code: "BPU",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมบางปู",
    nameEn: "Bangpoo Industrial Estate",
    province: "สมุทรปราการ",
    areaRai: 5400,
    latitude: 13.545,
    longitude: 100.626
  },
  {
    code: "KKY",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมแก่งคอย",
    nameEn: "Kaeng Khoi Industrial Estate",
    province: "สระบุรี",
    areaRai: 3200,
    latitude: 14.587,
    longitude: 101.003
  },
  {
    code: "LCB",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมลาดกระบัง",
    nameEn: "Lat Krabang Industrial Estate",
    province: "กรุงเทพมหานคร",
    areaRai: 2559,
    latitude: 13.735,
    longitude: 100.786
  },
  {
    code: "NKL",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมนครหลวง (อยุธยา)",
    nameEn: "Nakhon Luang Industrial Estate",
    province: "พระนครศรีอยุธยา",
    areaRai: 1980,
    latitude: 14.477,
    longitude: 100.609
  },
  {
    code: "SKR",
    region: "ภาคกลาง",
    nameTh: "นิคมอุตสาหกรรมสมุทรสาคร",
    nameEn: "Samut Sakhon Industrial Estate",
    province: "สมุทรสาคร",
    areaRai: 1736,
    latitude: 13.55,
    longitude: 100.277
  },
  {
    code: "LCB2",
    region: "ภาคตะวันออก",
    nameTh: "นิคมอุตสาหกรรมแหลมฉบัง",
    nameEn: "Laem Chabang Industrial Estate",
    province: "ชลบุรี",
    areaRai: 3569,
    latitude: 13.084,
    longitude: 100.913
  },
  {
    code: "MAP",
    region: "ภาคตะวันออก",
    nameTh: "นิคมอุตสาหกรรมมาบตาพุด",
    nameEn: "Map Ta Phut Industrial Estate",
    province: "ระยอง",
    areaRai: 10400,
    latitude: 12.681,
    longitude: 101.154
  },
  {
    code: "SKW",
    region: "ภาคตะวันออก",
    nameTh: "นิคมอุตสาหกรรมสระแก้ว",
    nameEn: "Sa Kaeo Industrial Estate",
    province: "สระแก้ว",
    areaRai: 660,
    latitude: 13.82,
    longitude: 102.055
  },
  {
    code: "SKH",
    region: "ภาคใต้",
    nameTh: "นิคมอุตสาหกรรมสงขลา (สะเดา)",
    nameEn: "Songkhla Sadao Industrial Estate",
    province: "สงขลา",
    areaRai: 950,
    latitude: 6.638,
    longitude: 100.424
  },
  {
    code: "STH",
    region: "ภาคใต้",
    nameTh: "นิคมอุตสาหกรรมภาคใต้ (สงขลา)",
    nameEn: "Southern Region Industrial Estate",
    province: "สงขลา",
    areaRai: 2250,
    latitude: 7.042,
    longitude: 100.476
  },
  {
    code: "LPN",
    region: "ภาคเหนือ",
    nameTh: "นิคมอุตสาหกรรมภาคเหนือ (ลำพูน)",
    nameEn: "Northern Region Industrial Estate Lamphun",
    province: "ลำพูน",
    areaRai: 1788,
    latitude: 18.548,
    longitude: 99.015
  },
  {
    code: "PCT",
    region: "ภาคเหนือ",
    nameTh: "นิคมอุตสาหกรรมพิจิตร",
    nameEn: "Phichit Industrial Estate",
    province: "พิจิตร",
    areaRai: 1150,
    latitude: 16.444,
    longitude: 100.329
  }
];

export const estateRegions: EstateRegion[] = ["ภาคกลาง", "ภาคตะวันออก", "ภาคใต้", "ภาคเหนือ"];
