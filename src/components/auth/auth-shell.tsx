import type { ReactNode } from "react";
import { Brand } from "@/components/brand";
import { Link } from "@tanstack/react-router";
import { Aurora } from "@/components/fx/aurora";
import { GridPattern } from "@/components/fx/grid-pattern";
import { BorderBeam } from "@/components/fx/border-beam";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Aurora />
      <GridPattern />
      <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full gradient-hero opacity-25 blur-3xl" />
      <header className="relative px-4 py-5 sm:px-8">
        <Brand />
      </header>
      <main className="relative mx-auto flex w-full max-w-md flex-col px-4 py-6 sm:px-0">
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 shadow-glow">
          <BorderBeam size={180} duration={10} />
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing you agree to JanaSeva AI's{" "}
          <Link to="/" className="underline">Terms</Link> and{" "}
          <Link to="/" className="underline">Privacy Policy</Link>.
        </p>
      </main>
    </div>
  );
}