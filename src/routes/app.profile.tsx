import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyReports, myStats } from "@/lib/reports.functions";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Camera, Users, ShieldCheck, Star } from "lucide-react";

export const Route = createFileRoute("/app/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  const statsFn = useServerFn(myStats);
  const reportsFn = useServerFn(listMyReports);
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => statsFn() });
  const reports = useQuery({ queryKey: ["my-reports"], queryFn: () => reportsFn() });

  const support = (reports.data ?? []).reduce((a, r) => a + (r.support_count ?? 0), 0);
  const total = stats.data?.total ?? 0;

  const badges = [
    { name: "First Report", desc: "Filed your first civic report", unlocked: total >= 1, icon: Camera },
    { name: "Active Citizen", desc: "5 reports filed", unlocked: total >= 5, icon: ShieldCheck },
    { name: "Community Leader", desc: "Earned 10 community supports", unlocked: support >= 10, icon: Users },
    { name: "City Champion", desc: "20 reports filed", unlocked: total >= 20, icon: Star },
  ];

  const name = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Citizen";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card className="overflow-hidden rounded-3xl border-0 glass-card p-0 shadow-card">
        <div className="h-32 gradient-hero animate-gradient" />
        <div className="-mt-12 flex flex-wrap items-end gap-4 p-6">
          <div className="grid h-24 w-24 place-items-center rounded-3xl gradient-primary text-3xl font-bold text-primary-foreground shadow-elegant ring-4 ring-background">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className="rounded-full gradient-primary text-primary-foreground">Verified Citizen</Badge>
              <Badge variant="secondary" className="rounded-full">Hyderabad</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-0 glass-card p-5 shadow-card">
          <div className="text-sm text-muted-foreground">Reports submitted</div>
          <div className="mt-2 text-3xl font-bold">{total}</div>
        </Card>
        <Card className="rounded-2xl border-0 glass-card p-5 shadow-card">
          <div className="text-sm text-muted-foreground">Community supports</div>
          <div className="mt-2 text-3xl font-bold">{support}</div>
        </Card>
        <Card className="rounded-2xl border-0 glass-card p-5 shadow-card">
          <div className="text-sm text-muted-foreground">Resolved</div>
          <div className="mt-2 text-3xl font-bold">{stats.data?.resolved ?? 0}</div>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 glass-card p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Achievements</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className={`rounded-2xl border p-4 transition-all ${
                  b.unlocked ? "border-primary/30 bg-primary/5" : "opacity-50"
                }`}
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${b.unlocked ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-3 text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}