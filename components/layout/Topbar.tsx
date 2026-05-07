import { Bell, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <div>
          <p className="text-xs text-muted-foreground">การนิคมอุตสาหกรรมแห่งประเทศไทย</p>
          <h1 className="text-base font-semibold text-slate-900">AI-Enhanced Digital Twin</h1>
        </div>
        <div className="hidden w-full max-w-md items-center gap-2 md:flex">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="ค้นหาสินทรัพย์ รหัสท่อ สถานีสูบ หรือเหตุการณ์" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Building2 className="h-4 w-4" />
            IEAT
          </Button>
          <Button variant="ghost" size="icon" aria-label="การแจ้งเตือน">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
