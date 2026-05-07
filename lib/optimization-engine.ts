import type { AssetWithRisk, OptimizationResult, OptimizedPlanItem, ParetoPoint } from "@/types";

const pipeTypes = new Set(["WATER_PIPE", "WASTEWATER_PIPE", "DRAINAGE_PIPE"]);

function costMultiplier(actionType: string) {
  return {
    INSPECT: 0.08,
    CCTV_INSPECTION: 0.12,
    CLEANING: 0.18,
    REPAIR: 0.28,
    REPLACE: 0.92,
    REHABILITATE: 0.58,
    SENSOR_INSTALL: 0.16
  }[actionType] ?? 0.2;
}

function actionForAsset(asset: AssetWithRisk, objective: string) {
  const risk = asset.risk.totalRiskScore;
  const hydraulic = asset.risk.factors.hydraulicStressScore;
  if (risk >= 85 && pipeTypes.has(asset.assetType)) return asset.assetType === "DRAINAGE_PIPE" ? "REHABILITATE" : "REPLACE";
  if (risk >= 70 && pipeTypes.has(asset.assetType)) return asset.assetType === "DRAINAGE_PIPE" || objective === "FLOOD_PREVENTION" ? "CLEANING" : "CCTV_INSPECTION";
  if ((asset.assetType === "PUMP" || asset.assetType === "PUMP_STATION") && hydraulic >= 70) return "REPAIR";
  if (objective === "WASTEWATER_COMPLIANCE" && ["WASTEWATER_PIPE", "WWTP", "MANHOLE"].includes(asset.assetType)) return "REHABILITATE";
  if (asset.risk.factors.hydraulicStressScore < 40 && risk >= 45) return "SENSOR_INSTALL";
  if (risk >= 51) return "REPAIR";
  return "INSPECT";
}

function objectiveBoost(asset: AssetWithRisk, objective: string) {
  if (objective === "REDUCE_LEAKAGE" || objective === "NRW_REDUCTION") return asset.assetType === "WATER_PIPE" ? 1.35 : 0.92;
  if (objective === "FLOOD_PREVENTION") return ["DRAINAGE_PIPE", "CANAL", "RETENTION_POND", "PUMP_STATION"].includes(asset.assetType) ? 1.4 : 0.9;
  if (objective === "WASTEWATER_COMPLIANCE") return ["WASTEWATER_PIPE", "WWTP", "MANHOLE"].includes(asset.assetType) ? 1.4 : 0.88;
  if (objective === "MINIMIZE_RISK") return 1.15;
  return 1;
}

export function optimizeMaintenancePlan(
  assets: AssetWithRisk[],
  availableBudget: number,
  objective: string
): OptimizationResult {
  const candidates = assets
    .filter((asset) => asset.risk.totalRiskScore >= 35)
    .map((asset) => {
      const actionType = actionForAsset(asset, objective);
      const baseCost = actionType === "SENSOR_INSTALL" ? 180_000 : actionType === "INSPECT" ? 65_000 : asset.maintenanceCost ?? 100_000;
      const estimatedCost = Math.max(35_000, Math.round((actionType === "REPLACE" ? asset.replacementCost ?? baseCost : baseCost) * costMultiplier(actionType)));
      const expectedRiskReduction = Math.min(
        asset.risk.totalRiskScore * 0.72,
        (actionType === "REPLACE" ? 38 : actionType === "REHABILITATE" ? 30 : actionType === "REPAIR" ? 22 : actionType === "CLEANING" ? 18 : 12) *
          objectiveBoost(asset, objective)
      );
      const expectedBenefit = expectedRiskReduction * asset.criticalityLevel * objectiveBoost(asset, objective);
      const roi = expectedRiskReduction / estimatedCost;
      const item: OptimizedPlanItem = {
        assetId: asset.id,
        assetCode: asset.assetCode,
        assetName: asset.name,
        assetType: asset.assetType,
        riskScore: asset.risk.totalRiskScore,
        actionType,
        priorityRank: 0,
        estimatedCost,
        expectedRiskReduction: Math.round(expectedRiskReduction * 10) / 10,
        expectedBenefit: Math.round(expectedBenefit * 10) / 10,
        roi,
        justification: `สินทรัพย์มีคะแนนเสี่ยง ${asset.risk.totalRiskScore} และระดับความสำคัญ ${asset.criticalityLevel} จึงเหมาะกับการดำเนินการแบบ ${actionType}`
      };
      return item;
    })
    .sort((a, b) => {
      const aCriticalBand = a.riskScore >= 85 ? 1 : 0;
      const bCriticalBand = b.riskScore >= 85 ? 1 : 0;
      return bCriticalBand - aCriticalBand || b.roi - a.roi || b.riskScore - a.riskScore;
    });

  const selected: OptimizedPlanItem[] = [];
  let totalCost = 0;
  for (const candidate of candidates) {
    if (totalCost + candidate.estimatedCost <= availableBudget) {
      selected.push({ ...candidate, priorityRank: selected.length + 1 });
      totalCost += candidate.estimatedCost;
    }
  }

  const paretoCurve: ParetoPoint[] = [];
  let cumulativeCost = 0;
  let cumulativeRiskReduction = 0;
  selected.forEach((item, index) => {
    cumulativeCost += item.estimatedCost;
    cumulativeRiskReduction += item.expectedRiskReduction;
    paretoCurve.push({
      cumulativeCost,
      cumulativeRiskReduction: Math.round(cumulativeRiskReduction * 10) / 10,
      itemCount: index + 1,
      averageRiskReduction: Math.round((cumulativeRiskReduction / (index + 1)) * 10) / 10
    });
  });

  const totalExpectedRiskReduction = selected.reduce((sum, item) => sum + item.expectedRiskReduction, 0);
  return {
    recommendedPlanItems: selected,
    totalCost,
    remainingBudget: availableBudget - totalCost,
    totalExpectedRiskReduction: Math.round(totalExpectedRiskReduction * 10) / 10,
    paretoCurve,
    summary: `ระบบเลือกแผนซ่อมบำรุง ${selected.length} รายการ ใช้งบประมาณ ${totalCost.toLocaleString("th-TH")} บาท เพื่อลดความเสี่ยงรวมประมาณ ${Math.round(totalExpectedRiskReduction).toLocaleString("th-TH")} คะแนน ภายใต้งบประมาณจำกัด`
  };
}
