import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { mkSignOut } from "@/lib/mk-onboarding/useAuth";
import { CommandPalette } from "./CommandPalette";
import { Home, Grid3x3, UserPlus, LogOut, Search, Sparkles, Activity } from "lucide-react";
import { Kbd } from "./primitives";
import { theme } from "../theme";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060B18] text-[#F5F0E6] flex">
      <CommandPalette />
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: theme.motion.base, ease: theme.motion.ease }}
            className="max-w-[1440px] mx-auto px-8 py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const nav = [
    { to: "/onboarding", label: "Dashboard", icon: Home, end: true },
    { to: "/onboarding/portfolio", label: "Portfolio", icon: Grid3x3 },
    { to: "/onboarding/activity", label: "Activity", icon: Activity },
    { to: "/onboarding/new", label: "Dodaj klijenta", icon: UserPlus },
  ];
  return (
    <aside className="w-60 shrink-0 border-r border-white/5 bg-[#04091A] flex flex-col">
      <div className="px-5 py-5 border-b border-white/5">
        <Link to="/onboarding" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5C5C] to-[#8B3838] flex items-center justify-center font-poppins font-bold text-sm text-white">
            MK
          </div>
          <div>
            <p className="font-poppins font-semibold text-sm text-[#F5F0E6] tracking-tight leading-none">
              MonteKristo
            </p>
            <p className="font-inter text-[10px] uppercase tracking-[0.14em] text-[#5A6577] mt-1 leading-none">
              Onboarding Portal
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-inter transition-colors ${
                  isActive
                    ? "bg-white/5 text-[#F5F0E6]"
                    : "text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {n.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="flex items-center gap-2 font-inter text-xs text-[#9AA5B8]">
            <Search className="w-3.5 h-3.5" />
            Pretrazi…
          </span>
          <Kbd>⌘K</Kbd>
        </button>

        <button
          onClick={async () => {
            await mkSignOut();
            window.location.href = "/onboarding/login";
          }}
          className="w-full mt-2 flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-inter text-[#9AA5B8] hover:text-[#F5F0E6] hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Odjava
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  const location = useLocation();
  const params = useParams<{ slug?: string }>();

  const crumbs: { label: string; to?: string }[] = [{ label: "Onboarding", to: "/onboarding" }];
  if (location.pathname === "/onboarding/new") crumbs.push({ label: "Dodaj klijenta" });
  if (location.pathname === "/onboarding/portfolio") crumbs.push({ label: "Portfolio" });
  if (location.pathname === "/onboarding/activity") crumbs.push({ label: "Activity" });
  if (params.slug) crumbs.push({ label: params.slug });

  return (
    <div className="h-14 border-b border-white/5 flex items-center px-8 bg-[#060B18]/80 backdrop-blur sticky top-0 z-30">
      <nav className="flex items-center gap-2 flex-1">
        {crumbs.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#5A6577]">/</span>}
            {c.to ? (
              <Link
                to={c.to}
                className="font-inter text-xs text-[#9AA5B8] hover:text-[#F5F0E6] transition-colors"
              >
                {c.label}
              </Link>
            ) : (
              <span className="font-inter text-xs text-[#F5F0E6] font-medium">{c.label}</span>
            )}
          </div>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[rgba(255,92,92,0.3)] bg-[rgba(255,92,92,0.06)]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF8A8A]" />
          <span className="font-inter text-[11px] text-[#FF8A8A] font-medium">AI-powered</span>
        </div>
      </div>
    </div>
  );
}
