"use client";

import dynamic from "next/dynamic";

export const DigitalTwinMapClient = dynamic(() => import("@/components/map/DigitalTwinMap").then((module) => module.DigitalTwinMap), {
  ssr: false,
  loading: () => <div className="flex h-[420px] items-center justify-center rounded-lg border bg-white text-sm text-muted-foreground">กำลังโหลดแผนที่...</div>
});
