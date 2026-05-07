import { Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { estateMasterList, estateRegions } from "@/lib/estate-master";

export function EstateRegionCatalog() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {estateRegions.map((region) => {
        const estates = estateMasterList.filter((estate) => estate.region === region);
        return (
          <Card key={region} className={region === "ภาคกลาง" ? "xl:row-span-2" : ""}>
            <CardHeader>
              <CardTitle className="text-3xl">{region}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {estates.map((estate) => (
                  <div key={estate.code} className="flex items-center gap-3 text-sm font-semibold text-slate-950">
                    <Home className="h-5 w-5 text-slate-600" />
                    <span>{estate.nameTh}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
