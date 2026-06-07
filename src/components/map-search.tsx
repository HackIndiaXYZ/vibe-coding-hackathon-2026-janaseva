import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Search, Loader2, MapPin, X, Locate, Clock, CornerDownLeft } from "lucide-react";
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
  type?: string;
  class?: string;
  address?: Record<string, string>;
};

const RECENTS_KEY = "janmitra:recent-places";
const MAX_RECENTS = 5;

function loadRecents(): GeoResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(r: GeoResult) {
  if (typeof window === "undefined") return;
  const prev = loadRecents().filter((x) => x.label !== r.label);
  const next = [r, ...prev].slice(0, MAX_RECENTS);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
}

function splitLabel(full: string) {
  const [primary, ...rest] = full.split(",").map((s) => s.trim());
  return { primary: primary || full, secondary: rest.join(", ") };
}

function highlight(text: string, q: string) {
  if (!q.trim()) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? (
      <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

function typeBadge(item: NominatimItem): string | null {
  const t = item.type || item.class;
  if (!t) return null;
  const map: Record<string, string> = {
    city: "City",
    town: "Town",
    village: "Village",
    suburb: "Area",
    neighbourhood: "Area",
    road: "Road",
    residential: "Road",
    state: "State",
    administrative: "Region",
    hamlet: "Hamlet",
    locality: "Locality",
  };
  return map[t] ?? t.charAt(0).toUpperCase() + t.slice(1);
}

export function MapSearch({
  onSelect,
  placeholder = "Search a place, area, or landmark…",
  className = "",
  autoFocus = false,
}: {
  onSelect: (r: GeoResult) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<NominatimItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<GeoResult[]>([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRecents(loadRecents());
  }, []);

  const trimmed = q.trim();

  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    if (abortRef.current) abortRef.current.abort();
    setError(null);
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    tRef.current = window.setTimeout(async () => {
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&countrycodes=in&q=${encodeURIComponent(trimmed)}`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
          signal: ac.signal,
        });
        const data = (await res.json()) as NominatimItem[];
        setResults(data);
        setActive(0);
        setOpen(true);
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setError("Could not reach search. Check your connection.");
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, [trimmed]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const choose = useCallback(
    (r: GeoResult) => {
      onSelect(r);
      saveRecent(r);
      setRecents(loadRecents());
      setQ(splitLabel(r.label).primary);
      setOpen(false);
      setResults([]);
    },
    [onSelect],
  );

  const useMyLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation isn't supported on this device.");
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`;
          const res = await fetch(url, { headers: { Accept: "application/json" } });
          const data = await res.json();
          const label = data?.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          choose({ lat, lng, label });
        } catch {
          choose({ lat, lng, label: `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError("Couldn't access your location. Allow permission and retry.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [choose]);

  const showRecents = open && !trimmed && recents.length > 0;
  const showResults = open && results.length > 0;
  const showEmpty = open && trimmed.length >= 2 && !loading && results.length === 0 && !error;

  const items = useMemo(
    () =>
      results.map((r) => ({
        key: r.place_id,
        item: r,
        result: {
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
          label: r.display_name,
        } as GeoResult,
      })),
    [results],
  );

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showResults) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = items[active];
      if (sel) choose(sel.result);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div className="relative group">
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-fuchsia-500/20 to-indigo-500/20 opacity-0 blur-md transition-opacity duration-300 group-focus-within:opacity-100" />
        <div className="relative flex items-center gap-1 rounded-full border border-border/60 bg-background/80 pl-3 pr-1.5 shadow-sm backdrop-blur transition-colors focus-within:border-primary/60">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={q}
            autoFocus={autoFocus}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            aria-label="Search location"
            className="h-11 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {loading && (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          )}
          {q && !loading && (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setQ("");
                setResults([]);
                inputRef.current?.focus();
              }}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="mx-1 h-5 w-px bg-border/60" aria-hidden />
          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            aria-label="Use my current location"
            title="Use my current location"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary disabled:opacity-60"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {open && (showRecents || showResults || showEmpty || error) && (
        <div className="absolute z-[1000] mt-2 w-full overflow-hidden rounded-2xl border border-border/60 bg-popover/95 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="px-3 py-2 text-xs text-destructive">{error}</div>
          )}

          {showRecents && (
            <div className="p-1">
              <div className="flex items-center justify-between px-2 pb-1 pt-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent
                </span>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(RECENTS_KEY);
                    setRecents([]);
                  }}
                  className="text-[10px] text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              </div>
              {recents.map((r, i) => {
                const { primary, secondary } = splitLabel(r.label);
                return (
                  <button
                    key={`${r.label}-${i}`}
                    type="button"
                    onClick={() => choose(r)}
                    className="flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{primary}</span>
                      {secondary && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {secondary}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {showResults && (
            <div className="max-h-80 overflow-auto p-1">
              {items.map(({ key, item, result }, idx) => {
                const { primary, secondary } = splitLabel(item.display_name);
                const badge = typeBadge(item);
                const isActive = idx === active;
                return (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => choose(result)}
                    className={`flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? "bg-accent" : "hover:bg-accent/60"
                    }`}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {highlight(primary, trimmed)}
                        </span>
                        {badge && (
                          <span className="rounded-full border border-border/60 bg-background/60 px-1.5 py-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {badge}
                          </span>
                        )}
                      </span>
                      {secondary && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {secondary}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CornerDownLeft className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {showEmpty && (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">
              No places match <span className="font-medium text-foreground">"{trimmed}"</span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-3 py-1.5 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border/60 bg-background/60 px-1">↑</kbd>
              <kbd className="rounded border border-border/60 bg-background/60 px-1">↓</kbd>
              navigate
              <kbd className="ml-2 rounded border border-border/60 bg-background/60 px-1">↵</kbd>
              select
              <kbd className="ml-2 rounded border border-border/60 bg-background/60 px-1">esc</kbd>
              close
            </span>
            <span>Powered by OpenStreetMap</span>
          </div>
        </div>
      )}
    </div>
  );
}