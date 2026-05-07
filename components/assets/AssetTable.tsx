"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { AssetStatusBadge, AssetTypeBadge, RiskBadge } from "@/components/assets/AssetStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { downloadCsv } from "@/lib/export";

type AssetRow = {
  id: string;
  assetCode: string;
  name: string;
  assetType: string;
  material: string | null;
  installYear: number | null;
  status: string;
  lastInspectionDate: string | Date | null;
  lastMaintenanceDate: string | Date | null;
  estate: { id: string; nameTh: string };
  riskAssessments: { totalRiskScore: number; recommendation: string }[];
};

export function AssetTable({ assets }: { assets: AssetRow[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [risk, setRisk] = useState("ALL");
  const filtered = useMemo(() => {
    return assets
      .filter((asset) => `${asset.assetCode} ${asset.name}`.toLowerCase().includes(search.toLowerCase()))
      .filter((asset) => type === "ALL" || asset.assetType === type)
      .filter((asset) => {
        const score = asset.riskAssessments[0]?.totalRiskScore ?? 0;
        if (risk === "ALL") return true;
        if (risk === "CRITICAL") return score > 75;
        if (risk === "HIGH") return score > 50 && score <= 75;
        if (risk === "MODERATE") return score > 25 && score <= 50;
        return score <= 25;
      })
      .sort((a, b) => (b.riskAssessments[0]?.totalRiskScore ?? 0) - (a.riskAssessments[0]?.totalRiskScore ?? 0));
  }, [assets, risk, search, type]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_220px_auto]">
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาด้วยรหัสหรือชื่อสินทรัพย์" />
        <Select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="ALL">ทุกประเภท</option>
          {Array.from(new Set(assets.map((asset) => asset.assetType))).map((assetType) => (
            <option key={assetType} value={assetType}>
              {assetType}
            </option>
          ))}
        </Select>
        <Select value={risk} onChange={(event) => setRisk(event.target.value)}>
          <option value="ALL">ทุกระดับความเสี่ยง</option>
          <option value="CRITICAL">วิกฤต</option>
          <option value="HIGH">สูง</option>
          <option value="MODERATE">ปานกลาง</option>
          <option value="LOW">ต่ำ</option>
        </Select>
        <Button
          variant="outline"
          onClick={() =>
            downloadCsv(
              "assets.csv",
              filtered.map((asset) => ({
                assetCode: asset.assetCode,
                name: asset.name,
                estate: asset.estate.nameTh,
                type: asset.assetType,
                status: asset.status,
                risk: asset.riskAssessments[0]?.totalRiskScore ?? 0,
                recommendation: asset.riskAssessments[0]?.recommendation ?? ""
              }))
            )
          }
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-muted-foreground">
            <tr>
              <th className="p-3">Asset code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Estate</th>
              <th className="p-3">Type</th>
              <th className="p-3">Material</th>
              <th className="p-3">Age</th>
              <th className="p-3">Status</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((asset) => {
              const score = Math.round(asset.riskAssessments[0]?.totalRiskScore ?? 0);
              return (
                <tr key={asset.id} className="border-t align-top hover:bg-slate-50">
                  <td className="p-3 font-medium text-primary">
                    <Link href={`/assets/${asset.id}`}>{asset.assetCode}</Link>
                  </td>
                  <td className="p-3">{asset.name}</td>
                  <td className="p-3">{asset.estate.nameTh}</td>
                  <td className="p-3">
                    <AssetTypeBadge type={asset.assetType} />
                  </td>
                  <td className="p-3">{asset.material ?? "-"}</td>
                  <td className="p-3">{asset.installYear ? 2026 - asset.installYear : "-"}</td>
                  <td className="p-3">
                    <AssetStatusBadge status={asset.status} />
                  </td>
                  <td className="p-3">
                    <RiskBadge score={score} />
                  </td>
                  <td className="max-w-md p-3 text-slate-600">{asset.riskAssessments[0]?.recommendation ?? "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 ? <div className="rounded-lg border bg-white p-8 text-center text-sm text-muted-foreground">ไม่พบข้อมูลตามเงื่อนไข</div> : null}
    </div>
  );
}
