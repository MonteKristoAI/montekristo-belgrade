import { useEffect, useMemo, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, inputCls, selectCls, Pill } from "../components/primitives";
import { Copy, Eye, EyeOff, Plus, Trash2, KeyRound } from "lucide-react";
import { toast } from "sonner";

type Integration = {
  id: string;
  client_id: string;
  platform: string;
  identifier_key: string;
  identifier_value: string | null;
  is_secret: boolean;
  note: string | null;
};

const PLATFORMS = [
  "ghl", "retell", "n8n", "supabase", "cloudflare", "stripe", "airtable", "wordpress",
  "shopify", "meta_ads", "google_ads", "google_analytics", "google_search_console",
  "instantly", "apollo", "hubspot", "mailchimp", "klaviyo", "twilio", "sendgrid",
  "github", "vercel", "lovable", "instagram", "linkedin", "facebook", "tiktok", "youtube", "other",
];

const PLATFORM_CATEGORIES: Record<string, string[]> = {
  CRM: ["ghl", "hubspot"],
  Automations: ["n8n"],
  Voice: ["retell"],
  "Hosting & infra": ["cloudflare", "vercel", "lovable", "supabase", "github"],
  Payments: ["stripe"],
  "Email & SMS": ["mailchimp", "klaviyo", "sendgrid", "twilio", "instantly", "apollo"],
  "CMS & store": ["wordpress", "shopify"],
  Ads: ["meta_ads", "google_ads"],
  Social: ["instagram", "linkedin", "facebook", "tiktok", "youtube"],
  Analytics: ["google_analytics", "google_search_console"],
  Other: ["airtable", "other"],
};

export default function IntegrationsTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<Integration[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_integrations")
      .select("*")
      .eq("client_id", client.id)
      .order("platform");
    setRows((data ?? []) as unknown as Integration[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const grouped = useMemo(() => {
    const groups = new Map<string, Integration[]>();
    for (const cat of Object.keys(PLATFORM_CATEGORIES)) groups.set(cat, []);
    for (const r of rows) {
      let placed = false;
      for (const [cat, plats] of Object.entries(PLATFORM_CATEGORIES)) {
        if (plats.includes(r.platform)) {
          groups.get(cat)!.push(r);
          placed = true;
          break;
        }
      }
      if (!placed) groups.get("Other")!.push(r);
    }
    return Array.from(groups.entries()).filter(([, items]) => items.length > 0);
  }, [rows]);

  const add = async () => {
    const { error } = await mkSupabase.from("mk_client_integrations").insert({
      client_id: client.id, platform: "other", identifier_key: "new_key",
    });
    if (!error) load();
  };
  const remove = async (id: string) => {
    const { error } = await mkSupabase.from("mk_client_integrations").delete().eq("id", id);
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<Integration>) => {
    const { error } = await mkSupabase.from("mk_client_integrations").update(fields).eq("id", id);
    if (!error) load();
  };
  const copy = async (v: string) => {
    await navigator.clipboard.writeText(v);
    toast.success("Kopirano");
  };
  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <Section
      title="Integracije i credentials"
      description="Strukturisani ID-jevi koji me cuvaju od pretrazivanja: GHL location, Retell agent, n8n tag, CF zone, Supabase project."
      action={
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs transition-colors"
        >
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      {rows.length === 0 ? (
        <p className="font-inter text-sm text-[#5A6577] py-6 text-center">Jos nema integracija.</p>
      ) : (
        <div className="space-y-5">
          {grouped.map(([cat, items]) => (
            <div key={cat}>
              <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">{cat}</p>
              <div className="space-y-1.5">
                {items.map((r) => {
                  const show = !r.is_secret || revealed.has(r.id);
                  return (
                    <div
                      key={r.id}
                      className="grid grid-cols-1 md:grid-cols-[140px_1fr_1.5fr_auto] gap-2 items-center border border-white/10 rounded-md p-2.5 bg-white/[0.03]"
                    >
                      <select
                        value={r.platform}
                        onChange={(e) => update(r.id, { platform: e.target.value })}
                        className={`${selectCls} h-8 text-xs`}
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <input
                        defaultValue={r.identifier_key}
                        onBlur={(e) => update(r.id, { identifier_key: e.target.value })}
                        placeholder="identifier_key"
                        className={`${inputCls} h-8 text-xs`}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type={show ? "text" : "password"}
                          defaultValue={r.identifier_value ?? ""}
                          onBlur={(e) => update(r.id, { identifier_value: e.target.value || null })}
                          placeholder="value"
                          className={`${inputCls} h-8 text-xs`}
                        />
                        {r.is_secret && (
                          <button onClick={() => toggleReveal(r.id)} className="h-8 w-8 rounded-md text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5 shrink-0 flex items-center justify-center">
                            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <button onClick={() => r.identifier_value && copy(r.identifier_value)} disabled={!r.identifier_value} className="h-8 w-8 rounded-md text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5 disabled:opacity-30 shrink-0 flex items-center justify-center">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => update(r.id, { is_secret: !r.is_secret })}
                          title={r.is_secret ? "Secret" : "Public"}
                          className={`h-8 px-2 rounded-md text-[10px] font-inter flex items-center gap-1 ${
                            r.is_secret ? "bg-[rgba(232,183,79,0.12)] text-[#F3CC78]" : "bg-white/5 text-[#9AA5B8]"
                          }`}
                        >
                          <KeyRound className="w-3 h-3" />
                          {r.is_secret ? "secret" : "public"}
                        </button>
                        <button onClick={() => remove(r.id)} className="h-8 w-8 rounded-md text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.1)] flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        defaultValue={r.note ?? ""}
                        onBlur={(e) => update(r.id, { note: e.target.value || null })}
                        placeholder="note (opcionalno)"
                        className={`${inputCls} h-7 text-[11px] md:col-span-4`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-1.5 flex-wrap">
        {Array.from(new Set(rows.map((r) => r.platform))).map((p) => (
          <Pill key={p} variant="neutral">
            {p}: {rows.filter((r) => r.platform === p).length}
          </Pill>
        ))}
      </div>
    </Section>
  );
}
