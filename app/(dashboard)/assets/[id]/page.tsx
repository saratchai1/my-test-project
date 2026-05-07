import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardPlus, MapPinned, Play, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { assetsToGeoJson } from "@/lib/geojson";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetStatusBadge, AssetTypeBadge } from "@/components/assets/AssetStatusBadge";
import { RiskScoreCard } from "@/components/risk/RiskScoreCard";
import { RiskFactorBreakdown } from "@/components/risk/RiskFactorBreakdown";
import { AssetDetailPanel } from "@/components/assets/AssetDetailPanel";
import { DigitalTwinMapClient } from "@/components/map/DigitalTwinMapClient";

export default async function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.infrastructureAsset.findUnique({
    where: { id },
    include: {
      estate: true,
      incidents: { orderBy: { reportedAt: "desc" } },
      sensors: { include: { readings: { orderBy: { timestamp: "desc" }, take: 24 } } },
      riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 },
      workOrders: { orderBy: { scheduledDate: "desc" } },
      maintenancePlanItems: { include: { plan: true } }
    }
  });
  if (!asset) notFound();
  const risk = asset.riskAssessments[0];
  const geojson = assetsToGeoJson([asset]);
  const factors: Record<string, number> = risk
    ? {
        ageScore: risk.ageScore,
        materialScore: risk.materialScore,
        leakageHistoryScore: risk.leakageHistoryScore,
        hydraulicStressScore: risk.hydraulicStressScore,
        environmentalScore: risk.environmentalScore,
        criticalityScore: risk.criticalityScore,
        maintenanceScore: risk.maintenanceScore
      }
    : {
        ageScore: 0,
        materialScore: 0,
        leakageHistoryScore: 0,
        hydraulicStressScore: 0,
        environmentalScore: 0,
        criticalityScore: 0,
        maintenanceScore: 0
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <Link href="/assets" className="text-sm text-primary">
            กลับทะเบียนสินทรัพย์
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">{asset.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {asset.assetCode} · {asset.estate.nameTh}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <AssetTypeBadge type={asset.assetType} />
            <AssetStatusBadge status={asset.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <ClipboardPlus className="h-4 w-4" />
            Create work order
          </Button>
          <Button variant="outline">
            <PlusCircle className="h-4 w-4" />
            Add to maintenance plan
          </Button>
          <Button variant="secondary">
            <Play className="h-4 w-4" />
            Run scenario
          </Button>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <RiskScoreCard
          total={Math.round(risk?.totalRiskScore ?? 0)}
          probability={Math.round(risk?.probabilityScore ?? 0)}
          consequence={Math.round(risk?.consequenceScore ?? 0)}
          recommendation={risk?.recommendation ?? "ยังไม่มีผลประเมินความเสี่ยง"}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="h-4 w-4" />
              Mini Digital Twin Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DigitalTwinMapClient geojson={geojson} heightClass="h-[360px]" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <AssetDetailPanel title="ข้อมูลพื้นฐาน">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">วัสดุ</dt><dd>{asset.material ?? "-"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">เส้นผ่านศูนย์กลาง</dt><dd>{asset.diameterMm ?? "-"} mm</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">ความยาว</dt><dd>{asset.lengthM ?? "-"} m</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">ปีติดตั้ง</dt><dd>{asset.installYear ?? "-"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Criticality</dt><dd>{asset.criticalityLevel}/5</dd></div>
          </dl>
        </AssetDetailPanel>
        <AssetDetailPanel title="Risk factor breakdown">
          <RiskFactorBreakdown factors={factors} />
        </AssetDetailPanel>
        <AssetDetailPanel title="Sensor ล่าสุด">
          <div className="space-y-2 text-sm">
            {asset.sensors.slice(0, 8).map((sensor) => (
              <div key={sensor.id} className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                <span>{sensor.name}</span>
                <span className="font-medium">{sensor.readings[0]?.value ?? "-"} {sensor.unit}</span>
              </div>
            ))}
            {asset.sensors.length === 0 ? <p className="text-muted-foreground">ยังไม่มี Sensor ผูกกับสินทรัพย์นี้</p> : null}
          </div>
        </AssetDetailPanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AssetDetailPanel title="Incident history">
          <div className="space-y-2 text-sm">
            {asset.incidents.map((incident) => (
              <div key={incident.id} className="rounded-md border p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-medium">{incident.title}</p>
                  <span>Severity {incident.severity}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{incident.reportedAt.toLocaleDateString("th-TH")} · {incident.status}</p>
              </div>
            ))}
          </div>
        </AssetDetailPanel>
        <AssetDetailPanel title="Related work orders">
          <div className="space-y-2 text-sm">
            {asset.workOrders.map((order) => (
              <div key={order.id} className="rounded-md border p-3">
                <div className="flex justify-between gap-3">
                  <p className="font-medium">{order.workOrderCode} · {order.title}</p>
                  <span>{order.status}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{order.assignedTeam} · {order.scheduledDate.toLocaleDateString("th-TH")}</p>
              </div>
            ))}
          </div>
        </AssetDetailPanel>
      </section>
    </div>
  );
}
