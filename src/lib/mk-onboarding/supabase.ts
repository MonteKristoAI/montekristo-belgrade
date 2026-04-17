import { createClient } from "@supabase/supabase-js";

// Dedicated Supabase client for the MK team onboarding portal.
// Separate from src/integrations/supabase/client.ts (which points at the LRMB DB).
const MK_ONBOARDING_URL = "https://tydafqhnzxmrpnclaxnl.supabase.co";
const MK_ONBOARDING_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGFmcWhuenhtcnBuY2xheG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODUwNzEsImV4cCI6MjA4MDU2MTA3MX0.FgsGS_hNQysbMbyxdAG0VPWaHMgBFNrCe0xJezR1R_M";

export const mkSupabase = createClient(MK_ONBOARDING_URL, MK_ONBOARDING_ANON_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "mk-onboarding-auth",
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type ClientStatus =
  | "active"
  | "paused"
  | "rescue"
  | "prelaunch"
  | "onboarding"
  | "archived";

export type ServiceLines = {
  website: boolean;
  seo_blogs: boolean;
  ecommerce: boolean;
  sms_email: boolean;
  reviews: boolean;
  ads: boolean;
  voice_agent: boolean;
  crm: boolean;
  email_outbound: boolean;
  linkedin_outbound: boolean;
};

export type MkClient = {
  id: string;
  slug: string;
  name: string;
  display_name: string | null;
  industry: string | null;
  sub_industry: string | null;
  location_city: string | null;
  location_country: string | null;
  timezone: string | null;
  website_url: string | null;
  status: ClientStatus;
  one_line_positioning: string | null;
  about: string | null;
  monthly_retainer_usd: number | null;
  brand_color_primary: string | null;
  brand_color_accent: string | null;
  logo_url: string | null;
  service_lines: ServiceLines;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
  folder_path: string | null;
  notes: string | null;
};
