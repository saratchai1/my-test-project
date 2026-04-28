import type { AdaptiveRecommendation, DailyCheckIn } from "./types";

export function buildAdaptive(c: DailyCheckIn): AdaptiveRecommendation {
  const adjustments: string[] = [];
  const alerts: string[] = [];

  if (c.sleepHours < 6) {
    adjustments.push("ลดความเข้มข้นของวันนี้ — เปลี่ยน HIIT เป็นการเดินในธรรมชาติ 30 นาที");
    adjustments.push("เพิ่มช่วงฟื้นฟูบ่าย 20 นาที: ท่ายกขาพิงผนัง + หายใจช้าๆ");
  } else if (c.sleepHours >= 8 && c.energyLevel >= 7) {
    adjustments.push("พลังงานดี — สามารถเพิ่มชุด Mobility + เวทเบาๆ ได้ 20 นาที");
  }

  if (c.stressLevel >= 7) {
    adjustments.push("เพิ่มช่วงอาบป่า (ขุนกรณ์ หรือ สิงห์ปาร์ค) และฝึก Box Breathing 5 นาทีเพื่อรีเซ็ต");
    adjustments.push("ในเย็นนี้ เลือกคาเฟ่ Slow-living แทนกิจกรรมที่วุ่นวาย");
  }

  if (c.energyLevel <= 4) {
    adjustments.push("ลดภาระของวันนี้ — เดินอย่างเดียวพอ งดเทรนนิ่งแบบใช้แรงต้าน");
  }

  if (c.completionPercent < 50) {
    adjustments.push("แผนหนักไปสำหรับวันนี้ — เราจะลดปริมาณวันถัดไปลงประมาณ 30%");
  } else if (c.completionPercent >= 90) {
    adjustments.push("ทำตามแผนได้ดีมาก — รับรางวัลเล็กๆ ได้ (พิธีจิบชาช้าๆ ที่ฉุยฟง)");
  }

  const painText = (c.pain || "").trim();
  const lower = painText.toLowerCase();
  const isNone =
    !painText ||
    lower === "none" ||
    lower === "no" ||
    painText === "ไม่มี" ||
    painText === "ไม่" ||
    painText === "-";
  if (painText && !isNone) {
    alerts.push(
      `มีอาการที่ระบุ: "${painText}" เปลี่ยนไปทำกิจกรรมที่เบาลง หากอาการรุนแรง ต่อเนื่อง หรือแย่ลง กรุณาปรึกษาผู้เชี่ยวชาญด้านสุขภาพ`
    );
    adjustments.push("เปลี่ยนการออกกำลังกายแบบหนักเป็นโยคะฟื้นฟู หรือเดินริมน้ำเบาๆ");
  }

  if (adjustments.length === 0) {
    adjustments.push("คุณอยู่ในจังหวะที่ดี — ทำตามแผนเดิม และให้ความสำคัญกับการพักผ่อนช่วงเย็น");
  }

  const headline =
    alerts.length > 0
      ? "แผนปรับใหม่: เน้นการฟื้นฟูและพิจารณาปรึกษาผู้เชี่ยวชาญ"
      : c.stressLevel >= 7 || c.sleepHours < 6
      ? "แผนปรับใหม่: เน้นโหมดฟื้นฟูระบบประสาท"
      : c.energyLevel >= 7
      ? "แผนปรับใหม่: ไฟเขียว — เพิ่มการเคลื่อนไหวเบาๆ ได้"
      : "แผนปรับใหม่: ปรับเล็กน้อยเพื่อให้คุณอยู่ในจังหวะที่เหมาะที่สุด";

  return { headline, adjustments, alerts };
}
