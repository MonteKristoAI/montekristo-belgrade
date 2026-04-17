import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { useSavedField, SaveBadge } from "@/lib/mk-onboarding/useSavedField";
import { Section, FieldLabel, inputCls, textareaCls, Pill } from "../components/primitives";
import { buildClientContextMarkdown, edgeFnUrl, EDGE_FN_ANON } from "@/lib/mk-onboarding/buildClientContext";
import { Sparkles, Loader2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

type Audit = {
  id: string;
  client_id: string;
  positioning_strength: number | null;
  differentiation_notes: string | null;
  primary_channels: string[] | null;
  active_offers: string | null;
  lead_magnets: string | null;
  conversion_bottlenecks: string | null;
  mk_growth_ideas: string | null;
  last_reviewed_at: string | null;
};

type GeneratedIdea = {
  title: string;
  rationale: string;
  next_step: string;
  impact: string;
  effort: string;
  tags: string[];
};

export default function BusinessTab({ client }: { client: MkClient }) {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_marketing_audit")
      .select("*")
      .eq("client_id", client.id)
      .maybeSingle();
    if (data) setAudit(data as unknown as Audit);
    else {
      const { data: created } = await mkSupabase
        .from("mk_client_marketing_audit")
        .insert({ client_id: client.id })
        .select()
        .single();
      setAudit(created as unknown as Audit);
    }
  };

  useEffect(() => {
    load();
  }, [client.id]);

  const generateIdeas = async () => {
    setGenerating(true);
    setGeneratedIdeas([]);
    try {
      const context = await buildClientContextMarkdown(client);
      const { data: sess } = await mkSupabase.auth.getSession();
      const bearer = sess.session?.access_token ?? EDGE_FN_ANON;
      const res = await fetch(edgeFnUrl("mk-growth-ideas"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearer}`,
          apikey: EDGE_FN_ANON,
        },
        body: JSON.stringify({ clientContext: context }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      if (Array.isArray(data?.ideas)) {
        setGeneratedIdeas(data.ideas);
      } else {
        toast.error("Model nije vratio ideje u ocekivanoj formi.");
        console.error(data);
      }
    } catch (e) {
      toast.error("Greska pri generisanju. Edge fn mora biti deploy-ovana sa ANTHROPIC_API_KEY.");
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const acceptIdea = async (idea: GeneratedIdea) => {
    if (!audit) return;
    const block = `## ${idea.title}\n\n${idea.rationale}\n\n**Next step:** ${idea.next_step}\n\n_impact: ${idea.impact} · effort: ${idea.effort} · tags: ${idea.tags?.join(", ") ?? ""}_\n\n---\n\n`;
    const next = (audit.mk_growth_ideas ?? "") + "\n\n" + block;
    const { error } = await mkSupabase
      .from("mk_client_marketing_audit")
      .update({ mk_growth_ideas: next, last_reviewed_at: new Date().toISOString() })
      .eq("id", audit.id);
    if (error) {
      toast.error("Greska pri cuvanju.");
      console.error(error);
      return;
    }
    toast.success("Ideja dodata u MK growth ideas.");
    setGeneratedIdeas((prev) => prev.filter((x) => x.title !== idea.title));
    load();
  };

  const rejectIdea = (idea: GeneratedIdea) => {
    setGeneratedIdeas((prev) => prev.filter((x) => x.title !== idea.title));
  };

  if (!audit) return <p className="font-inter text-sm text-[#5A6577]">Ucitavam…</p>;

  const save = (fields: Partial<Audit>) => async () => {
    const { error } = await mkSupabase.from("mk_client_marketing_audit").update(fields).eq("id", audit.id);
    if (error) throw error;
  };

  return <Form audit={audit} onSave={save} onGenerate={generateIdeas} generating={generating} generatedIdeas={generatedIdeas} onAccept={acceptIdea} onReject={rejectIdea} />;
}

function Form({
  audit,
  onSave,
  onGenerate,
  generating,
  generatedIdeas,
  onAccept,
  onReject,
}: {
  audit: Audit;
  onSave: (fields: Partial<Audit>) => () => Promise<void>;
  onGenerate: () => void;
  generating: boolean;
  generatedIdeas: GeneratedIdea[];
  onAccept: (idea: GeneratedIdea) => void;
  onReject: (idea: GeneratedIdea) => void;
}) {
  const [pos, setPos, posStatus] = useSavedField(audit.positioning_strength ?? "", async (v) => {
    await onSave({ positioning_strength: v === "" ? null : Number(v) })();
  });
  const [diff, setDiff, diffStatus] = useSavedField(audit.differentiation_notes ?? "", (v) => onSave({ differentiation_notes: v || null })());
  const [channels, setChannels, chanStatus] = useSavedField(
    (audit.primary_channels ?? []).join(", "),
    async (v) => {
      const arr = v.split(",").map((s) => s.trim()).filter(Boolean);
      await onSave({ primary_channels: arr })();
    }
  );
  const [offers, setOffers, offersStatus] = useSavedField(audit.active_offers ?? "", (v) => onSave({ active_offers: v || null })());
  const [leadMags, setLeadMags, lmStatus] = useSavedField(audit.lead_magnets ?? "", (v) => onSave({ lead_magnets: v || null })());
  const [bottlenecks, setBottlenecks, bnStatus] = useSavedField(audit.conversion_bottlenecks ?? "", (v) => onSave({ conversion_bottlenecks: v || null })());
  const [ideas, setIdeas, ideasStatus] = useSavedField(audit.mk_growth_ideas ?? "", (v) => onSave({ mk_growth_ideas: v || null })());

  return (
    <div className="space-y-5">
      <Section title="Pozicioniranje" description="Kako klijent stoji u poredjenju sa konkurencijom i sta ih razdvaja.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <FieldLabel hint={<SaveBadge status={posStatus} />}>Jacina pozicije (1-10)</FieldLabel>
            <input type="number" min={1} max={10} value={String(pos)} onChange={(e) => setPos(e.target.value)} className={inputCls} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel hint={<SaveBadge status={diffStatus} />}>Differentiation notes</FieldLabel>
            <textarea value={diff} onChange={(e) => setDiff(e.target.value)} rows={2} className={textareaCls} placeholder="Sta ih zaista razdvaja od konkurencije?" />
          </div>
        </div>
      </Section>

      <Section title="Kanali i ponude">
        <div className="space-y-4">
          <div>
            <FieldLabel hint={<SaveBadge status={chanStatus} />}>Primary channels (comma-separated)</FieldLabel>
            <input value={channels} onChange={(e) => setChannels(e.target.value)} className={inputCls} placeholder="Google organic, Instagram, Meta ads, Podcast" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={offersStatus} />}>Active offers</FieldLabel>
            <textarea value={offers} onChange={(e) => setOffers(e.target.value)} rows={3} className={textareaCls} placeholder="Paketi, cene, promocije, launch offers…" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={lmStatus} />}>Lead magnets</FieldLabel>
            <textarea value={leadMags} onChange={(e) => setLeadMags(e.target.value)} rows={2} className={textareaCls} placeholder="Kvizovi, vodici, free samples, webinari…" />
          </div>
        </div>
      </Section>

      <Section title="Conversion bottlenecks" description="Gde se konverzija lomi? Ovo AI chat i growth generator koriste kao ulaz.">
        <div>
          <FieldLabel hint={<SaveBadge status={bnStatus} />}>Bottlenecks</FieldLabel>
          <textarea value={bottlenecks} onChange={(e) => setBottlenecks(e.target.value)} rows={4} className={textareaCls} placeholder="npr. 'landing page bez social proof', 'booking form predugacak'…" />
        </div>
      </Section>

      <Section
        title="MK growth ideas"
        description="Sta bi uradili ako bi ovo bio NAS biznis. AI generator koristi ceo profil za predloge."
        action={
          <button
            onClick={onGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-xs font-medium shadow-[0_6px_16px_-6px_rgba(255,92,92,0.6)] hover:shadow-[0_10px_24px_-6px_rgba(255,92,92,0.8)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {generating ? "Generisem…" : "Generisi 5 ideja"}
          </button>
        }
      >
        {generatedIdeas.length > 0 && (
          <div className="space-y-2 mb-5">
            <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577] mb-2">Predlozi</p>
            {generatedIdeas.map((idea, i) => (
              <div
                key={i}
                className="rounded-lg border border-[rgba(255,92,92,0.25)] bg-[rgba(255,92,92,0.04)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-poppins text-sm font-semibold text-[#F5F0E6]">{idea.title}</p>
                    <p className="font-inter text-xs text-[#9AA5B8] mt-1 leading-relaxed">{idea.rationale}</p>
                    <p className="font-inter text-xs text-[#F5F0E6] mt-2">
                      <span className="text-[#FF8A8A] font-medium">Next: </span>
                      {idea.next_step}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Pill variant={idea.impact === "high" ? "success" : idea.impact === "medium" ? "info" : "neutral"}>
                        impact: {idea.impact}
                      </Pill>
                      <Pill variant={idea.effort === "low" ? "success" : idea.effort === "medium" ? "warn" : "danger"}>
                        effort: {idea.effort}
                      </Pill>
                      {idea.tags?.map((t) => (
                        <Pill key={t} variant="neutral">
                          {t}
                        </Pill>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => onAccept(idea)}
                      className="h-8 w-8 rounded-md bg-[rgba(63,185,125,0.15)] text-[#70D7A0] hover:bg-[rgba(63,185,125,0.25)] flex items-center justify-center"
                      title="Prihvati i ubaci u MK growth ideas"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onReject(idea)}
                      className="h-8 w-8 rounded-md bg-white/5 text-[#9AA5B8] hover:bg-white/10 flex items-center justify-center"
                      title="Odbaci"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <FieldLabel hint={<SaveBadge status={ideasStatus} />}>
          Growth ideas (markdown, slobodan format)
        </FieldLabel>
        <textarea
          value={ideas}
          onChange={(e) => setIdeas(e.target.value)}
          rows={14}
          className={textareaCls}
          placeholder="Kratko-rocne i dugo-rocne ideje za unapredjenje. Marketing, positioning, nove ponude, nove kanale, tech…"
        />
      </Section>
    </div>
  );
}
