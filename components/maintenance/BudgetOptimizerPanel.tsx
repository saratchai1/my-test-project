"use client";

import { useState } from "react";
import { Wand2, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ParetoCurveChart } from "@/components/dashboard/Charts";
import { downloadCsv } from "@/lib/export";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { OptimizationResult } from "@/types";

type Estate = { id: string; nameTh: string };

export function BudgetOptimizerPanel({ estates }: { estates: Estate[] }) {
  const [estateId, setEstateId] = useState(estates[0]?.id ?? "");
  const [fiscalYear, setFiscalYear] = useState(2570);
  const [budget, setBudget] = useState(25_000_000);
  const [objective, setObjective] = useState("BALANCED");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/maintenance-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estateId, fiscalYear, budget, objective })
      });
      if (!response.ok) throw new Error("Generate failed");
      setResult((await response.json()) as OptimizationResult);
    } catch {
      setError("ไม่สามารถสร้างแผนได้ กรุณาตรวจสอบฐานข้อมูลและลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!result) return;
    await fetch("/api/maintenance-plan/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estateId,
        name: `AI Maintenance Plan FY${fiscalYear}`,
        fiscalYear,
        budget,
        objective,
        items: result.recommendedPlanItems
      })
    });
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate AI Maintenance Plan</CardTitle>
          <CardDescription>ระบบจะประเมินหลายทางเลือกของการตรวจ ซ่อม เปลี่ยน และฟื้นฟูสินทรัพย์ แล้วจัดลำดับตามผลลดความเสี่ยงต่อค่าใช้จ่าย</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_140px_180px_240px_auto]">
          <Select value={estateId} onChange={(event) => setEstateId(event.target.value)}>
            {estates.map((estate) => (
              <option key={estate.id} value={estate.id}>
                {estate.nameTh}
              </option>
            ))}
          </Select>
          <Input type="number" value={fiscalYear} onChange={(event) => setFiscalYear(Number(event.target.value))} />
          <Input type="number" value={budget} onChange={(event) => setBudget(Number(event.target.value))} />
          <Select value={objective} onChange={(event) => setObjective(event.target.value)}>
            <option value="BALANCED">สมดุลทุกด้าน</option>
            <option value="MINIMIZE_RISK">ลดความเสี่ยงรวม</option>
            <option value="REDUCE_LEAKAGE">ลดน้ำสูญเสีย</option>
            <option value="FLOOD_PREVENTION">ป้องกันน้ำท่วม</option>
            <option value="WASTEWATER_COMPLIANCE">เพิ่ม compliance น้ำเสีย</option>
          </Select>
          <Button onClick={generate} disabled={loading}>
            <Wand2 className="h-4 w-4" />
            {loading ? "กำลังสร้าง" : "Generate"}
          </Button>
        </CardContent>
      </Card>
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
      {result ? (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total cost</p><p className="mt-2 text-xl font-semibold">{formatCurrency(result.totalCost)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Remaining</p><p className="mt-2 text-xl font-semibold">{formatCurrency(result.remainingBudget)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Risk reduction</p><p className="mt-2 text-xl font-semibold">{formatNumber(result.totalExpectedRiskReduction, 1)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Assets covered</p><p className="mt-2 text-xl font-semibold">{result.recommendedPlanItems.length}</p></CardContent></Card>
          </section>
          <Card>
            <CardHeader>
              <CardTitle>Cost-Benefit Pareto Curve</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <ParetoCurveChart data={result.paretoCurve} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Recommended Actions</CardTitle>
                  <CardDescription>เลือกแผนซ่อมบำรุงที่ให้ผลลดความเสี่ยงสูงสุดภายใต้งบประมาณจำกัด</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={save}><Save className="h-4 w-4" />Save plan</Button>
                  <Button variant="outline" onClick={() => downloadCsv("maintenance-plan.csv", result.recommendedPlanItems)}><Download className="h-4 w-4" />CSV</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs text-muted-foreground">
                  <tr><th className="p-3">Priority</th><th className="p-3">Asset</th><th className="p-3">Risk</th><th className="p-3">Action</th><th className="p-3">Cost</th><th className="p-3">Risk reduction</th><th className="p-3">Justification</th></tr>
                </thead>
                <tbody>
                  {result.recommendedPlanItems.map((item) => (
                    <tr key={`${item.assetId}-${item.priorityRank}`} className="border-t align-top">
                      <td className="p-3 font-semibold">{item.priorityRank}</td>
                      <td className="p-3">{item.assetCode} · {item.assetName}</td>
                      <td className="p-3">{item.riskScore}</td>
                      <td className="p-3">{item.actionType}</td>
                      <td className="p-3">{formatCurrency(item.estimatedCost)}</td>
                      <td className="p-3">{item.expectedRiskReduction}</td>
                      <td className="p-3 text-slate-600">{item.justification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
