import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "green" | "yellow" | "orange" | "red" | "blue" | "gray" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        variant === "default" && "bg-slate-100 text-slate-700",
        variant === "green" && "bg-emerald-100 text-emerald-800",
        variant === "yellow" && "bg-yellow-100 text-yellow-800",
        variant === "orange" && "bg-orange-100 text-orange-800",
        variant === "red" && "bg-red-100 text-red-800",
        variant === "blue" && "bg-blue-100 text-blue-800",
        variant === "gray" && "bg-slate-100 text-slate-600",
        className
      )}
      {...props}
    />
  );
}
