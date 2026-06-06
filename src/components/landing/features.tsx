import { Eye, FileText, Building2, Map, Languages, Bell } from "lucide-react";
import { BlurFade } from "@/components/fx/blur-fade";
import { GridPattern, DotPattern } from "@/components/fx/grid-pattern";
import { Marquee } from "@/components/fx/marquee";

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <BlurFade>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Built for citizens
            </div>
            <h2 className="mt-4 font-display text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need <span className="gradient-text">to be heard.</span>
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              JanMitra AI compresses an hour of paperwork into a single tap — without losing the rigor of an official complaint.
            </p>
          </div>
        </BlurFade>

        <div className="mt-16 grid auto-rows-[14rem] grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[16rem]">
          {/* AI Vision — large */}
          <BlurFade delay={0.05} className="md:col-span-2 md:row-span-2">
            <BentoCard
              icon={Eye}
              title="AI Vision Detection"
              body="Gemini Vision identifies the issue, classifies severity and writes a concise description from a single photo."
              className="h-full"
            >
              <div className="absolute inset-x-6 bottom-0 top-32 overflow-hidden rounded-t-2xl border border-border/60 bg-card/60">
                <div className="absolute inset-0 gradient-hero opacity-80 animate-gradient" />
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute left-4 top-4 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-destructive align-middle" />
                  Pothole · 92%
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <div className="h-1.5 w-2/3 rounded-full bg-background/40" />
                  <div className="h-1.5 w-1/2 rounded-full bg-background/30" />
                </div>
              </div>
            </BentoCard>
          </BlurFade>

          {/* Languages */}
          <BlurFade delay={0.1}>
            <BentoCard icon={Languages} title="Speak any language" body="One-tap translation to Hindi, Telugu, Urdu, Tamil.">
              <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-1.5">
                {["English", "हिन्दी", "తెలుగు", "اردو", "தமிழ்"].map((l) => (
                  <span key={l} className="rounded-full border border-border/60 bg-card/60 px-2 py-0.5 text-[10px] font-medium">
                    {l}
                  </span>
                ))}
              </div>
            </BentoCard>
          </BlurFade>

          {/* Authority routing */}
          <BlurFade delay={0.15}>
            <BentoCard icon={Building2} title="Routes to the right authority" body="37 Telangana civic bodies mapped & ranked.">
              <Marquee className="absolute inset-x-0 bottom-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
                {["GHMC", "HMWSSB", "TSSPDCL", "Traffic Police", "RTA", "Municipal Admin"].map((a) => (
                  <span key={a} className="shrink-0 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-semibold">
                    {a}
                  </span>
                ))}
              </Marquee>
            </BentoCard>
          </BlurFade>

          {/* Complaint draft */}
          <BlurFade delay={0.2}>
            <BentoCard icon={FileText} title="Polished complaint, drafted" body="A real letter — editable, formal, ready to send.">
              <div className="absolute inset-x-6 bottom-6 space-y-1.5 rounded-xl border border-border/60 bg-card/60 p-3 text-[11px]">
                <div className="font-semibold">Subject: Urgent road hazard…</div>
                <div className="h-1 w-full rounded-full bg-muted" />
                <div className="h-1 w-4/5 rounded-full bg-muted" />
                <div className="h-1 w-3/5 rounded-full bg-muted" />
              </div>
            </BentoCard>
          </BlurFade>

          {/* Community */}
          <BlurFade delay={0.25} className="md:col-span-2">
            <BentoCard icon={Map} title="Live community map" body="See every reported issue near you. Add your support, amplify urgency." pattern="dot">
              <div className="absolute inset-x-6 bottom-6 top-28 overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
                <div className="absolute inset-0 bg-dot opacity-60" />
                {[
                  { l: "20%", t: "30%", c: "bg-destructive" },
                  { l: "55%", t: "55%", c: "bg-warning" },
                  { l: "75%", t: "25%", c: "bg-success" },
                  { l: "40%", t: "70%", c: "bg-destructive" },
                  { l: "85%", t: "65%", c: "bg-warning" },
                ].map((p, i) => (
                  <span
                    key={i}
                    className={`absolute h-3 w-3 rounded-full ${p.c} shadow-[0_0_0_4px_color-mix(in_oklab,currentColor_15%,transparent)]`}
                    style={{ left: p.l, top: p.t, animation: `pulse-glow 3s ease-in-out ${i * 0.3}s infinite` }}
                  />
                ))}
              </div>
            </BentoCard>
          </BlurFade>

          {/* Notifications */}
          <BlurFade delay={0.3}>
            <BentoCard icon={Bell} title="Status updates, end-to-end" body="Resolution, escalation, follow-up — tracked.">
              <div className="absolute inset-x-6 bottom-6 space-y-1.5">
                {["Submitted", "Acknowledged", "In progress"].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 text-[11px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${i < 2 ? "bg-success" : "bg-primary"}`} />
                    <span className={i < 2 ? "text-muted-foreground line-through" : "font-semibold"}>{s}</span>
                  </div>
                ))}
              </div>
            </BentoCard>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}

function BentoCard({
  icon: Icon,
  title,
  body,
  children,
  className = "",
  pattern = "grid",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
  pattern?: "grid" | "dot";
}) {
  return (
    <div className={`group relative h-full overflow-hidden rounded-3xl glass-card shadow-card transition-all hover:shadow-elegant ${className}`}>
      {pattern === "grid" ? <GridPattern className="opacity-40" /> : <DotPattern className="opacity-40" />}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative p-6">
        <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
        <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{body}</p>
      </div>
      {children}
    </div>
  );
}