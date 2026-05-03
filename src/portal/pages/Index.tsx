import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, FileText } from "lucide-react";
import { supabase } from "@/portal/integrations/supabase/client";
import { useAuth } from "@/portal/lib/auth";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/portal/components/ui/card";
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
  template_slug: string;
  updated_at: string;
}

interface ProgressRow {
  project_id: string;
  completion_pct: number;
  fields_completed: number;
  fields_total: number;
  last_activity_at: string | null;
}

export default function IndexPage() {
  const { user, isMkAdmin } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [progressByProject, setProgressByProject] = useState<Record<string, ProgressRow>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: pj, error } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, client_company, client_type, template_slug, updated_at")
        .order("updated_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const projectList = (pj ?? []) as ProjectRow[];
      setProjects(projectList);

      if (projectList.length) {
        const ids = projectList.map((p) => p.id);
        const { data: pg } = await supabase
          .from("project_completion_v")
          .select("*")
          .in("project_id", ids);

        const map: Record<string, ProgressRow> = {};
        (pg ?? []).forEach((r) => {
          const row = r as ProgressRow;
          map[row.project_id] = row;
        });
        setProgressByProject(map);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-primary">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isMkAdmin
            ? "Your active client onboarding projects."
            : "Continue your project intake. We auto-save every change."}
        </p>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : projects.length === 0 ? (
        <EmptyState isMkAdmin={isMkAdmin} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const pg = progressByProject[p.id];
            return (
              <Card key={p.id} className="transition-all hover:border-accent/40 hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-accent" />
                      <CardTitle className="text-lg">{p.display_name}</CardTitle>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  {p.client_company && (
                    <CardDescription>{p.client_company}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {pg?.fields_completed ?? 0} of {pg?.fields_total ?? "?"} fields
                      </span>
                      <span>{pg?.completion_pct ?? 0}%</span>
                    </div>
                    <ProgressBar value={Number(pg?.completion_pct ?? 0)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Last edited {formatRelative(pg?.last_activity_at ?? p.updated_at)}
                    </div>
                    <Button asChild variant="coral" size="sm">
                      <Link to={`/reports/portal/p/${p.slug}`}>
                        Continue
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Draft", cls: "bg-muted text-muted-foreground" },
    in_progress: { label: "In progress", cls: "bg-accent/10 text-accent" },
    submitted: { label: "Submitted", cls: "bg-primary/10 text-primary" },
    reviewed: { label: "Reviewed", cls: "bg-emerald-100 text-emerald-700" },
    approved: { label: "Approved", cls: "bg-emerald-100 text-emerald-700" },
    archived: { label: "Archived", cls: "bg-muted text-muted-foreground" },
  };
  const m = map[status] ?? { label: status, cls: "bg-muted text-muted-foreground" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${m.cls}`}>{m.label}</span>
  );
}

function EmptyState({ isMkAdmin }: { isMkAdmin: boolean }) {
  return (
    <Card className="bg-card/50 p-12 text-center">
      <h2 className="font-heading text-xl font-semibold text-primary">No projects yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isMkAdmin
          ? "Create a new project from the admin dashboard to begin."
          : "When MonteKristo invites you to an engagement, your project will appear here."}
      </p>
      {isMkAdmin && (
        <Button asChild variant="coral" className="mt-4">
          <Link to="/reports/portal/admin">Open admin</Link>
        </Button>
      )}
    </Card>
  );
}
