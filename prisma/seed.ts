import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { calculateAssetRisk } from "../lib/risk-engine";
import { ACTION_TYPES, ASSET_TYPES, INCIDENT_TYPES, SENSOR_TYPES, WORK_ORDER_STATUSES } from "../lib/enums";
import { estateMasterList } from "../lib/estate-master";

const prisma = new PrismaClient();

const estates = estateMasterList;

const materials = ["HDPE", "PVC", "Ductile Iron", "Concrete", "Old Steel", "Asbestos Cement"];
const typePrefixes: Record<string, string> = {
  WATER_PIPE: "WP",
  WASTEWATER_PIPE: "WWP",
  DRAINAGE_PIPE: "DP",
  MANHOLE: "MH",
  VALVE: "VLV",
  PRV: "PRV",
  PUMP_STATION: "PS",
  PUMP: "PMP",
  WWTP: "WWTP",
  RETENTION_POND: "RP",
  CANAL: "CNL"
};

function seeded(seed: number) {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
}

function around(base: number, index: number, spread: number) {
  return base + (seeded(index) - 0.5) * spread;
}

function lineGeoJson(lng: number, lat: number, index: number) {
  const dx = 0.004 + seeded(index + 10) * 0.008;
  const dy = 0.002 + seeded(index + 20) * 0.006;
  return JSON.stringify({
    type: "LineString",
    coordinates: [
      [lng - dx, lat - dy],
      [lng, lat],
      [lng + dx, lat + dy]
    ]
  });
}

function pointGeoJson(lng: number, lat: number) {
  return JSON.stringify({ type: "Point", coordinates: [lng, lat] });
}

function statusFor(index: number): string {
  if (index % 23 === 0) return "CRITICAL";
  if (index % 11 === 0) return "WARNING";
  if (index % 7 === 0) return "WATCH";
  return "NORMAL";
}

function assetName(type: string, estateCode: string, index: number) {
  const code = String(index).padStart(2, "0");
  const names: Record<string, string> = {
    WATER_PIPE: `ท่อประปาหลัก โซน ${estateCode}-${code}`,
    WASTEWATER_PIPE: `ท่อรวบรวมน้ำเสีย หน้าโรงงานกลุ่มปิโตรเคมี ${code}`,
    DRAINAGE_PIPE: `ท่อระบายน้ำฝน D-${code}`,
    MANHOLE: `บ่อพักน้ำเสีย MH-${100 + index}`,
    VALVE: `วาล์วควบคุมแรงดัน PRV-${code}`,
    PRV: `วาล์วลดแรงดัน PRV-${code}`,
    PUMP_STATION: `สถานีสูบน้ำฝน PS-${code}`,
    PUMP: `เครื่องสูบน้ำ P-${code}`,
    WWTP: `ระบบบำบัดน้ำเสียส่วนกลาง WWTP-${code}`,
    RETENTION_POND: `บ่อหน่วงน้ำ RP-${code}`,
    CANAL: `คลองระบายน้ำ C-${code}`,
    ROAD: `ถนนโครงข่ายหลัก R-${code}`,
    BRIDGE: `สะพานข้ามคลอง B-${code}`,
    SENSOR_NODE: `จุดติดตั้ง Sensor SN-${code}`
  };
  return names[type];
}

