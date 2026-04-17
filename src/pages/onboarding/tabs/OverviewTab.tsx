import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { useSavedField, SaveBadge } from "@/lib/mk-onboarding/useSavedField";
import { Section, FieldLabel, inputCls, textareaCls, selectCls, Pill } from "../components/primitives";
import { SERVICE_LINES } from "../theme";
import { Check } from "lucide-react";

export default function OverviewTab({ client, onChange }: { client: MkClient; onChange: () => void }) {
  const [counts, setCounts] = useState({ contacts: 0, integrations: 0, deliverables: 0, openQs: 0 });

  useEffect(() => {
    (async () => {
      const [c, i, d, q] = await Promise.all([
        mkSupabase.from("mk_client_contacts").select("*", { count: "exact", head: true }).eq("client_id", client.id),
        mkSupabase.from("mk_client_integrations").select("*", { count: "exact", head: true }).eq("client_id", client.id),
        mkSupabase
          .from("mk_client_deliverables")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .in("status", ["planned", "in_progress", "blocked", "review"]),
        mkSupabase
          .from("mk_client_open_questions")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id)
          .is("answered_at", null),
      ]);
      setCounts({ contacts: c.count ?? 0, integrations: i.count ?? 0, deliverables: d.count ?? 0, openQs: q.count ?? 0 });
    })();
  }, [client.id]);

  const field = (fields: Partial<MkClient>) => async () => {
    const { error } = await mkSupabase.from("mk_clients").update(fields).eq("id", client.id);
    if (error) throw error;
    onChange();
  };

  const [positioning, setPositioning, posStatus] = useSavedField(client.one_line_positioning ?? "", (v) => field({ one_line_positioning: v || null })());
  const [about, setAbout, aboutStatus] = useSavedField(client.about ?? "", (v) => field({ about: v || null })());
  const [website, setWebsite, webStatus] = useSavedField(client.website_url ?? "", (v) => field({ website_url: v || null })());
  const [retainer, setRetainer, retStatus] = useSavedField(client.monthly_retainer_usd ? String(client.monthly_retainer_usd) : "", (v) => field({ monthly_retainer_usd: v ? Number(v) : null })());
  const [industry, setIndustry, indStatus] = useSavedField(client.industry ?? "", (v) => field({ industry: v || null })());
  const [subIndustry, setSubIndustry, subIndStatus] = useSavedField(client.sub_industry ?? "", (v) => field({ sub_industry: v || null })());
  const [country, setCountry, countryStatus] = useSavedField(client.location_country ?? "", (v) => field({ location_country: v || null })());
  const [city, setCity, cityStatus] = useSavedField(client.location_city ?? "", (v) => field({ location_city: v || null })());
  const [primary, setPrimary, primaryStatus] = useSavedField(client.brand_color_primary ?? "", (v) => field({ brand_color_primary: v || null })());
  const [accent, setAccent, accentStatus] = useSavedField(client.brand_color_accent ?? "", (v) => field({ brand_color_accent: v || null })());
  const [logo, setLogo, logoStatus] = useSavedField(client.logo_url ?? "", (v) => field({ logo_url: v || null })());

  const saveStatus = async (v: string) => {
    const { error } = await mkSupabase.from("mk_clients").update({ status: v }).eq("id", client.id);
    if (!error) onChange();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="Kontakti" value={counts.contacts} />
        <MiniStat label="Integracije" value={counts.integrations} />
        <MiniStat label="Deliverables (wip)" value={counts.deliverables} />
        <MiniStat label="Otvorenih pitanja" value={counts.openQs} />
      </div>

      <Section title="Osnovno" description="Core profile — ovo se pojavljuje u hero-u i vault sync markdown-u.">
        <div className="space-y-4">
          <div>
            <FieldLabel hint={<SaveBadge status={posStatus} />}>One-line positioning</FieldLabel>
            <textarea
              value={positioning}
              onChange={(e) => setPositioning(e.target.value)}
              rows={2}
              className={textareaCls}
              placeholder="Jedna recenica: ko su, sta rade, kome."
            />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={aboutStatus} />}>About</FieldLabel>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className={textareaCls}
              placeholder="Duzi opis biznisa, proizvoda, kako zarađuju, ko su im kupci…"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel hint={<SaveBadge status={indStatus} />}>Industrija</FieldLabel>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={subIndStatus} />}>Sub-industrija</FieldLabel>
              <input value={subIndustry} onChange={(e) => setSubIndustry(e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={countryStatus} />}>Zemlja</FieldLabel>
              <input value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={cityStatus} />}>Grad</FieldLabel>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={webStatus} />}>Website URL</FieldLabel>
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" className={inputCls} />
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={retStatus} />}>Monthly retainer (USD)</FieldLabel>
              <input
                type="number"
                value={retainer}
                onChange={(e) => setRetainer(e.target.value)}
                className={inputCls}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FieldLabel>Status</FieldLabel>
              <select value={client.status} onChange={(e) => saveStatus(e.target.value)} className={selectCls}>
                <option value="active">Aktivan</option>
                <option value="onboarding">Onboarding</option>
                <option value="prelaunch">Pre-launch</option>
                <option value="paused">Pauziran</option>
                <option value="rescue">Rescue</option>
                <option value="archived">Arhiviran</option>
              </select>
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={primaryStatus} />}>Brand boja (primary)</FieldLabel>
              <div className="flex items-center gap-2">
                <input value={primary} onChange={(e) => setPrimary(e.target.value)} placeholder="#041122" className={inputCls} />
                {primary && <div className="w-9 h-9 rounded-md border border-white/10" style={{ background: primary }} />}
              </div>
            </div>
            <div>
              <FieldLabel hint={<SaveBadge status={accentStatus} />}>Brand boja (accent)</FieldLabel>
              <div className="flex items-center gap-2">
                <input value={accent} onChange={(e) => setAccent(e.target.value)} placeholder="#FF5C5C" className={inputCls} />
                {accent && <div className="w-9 h-9 rounded-md border border-white/10" style={{ background: accent }} />}
              </div>
            </div>
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={logoStatus} />}>Logo URL</FieldLabel>
            <input value={logo} onChange={(e) => setLogo(e.target.value)} className={inputCls} placeholder="https://…/logo.svg" />
          </div>
        </div>
      </Section>

      <Section title="Servisi koje isporucujemo" description="Ukljuci sve servise koje trenutno isporucujemo ovom klijentu. Heatmap na dashboardu koristi ova polja.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {SERVICE_LINES.map((s) => (
            <ServiceToggle key={s.key} client={client} serviceKey={s.key} label={s.label} onChange={onChange} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 px-4 py-3">
      <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577]">{label}</p>
      <p className="font-poppins text-2xl font-semibold mt-1 text-[#F5F0E6] leading-none tabular-nums">
        {value}
      </p>
    </div>
  );
}

function ServiceToggle({
  client,
  serviceKey,
  label,
  onChange,
}: {
  client: MkClient;
  serviceKey: string;
  label: string;
  onChange: () => void;
}) {
  const current = Boolean((client.service_lines as Record<string, boolean>)[serviceKey]);
  const toggle = async () => {
    const next = { ...client.service_lines, [serviceKey]: !current };
    const { error } = await mkSupabase.from("mk_clients").update({ service_lines: next }).eq("id", client.id);
    if (!error) onChange();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center justify-between w-full rounded-md px-3.5 py-2.5 border transition-colors ${
        current
          ? "border-[rgba(255,92,92,0.3)] bg-[rgba(255,92,92,0.08)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      <span className={`font-inter text-sm ${current ? "text-[#FF8A8A]" : "text-[#F5F0E6]"}`}>{label}</span>
      {current ? (
        <Pill variant="accent" icon={<Check className="w-2.5 h-2.5" />}>aktivan</Pill>
      ) : (
        <Pill variant="neutral">off</Pill>
      )}
    </button>
  );
}
