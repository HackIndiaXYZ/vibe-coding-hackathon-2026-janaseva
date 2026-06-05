import type { ReactNode } from "react";
import { Brand } from "@/components/brand";
import { Link } from "@tanstack/react-router";

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
      <div className="absolute inset-0 -z-10 bg-mesh opacity-70" />
      <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full gradient-primary opacity-20 blur-3xl" />
      <header className="px-4 py-5 sm:px-8">
        <Brand />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-col px-4 py-6 sm:px-0">
        <div className="rounded-3xl glass-card p-8 shadow-card">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <div className="mt-5 text-center text-sm text-muted-foreground">{footer}</div>}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          By continuing you agree to JanMitra AI's{" "}
          <Link to="/" className="underline">Terms</Link> and{" "}
          <Link to="/" className="underline">Privacy Policy</Link>.
        </p>
      </main>
    </div>
  );
}