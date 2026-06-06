import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Meteors } from "@/components/fx/meteors";
import { BorderBeam } from "@/components/fx/border-beam";
import { GridPattern } from "@/components/fx/grid-pattern";

export function CTA() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-border/60 p-12 text-center shadow-glow sm:p-20">
        <div className="absolute inset-0 -z-10 gradient-hero animate-gradient" />
        <div className="absolute inset-0 -z-10 bg-black/30" />
        <GridPattern className="opacity-20" />
        <Meteors number={20} />
        <BorderBeam size={300} duration={10} />
        <h3 className="font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Your city deserves better.
          <br />
          Start today.
        </h3>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/85 sm:text-lg">
          Join 12,000+ citizens turning broken streetlights, potholes and overflowing drains into closed-loop resolutions.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/auth/signup"
            className="group inline-flex h-12 items-center gap-1.5 rounded-full bg-background px-7 text-sm font-semibold text-foreground shadow-elegant transition-all hover:scale-[1.02] hover:shadow-glow"
          >
            Get started free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/community"
            className="inline-flex h-12 items-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            Explore Community Pulse
          </Link>
        </div>
        <p className="mt-5 text-xs text-white/70">Free forever for citizens · No credit card</p>
      </div>
    </section>
  );
}