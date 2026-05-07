import { describe, expect, it } from "vitest";
import { calculateAssetRisk } from "@/lib/risk-engine";
import type { AssetForRisk, IncidentForRisk } from "@/types";

const baseAsset: AssetForRisk = {
  id: "asset-1",
  assetType: "WATER_PIPE",
  material: "HDPE",
  installYear: 2020,
  designCapacity: 500,
  currentCapacity: 320,
  criticalityLevel: 3,
  replacementCost: 1_000_000,
  maintenanceCost: 120_000,
  lastMaintenanceDate: new Date("2025-01-01")
};

describe("risk engine", () => {
  it("scores an old pipe with leakage history higher than a new pipe", () => {
    const incidents: IncidentForRisk[] = [
      { incidentType: "LEAKAGE", severity: 4, reportedAt: new Date("2025-03-01") },
      { incidentType: "PIPE_BURST", severity: 5, reportedAt: new Date("2024-07-01") }
    ];
    const oldPipe = calculateAssetRisk({ ...baseAsset, material: "Asbestos Cement", installYear: 1980, criticalityLevel: 5 }, incidents, [], new Date("2026-05-07"));
    const newPipe = calculateAssetRisk(baseAsset, [], [], new Date("2026-05-07"));
    expect(oldPipe.totalRiskScore).toBeGreaterThan(newPipe.totalRiskScore);
    expect(oldPipe.riskLevel).toMatch(/HIGH|CRITICAL/);
  });
});
