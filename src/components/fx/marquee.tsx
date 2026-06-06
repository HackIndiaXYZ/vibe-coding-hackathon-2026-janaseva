import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
  speed = "normal",
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  speed?: "normal" | "slow";
}) {
  return (
    <div className={cn("group flex overflow-hidden [--gap:1rem]", className)}>
      <div
        className={cn(
          "flex shrink-0 items-stretch gap-[--gap] pr-[--gap]",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}