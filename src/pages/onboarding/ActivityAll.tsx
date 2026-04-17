import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { mkSupabase } from "@/lib/mk-onboarding/supabase";
import { Surface, Pill, EmptyState, Skeleton } from "./components/primitives";
import { Activity } from "lucide-react";

type LogRow = {
  id: number;
  client_id: string | null;
  table_name: string;
  operation: string;
  changed_fields: any;
  changed_by: string | null;
  changed_at: string;
  client?: { name: string; slug: string } | null;
};

export default function ActivityAll() {
  const { data: rows = [], isLoading } = useQuery<LogRow[]>({
    queryKey: ["mk-activity-all"],
    queryFn: async () => {
      const { data } = await mkSupabase
        .from("mk_client_update_log")
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(200);
      const ids = Array.from(new Set((data ?? []).map((d: any) => d.client_id).filter(Boolean)));
      const { data: clients } = await mkSupabase.from("mk_clients").select("id, name, slug").in("id", ids);
      const clientMap = new Map((clients ?? []).map((c: any) => [c.id, c]));
      return (data ?? []).map((d: any) => ({ ...d, client: clientMap.get(d.client_id) ?? null }));
    },
    staleTime: 20_000,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-poppins text-3xl font-semibold text-[#F5F0E6] tracking-tight">Activity</h1>
        <p className="font-inter text-sm text-[#9AA5B8] mt-1">
          Immutable audit log svih izmena preko svih klijenata (200 poslednjih).
        </p>
      </div>

      <Surface className="p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState icon={<Activity className="w-10 h-10" />} title="Jos nema zapisa" />
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map((r) => (
              <li key={r.id} className="py-3 flex items-start gap-3">
                <Pill
                  variant={
                    r.operation === "INSERT"
                      ? "success"
                      : r.operation === "DELETE"
                      ? "danger"
                      : "info"
                  }
                >
                  {r.operation}
                </Pill>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-[#F5F0E6]">
                    <span className="text-[#9AA5B8]">{r.table_name.replace("mk_", "")}</span>
                    {r.client && (
                      <>
                        {" "}<span className="text-[#5A6577]">·</span>{" "}
                        <Link
                          to={`/onboarding/${r.client.slug}`}
                          className="text-[#FF8A8A] hover:text-[#FF5C5C] font-medium"
                        >
                          {r.client.name}
                        </Link>
                      </>
                    )}
                  </p>
                  {summarize(r) && (
                    <p className="font-inter text-xs text-[#9AA5B8] mt-0.5 line-clamp-1">
                      {summarize(r)}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-inter text-[11px] text-[#9AA5B8]">{new Date(r.changed_at).toLocaleString()}</p>
                  {r.changed_by && (
                    <p className="font-inter text-[10px] text-[#5A6577] mt-0.5">{r.changed_by}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Surface>
    </div>
  );
}

function summarize(r: LogRow): string | null {
  if (!r.changed_fields) return null;
  if (r.operation === "UPDATE" && r.changed_fields.before && r.changed_fields.after) {
    const before = r.changed_fields.before;
    const after = r.changed_fields.after;
    const diffs: string[] = [];
    for (const k of Object.keys(after)) {
      if (k === "updated_at") continue;
      if (JSON.stringify(before[k]) !== JSON.stringify(after[k])) {
        diffs.push(k);
      }
    }
    return diffs.length ? `polja: ${diffs.slice(0, 3).join(", ")}` : null;
  }
  const name = r.changed_fields.name ?? r.changed_fields.title ?? r.changed_fields.question ?? r.changed_fields.identifier_key;
  return name ? String(name).slice(0, 80) : null;
}
