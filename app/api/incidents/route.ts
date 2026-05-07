import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const estateId = request.nextUrl.searchParams.get("estateId") ?? undefined;
  const incidents = await prisma.incident.findMany({
    where: { estateId },
    include: { estate: true, asset: true },
    orderBy: { reportedAt: "desc" }
  });
  return NextResponse.json(incidents);
}
