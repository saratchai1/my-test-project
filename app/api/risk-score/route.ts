import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { calculateAssetRisk } from "@/lib/risk-engine";

const schema = z.object({
  estateId: z.string().optional(),
  assetId: z.string().optional()
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const assets = await prisma.infrastructureAsset.findMany({
    where: { id: body.assetId, estateId: body.estateId },
    include: {
      incidents: true,
      sensors: { include: { readings: { orderBy: { timestamp: "desc" }, take: 50 } } }
    }
  });

  const results = [];
  for (const asset of assets) {
    const readings = asset.sensors.flatMap((sensor) =>
      sensor.readings.map((reading) => ({
        value: reading.value,
        timestamp: reading.timestamp,
        sensor: {
          sensorType: sensor.sensorType,
          minThreshold: sensor.minThreshold,
          maxThreshold: sensor.maxThreshold
        }
      }))
    );
    const risk = calculateAssetRisk(asset, asset.incidents, readings);
    const saved = await prisma.riskAssessment.create({
      data: {
        assetId: asset.id,
        assessmentDate: new Date(),
        totalRiskScore: risk.totalRiskScore,
        probabilityScore: risk.probabilityScore,
        consequenceScore: risk.consequenceScore,
        ageScore: risk.factors.ageScore,
        materialScore: risk.factors.materialScore,
        leakageHistoryScore: risk.factors.leakageHistoryScore,
        hydraulicStressScore: risk.factors.hydraulicStressScore,
        environmentalScore: risk.factors.environmentalScore,
        criticalityScore: risk.factors.criticalityScore,
        maintenanceScore: risk.factors.maintenanceScore,
        recommendation: risk.recommendation
      }
    });
    results.push(saved);
  }
  return NextResponse.json({ recalculated: results.length, results });
}
