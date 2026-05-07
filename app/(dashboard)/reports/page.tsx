import { FileDown, Printer } from "lucide-react";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default async function ReportsPage() {
  const [assets, critical, incidents, plans] = await Promise.all([
    prisma.infrastructureAsset.count(),
    prisma.riskAssessment.count({ where: { totalRiskScore: { gte: 76 } } }),
    prisma.incident.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } }),
    prisma.maintenancePlan.findMany({ include: { estate: true }, take: 6 })
  ]);
  const cards = [
    ["Asset Health Report", "ภาพรวมสถานะสินทรัพย์และแนวโน้ม health index", `${assets} assets`],
    ["High Risk Infrastructure Report", "สินทรัพย์เสี่ยงสูงพร้อมคำแนะนำตรวจ/ซ่อม", `${critical} critical`],
    ["Preventive Maintenance Plan", "แผนตรวจ ซ่อม เปลี่ยน และฟื้นฟูตามลำดับความเสี่ยง", `${plans.length} plans`],
    ["Flood Readiness Report", "ความพร้อมระบบระบายน้ำ สถานีสูบ และคลองรับน้ำ", "82/100 readiness"],
    ["Wastewater System Compliance Report", "โหลด WWTP, COD/BOD และความเสี่ยง compliance", "Mock compliance"],
    ["Budget Optimization Report", "ผลลดความเสี่ยงต่อค่าใช้จ่ายและ Pareto curve", formatCurrency(plans.reduce((s, p) => s + p.totalEstimatedCost, 0))]
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <h2 className="text-2xl font-semibold tracking-normal">รายงานผู้บริหาร</h2>
          <p className="mt-2 text-sm text-muted-foreground">รายงานสำหรับพิมพ์หรือส่งออกข้อมูล CSV เพื่อประกอบการตัดสินใจและงบประมาณ</p>
        </div>
        <Button variant="outline"><Printer className="h-4 w-4" />Print</Button>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, summary, metric]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{metric}</p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm"><FileDown className="h-4 w-4" />Export CSV</Button>
                <Button variant="ghost" size="sm">Preview</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader><CardTitle>Management Summary</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-700">
            ระบบช่วยลดความเสี่ยงน้ำท่วมในนิคม ลดน้ำสูญเสีย ลดเหตุท่อแตก/ท่ออุดตัน เพิ่มความมั่นคงของระบบบำบัดน้ำเสีย ลด OPEX
            และสนับสนุน ESG / Smart Industrial Estate โดยเปลี่ยนข้อมูล GIS ให้เป็น decision support platform
          </p>
          <p className="mt-3 text-sm text-muted-foreground">Open incidents: {incidents}</p>
        </CardContent>
      </Card>
    </div>
  );
}
