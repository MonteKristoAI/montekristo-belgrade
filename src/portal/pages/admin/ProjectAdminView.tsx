import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FolderOpen, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { ProgressBar } from "@/portal/components/ui/progress-bar";
import { computeOverallProgress, isFieldFilled } from "@/portal/lib/template";
import { formatRelative } from "@/portal/lib/utils";
import type { TemplateSchema } from "@/portal/types/template";

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  template_slug: string;
  client_company: string | null;
  invited_email: string | null;
  created_at: string;
  submitted_at: string | null;
}

interface AssetRow {
  id: string;
  category: string;
  storage_path: string;
  original_filename: string;
  size_bytes: number;
  uploaded_at: string;
}

export default function ProjectAdminView() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [schema, setSchema] = useState<TemplateSchema | null>(null);
  const [responses, setResponses] = useState<Record<string, Record<string, unknown>>>({});
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const { data: pj } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, template_slug, client_company, invited_email, created_at, submitted_at")
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

      const { data: asset } = await supabase
        .from("intake_assets")
        .select("*")
        .eq("project_id", projectRow.id)
        .order("uploaded_at", { ascending: false });
      setAssets((asset ?? []) as AssetRow[]);

      setLoading(false);
    };
    load();
  }, [slug]);

  const overall = useMemo(
    () => (schema ? computeOverallProgress(schema, responses) : null),
    [schema, responses]
  );

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
        <div className="text-destructive">Project not found.</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-6">
        <Link
          to="/reports/portal/admin"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All projects
        </Link>
      </div>

      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
            <ShieldCheck className="h-3.5 w-3.5" />
            Admin view · {project.status}
          </div>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-primary">
            {project.display_name}
          </h1>
          {project.client_company && (
            <p className="text-muted-foreground">{project.client_company}</p>
          )}
          {project.invited_email && (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {project.invited_email}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Completion</CardDescription>
            <CardTitle className="text-3xl">{overall.pct}%</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar value={overall.pct} />
            <div className="mt-2 text-xs text-muted-foreground">
              {overall.completed} / {overall.total} fields
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Critical missing</CardDescription>
            <CardTitle className={`text-3xl ${overall.criticalMissing > 0 ? "text-destructive" : "text-emerald-600"}`}>
              {overall.criticalMissing}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Critical fields needed before kick-off.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Assets uploaded</CardDescription>
            <CardTitle className="text-3xl">{assets.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {assets.length === 0 ? "No assets yet." : `Last upload ${formatRelative(assets[0].uploaded_at)}`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Button asChild variant="outline">
          <Link to={`/reports/portal/p/${slug}`}>Open client view</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to={`/reports/portal/p/${slug}/review`}>
            <FolderOpen className="h-4 w-4" />
            Review submission
          </Link>
        </Button>
      </div>

      <div className="mt-8 space-y-4">
        {schema.sections.map((s, i) => (
          <Card key={s.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  <span className="font-mono text-xs text-muted-foreground mr-2">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {s.fields.map((f) => {
                  const v = responses[s.key]?.[f.key];
                  const filled = isFieldFilled(f, v);
                  return (
                    <div key={f.key} className="text-sm">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {f.label}
                        {f.critical && <span className="ml-2 text-accent">●</span>}
                      </dt>
                      <dd className="mt-0.5">
                        {filled ? (
                          <span className="text-foreground break-words">
                            {typeof v === "object" ? JSON.stringify(v) : String(v)}
                          </span>
                        ) : (
                          <span className="italic text-muted-foreground">— blank —</span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
