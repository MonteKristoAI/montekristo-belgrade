// MK Onboarding — Level 10 design tokens.
// Dark "command center" theme aligned with MK brand.
// Coral NEVER on headings — only on key numeric accents.

export const theme = {
  bg: {
    base: "#060B18",           // app background, near-black navy
    surface: "#0B1325",        // card / panel
    surfaceHover: "#0F1A33",
    elevated: "#121E3B",       // modals, dropdowns
    sidebar: "#04091A",
    inputBg: "#0A1228",
  },
  border: {
    subtle: "rgba(255,255,255,0.06)",
    default: "rgba(255,255,255,0.10)",
    strong: "rgba(255,255,255,0.18)",
    coral: "rgba(255,92,92,0.40)",
  },
  text: {
    primary: "#F5F0E6",        // cream on dark
    secondary: "#9AA5B8",
    tertiary: "#5A6577",
    inverse: "#041122",
  },
  accent: {
    coralBase: "#FF5C5C",
    coralBright: "#FF7A7A",
    coralSoft: "rgba(255,92,92,0.12)",
    coralGlow: "rgba(255,92,92,0.24)",
  },
  status: {
    active: "#3FB97D",
    activeBg: "rgba(63,185,125,0.12)",
    onboarding: "#8B7CFF",
    onboardingBg: "rgba(139,124,255,0.12)",
    prelaunch: "#4FB3E8",
    prelaunchBg: "rgba(79,179,232,0.12)",
    paused: "#E8B74F",
    pausedBg: "rgba(232,183,79,0.12)",
    rescue: "#FF5C5C",
    rescueBg: "rgba(255,92,92,0.12)",
    archived: "#5A6577",
    archivedBg: "rgba(90,101,119,0.12)",
  },
  health: {
    excellent: "#3FB97D",      // 80-100
    good: "#8ACA5E",           // 60-79
    fair: "#E8B74F",           // 40-59
    poor: "#FF8A4F",           // 20-39
    critical: "#FF5C5C",       // 0-19
  },
  shadow: {
    card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.6)",
    modal: "0 20px 50px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
    coral: "0 0 0 1px rgba(255,92,92,0.4), 0 8px 20px -4px rgba(255,92,92,0.3)",
  },
  motion: {
    fast: 0.15,
    base: 0.25,
    slow: 0.4,
    ease: [0.16, 1, 0.3, 1] as const,
  },
} as const;

export function healthTier(score: number) {
  if (score >= 80) return { tier: "excellent", color: theme.health.excellent, label: "Odlicno" };
  if (score >= 60) return { tier: "good", color: theme.health.good, label: "Dobro" };
  if (score >= 40) return { tier: "fair", color: theme.health.fair, label: "Umereno" };
  if (score >= 20) return { tier: "poor", color: theme.health.poor, label: "Slabo" };
  return { tier: "critical", color: theme.health.critical, label: "Kriticno" };
}

export function statusMeta(status: string) {
  const map: Record<string, { label: string; fg: string; bg: string }> = {
    active: { label: "Aktivan", fg: theme.status.active, bg: theme.status.activeBg },
    onboarding: { label: "Onboarding", fg: theme.status.onboarding, bg: theme.status.onboardingBg },
    prelaunch: { label: "Pre-launch", fg: theme.status.prelaunch, bg: theme.status.prelaunchBg },
    paused: { label: "Pauziran", fg: theme.status.paused, bg: theme.status.pausedBg },
    rescue: { label: "Rescue", fg: theme.status.rescue, bg: theme.status.rescueBg },
    archived: { label: "Arhiviran", fg: theme.status.archived, bg: theme.status.archivedBg },
  };
  return map[status] ?? map.archived;
}

export const SERVICE_LINES = [
  { key: "website", label: "Website", short: "Web" },
  { key: "seo_blogs", label: "SEO & Blog", short: "SEO" },
  { key: "ecommerce", label: "E-commerce", short: "eCom" },
  { key: "sms_email", label: "SMS / Email", short: "SMS" },
  { key: "reviews", label: "Reviews", short: "Rev" },
  { key: "ads", label: "Paid Ads", short: "Ads" },
  { key: "voice_agent", label: "Voice Agent", short: "Voice" },
  { key: "crm", label: "CRM", short: "CRM" },
  { key: "email_outbound", label: "Email Outbound", short: "OBE" },
  { key: "linkedin_outbound", label: "LinkedIn Outbound", short: "LI" },
] as const;
