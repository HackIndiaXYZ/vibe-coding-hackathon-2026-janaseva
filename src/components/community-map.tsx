import { MapContainer, TileLayer, Marker, Popup, severityIcon } from "@/components/leaflet-map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

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
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {reports.map((r) => (
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
  );
}