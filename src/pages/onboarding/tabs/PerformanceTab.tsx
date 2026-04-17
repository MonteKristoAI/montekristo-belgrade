import { useEffect, useMemo, useState } from "react";
import { mkSupabase, type MkClient } from "@/lib/mk-onboarding/supabase";
import { Section, inputCls } from "../components/primitives";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Plus, Trash2 } from "lucide-react";

type Snapshot = {
  id: string;
  client_id: string;
  week_ending_date: string;
  metric_kind: string;
  value_numeric: number | null;
  value_note: string | null;
  source: string | null;
};

export default function PerformanceTab({ client }: { client: MkClient }) {
  const [rows, setRows] = useState<Snapshot[]>([]);

  const load = async () => {
    const { data } = await mkSupabase
      .from("mk_client_performance_snapshots")
      .select("*")
      .eq("client_id", client.id)
      .order("week_ending_date", { ascending: false });
    setRows((data ?? []) as unknown as Snapshot[]);
  };
  useEffect(() => { load(); }, [client.id]);

  const add = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await mkSupabase.from("mk_client_performance_snapshots").insert({
      client_id: client.id, week_ending_date: today, metric_kind: "blog_posts_published", value_numeric: 0,
    });
    if (!error) load();
  };
  const update = async (id: string, fields: Partial<Snapshot>) => {
    const { error } = await mkSupabase.from("mk_client_performance_snapshots").update(fields).eq("id", id);
    if (!error) load();
  };
  const remove = async (id: string) => {
    if (!confirm("Obrisati?")) return;
    const { error } = await mkSupabase.from("mk_client_performance_snapshots").delete().eq("id", id);
    if (!error) load();
  };

  const groups = useMemo(() => {
    const map = new Map<string, Snapshot[]>();
    for (const r of rows) {
      const arr = map.get(r.metric_kind) ?? [];
      arr.push(r);
      map.set(r.metric_kind, arr);
    }
    return Array.from(map.entries()).map(([metric, items]) => ({
      metric,
      items: items.sort((a, b) => a.week_ending_date.localeCompare(b.week_ending_date)),
    }));
  }, [rows]);

  return (
    <Section
      title="Weekly performance"
      description="Jedan red = jedna metrika za jednu nedelju. Chartovi na vrhu, tabela ispod."
      action={
        <button onClick={add} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 text-[#F5F0E6] font-inter text-xs">
          <Plus className="w-3 h-3" /> Dodaj
        </button>
      }
    >
      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {groups.map((g) => (
            <MetricChart key={g.metric} metric={g.metric} items={g.items} />
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        {rows.length === 0 ? (
          <p className="font-inter text-sm text-[#5A6577] py-6 text-center">Jos nema snapshot-ova.</p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="grid grid-cols-1 md:grid-cols-[140px_1fr_120px_1fr_auto] gap-2 items-center border border-white/10 rounded-md p-2 bg-white/[0.02]">
              <input type="date" defaultValue={r.week_ending_date} onBlur={(e) => update(r.id, { week_ending_date: e.target.value })} className={`${inputCls} h-9 text-xs`} />
              <input defaultValue={r.metric_kind} onBlur={(e) => update(r.id, { metric_kind: e.target.value })} placeholder="metric_kind" className={`${inputCls} h-9 text-xs`} />
              <input type="number" defaultValue={r.value_numeric ?? ""} onBlur={(e) => update(r.id, { value_numeric: e.target.value ? Number(e.target.value) : null })} placeholder="value" className={`${inputCls} h-9 text-xs tabular-nums`} />
              <input defaultValue={r.value_note ?? ""} onBlur={(e) => update(r.id, { value_note: e.target.value || null })} placeholder="note / source" className={`${inputCls} h-9 text-xs`} />
              <button onClick={() => remove(r.id)} className="h-9 w-9 rounded-md text-[#FF8A8A] hover:bg-[rgba(255,92,92,0.1)] flex items-center justify-center">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}

function MetricChart({ metric, items }: { metric: string; items: Snapshot[] }) {
  const last = items[items.length - 1]?.value_numeric ?? 0;
  const first = items[0]?.value_numeric ?? 0;
  const delta = last - first;
  const data = items.map((i) => ({
    date: i.week_ending_date.slice(5),
    value: i.value_numeric ?? 0,
  }));
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-inter text-[10px] uppercase tracking-widest text-[#5A6577]">{metric}</span>
        <div className="flex items-baseline gap-2">
          <span className="font-poppins text-2xl font-semibold text-[#FF5C5C] tabular-nums leading-none">{last}</span>
          {delta !== 0 && (
            <span className={`font-inter text-[10px] ${delta > 0 ? "text-[#70D7A0]" : "text-[#FF8A8A]"}`}>
              {delta > 0 ? "+" : ""}{delta}
            </span>
          )}
        </div>
      </div>
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#5A6577" fontSize={10} />
            <YAxis stroke="#5A6577" fontSize={10} width={24} />
            <Tooltip
              contentStyle={{
                background: "#121E3B",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 11,
                color: "#F5F0E6",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#FF5C5C" strokeWidth={2} dot={{ r: 2, fill: "#FF5C5C" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
