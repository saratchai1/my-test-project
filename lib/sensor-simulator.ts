export type SimulatedReading = {
  timestamp: string;
  value: number;
  anomaly: boolean;
};

export function simulateSensorValue(sensorType: string, seed: number, minThreshold: number | null, maxThreshold: number | null): SimulatedReading {
  const t = Date.now() / 1000;
  const wave = Math.sin(t / 11 + seed) * 0.5 + Math.cos(t / 19 + seed * 0.7) * 0.5;
  const baseByType: Record<string, number> = {
    FLOW: 420,
    PRESSURE: 3.2,
    WATER_LEVEL: 1.4,
    RAINFALL: 18,
    WATER_QUALITY_COD: 105,
    WATER_QUALITY_BOD: 28,
    WATER_QUALITY_PH: 7.1,
    PUMP_VIBRATION: 4.5,
    PUMP_ENERGY: 76,
    GATE_POSITION: 55
  };
  const rangeByType: Record<string, number> = {
    FLOW: 90,
    PRESSURE: 0.7,
    WATER_LEVEL: 0.55,
    RAINFALL: 22,
    WATER_QUALITY_COD: 30,
    WATER_QUALITY_BOD: 12,
    WATER_QUALITY_PH: 0.35,
    PUMP_VIBRATION: 1.8,
    PUMP_ENERGY: 8,
    GATE_POSITION: 15
  };
  const value = Math.round((baseByType[sensorType] + wave * rangeByType[sensorType] + (seed % 5)) * 10) / 10;
  return {
    timestamp: new Date().toISOString(),
    value,
    anomaly: (maxThreshold !== null && value > maxThreshold) || (minThreshold !== null && value < minThreshold)
  };
}
