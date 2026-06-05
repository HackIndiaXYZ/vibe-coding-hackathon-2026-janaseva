import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot your password — JanMitra AI" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="We'll email you a reset link."
      footer={<><Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link></>}
    >
      {sent ? (
        <p className="rounded-xl bg-success/10 p-4 text-sm text-success-foreground">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = z.string().email().safeParse(email);
            if (!ok.success) return toast.error("Invalid email");
            setLoading(true);
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: `${window.location.origin}/auth/reset-password`,
            });
            setLoading(false);
            if (error) toast.error(error.message);
            else setSent(true);
          }}
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 rounded-xl" />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-xl gradient-primary text-primary-foreground shadow-elegant">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}