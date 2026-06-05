import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera, MapPin, Brain, Building2, FileText, Send, Upload, Loader2, ArrowRight, ArrowLeft, RefreshCw, Languages, Copy, CheckCircle2,
} from "lucide-react";
import { ClientOnly } from "@/components/client-only";
import { analyzeImage, generateComplaint, submitReport } from "@/lib/reports.functions";
import { MapContainer, TileLayer, Marker, useMapEvents, Recenter } from "@/components/leaflet-map";

export const Route = createFileRoute("/app/report")({ component: ReportPage });

type Severity = "low" | "medium" | "high";
type Analysis = { issue_type: string; severity: Severity; description: string; authority: { name: string; contact: string; jurisdiction: string } };

const STEPS = [
  { id: 1, label: "Upload", icon: Upload },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "AI Analysis", icon: Brain },
  { id: 4, label: "Authority", icon: Building2 },
  { id: 5, label: "Complaint", icon: FileText },
  { id: 6, label: "Submit", icon: Send },
];

function ReportPage() {
  const navigate = useNavigate();
  const analyzeFn = useServerFn(analyzeImage);
  const generateFn = useServerFn(generateComplaint);
  const submitFn = useServerFn(submitReport);

  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>("image/jpeg");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Please upload an image");
    if (file.size > 8_000_000) return toast.error("Image too large (max 8MB)");
    setContentType(file.type);
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function runAnalysis() {
    if (!image) return;
    setBusy(true);
    try {
      const a = (await analyzeFn({ data: { imageBase64: image } })) as Analysis;
      setAnalysis(a);
      setStep(4);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function runComplaint(lang: "en" | "hi" | "te" = "en") {
    if (!analysis) return;
    setBusy(true);
    try {
      const c = await generateFn({
        data: {
          issueType: analysis.issue_type,
          description: analysis.description,
          address,
          authority: analysis.authority.name,
          language: lang,
        },
      });
      setSubject(c.subject);
      setBody(c.body);
      if (step < 5) setStep(5);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitReport() {
    if (!image || !analysis || !coords) return;
    setBusy(true);
    try {
      await submitFn({
        data: {
          imageBase64: image,
          imageContentType: contentType,
          issueType: analysis.issue_type,
          severity: analysis.severity,
          description: analysis.description,
          authority: analysis.authority.name,
          authorityContact: analysis.authority.contact,
          subject,
          complaintBody: body,
          latitude: coords.lat,
          longitude: coords.lng,
          address,
        },
      });
      setSubmitted(true);
      toast.success("Report submitted!");
      setTimeout(() => navigate({ to: "/app/reports" }), 1800);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="mt-1 text-muted-foreground">Six quick steps. AI handles the hard parts.</p>
      </div>

      {/* Stepper */}
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-elegant"
                      : done
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                  <span>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="rounded-2xl border-0 glass-card p-6 shadow-card sm:p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <h2 className="text-xl font-semibold">Upload a photo</h2>
              <p className="mt-1 text-sm text-muted-foreground">Clear photos help AI identify the issue accurately.</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
                onClick={() => inputRef.current?.click()}
                className="mt-6 grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-colors hover:border-primary hover:bg-primary/5"
              >
                {image ? (
                  <img src={image} alt="preview" className="max-h-72 rounded-xl object-contain" />
                ) : (
                  <>
                    <Camera className="h-10 w-10 text-muted-foreground" />
                    <p className="mt-3 text-sm font-medium">Drag & drop, or click to upload</p>
                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG up to 8MB</p>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!image} className="rounded-full gradient-primary text-primary-foreground">
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <h2 className="text-xl font-semibold">Pin the location</h2>
              <p className="mt-1 text-sm text-muted-foreground">Drop a pin on the map or use your current location.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    if (!navigator.geolocation) return toast.error("Geolocation unavailable");
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                      () => toast.error("Could not get location"),
                    );
                  }}
                >
                  <MapPin className="mr-1 h-4 w-4" /> Use current location
                </Button>
                {coords && (
                  <Badge variant="secondary" className="rounded-full">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </Badge>
                )}
              </div>
              <div className="mt-4 h-72 overflow-hidden rounded-2xl border">
                <ClientOnly fallback={<div className="grid h-full place-items-center text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>}>
                  <PinPicker coords={coords} onSelect={setCoords} />
                </ClientOnly>
              </div>
              <div className="mt-4">
                <Label htmlFor="addr">Address / landmark (optional)</Label>
                <Input id="addr" placeholder="e.g. Near Hitech City Metro" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(3)} disabled={!coords} className="rounded-full gradient-primary text-primary-foreground">
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}>
              <h2 className="text-xl font-semibold">AI Analysis</h2>
              <p className="mt-1 text-sm text-muted-foreground">Gemini Vision will identify the issue and severity.</p>
              <div className="mt-6 grid place-items-center gap-4 rounded-2xl border bg-muted/30 p-10 text-center">
                {busy ? (
                  <>
                    <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow animate-pulse-glow">
                      <Brain className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-medium">Analyzing photo…</p>
                    <p className="text-xs text-muted-foreground">This usually takes 3–6 seconds.</p>
                  </>
                ) : (
                  <>
                    <Brain className="h-12 w-12 text-primary" />
                    <Button onClick={runAnalysis} className="rounded-full gradient-primary text-primary-foreground">
                      Run AI analysis
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} disabled={busy}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && analysis && (
            <motion.div key="4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold">AI identified the issue</h2>
                <p className="mt-1 text-sm text-muted-foreground">Review the analysis and authority routing below.</p>
              </div>
              <Card className="grid gap-4 rounded-2xl border bg-card/60 p-5 md:grid-cols-[200px_1fr]">
                {image && <img src={image} alt="report" className="h-40 w-full rounded-xl object-cover" />}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="rounded-full gradient-primary text-primary-foreground">{analysis.issue_type}</Badge>
                    <Badge variant="secondary" className={`rounded-full capitalize ${
                      analysis.severity === "high" ? "bg-destructive/15 text-destructive" :
                      analysis.severity === "medium" ? "bg-warning/15 text-warning-foreground" :
                      "bg-success/15 text-success"
                    }`}>{analysis.severity} severity</Badge>
                  </div>
                  <p className="text-sm text-foreground">{analysis.description}</p>
                </div>
              </Card>
              <Card className="rounded-2xl border bg-card/60 p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Routed to</div>
                    <div className="text-lg font-semibold">{analysis.authority.name}</div>
                    <div className="text-xs text-muted-foreground">{analysis.authority.jurisdiction} · {analysis.authority.contact}</div>
                  </div>
                </div>
              </Card>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}><ArrowLeft className="mr-1 h-4 w-4" /> Re-analyze</Button>
                <Button
                  onClick={() => runComplaint("en")}
                  disabled={busy}
                  className="rounded-full gradient-primary text-primary-foreground"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Generate complaint <ArrowRight className="ml-1 h-4 w-4" /></>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="5" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Your complaint</h2>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => runComplaint("en")}>
                    <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => runComplaint("hi")}>
                    <Languages className="mr-1 h-3 w-3" /> हिन्दी
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-full" disabled={busy} onClick={() => runComplaint("te")}>
                    <Languages className="mr-1 h-3 w-3" /> తెలుగు
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      navigator.clipboard.writeText(`${subject}\n\n${body}`);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="subj">Subject</Label>
                <Input id="subj" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="body">Complaint body</Label>
                <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={12} className="mt-1 rounded-xl" />
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(4)}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
                <Button onClick={() => setStep(6)} disabled={!subject || !body} className="rounded-full gradient-primary text-primary-foreground">
                  Review & submit <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 6 && analysis && (
            <motion.div key="6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5 text-center">
              {submitted ? (
                <>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto grid h-24 w-24 place-items-center rounded-full gradient-primary text-primary-foreground shadow-glow"
                  >
                    <CheckCircle2 className="h-12 w-12" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Report submitted!</h2>
                  <p className="text-muted-foreground">Redirecting to your reports…</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Ready to submit?</h2>
                  <p className="text-sm text-muted-foreground">We'll route this to <strong>{analysis.authority.name}</strong> and add it to Community Pulse.</p>
                  <div className="flex justify-center gap-3">
                    <Button variant="ghost" onClick={() => setStep(5)}><ArrowLeft className="mr-1 h-4 w-4" /> Edit</Button>
                    <Button onClick={onSubmitReport} disabled={busy} size="lg" className="rounded-full gradient-primary text-primary-foreground shadow-elegant">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-1 h-4 w-4" /> Submit report</>}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}

function PinPicker({ coords, onSelect }: { coords: { lat: number; lng: number } | null; onSelect: (c: { lat: number; lng: number }) => void }) {
  const center = coords ?? { lat: 17.385, lng: 78.4867 }; // Hyderabad default
  function Clicker() {
    useMapEvents({ click(e) { onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
    return null;
  }
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
      {coords && <Marker position={[coords.lat, coords.lng]} />}
      {coords && <Recenter lat={coords.lat} lng={coords.lng} />}
      <Clicker />
    </MapContainer>
  );
}