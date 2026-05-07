import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const plans = await prisma.maintenancePlan.findMany({ include: { estate: true, items: true } });
  return NextResponse.json(plans);
}
