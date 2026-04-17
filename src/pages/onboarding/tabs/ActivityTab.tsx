import { useEffect, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, Pill } from "../components/primitives";

type LogRow = {
  id: number;
  client_id: string | null;
  table_name: string;
  row_id: string | null;
  operation: string;
  changed_fields: any;
  changed_by: string | null;
  changed_at: string;
};

export default function ActivityTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await mkSupabase
        .from("mk_client_update_log")
        .select("*")
        .eq("client_id", client.id)
        .order("changed_at", { ascending: false })
        .limit(100);
      setRows((data ?? []) as unknown as LogRow[]);
      setLoading(false);
    })();
  }, [client.id]);

  return (
    <Section title="Aktivnost" description="Svaka izmena automatski se logira. Poslednjih 100.">
      {loading ? (
        <p className="font-inter text-sm text-[#5A6577]">Ucitavam…</p>
      ) : rows.length === 0 ? (
        <p className="font-inter text-sm text-[#5A6577] py-6 text-center">Jos nema zapisa.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((r) => {
            const summary = summarize(r);
            return (
              <div key={r.id} className="rounded-md border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Pill variant={r.operation === "INSERT" ? "success" : r.operation === "DELETE" ? "danger" : "info"}>
                        {r.operation}
                      </Pill>
                      <span className="font-inter text-xs text-[#F5F0E6] font-medium">{r.table_name.replace("mk_", "")}</span>
                      {r.changed_by && <span className="font-inter text-[10px] text-[#5A6577]">by {r.changed_by}</span>}
                    </div>
                    {summary && <p className="font-inter text-xs text-[#9AA5B8] mt-1 break-all">{summary}</p>}
                  </div>
                  <span className="font-inter text-[10px] text-[#5A6577] shrink-0">
                    {new Date(r.changed_at).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Section>
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
        const b = truncate(String(before[k] ?? "null"));
        const a = truncate(String(after[k] ?? "null"));
        diffs.push(`${k}: ${b} → ${a}`);
      }
    }
    return diffs.slice(0, 3).join(" · ");
  }
  const name = r.changed_fields.name ?? r.changed_fields.title ?? r.changed_fields.question ?? r.changed_fields.identifier_key;
  return name ? `Kreirano/obrisano: ${truncate(String(name))}` : null;
}

function truncate(s: string, max = 40) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}
