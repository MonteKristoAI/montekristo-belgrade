import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, inputCls, selectCls, textareaCls } from "../components/primitives";
import { Copy, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Contact = {
  id: string;
  client_id: string;
  name: string;
  role: string;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  timezone: string | null;
  preferred_channel: string | null;
  intro_source: string | null;
  is_primary: boolean;
  notes: string | null;
};

const ROLES = ["owner","founder","ceo","ops","technical","billing","marketing","agency_intermediary","other"];

export default function ContactsTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<Contact[]>([]);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_contacts")
      .select("*")
      .eq("client_id", client.id)
      .order("is_primary", { ascending: false })
      .order("name");
    setRows((data ?? []) as unknown as Contact[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const add = async () => {
    const { error } = await mkSupabase.from("mk_client_contacts").insert({
      client_id: client.id, name: "Novi kontakt", role: "owner",
    });
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<Contact>) => {
    const { error } = await mkSupabase.from("mk_client_contacts").update(fields).eq("id", id);
    if (!error) load();
  };
  const remove = async (id: string) => {
    if (!confirm("Obrisati?")) return;
    const { error } = await mkSupabase.from("mk_client_contacts").delete().eq("id", id);
    if (!error) load();
  };
  const copy = async (v: string) => {
    await navigator.clipboard.writeText(v);
    toast.success("Kopirano");
  };

  return (
    <Section
      title="Kontakti"
      description="Svi kontakti kod klijenta + agencija + posrednici. Star oznacava primary."
      action={
        <button onClick={add} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs">
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`rounded-lg p-4 border ${
              r.is_primary
                ? "border-[rgba(255,92,92,0.3)] bg-[rgba(255,92,92,0.04)]"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => update(r.id, { is_primary: !r.is_primary })}
                className={`mt-1.5 ${r.is_primary ? "text-[#FF8A8A]" : "text-[#5A6577] hover:text-[#FF8A8A]"}`}
                title="Primary"
              >
                <Star className={`w-4 h-4 ${r.is_primary ? "fill-current" : ""}`} />
              </button>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input defaultValue={r.name} onBlur={(e) => update(r.id, { name: e.target.value })} className={`${inputCls} h-9 text-sm font-medium`} />
                <select value={r.role} onChange={(e) => update(r.id, { role: e.target.value })} className={`${selectCls} h-9 text-sm`}>
                  {ROLES.map((x) => (<option key={x} value={x}>{x}</option>))}
                </select>
                <input defaultValue={r.role_title ?? ""} onBlur={(e) => update(r.id, { role_title: e.target.value || null })} placeholder="Title (CEO, Founder…)" className={`${inputCls} h-9 text-sm`} />
              </div>
              <button onClick={() => remove(r.id)} className="h-9 w-9 rounded-md text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.1)] flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 pl-7">
              <ContactField value={r.email ?? ""} placeholder="Email" onSave={(v) => update(r.id, { email: v || null })} onCopy={copy} />
              <ContactField value={r.phone ?? ""} placeholder="Phone" onSave={(v) => update(r.id, { phone: v || null })} onCopy={copy} />
              <ContactField value={r.whatsapp ?? ""} placeholder="WhatsApp" onSave={(v) => update(r.id, { whatsapp: v || null })} onCopy={copy} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 pl-7">
              <input defaultValue={r.timezone ?? ""} onBlur={(e) => update(r.id, { timezone: e.target.value || null })} placeholder="Timezone" className={`${inputCls} h-8 text-xs`} />
              <input defaultValue={r.preferred_channel ?? ""} onBlur={(e) => update(r.id, { preferred_channel: e.target.value || null })} placeholder="Preferred channel" className={`${inputCls} h-8 text-xs`} />
              <input defaultValue={r.intro_source ?? ""} onBlur={(e) => update(r.id, { intro_source: e.target.value || null })} placeholder="Intro source" className={`${inputCls} h-8 text-xs`} />
            </div>

            <textarea
              defaultValue={r.notes ?? ""}
              onBlur={(e) => update(r.id, { notes: e.target.value || null })}
              placeholder="Notes…"
              rows={2}
              className={`${textareaCls} text-xs mt-2 ml-7 w-[calc(100%-1.75rem)]`}
            />
          </div>
        ))}
        {rows.length === 0 && <p className="font-inter text-sm text-[#5A6577] py-6 text-center">Jos nema kontakata.</p>}
      </div>
    </Section>
  );
}

function ContactField({ value, placeholder, onSave, onCopy }: { value: string; placeholder: string; onSave: (v: string) => void; onCopy: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <input defaultValue={value} onBlur={(e) => onSave(e.target.value)} placeholder={placeholder} className={`${inputCls} h-8 text-xs`} />
      {value && (
        <button onClick={() => onCopy(value)} className="h-8 w-8 rounded-md text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5 shrink-0 flex items-center justify-center">
          <Copy className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
