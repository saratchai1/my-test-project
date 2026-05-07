import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const estateId = request.nextUrl.searchParams.get("estateId") ?? undefined;
  const sensors = await prisma.sensor.findMany({
    where: { estateId },
    include: { asset: true },
    orderBy: { sensorCode: "asc" }
  });
  return NextResponse.json(sensors);
}
