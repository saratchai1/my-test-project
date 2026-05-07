import { Activity, Gauge, Waves, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetHealthChart, IncidentTrendChart, MaintenanceBudgetChart } from "@/components/dashboard/Charts";
import { KpiCard } from "@/components/dashboard/KpiCard";

export default function HydraulicSimulationPage() {
  const months = ["01", "02", "03", "04", "05", "06", "07", "08"];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">Hydraulic Model Dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground">Mock engineering control dashboard สำหรับติดตาม capacity utilization, pressure profile, pump status และ wastewater load</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <KpiCard title="Network utilization" value="87%" subtitle="เฉลี่ยทั้งระบบ" icon={Gauge} severity="warning" />
        <KpiCard title="Pressure anomaly" value="14 จุด" subtitle="ต่ำ/สูงกว่า threshold" icon={Activity} severity="warning" />
        <KpiCard title="Pump energy efficiency" value="78%" subtitle="ค่าเฉลี่ยสถานีสูบหลัก" icon={Zap} severity="good" />
        <KpiCard title="WWTP loading" value="112%" subtitle="โหลดสูงกว่ากำลังออกแบบ" icon={Waves} severity="critical" />
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card><CardHeader><CardTitle>Pressure Profile Mock</CardTitle></CardHeader><CardContent><AssetHealthChart data={months.map((m, i) => ({ month: m, index: 82 + Math.sin(i) * 9 }))} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Water Level Trend</CardTitle></CardHeader><CardContent><IncidentTrendChart data={months.map((m, i) => ({ month: m, incidents: 18 + i * 3 }))} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Rainfall vs Drainage Capacity</CardTitle></CardHeader><CardContent><MaintenanceBudgetChart data={months.map((m, i) => ({ name: m, budget: 50 + i * 9 }))} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Wastewater Inflow vs WWTP Capacity</CardTitle></CardHeader><CardContent><MaintenanceBudgetChart data={months.map((m, i) => ({ name: m, budget: 76 + i * 6 }))} /></CardContent></Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Pressure Anomaly List</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["PRV-02 แรงดันตก", "ท่อประปา A-07 flow เกิน design", "PS-03 vibration สูง", "MH-204 ระดับน้ำสูง", "WWTP-01 COD เพิ่ม"].map((item) => (
            <div key={item} className="rounded-md border bg-white p-3 text-sm">{item}</div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
