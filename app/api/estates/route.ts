import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const estates = await prisma.industrialEstate.findMany({ orderBy: { code: "asc" } });
  return NextResponse.json(estates);
}
