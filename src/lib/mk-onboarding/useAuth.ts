import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { mkSupabase } from "./supabase";

export function useMkAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mkSupabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: subscription } = mkSupabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export async function mkSignOut() {
  await mkSupabase.auth.signOut();
}
