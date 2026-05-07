import { Badge } from "@/components/ui/badge";

export function RiskBadge({ score }: { score: number }) {
  if (score <= 25) return <Badge variant="green">ต่ำ {score}</Badge>;
  if (score <= 50) return <Badge variant="yellow">ปานกลาง {score}</Badge>;
  if (score <= 75) return <Badge variant="orange">สูง {score}</Badge>;
  return <Badge variant="red">วิกฤต {score}</Badge>;
}

export function AssetStatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    NORMAL: "ปกติ",
    WATCH: "เฝ้าระวัง",
    WARNING: "เตือนภัย",
    CRITICAL: "วิกฤต",
    OUT_OF_SERVICE: "หยุดใช้งาน"
  };
  const variant = status === "CRITICAL" ? "red" : status === "WARNING" ? "orange" : status === "WATCH" ? "yellow" : "green";
  return <Badge variant={variant}>{labels[status] ?? status}</Badge>;
}

export function AssetTypeBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    WATER_PIPE: "ท่อประปา",
    WASTEWATER_PIPE: "ท่อน้ำเสีย",
    DRAINAGE_PIPE: "ท่อระบายน้ำ",
    MANHOLE: "บ่อพัก",
    VALVE: "วาล์ว",
    PRV: "PRV",
    PUMP_STATION: "สถานีสูบ",
    PUMP: "ปั๊ม",
    WWTP: "WWTP",
    RETENTION_POND: "บ่อหน่วงน้ำ",
    CANAL: "คลอง",
    ROAD: "ถนน",
    BRIDGE: "สะพาน",
    SENSOR_NODE: "Sensor Node"
  };
  return <Badge variant="blue">{labels[type] ?? type}</Badge>;
}
