import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, Camera, FileText, Map, User, Settings, LogOut } from "lucide-react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ITEMS = [
  { to: "/app", label: "Dashboard", icon: Home },
  { to: "/app/report", label: "Report Issue", icon: Camera },
  { to: "/app/reports", label: "My Reports", icon: FileText },
  { to: "/app/community", label: "Community Pulse", icon: Map },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

export function DashboardSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
      <div className="px-2 pt-2"><Brand /></div>
      <nav className="mt-8 flex flex-col gap-1">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.to === "/app" ? path === "/app" : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "gradient-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl glass-card p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
            {(user?.email ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user?.user_metadata?.full_name ?? user?.email}</div>
            <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start rounded-lg text-muted-foreground"
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Signed out");
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}