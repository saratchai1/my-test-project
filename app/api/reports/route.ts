import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [assets, critical, openIncidents, plans] = await Promise.all([
    prisma.infrastructureAsset.count(),
    prisma.riskAssessment.count({ where: { totalRiskScore: { gte: 76 } } }),
    prisma.incident.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } }),
    prisma.maintenancePlan.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);
  return NextResponse.json({ assets, critical, openIncidents, plans });
}
