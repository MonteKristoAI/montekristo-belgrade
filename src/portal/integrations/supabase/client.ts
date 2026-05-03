import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Hard-coded portal Supabase project. Publishable key is safe to embed in client bundles.
// We use a project SEPARATE from the main MonteKristo Belgrade site's Supabase so
// the portal's data + RLS + Auth users are fully isolated.
export const PORTAL_SUPABASE_URL = "https://hvdlyrquohxfazhgkfuh.supabase.co";
export const PORTAL_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_7oEbKNKRtuOETLq5QGKuyA_yYwjY91o";

// Re-export under a more descriptive name used by the pagehide keepalive flow
export const PORTAL_SUPABASE_KEY_EXPORT = PORTAL_SUPABASE_PUBLISHABLE_KEY;

// Unique storage key so we don't clash with the main site's Supabase auth.
export const supabase = createClient<Database>(
  PORTAL_SUPABASE_URL,
  PORTAL_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "mkop-auth-token",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  }
);
