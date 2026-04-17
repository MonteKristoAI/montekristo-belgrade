import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mkSupabase } from "@/lib/mk-onboarding/supabase";
import { inputCls, textareaCls, Section, FieldLabel } from "./components/primitives";
import { AlertCircle } from "lucide-react";

export default function NewClient() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [positioning, setPositioning] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const autoSlug = (input: string) =>
    input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const finalSlug = slug || autoSlug(name);
    if (!finalSlug || !name) {
      setError("Ime i slug su obavezni.");
      return;
    }
    setLoading(true);
    const { data, error } = await mkSupabase
      .from("mk_clients")
      .insert({
        name,
        slug: finalSlug,
        industry: industry || null,
        one_line_positioning: positioning || null,
        website_url: websiteUrl || null,
        status: "onboarding",
        folder_path: `clients/${finalSlug}`,
      })
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data) navigate(`/onboarding/${finalSlug}`, { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-poppins text-3xl font-semibold text-[#F5F0E6] tracking-tight">Dodaj klijenta</h1>
        <p className="font-inter text-sm text-[#9AA5B8] mt-1">
          Minimalan skup polja. Ostalo dodajes kroz profil.
        </p>
      </div>

      <Section>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <FieldLabel>Ime klijenta *</FieldLabel>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) setSlug(autoSlug(e.target.value));
              }}
              required
              className={inputCls}
              placeholder="npr. Arrow Funds"
              autoFocus
            />
          </div>
          <div>
            <FieldLabel>Slug *</FieldLabel>
            <input value={slug} onChange={(e) => setSlug(autoSlug(e.target.value))} required className={inputCls} placeholder="arrow-funds" />
            <p className="font-inter text-[11px] text-[#5A6577] mt-1">Takodje je folder ime u clients/ direktorijumu.</p>
          </div>
          <div>
            <FieldLabel>Industrija</FieldLabel>
            <input value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls} placeholder="Finance / Investment" />
          </div>
          <div>
            <FieldLabel>Website URL</FieldLabel>
            <input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={inputCls} placeholder="https://…" />
          </div>
          <div>
            <FieldLabel>One-line positioning</FieldLabel>
            <textarea value={positioning} onChange={(e) => setPositioning(e.target.value)} rows={2} className={textareaCls} placeholder="Jedna recenica: ko su, sta rade, kome." />
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-[rgba(255,92,92,0.08)] border border-[rgba(255,92,92,0.3)] px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-[#FF8A8A] shrink-0 mt-0.5" />
              <span className="font-inter text-xs text-[#FF8A8A]">{error}</span>
            </div>
          )}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-sm font-medium shadow-[0_6px_16px_-6px_rgba(255,92,92,0.6)] hover:shadow-[0_10px_24px_-6px_rgba(255,92,92,0.8)] transition-shadow disabled:opacity-50"
            >
              {loading ? "Kreiram…" : "Kreiraj i otvori profil"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/onboarding")}
              className="px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-[#F5F0E6] font-inter text-sm"
            >
              Otkazi
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}
