"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WorkOrder = {
  id: string;
  workOrderCode: string;
  title: string;
  priority: string;
  status: string;
  assignedTeam: string;
  scheduledDate: string | Date;
  asset: { id: string; assetCode: string; name: string } | null;
};

const columns = [
  ["BACKLOG", "Backlog"],
  ["ASSIGNED", "Assigned"],
  ["IN_PROGRESS", "In Progress"],
  ["DONE", "Done"]
];

export function WorkOrderBoard({ workOrders }: { workOrders: WorkOrder[] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {columns.map(([status, label]) => (
        <Card key={status}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {label}
              <Badge variant="gray">{workOrders.filter((order) => order.status === status).length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workOrders
              .filter((order) => order.status === status)
              .map((order) => (
                <div key={order.id} className="rounded-md border bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{order.workOrderCode}</p>
                    <Badge variant={order.priority === "URGENT" ? "red" : order.priority === "HIGH" ? "orange" : "blue"}>{order.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm">{order.title}</p>
                  {order.asset ? (
                    <Link href={`/assets/${order.asset.id}`} className="mt-2 block text-xs text-primary">
                      {order.asset.assetCode} · {order.asset.name}
                    </Link>
                  ) : null}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {order.assignedTeam} · {new Date(order.scheduledDate).toLocaleDateString("th-TH")}
                  </p>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
