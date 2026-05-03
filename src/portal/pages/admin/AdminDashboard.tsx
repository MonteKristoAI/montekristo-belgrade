import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus, ShieldCheck } from "lucide-react";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { ProgressBar } from "@/portal/components/ui/progress-bar";
import { formatRelative } from "@/portal/lib/utils";

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  client_company: string | null;
  client_type: string;
  invited_email: string | null;
  created_at: string;
  submitted_at: string | null;
}

interface ProgressRow {
  project_id: string;
  completion_pct: number;
  fields_completed: number;
  fields_total: number;
  critical_missing: number;
  last_activity_at: string | null;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: pj } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, client_company, client_type, invited_email, created_at, submitted_at")
        .order("created_at", { ascending: false });

      const list = (pj ?? []) as ProjectRow[];
      setProjects(list);

      if (list.length) {
        const { data: pg } = await supabase
          .from("project_completion_v")
          .select("*")
          .in("project_id", list.map((p) => p.id));
        const map: Record<string, ProgressRow> = {};
        (pg ?? []).forEach((r) => {
          const row = r as ProgressRow;
          map[row.project_id] = row;
        });
        setProgressMap(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            MK Admin
          </div>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-primary">All projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage client onboarding intakes across the studio.
          </p>
        </div>
        <Button asChild variant="coral">
          <Link to="/reports/portal/admin/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : projects.length === 0 ? (
        <Card className="bg-card/50 p-12 text-center">
          <h2 className="font-heading text-xl font-semibold text-primary">No projects yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create the first one to invite a client.
          </p>
          <Button asChild variant="coral" className="mt-4">
            <Link to="/reports/portal/admin/new">Create project</Link>
          </Button>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active projects</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Progress</th>
                  <th className="p-3 text-left">Last activity</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  const pg = progressMap[p.id];
                  const pct = Number(pg?.completion_pct ?? 0);
                  return (
                    <tr key={p.id} className="border-t hover:bg-secondary/30">
                      <td className="p-3">
                        <Link to={`/reports/portal/admin/p/${p.slug}`} className="font-medium text-primary hover:text-accent">
                          {p.display_name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {p.client_company} · {p.invited_email}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 w-48">
                        <ProgressBar value={pct} />
                        <div className="mt-1 text-xs text-muted-foreground">
                          {pg?.fields_completed ?? 0}/{pg?.fields_total ?? 0}
                          {pg?.critical_missing && pg.critical_missing > 0 ? (
                            <span className="ml-2 text-destructive">
                              {pg.critical_missing} critical
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {formatRelative(pg?.last_activity_at ?? p.created_at)}
                      </td>
                      <td className="p-3">
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/reports/portal/admin/p/${p.slug}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </AppShell>
  );
}
