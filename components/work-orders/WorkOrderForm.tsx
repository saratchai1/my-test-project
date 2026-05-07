"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkOrderForm() {
  return (
    <Button>
      <Plus className="h-4 w-4" />
      Create work order
    </Button>
  );
}
