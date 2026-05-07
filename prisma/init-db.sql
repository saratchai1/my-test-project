PRAGMA foreign_keys=OFF;

DROP TABLE IF EXISTS "SensorReading";
DROP TABLE IF EXISTS "Sensor";
DROP TABLE IF EXISTS "MaintenancePlanItem";
DROP TABLE IF EXISTS "MaintenancePlan";
DROP TABLE IF EXISTS "RiskAssessment";
DROP TABLE IF EXISTS "WorkOrder";
DROP TABLE IF EXISTS "Scenario";
DROP TABLE IF EXISTS "Incident";
DROP TABLE IF EXISTS "InfrastructureAsset";
DROP TABLE IF EXISTS "IndustrialEstate";

CREATE TABLE "IndustrialEstate" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL,
  "nameTh" TEXT NOT NULL,
  "nameEn" TEXT NOT NULL,
  "province" TEXT NOT NULL,
  "areaRai" REAL NOT NULL,
  "operator" TEXT NOT NULL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "InfrastructureAsset" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "assetCode" TEXT NOT NULL,
  "assetType" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'NORMAL',
  "material" TEXT,
  "diameterMm" REAL,
  "lengthM" REAL,
  "installYear" INTEGER,
  "designCapacity" REAL,
  "currentCapacity" REAL,
  "criticalityLevel" INTEGER NOT NULL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "geometryGeoJson" TEXT NOT NULL,
  "lastInspectionDate" DATETIME,
  "lastMaintenanceDate" DATETIME,
  "replacementCost" REAL NOT NULL,
  "maintenanceCost" REAL NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "InfrastructureAsset_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Sensor" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "assetId" TEXT,
  "sensorCode" TEXT NOT NULL,
  "sensorType" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "unit" TEXT NOT NULL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "minThreshold" REAL,
  "maxThreshold" REAL,
  "status" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Sensor_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Sensor_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "InfrastructureAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "SensorReading" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "sensorId" TEXT NOT NULL,
  "timestamp" DATETIME NOT NULL,
  "value" REAL NOT NULL,
  "quality" TEXT NOT NULL DEFAULT 'GOOD',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SensorReading_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Incident" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "assetId" TEXT,
  "incidentType" TEXT NOT NULL,
  "severity" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "latitude" REAL NOT NULL,
  "longitude" REAL NOT NULL,
  "reportedAt" DATETIME NOT NULL,
  "resolvedAt" DATETIME,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Incident_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Incident_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "InfrastructureAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "RiskAssessment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "assetId" TEXT NOT NULL,
  "assessmentDate" DATETIME NOT NULL,
  "totalRiskScore" REAL NOT NULL,
  "probabilityScore" REAL NOT NULL,
  "consequenceScore" REAL NOT NULL,
  "ageScore" REAL NOT NULL,
  "materialScore" REAL NOT NULL,
  "leakageHistoryScore" REAL NOT NULL,
  "hydraulicStressScore" REAL NOT NULL,
  "environmentalScore" REAL NOT NULL,
  "criticalityScore" REAL NOT NULL,
  "maintenanceScore" REAL NOT NULL,
  "recommendation" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RiskAssessment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "InfrastructureAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MaintenancePlan" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "fiscalYear" INTEGER NOT NULL,
  "budget" REAL NOT NULL,
  "objective" TEXT NOT NULL,
  "totalEstimatedCost" REAL NOT NULL,
  "totalRiskReduction" REAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "MaintenancePlan_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "MaintenancePlanItem" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "planId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "priorityRank" INTEGER NOT NULL,
  "estimatedCost" REAL NOT NULL,
  "expectedRiskReduction" REAL NOT NULL,
  "expectedBenefit" REAL NOT NULL,
  "plannedStartDate" DATETIME,
  "plannedEndDate" DATETIME,
  "justification" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MaintenancePlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MaintenancePlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "MaintenancePlanItem_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "InfrastructureAsset" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "WorkOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "assetId" TEXT,
  "workOrderCode" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "actionType" TEXT NOT NULL,
  "priority" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'BACKLOG',
  "assignedTeam" TEXT NOT NULL,
  "scheduledDate" DATETIME NOT NULL,
  "completedDate" DATETIME,
  "estimatedCost" REAL NOT NULL,
  "actualCost" REAL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "WorkOrder_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "InfrastructureAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Scenario" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "estateId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "scenarioType" TEXT NOT NULL,
  "inputJson" TEXT NOT NULL,
  "resultJson" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Scenario_estateId_fkey" FOREIGN KEY ("estateId") REFERENCES "IndustrialEstate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "IndustrialEstate_code_key" ON "IndustrialEstate"("code");
CREATE UNIQUE INDEX "InfrastructureAsset_assetCode_key" ON "InfrastructureAsset"("assetCode");
CREATE UNIQUE INDEX "Sensor_sensorCode_key" ON "Sensor"("sensorCode");
CREATE UNIQUE INDEX "WorkOrder_workOrderCode_key" ON "WorkOrder"("workOrderCode");

PRAGMA foreign_keys=ON;
