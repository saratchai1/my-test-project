export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type GeoJsonGeometry =
  | { type: "Point"; coordinates: [number, number] }
  | { type: "LineString"; coordinates: [number, number][] }
  | { type: "Polygon"; coordinates: [number, number][][] };

export type GeoJsonFeature = {
  type: "Feature";
  geometry: GeoJsonGeometry;
  properties: Record<string, string | number | boolean | null>;
};

export type GeoJsonFeatureCollection = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

export type RiskAssessmentInputResult = {
  totalRiskScore: number;
  probabilityScore: number;
  consequenceScore: number;
  factors: {
    ageScore: number;
    materialScore: number;
    leakageHistoryScore: number;
    hydraulicStressScore: number;
    environmentalScore: number;
    criticalityScore: number;
    maintenanceScore: number;
  };
  riskLevel: RiskLevel;
  recommendation: string;
};

export type AssetForRisk = {
  id: string;
  assetType: string;
  material: string | null;
  installYear: number | null;
  designCapacity: number | null;
  currentCapacity: number | null;
  diameterMm?: number | null;
  criticalityLevel: number;
  status?: string;
  name?: string;
  replacementCost?: number;
  maintenanceCost?: number;
  lastMaintenanceDate?: Date | null;
};

export type IncidentForRisk = {
  incidentType: string;
  severity: number;
  reportedAt: Date;
  status?: string;
};

export type ReadingForRisk = {
  value: number;
  timestamp: Date;
  sensor: {
    sensorType: string;
    minThreshold: number | null;
    maxThreshold: number | null;
  };
};

export type AssetWithRisk = AssetForRisk & {
  assetCode: string;
  name: string;
  risk: RiskAssessmentInputResult;
};

export type OptimizedPlanItem = {
  assetId: string;
  assetCode: string;
  assetName: string;
  assetType: string;
  riskScore: number;
  actionType: string;
  priorityRank: number;
  estimatedCost: number;
  expectedRiskReduction: number;
  expectedBenefit: number;
  roi: number;
  justification: string;
};

export type ParetoPoint = {
  cumulativeCost: number;
  cumulativeRiskReduction: number;
  itemCount: number;
  averageRiskReduction: number;
};

export type OptimizationResult = {
  recommendedPlanItems: OptimizedPlanItem[];
  totalCost: number;
  remainingBudget: number;
  totalExpectedRiskReduction: number;
  paretoCurve: ParetoPoint[];
  summary: string;
};

export type ScenarioInput = {
  estateId: string;
  scenarioType: string;
  rainfallMmPerHr?: number;
  durationHr?: number;
  pumpAvailabilityPercent?: number;
  wastewaterLoadPercent?: number;
  blockedPipePercent?: number;
  canalWaterLevelM?: number;
  leakageSeverityPercent?: number;
  backupPumpAvailabilityPercent?: number;
  codMgL?: number;
  bodMgL?: number;
  failedPumpIds?: string[];
  affectedAssetIds?: string[];
};

export type ScenarioResult = {
  riskLevel: RiskLevel;
  impactScore: number;
  affectedZones: string[];
  criticalAssets: string[];
  estimatedCostImpact: number;
  estimatedFloodedAreaRai?: number;
  estimatedWaterLossM3?: number;
  overflowNodeCount?: number;
  summaryTh: string;
  recommendationsTh: string[];
  checklistTh: string[];
  mapFeatures: GeoJsonFeatureCollection;
};
