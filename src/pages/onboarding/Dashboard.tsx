import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAllClientsWithSignals, type ClientWithSignals } from "@/lib/mk-onboarding/useClientData";
import { SERVICE_LINES, theme, statusMeta } from "./theme";
import {
  Surface,
  StatBlock,
  Pill,
  StatusPill,
  HealthRing,
  Sparkline,
  Skeleton,
  inputCls,
  EmptyState,
} from "./components/primitives";
import { TrendingUp, Activity, Zap, Users, ArrowUpRight, Grid3x3, Search, Clock } from "lucide-react";
import { mkSupabase } from "@/lib/mk-onboarding/supabase";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { data: clients = [], isLoading } = useAllClientsWithSignals();
  const { data: activity = [] } = useActivityFeed();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sort, setSort] = useState<"alpha" | "health" | "activity">("activity");

  const kpis = useMemo(() => {
    const act = clients.filter((c) => c.status === "active").length;
    const inProgress = clients.reduce((s, c) => s + c.signals.inProgress, 0);
    const blocked = clients.reduce((s, c) => s + c.signals.blockers, 0);
    const avgHealth = clients.length
      ? Math.round(clients.reduce((s, c) => s + c.signals.healthScore, 0) / clients.length)
      : 0;
    return { act, inProgress, blocked, avgHealth };
  }, [clients]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let arr = clients.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        c.name.toLowerCase().includes(needle) ||
        (c.industry ?? "").toLowerCase().includes(needle) ||
        c.slug.toLowerCase().includes(needle)
      );
    });
    arr = [...arr].sort((a, b) => {
      if (sort === "alpha") return a.name.localeCompare(b.name);
      if (sort === "health") return b.signals.healthScore - a.signals.healthScore;
      return a.signals.daysSinceLastActivity - b.signals.daysSinceLastActivity;
    });
    return arr;
  }, [clients, q, statusFilter, sort]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-poppins text-3xl font-semibold text-[#F5F0E6] tracking-tight leading-tight"
        >
          Command Center
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="font-inter text-sm text-[#9AA5B8] mt-1"
        >
          360-stepen kontekst za svakog klijenta. AI-powered rast i automatizacija.
        </motion.p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBlock label="Aktivnih klijenata" value={kpis.act} hint="ukljucujuci pre-launch" />
        <StatBlock label="Deliverables u toku" value={kpis.inProgress} hint="in-progress + review" />
        <StatBlock label="Blokera" value={kpis.blocked} hint="zahteva akciju" />
        <StatBlock label="Prosecan health" value={`${kpis.avgHealth}`} hint="0-100 skala" />
      </div>

      {/* Two columns: portfolio heatmap + activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioMiniHeatmap clients={clients} />
        </div>
        <ActivityFeed activity={activity} />
      </div>

      {/* Search + filters */}
      <Surface className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6577]" />
            <input
              placeholder="Pretrazi po imenu, industriji, slug-u…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {["all", "active", "onboarding", "prelaunch", "paused", "rescue"].map((s) => (
              <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                {s === "all" ? "Sve" : statusMeta(s).label}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-1 border-l border-white/10 pl-3 ml-1">
            <span className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] mr-1">Sort</span>
            <Chip active={sort === "activity"} onClick={() => setSort("activity")}>Aktivnost</Chip>
            <Chip active={sort === "health"} onClick={() => setSort("health")}>Health</Chip>
            <Chip active={sort === "alpha"} onClick={() => setSort("alpha")}>A-Z</Chip>
          </div>
        </div>
      </Surface>

      {/* Client grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Surface className="p-0">
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="Nema klijenata za ovaj filter"
            hint="Promeni filter ili dodaj novog klijenta."
          />
        </Surface>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-md text-[11px] font-inter transition-colors ${
        active
          ? "bg-[rgba(255,92,92,0.12)] text-[#FF8A8A] border border-[rgba(255,92,92,0.3)]"
          : "bg-white/5 text-[#9AA5B8] border border-white/10 hover:text-[#F5F0E6] hover:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

function PortfolioMiniHeatmap({ clients }: { clients: ClientWithSignals[] }) {
  return (
    <Surface className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-poppins text-[15px] font-semibold text-[#F5F0E6] tracking-tight">
            Portfolio heatmap
          </h2>
          <p className="font-inter text-xs text-[#9AA5B8] mt-1">
            Servisi po klijentu. Klikni celiju za skok u profil.
          </p>
        </div>
        <Link
          to="/onboarding/portfolio"
          className="inline-flex items-center gap-1 font-inter text-xs text-[#FF8A8A] hover:text-[#FF5C5C] transition-colors"
        >
          Open full view <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left sticky left-0 bg-[#0B1325] z-10"></th>
              {SERVICE_LINES.map((s) => (
                <th
                  key={s.key}
                  className="font-inter text-[9px] uppercase tracking-wider text-[#5A6577] font-medium px-1 pb-2 text-center min-w-[34px]"
                >
                  {s.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.slice(0, 10).map((c) => (
              <tr key={c.id}>
                <td className="pr-2 sticky left-0 bg-[#0B1325] z-10">
                  <Link
                    to={`/onboarding/${c.slug}`}
                    className="font-inter text-xs text-[#F5F0E6] hover:text-[#FF8A8A] transition-colors whitespace-nowrap max-w-[150px] inline-block truncate"
                  >
                    {c.name}
                  </Link>
                </td>
                {SERVICE_LINES.map((s) => {
                  const active = (c.service_lines as Record<string, boolean>)[s.key];
                  return (
                    <td key={s.key} className="p-0.5">
                      <Link
                        to={`/onboarding/${c.slug}`}
                        className={`block w-full aspect-square rounded-sm transition-all ${
                          active
                            ? "bg-[rgba(255,92,92,0.6)] hover:bg-[#FF5C5C] shadow-[0_0_0_1px_rgba(255,92,92,0.3)]"
                            : "bg-white/5 hover:bg-white/10"
                        }`}
                        title={`${c.name} — ${s.label}${active ? " (aktivan)" : ""}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
        <span className="font-inter text-[10px] text-[#5A6577] uppercase tracking-wider">Legenda:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-[rgba(255,92,92,0.6)]"></div>
          <span className="font-inter text-[10px] text-[#9AA5B8]">aktivan servis</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-white/5"></div>
          <span className="font-inter text-[10px] text-[#9AA5B8]">nije ukljucen</span>
        </div>
      </div>
    </Surface>
  );
}

function useActivityFeed() {
  return useQuery({
    queryKey: ["mk-activity"],
    queryFn: async () => {
      const { data } = await mkSupabase
        .from("mk_client_update_log")
        .select("id, table_name, operation, changed_at, changed_fields, client_id")
        .order("changed_at", { ascending: false })
        .limit(20);
      const ids = Array.from(new Set((data ?? []).map((d: any) => d.client_id).filter(Boolean)));
      const { data: clients } = await mkSupabase.from("mk_clients").select("id, name, slug").in("id", ids);
      const clientMap = new Map((clients ?? []).map((c: any) => [c.id, c]));
      return (data ?? []).map((d: any) => ({ ...d, client: clientMap.get(d.client_id) }));
    },
    staleTime: 30_000,
  });
}

function ActivityFeed({ activity }: { activity: any[] }) {
  return (
    <Surface className="p-6 max-h-[420px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-[#9AA5B8]" />
        <h2 className="font-poppins text-[15px] font-semibold text-[#F5F0E6] tracking-tight">
          Nedavna aktivnost
        </h2>
      </div>
      {activity.length === 0 ? (
        <EmptyState icon={<Clock className="w-8 h-8" />} title="Jos nema zapisa" />
      ) : (
        <ul className="space-y-3">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <span
                className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                  a.operation === "INSERT"
                    ? "bg-[#3FB97D]"
                    : a.operation === "DELETE"
                    ? "bg-[#FF5C5C]"
                    : "bg-[#4FB3E8]"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="font-inter text-xs text-[#F5F0E6] truncate">
                  <span className="text-[#9AA5B8]">{a.operation.toLowerCase()}</span>{" "}
                  <span className="text-[#F5F0E6]">{a.table_name.replace("mk_", "").replace("client_", "")}</span>
                  {a.client && (
                    <>
                      {" "}
                      <span className="text-[#5A6577]">→</span>{" "}
                      <Link
                        to={`/onboarding/${a.client.slug}`}
                        className="text-[#FF8A8A] hover:text-[#FF5C5C]"
                      >
                        {a.client.name}
                      </Link>
                    </>
                  )}
                </p>
                <p className="font-inter text-[10px] text-[#5A6577] mt-0.5">
                  {relativeTime(a.changed_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}

function ClientCard({ client }: { client: ClientWithSignals }) {
  const initials = client.name
    .replace(/[^a-zA-Z ]/g, "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeServices = SERVICE_LINES.filter(
    (s) => (client.service_lines as Record<string, boolean>)[s.key]
  );

  const topPerf = client.signals.recentPerf[0];

  return (
    <Link to={`/onboarding/${client.slug}`} className="block group">
      <Surface interactive className="p-5 h-full flex flex-col relative overflow-hidden">
        {/* Accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 opacity-70 group-hover:opacity-100 transition-opacity"
          style={{
            background: client.brand_color_primary ?? theme.accent.coralBase,
          }}
        />

        <div className="flex items-start gap-3 pl-1">
          <div
            className="w-11 h-11 rounded-lg flex items-center justify-center font-poppins font-bold text-sm text-white shrink-0 shadow-sm"
            style={{
              background: client.brand_color_primary
                ? `linear-gradient(135deg, ${client.brand_color_primary}, ${client.brand_color_primary}bb)`
                : "linear-gradient(135deg, #041122, #0B1325)",
            }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-poppins text-sm font-semibold text-[#F5F0E6] truncate tracking-tight">
              {client.name}
            </h3>
            <p className="font-inter text-[11px] text-[#9AA5B8] truncate mt-0.5">
              {client.industry ?? "—"}
              {client.location_country && <span className="text-[#5A6577]"> · {client.location_country}</span>}
            </p>
          </div>
          <HealthRing score={client.signals.healthScore} />
        </div>

        {client.one_line_positioning && (
          <p className="font-inter text-xs text-[#9AA5B8] mt-3 line-clamp-2 leading-relaxed pl-1">
            {client.one_line_positioning}
          </p>
        )}

        <div className="flex flex-wrap gap-1 mt-3 pl-1">
          {activeServices.length === 0 ? (
            <span className="font-inter text-[10px] text-[#5A6577]">Nema servisa postavljeno</span>
          ) : (
            activeServices.slice(0, 5).map((s) => (
              <Pill key={s.key} variant="neutral">
                {s.short}
              </Pill>
            ))
          )}
          {activeServices.length > 5 && <Pill variant="neutral">+{activeServices.length - 5}</Pill>}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 pl-1">
          <div className="flex items-center gap-3">
            <StatusPill status={client.status} />
            {client.signals.blockers > 0 && (
              <Pill variant="danger" icon={<Zap className="w-2.5 h-2.5" />}>
                {client.signals.blockers} block
              </Pill>
            )}
            {client.signals.inProgress > 0 && (
              <Pill variant="info">{client.signals.inProgress} wip</Pill>
            )}
          </div>
          {topPerf && topPerf.values.length >= 2 && (
            <div className="flex items-center gap-1">
              <Sparkline values={topPerf.values} />
              <TrendingUp className="w-3 h-3 text-[#9AA5B8]" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pl-1">
          <span className="font-inter text-[10px] text-[#5A6577]">
            {client.signals.daysSinceLastActivity === 0
              ? "Azurirano danas"
              : `pre ${client.signals.daysSinceLastActivity}d`}
          </span>
          <span className="font-inter text-[10px] text-[#5A6577] inline-flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Otvori <ArrowUpRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </Surface>
    </Link>
  );
}

function relativeTime(iso: string): string {
  const delta = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(delta / 1000);
  if (sec < 60) return `pre ${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `pre ${min}min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `pre ${hr}h`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `pre ${d}d`;
  return new Date(iso).toLocaleDateString();
}
