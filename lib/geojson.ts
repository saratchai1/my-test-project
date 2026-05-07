import type { GeoJsonFeature, GeoJsonFeatureCollection } from "@/types";

export type AssetMapRecord = {
  id: string;
  estateId: string;
  assetCode: string;
  assetType: string;
  name: string;
  status: string;
  geometryGeoJson: string;
  riskAssessments: { totalRiskScore: number; recommendation: string }[];
};

export function assetsToGeoJson(assets: AssetMapRecord[]): GeoJsonFeatureCollection {
  return {
    type: "FeatureCollection",
    features: assets.map((asset) => {
      const geometry = JSON.parse(asset.geometryGeoJson) as GeoJsonFeature["geometry"];
      const risk = asset.riskAssessments[0]?.totalRiskScore ?? 0;
      return {
        type: "Feature",
        geometry,
        properties: {
          assetId: asset.id,
          estateId: asset.estateId,
          assetCode: asset.assetCode,
          assetType: asset.assetType,
          name: asset.name,
          status: asset.status,
          riskScore: risk,
          recommendation: asset.riskAssessments[0]?.recommendation ?? ""
        }
      };
    })
  };
}

export function emptyFeatureCollection(): GeoJsonFeatureCollection {
  return { type: "FeatureCollection", features: [] };
}
