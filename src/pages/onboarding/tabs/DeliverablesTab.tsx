import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, Pill, inputCls, textareaCls, selectCls } from "../components/primitives";
import { buildSkillPrompt, type DeliverableType } from "@/lib/mk-onboarding/skillLauncher";
import { Plus, Trash2, ExternalLink, Rocket } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type Deliverable = {
  id: string;
  client_id: string;
  title: string;
  type: DeliverableType;
  status: string;
  started_at: string | null;
  shipped_at: string | null;
  owner: string | null;
  deliverable_url: string | null;
  blockers: string | null;
  next_step: string | null;
  notes: string | null;
  updated_at: string;
};

const STATUS_COLUMNS: { key: string; label: string; variant: "neutral" | "info" | "danger" | "warn" | "success" }[] = [
  { key: "planned", label: "Planned", variant: "neutral" },
  { key: "in_progress", label: "In progress", variant: "info" },
  { key: "blocked", label: "Blocked", variant: "danger" },
  { key: "review", label: "Review", variant: "warn" },
  { key: "shipped", label: "Shipped", variant: "success" },
];

const TYPES: DeliverableType[] = [
  "website", "blog_post", "seo_audit", "automation", "voice_agent", "ad_campaign",
  "email_campaign", "social_campaign", "crm_setup", "integration", "report", "design", "research", "other",
];

export default function DeliverablesTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<Deliverable[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_deliverables")
      .select("*")
      .eq("client_id", client.id)
      .order("updated_at", { ascending: false });
    setRows((data ?? []) as unknown as Deliverable[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const add = async () => {
    const { error } = await mkSupabase.from("mk_client_deliverables").insert({
      client_id: client.id, title: "Novi deliverable", type: "other", status: "planned",
    });
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<Deliverable>) => {
    const { error } = await mkSupabase.from("mk_client_deliverables").update(fields).eq("id", id);
    if (!error) load();
  };
  const remove = async (id: string) => {
    if (!confirm("Obrisati?")) return;
    const { error } = await mkSupabase.from("mk_client_deliverables").delete().eq("id", id);
    if (!error) load();
  };

  const launchSkill = async (d: Deliverable) => {
    const prompt = buildSkillPrompt({
      type: d.type,
      clientName: client.name,
      clientSlug: client.slug,
      clientUrl: client.website_url,
      deliverableTitle: d.title,
      deliverableNotes: d.notes,
    });
    await navigator.clipboard.writeText(prompt.copyText);
    toast.success(`Prompt za ${prompt.skill} kopiran. Paste-uj u Claude Code.`);
  };

  return (
    <Section
      title="Deliverables"
      description="Kanban po statusu. Klikni karticu za detalje. 'Launch' kopira Claude Code prompt u clipboard."
      action={
        <button
          onClick={add}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs transition-colors"
        >
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        {STATUS_COLUMNS.map((col) => {
          const items = rows.filter((r) => r.status === col.key);
          return (
            <div key={col.key} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 min-h-[240px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <Pill variant={col.variant}>{col.label}</Pill>
                <span className="font-inter text-[10px] text-[#5A6577] tabular-nums">{items.length}</span>
              </div>
              <div className="space-y-1.5">
                {items.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="rounded-md bg-[#0B1325] border border-white/10 p-2.5 cursor-pointer hover:border-white/25 transition-colors"
                  >
                    <p className="font-inter text-xs font-medium text-[#F5F0E6] line-clamp-2">{r.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Pill variant="neutral">{r.type}</Pill>
                      {r.owner && <span className="font-inter text-[10px] text-[#9AA5B8]">{r.owner}</span>}
                    </div>

                    <AnimatePresence>
                      {expanded === r.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-white/10 space-y-2 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            defaultValue={r.title}
                            onBlur={(e) => update(r.id, { title: e.target.value })}
                            className={`${inputCls} h-8 text-xs`}
                          />
                          <div className="grid grid-cols-2 gap-1.5">
                            <select
                              value={r.type}
                              onChange={(e) => update(r.id, { type: e.target.value as DeliverableType })}
                              className={`${selectCls} h-8 text-xs`}
                            >
                              {TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                            </select>
                            <select
                              value={r.status}
                              onChange={(e) => update(r.id, { status: e.target.value })}
                              className={`${selectCls} h-8 text-xs`}
                            >
                              {STATUS_COLUMNS.map((c) => (<option key={c.key} value={c.key}>{c.label}</option>))}
                            </select>
                          </div>
                          <input
                            defaultValue={r.owner ?? ""}
                            onBlur={(e) => update(r.id, { owner: e.target.value || null })}
                            placeholder="Owner"
                            className={`${inputCls} h-8 text-xs`}
                          />
                          <input
                            defaultValue={r.deliverable_url ?? ""}
                            onBlur={(e) => update(r.id, { deliverable_url: e.target.value || null })}
                            placeholder="URL (live link)"
                            className={`${inputCls} h-8 text-xs`}
                          />
                          <textarea
                            defaultValue={r.blockers ?? ""}
                            onBlur={(e) => update(r.id, { blockers: e.target.value || null })}
                            placeholder="Blockers"
                            rows={2}
                            className={`${textareaCls} text-xs`}
                          />
                          <textarea
                            defaultValue={r.next_step ?? ""}
                            onBlur={(e) => update(r.id, { next_step: e.target.value || null })}
                            placeholder="Next step"
                            rows={2}
                            className={`${textareaCls} text-xs`}
                          />

                          <div className="flex items-center gap-1 pt-1">
                            {r.deliverable_url && (
                              <a
                                href={r.deliverable_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] font-inter text-[#FF8A8A] hover:underline inline-flex items-center gap-1"
                              >
                                Open <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                            <button
                              onClick={() => launchSkill(r)}
                              className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[rgba(255,92,92,0.1)] border border-[rgba(255,92,92,0.3)] text-[10px] font-inter text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.18)]"
                            >
                              <Rocket className="w-3 h-3" /> Launch
                            </button>
                            <button
                              onClick={() => remove(r.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-[10px] font-inter text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.12)]"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="font-inter text-[10px] text-[#5A6577] text-center py-4">prazno</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
