import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.infrastructureAsset.findUnique({
    where: { id },
    include: {
      estate: true,
      incidents: { orderBy: { reportedAt: "desc" } },
      sensors: { include: { readings: { orderBy: { timestamp: "desc" }, take: 80 } } },
      riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 },
      workOrders: { orderBy: { scheduledDate: "desc" } },
      maintenancePlanItems: { include: { plan: true }, orderBy: { priorityRank: "asc" } }
    }
  });
  if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  return NextResponse.json(asset);
}
