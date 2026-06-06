import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Camera, MapPin, ShieldCheck, Zap, CheckCircle2, Building2 } from "lucide-react";
import { Aurora } from "@/components/fx/aurora";
import { GridPattern } from "@/components/fx/grid-pattern";
import { BorderBeam } from "@/components/fx/border-beam";
import { ShimmerButton } from "@/components/fx/shimmer-button";

const trust = ["GHMC", "HMWSSB", "TSSPDCL", "Traffic Police", "Municipal Admin"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      <Aurora />
      <GridPattern />
      <div className="absolute left-1/2 top-20 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full gradient-hero opacity-25 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full gradient-primary" />
          </span>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>AI-native civic intelligence · Now in Telangana</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          From complaint
          <span className="block">
            to <span className="relative inline-block gradient-text">resolution</span> — in 60 seconds.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          Snap a photo. Our AI identifies the issue, writes the complaint, routes it to the right authority,
          and rallies your neighbours — all in one tap.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/auth/signup">
            <ShimmerButton className="h-12 px-7 text-sm">
              Report an issue <ArrowRight className="ml-1 h-4 w-4" />
            </ShimmerButton>
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center gap-1.5 rounded-full border border-border bg-card/40 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-card"
          >
            <Zap className="h-4 w-4 text-primary" /> See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-wider text-muted-foreground"
        >
          <span className="text-foreground/80">Routes to</span>
          {trust.map((t) => (
            <span key={t} className="font-semibold text-muted-foreground/80">{t}</span>
          ))}
        </motion.div>

        {/* Hero product preview */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-x-10 -bottom-10 -top-10 -z-10 rounded-[2.5rem] gradient-hero opacity-30 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-2 shadow-glow backdrop-blur-xl">
            <BorderBeam size={260} duration={9} />
            <div className="grid gap-2 rounded-[1.4rem] bg-background/80 p-6 md:grid-cols-[1.1fr_1fr]">
              {/* Left: photo + analysis */}
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted to-background p-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1">
                    <Camera className="h-3 w-3" /> photo.jpg · 2.1MB
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-success">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Analysed
                  </span>
                </div>
                <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl">
                  <div className="absolute inset-0 gradient-hero animate-gradient opacity-90" />
                  <div className="absolute inset-0 bg-mesh mix-blend-overlay" />
                  <div className="absolute inset-0 bg-grid opacity-30" />
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-semibold backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-destructive" /> Pothole · High severity
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-2 w-3/4 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-4/5 gradient-primary animate-shimmer" />
                  </div>
                  <div className="h-2 w-2/3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/5 gradient-primary opacity-80" />
                  </div>
                </div>
              </div>

              {/* Right: complaint draft */}
              <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/60 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Generated complaint
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" /> Gemini · 1.4s
                  </div>
                </div>
                <div className="space-y-2 text-left text-sm leading-relaxed">
                  <div className="font-display font-semibold">Subject: Urgent — Road hazard on MG Road</div>
                  <div className="text-muted-foreground">
                    Dear GHMC Roads Division,<br />
                    A deep pothole (~30cm) at MG Road, Begumpet is causing two-wheeler accidents…
                  </div>
                </div>
                <div className="mt-auto grid gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-info/15 text-info">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold">Routed to GHMC · Roads</div>
                      <div className="truncate text-[10px] text-muted-foreground">040-2111-1111 · roads@ghmc.gov.in</div>
                    </div>
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                      Match 96%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2.5">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold">MG Road, Begumpet, Hyderabad</div>
                      <div className="truncate text-[10px] text-muted-foreground">17.4435° N, 78.4772° E</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -left-4 top-12 hidden rounded-2xl glass-card p-3 shadow-card md:block animate-float"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reports filed</div>
            <div className="mt-0.5 font-display text-xl font-bold gradient-text">12,438</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute -right-4 bottom-16 hidden rounded-2xl glass-card p-3 shadow-card md:block"
            style={{ animation: "float 7s ease-in-out 1.5s infinite" }}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Routing accuracy</div>
            <div className="mt-0.5 font-display text-xl font-bold text-success">94.2%</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}