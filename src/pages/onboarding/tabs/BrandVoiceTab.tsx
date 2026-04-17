import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { useSavedField, SaveBadge } from "@/lib/mk-onboarding/useSavedField";
import { Section, FieldLabel, inputCls, textareaCls, Pill } from "../components/primitives";

type BV = {
  id: string;
  client_id: string;
  tone_descriptors: string[] | null;
  banned_vocabulary: string[] | null;
  required_phrases: string[] | null;
  readability_target: string | null;
  persona_summary: string | null;
  icp_summary: string | null;
  sample_writing_url: string | null;
  voice_guide_url: string | null;
  notes: string | null;
};

export default function BrandVoiceTab({ client }: { client: MkClient }) {
  const [bv, setBv] = useState<BV | null>(null);

  const load = async () => {
    const { data } = await mkSupabase.from("mk_client_brand_voice").select("*").eq("client_id", client.id).maybeSingle();
    if (data) setBv(data as unknown as BV);
    else {
      const { data: created } = await mkSupabase.from("mk_client_brand_voice").insert({ client_id: client.id }).select().single();
      setBv(created as unknown as BV);
    }
  };
  useEffect(() => { load(); }, [client.id]);

  if (!bv) return <p className="font-inter text-sm text-[#5A6577]">Ucitavam…</p>;

  const save = (fields: Partial<BV>) => async () => {
    const { error } = await mkSupabase.from("mk_client_brand_voice").update(fields).eq("id", bv.id);
    if (error) throw error;
  };

  return <Form bv={bv} save={save} />;
}

function Form({ bv, save }: { bv: BV; save: (fields: Partial<BV>) => () => Promise<void> }) {
  const [tone, setTone, toneStatus] = useSavedField((bv.tone_descriptors ?? []).join(", "), async (v) => {
    await save({ tone_descriptors: v.split(",").map((s) => s.trim()).filter(Boolean) })();
  });
  const [banned, setBanned, bannedStatus] = useSavedField((bv.banned_vocabulary ?? []).join(", "), async (v) => {
    await save({ banned_vocabulary: v.split(",").map((s) => s.trim()).filter(Boolean) })();
  });
  const [required, setRequired, reqStatus] = useSavedField((bv.required_phrases ?? []).join(", "), async (v) => {
    await save({ required_phrases: v.split(",").map((s) => s.trim()).filter(Boolean) })();
  });
  const [readability, setReadability, readStatus] = useSavedField(bv.readability_target ?? "", (v) => save({ readability_target: v || null })());
  const [persona, setPersona, personaStatus] = useSavedField(bv.persona_summary ?? "", (v) => save({ persona_summary: v || null })());
  const [icp, setIcp, icpStatus] = useSavedField(bv.icp_summary ?? "", (v) => save({ icp_summary: v || null })());
  const [sample, setSample, sampleStatus] = useSavedField(bv.sample_writing_url ?? "", (v) => save({ sample_writing_url: v || null })());
  const [guide, setGuide, guideStatus] = useSavedField(bv.voice_guide_url ?? "", (v) => save({ voice_guide_url: v || null })());
  const [notes, setNotes, notesStatus] = useSavedField(bv.notes ?? "", (v) => save({ notes: v || null })());

  const bannedList = banned.split(",").map((s) => s.trim()).filter(Boolean);
  const requiredList = required.split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      <Section title="Persona i ICP" description="Ko pise i kome. Ovo je prvi kontekst u AI chat-u.">
        <div className="space-y-4">
          <div>
            <FieldLabel hint={<SaveBadge status={personaStatus} />}>Persona summary</FieldLabel>
            <textarea value={persona} onChange={(e) => setPersona(e.target.value)} rows={3} className={textareaCls} placeholder="Ko pise? Sa koje pozicije? Kako zvuci?" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={icpStatus} />}>ICP summary</FieldLabel>
            <textarea value={icp} onChange={(e) => setIcp(e.target.value)} rows={3} className={textareaCls} placeholder="Ko su kupci? Sta ih boli? Sta hoce?" />
          </div>
        </div>
      </Section>

      <Section title="Ton" description="Prvi tab koji citam pre pisanja bilo cega za klijenta.">
        <div className="space-y-4">
          <div>
            <FieldLabel hint={<SaveBadge status={toneStatus} />}>Tone descriptors (comma-separated)</FieldLabel>
            <input value={tone} onChange={(e) => setTone(e.target.value)} className={inputCls} placeholder="confident, technical, no-fluff…" />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={readStatus} />}>Readability target</FieldLabel>
            <input value={readability} onChange={(e) => setReadability(e.target.value)} className={inputCls} placeholder="Grade 8, practitioner, casual…" />
          </div>
        </div>
      </Section>

      <Section
        title="Banned vocabulary"
        description="Reci koje NIKAD ne idu u copy za ovog klijenta. SDS: 'Interoperable'. Entourage: em-dash."
      >
        <FieldLabel hint={<SaveBadge status={bannedStatus} />}>Banned (comma-separated)</FieldLabel>
        <textarea value={banned} onChange={(e) => setBanned(e.target.value)} rows={3} className={textareaCls} />
        {bannedList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {bannedList.map((w, i) => (
              <Pill key={i} variant="danger">{w}</Pill>
            ))}
          </div>
        )}
      </Section>

      <Section title="Required phrases">
        <FieldLabel hint={<SaveBadge status={reqStatus} />}>Required (comma-separated)</FieldLabel>
        <textarea value={required} onChange={(e) => setRequired(e.target.value)} rows={2} className={textareaCls} placeholder="'Farm Bill compliant', 'Warrior Universal Panel'…" />
        {requiredList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {requiredList.map((w, i) => (
              <Pill key={i} variant="success">{w}</Pill>
            ))}
          </div>
        )}
      </Section>

      <Section title="Reference linkovi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel hint={<SaveBadge status={sampleStatus} />}>Sample writing URL</FieldLabel>
            <input value={sample} onChange={(e) => setSample(e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel hint={<SaveBadge status={guideStatus} />}>Voice guide URL</FieldLabel>
            <input value={guide} onChange={(e) => setGuide(e.target.value)} className={inputCls} />
          </div>
        </div>
      </Section>

      <Section title="Notes">
        <FieldLabel hint={<SaveBadge status={notesStatus} />}>Napomene</FieldLabel>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={textareaCls} />
      </Section>
    </div>
  );
}
