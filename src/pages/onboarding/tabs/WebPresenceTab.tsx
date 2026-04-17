import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { useSavedField, SaveBadge } from "@/lib/mk-onboarding/useSavedField";
import { Section, FieldLabel, inputCls, textareaCls, Pill } from "../components/primitives";
import { edgeFnUrl, EDGE_FN_ANON } from "@/lib/mk-onboarding/buildClientContext";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type WebPresence = {
  id: string;
  client_id: string;
  primary_domain: string | null;
  additional_domains: string[] | null;
  dns_provider: string | null;
  hosting: string | null;
  cms: string | null;
  core_web_vitals_score: number | null;
  lighthouse_score: number | null;
  seo_score: number | null;
  gmb_claimed: boolean | null;
  social_profiles: Record<string, string> | null;
  schema_present: boolean | null;
  backlink_count: number | null;
  top_ranking_keywords: string[] | null;
  last_audited_at: string | null;
  audit_notes: string | null;
};

export default function WebPresenceTab({ client }: { client: MkClient }) {
  const [wp, setWp] = useState<WebPresence | null>(null);
  const [enriching, setEnriching] = useState(false);

  const load = async () => {
    const { data } = await mkSupabase.from("mk_client_web_presence").select("*").eq("client_id", client.id).maybeSingle();
    if (data) setWp(data as unknown as WebPresence);
    else {
      const { data: created } = await mkSupabase
        .from("mk_client_web_presence")
        .insert({ client_id: client.id, primary_domain: client.website_url ?? null })
        .select()
        .single();
      setWp(created as unknown as WebPresence);
    }
  };

  useEffect(() => {
    load();
  }, [client.id]);

  const enrich = async () => {
    if (!wp) return;
    const url = wp.primary_domain ?? client.website_url;
    if (!url) {
      toast.error("Nema URL-a za enrichment — popuni primary domain.");
      return;
    }
    setEnriching(true);
    try {
      const { data: sess } = await mkSupabase.auth.getSession();
      const bearer = sess.session?.access_token ?? EDGE_FN_ANON;
      const res = await fetch(edgeFnUrl("mk-enrich-web"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}`, apikey: EDGE_FN_ANON },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const patch: Partial<WebPresence> = {
        last_audited_at: new Date().toISOString(),
      };
      if (data.lighthouse_score != null) patch.lighthouse_score = data.lighthouse_score;
      if (data.cms) patch.cms = data.cms;
      if (data.hosting) patch.hosting = data.hosting;
      if (typeof data.schema_present === "boolean") patch.schema_present = data.schema_present;
      if (data.social_profiles) patch.social_profiles = { ...(wp.social_profiles ?? {}), ...data.social_profiles };
      const { error } = await mkSupabase.from("mk_client_web_presence").update(patch).eq("id", wp.id);
      if (error) throw error;
      toast.success("Web presence auto-popunjen.");
      load();
    } catch (e) {
      toast.error("Enrichment nije uspeo. Edge fn mora biti deploy-ovana.");
      console.error(e);
    } finally {
      setEnriching(false);
    }
  };

  if (!wp) return <p className="font-inter text-sm text-[#5A6577]">Ucitavam…</p>;

  const saveField = (fields: Partial<WebPresence>) => async () => {
    const { error } = await mkSupabase.from("mk_client_web_presence").update(fields).eq("id", wp.id);
    if (error) throw error;
  };

  return <Form wp={wp} saveField={saveField} onEnrich={enrich} enriching={enriching} />;
}

function Form({ wp, saveField, onEnrich, enriching }: {
  wp: WebPresence;
  saveField: (fields: Partial<WebPresence>) => () => Promise<void>;
  onEnrich: () => void;
  enriching: boolean;
}) {
  const [domain, setDomain, domainStatus] = useSavedField(wp.primary_domain ?? "", (v) => saveField({ primary_domain: v || null })());
  const [additional, setAdditional, addStatus] = useSavedField((wp.additional_domains ?? []).join(", "), async (v) => {
    const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
    await saveField({ additional_domains: arr })();
  });
  const [dns, setDns, dnsStatus] = useSavedField(wp.dns_provider ?? "", (v) => saveField({ dns_provider: v || null })());
  const [hosting, setHosting, hostingStatus] = useSavedField(wp.hosting ?? "", (v) => saveField({ hosting: v || null })());
  const [cms, setCms, cmsStatus] = useSavedField(wp.cms ?? "", (v) => saveField({ cms: v || null })());
  const [cwv, setCwv, cwvStatus] = useSavedField(wp.core_web_vitals_score?.toString() ?? "", (v) => saveField({ core_web_vitals_score: v ? Number(v) : null })());
  const [lh, setLh, lhStatus] = useSavedField(wp.lighthouse_score?.toString() ?? "", (v) => saveField({ lighthouse_score: v ? Number(v) : null })());
  const [seo, setSeo, seoStatus] = useSavedField(wp.seo_score?.toString() ?? "", (v) => saveField({ seo_score: v ? Number(v) : null })());
  const [backlinks, setBacklinks, blStatus] = useSavedField(wp.backlink_count?.toString() ?? "", (v) => saveField({ backlink_count: v ? Number(v) : null })());
  const [keywords, setKeywords, kwStatus] = useSavedField((wp.top_ranking_keywords ?? []).join(", "), async (v) => {
    const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
    await saveField({ top_ranking_keywords: arr })();
  });
  const [notes, setNotes, notesStatus] = useSavedField(wp.audit_notes ?? "", (v) => saveField({ audit_notes: v || null })());
  const [gmb, setGmb] = useSavedField(wp.gmb_claimed ?? false, (v) => saveField({ gmb_claimed: v })());
  const [schema, setSchema] = useSavedField(wp.schema_present ?? false, (v) => saveField({ schema_present: v })());

  const social = wp.social_profiles ?? {};
  const saveSocial = async (key: string, value: string) => {
    const next = { ...social, [key]: value };
    await saveField({ social_profiles: next })();
  };

  return (
    <div className="space-y-5">
      <Section
        title="Domain & infrastruktura"
        description="Popuni manualno ili pokreni auto-enrichment."
        action={
          <button
            onClick={onEnrich}
            disabled={enriching}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-xs font-medium shadow-[0_6px_16px_-6px_rgba(255,92,92,0.6)] hover:shadow-[0_10px_24px_-6px_rgba(255,92,92,0.8)] transition-shadow disabled:opacity-50"
          >
            {enriching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {enriching ? "Proveravam…" : "Popuni iz URL-a"}
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel hint={<SaveBadge status={domainStatus} />}>Primary domain</FieldLabel>
            <input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={addStatus} />}>Additional domains</FieldLabel>
            <input value={additional} onChange={(e) => setAdditional(e.target.value)} className={inputCls} placeholder="comma-separated" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={dnsStatus} />}>DNS provider</FieldLabel>
            <input value={dns} onChange={(e) => setDns(e.target.value)} className={inputCls} placeholder="Cloudflare, Namecheap…" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={hostingStatus} />}>Hosting</FieldLabel>
            <input value={hosting} onChange={(e) => setHosting(e.target.value)} className={inputCls} placeholder="Cloudflare Pages, Vercel, Lovable…" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={cmsStatus} />}>CMS</FieldLabel>
            <input value={cms} onChange={(e) => setCms(e.target.value)} className={inputCls} placeholder="WordPress, Shopify, Next.js, HTML…" />
          </div>
          {wp.last_audited_at && (
            <div className="flex items-end">
              <Pill variant="info">Audit: {new Date(wp.last_audited_at).toLocaleDateString()}</Pill>
            </div>
          )}
        </div>
      </Section>

      <Section title="Performance & SEO">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <FieldLabel hint={<SaveBadge status={cwvStatus} />}>Core Web Vitals</FieldLabel>
            <input type="number" step="0.01" value={cwv} onChange={(e) => setCwv(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={lhStatus} />}>Lighthouse</FieldLabel>
            <input type="number" value={lh} onChange={(e) => setLh(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={seoStatus} />}>SEO score</FieldLabel>
            <input type="number" value={seo} onChange={(e) => setSeo(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={blStatus} />}>Backlinks</FieldLabel>
            <input type="number" value={backlinks} onChange={(e) => setBacklinks(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="mt-4">
          <FieldLabel hint={<SaveBadge status={kwStatus} />}>Top ranking keywords</FieldLabel>
          <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputCls} placeholder="comma-separated" />
        </div>
      </Section>

      <Section title="Flags & social">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <ToggleRow label="Google Business Profile claimed" value={gmb} onChange={setGmb} />
          <ToggleRow label="Schema markup present" value={schema} onChange={setSchema} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["instagram", "facebook", "linkedin", "youtube", "tiktok", "twitter"].map((k) => (
            <div key={k}>
              <FieldLabel>{k}</FieldLabel>
              <input
                defaultValue={social[k] ?? ""}
                onBlur={(e) => saveSocial(k, e.target.value)}
                className={inputCls}
                placeholder={`https://${k}.com/…`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Audit notes">
        <FieldLabel hint={<SaveBadge status={notesStatus} />}>Napomene</FieldLabel>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className={textareaCls} />
      </Section>
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-md border transition-colors ${
        value ? "border-[rgba(63,185,125,0.3)] bg-[rgba(63,185,125,0.08)]" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <span className={`font-inter text-sm ${value ? "text-[#70D7A0]" : "text-[#F5F0E6]"}`}>{label}</span>
      {value ? <Check className="w-4 h-4 text-[#70D7A0]" /> : <span className="text-[10px] font-inter text-[#5A6577]">off</span>}
    </button>
  );
}
