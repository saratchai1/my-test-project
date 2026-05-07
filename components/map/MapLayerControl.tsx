"use client";

import { Layers } from "lucide-react";

const layers = [
  ["WATER_PIPE", "ท่อประปา"],
  ["WASTEWATER_PIPE", "ท่อน้ำเสีย"],
  ["DRAINAGE_PIPE", "ท่อระบายน้ำ"],
  ["PUMP_STATION", "สถานีสูบ"],
  ["WWTP", "WWTP"],
  ["SENSOR_NODE", "Sensors"],
  ["INCIDENTS", "Incidents"],
  ["HIGH_RISK", "High-risk"]
];

export function MapLayerControl({
  visibleLayers,
  onToggle
}: {
  visibleLayers: string[];
  onToggle: (layer: string) => void;
}) {
  return (
    <div className="rounded-lg border bg-white p-3 text-xs shadow-sm">
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Layers className="h-4 w-4" />
        ชั้นข้อมูล
      </div>
      <div className="grid grid-cols-2 gap-2">
        {layers.map(([id, label]) => (
          <label key={id} className="flex items-center gap-2">
            <input type="checkbox" checked={visibleLayers.includes(id)} onChange={() => onToggle(id)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
