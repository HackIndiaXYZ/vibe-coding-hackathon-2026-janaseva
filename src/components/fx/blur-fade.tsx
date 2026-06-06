import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Pure-CSS blur-fade reveal on mount. Always renders visible by default,
 * then plays a one-shot entrance animation via `@keyframes blur-in` driven
 * by a per-instance delay. No JS, no IntersectionObserver — reliable under
 * SSR, hydration, screenshots, prefers-reduced-motion (browser respects it).
 */
export function BlurFade({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("[animation:blur-in_0.7s_ease-out_both]", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}