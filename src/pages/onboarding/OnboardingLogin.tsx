import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mkSupabase } from "@/lib/mk-onboarding/supabase";
import { inputCls } from "./components/primitives";
import { AlertCircle, Sparkles } from "lucide-react";

export default function OnboardingLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await mkSupabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/onboarding", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#060B18] text-[#F5F0E6] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 400px at 20% 20%, rgba(255,92,92,0.15), transparent), radial-gradient(600px 400px at 80% 80%, rgba(79,179,232,0.08), transparent)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5C5C] to-[#8B3838] flex items-center justify-center font-poppins font-bold text-base text-white shadow-[0_10px_30px_-10px_rgba(255,92,92,0.5)]">
              MK
            </div>
          </div>
          <h1 className="font-poppins text-2xl font-semibold text-[#F5F0E6] tracking-tight">
            MonteKristo Onboarding
          </h1>
          <p className="font-inter text-sm text-[#9AA5B8] mt-1.5">
            Interni command center za MK tim
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-[#0B1325] p-7 space-y-4 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.6)]"
        >
          <div>
            <label htmlFor="email" className="font-inter text-[11px] uppercase tracking-widest text-[#9AA5B8] mb-1.5 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
              className={inputCls}
              placeholder="contact@montekristobelgrade.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-inter text-[11px] uppercase tracking-widest text-[#9AA5B8] mb-1.5 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-md bg-[rgba(255,92,92,0.08)] border border-[rgba(255,92,92,0.3)] px-3 py-2.5">
              <AlertCircle className="w-4 h-4 text-[#FF8A8A] shrink-0 mt-0.5" />
              <span className="font-inter text-xs text-[#FF8A8A]">{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-sm font-medium shadow-[0_10px_30px_-10px_rgba(255,92,92,0.5)] hover:shadow-[0_14px_36px_-10px_rgba(255,92,92,0.7)] transition-shadow disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-1.5 font-inter text-[10px] text-[#5A6577]">
          <Sparkles className="w-3 h-3" />
          AI-powered. Claude Sonnet 4.6 · Supabase · Vault sync.
        </div>
      </motion.div>
    </div>
  );
}
