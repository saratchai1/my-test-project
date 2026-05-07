import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/assets/AssetStatusBadge";
import { formatCurrency } from "@/lib/utils";
import type { ScenarioResult } from "@/types";

export function ScenarioResultPanel({ result }: { result: ScenarioResult }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Impact Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Scenario risk</span>
            <RiskBadge score={result.impactScore} />
          </div>
          <p className="text-sm leading-7 text-slate-700">{result.summaryTh}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-slate-50 p-3"><p className="text-muted-foreground">Cost impact</p><p className="font-semibold">{formatCurrency(result.estimatedCostImpact)}</p></div>
            <div className="rounded-md bg-slate-50 p-3"><p className="text-muted-foreground">Overflow nodes</p><p className="font-semibold">{result.overflowNodeCount ?? "-"}</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {result.recommendationsTh.map((item, index) => (
              <li key={item} className="rounded-md border p-3">{index + 1}. {item}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Affected Assets / Zones</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">Zones: {result.affectedZones.join(", ")}</p>
          <p className="mt-2 text-muted-foreground">Critical assets: {result.criticalAssets.join(", ")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Operational Response Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {result.checklistTh.map((item) => (
              <li key={item} className="rounded-md bg-slate-50 p-2">□ {item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