async function main() {
  const initSql = readFileSync(join(process.cwd(), "prisma/init-db.sql"), "utf8");
  for (const statement of initSql.split(";").map((part) => part.trim()).filter(Boolean)) {
    await prisma.$executeRawUnsafe(statement);
  }

  await prisma.sensorReading.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.maintenancePlanItem.deleteMany();
  await prisma.maintenancePlan.deleteMany();
  await prisma.riskAssessment.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.infrastructureAsset.deleteMany();
  await prisma.industrialEstate.deleteMany();

  for (const [estateIndex, estateSeed] of estates.entries()) {
    const { region: _region, ...estateData } = estateSeed;
    const estate = await prisma.industrialEstate.create({
      data: {
        ...estateData,
        operator: "การนิคมอุตสาหกรรมแห่งประเทศไทย"
      }
    });

    const assetSpecs: { type: string; count: number }[] = [
      { type: "WATER_PIPE", count: 10 },
      { type: "WASTEWATER_PIPE", count: 10 },
      { type: "DRAINAGE_PIPE", count: 10 },
      { type: "MANHOLE", count: 12 },
      { type: "VALVE", count: 6 },
      { type: "PRV", count: 3 },
      { type: "PUMP_STATION", count: 4 },
      { type: "PUMP", count: 3 },
      { type: "WWTP", count: 3 },
      { type: "RETENTION_POND", count: 2 },
      { type: "CANAL", count: 3 }
    ];

    const assets = [];
    let runningIndex = 1;
    for (const spec of assetSpecs) {
      for (let i = 1; i <= spec.count; i += 1) {
        const index = estateIndex * 1000 + runningIndex;
        const lat = around(estate.latitude, index, 0.075);
        const lng = around(estate.longitude, index + 5, 0.095);
        const isPipe = ["WATER_PIPE", "WASTEWATER_PIPE", "DRAINAGE_PIPE"].includes(spec.type);
        const asset = await prisma.infrastructureAsset.create({
          data: {
            estateId: estate.id,
            assetCode: `${estate.code}-${typePrefixes[spec.type] ?? spec.type.slice(0, 3)}-${String(i).padStart(3, "0")}`,
            assetType: spec.type,
            name: assetName(spec.type, estate.code, i),
            description: "ข้อมูลสินทรัพย์จำลองสำหรับระบบ Digital Twin และการวิเคราะห์ความเสี่ยง",
            status: statusFor(index),
            material: isPipe ? materials[index % materials.length] : spec.type === "WWTP" ? "Reinforced Concrete" : "Steel",
            diameterMm: isPipe ? 150 + (index % 8) * 100 : null,
            lengthM: isPipe ? 80 + (index % 13) * 45 : null,
            installYear: 1988 + (index % 34),
            designCapacity: isPipe ? 220 + (index % 9) * 85 : 800 + (index % 6) * 350,
            currentCapacity: isPipe ? 180 + (index % 11) * 90 : 600 + (index % 8) * 330,
            criticalityLevel: 1 + (index % 5),
            latitude: lat,
            longitude: lng,
            geometryGeoJson: isPipe || spec.type === "CANAL" ? lineGeoJson(lng, lat, index) : pointGeoJson(lng, lat),
            lastInspectionDate: new Date(2025, index % 12, 4 + (index % 20)),
            lastMaintenanceDate: new Date(2023 + (index % 3), index % 12, 6 + (index % 18)),
            replacementCost: isPipe ? 1_200_000 + (index % 8) * 420_000 : 2_500_000 + (index % 9) * 600_000,
            maintenanceCost: isPipe ? 180_000 + (index % 6) * 75_000 : 280_000 + (index % 8) * 95_000
          }
        });
        assets.push(asset);
        runningIndex += 1;
      }
    }

    for (let i = 1; i <= 10; i += 1) {
      const linkedAsset = assets[(i * 5) % assets.length];
      const sensorType = SENSOR_TYPES[i % SENSOR_TYPES.length];
      const sensor = await prisma.sensor.create({
        data: {
          estateId: estate.id,
          assetId: linkedAsset.id,
          sensorCode: `${estate.code}-S-${String(i).padStart(3, "0")}`,
          sensorType,
          name: `Sensor ${sensorType} จุด ${i}`,
          unit:
            sensorType === "PRESSURE"
              ? "bar"
              : sensorType === "RAINFALL"
                ? "mm/hr"
                : sensorType === "WATER_QUALITY_PH"
                  ? "pH"
                  : sensorType === "PUMP_VIBRATION"
                    ? "mm/s"
                    : "m3/hr",
          latitude: around(estate.latitude, estateIndex * 400 + i, 0.065),
          longitude: around(estate.longitude, estateIndex * 500 + i, 0.085),
          minThreshold: sensorType === "PRESSURE" ? 2 : sensorType === "WATER_QUALITY_PH" ? 6.5 : null,
          maxThreshold:
            sensorType === "PRESSURE"
              ? 5
              : sensorType === "WATER_LEVEL"
                ? 2.2
                : sensorType === "RAINFALL"
                  ? 55
                  : sensorType === "WATER_QUALITY_COD"
                    ? 120
                    : sensorType === "WATER_QUALITY_BOD"
                      ? 40
                      : sensorType === "PUMP_VIBRATION"
                        ? 7
                        : 900,
          status: i % 9 === 0 ? "ANOMALY" : "ONLINE"
        }
      });
      for (let r = 0; r < 24; r += 1) {
            const base = sensorType === "PRESSURE" ? 3.2 : sensorType === "RAINFALL" ? 20 : sensorType === "PUMP_VIBRATION" ? 4.8 : 120;
        await prisma.sensorReading.create({
          data: {
            sensorId: sensor.id,
            timestamp: new Date(Date.now() - (48 - r) * 60 * 60 * 1000),
            value: Math.round((base + Math.sin((r + i) / 4) * (i % 4 === 0 ? 25 : 7) + (r % 5)) * 10) / 10,
            quality: r % 31 === 0 ? "SUSPECT" : "GOOD"
          }
        });
      }
    }

    for (let i = 1; i <= 16; i += 1) {
      const asset = assets[(i * 7) % assets.length];
      const incidentType = INCIDENT_TYPES[i % INCIDENT_TYPES.length];
      const reportedAt = new Date(2023 + (i % 4), i % 12, 1 + (i % 24));
      await prisma.incident.create({
        data: {
          estateId: estate.id,
          assetId: asset.id,
          incidentType,
          severity: 1 + (i % 5),
          title: `${incidentType} ${asset.assetCode}`,
          description: "เหตุการณ์จำลองจากประวัติซ่อมบำรุงและร้องเรียนในพื้นที่นิคม",
          latitude: asset.latitude,
          longitude: asset.longitude,
          reportedAt,
          resolvedAt: i % 5 === 0 ? null : new Date(reportedAt.getTime() + 3 * 24 * 60 * 60 * 1000),
          status: i % 5 === 0 ? "OPEN" : "RESOLVED"
        }
      });
    }

    const assetsWithRelations = await prisma.infrastructureAsset.findMany({
      where: { estateId: estate.id },
      include: {
        incidents: true,
        sensors: { include: { readings: { orderBy: { timestamp: "desc" }, take: 20 } } }
      }
    });

    for (const asset of assetsWithRelations) {
      const readings = asset.sensors.flatMap((sensor) =>
        sensor.readings.map((reading) => ({
          value: reading.value,
          timestamp: reading.timestamp,
          sensor: {
            sensorType: sensor.sensorType,
            minThreshold: sensor.minThreshold,
            maxThreshold: sensor.maxThreshold
          }
        }))
      );
      const risk = calculateAssetRisk(asset, asset.incidents, readings, new Date("2026-05-07"));
      await prisma.riskAssessment.create({
        data: {
          assetId: asset.id,
          assessmentDate: new Date("2026-05-07"),
          totalRiskScore: risk.totalRiskScore,
          probabilityScore: risk.probabilityScore,
          consequenceScore: risk.consequenceScore,
          ageScore: risk.factors.ageScore,
          materialScore: risk.factors.materialScore,
          leakageHistoryScore: risk.factors.leakageHistoryScore,
          hydraulicStressScore: risk.factors.hydraulicStressScore,
          environmentalScore: risk.factors.environmentalScore,
          criticalityScore: risk.factors.criticalityScore,
          maintenanceScore: risk.factors.maintenanceScore,
          recommendation: risk.recommendation
        }
      });
    }

    for (let planIndex = 1; planIndex <= 2; planIndex += 1) {
      const plan = await prisma.maintenancePlan.create({
        data: {
          estateId: estate.id,
          name: `แผนซ่อมบำรุงเชิงป้องกัน ${estate.code}-${planIndex}`,
          fiscalYear: 2569 + planIndex,
          budget: 18_000_000 + planIndex * 7_000_000,
          objective: planIndex === 1 ? "BALANCED" : "FLOOD_PREVENTION",
          totalEstimatedCost: 0,
          totalRiskReduction: 0
        }
      });
      const highRisk = await prisma.riskAssessment.findMany({
        where: { asset: { estateId: estate.id } },
        include: { asset: true },
        orderBy: { totalRiskScore: "desc" },
        take: 6
      });
      let totalCost = 0;
      let totalReduction = 0;
      for (const [rank, risk] of highRisk.entries()) {
        const cost = risk.asset.maintenanceCost * (rank % 3 === 0 ? 0.6 : 0.25);
        totalCost += cost;
        totalReduction += 12 + (risk.totalRiskScore / 10);
        await prisma.maintenancePlanItem.create({
          data: {
            planId: plan.id,
            assetId: risk.assetId,
            actionType: rank % 3 === 0 ? "REHABILITATE" : "CCTV_INSPECTION",
            priorityRank: rank + 1,
            estimatedCost: cost,
            expectedRiskReduction: 12 + (risk.totalRiskScore / 10),
            expectedBenefit: risk.totalRiskScore * risk.asset.criticalityLevel,
            plannedStartDate: new Date(2026, rank, 1),
            plannedEndDate: new Date(2026, rank, 14),
            justification: "คัดเลือกจากคะแนนความเสี่ยงและความสำคัญของพื้นที่"
          }
        });
      }
      await prisma.maintenancePlan.update({
        where: { id: plan.id },
        data: { totalEstimatedCost: totalCost, totalRiskReduction: totalReduction }
      });
    }

    for (let i = 1; i <= 8; i += 1) {
      const asset = assets[(i * 9) % assets.length];
      await prisma.workOrder.create({
        data: {
          estateId: estate.id,
          assetId: asset.id,
          workOrderCode: `${estate.code}-WO-${String(i).padStart(4, "0")}`,
          title: `ตรวจสอบ ${asset.name}`,
          description: "ใบสั่งงานจำลองสำหรับติดตามงานภาคสนาม",
          actionType: i % 3 === 0 ? "REPAIR" : "INSPECT",
          priority: i % 5 === 0 ? "URGENT" : i % 3 === 0 ? "HIGH" : "MEDIUM",
          status: WORK_ORDER_STATUSES[i % 4],
          assignedTeam: `ทีมซ่อมบำรุง ${1 + (i % 4)}`,
          scheduledDate: new Date(2026, i % 12, 3 + i),
          estimatedCost: asset.maintenanceCost * 0.18
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
