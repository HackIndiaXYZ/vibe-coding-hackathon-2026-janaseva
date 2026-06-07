import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, severityIcon, Recenter } from "@/components/leaflet-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Flame, Activity, Leaf } from "lucide-react";
import { MapSearch } from "@/components/map-search";

export type CommunityReport = {
  id: string;
  image_url: string;
  issue_type: string;
  severity: "low" | "medium" | "high";
  description: string;
  authority: string;
  latitude: number;
  longitude: number;
  address: string | null;
  status: string;
  support_count: number;
};

export function CommunityMap({
  reports,
  center = { lat: 17.385, lng: 78.4867 },
  onSupport,
}: {
  reports: CommunityReport[];
  center?: { lat: number; lng: number };
  onSupport?: (id: string) => void;
}) {
  const [focus, setFocus] = useState<{ lat: number; lng: number } | null>(null);
  const [filters, setFilters] = useState<Record<"low" | "medium" | "high", boolean>>({
    low: true,
    medium: true,
    high: true,
  });

  const visible = useMemo(() => reports.filter((r) => filters[r.severity]), [reports, filters]);
  const counts = useMemo(
    () => ({
      high: reports.filter((r) => r.severity === "high").length,
      medium: reports.filter((r) => r.severity === "medium").length,
      low: reports.filter((r) => r.severity === "low").length,
    }),
    [reports],
  );

  const chip = (key: "high" | "medium" | "low", label: string, Icon: typeof Heart, tone: string) => (
    <button
      type="button"
      onClick={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
        filters[key]
          ? `${tone} shadow-sm`
          : "border-border/60 bg-background/70 text-muted-foreground hover:bg-accent"
      }`}
    >
      <Icon className="h-3 w-3" />
      {label} · {counts[key]}
    </button>
  );

  return (
    <div className="relative h-full w-full">
      {/* Floating controls overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex flex-col gap-2 p-3 sm:p-4">
        <div className="pointer-events-auto">
          <MapSearch
            placeholder="Jump to a city, area, or landmark…"
            onSelect={(r) => setFocus({ lat: r.lat, lng: r.lng })}
          />
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {chip("high", "High", Flame, "border-destructive/30 bg-destructive/15 text-destructive")}
          {chip("medium", "Medium", Activity, "border-warning/30 bg-warning/15 text-warning-foreground")}
          {chip("low", "Low", Leaf, "border-success/30 bg-success/15 text-success")}
          <span className="ml-auto rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Showing {visible.length} of {reports.length}
          </span>
        </div>
      </div>

      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {focus && <Recenter lat={focus.lat} lng={focus.lng} />}
      {visible.map((r) => (
        <Marker key={r.id} position={[r.latitude, r.longitude]} icon={severityIcon(r.severity)}>
          <Popup>
            <div style={{ width: 220 }}>
              <img src={r.image_url} alt={r.issue_type} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ marginTop: 8, fontWeight: 600 }}>{r.issue_type}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{r.description}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                <Badge variant="secondary" className="capitalize">{r.severity}</Badge>
                <Badge variant="outline" className="capitalize">{r.status.replace("_", " ")}</Badge>
              </div>
              {onSupport && (
                <Button size="sm" className="mt-2 w-full rounded-full gradient-primary text-primary-foreground" onClick={() => onSupport(r.id)}>
                  <Heart className="mr-1 h-3 w-3" /> I'm affected too ({r.support_count})
                </Button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      </MapContainer>
    </div>
  );
}