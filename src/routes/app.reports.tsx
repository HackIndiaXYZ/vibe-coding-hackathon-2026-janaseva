import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyReports } from "@/lib/reports.functions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { MapPin, Camera, Search, Building2 } from "lucide-react";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/app/reports")({ component: ReportsPage });

const STATUS_STYLE: Record<string, string> = {
  submitted: "bg-info/15 text-info-foreground border-info/30",
  under_review: "bg-warning/15 text-warning-foreground border-warning/30",
  assigned: "bg-secondary text-secondary-foreground",
  resolved: "bg-success/15 text-success border-success/30",
};

function ReportsPage() {
  const fn = useServerFn(listMyReports);
  const q = useQuery({ queryKey: ["my-reports"], queryFn: () => fn() });
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const data = q.data ?? [];
    return data
      .filter((r) => {
        if (filter === "pending") return r.status !== "resolved";
        if (filter === "resolved") return r.status === "resolved";
        return true;
      })
      .filter((r) =>
        search ? `${r.issue_type} ${r.authority} ${r.address ?? ""}`.toLowerCase().includes(search.toLowerCase()) : true,
      );
  }, [q.data, filter, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
          <p className="mt-1 text-muted-foreground">Track every issue you've filed.</p>
        </div>
        <Button asChild className="rounded-full gradient-primary text-primary-foreground shadow-elegant">
          <Link to="/app/report"><Camera className="mr-1 h-4 w-4" /> New Report</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList className="rounded-full">
            <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full">Pending</TabsTrigger>
            <TabsTrigger value="resolved" className="rounded-full">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-full pl-9" />
        </div>
      </div>

      {q.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      ) : list.length === 0 ? (
        <Card className="grid place-items-center rounded-2xl border border-dashed p-16 text-center">
          <Camera className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No reports yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">File your first report and AI will handle the paperwork.</p>
          <Button asChild className="mt-5 rounded-full gradient-primary text-primary-foreground">
            <Link to="/app/report">Report an issue</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <Card className="overflow-hidden rounded-2xl border-0 glass-card shadow-card transition-all hover:shadow-elegant">
                <div className="relative aspect-video overflow-hidden">
                  <img src={r.image_url} alt={r.issue_type} className="h-full w-full object-cover" />
                  <div className="absolute right-2 top-2">
                    <Badge className={`rounded-full border ${STATUS_STYLE[r.status]} capitalize`}>
                      {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold">{r.issue_type}</h3>
                    <Badge
                      variant="secondary"
                      className={`ml-auto rounded-full capitalize ${
                        r.severity === "high" ? "bg-destructive/15 text-destructive" :
                        r.severity === "medium" ? "bg-warning/15 text-warning-foreground" :
                        "bg-success/15 text-success"
                      }`}
                    >{r.severity}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" /> {r.authority}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.address ?? `${r.latitude.toFixed(3)}, ${r.longitude.toFixed(3)}`}
                  </div>
                  <div className="border-t pt-2 text-[11px] text-muted-foreground">
                    Filed {new Date(r.created_at).toLocaleString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}