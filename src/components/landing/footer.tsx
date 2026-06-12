import { Brand } from "@/components/brand";
import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  return (
    <footer id="about" className="border-t bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Brand />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              JanaSeva AI turns a single photo into a routed civic complaint — so citizens spend seconds, not hours,
              fixing what's broken around them.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="/#features" className="hover:text-foreground">Features</a></li>
              <li><a href="/#how" className="hover:text-foreground">How it works</a></li>
              <li><Link to="/community" className="hover:text-foreground">Community Pulse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground">About</a></li>
              <li><Link to="/auth/login" className="hover:text-foreground">Sign in</Link></li>
              <li><Link to="/auth/signup" className="hover:text-foreground">Get started</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} JanaSeva AI. From complaint to resolution.</span>
          <span>Built for citizens of Telangana.</span>
        </div>
      </div>
    </footer>
  );
}