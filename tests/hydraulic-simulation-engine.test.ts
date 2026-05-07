import { describe, expect, it } from "vitest";
import { runScenarioSimulation } from "@/lib/hydraulic-simulation-engine";

describe("scenario simulation engine", () => {
  it("produces higher flood risk when rainfall increases", () => {
    const low = runScenarioSimulation({
      estateId: "map",
      scenarioType: "HEAVY_RAIN",
      rainfallMmPerHr: 35,
      durationHr: 2,
      pumpAvailabilityPercent: 90
    });
    const high = runScenarioSimulation({
      estateId: "map",
      scenarioType: "HEAVY_RAIN",
      rainfallMmPerHr: 95,
      durationHr: 2,
      pumpAvailabilityPercent: 90
    });
    expect(high.impactScore).toBeGreaterThan(low.impactScore);
    expect(high.estimatedFloodedAreaRai ?? 0).toBeGreaterThan(low.estimatedFloodedAreaRai ?? 0);
  });
});
