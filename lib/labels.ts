import type {
  Budget,
  FitnessLevel,
  FoodInterest,
  FoodPreference,
  MovementPreference,
  PrivacyPreference,
  RiskSensitivity,
  Season,
  SleepQuality,
  TravelDuration,
  TravelMood,
  TravelStyle,
} from "./types";

export const TH = {
  travelDuration: {
    "1 day": "1 วัน",
    "2 days": "2 วัน",
    "3 days": "3 วัน",
  } as Record<TravelDuration, string>,

  fitnessLevel: {
    beginner: "เริ่มต้น",
    moderate: "ปานกลาง",
    active: "แอ็กทีฟ",
  } as Record<FitnessLevel, string>,

  food: {
    normal: "ทั่วไป",
    vegetarian: "มังสวิรัติ",
    "high protein": "โปรตีนสูง",
    "low sugar": "น้ำตาลต่ำ",
    "local healthy Thai food": "อาหารไทยเพื่อสุขภาพ",
  } as Record<FoodPreference, string>,

  sleep: {
    poor: "ไม่ดี",
    average: "ปานกลาง",
    good: "ดี",
  } as Record<SleepQuality, string>,

  budget: {
    low: "ประหยัด",
    medium: "ปานกลาง",
    premium: "พรีเมียม",
    "medium-premium": "ปานกลาง–พรีเมียม",
  } as Record<Budget, string>,

  travelStyle: {
    nature: "ธรรมชาติ",
    cafe: "คาเฟ่",
    temple: "วัด",
    walking: "เดินเที่ยว",
    "slow living": "Slow Living",
    "active adventure": "ผจญภัย",
  } as Record<TravelStyle, string>,

  goal: {
    "stress recovery": "ฟื้นฟูความเครียด",
    "better sleep": "นอนหลับดีขึ้น",
    "weight management": "ดูแลน้ำหนัก",
    "healthy lifestyle reset": "รีเซ็ตไลฟ์สไตล์เพื่อสุขภาพ",
    "active fitness trip": "ทริปออกกำลังกาย",
    "stress recovery and better sleep": "ฟื้นฟูความเครียดและนอนหลับดีขึ้น",
    "stress recovery, better sleep, and healthier lifestyle reset":
      "ฟื้นฟูความเครียด นอนดีขึ้น และรีเซ็ตไลฟ์สไตล์",
  } as Record<string, string>,

  intensity: {
    lighter: "เบาลง",
    keep: "คงเดิม",
    harder: "หนักขึ้น",
  } as Record<"lighter" | "keep" | "harder", string>,

  foodInterest: {
    "local northern food": "อาหารพื้นเมืองเหนือ",
    "high protein": "โปรตีนสูง",
    "plant-forward": "เน้นพืช",
    "low sugar": "น้ำตาลต่ำ",
    "fermented/local probiotic": "อาหารหมัก / โปรไบโอติกท้องถิ่น",
    "chef/coach curated": "เชฟ/โค้ชจัดให้",
    "surprise local food": "อาหารท้องถิ่นแบบเซอร์ไพรส์",
  } as Record<FoodInterest, string>,

  movement: {
    "light walking": "เดินเบาๆ",
    "mobility/stretching": "Mobility / ยืดเหยียด",
    "gym training": "เทรนยิม",
    "HYROX-style": "HYROX functional",
    "trail running": "วิ่งเทรล",
    "natural movement": "Natural Movement",
    "fun social sport": "กีฬาสังสรรค์",
    "recovery session": "Recovery session",
  } as Record<MovementPreference, string>,

  travelMood: {
    "quiet/private": "เงียบ / เป็นส่วนตัว",
    "nature recovery": "ฟื้นฟูจากธรรมชาติ",
    "local village": "ชุมชนท้องถิ่น",
    "slow living cafe": "คาเฟ่ Slow Living",
    "historical/cultural": "ประวัติศาสตร์ / วัฒนธรรม",
    "digital detox": "ดิจิทัลดีท็อกซ์",
    "hidden gem": "Hidden Gem",
    "low-crowd route": "เส้นทางคนน้อย",
  } as Record<TravelMood, string>,

  privacy: {
    "ok with popular": "ไปที่นิยมได้",
    "prefer quiet": "ชอบที่เงียบ",
    "strongly avoid crowds": "เลี่ยงคนเยอะมาก",
  } as Record<PrivacyPreference, string>,

  season: {
    rainy: "ฤดูฝน",
    "late rainy / early winter": "ปลายฝน / ต้นหนาว",
    winter: "ฤดูหนาว",
    hot: "ฤดูร้อน",
    "not sure": "ไม่แน่ใจ",
  } as Record<Season, string>,

  risk: {
    "avoid PM2.5": "เลี่ยง PM2.5",
    "avoid water risk": "เลี่ยงพื้นที่น้ำไม่ปลอดภัย",
    "avoid crowds": "เลี่ยงที่คนเยอะ",
    "avoid intense": "เลี่ยงกิจกรรมหนัก",
    "medical/nutrition caution": "ระวังด้านการแพทย์/โภชนาการ",
  } as Record<RiskSensitivity, string>,
};

export function thGoal(g: string) {
  return TH.goal[g] ?? g;
}
