import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/reset-password")({
  head: () => ({ meta: [{ title: "Reset your password — JanMitra AI" }] }),
  component: ResetPage,
});

function ResetPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <AuthShell title="Set a new password">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (password.length < 8) return toast.error("Min 8 characters");
          setLoading(true);
          const { error } = await supabase.auth.updateUser({ password });
          setLoading(false);
          if (error) return toast.error(error.message);
          toast.success("Password updated. Please sign in.");
          navigate({ to: "/auth/login" });
        }}
      >
        <div>
          <Label htmlFor="password">New password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 rounded-xl" />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-xl gradient-primary text-primary-foreground shadow-elegant">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </Button>
      </form>
    </AuthShell>
  );
}