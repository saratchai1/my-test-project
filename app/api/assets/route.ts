import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ASSET_STATUSES, ASSET_TYPES } from "@/lib/enums";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const estateId = params.get("estateId") ?? undefined;
  const assetType = params.get("assetType") ?? undefined;
  const status = params.get("status") ?? undefined;
  const search = params.get("search") ?? undefined;
  const riskLevel = params.get("riskLevel") ?? undefined;

  const where: Prisma.InfrastructureAssetWhereInput = {
    estateId,
    assetType: assetType && ASSET_TYPES.includes(assetType as (typeof ASSET_TYPES)[number]) ? assetType : undefined,
    status: status && ASSET_STATUSES.includes(status as (typeof ASSET_STATUSES)[number]) ? status : undefined,
    OR: search
      ? [
          { assetCode: { contains: search } },
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      : undefined
  };

  const assets = await prisma.infrastructureAsset.findMany({
    where,
    include: {
      estate: true,
      riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 }
    },
    orderBy: { assetCode: "asc" }
  });

  const filtered = riskLevel
    ? assets.filter((asset) => {
        const score = asset.riskAssessments[0]?.totalRiskScore ?? 0;
        if (riskLevel === "LOW") return score <= 25;
        if (riskLevel === "MODERATE") return score > 25 && score <= 50;
        if (riskLevel === "HIGH") return score > 50 && score <= 75;
        if (riskLevel === "CRITICAL") return score > 75;
        return true;
      })
    : assets;

  return NextResponse.json(filtered);
}
