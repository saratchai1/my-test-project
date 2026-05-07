import Link from "next/link";
import { RiskBadge } from "@/components/assets/AssetStatusBadge";

export type HighRiskRecord = {
  id: string;
  assetId: string;
  totalRiskScore: number;
  probabilityScore: number;
  consequenceScore: number;
  recommendation: string;
  asset: { assetCode: string; name: string; assetType: string; estate: { nameTh: string } };
};

export function HighRiskAssetList({ risks }: { risks: HighRiskRecord[] }) {
  return (
    <div className="space-y-2">
      {risks.map((risk) => (
        <Link key={risk.id} href={`/assets/${risk.assetId}`} className="block rounded-md border bg-white p-3 hover:bg-slate-50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-primary">{risk.asset.assetCode} · {risk.asset.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{risk.asset.estate.nameTh} · {risk.asset.assetType}</p>
            </div>
            <RiskBadge score={Math.round(risk.totalRiskScore)} />
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-600">{risk.recommendation}</p>
        </Link>
      ))}
    </div>
  );
}
