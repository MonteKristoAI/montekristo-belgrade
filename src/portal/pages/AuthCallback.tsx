import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/portal/integrations/supabase/client";
import { useAuth } from "@/portal/lib/auth";

/**
 * Magic-link landing route.
 * - Supabase JS auto-detects the session in the URL hash (detectSessionInUrl=true).
 * - We then wait for AuthProvider to finish admin/invite-claim resolution
 *   before redirecting, so ProtectedRoute on `/` sees a stable isMkAdmin value.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const navigatedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const verify = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (cancelled) return;
      if (error || !data.session) {
        toast.error("Sign-in failed", {
          description: error?.message ?? "Link may have expired. Please request a new one.",
        });
        navigate("/reports/portal/login", { replace: true });
      }
    };
    void verify();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (navigatedRef.current) return;
    if (!loading && session) {
      navigatedRef.current = true;
      toast.success("Signed in");
      navigate("/reports/portal", { replace: true });
    }
  }, [loading, session, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="text-primary text-lg animate-pulse">Signing you in…</div>
    </div>
  );
}
