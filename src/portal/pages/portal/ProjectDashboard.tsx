import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, FolderOpen, FileCheck2, AlertTriangle } from "lucide-react";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { ProgressBar } from "@/portal/components/ui/progress-bar";
import { computeOverallProgress, computeSectionProgress } from "@/portal/lib/template";
import type { TemplateSchema } from "@/portal/types/template";

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  client_company: string | null;
  template_slug: string;
}

interface ResponseRow {
  section_key: string;
  field_key: string;
  value_jsonb: unknown;
}

export default function ProjectDashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [schema, setSchema] = useState<TemplateSchema | null>(null);
  const [responses, setResponses] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data: pj, error: pjErr } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, client_company, template_slug")
        .eq("slug", slug)
        .single();
      if (pjErr || !pj) {
        setError(pjErr?.message ?? "Project not found");
        setLoading(false);
        return;
      }
      const projectRow = pj as ProjectRow;
      setProject(projectRow);

      const { data: tpl, error: tplErr } = await supabase
        .from("intake_templates")
        .select("schema_jsonb")
        .eq("slug", projectRow.template_slug)
        .single();
      if (tplErr || !tpl) {
        setError("Template not found");
        setLoading(false);
        return;
      }
      setSchema(tpl.schema_jsonb as unknown as TemplateSchema);

      const { data: resp } = await supabase
        .from("intake_responses")
        .select("section_key, field_key, value_jsonb")
        .eq("project_id", projectRow.id);
      const grouped: Record<string, Record<string, unknown>> = {};
      (resp ?? []).forEach((r) => {
        const row = r as ResponseRow;
        if (!grouped[row.section_key]) grouped[row.section_key] = {};
        grouped[row.section_key][row.field_key] = row.value_jsonb;
      });
      setResponses(grouped);
      setLoading(false);
    };
    load();
  }, [slug]);

  const overall = useMemo(() => {
    if (!schema) return null;
    return computeOverallProgress(schema, responses);
  }, [schema, responses]);

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground">Loading project…</div>
      </AppShell>
    );
  }

  if (error || !project || !schema || !overall) {
    return (
      <AppShell>
        <div className="text-destructive">Error: {error ?? "Unknown"}</div>
      </AppShell>
    );
  }

  const canSubmit = overall.criticalMissing === 0 && overall.completed === overall.total;

  return (
    <AppShell>
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/reports/portal" className="text-xs text-muted-foreground hover:text-accent">
            ← All projects
          </Link>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-primary">
            {project.display_name}
          </h1>
          {project.client_company && (
            <p className="mt-1 text-muted-foreground">{project.client_company}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to={`/reports/portal/p/${slug}/assets`}>
              <FolderOpen className="h-4 w-4" />
              Assets
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to={`/reports/portal/p/${slug}/review`}>
              <FileCheck2 className="h-4 w-4" />
              Review
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-6 border-accent/20 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Overall progress</CardTitle>
            <div className="font-heading text-3xl font-bold text-accent">{overall.pct}%</div>
          </div>
          <CardDescription>
            {overall.completed} of {overall.total} fields completed
            {overall.criticalMissing > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                {overall.criticalMissing} critical
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall.pct} />
          {canSubmit && project.status !== "submitted" && (
            <div className="mt-4 flex justify-end">
              <Button asChild variant="coral">
                <Link to={`/reports/portal/p/${slug}/review`}>
                  Submit for review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {schema.sections.map((section, i) => {
          const sub = computeSectionProgress(section, responses[section.key] || {});
          const pct = sub.fields_total === 0 ? 0 : Math.round((sub.fields_completed / sub.fields_total) * 100);
          const done = sub.fields_completed === sub.fields_total && sub.fields_total > 0;
          return (
            <Link
              key={section.key}
              to={`/reports/portal/p/${slug}/section/${section.key}`}
              className="group block"
            >
              <Card className="transition-all hover:border-accent/40 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex-shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{i + 1}.</span>
                      <h3 className="font-heading font-semibold text-primary group-hover:text-accent">
                        {section.title}
                      </h3>
                      {sub.fields_critical_missing > 0 && (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                          {sub.fields_critical_missing} critical
                        </span>
                      )}
                    </div>
                    {section.description && (
                      <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3">
                      <ProgressBar value={pct} className="flex-1" />
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {sub.fields_completed}/{sub.fields_total}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
