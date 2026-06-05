import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-elegant">
        <Sparkles className="h-5 w-5 text-primary-foreground" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        JanMitra<span className="gradient-text"> AI</span>
      </span>
    </Link>
  );
}