import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  severity = "normal"
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: string;
  severity?: "normal" | "good" | "warning" | "critical";
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-normal">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div
            className={cn(
              "rounded-md p-2",
              severity === "normal" && "bg-blue-100 text-blue-800",
              severity === "good" && "bg-emerald-100 text-emerald-800",
              severity === "warning" && "bg-orange-100 text-orange-800",
              severity === "critical" && "bg-red-100 text-red-800"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend ? <p className="mt-4 text-xs font-medium text-cyan-700">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
