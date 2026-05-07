import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/assets/AssetStatusBadge";

export function AssetPopup({
  assetId,
  name,
  assetType,
  status,
  riskScore,
  recommendation
}: {
  assetId: string;
  name: string;
  assetType: string;
  status: string;
  riskScore: number;
  recommendation: string;
}) {
  return (
    <div className="w-64 space-y-2 text-sm">
      <p className="font-semibold text-slate-900">{name}</p>
      <p className="text-xs text-muted-foreground">
        {assetType} · {status}
      </p>
      <RiskBadge score={Math.round(riskScore)} />
      <p className="text-xs leading-5 text-slate-700">{recommendation}</p>
      <Link className="inline-flex h-8 items-center rounded-md bg-primary px-2 text-xs font-medium text-white" href={`/assets/${assetId}`}>
        รายละเอียด
      </Link>
    </div>
  );
}
