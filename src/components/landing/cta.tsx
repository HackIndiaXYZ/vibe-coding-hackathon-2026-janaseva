import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] gradient-hero p-12 text-primary-foreground shadow-glow sm:p-16">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Your city deserves better. Start today.</h3>
            <p className="mt-3 max-w-xl opacity-90">
              Join 12,000+ citizens turning broken streetlights, potholes and overflowing drains into closed-loop
              resolutions.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-background px-6 text-foreground shadow-elegant hover:bg-background/90"
          >
            <Link to="/auth/signup">
              Get started free <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}