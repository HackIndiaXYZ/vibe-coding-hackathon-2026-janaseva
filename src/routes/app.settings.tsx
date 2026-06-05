import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [notif, setNotif] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <Card className="rounded-2xl border-0 glass-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="mt-4 space-y-2 text-sm">
          <Row label="Email" value={user?.email ?? "-"} />
          <Row label="Name" value={user?.user_metadata?.full_name ?? "-"} />
        </div>
      </Card>

      <Card className="rounded-2xl border-0 glass-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Dark mode</div>
              <div className="text-xs text-muted-foreground">Easier on the eyes after sunset.</div>
            </div>
            <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Email notifications</div>
              <div className="text-xs text-muted-foreground">Get status updates on your reports.</div>
            </div>
            <Switch checked={notif} onCheckedChange={setNotif} />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-0 glass-card p-6 shadow-card">
        <h2 className="text-lg font-semibold">Session</h2>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success("Signed out");
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}