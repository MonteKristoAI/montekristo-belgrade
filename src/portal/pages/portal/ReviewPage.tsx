import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { ProgressBar } from "@/portal/components/ui/progress-bar";
import { computeOverallProgress, computeSectionProgress, isFieldFilled } from "@/portal/lib/template";
import type { TemplateSchema } from "@/portal/types/template";

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  template_slug: string;
  client_company: string | null;
}

export default function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [schema, setSchema] = useState<TemplateSchema | null>(null);
  const [responses, setResponses] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data: pj } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, template_slug, client_company")
        .eq("slug", slug)
        .single();
      if (!pj) {
        setLoading(false);
        return;
      }
      const projectRow = pj as ProjectRow;
      setProject(projectRow);

      const { data: tpl } = await supabase
        .from("intake_templates")
        .select("schema_jsonb")
        .eq("slug", projectRow.template_slug)
        .single();
      if (tpl) setSchema(tpl.schema_jsonb as unknown as TemplateSchema);

      const { data: resp } = await supabase
        .from("intake_responses")
        .select("section_key, field_key, value_jsonb")
        .eq("project_id", projectRow.id);
      const grouped: Record<string, Record<string, unknown>> = {};
      (resp ?? []).forEach((r) => {
        const sk = r.section_key as string;
        if (!grouped[sk]) grouped[sk] = {};
        grouped[sk][r.field_key as string] = r.value_jsonb;
      });
      setResponses(grouped);
      setLoading(false);
    };
    load();
  }, [slug]);

  const overall = useMemo(
    () => (schema ? computeOverallProgress(schema, responses) : null),
    [schema, responses]
  );

  const handleSubmit = async () => {
    if (!project) return;
    setSubmitting(true);
    const { error } = await supabase.rpc("submit_for_review", { p_project_id: project.id });
    setSubmitting(false);
    if (error) {
      toast.error("Submit failed", { description: error.message });
      return;
    }
    toast.success("Submitted for review", {
      description: "MonteKristo will follow up shortly.",
    });
    navigate(`/reports/portal/p/${slug}`);
  };

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }

  if (!project || !schema || !overall) {
    return (
      <AppShell>
        <div className="text-destructive">Couldn't load project.</div>
      </AppShell>
    );
  }

  const canSubmit = overall.criticalMissing === 0 && overall.completed === overall.total;
  const alreadySubmitted = ["submitted", "reviewed", "approved"].includes(project.status);

  return (
    <AppShell>
      <div className="mb-6">
        <Link
          to={`/reports/portal/p/${slug}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {project.display_name}
        </Link>
      </div>

      <h1 className="font-heading text-3xl font-semibold text-primary">Review & submit</h1>
      <p className="mt-1 mb-6 text-muted-foreground">
        Review your responses below. You can still edit any section until you submit.
      </p>

      <Card className="mb-6 border-accent/20 bg-gradient-to-br from-card to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Submission readiness</CardTitle>
            <span className="font-heading text-3xl font-bold text-accent">{overall.pct}%</span>
          </div>
          <CardDescription>
            {overall.completed} of {overall.total} fields filled.{" "}
            {overall.criticalMissing > 0 ? (
              <span className="text-destructive">
                {overall.criticalMissing} critical field{overall.criticalMissing === 1 ? "" : "s"}{" "}
                remaining.
              </span>
            ) : (
              <span className="text-emerald-600">All critical fields filled.</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar value={overall.pct} />
          <div className="mt-4 flex items-center justify-end gap-3">
            {alreadySubmitted ? (
              <span className="text-sm text-emerald-600">
                <CheckCircle2 className="mr-1 inline h-4 w-4" />
                Already submitted
              </span>
            ) : (
              <Button
                variant="coral"
                size="lg"
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting…" : "Submit for review"}
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {schema.sections.map((section, i) => {
          const r = responses[section.key] || {};
          const sub = computeSectionProgress(section, r);
          const pct = sub.fields_total === 0 ? 0 : Math.round((sub.fields_completed / sub.fields_total) * 100);
          return (
            <Card key={section.key}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {pct === 100 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : sub.fields_critical_missing > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : null}
                    <span className="text-sm text-muted-foreground">{pct}%</span>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/reports/portal/p/${slug}/section/${section.key}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProgressBar value={pct} className="mb-4" />
                <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {section.fields.map((f) => (
                    <div key={f.key} className="text-sm">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {f.label}
                        {f.required && <span className="ml-1 text-destructive">*</span>}
                      </dt>
                      <dd className="mt-0.5 text-foreground">
                        {isFieldFilled(f, r[f.key]) ? renderValue(r[f.key]) : (
                          <span className="text-muted-foreground italic">Not filled</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}

function renderValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (typeof value[0] === "string") return (value as string[]).join(", ");
    return `${value.length} entries`;
  }
  if (typeof value === "object") return JSON.stringify(value).slice(0, 80) + "…";
  return String(value);
}
