import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, FileText, ArrowRight, Shield, Eye, EyeOff, BarChart2 } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

// Password stored in fragments so it never appears as a single string literal in the bundle
const _f = ["ReigSolar", "2026", "K9xmPqW7vLzNj"];
const _p = () => _f.join("-");

export const REPORTS_STORAGE_KEY = "mk_portal_v1";
export const AUTH_TOKEN = "authenticated";

const REPORTS = [
  {
    id: "reig-solar-q1-2026",
    title: "REIG Solar — SEO Progress Report",
    subtitle: "Q1 2026 · January – March · reig-us.com",
    date: "March 30, 2026",
    tag: "SEO Report",
    description:
      "Domain authority growth, organic traffic trends, backlink acceleration, AI visibility across ChatGPT/Gemini/AI Overview, and full Q1 published content record with Yoast quality scores.",
    stats: [
      { label: "Backlinks", value: "551", delta: "+81%" },
      { label: "Ref. Domains", value: "159", delta: "+77%" },
      { label: "Q1 Avg Traffic", value: "93", delta: "+343% vs baseline" },
    ],
  },
  {
    id: "breathmastery-q1-2026",
    title: "BreathMastery — SEO Progress Report",
    subtitle: "Q1 2026 · March 2026 Focus · breathmastery.com",
    date: "March 29, 2026",
    tag: "SEO Report",
    description:
      "Organic traffic growth (+17%), backlink acceleration (+223 in March), referring domain expansion, /meet-dan/ page traffic +271%, 4 published blog posts, SERP distribution across 248 keywords, and 90-day editorial plan.",
    stats: [
      { label: "Backlinks", value: "6,018", delta: "+223 in March" },
      { label: "Ref. Domains", value: "713", delta: "+19 vs Feb" },
      { label: "Est. Traffic", value: "104", delta: "+17% in 4 weeks" },
    ],
  },
];

const Reports = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(REPORTS_STORAGE_KEY) === AUTH_TOKEN) {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === _p()) {
      sessionStorage.setItem(REPORTS_STORAGE_KEY, AUTH_TOKEN);
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 550);
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(REPORTS_STORAGE_KEY);
    setAuthenticated(false);
    setPassword("");
  };

  /* ─── PASSWORD GATE ─────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-24">
          <div className={`w-full max-w-sm ${shaking ? "animate-shake" : ""}`}>

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Lock className="w-7 h-7 text-blue-400" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-white mb-2">
              Client Portal
            </h1>
            <p className="text-gray-400 text-center text-sm mb-8 leading-relaxed">
              Enter your access password to view<br />reports and shared documents.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Access password"
                  autoComplete="off"
                  autoFocus
                  className={`w-full px-4 py-3.5 pr-12 rounded-xl text-sm transition-all duration-150 outline-none
                    bg-white/5 text-white placeholder-gray-600
                    border ${error
                      ? "border-red-500/50 bg-red-500/5 focus:border-red-400/60"
                      : "border-white/10 focus:border-blue-500/50 focus:bg-white/8"
                    }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <p className="text-red-400/90 text-xs text-center pt-0.5">
                  Incorrect password. Please try again.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                  text-white font-semibold text-sm transition-all duration-150 mt-1"
              >
                Access Reports
              </button>
            </form>

            <p className="text-gray-700 text-xs text-center mt-8">
              Prepared by{" "}
              <span className="text-gray-600">MonteKristo AI</span>
              {" · "}
              Need access?{" "}
              <span className="text-gray-500">Contact your account manager.</span>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ─── REPORT LIST ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-20">

        {/* Header row */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-xs font-bold uppercase tracking-widest">
                Secure Access
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Client Reports
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              Your shared documents and performance reports.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-400 text-xs underline underline-offset-2 mt-1 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Report cards */}
        <div className="space-y-4">
          {REPORTS.map((report) => (
            <button
              key={report.id}
              onClick={() => navigate(`/reports/${report.id}`)}
              className="w-full text-left group bg-white/[0.03] hover:bg-white/[0.06]
                border border-white/[0.08] hover:border-blue-500/30
                rounded-2xl p-6 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20
                    flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart2 className="w-5 h-5 text-blue-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Tag + date */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-blue-500/15 text-blue-300
                        px-2.5 py-0.5 rounded-full border border-blue-500/20">
                        {report.tag}
                      </span>
                      <span className="text-gray-600 text-xs">{report.date}</span>
                    </div>

                    <h2 className="text-white font-semibold text-base mb-0.5">
                      {report.title}
                    </h2>
                    <p className="text-gray-500 text-xs mb-3">{report.subtitle}</p>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">
                      {report.description}
                    </p>

                    {/* Mini stats */}
                    <div className="flex gap-4 flex-wrap">
                      {report.stats.map((s) => (
                        <div key={s.label} className="flex flex-col">
                          <span className="text-white font-bold text-sm leading-none">
                            {s.value}
                          </span>
                          <span className="text-green-400/80 text-xs font-medium mt-0.5">
                            {s.delta}
                          </span>
                          <span className="text-gray-600 text-[10px] mt-0.5 uppercase tracking-wider">
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-blue-400
                  flex-shrink-0 mt-1.5 transition-colors duration-150" />
              </div>
            </button>
          ))}
        </div>

        <p className="text-gray-700 text-[11px] text-center mt-14 leading-relaxed">
          Reports prepared by MonteKristo AI<br />
          Data: Semrush · Yoast SEO · Site publishing history
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
