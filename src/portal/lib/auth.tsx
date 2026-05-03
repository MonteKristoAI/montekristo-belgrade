import { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/portal/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isMkAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isMkAdmin, setIsMkAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  // Per-user resolution promise cache — concurrent callers (bootstrap + onAuthStateChange
  // firing for the same user) await the SAME in-flight resolution instead of one
  // shortcutting before the other's RPCs finish.
  const resolutionByUserRef = useRef<Map<string, Promise<void>>>(new Map());

  const cancelledRef = useRef(false);

  const doResolveAuthState = async (_userId: string): Promise<void> => {
    // Auto-claim any pending project invites for this email (idempotent)
    try {
      await supabase.rpc("accept_project_invites");
    } catch {
      // Non-fatal — admin/member checks below still work
    }
    if (cancelledRef.current) return;
    const { data, error } = await supabase.rpc("is_mk_admin");
    if (cancelledRef.current) return;
    setIsMkAdmin(error ? false : Boolean(data));
  };

  const resolveAuthState = async (userId: string | null): Promise<void> => {
    if (!userId) {
      setIsMkAdmin(false);
      resolutionByUserRef.current.clear();
      return;
    }
    let pending = resolutionByUserRef.current.get(userId);
    if (!pending) {
      pending = doResolveAuthState(userId);
      resolutionByUserRef.current.set(userId, pending);
    }
    await pending;
  };

  useEffect(() => {
    cancelledRef.current = false;
    let resolved = false;

    const finishLoading = () => {
      if (!resolved && !cancelledRef.current) {
        resolved = true;
        setLoading(false);
      }
    };

    // 1) getSession first — gives us the synchronous session if it's already cached
    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelledRef.current) return;
      const next = data.session;
      setSession(next);
      await resolveAuthState(next?.user?.id ?? null);
      finishLoading();
    };

    // 2) onAuthStateChange — picks up the magic-link redirect, sign-out, token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (cancelledRef.current) return;
      setSession(newSession);
      // Defer DB calls out of the listener callback per supabase-js guidance; await so loading flips after admin check.
      setTimeout(async () => {
        if (cancelledRef.current) return;
        await resolveAuthState(newSession?.user?.id ?? null);
        finishLoading();
      }, 0);
    });

    void bootstrap();

    return () => {
      cancelledRef.current = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsMkAdmin(false);
    resolutionByUserRef.current.clear();
  };

  const signInWithEmail = async (email: string) => {
    const origin =
      typeof window !== "undefined" && window.location?.origin
        ? window.location.origin
        : "https://montekristobelgrade.com";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/reports/portal/auth/callback`,
      },
    });
    return { error: error?.message };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isMkAdmin,
        loading,
        signOut,
        signInWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
