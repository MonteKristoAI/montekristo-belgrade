import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, LogOut } from "lucide-react";

// ─── SESSION KEY ────────────────────────────────────────────────────────────
export const AIIA_SESSION_KEY = "aiia_portal_v1";

// ─── CLIENT ─────────────────────────────────────────────────────────────────
const CLIENT = {
  id: "aiia",
  pw: ["AIIA", "2026", "Qm8xRpNvWzKj"].join("-"),
  label: "AiiA",
  reports: [
    {
      id: "lrmb-onboarding",
      title: "Production Onboarding",
      subtitle: "Field Ops Discovery Questionnaire · April 2026",
      date: "April 2026",
      tag: "Onboarding",
      description:
        "Complete this questionnaire to help us configure your production Field Ops app. Covers properties, staff, task types, integrations, branding, and deployment preferences.",
      stats: [
        { label: "Sections", value: "14", delta: "All areas covered" },
        { label: "Auto-saved", value: "Yes", delta: "Resumes where you left off" },
        { label: "Est. time", value: "30–45 min", delta: "Complete in stages" },
      ],
      path: "/aiia/onboarding",
    },
  ],
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const AiiaPortal = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(AIIA_SESSION_KEY) === "aiia") setAuthenticated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CLIENT.pw) {
      sessionStorage.setItem(AIIA_SESSION_KEY, "aiia");
      setAuthenticated(true);
      setError(false);
      setPassword("");
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 550);
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AIIA_SESSION_KEY);
    setAuthenticated(false);
    setPassword("");
  };

  // ── PASSWORD GATE ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen text-white flex flex-col" style={{ background: "#03050A" }}>
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <div className={`w-full max-w-sm ${shaking ? "animate-shake" : ""}`}>

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/aiia-logo.png" alt="AiiA" className="h-20 w-auto object-contain" />
            </div>

            <h1 className="text-2xl font-bold text-center text-white mb-2">Client Portal</h1>
            <p className="text-center text-sm mb-8 leading-relaxed" style={{ color: "#6B7280" }}>
              Enter your access password to view<br />your reports and documents.
            </p>

            <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-4" style={{ background: "#0A0C12", border: "1px solid rgba(196,151,60,0.15)" }}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-white text-sm placeholder-gray-600 outline-none transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(196,151,60,0.2)",
                  }}
                  onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(196,151,60,0.5)"; }}
                  onBlur={(e) => { if (!error) e.target.style.borderColor = "rgba(196,151,60,0.2)"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#6B7280" }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center">Incorrect password. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={!password.trim()}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#C4973C", color: "#03050A" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "#D4A84A"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "#C4973C"; }}
              >
                <Lock className="w-4 h-4" /> Unlock Portal
              </button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: "#374151" }}>
              Prepared by AiiACo · Secure client portal
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── AUTHENTICATED — REPORT LIST ────────────────────────────────────────────
  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: "#03050A" }}>

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md" style={{ background: "rgba(3,5,10,0.95)", borderBottom: "1px solid rgba(196,151,60,0.1)" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <img src="/aiia-logo.png" alt="AiiA" className="h-10 w-auto object-contain" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: "#6B7280" }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#9CA3AF"; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "#6B7280"; }}
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">

        {/* Heading */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#C4973C" }}>
            · OPERATIONAL INTELLIGENCE ·
          </span>
          <h1 className="text-3xl font-bold text-white mt-2">Your Documents</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Secure access to your onboarding questionnaires, reports, and configuration documents.
          </p>
        </div>

        {/* Report cards */}
        <div className="grid gap-5">
          {CLIENT.reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl p-6 transition-all duration-200 cursor-pointer group"
              style={{ background: "#0A0C12", border: "1px solid rgba(196,151,60,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,151,60,0.35)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,151,60,0.15)"; }}
              onClick={() => navigate(report.path)}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                      style={{ background: "rgba(196,151,60,0.15)", color: "#C4973C", border: "1px solid rgba(196,151,60,0.25)" }}
                    >
                      {report.tag}
                    </span>
                    <span className="text-xs" style={{ color: "#4B5563" }}>{report.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{report.title}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{report.subtitle}</p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors"
                  style={{ background: "rgba(196,151,60,0.1)", border: "1px solid rgba(196,151,60,0.2)" }}
                >
                  <ArrowRight className="w-4 h-4" style={{ color: "#C4973C" }} />
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>{report.description}</p>

              <div className="flex gap-6">
                {report.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: "#4B5563" }}>{stat.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#C4973C" }}>{stat.delta}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-center mt-12" style={{ color: "#1F2937" }}>
          AiiACo · Operational Intelligence Platform · Secure access only
        </p>
      </main>
    </div>
  );
};

export default AiiaPortal;
