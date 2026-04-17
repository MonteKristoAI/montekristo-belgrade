import { mkSupabase, type MkClient } from "./supabase";

// Build the full client context string that gets injected into Claude edge fns.
// Keeps structure compact so we can cache it.

export async function buildClientContextMarkdown(client: MkClient): Promise<string> {
  const [contacts, integrations, deliverables, bv, audit, web, openQs, perf] = await Promise.all([
    mkSupabase.from("mk_client_contacts").select("*").eq("client_id", client.id),
    mkSupabase.from("mk_client_integrations").select("*").eq("client_id", client.id),
    mkSupabase.from("mk_client_deliverables").select("*").eq("client_id", client.id),
    mkSupabase.from("mk_client_brand_voice").select("*").eq("client_id", client.id).maybeSingle(),
    mkSupabase.from("mk_client_marketing_audit").select("*").eq("client_id", client.id).maybeSingle(),
    mkSupabase.from("mk_client_web_presence").select("*").eq("client_id", client.id).maybeSingle(),
    mkSupabase
      .from("mk_client_open_questions")
      .select("*")
      .eq("client_id", client.id)
      .is("answered_at", null),
    mkSupabase
      .from("mk_client_performance_snapshots")
      .select("*")
      .eq("client_id", client.id)
      .order("week_ending_date", { ascending: false })
      .limit(12),
  ]);

  const lines: string[] = [];
  lines.push(`# ${client.name}`);
  if (client.one_line_positioning) lines.push(`> ${client.one_line_positioning}`);
  lines.push("");
  lines.push(`- slug: ${client.slug}`);
  lines.push(`- industry: ${client.industry ?? "—"}`);
  lines.push(`- status: ${client.status}`);
  lines.push(`- website: ${client.website_url ?? "—"}`);
  if (client.monthly_retainer_usd) lines.push(`- retainer: $${client.monthly_retainer_usd}/month`);
  const services = Object.entries(client.service_lines ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (services.length) lines.push(`- services: ${services.join(", ")}`);
  lines.push("");

  if (client.about) {
    lines.push("## About");
    lines.push(client.about);
    lines.push("");
  }

  if ((contacts.data ?? []).length) {
    lines.push("## Contacts");
    for (const c of contacts.data as any[]) {
      const primary = c.is_primary ? " (primary)" : "";
      const contactInfo = [c.email, c.phone, c.whatsapp].filter(Boolean).join(" · ");
      lines.push(
        `- ${c.name}${primary} — ${c.role}${c.role_title ? ` (${c.role_title})` : ""}${contactInfo ? " · " + contactInfo : ""}`
      );
    }
    lines.push("");
  }

  if ((integrations.data ?? []).length) {
    lines.push("## Integrations");
    for (const i of integrations.data as any[]) {
      const val = i.is_secret ? "[secret]" : i.identifier_value ?? "—";
      lines.push(`- ${i.platform}.${i.identifier_key} = ${val}${i.note ? `  (${i.note})` : ""}`);
    }
    lines.push("");
  }

  if (bv.data) {
    lines.push("## Brand voice");
    const b = bv.data as any;
    if (b.tone_descriptors?.length) lines.push(`- tone: ${b.tone_descriptors.join(", ")}`);
    if (b.banned_vocabulary?.length) lines.push(`- BANNED: ${b.banned_vocabulary.join(", ")}`);
    if (b.required_phrases?.length) lines.push(`- required phrases: ${b.required_phrases.join(", ")}`);
    if (b.readability_target) lines.push(`- readability: ${b.readability_target}`);
    if (b.persona_summary) {
      lines.push("### Persona");
      lines.push(b.persona_summary);
    }
    if (b.icp_summary) {
      lines.push("### ICP");
      lines.push(b.icp_summary);
    }
    lines.push("");
  }

  if (audit.data) {
    const a = audit.data as any;
    lines.push("## Marketing audit");
    if (a.positioning_strength) lines.push(`- positioning strength: ${a.positioning_strength}/10`);
    if (a.primary_channels?.length) lines.push(`- channels: ${a.primary_channels.join(", ")}`);
    if (a.active_offers) {
      lines.push("### Active offers");
      lines.push(a.active_offers);
    }
    if (a.differentiation_notes) {
      lines.push("### Differentiation");
      lines.push(a.differentiation_notes);
    }
    if (a.conversion_bottlenecks) {
      lines.push("### Conversion bottlenecks");
      lines.push(a.conversion_bottlenecks);
    }
    if (a.mk_growth_ideas) {
      lines.push("### Existing MK growth ideas");
      lines.push(a.mk_growth_ideas);
    }
    lines.push("");
  }

  if (web.data) {
    const w = web.data as any;
    lines.push("## Web presence");
    if (w.primary_domain) lines.push(`- domain: ${w.primary_domain}`);
    if (w.hosting) lines.push(`- hosting: ${w.hosting}`);
    if (w.cms) lines.push(`- CMS: ${w.cms}`);
    if (w.lighthouse_score) lines.push(`- Lighthouse: ${w.lighthouse_score}`);
    if (w.seo_score) lines.push(`- SEO score: ${w.seo_score}`);
    if (w.top_ranking_keywords?.length) lines.push(`- top keywords: ${w.top_ranking_keywords.join(", ")}`);
    lines.push("");
  }

  if ((deliverables.data ?? []).length) {
    lines.push("## Deliverables");
    for (const d of deliverables.data as any[]) {
      const parts = [`[${d.status}] ${d.type}: ${d.title}`];
      if (d.owner) parts.push(`owner=${d.owner}`);
      if (d.blockers) parts.push(`BLOCKER: ${d.blockers}`);
      if (d.next_step) parts.push(`next: ${d.next_step}`);
      lines.push(`- ${parts.join(" · ")}`);
    }
    lines.push("");
  }

  if ((openQs.data ?? []).length) {
    lines.push("## Open questions");
    for (const q of openQs.data as any[]) {
      lines.push(`- ${q.question}`);
    }
    lines.push("");
  }

  if ((perf.data ?? []).length) {
    lines.push("## Recent weekly performance");
    for (const p of perf.data as any[]) {
      lines.push(`- ${p.week_ending_date} · ${p.metric_kind} = ${p.value_numeric ?? "—"}${p.value_note ? " (" + p.value_note + ")" : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function edgeFnUrl(name: string): string {
  return `https://tydafqhnzxmrpnclaxnl.supabase.co/functions/v1/${name}`;
}

export const EDGE_FN_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGFmcWhuenhtcnBuY2xheG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODUwNzEsImV4cCI6MjA4MDU2MTA3MX0.FgsGS_hNQysbMbyxdAG0VPWaHMgBFNrCe0xJezR1R_M";
