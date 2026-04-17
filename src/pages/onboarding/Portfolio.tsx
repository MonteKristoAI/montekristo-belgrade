import { Link } from "react-router-dom";
import { useAllClientsWithSignals, type ClientWithSignals } from "@/lib/mk-onboarding/useClientData";
import { SERVICE_LINES, healthTier, statusMeta } from "./theme";
import { Surface, HealthRing, StatusPill, Skeleton } from "./components/primitives";
import { ArrowUpRight } from "lucide-react";

export default function Portfolio() {
  const { data: clients = [], isLoading } = useAllClientsWithSignals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-poppins text-3xl font-semibold text-[#F5F0E6] tracking-tight">Portfolio heatmap</h1>
        <p className="font-inter text-sm text-[#9AA5B8] mt-1">
          Svi klijenti, svi servisi, na jednom ekranu. Boja celije: servis aktivan + relativni health.
        </p>
      </div>

      <Surface className="p-6 overflow-x-auto">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-1 min-w-[900px]">
            <thead>
              <tr>
                <th className="text-left sticky left-0 bg-[#0B1325] z-10 pb-3"></th>
                <th className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-2 pb-3 text-center">
                  Health
                </th>
                <th className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-2 pb-3 text-center">
                  Status
                </th>
                {SERVICE_LINES.map((s) => (
                  <th
                    key={s.key}
                    className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-1 pb-3 text-center"
                  >
                    {s.short}
                  </th>
                ))}
                <th className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-2 pb-3 text-right">
                  WIP
                </th>
                <th className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-2 pb-3 text-right">
                  Block
                </th>
                <th className="font-inter text-[10px] uppercase tracking-wider text-[#5A6577] font-medium px-2 pb-3 text-right">
                  Q
                </th>
                <th className="w-8 pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...clients]
                .sort((a, b) => b.signals.healthScore - a.signals.healthScore)
                .map((c) => (
                  <ClientRow key={c.id} client={c} />
                ))}
            </tbody>
          </table>
        )}
      </Surface>
    </div>
  );
}

function ClientRow({ client }: { client: ClientWithSignals }) {
  const tier = healthTier(client.signals.healthScore);
  return (
    <tr className="group">
      <td className="sticky left-0 bg-[#0B1325] group-hover:bg-[#0F1A33] z-10 transition-colors">
        <Link
          to={`/onboarding/${client.slug}`}
          className="inline-flex items-center gap-2 py-2 pr-3 font-inter text-sm text-[#F5F0E6] hover:text-[#FF8A8A] transition-colors"
        >
          <span
            className="w-2 h-8 rounded-full"
            style={{ background: client.brand_color_primary ?? "#2a3550" }}
          />
          <span className="max-w-[180px] truncate">{client.name}</span>
        </Link>
      </td>
      <td className="text-center px-2">
        <div className="inline-flex items-center justify-center">
          <HealthRing score={client.signals.healthScore} size={32} />
        </div>
      </td>
      <td className="text-center px-2">
        <StatusPill status={client.status} />
      </td>
      {SERVICE_LINES.map((s) => {
        const active = (client.service_lines as Record<string, boolean>)[s.key];
        return (
          <td key={s.key} className="p-0.5">
            <Link
              to={`/onboarding/${client.slug}`}
              className={`block w-full h-9 rounded-sm transition-all ${
                active
                  ? "hover:shadow-[0_0_0_1px_rgba(255,92,92,0.6)]"
                  : "bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
              style={
                active
                  ? {
                      background: tier.color,
                      opacity: 0.35 + (client.signals.healthScore / 100) * 0.5,
                    }
                  : undefined
              }
              title={`${client.name} — ${s.label}${active ? " ·  aktivan" : ""}`}
            />
          </td>
        );
      })}
      <td className="text-right px-2 font-inter text-xs tabular-nums text-[#F5F0E6]">
        {client.signals.inProgress || "—"}
      </td>
      <td
        className={`text-right px-2 font-inter text-xs tabular-nums ${
          client.signals.blockers > 0 ? "text-[#FF8A8A] font-semibold" : "text-[#5A6577]"
        }`}
      >
        {client.signals.blockers || "—"}
      </td>
      <td
        className={`text-right px-2 font-inter text-xs tabular-nums ${
          client.signals.openQuestions > 0 ? "text-[#F3CC78]" : "text-[#5A6577]"
        }`}
      >
        {client.signals.openQuestions || "—"}
      </td>
      <td className="text-right">
        <Link
          to={`/onboarding/${client.slug}`}
          className="inline-flex w-7 h-7 items-center justify-center text-[#5A6577] group-hover:text-[#FF8A8A] transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </td>
    </tr>
  );
}
