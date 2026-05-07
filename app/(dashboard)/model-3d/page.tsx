import { InfrastructureModelViewer } from "@/components/model3d/InfrastructureModelViewer";

export default function Model3DPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">โมเดล 3D Digital Twin</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Concept viewer สำหรับแสดงโมเดลนิคมแบบ 3D พร้อม overlay เครือข่ายท่อและจุดเสี่ยง ตามแนวภาพตัวอย่างที่แนบมา
        </p>
      </div>
      <InfrastructureModelViewer />
    </div>
  );
}
