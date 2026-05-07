import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { simulateSensorValue } from "@/lib/sensor-simulator";

export async function GET(request: NextRequest) {
  const sensorId = request.nextUrl.searchParams.get("sensorId") ?? undefined;
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
  const latest = request.nextUrl.searchParams.get("latest") === "true";
  if (latest) {
    const sensors = await prisma.sensor.findMany({ where: sensorId ? { id: sensorId } : undefined, take: 30 });
    return NextResponse.json(
      sensors.map((sensor, index) => ({
        sensorId: sensor.id,
        sensorCode: sensor.sensorCode,
        sensorType: sensor.sensorType,
        ...simulateSensorValue(sensor.sensorType, index + sensor.sensorCode.length, sensor.minThreshold, sensor.maxThreshold)
      }))
    );
  }

  const readings = await prisma.sensorReading.findMany({
    where: { sensorId },
    include: { sensor: true },
    orderBy: { timestamp: "desc" },
    take: limit
  });
  return NextResponse.json(readings.reverse());
}
