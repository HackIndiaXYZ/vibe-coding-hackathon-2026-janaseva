import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl gradient-hero shadow-elegant transition-transform group-hover:scale-105">
        <span className="absolute inset-0 bg-mesh mix-blend-overlay" />
        <Sparkles className="relative h-5 w-5 text-primary-foreground" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        JanaSeva<span className="gradient-text"> AI</span>
      </span>
    </Link>
  );
}