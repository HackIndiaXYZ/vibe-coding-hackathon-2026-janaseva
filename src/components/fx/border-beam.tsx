import { cn } from "@/lib/utils";

export function BorderBeam({
  className,
  size = 220,
  duration = 8,
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:1px_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect]",
        "[mask:linear-gradient(transparent,transparent),linear-gradient(black,black)]",
        "after:absolute after:aspect-square after:w-[var(--size)] after:animate-[beam_var(--duration)_linear_infinite] after:[animation-delay:var(--delay)]",
        "after:[background:linear-gradient(to_left,oklch(0.76_0.18_40),oklch(0.7_0.22_350),oklch(0.66_0.2_285),transparent)]",
        "after:[offset-anchor:90%_50%] after:[offset-path:rect(0_auto_auto_0_round_var(--size))]",
        className,
      )}
      style={{
        // @ts-expect-error css vars
        "--size": `${size}px`,
        "--duration": `${duration}s`,
        "--delay": `${delay}s`,
      }}
    />
  );
}