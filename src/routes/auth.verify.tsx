import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { MailCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/auth/verify")({
  validateSearch: z.object({ email: z.string().email().optional() }),
  head: () => ({ meta: [{ title: "Verify your email — JanMitra AI" }] }),
  component: VerifyPage,
});

function VerifyPage() {
  const { email } = Route.useSearch();
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell
      title="Check your inbox"
      footer={<>Verified? <Link to="/auth/login" className="font-medium text-primary hover:underline">Sign in</Link></>}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-3xl gradient-primary text-primary-foreground shadow-glow"
        >
          <MailCheck className="h-10 w-10" />
        </motion.div>
        <p className="mt-6 text-sm text-foreground">
          Please verify your email to continue. We've sent a confirmation link to
        </p>
        {email && <p className="mt-1 font-semibold">{email}</p>}
        <p className="mt-2 text-xs text-muted-foreground">Click the link in the email to activate your account.</p>
        {email && (
          <Button
            type="button"
            variant="outline"
            className="mt-6 rounded-xl"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const { error } = await supabase.auth.resend({
                type: "signup",
                email,
                options: { emailRedirectTo: `${window.location.origin}/app` },
              });
              setLoading(false);
              if (error) toast.error(error.message);
              else toast.success("Verification email resent.");
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend verification email"}
          </Button>
        )}
      </div>
    </AuthShell>
  );
}