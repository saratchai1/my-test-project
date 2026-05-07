import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/assets/AssetStatusBadge";

export function RiskScoreCard({
  total,
  probability,
  consequence,
  recommendation
}: {
  total: number;
  probability: number;
  consequence: number;
  recommendation: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">AI Risk Score</p>
            <p className="mt-2 text-4xl font-semibold">{total}</p>
          </div>
          <RiskBadge score={total} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-muted-foreground">Probability</p>
            <p className="text-lg font-semibold">{probability}</p>
          </div>
          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-muted-foreground">Consequence</p>
            <p className="text-lg font-semibold">{consequence}</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700">{recommendation}</p>
      </CardContent>
    </Card>
  );
}
