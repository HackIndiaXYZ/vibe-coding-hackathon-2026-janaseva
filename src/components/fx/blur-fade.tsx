import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Blur + slide-up reveal that DEGRADES GRACEFULLY:
 * server / no-JS / pre-hydration → fully visible.
 * After mount we briefly hide and animate in, so the wow remains.
 */
export function BlurFade({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // 0 = pre-hydration (visible), 1 = mounted reset (hidden), 2 = revealed
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setPhase(1);
    const el = ref.current;
    if (!el) {
      setPhase(2);
      return;
    }
    const reveal = () => setPhase(2);
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      const t = window.setTimeout(reveal, Math.max(0, delay * 1000));
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          window.setTimeout(reveal, Math.max(0, delay * 1000));
        }
      },
      { rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  const hidden = phase === 1;
  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700 ease-out will-change-transform", className)}
      style={{
        opacity: hidden ? 0 : 1,
        filter: hidden ? "blur(10px)" : "blur(0)",
        transform: hidden ? `translateY(${y}px)` : "translateY(0)",
      }}
    >
      {children}
    </div>
  );
}