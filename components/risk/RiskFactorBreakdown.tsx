import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  ageScore: "อายุสินทรัพย์",
  materialScore: "วัสดุ",
  leakageHistoryScore: "ประวัติชำรุด",
  hydraulicStressScore: "Hydraulic Stress",
  environmentalScore: "สภาพแวดล้อม",
  criticalityScore: "ความสำคัญ",
  maintenanceScore: "ประวัติบำรุงรักษา"
};

export function RiskFactorBreakdown({ factors }: { factors: Record<string, number> }) {
  return (
    <div className="space-y-3">
      {Object.entries(factors).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">{labels[key] ?? key}</span>
            <span className="text-muted-foreground">{Math.round(value)}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className={cn("h-2 rounded-full", value > 75 ? "bg-red-500" : value > 50 ? "bg-orange-400" : value > 25 ? "bg-yellow-400" : "bg-emerald-500")}
              style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
