import { describe, expect, it } from "vitest";
import { optimizeMaintenancePlan } from "@/lib/optimization-engine";
import type { AssetWithRisk } from "@/types";

function asset(id: string, score: number, criticalityLevel: number): AssetWithRisk {
  return {
    id,
    assetCode: id,
    name: `Asset ${id}`,
    assetType: "WATER_PIPE",
    material: "Old Steel",
    installYear: 1988,
    designCapacity: 100,
    currentCapacity: 120,
    criticalityLevel,
    replacementCost: 1_000_000,
    maintenanceCost: 150_000,
    risk: {
      totalRiskScore: score,
      probabilityScore: score,
      consequenceScore: score,
      riskLevel: "HIGH",
      recommendation: "",
      factors: {
        ageScore: score,
        materialScore: score,
        leakageHistoryScore: score,
        hydraulicStressScore: score,
        environmentalScore: score,
        criticalityScore: criticalityLevel * 20,
        maintenanceScore: score
      }
    }
  };
}

describe("optimization engine", () => {
  it("does not exceed available budget", () => {
    const result = optimizeMaintenancePlan([asset("A", 90, 5), asset("B", 75, 4), asset("C", 60, 3)], 500_000, "BALANCED");
    expect(result.totalCost).toBeLessThanOrEqual(500_000);
  });

  it("prioritizes critical high-risk assets", () => {
    const result = optimizeMaintenancePlan([asset("LOW", 40, 2), asset("CRIT", 92, 5)], 1_200_000, "MINIMIZE_RISK");
    expect(result.recommendedPlanItems[0]?.assetCode).toBe("CRIT");
  });
});
