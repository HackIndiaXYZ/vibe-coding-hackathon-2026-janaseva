import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { listCommunityReports } from "@/lib/reports.functions";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { ClientOnly } from "@/components/client-only";
import { CommunityMap, type CommunityReport } from "@/components/community-map";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/community")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Community Pulse — JanMitra AI" },
      { name: "description", content: "Live map of civic issues reported across Telangana — see what's broken and rally support." },
      { property: "og:title", content: "Community Pulse — JanMitra AI" },
      { property: "og:description", content: "See live civic reports across your community." },
    ],
  }),
  component: PublicCommunity,
});

function PublicCommunity() {
  const listFn = useServerFn(listCommunityReports);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["community-public"], queryFn: () => listFn() as Promise<CommunityReport[]> });
  useEffect(() => {
    const ch = supabase
      .channel("reports-public-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports" }, () => {
        qc.invalidateQueries({ queryKey: ["community-public"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "community_support" }, () => {
        qc.invalidateQueries({ queryKey: ["community-public"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Community Pulse</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">A live, public map of every civic issue reported through JanMitra AI.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Live · {q.data?.length ?? 0} reports
          </div>
        </div>
        <div className="mt-6 h-[70vh] overflow-hidden rounded-2xl border shadow-card">
          {q.isLoading ? (
            <div className="grid h-full place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : (
            <ClientOnly>
              <CommunityMap reports={q.data ?? []} />
            </ClientOnly>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}