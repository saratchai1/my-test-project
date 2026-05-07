import { prisma } from "@/lib/db";
import { assetsToGeoJson } from "@/lib/geojson";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskDistributionChart } from "@/components/dashboard/Charts";
import { HighRiskAssetList } from "@/components/risk/HighRiskAssetList";
import { RiskFactorBreakdown } from "@/components/risk/RiskFactorBreakdown";
import { DigitalTwinMapClient } from "@/components/map/DigitalTwinMapClient";

export default async function RiskPage() {
  const [risks, assets] = await Promise.all([
    prisma.riskAssessment.findMany({
      where: { totalRiskScore: { gte: 65 } },
      include: { asset: { include: { estate: true } } },
      orderBy: { totalRiskScore: "desc" },
      take: 25
    }),
    prisma.infrastructureAsset.findMany({
      where: { riskAssessments: { some: { totalRiskScore: { gte: 65 } } } },
      include: { riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 } }
    })
  ]);
  const distribution = [
    { name: "ท่อประปา", value: risks.filter((risk) => risk.asset.assetType === "WATER_PIPE").length },
    { name: "ท่อน้ำเสีย", value: risks.filter((risk) => risk.asset.assetType === "WASTEWATER_PIPE").length },
    { name: "ระบายน้ำ", value: risks.filter((risk) => risk.asset.assetType === "DRAINAGE_PIPE").length },
    { name: "สถานีสูบ", value: risks.filter((risk) => risk.asset.assetType === "PUMP_STATION" || risk.asset.assetType === "PUMP").length },
    { name: "อื่นๆ", value: risks.filter((risk) => !["WATER_PIPE", "WASTEWATER_PIPE", "DRAINAGE_PIPE", "PUMP_STATION", "PUMP"].includes(risk.asset.assetType)).length }
  ];
  const avgFactors = risks.reduce(
    (acc, risk) => {
      acc.ageScore += risk.ageScore;
      acc.materialScore += risk.materialScore;
      acc.leakageHistoryScore += risk.leakageHistoryScore;
      acc.hydraulicStressScore += risk.hydraulicStressScore;
      acc.environmentalScore += risk.environmentalScore;
      acc.criticalityScore += risk.criticalityScore;
      acc.maintenanceScore += risk.maintenanceScore;
      return acc;
    },
    { ageScore: 0, materialScore: 0, leakageHistoryScore: 0, hydraulicStressScore: 0, environmentalScore: 0, criticalityScore: 0, maintenanceScore: 0 }
  );
  Object.keys(avgFactors).forEach((key) => {
    avgFactors[key as keyof typeof avgFactors] = Math.round(avgFactors[key as keyof typeof avgFactors] / Math.max(1, risks.length));
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">AI Risk Intelligence</h2>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-muted-foreground">
          แนวทางนี้ช่วยเปลี่ยนจากการตรวจสอบแบบครอบคลุมทุกจุด ไปสู่การตรวจสอบเฉพาะจุดที่มีความเสี่ยงสูงและมีผลกระทบสูง ลดงานภาคสนามที่ไม่จำเป็น
          และเพิ่มประสิทธิภาพการใช้ทรัพยากร
        </p>
      </div>
      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Risk Heatmap / Map Summary</CardTitle>
            <CardDescription>สินทรัพย์คะแนนสูงแสดงเป็นสีแดงและส้มบนแผนที่</CardDescription>
          </CardHeader>
          <CardContent>
            <DigitalTwinMapClient geojson={assetsToGeoJson(assets)} heightClass="h-[480px]" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Critical Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <HighRiskAssetList risks={risks.slice(0, 8)} />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution by Asset Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart data={distribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <RiskFactorBreakdown factors={avgFactors} />
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>From Inspect Everything to Inspect What Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-slate-700">
            Digital Twin ไม่ได้เป็นเพียงแผนที่แสดงข้อมูล แต่เป็นระบบช่วยตัดสินใจเชิงวิศวกรรมและการลงทุน จากการตรวจทุกจุด สู่การตรวจจุดที่มีความเสี่ยงและผลกระทบสูงที่สุด
            เพื่อเลือกแผนซ่อมบำรุงที่ให้ผลลดความเสี่ยงสูงสุดภายใต้งบประมาณจำกัด
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
