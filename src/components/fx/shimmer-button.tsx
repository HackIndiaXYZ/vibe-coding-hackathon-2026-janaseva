import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "group relative inline-flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-full px-6 text-sm font-semibold text-primary-foreground transition-all",
          "gradient-hero shadow-elegant hover:shadow-glow",
          className,
        )}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative z-10 flex items-center gap-1.5">{children}</span>
      </button>
    );
  },
);
ShimmerButton.displayName = "ShimmerButton";