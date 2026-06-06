import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { ShimmerButton } from "@/components/fx/shimmer-button";

export function LandingNavbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-border/60 glass shadow-card" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Brand />
        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/40 px-2 py-1.5 text-sm font-medium backdrop-blur md:flex">
          {[
            { label: "Home", href: "/" },
            { label: "Features", href: "/#features" },
            { label: "How it works", href: "/#how" },
            { label: "Community", href: "/community" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link to="/app">
              <ShimmerButton className="h-10 px-5 text-sm">Open App</ShimmerButton>
            </Link>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
                <Link to="/auth/login">Login</Link>
              </Button>
              <Link to="/auth/signup">
                <ShimmerButton className="h-10 px-5 text-sm">Get started</ShimmerButton>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}