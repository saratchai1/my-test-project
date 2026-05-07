import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { WORK_ORDER_STATUSES } from "@/lib/enums";

const patchSchema = z.object({
  status: z.enum(WORK_ORDER_STATUSES).optional(),
  assignedTeam: z.string().optional(),
  completedDate: z.string().optional()
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = patchSchema.parse(await request.json());
  const workOrder = await prisma.workOrder.update({
    where: { id },
    data: {
      ...body,
      completedDate: body.completedDate ? new Date(body.completedDate) : undefined
    }
  });
  return NextResponse.json(workOrder);
}
