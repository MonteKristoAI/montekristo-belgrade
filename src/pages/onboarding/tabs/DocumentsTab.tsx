import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, Pill, inputCls, selectCls } from "../components/primitives";
import { ExternalLink, Pin, Plus, Trash2 } from "lucide-react";

type Doc = {
  id: string;
  client_id: string;
  title: string;
  kind: string;
  url: string;
  thumbnail_url: string | null;
  is_pinned: boolean;
  notes: string | null;
};

const KINDS = ["logo","brand_guide","contract","coa","report","meeting_notes","screenshot","reference_site","asset","other"];

export default function DocumentsTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<Doc[]>([]);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_documents")
      .select("*")
      .eq("client_id", client.id)
      .order("is_pinned", { ascending: false })
      .order("uploaded_at", { ascending: false });
    setRows((data ?? []) as unknown as Doc[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const add = async () => {
    const { error } = await mkSupabase.from("mk_client_documents").insert({
      client_id: client.id, title: "Novi dokument", kind: "other", url: "",
    });
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<Doc>) => {
    const { error } = await mkSupabase.from("mk_client_documents").update(fields).eq("id", id);
    if (!error) load();
  };
  const remove = async (id: string) => {
    if (!confirm("Obrisati?")) return;
    const { error } = await mkSupabase.from("mk_client_documents").delete().eq("id", id);
    if (!error) load();
  };

  const pinned = rows.filter((r) => r.is_pinned);
  const rest = rows.filter((r) => !r.is_pinned);

  return (
    <Section
      title="Dokumenti"
      description="Linkovi ka Drive/GitHub/lokalnim assets-ima."
      action={
        <button onClick={add} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs">
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      {rows.length === 0 ? (
        <p className="font-inter text-sm text-[#5A6577] py-6 text-center">Jos nema dokumenata.</p>
      ) : (
        <>
          {pinned.length > 0 && (
            <div className="mb-5">
              <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">Zakaceno</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pinned.map((r) => (<DocCard key={r.id} doc={r} onUpdate={update} onRemove={remove} />))}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              {pinned.length > 0 && <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">Ostalo</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {rest.map((r) => (<DocCard key={r.id} doc={r} onUpdate={update} onRemove={remove} />))}
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

function DocCard({ doc, onUpdate, onRemove }: { doc: Doc; onUpdate: (id: string, f: Partial<Doc>) => void; onRemove: (id: string) => void }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3 space-y-2">
      <div className="flex items-start gap-2">
        <input defaultValue={doc.title} onBlur={(e) => onUpdate(doc.id, { title: e.target.value })} className={`${inputCls} h-8 text-sm font-medium`} />
        <button
          onClick={() => onUpdate(doc.id, { is_pinned: !doc.is_pinned })}
          className={`p-1.5 rounded-md ${doc.is_pinned ? "text-[#FF8A8A]" : "text-[#5A6577] hover:text-[#FF8A8A]"}`}
          title="Pin"
        >
          <Pin className={`w-3.5 h-3.5 ${doc.is_pinned ? "fill-current" : ""}`} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select value={doc.kind} onChange={(e) => onUpdate(doc.id, { kind: e.target.value })} className={`${selectCls} h-8 text-xs flex-1`}>
          {KINDS.map((k) => (<option key={k} value={k}>{k}</option>))}
        </select>
        <Pill variant="neutral">{doc.kind}</Pill>
      </div>
      <input defaultValue={doc.url} onBlur={(e) => onUpdate(doc.id, { url: e.target.value })} placeholder="URL" className={`${inputCls} h-8 text-xs`} />
      <div className="flex items-center justify-between pt-1">
        {doc.url && (
          <a href={doc.url} target="_blank" rel="noreferrer" className="text-[10px] font-inter text-[#FF8A8A] hover:underline inline-flex items-center gap-1">
            Open <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
        <button onClick={() => onRemove(doc.id)} className="h-7 w-7 rounded-md text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.1)] ml-auto flex items-center justify-center">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
