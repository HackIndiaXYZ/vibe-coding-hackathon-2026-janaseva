import { useEffect, useRef, useState } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export type GeoResult = {
  lat: number;
  lng: number;
  label: string;
};

type NominatimItem = {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
};

export function MapSearch({
  onSelect,
  placeholder = "Search a place, area, or landmark…",
  className = "",
}: {
  onSelect: (r: GeoResult) => void;
  placeholder?: string;
  className?: string;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<NominatimItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const tRef = useRef<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    tRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&countrycodes=in&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { headers: { Accept: "application/json" } });
        const data = (await res.json()) as NominatimItem[];
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          className="h-11 rounded-full border-border/60 bg-background/80 pl-9 pr-10 shadow-sm backdrop-blur"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-[1000] mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-border/60 bg-popover/95 p-1 shadow-xl backdrop-blur">
          {results.map((r) => (
            <button
              key={r.place_id}
              type="button"
              onClick={() => {
                onSelect({
                  lat: parseFloat(r.lat),
                  lng: parseFloat(r.lon),
                  label: r.display_name,
                });
                setQ(r.display_name.split(",")[0]);
                setOpen(false);
              }}
              className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="line-clamp-2">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}