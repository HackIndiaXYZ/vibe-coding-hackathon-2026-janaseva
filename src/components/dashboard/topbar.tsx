import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export function Topbar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b glass px-4 py-3">
      <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search reports, authorities…" className="rounded-full pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
          {(user?.email ?? "?").slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}