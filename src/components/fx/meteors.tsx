import { useMemo } from "react";
import { cn } from "@/lib/utils";

export function Meteors({ number = 18, className }: { number?: number; className?: string }) {
  const meteors = useMemo(() => Array.from({ length: number }), [number]);
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {meteors.map((_, i) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 4 + Math.random() * 6;
        return (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-foreground/80 shadow-[0_0_8px_2px_var(--color-foreground)]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              animation: `meteor ${duration}s linear ${delay}s infinite`,
            }}
          >
            <span className="absolute top-1/2 -z-10 h-px w-[120px] -translate-y-1/2 bg-gradient-to-r from-foreground/60 to-transparent" />
          </span>
        );
      })}
    </div>
  );
}