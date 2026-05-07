"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ScenarioResultPanel } from "@/components/scenarios/ScenarioResultPanel";
import type { ScenarioResult } from "@/types";

type Estate = { id: string; nameTh: string };

export function ScenarioBuilder({ estates }: { estates: Estate[] }) {
  const [estateId, setEstateId] = useState(estates[0]?.id ?? "");
  const [scenarioType, setScenarioType] = useState("HEAVY_RAIN");
  const [rainfallMmPerHr, setRainfallMmPerHr] = useState(75);
  const [durationHr, setDurationHr] = useState(3);
  const [pumpAvailabilityPercent, setPumpAvailabilityPercent] = useState(70);
  const [wastewaterLoadPercent, setWastewaterLoadPercent] = useState(115);
  const [blockedPipePercent, setBlockedPipePercent] = useState(40);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    const response = await fetch("/api/scenarios/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estateId, scenarioType, rainfallMmPerHr, durationHr, pumpAvailabilityPercent, wastewaterLoadPercent, blockedPipePercent })
    });
    const json = (await response.json()) as { result: ScenarioResult };
    setResult(json.result);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Scenario Builder</CardTitle>
          <CardDescription>การจำลองสถานการณ์ช่วยให้ กนอ. เห็นผลกระทบล่วงหน้าก่อนตัดสินใจดำเนินมาตรการป้องกัน</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Select value={estateId} onChange={(event) => setEstateId(event.target.value)}>
            {estates.map((estate) => <option key={estate.id} value={estate.id}>{estate.nameTh}</option>)}
          </Select>
          <Select value={scenarioType} onChange={(event) => setScenarioType(event.target.value)}>
            <option value="HEAVY_RAIN">Heavy rain</option>
            <option value="PUMP_FAILURE">Pump failure</option>
            <option value="PIPE_LEAKAGE">Pipe leakage</option>
            <option value="PIPE_BLOCKAGE">Pipe blockage</option>
            <option value="WASTEWATER_OVERLOAD">Wastewater overload</option>
            <option value="COMBINED_STRESS">Combined stress</option>
          </Select>
          <Input type="number" value={rainfallMmPerHr} onChange={(event) => setRainfallMmPerHr(Number(event.target.value))} aria-label="rainfall" />
          <Input type="number" value={durationHr} onChange={(event) => setDurationHr(Number(event.target.value))} aria-label="duration" />
          <Input type="number" value={pumpAvailabilityPercent} onChange={(event) => setPumpAvailabilityPercent(Number(event.target.value))} aria-label="pump availability" />
          <Button onClick={run} disabled={loading}>
            <Play className="h-4 w-4" />
            {loading ? "Running" : "Run simulation"}
          </Button>
          <Input type="number" value={wastewaterLoadPercent} onChange={(event) => setWastewaterLoadPercent(Number(event.target.value))} aria-label="wastewater load" />
          <Input type="number" value={blockedPipePercent} onChange={(event) => setBlockedPipePercent(Number(event.target.value))} aria-label="blocked pipe" />
        </CardContent>
      </Card>
      {result ? <ScenarioResultPanel result={result} /> : null}
    </div>
  );
}
