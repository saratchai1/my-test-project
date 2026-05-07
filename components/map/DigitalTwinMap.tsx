"use client";

import { useMemo, useState } from "react";
import { GeoJSON, MapContainer, Popup, TileLayer } from "react-leaflet";
import L, { type Layer, type PathOptions } from "leaflet";
import { MapLayerControl } from "@/components/map/MapLayerControl";
import { RiskLegend } from "@/components/map/RiskLegend";
import type { GeoJsonFeature, GeoJsonFeatureCollection } from "@/types";

function riskColor(score: number) {
  if (score <= 25) return "#10b981";
  if (score <= 50) return "#facc15";
  if (score <= 75) return "#f97316";
  return "#dc2626";
}

function typeColor(type: string) {
  if (type === "WATER_PIPE") return "#2563eb";
  if (type === "WASTEWATER_PIPE") return "#7c3aed";
  if (type === "DRAINAGE_PIPE") return "#0891b2";
  return "#0f172a";
}

function featureStyle(feature?: GeoJsonFeature): PathOptions {
  const risk = Number(feature?.properties.riskScore ?? 0);
  const type = String(feature?.properties.assetType ?? "");
  return {
    color: risk >= 70 ? riskColor(risk) : typeColor(type),
    weight: type.includes("PIPE") ? 4 : 2,
    fillColor: riskColor(risk),
    fillOpacity: 0.75,
    opacity: 0.9
  };
}

export function DigitalTwinMap({
  geojson,
  heightClass = "h-[620px]",
  riskMode = true
}: {
  geojson: GeoJsonFeatureCollection;
  heightClass?: string;
  riskMode?: boolean;
}) {
  const [visibleLayers, setVisibleLayers] = useState<string[]>([
    "WATER_PIPE",
    "WASTEWATER_PIPE",
    "DRAINAGE_PIPE",
    "PUMP_STATION",
    "WWTP",
    "SENSOR_NODE",
    "HIGH_RISK"
  ]);
  const filtered = useMemo(
    () => ({
      ...geojson,
      features: geojson.features.filter((feature) => {
        const type = String(feature.properties.assetType ?? "");
        const score = Number(feature.properties.riskScore ?? 0);
        return visibleLayers.includes(type) || (visibleLayers.includes("HIGH_RISK") && score >= 70);
      })
    }),
    [geojson, visibleLayers]
  );

  return (
    <div className={`relative overflow-hidden rounded-lg border bg-white ${heightClass}`}>
      <MapContainer center={[13.05, 100.85]} zoom={8} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON
          key={JSON.stringify(visibleLayers)}
          data={filtered}
          style={(feature) => (riskMode ? featureStyle(feature as GeoJsonFeature) : featureStyle(feature as GeoJsonFeature))}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: Number(feature.properties?.riskScore ?? 0) >= 76 ? 9 : 7,
              color: "#ffffff",
              weight: 1,
              fillColor: riskColor(Number(feature.properties?.riskScore ?? 0)),
              fillOpacity: 0.9
            });
          }}
          onEachFeature={(feature, layer: Layer) => {
            const props = feature.properties ?? {};
            layer.bindPopup(
              `<strong>${props.name ?? ""}</strong><br/>${props.assetCode ?? ""}<br/>Risk: ${props.riskScore ?? 0}<br/>${props.recommendation ?? ""}<br/><a href="/assets/${props.assetId}">ดูรายละเอียด</a>`
            );
          }}
        />
      </MapContainer>
      <div className="absolute left-4 top-4 z-[500] w-80">
        <MapLayerControl
          visibleLayers={visibleLayers}
          onToggle={(layer) =>
            setVisibleLayers((current) => (current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]))
          }
        />
      </div>
      <div className="absolute bottom-4 right-4 z-[500]">
        <RiskLegend />
      </div>
    </div>
  );
}
