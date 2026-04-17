import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, Pill, inputCls, textareaCls } from "../components/primitives";
import { Check, Plus, Trash2 } from "lucide-react";

type OpenQ = {
  id: string;
  client_id: string;
  question: string;
  raised_at: string;
  answered_at: string | null;
  answer: string | null;
  answered_by: string | null;
};

export default function OpenQuestionsTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<OpenQ[]>([]);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_open_questions")
      .select("*")
      .eq("client_id", client.id)
      .order("raised_at", { ascending: false });
    setRows((data ?? []) as unknown as OpenQ[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const add = async () => {
    const { error } = await mkSupabase.from("mk_client_open_questions").insert({ client_id: client.id, question: "Novo pitanje" });
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<OpenQ>) => {
    const { error } = await mkSupabase.from("mk_client_open_questions").update(fields).eq("id", id);
    if (!error) load();
  };
  const resolve = async (q: OpenQ) => {
    if (q.answered_at) await update(q.id, { answered_at: null, answer: null });
    else await update(q.id, { answered_at: new Date().toISOString() });
  };
  const remove = async (id: string) => {
    if (!confirm("Obrisati?")) return;
    const { error } = await mkSupabase.from("mk_client_open_questions").delete().eq("id", id);
    if (!error) load();
  };

  const openRows = rows.filter((r) => !r.answered_at);
  const closedRows = rows.filter((r) => r.answered_at);

  return (
    <Section
      title="Otvorena pitanja"
      description="Queue pitanja za sledeci poziv sa klijentom."
      action={
        <button onClick={add} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs">
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      <div>
        <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">
          Otvorena ({openRows.length})
        </p>
        <div className="space-y-2 mb-6">
          {openRows.map((q) => (<QRow key={q.id} q={q} onUpdate={update} onResolve={resolve} onRemove={remove} />))}
          {openRows.length === 0 && <p className="font-inter text-sm text-[#5A6577] py-4 text-center">Nema otvorenih pitanja.</p>}
        </div>

        {closedRows.length > 0 && (
          <div>
            <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">Odgovorena ({closedRows.length})</p>
            <div className="space-y-2">
              {closedRows.map((q) => (<QRow key={q.id} q={q} onUpdate={update} onResolve={resolve} onRemove={remove} />))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function QRow({ q, onUpdate, onResolve, onRemove }: { q: OpenQ; onUpdate: (id: string, f: Partial<OpenQ>) => void; onResolve: (q: OpenQ) => void; onRemove: (id: string) => void }) {
  const isAnswered = Boolean(q.answered_at);
  return (
    <div className={`rounded-lg p-3 border ${isAnswered ? "border-[rgba(63,185,125,0.2)] bg-[rgba(63,185,125,0.04)]" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="flex items-start gap-2">
        <button
          onClick={() => onResolve(q)}
          className={`h-8 w-8 rounded-md shrink-0 flex items-center justify-center ${isAnswered ? "text-[#70D7A0] bg-[rgba(63,185,125,0.1)]" : "text-[#5A6577] hover:text-[#70D7A0] hover:bg-white/5"}`}
          title={isAnswered ? "Reopen" : "Oznaci kao odgovoreno"}
        >
          <Check className="w-4 h-4" />
        </button>
        <div className="flex-1 space-y-2">
          <textarea defaultValue={q.question} onBlur={(e) => onUpdate(q.id, { question: e.target.value })} rows={2} className={`${textareaCls} text-sm`} />
          {isAnswered && (
            <>
              <textarea defaultValue={q.answer ?? ""} onBlur={(e) => onUpdate(q.id, { answer: e.target.value || null })} rows={2} placeholder="Odgovor…" className={`${textareaCls} text-xs`} />
              <input defaultValue={q.answered_by ?? ""} onBlur={(e) => onUpdate(q.id, { answered_by: e.target.value || null })} placeholder="Answered by" className={`${inputCls} h-8 text-xs`} />
            </>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <Pill variant="neutral">{new Date(q.raised_at).toLocaleDateString()}</Pill>
            {isAnswered && <Pill variant="success">answered {new Date(q.answered_at!).toLocaleDateString()}</Pill>}
          </div>
        </div>
        <button onClick={() => onRemove(q.id)} className="h-8 w-8 rounded-md text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.1)] flex items-center justify-center">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
