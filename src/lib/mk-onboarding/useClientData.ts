import { useQuery } from "@tanstack/react-query";
import { mkSupabase, type MkClient } from "./supabase";
import { computeHealth } from "./healthScore";

// ---------------------------------------------------------------
// Single client with all aggregate signals — for dashboard cards.
// ---------------------------------------------------------------
export type ClientSignals = {
  openQuestions: number;
  blockers: number;
  inProgress: number;
  shipped: number;
  daysSinceLastShip: number | null;
  daysSinceLastActivity: number;
  hasBrandVoice: boolean;
  hasIntegrations: boolean;
  hasPrimaryContact: boolean;
  performanceSnapshotsLast90d: number;
  recentPerf: Array<{ metric: string; values: number[] }>;
  healthScore: number;
};

export type ClientWithSignals = MkClient & { signals: ClientSignals };

async function loadAllSignals(): Promise<ClientWithSignals[]> {
  const now = Date.now();
  const ninetyDaysAgo = new Date(now - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [clients, deliverables, questions, brandVoice, integrations, contacts, perfSnapshots] =
    await Promise.all([
      mkSupabase.from("mk_clients").select("*"),
      mkSupabase.from("mk_client_deliverables").select("client_id, status, shipped_at, updated_at"),
      mkSupabase.from("mk_client_open_questions").select("client_id, answered_at"),
      mkSupabase.from("mk_client_brand_voice").select("client_id, tone_descriptors, banned_vocabulary"),
      mkSupabase.from("mk_client_integrations").select("client_id"),
      mkSupabase.from("mk_client_contacts").select("client_id, is_primary"),
      mkSupabase
        .from("mk_client_performance_snapshots")
        .select("client_id, metric_kind, value_numeric, week_ending_date")
        .gte("week_ending_date", ninetyDaysAgo)
        .order("week_ending_date", { ascending: true }),
    ]);

  const c = (clients.data ?? []) as unknown as MkClient[];
  return c.map((client) => {
    const ds = (deliverables.data ?? []).filter((d: any) => d.client_id === client.id);
    const qs = (questions.data ?? []).filter((q: any) => q.client_id === client.id);
    const bv = (brandVoice.data ?? []).find((b: any) => b.client_id === client.id);
    const ints = (integrations.data ?? []).filter((i: any) => i.client_id === client.id);
    const cs = (contacts.data ?? []).filter((c: any) => c.client_id === client.id);
    const perf = (perfSnapshots.data ?? []).filter((p: any) => p.client_id === client.id);

    const blockers = ds.filter((d: any) => d.status === "blocked").length;
    const inProgress = ds.filter((d: any) => d.status === "in_progress" || d.status === "review").length;
    const shipped = ds.filter((d: any) => d.status === "shipped");
    const shippedCount = shipped.length;

    const lastShipDate = shipped
      .map((d: any) => d.shipped_at ?? d.updated_at)
      .filter(Boolean)
      .sort()
      .reverse()[0];
    const daysSinceLastShip = lastShipDate
      ? Math.floor((now - new Date(lastShipDate).getTime()) / (24 * 60 * 60 * 1000))
      : null;

    const lastActivity = [
      client.updated_at,
      ...ds.map((d: any) => d.updated_at),
    ]
      .filter(Boolean)
      .sort()
      .reverse()[0];
    const daysSinceLastActivity = lastActivity
      ? Math.floor((now - new Date(lastActivity).getTime()) / (24 * 60 * 60 * 1000))
      : 999;

    const openQuestions = qs.filter((q: any) => !q.answered_at).length;

    // group perf by metric_kind
    const metricMap = new Map<string, number[]>();
    for (const p of perf) {
      if (p.value_numeric === null) continue;
      const arr = metricMap.get(p.metric_kind) ?? [];
      arr.push(Number(p.value_numeric));
      metricMap.set(p.metric_kind, arr);
    }
    const recentPerf = Array.from(metricMap.entries()).map(([metric, values]) => ({ metric, values }));

    const hasBrandVoice = Boolean(
      bv?.tone_descriptors?.length || bv?.banned_vocabulary?.length
    );

    const { score } = computeHealth({
      status: client.status,
      openQuestions,
      blockers,
      inProgress,
      shipped: shippedCount,
      daysSinceLastShip,
      daysSinceLastActivity,
      hasBrandVoice,
      hasIntegrations: ints.length > 0,
      hasPrimaryContact: cs.some((x: any) => x.is_primary),
      performanceSnapshotsLast90d: perf.length,
    });

    return {
      ...client,
      signals: {
        openQuestions,
        blockers,
        inProgress,
        shipped: shippedCount,
        daysSinceLastShip,
        daysSinceLastActivity,
        hasBrandVoice,
        hasIntegrations: ints.length > 0,
        hasPrimaryContact: cs.some((x: any) => x.is_primary),
        performanceSnapshotsLast90d: perf.length,
        recentPerf,
        healthScore: score,
      },
    };
  });
}

export function useAllClientsWithSignals() {
  return useQuery({
    queryKey: ["mk-clients-signals"],
    queryFn: loadAllSignals,
    staleTime: 30_000,
  });
}

export function useClientBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["mk-client", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await mkSupabase.from("mk_clients").select("*").eq("slug", slug).single();
      return data as unknown as MkClient;
    },
    enabled: !!slug,
  });
}
