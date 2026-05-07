import { clamp } from "@/lib/utils";
import type {
  AssetForRisk,
  IncidentForRisk,
  ReadingForRisk,
  RiskAssessmentInputResult,
  RiskLevel
} from "@/types";

const highConsequenceTypes = new Set([
  "WATER_PIPE",
  "WASTEWATER_PIPE",
  "DRAINAGE_PIPE",
  "PUMP_STATION",
  "PUMP",
  "WWTP",
  "RETENTION_POND",
  "CANAL"
]);

const pipeTypes = new Set(["WATER_PIPE", "WASTEWATER_PIPE", "DRAINAGE_PIPE"]);

function ageScore(asset: AssetForRisk, currentYear: number) {
  if (!asset.installYear) return 55;
  const age = currentYear - asset.installYear;
  if (age > 40) return 92;
  if (age >= 25) return 76;
  if (age >= 10) return 46;
  return 18;
}

function materialScore(material: string | null) {
  const normalized = (material ?? "unknown").toLowerCase();
  if (["asbestos cement", "ac", "concrete", "old steel", "steel"].some((term) => normalized.includes(term))) return 82;
  if (["ductile iron", "di"].some((term) => normalized.includes(term))) return 35;
  if (["pvc", "hdpe", "pe"].some((term) => normalized.includes(term))) return 22;
  return 62;
}

function incidentScore(incidents: IncidentForRisk[], now: Date) {
  const threeYearsAgo = new Date(now);
  threeYearsAgo.setFullYear(now.getFullYear() - 3);
  const relevant = incidents.filter((incident) => incident.reportedAt >= threeYearsAgo);
  const weighted = relevant.reduce((sum, incident) => {
    const typeWeight = ["LEAKAGE", "PIPE_BURST", "BLOCKAGE", "PUMP_FAILURE", "FLOODING", "MANHOLE_OVERFLOW"].includes(
      incident.incidentType
    )
      ? 1.25
      : 0.8;
    return sum + incident.severity * 9 * typeWeight;
  }, 0);
  return clamp(weighted, 0, 100);
}

function hydraulicStressScore(asset: AssetForRisk, readings: ReadingForRisk[]) {
  const capacityRatio =
    asset.designCapacity && asset.currentCapacity ? (asset.currentCapacity / asset.designCapacity) * 100 : 45;
  const capacityScore = capacityRatio > 115 ? 88 : capacityRatio > 95 ? 68 : capacityRatio > 75 ? 45 : 22;
  if (readings.length === 0) return capacityScore;

  const anomalyScores = readings.map((reading) => {
    const { minThreshold, maxThreshold, sensorType } = reading.sensor;
    const above = maxThreshold !== null && reading.value > maxThreshold;
    const below = minThreshold !== null && reading.value < minThreshold;
    if (!above && !below) return 18;
    if (["PUMP_VIBRATION", "WATER_LEVEL", "RAINFALL", "WATER_QUALITY_COD", "WATER_QUALITY_BOD"].includes(sensorType)) return 92;
    return 75;
  });
  const anomalyScore = anomalyScores.reduce((sum, score) => sum + score, 0) / anomalyScores.length;
  return clamp(capacityScore * 0.45 + anomalyScore * 0.55);
}

function environmentalScore(asset: AssetForRisk, incidents: IncidentForRisk[]) {
  let score = 32;
  if (asset.assetType === "DRAINAGE_PIPE" || asset.assetType === "CANAL" || asset.assetType === "RETENTION_POND") score += 18;
  if (asset.assetType === "WASTEWATER_PIPE" || asset.assetType === "WWTP") score += 12;
  if (incidents.some((incident) => incident.incidentType === "FLOODING" || incident.incidentType === "ROAD_SETTLEMENT")) score += 20;
  if (asset.status === "WARNING") score += 12;
  if (asset.status === "CRITICAL") score += 22;
  return clamp(score);
}

