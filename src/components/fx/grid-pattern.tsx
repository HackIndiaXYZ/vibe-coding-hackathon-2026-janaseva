import { cn } from "@/lib/utils";

export function GridPattern({ className, fade = true }: { className?: string; fade?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-grid",
        fade && "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className,
      )}
    />
  );
}

export function DotPattern({ className, fade = true }: { className?: string; fade?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-dot",
        fade && "[mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className,
      )}
    />
  );
}