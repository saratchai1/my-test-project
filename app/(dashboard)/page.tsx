import { AlertTriangle, Droplets, Factory, Gauge, MapPinned, ShieldCheck, Wrench, Zap } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AssetHealthChart, IncidentTrendChart, MaintenanceBudgetChart, RiskDistributionChart } from "@/components/dashboard/Charts";
import { RiskBadge } from "@/components/assets/AssetStatusBadge";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const [assetCount, criticalRisks, openIncidents, plans, topRisks, byType, incidents] = await Promise.all([
    prisma.infrastructureAsset.count(),
    prisma.riskAssessment.count({ where: { totalRiskScore: { gte: 76 } } }),
    prisma.incident.count({ where: { status: { in: ["OPEN", "INVESTIGATING"] } } }),
    prisma.maintenancePlan.findMany({ include: { estate: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.riskAssessment.findMany({
      include: { asset: { include: { estate: true } } },
      orderBy: { totalRiskScore: "desc" },
      take: 10
    }),
    prisma.infrastructureAsset.groupBy({ by: ["assetType"], _count: true }),
    prisma.incident.findMany({ select: { reportedAt: true } })
  ]);

  const highRiskPipeLength = await prisma.infrastructureAsset.aggregate({
    where: {
      assetType: { in: ["WATER_PIPE", "WASTEWATER_PIPE", "DRAINAGE_PIPE"] },
      riskAssessments: { some: { totalRiskScore: { gte: 70 } } }
    },
    _sum: { lengthM: true }
  });

  const maintenanceBudgetUsed = plans.reduce((sum, plan) => sum + plan.totalEstimatedCost, 0);
  const riskReduction = plans.reduce((sum, plan) => sum + plan.totalRiskReduction, 0);
  const riskDistribution = [
    { name: "ต่ำ", value: await prisma.riskAssessment.count({ where: { totalRiskScore: { lte: 25 } } }) },
    { name: "ปานกลาง", value: await prisma.riskAssessment.count({ where: { totalRiskScore: { gt: 25, lte: 50 } } }) },
    { name: "สูง", value: await prisma.riskAssessment.count({ where: { totalRiskScore: { gt: 50, lte: 75 } } }) },
    { name: "วิกฤต", value: criticalRisks }
  ];
  const trend = Array.from({ length: 12 }, (_, index) => ({
    month: `${index + 1}`,
    incidents: incidents.filter((incident) => incident.reportedAt.getMonth() === index).length
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-6">
        <p className="text-sm font-medium text-cyan-700">IEAT / กนอ.</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
          AI-Enhanced Digital Twin สำหรับบริหารสินทรัพย์โครงสร้างพื้นฐานนิคมอุตสาหกรรม
        </h2>
        <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-600">
          ระบบสนับสนุนการตัดสินใจสำหรับ กนอ. เพื่อคาดการณ์ความเสี่ยง วางแผนซ่อมบำรุง และเพิ่มประสิทธิภาพโครงสร้างพื้นฐานด้านน้ำ น้ำเสีย และระบายน้ำ
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="สินทรัพย์ทั้งหมด" value={formatNumber(assetCount)} subtitle="ท่อ สถานีสูบ WWTP และจุดวิกฤต" icon={Factory} />
        <KpiCard title="สินทรัพย์วิกฤต" value={formatNumber(criticalRisks)} subtitle="Risk score มากกว่า 75" icon={AlertTriangle} severity="critical" />
        <KpiCard title="ระยะท่อเสี่ยงสูง" value={`${formatNumber((highRiskPipeLength._sum.lengthM ?? 0) / 1000, 1)} กม.`} subtitle="ท่อประปา น้ำเสีย และระบายน้ำ" icon={MapPinned} severity="warning" />
        <KpiCard title="เหตุการณ์เปิดอยู่" value={formatNumber(openIncidents)} subtitle="รอแก้ไขหรืออยู่ระหว่างตรวจสอบ" icon={Zap} severity="warning" />
        <KpiCard title="งบซ่อมที่ใช้แล้ว" value={formatCurrency(maintenanceBudgetUsed)} subtitle="จากแผนปีงบประมาณล่าสุด" icon={Wrench} />
        <KpiCard title="ลดความเสี่ยงคาดการณ์" value={formatNumber(riskReduction, 0)} subtitle="คะแนนรวมจากแผนซ่อมบำรุง" icon={ShieldCheck} severity="good" />
        <KpiCard title="NRW / Leakage" value="18.4%" subtitle="ตัวชี้วัดจำลองน้ำสูญเสีย" icon={Droplets} severity="warning" />
        <KpiCard title="Flood readiness" value="82/100" subtitle="ความพร้อมระบบระบายน้ำฝน" icon={Gauge} severity="good" />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>AI Recommendation Summary</CardTitle>
            <CardDescription>ข้อเสนอแนะจากข้อมูลอายุสินทรัพย์ วัสดุ เหตุขัดข้อง Sensor และ criticality</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="rounded-lg border-l-4 border-cyan-500 bg-cyan-50 p-4 text-sm leading-7 text-slate-800">
              ระบบพบสินทรัพย์เสี่ยงวิกฤต {criticalRisks} รายการ โดยส่วนใหญ่อยู่ในระบบรวบรวมน้ำเสียและระบบระบายน้ำฝน แนะนำให้ดำเนินการ CCTV Inspection
              และเปลี่ยนหรือฟื้นฟูท่อรายการสำคัญภายในปีงบประมาณนี้ เพื่อเปลี่ยนจากการซ่อมเมื่อเสีย ไปสู่การบำรุงรักษาเชิงป้องกันและคาดการณ์ล่วงหน้า
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {byType.slice(0, 8).map((item) => (
              <div key={item.assetType} className="flex items-center justify-between text-sm">
                <span>{item.assetType}</span>
                <span className="font-semibold">{item._count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={riskDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Incident Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTrendChart data={trend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asset Health Index</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetHealthChart data={Array.from({ length: 12 }, (_, i) => ({ month: `${i + 1}`, index: 91 - i * 0.8 + (i % 3) }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceBudgetChart data={plans.map((plan) => ({ name: plan.estate.code, budget: plan.totalEstimatedCost }))} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Top 10 High-Risk Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Estate</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Risk</th>
                  <th className="p-3">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {topRisks.map((risk) => (
                  <tr key={risk.id} className="border-t">
                    <td className="p-3">
                      <Link className="font-medium text-primary" href={`/assets/${risk.assetId}`}>
                        {risk.asset.assetCode} · {risk.asset.name}
                      </Link>
                    </td>
                    <td className="p-3">{risk.asset.estate.nameTh}</td>
                    <td className="p-3">{risk.asset.assetType}</td>
                    <td className="p-3">
                      <RiskBadge score={Math.round(risk.totalRiskScore)} />
                    </td>
                    <td className="p-3 text-slate-600">{risk.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
