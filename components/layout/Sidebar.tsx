import Link from "next/link";
import {
  Activity,
  BarChart3,
  Box,
  ClipboardList,
  FileText,
  Gauge,
  Home,
  Building2,
  Layers3,
  Map,
  Settings,
  ShieldAlert,
  Wrench
} from "lucide-react";

const nav = [
  { href: "/", label: "ภาพรวม", icon: Home },
  { href: "/estates", label: "รายชื่อนิคม", icon: Building2 },
  { href: "/map", label: "แผนที่ Digital Twin", icon: Map },
  { href: "/model-3d", label: "โมเดล 3D", icon: Box },
  { href: "/assets", label: "ทะเบียนสินทรัพย์", icon: Layers3 },
  { href: "/risk", label: "วิเคราะห์ความเสี่ยง", icon: ShieldAlert },
  { href: "/maintenance-plan", label: "แผนซ่อมบำรุง AI", icon: Wrench },
  { href: "/work-orders", label: "ใบสั่งงาน", icon: ClipboardList },
  { href: "/scenarios", label: "จำลองสถานการณ์", icon: Activity },
  { href: "/hydraulic-simulation", label: "Hydraulic Model", icon: Gauge },
  { href: "/reports", label: "รายงาน", icon: FileText },
  { href: "/settings", label: "ตั้งค่า", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-white lg:block">
      <div className="border-b p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">IEAT Digital Twin</p>
            <p className="text-xs text-muted-foreground">AI Infrastructure IAM</p>
          </div>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-primary"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
