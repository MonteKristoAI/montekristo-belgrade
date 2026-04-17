import { useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, Pill } from "../components/primitives";
import { buildClientContextMarkdown, edgeFnUrl, EDGE_FN_ANON } from "@/lib/mk-onboarding/buildClientContext";
import { Sparkles, Loader2, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function MeetingPrepTab({ client }: { client: MkClient }) {
  const [prep, setPrep] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const context = await buildClientContextMarkdown(client);
      const { data: sess } = await mkSupabase.auth.getSession();
      const bearer = sess.session?.access_token ?? EDGE_FN_ANON;
      const res = await fetch(edgeFnUrl("mk-meeting-prep"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${bearer}`, apikey: EDGE_FN_ANON },
        body: JSON.stringify({ clientContext: context }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPrep(data.markdown ?? "");
      setGeneratedAt(new Date());
    } catch (e) {
      toast.error("Edge fn greska. Deploy mk-meeting-prep sa ANTHROPIC_API_KEY.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!prep) return;
    await navigator.clipboard.writeText(prep);
    toast.success("Kopirano u clipboard.");
  };

  const download = () => {
    if (!prep) return;
    const blob = new Blob([prep], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meeting-prep-${client.slug}-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section
      title="Meeting prep"
      description="Pre-call brief generisan iz celog profila klijenta: TL;DR, otvorena pitanja, blokeri, shipped, predlozi."
      action={
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-xs font-medium shadow-[0_6px_16px_-6px_rgba(255,92,92,0.6)] hover:shadow-[0_10px_24px_-6px_rgba(255,92,92,0.8)] transition-shadow disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "Generisem…" : prep ? "Ponovo" : "Generisi brief"}
        </button>
      }
    >
      {!prep && !loading && (
        <p className="font-inter text-sm text-[#5A6577] py-8 text-center">
          Klikni "Generisi brief" da dobijes AI-generated pre-call prep.
        </p>
      )}

      {prep && (
        <div>
          <div className="flex items-center justify-between mb-3">
            {generatedAt && <Pill variant="success">Generisano {generatedAt.toLocaleTimeString()}</Pill>}
            <div className="flex items-center gap-1">
              <button onClick={copy} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 font-inter text-xs text-[#F5F0E6]">
                <Copy className="w-3 h-3" /> Kopiraj
              </button>
              <button onClick={download} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 font-inter text-xs text-[#F5F0E6]">
                <Download className="w-3 h-3" /> MD
              </button>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0A1228] p-5">
            <pre className="whitespace-pre-wrap font-inter text-sm text-[#F5F0E6] leading-relaxed">{prep}</pre>
          </div>
        </div>
      )}
    </Section>
  );
}
