import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyReports, myStats } from "@/lib/reports.functions";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, FileText, CheckCircle2, Clock, Users, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/")({ component: DashboardHome });

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardHome() {
  const { user } = useAuth();
  const statsFn = useServerFn(myStats);
  const reportsFn = useServerFn(listMyReports);
  const stats = useQuery({ queryKey: ["stats"], queryFn: () => statsFn() });
  const reports = useQuery({ queryKey: ["my-reports"], queryFn: () => reportsFn() });

  const name = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "there";

  const cards = [
    { label: "Total Reports", value: stats.data?.total ?? 0, icon: FileText, color: "primary" },
    { label: "Pending", value: stats.data?.pending ?? 0, icon: Clock, color: "warning" },
    { label: "Resolved", value: stats.data?.resolved ?? 0, icon: CheckCircle2, color: "success" },
    { label: "Community", value: (reports.data ?? []).reduce((a, r) => a + (r.support_count ?? 0), 0), icon: Users, color: "info" },
  ];

  // weekly chart from reports
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = d.toLocaleDateString(undefined, { weekday: "short" });
    const count = (reports.data ?? []).filter(
      (r) => new Date(r.created_at).toDateString() === d.toDateString(),
    ).length;
    return { day, count };
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {greet()} {name} <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Here's what's happening in your community.</p>
          </div>
          <Button asChild className="rounded-full gradient-primary text-primary-foreground shadow-elegant">
            <Link to="/app/report"><Camera className="mr-1 h-4 w-4" /> Report Issue</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="relative overflow-hidden rounded-2xl border-0 glass-card p-5 shadow-card">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px]">Last 30d</Badge>
                </div>
                <div className="mt-4 text-3xl font-bold">
                  {stats.isLoading ? <Skeleton className="h-8 w-16" /> : c.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{c.label}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 glass-card p-6 shadow-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Activity this week</h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-0 glass-card p-6 shadow-card">
          <h3 className="text-lg font-semibold">Recent activity</h3>
          <div className="mt-4 space-y-3">
            {reports.isLoading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
            ) : (reports.data ?? []).length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">No reports yet.</p>
                <Button asChild size="sm" className="mt-3 rounded-full gradient-primary text-primary-foreground">
                  <Link to="/app/report">File your first report</Link>
                </Button>
              </div>
            ) : (
              (reports.data ?? []).slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  to="/app/reports"
                  className="flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50"
                >
                  <img src={r.image_url} alt={r.issue_type} className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.issue_type}</div>
                    <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full text-[10px] capitalize">{r.status.replace("_", " ")}</Badge>
                </Link>
              ))
            )}
            {(reports.data ?? []).length > 0 && (
              <Link to="/app/reports" className="flex items-center justify-end gap-1 text-xs font-medium text-primary hover:underline">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}