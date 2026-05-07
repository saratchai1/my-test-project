import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { runScenarioSimulation } from "@/lib/hydraulic-simulation-engine";
import { SCENARIO_TYPES } from "@/lib/enums";

const schema = z.object({
  estateId: z.string(),
  scenarioType: z.enum(SCENARIO_TYPES),
  rainfallMmPerHr: z.number().optional(),
  durationHr: z.number().optional(),
  pumpAvailabilityPercent: z.number().optional(),
  wastewaterLoadPercent: z.number().optional(),
  blockedPipePercent: z.number().optional(),
  canalWaterLevelM: z.number().optional(),
  leakageSeverityPercent: z.number().optional(),
  backupPumpAvailabilityPercent: z.number().optional(),
  codMgL: z.number().optional(),
  bodMgL: z.number().optional(),
  failedPumpIds: z.array(z.string()).optional(),
  affectedAssetIds: z.array(z.string()).optional()
});

export async function GET() {
  const scenarios = await prisma.scenario.findMany({ include: { estate: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(scenarios);
}

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const result = runScenarioSimulation(body);
  const scenario = await prisma.scenario.create({
    data: {
      estateId: body.estateId,
      name: `${body.scenarioType} ${new Date().toLocaleDateString("th-TH")}`,
      scenarioType: body.scenarioType,
      inputJson: JSON.stringify(body),
      resultJson: JSON.stringify(result)
    }
  });
  return NextResponse.json({ scenario, result });
}
