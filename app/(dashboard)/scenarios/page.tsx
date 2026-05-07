import { prisma } from "@/lib/db";
import { ScenarioBuilder } from "@/components/scenarios/ScenarioBuilder";

export default async function ScenariosPage() {
  const estates = await prisma.industrialEstate.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">จำลองสถานการณ์โครงสร้างพื้นฐาน</h2>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">
          จำลองฝนตกหนัก เครื่องสูบน้ำขัดข้อง ท่อรั่ว ท่ออุดตัน โหลดน้ำเสียสูง และ combined stress เพื่อเตรียมแผนป้องกันล่วงหน้า
        </p>
      </div>
      <ScenarioBuilder estates={estates} />
    </div>
  );
}
