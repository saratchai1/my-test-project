import { prisma } from "@/lib/db";
import { assetsToGeoJson } from "@/lib/geojson";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DigitalTwinMapClient } from "@/components/map/DigitalTwinMapClient";

export default async function MapPage() {
  const [assets, estates] = await Promise.all([
    prisma.infrastructureAsset.findMany({
      include: { riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 } }
    }),
    prisma.industrialEstate.findMany({ orderBy: { code: "asc" } })
  ]);
  const geojson = assetsToGeoJson(assets);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">แผนที่ Digital Twin</h2>
        <p className="mt-2 text-sm text-muted-foreground">แสดงเครือข่ายน้ำประปา น้ำเสีย ระบายน้ำ สถานีสูบ WWTP Sensor และสินทรัพย์เสี่ยงสูงบนแผนที่ GIS</p>
      </div>
      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_220px_220px_220px]">
          <Input placeholder="ค้นหา Asset code หรือชื่อสินทรัพย์" />
          <Select>
            <option>ทุกนิคม</option>
            {estates.map((estate) => (
              <option key={estate.id}>{estate.nameTh}</option>
            ))}
          </Select>
          <Select>
            <option>ทุกประเภทสินทรัพย์</option>
            <option>WATER_PIPE</option>
            <option>WASTEWATER_PIPE</option>
            <option>DRAINAGE_PIPE</option>
            <option>PUMP_STATION</option>
          </Select>
          <Select>
            <option>ทุกระดับความเสี่ยง</option>
            <option>วิกฤต</option>
            <option>สูง</option>
            <option>ปานกลาง</option>
          </Select>
        </CardContent>
      </Card>
      <DigitalTwinMapClient geojson={geojson} />
    </div>
  );
}
