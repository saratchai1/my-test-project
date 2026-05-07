import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ACTION_TYPES, WORK_PRIORITIES } from "@/lib/enums";

const createSchema = z.object({
  estateId: z.string(),
  assetId: z.string().optional(),
  title: z.string(),
  description: z.string(),
  actionType: z.enum(ACTION_TYPES),
  priority: z.enum(WORK_PRIORITIES),
  assignedTeam: z.string(),
  scheduledDate: z.string(),
  estimatedCost: z.number()
});

export async function GET(request: NextRequest) {
  const estateId = request.nextUrl.searchParams.get("estateId") ?? undefined;
  const workOrders = await prisma.workOrder.findMany({
    where: { estateId },
    include: { asset: true, estate: true },
    orderBy: { scheduledDate: "asc" }
  });
  return NextResponse.json(workOrders);
}

export async function POST(request: Request) {
  const body = createSchema.parse(await request.json());
  const count = await prisma.workOrder.count({ where: { estateId: body.estateId } });
  const workOrder = await prisma.workOrder.create({
    data: {
      ...body,
      scheduledDate: new Date(body.scheduledDate),
      workOrderCode: `WO-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`
    }
  });
  return NextResponse.json(workOrder, { status: 201 });
}
