import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { listCommunityReports, toggleSupport } from "@/lib/reports.functions";
import { ClientOnly } from "@/components/client-only";
import { CommunityMap, type CommunityReport } from "@/components/community-map";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app/community")({ component: CommunityPage });

function CommunityPage() {
  const listFn = useServerFn(listCommunityReports);
  const supportFn = useServerFn(toggleSupport);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["community-reports"], queryFn: () => listFn() as Promise<CommunityReport[]> });

  useEffect(() => {
    const ch = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => {
        qc.invalidateQueries({ queryKey: ["community-reports"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "community_support" }, () => {
        qc.invalidateQueries({ queryKey: ["community-reports"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Community Pulse</h1>
        <p className="mt-1 text-muted-foreground">Every reported issue in your community — live.</p>
      </div>
      <div className="h-[calc(100vh-220px)] overflow-hidden rounded-2xl border shadow-card">
        {q.isLoading ? (
          <div className="grid h-full place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <ClientOnly>
            <CommunityMap
              reports={q.data ?? []}
              onSupport={async (id) => {
                try {
                  const r = await supportFn({ data: { reportId: id } });
                  toast.success(r.supported ? "Support added" : "Support removed");
                  qc.invalidateQueries({ queryKey: ["community-reports"] });
                } catch (e) {
                  toast.error((e as Error).message);
                }
              }}
            />
          </ClientOnly>
        )}
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-destructive" /> High severity</div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-warning" /> Medium</div>
        <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-success" /> Low</div>
      </div>
    </div>
  );
}