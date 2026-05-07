import { prisma } from "@/lib/db";
import { AssetTable } from "@/components/assets/AssetTable";
import { Card, CardContent } from "@/components/ui/card";

export default async function AssetsPage() {
  const assets = await prisma.infrastructureAsset.findMany({
    include: {
      estate: true,
      riskAssessments: { orderBy: { assessmentDate: "desc" }, take: 1 }
    },
    orderBy: { assetCode: "asc" }
  });
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">ทะเบียนสินทรัพย์โครงสร้างพื้นฐาน</h2>
        <p className="mt-2 text-sm text-muted-foreground">ค้นหา กรอง และจัดลำดับท่อ ปั๊ม วาล์ว บ่อพัก สถานีสูบ และระบบบำบัดน้ำเสีย</p>
      </div>
      <Card>
        <CardContent className="p-5">
          <AssetTable assets={assets} />
        </CardContent>
      </Card>
    </div>
  );
}
