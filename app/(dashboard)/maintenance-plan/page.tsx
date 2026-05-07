import { prisma } from "@/lib/db";
import { BudgetOptimizerPanel } from "@/components/maintenance/BudgetOptimizerPanel";

export default async function MaintenancePlanPage() {
  const estates = await prisma.industrialEstate.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">แผนซ่อมบำรุง AI และ Budget Optimization</h2>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">
          ระบบจะประเมินหลายทางเลือกของการตรวจ ซ่อม เปลี่ยน และฟื้นฟูสินทรัพย์ จากนั้นจัดลำดับตามผลลดความเสี่ยงต่อค่าใช้จ่าย
          เพื่อให้ผู้บริหารสามารถเลือกแผนลงทุนที่เหมาะสมที่สุด
        </p>
      </div>
      <BudgetOptimizerPanel estates={estates} />
    </div>
  );
}
