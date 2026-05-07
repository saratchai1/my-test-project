import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const risks = await prisma.riskAssessment.findMany({
    where: { totalRiskScore: { gte: 70 } },
    include: { asset: { include: { estate: true } } },
    orderBy: { totalRiskScore: "desc" },
    take: 50
  });
  return NextResponse.json(risks);
}
