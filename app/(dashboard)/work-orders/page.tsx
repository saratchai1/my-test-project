import { prisma } from "@/lib/db";
import { WorkOrderBoard } from "@/components/work-orders/WorkOrderBoard";
import { WorkOrderForm } from "@/components/work-orders/WorkOrderForm";

export default async function WorkOrdersPage() {
  const workOrders = await prisma.workOrder.findMany({
    include: { asset: true, estate: true },
    orderBy: { scheduledDate: "asc" }
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">ใบสั่งงานซ่อมบำรุง</h2>
          <p className="mt-2 text-sm text-muted-foreground">ติดตามงานตรวจ ซ่อม ล้างท่อ CCTV Inspection และงานแก้ไขเหตุขัดข้องจากภาคสนาม</p>
        </div>
        <WorkOrderForm />
      </div>
      <WorkOrderBoard workOrders={workOrders} />
    </div>
  );
}
