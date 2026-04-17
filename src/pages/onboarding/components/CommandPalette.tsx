import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAllClientsWithSignals } from "@/lib/mk-onboarding/useClientData";
import { Search, Users, Briefcase, FileText, ArrowRight, Zap, Plus } from "lucide-react";
import { theme } from "../theme";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: clients = [] } = useAllClientsWithSignals();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: theme.motion.base, ease: theme.motion.ease }}
            className="fixed left-1/2 top-24 -translate-x-1/2 w-[620px] max-w-[92vw] z-[101]"
          >
            <Command
              loop
              className="rounded-xl border border-white/10 bg-[#121E3B] shadow-[0_20px_50px_-16px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <Search className="w-4 h-4 text-[#9AA5B8]" />
                <Command.Input
                  placeholder="Pretrazi klijente, kontakte, rute, akcije…"
                  className="flex-1 bg-transparent outline-none font-inter text-sm text-[#F5F0E6] placeholder:text-[#5A6577]"
                />
                <kbd className="font-mono text-[10px] text-[#5A6577] border border-white/10 px-1.5 py-0.5 rounded">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center font-inter text-xs text-[#5A6577]">
                  Nema rezultata.
                </Command.Empty>

                <Command.Group heading="Brze akcije" className="[&_[cmdk-group-heading]]:font-inter [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[#5A6577] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
                  <CmdItem icon={<Zap className="w-3.5 h-3.5" />} onSelect={() => go("/onboarding")}>
                    Otvori dashboard
                  </CmdItem>
                  <CmdItem icon={<Plus className="w-3.5 h-3.5" />} onSelect={() => go("/onboarding/new")}>
                    Dodaj klijenta
                  </CmdItem>
                  <CmdItem icon={<Briefcase className="w-3.5 h-3.5" />} onSelect={() => go("/onboarding/portfolio")}>
                    Portfolio heatmap
                  </CmdItem>
                </Command.Group>

                <Command.Group heading="Klijenti" className="[&_[cmdk-group-heading]]:font-inter [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[#5A6577] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
                  {clients.map((c) => (
                    <CmdItem
                      key={c.id}
                      icon={<Users className="w-3.5 h-3.5" />}
                      value={`${c.name} ${c.slug} ${c.industry ?? ""}`}
                      onSelect={() => go(`/onboarding/${c.slug}`)}
                    >
                      <span className="flex-1">{c.name}</span>
                      {c.industry && (
                        <span className="font-inter text-[10px] text-[#5A6577]">{c.industry}</span>
                      )}
                    </CmdItem>
                  ))}
                </Command.Group>

                <Command.Group heading="Duboki linkovi" className="[&_[cmdk-group-heading]]:font-inter [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[#5A6577] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2">
                  {clients.slice(0, 8).map((c) => (
                    <CmdItem
                      key={`brand-${c.id}`}
                      icon={<FileText className="w-3.5 h-3.5" />}
                      value={`${c.name} brand voice rules`}
                      onSelect={() => go(`/onboarding/${c.slug}?tab=voice`)}
                    >
                      Brand voice — {c.name}
                    </CmdItem>
                  ))}
                </Command.Group>
              </Command.List>
              <div className="border-t border-white/10 px-3 py-2 flex items-center gap-4 text-[10px] font-inter text-[#5A6577]">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigacija</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> odabir</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">⌘K</kbd> zatvori</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CmdItem({
  children,
  icon,
  onSelect,
  value,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  onSelect: () => void;
  value?: string;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-inter text-[#F5F0E6] cursor-pointer aria-selected:bg-[rgba(255,92,92,0.12)] aria-selected:text-[#FF8A8A] transition-colors"
    >
      <span className="text-[#9AA5B8] aria-selected:text-[#FF8A8A]">{icon}</span>
      <span className="flex-1 flex items-center gap-2">{children}</span>
      <ArrowRight className="w-3 h-3 opacity-50" />
    </Command.Item>
  );
}