function maintenanceScore(asset: AssetForRisk, now: Date) {
  if (!asset.lastMaintenanceDate) return 72;
  const years = (now.getTime() - asset.lastMaintenanceDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
  if (years > 5) return 82;
  if (years > 3) return 58;
  if (years > 1) return 34;
  return 16;
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 25) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 75) return "HIGH";
  return "CRITICAL";
}

export function thaiRiskLabel(level: RiskLevel) {
  return {
    LOW: "ต่ำ",
    MODERATE: "ปานกลาง",
    HIGH: "สูง",
    CRITICAL: "วิกฤต"
  }[level];
}

function recommendation(asset: AssetForRisk, score: number, hydraulicScore: number, readings: ReadingForRisk[]) {
  const hasSensorCoverage = readings.length > 0;
  if (score >= 85 && pipeTypes.has(asset.assetType)) return "ควรจัดอยู่ในแผนเปลี่ยนท่อหรือฟื้นฟูท่อภายในปีงบประมาณนี้";
  if (score >= 76) return "ควรตรวจสอบเร่งด่วนและออกใบสั่งงานภายใน 14 วัน";
  if (score >= 70 && pipeTypes.has(asset.assetType)) return "ควรตรวจ CCTV ภายใน 30 วัน และเตรียมงบซ่อมเฉพาะจุด";
  if (hydraulicScore >= 75) return "ควรบำรุงรักษาเชิงป้องกันก่อนฤดูฝนและตรวจสอบภาระทางชลศาสตร์";
  if (!hasSensorCoverage) return "ควรติดตั้ง Sensor เพิ่มเติมเพื่อตรวจวัดแรงดัน อัตราการไหล หรือระดับน้ำ";
  if (score >= 51) return "ควรจัดเข้ารอบตรวจเชิงป้องกันและติดตามแนวโน้มความเสี่ยงรายเดือน";
  return "ติดตามตามรอบบำรุงรักษาปกติ และคงข้อมูล Sensor เพื่อเฝ้าระวังแนวโน้ม";
}

export function calculateAssetRisk(
  asset: AssetForRisk,
  incidents: IncidentForRisk[],
  sensorReadings: ReadingForRisk[],
  now = new Date()
): RiskAssessmentInputResult {
  const currentYear = now.getFullYear();
  const age = ageScore(asset, currentYear);
  const material = materialScore(asset.material);
  const leakageHistory = incidentScore(incidents, now);
  const hydraulicStress = hydraulicStressScore(asset, sensorReadings);
  const environmental = environmentalScore(asset, incidents);
  const maintenance = maintenanceScore(asset, now);
  const probabilityScore = clamp(
    age * 0.22 +
      material * 0.16 +
      leakageHistory * 0.22 +
      hydraulicStress * 0.22 +
      environmental * 0.1 +
      maintenance * 0.08
  );

  const criticalityScore = clamp((asset.criticalityLevel / 5) * 100);
  const assetTypeScore = highConsequenceTypes.has(asset.assetType) ? 78 : asset.assetType === "VALVE" || asset.assetType === "MANHOLE" ? 42 : 55;
  const serviceAreaImpact = pipeTypes.has(asset.assetType) && (asset.diameterMm ?? 0) >= 600 ? 82 : 52;
  const consequenceScore = clamp(criticalityScore * 0.48 + assetTypeScore * 0.32 + serviceAreaImpact * 0.2);
  const totalRiskScore = clamp(probabilityScore * 0.6 + consequenceScore * 0.4);

  return {
    totalRiskScore: Math.round(totalRiskScore),
    probabilityScore: Math.round(probabilityScore),
    consequenceScore: Math.round(consequenceScore),
    factors: {
      ageScore: Math.round(age),
      materialScore: Math.round(material),
      leakageHistoryScore: Math.round(leakageHistory),
      hydraulicStressScore: Math.round(hydraulicStress),
      environmentalScore: Math.round(environmental),
      criticalityScore: Math.round(criticalityScore),
      maintenanceScore: Math.round(maintenance)
    },
    riskLevel: riskLevelFromScore(totalRiskScore),
    recommendation: recommendation(asset, totalRiskScore, hydraulicStress, sensorReadings)
  };
}
