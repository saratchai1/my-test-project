import { riskLevelFromScore } from "@/lib/risk-engine";
import type { GeoJsonFeature, ScenarioInput, ScenarioResult } from "@/types";

function pointFeature(id: string, lng: number, lat: number, score: number): GeoJsonFeature {
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: {
      id,
      riskScore: score,
      status: score >= 76 ? "CRITICAL" : score >= 51 ? "WARNING" : "WATCH"
    }
  };
}

export function runScenarioSimulation(input: ScenarioInput): ScenarioResult {
  const rainfall = input.rainfallMmPerHr ?? 45;
  const duration = input.durationHr ?? 2;
  const pumpAvailability = input.pumpAvailabilityPercent ?? 85;
  const wastewaterLoad = input.wastewaterLoadPercent ?? 95;
  const blockage = input.blockedPipePercent ?? 25;
  const canalLevel = input.canalWaterLevelM ?? 1.2;
  const leakageSeverity = input.leakageSeverityPercent ?? 18;
  const backupPump = input.backupPumpAvailabilityPercent ?? 80;
  const cod = input.codMgL ?? 110;
  const bod = input.bodMgL ?? 35;
  const zones = ["Zone A", "Zone B", "Zone C", "Utility Corridor", "WWTP Area"];

  let impactScore = 45;
  let summaryTh = "";
  let recommendationsTh: string[] = [];
  let checklistTh: string[] = [];
  let estimatedCostImpact = 1_200_000;
  let estimatedFloodedAreaRai: number | undefined;
  let estimatedWaterLossM3: number | undefined;
  let overflowNodeCount: number | undefined;

  if (input.scenarioType === "HEAVY_RAIN") {
    impactScore = Math.min(100, rainfall * 0.75 + duration * 7 + Math.max(0, 100 - pumpAvailability) * 0.55 + canalLevel * 8);
    estimatedFloodedAreaRai = Math.round(Math.max(0, impactScore - 45) * 2.4);
    overflowNodeCount = Math.max(1, Math.round((impactScore - 35) / 12));
    summaryTh = `มีความเสี่ยงน้ำท่วม${impactScore >= 76 ? "สูง" : "ปานกลาง"}บริเวณโซน B และโซน C เนื่องจากความสามารถระบายน้ำต่ำกว่าปริมาณฝนจำลองประมาณ ${Math.round(Math.max(0, rainfall - 38))}%`;
    recommendationsTh = ["เปิดเครื่องสูบน้ำสำรองในสถานี PS-03", "เร่งล้างท่อระบายน้ำ D-112 ก่อนฤดูฝน", "เตรียมเครื่องสูบน้ำเคลื่อนที่และจุดเฝ้าระวังระดับน้ำ"];
    checklistTh = ["ตรวจระดับน้ำคลองรับน้ำ", "ยืนยันสถานะไฟฟ้าสำรองของสถานีสูบ", "แจ้งเตือนผู้ประกอบการในพื้นที่ต่ำ"];
    estimatedCostImpact = estimatedFloodedAreaRai * 85_000 + overflowNodeCount * 160_000;
  } else if (input.scenarioType === "PUMP_FAILURE") {
    impactScore = Math.min(100, 50 + (100 - pumpAvailability) * 0.55 + duration * 5 + (100 - backupPump) * 0.25);
    overflowNodeCount = Math.max(1, Math.round(impactScore / 18));
    summaryTh = `หากเครื่องสูบน้ำขัดข้องต่อเนื่อง ${duration} ชั่วโมง จะมีความเสี่ยงน้ำล้นและหยุดให้บริการบางส่วนในพื้นที่ Utility Corridor`;
    recommendationsTh = ["สั่งเดินเครื่องสูบน้ำสำรอง", "จัดทีมซ่อมฉุกเฉินเข้าตรวจมอเตอร์และตู้ควบคุม", "ลดโหลดระบบชั่วคราวและแจ้งผู้ประกอบการรายใหญ่"];
    checklistTh = ["ตรวจ backup pump", "ตรวจแหล่งจ่ายไฟสำรอง", "เปิด incident command log"];
    estimatedCostImpact = impactScore * 55_000;
  } else if (input.scenarioType === "PIPE_LEAKAGE") {
    impactScore = Math.min(100, 35 + leakageSeverity * 1.5 + duration * 4);
    estimatedWaterLossM3 = Math.round(leakageSeverity * duration * 18);
    summaryTh = `คาดว่าจะเกิดน้ำสูญเสียประมาณ ${estimatedWaterLossM3.toLocaleString("th-TH")} ลบ.ม. และแรงดันตกในพื้นที่ผู้ใช้น้ำปลายทาง`;
    recommendationsTh = ["แยกโซนวาล์วเพื่อลดน้ำสูญเสีย", "ส่งทีม leak detection", "เตรียมซ่อมท่อและแจ้งผู้ใช้น้ำสำคัญ"];
    checklistTh = ["ตรวจแรงดันต้นทาง-ปลายทาง", "ปิดวาล์วแยกพื้นที่", "บันทึก NRW event"];
    estimatedCostImpact = estimatedWaterLossM3 * 45 + impactScore * 28_000;
  } else if (input.scenarioType === "PIPE_BLOCKAGE") {
    impactScore = Math.min(100, 38 + blockage * 1.1 + wastewaterLoad * 0.18 + duration * 3);
    overflowNodeCount = Math.max(1, Math.round(blockage / 12));
    summaryTh = `คาดว่าจะเกิด manhole overflow จำนวน ${overflowNodeCount} จุด หากท่ออุดตันระดับ ${blockage}% ต่อเนื่องเกิน ${duration} ชั่วโมง`;
    recommendationsTh = ["ส่งรถ Jetting และ CCTV Inspection", "ปิดกั้นพื้นที่เสี่ยงน้ำเสียล้น", "จัดลำดับล้างท่อ upstream ก่อน"];
    checklistTh = ["ระบุ manhole upstream", "ตรวจกลิ่นและคุณภาพน้ำ", "ออกใบสั่งงาน CCTV"];
    estimatedCostImpact = overflowNodeCount * 210_000 + blockage * 22_000;
  } else if (input.scenarioType === "WASTEWATER_OVERLOAD") {
    impactScore = Math.min(100, wastewaterLoad * 0.72 + Math.max(0, cod - 120) * 0.08 + Math.max(0, bod - 40) * 0.15);
    summaryTh = `โหลดน้ำเสียอยู่ที่ ${wastewaterLoad}% ของกำลังออกแบบ ทำให้เกิดความเสี่ยงด้าน compliance และเสถียรภาพระบบบำบัด`;
    recommendationsTh = ["เพิ่มการเติมอากาศและติดตาม COD/BOD", "ปรับแผนรับน้ำเสียจากโรงงานที่โหลดสูง", "เตรียม bypass control ตาม SOP"];
    checklistTh = ["เก็บตัวอย่างน้ำเข้า-ออก", "ตรวจ DO และพลังงาน blower", "แจ้งเตือนโรงงานที่ปล่อยโหลดสูง"];
    estimatedCostImpact = impactScore * 42_000;
  } else {
    impactScore = Math.min(100, rainfall * 0.45 + (100 - pumpAvailability) * 0.35 + wastewaterLoad * 0.25 + blockage * 0.55);
    estimatedFloodedAreaRai = Math.round(Math.max(0, impactScore - 50) * 1.8);
    overflowNodeCount = Math.max(2, Math.round(impactScore / 14));
    summaryTh = "สถานการณ์ Combined Stress ทำให้ระบบน้ำฝน น้ำเสีย และสถานีสูบมีความเสี่ยงพร้อมกัน ควรใช้แผนตอบโต้แบบบูรณาการ";
    recommendationsTh = ["เปิดศูนย์บัญชาการเหตุการณ์", "เดินเครื่องสูบน้ำสำรอง", "ลดโหลด WWTP ชั่วคราว", "ล้างท่อจุดเสี่ยงสูงก่อนฝนตก"];
    checklistTh = ["ยืนยันกำลังคนและเครื่องจักร", "ติดตาม Sensor ทุก 15 นาที", "สื่อสารกับผู้ประกอบการในนิคม"];
    estimatedCostImpact = impactScore * 95_000;
  }

  const affectedZones = impactScore >= 76 ? zones.slice(1) : zones.slice(0, 3);
  const criticalAssets = input.affectedAssetIds?.length ? input.affectedAssetIds : ["PS-03", "D-112", "MH-204", "WWTP-01"].slice(0, impactScore >= 76 ? 4 : 2);
  const baseLng = input.estateId.includes("bang") ? 100.62 : input.estateId.includes("amata") ? 101.05 : 101.15;
  const baseLat = input.estateId.includes("bang") ? 13.54 : input.estateId.includes("amata") ? 13.42 : 12.68;
  const features = criticalAssets.map((asset, index) => pointFeature(asset, baseLng + index * 0.01, baseLat + index * 0.008, impactScore - index * 5));

  return {
    riskLevel: riskLevelFromScore(impactScore),
    impactScore: Math.round(impactScore),
    affectedZones,
    criticalAssets,
    estimatedCostImpact: Math.round(estimatedCostImpact),
    estimatedFloodedAreaRai,
    estimatedWaterLossM3,
    overflowNodeCount,
    summaryTh,
    recommendationsTh,
    checklistTh,
    mapFeatures: { type: "FeatureCollection", features }
  };
}
