import { Camera, Brain, FileText, Building2, Send, Users } from "lucide-react";
import { BlurFade } from "@/components/fx/blur-fade";

const STEPS = [
  { icon: Camera, title: "Upload Photo", body: "Snap or drag a photo of the issue. Geolocation auto-tagged." },
  { icon: Brain, title: "AI Analysis", body: "Gemini Vision identifies type, severity and writes a description." },
  { icon: FileText, title: "Complaint Drafted", body: "A polished, editable complaint letter in 1.4 seconds." },
  { icon: Building2, title: "Authority Routed", body: "Mapped to the right civic body with contact info." },
  { icon: Send, title: "Submit & Track", body: "One tap. Stored, timestamped, status tracked end-to-end." },
  { icon: Users, title: "Community Lift", body: "Neighbours can support to amplify urgency and pressure." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-mesh opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <BlurFade>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              How it works
            </div>
            <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Photo to resolution. <span className="gradient-text">Six steps.</span>
            </h2>
          </div>
        </BlurFade>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/50 to-transparent lg:block"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <BlurFade key={s.title} delay={i * 0.06}>
                  <div className="group relative h-full overflow-hidden rounded-3xl glass-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
                    <div className="flex items-start justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-display text-4xl font-bold text-foreground/5 transition-colors group-hover:text-primary/20">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}