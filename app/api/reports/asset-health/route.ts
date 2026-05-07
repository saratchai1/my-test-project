import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const byStatus = await prisma.infrastructureAsset.groupBy({ by: ["status"], _count: true });
  const byType = await prisma.infrastructureAsset.groupBy({ by: ["assetType"], _count: true });
  return NextResponse.json({ byStatus, byType });
}
