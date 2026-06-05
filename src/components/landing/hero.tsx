import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Camera, MapPin, ShieldCheck, Zap } from "lucide-react";

const cards = [
  { icon: Camera, label: "Pothole detected", sub: "Severity: High", cls: "destructive" },
  { icon: MapPin, label: "Routed to GHMC", sub: "Roads Dept · 040-2111-1111", cls: "info" },
  { icon: ShieldCheck, label: "Complaint drafted", sub: "AI-written · Editable", cls: "accent" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div className="absolute inset-0 -z-10 bg-mesh" />
      <div className="absolute left-1/2 top-20 -z-10 h-[480px] w-[480px] -translate-x-1/2 rounded-full gradient-primary opacity-20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>AI-native civic intelligence · Now in Telangana</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            >
              Report civic issues in seconds
              <span className="block gradient-text">with AI.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground"
            >
              Upload a photo. Let AI identify the issue, generate a complaint, find the right authority, and help
              improve your community — all in under 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full gradient-primary px-6 text-primary-foreground shadow-elegant hover:opacity-95"
              >
                <Link to="/auth/signup">
                  Report an Issue <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <a href="#how">
                  <Zap className="mr-1 h-4 w-4" /> Watch Demo
                </a>
              </Button>
            </motion.div>

            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div>
                <div className="text-2xl font-bold text-foreground">12k+</div>
                <div>Reports filed</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">37</div>
                <div>Authorities mapped</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">94%</div>
                <div>Routing accuracy</div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative h-[520px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-6 rounded-3xl gradient-hero opacity-90 shadow-glow animate-gradient"
            />
            <div className="absolute inset-6 rounded-3xl bg-mesh mix-blend-overlay" />

            {cards.map((c, i) => {
              const Icon = c.icon;
              const positions = [
                "left-2 top-6 sm:left-0",
                "right-0 top-44",
                "left-6 bottom-6",
              ];
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                  className={`absolute ${positions[i]} w-64 rounded-2xl glass-card p-4 shadow-card`}
                  style={{ animation: `float 6s ease-in-out ${i * 1.2}s infinite` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.label}</div>
                      <div className="text-xs text-muted-foreground">{c.sub}</div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 gradient-primary" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}