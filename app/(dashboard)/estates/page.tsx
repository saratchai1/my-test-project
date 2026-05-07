import { prisma } from "@/lib/db";
import { EstateRegionCatalog } from "@/components/estates/EstateRegionCatalog";
import { Card, CardContent } from "@/components/ui/card";

export default async function EstatesPage() {
  const count = await prisma.industrialEstate.count();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">รายชื่อนิคมอุตสาหกรรม</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ใช้ master list ตามภาพแนบของคุณสำหรับตัวเลือกนิคมอุตสาหกรรมทั้งหมด ปัจจุบัน seed database มี {count} นิคม
        </p>
      </div>
      <EstateRegionCatalog />
      <Card>
        <CardContent className="p-5 text-sm leading-7 text-slate-700">
          รายการนี้จะถูกใช้ร่วมกันใน dropdown หน้าแผนที่ แผนซ่อมบำรุง AI และ Scenario Simulation เพื่อให้ข้อมูลนิคมตรงกันทั้งระบบ
        </CardContent>
      </Card>
    </div>
  );
}
