import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">ตั้งค่าระบบ</h2>
        <p className="mt-2 text-sm text-muted-foreground">ตั้งค่าน้ำหนักความเสี่ยง งบประมาณ ค่า threshold sensor และชั้นข้อมูลแผนที่สำหรับ MVP</p>
      </div>
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Risk weight configuration</CardTitle><CardDescription>กำหนดน้ำหนัก Probability และ Consequence</CardDescription></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input defaultValue="60" aria-label="probability weight" />
            <Input defaultValue="40" aria-label="consequence weight" />
            <Input defaultValue="76" aria-label="critical threshold" />
            <Input defaultValue="51" aria-label="high threshold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Organization</CardTitle></CardHeader>
          <CardContent className="grid gap-3">
            <Input defaultValue="การนิคมอุตสาหกรรมแห่งประเทศไทย" />
            <Input defaultValue="2570" />
            <Input defaultValue="25000000" />
            <Select defaultValue="BALANCED">
              <option value="BALANCED">Balanced objective</option>
              <option value="FLOOD_PREVENTION">Flood prevention</option>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sensor threshold</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <Input defaultValue="5.0 bar" />
            <Input defaultValue="2.2 m" />
            <Input defaultValue="120 mg/L COD" />
            <Input defaultValue="7 mm/s vibration" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Map layer visibility</CardTitle></CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {["Water supply pipes", "Wastewater pipes", "Drainage pipes", "Pump stations", "WWTP", "Sensors", "Incidents", "Scenario result layer"].map((item) => (
              <label key={item} className="flex items-center gap-2"><input type="checkbox" defaultChecked />{item}</label>
            ))}
          </CardContent>
        </Card>
      </section>
      <Button><Save className="h-4 w-4" />Save settings</Button>
    </div>
  );
}
