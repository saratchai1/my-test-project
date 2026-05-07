import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { optimizeMaintenancePlan } from "@/lib/optimization-engine";
import { ACTION_TYPES, PLAN_OBJECTIVES } from "@/lib/enums";

const generateSchema = z.object({
  estateId: z.string(),
  fiscalYear: z.number().int(),
  budget: z.number().positive(),
  objective: z.enum(PLAN_OBJECTIVES)
});

const saveSchema = z.object({
  estateId: z.string(),
  name: z.string(),
  fiscalYear: z.number().int(),
  budget: z.number().positive(),
  objective: z.enum(PLAN_OBJECTIVES),
  items: z.array(
    z.object({
      assetId: z.string(),
      actionType: z.enum(ACTION_TYPES),
      priorityRank: z.number().int(),
      estimatedCost: z.number(),
      expectedRiskReduction: z.number(),
      expectedBenefit: z.number(),
      justification: z.string()
    })
  )
});

async function generate(body: z.infer<typeof generateSchema>) {
  const assets = await prisma.infrastructureAsset.findMany({
    where: { estateId: body.estateId },
    include: { riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 } }
  });
  return optimizeMaintenancePlan(
    assets.map((asset) => ({
      ...asset,
      risk: {
        totalRiskScore: asset.riskAssessments[0]?.totalRiskScore ?? 0,
        probabilityScore: asset.riskAssessments[0]?.probabilityScore ?? 0,
        consequenceScore: asset.riskAssessments[0]?.consequenceScore ?? 0,
        factors: {
          ageScore: asset.riskAssessments[0]?.ageScore ?? 0,
          materialScore: asset.riskAssessments[0]?.materialScore ?? 0,
          leakageHistoryScore: asset.riskAssessments[0]?.leakageHistoryScore ?? 0,
          hydraulicStressScore: asset.riskAssessments[0]?.hydraulicStressScore ?? 0,
          environmentalScore: asset.riskAssessments[0]?.environmentalScore ?? 0,
          criticalityScore: asset.riskAssessments[0]?.criticalityScore ?? 0,
          maintenanceScore: asset.riskAssessments[0]?.maintenanceScore ?? 0
        },
        riskLevel: "LOW",
        recommendation: asset.riskAssessments[0]?.recommendation ?? ""
      }
    })),
    body.budget,
    body.objective
  );
}

export async function GET() {
  const plans = await prisma.maintenancePlan.findMany({
    include: { estate: true, items: { include: { asset: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(plans);
}

export async function POST(request: Request) {
  const json = await request.json();
  if ("items" in json) {
    const body = saveSchema.parse(json);
    const totalEstimatedCost = body.items.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalRiskReduction = body.items.reduce((sum, item) => sum + item.expectedRiskReduction, 0);
    const plan = await prisma.maintenancePlan.create({
      data: {
        estateId: body.estateId,
        name: body.name,
        fiscalYear: body.fiscalYear,
        budget: body.budget,
        objective: body.objective,
        totalEstimatedCost,
        totalRiskReduction,
        items: {
          create: body.items.map((item) => ({
            assetId: item.assetId,
            actionType: item.actionType,
            priorityRank: item.priorityRank,
            estimatedCost: item.estimatedCost,
            expectedRiskReduction: item.expectedRiskReduction,
            expectedBenefit: item.expectedBenefit,
            justification: item.justification
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json(plan);
  }
  const body = generateSchema.parse(json);
  return NextResponse.json(await generate(body));
}
