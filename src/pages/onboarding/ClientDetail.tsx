import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles, ArrowLeft, ClipboardList } from "lucide-react";
import { useClientBySlug, useAllClientsWithSignals } from "@/lib/mk-onboarding/useClientData";
import { Surface, StatusPill, HealthRing, Pill, Skeleton } from "./components/primitives";
import { AIChatPanel } from "./components/AIChatPanel";
import OverviewTab from "./tabs/OverviewTab";
import BusinessTab from "./tabs/BusinessTab";
import WebPresenceTab from "./tabs/WebPresenceTab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import DeliverablesTab from "./tabs/DeliverablesTab";
import BrandVoiceTab from "./tabs/BrandVoiceTab";
import ContactsTab from "./tabs/ContactsTab";
import DocumentsTab from "./tabs/DocumentsTab";
import PerformanceTab from "./tabs/PerformanceTab";
import OpenQuestionsTab from "./tabs/OpenQuestionsTab";
import ActivityTab from "./tabs/ActivityTab";
import MeetingPrepTab from "./tabs/MeetingPrepTab";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "business", label: "Biznis & Marketing" },
  { key: "web", label: "Web presence" },
  { key: "integrations", label: "Integracije" },
  { key: "deliverables", label: "Deliverables" },
  { key: "voice", label: "Brand voice" },
  { key: "contacts", label: "Kontakti" },
  { key: "docs", label: "Dokumenti" },
  { key: "performance", label: "Performance" },
  { key: "questions", label: "Pitanja" },
  { key: "activity", label: "Activity" },
  { key: "prep", label: "Meeting Prep" },
] as const;

export default function ClientDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: client, isLoading, refetch } = useClientBySlug(slug);
  const { data: allClients = [] } = useAllClientsWithSignals();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatOpen, setChatOpen] = useState(false);

  const tab = searchParams.get("tab") ?? "overview";
  const setTab = (t: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  };

  const signals = useMemo(() => {
    if (!client) return null;
    const found = allClients.find((c) => c.id === client.id);
    return found?.signals ?? null;
  }, [allClients, client]);

  if (isLoading || !client) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-[420px]" />
      </div>
    );
  }

  const initials = client.name
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accent = client.brand_color_primary ?? "#FF5C5C";

  return (
    <div className="space-y-6">
      <Link
        to="/onboarding"
        className="inline-flex items-center gap-1.5 font-inter text-xs text-[#9AA5B8] hover:text-[#F5F0E6] transition-colors"
      >
        <ArrowLeft className="w-3 h-3" /> Svi klijenti
      </Link>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1325]"
      >
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background: `radial-gradient(600px 200px at 0% 0%, ${accent}, transparent), radial-gradient(600px 220px at 100% 100%, ${accent}, transparent)`,
          }}
        />
        <div className="relative p-7">
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center font-poppins font-bold text-xl text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
              }}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="font-poppins text-2xl font-semibold text-[#F5F0E6] tracking-tight">
                  {client.name}
                </h1>
                <StatusPill status={client.status} />
                {client.industry && <Pill variant="neutral">{client.industry}</Pill>}
              </div>
              {client.one_line_positioning && (
                <p className="font-inter text-sm text-[#9AA5B8] mt-2 leading-relaxed max-w-3xl">
                  {client.one_line_positioning}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 mt-4 font-inter text-xs text-[#9AA5B8]">
                {client.website_url && (
                  <a
                    href={client.website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[#F5F0E6] transition-colors"
                  >
                    {client.website_url.replace(/^https?:\/\//, "")}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {client.location_country && <span>· {client.location_country}</span>}
                {client.monthly_retainer_usd && (
                  <span>
                    · <span className="text-[#FF8A8A] font-semibold">${client.monthly_retainer_usd}</span>/mo
                  </span>
                )}
              </div>
            </div>

            {signals && (
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577]">Health</p>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <HealthRing score={signals.healthScore} size={52} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <MiniStat label="Deliverables (wip)" value={signals?.inProgress ?? 0} accent />
            <MiniStat
              label="Blokera"
              value={signals?.blockers ?? 0}
              accent={false}
              danger={(signals?.blockers ?? 0) > 0}
            />
            <MiniStat label="Otvorenih pitanja" value={signals?.openQuestions ?? 0} />
            <MiniStat
              label="Dana bez ship-a"
              value={signals?.daysSinceLastShip ?? "—"}
            />
          </div>

          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setChatOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#FF5C5C] to-[#E04848] text-white font-inter text-xs font-medium shadow-[0_6px_16px_-6px_rgba(255,92,92,0.6)] hover:shadow-[0_10px_24px_-6px_rgba(255,92,92,0.8)] transition-shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI co-pilot
            </button>
            <button
              onClick={() => setTab("business")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F5F0E6] font-inter text-xs hover:bg-white/10 transition-colors"
            >
              Growth ideas
            </button>
            <button
              onClick={() => setTab("prep")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-[#F5F0E6] font-inter text-xs hover:bg-white/10 transition-colors"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Meeting prep
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-white/10 overflow-x-auto -mx-8 px-8">
        <nav className="flex items-center gap-1 min-w-max">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-3.5 py-3 font-inter text-xs transition-colors whitespace-nowrap ${
                tab === t.key ? "text-[#F5F0E6]" : "text-[#9AA5B8] hover:text-[#F5F0E6]"
              }`}
            >
              {t.label}
              {tab === t.key && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-3 right-3 bottom-0 h-0.5 bg-[#FF5C5C] rounded-t-full"
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {tab === "overview" && <OverviewTab client={client} onChange={refetch} />}
        {tab === "business" && <BusinessTab client={client} />}
        {tab === "web" && <WebPresenceTab client={client} />}
        {tab === "integrations" && <IntegrationsTab client={client} />}
        {tab === "deliverables" && <DeliverablesTab client={client} />}
        {tab === "voice" && <BrandVoiceTab client={client} />}
        {tab === "contacts" && <ContactsTab client={client} />}
        {tab === "docs" && <DocumentsTab client={client} />}
        {tab === "performance" && <PerformanceTab client={client} />}
        {tab === "questions" && <OpenQuestionsTab client={client} />}
        {tab === "activity" && <ActivityTab client={client} />}
        {tab === "prep" && <MeetingPrepTab client={client} />}
      </div>

      <AIChatPanel client={client} open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

function MiniStat({ label, value, accent, danger }: { label: string; value: number | string; accent?: boolean; danger?: boolean }) {
  return (
    <div className="rounded-lg bg-white/[0.04] border border-white/5 px-4 py-3">
      <p className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577]">{label}</p>
      <p
        className={`font-poppins text-2xl font-semibold mt-1 tabular-nums leading-none ${
          danger ? "text-[#FF8A8A]" : accent ? "text-[#FF5C5C]" : "text-[#F5F0E6]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
