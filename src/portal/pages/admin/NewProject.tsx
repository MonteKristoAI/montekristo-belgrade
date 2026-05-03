import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { Input } from "@/portal/components/ui/input";
import { Label } from "@/portal/components/ui/label";
import { slugify } from "@/portal/lib/utils";

export default function NewProjectPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onNameChange = (v: string) => {
    setName(v);
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(v));
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !email.trim()) return;
    setSubmitting(true);
    const { data, error } = await supabase.rpc("create_project_with_owner", {
      p_slug: slug.trim(),
      p_display_name: name.trim(),
      p_template_slug: "fitness-studio-v1",
      p_client_type: "fitness_studio",
      p_invited_email: email.trim(),
      p_client_company: company.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't create project", { description: error.message });
      return;
    }
    toast.success("Project created", {
      description: "Send the invite link to your client to begin.",
    });
    console.log("New project id:", data);
    navigate(`/reports/portal/admin/p/${slug}`);
  };

  return (
    <AppShell>
      <div className="mb-6">
        <Link
          to="/reports/portal/admin"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to admin
        </Link>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>New project</CardTitle>
          <CardDescription>
            Creates a fitness-studio onboarding intake. Client receives a magic-link invite to fill it out.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Project / studio display name</Label>
              <Input
                id="name"
                placeholder="e.g. Luxe Fitness Buckhead"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL slug</Label>
              <Input
                id="slug"
                placeholder="luxe-fitness-buckhead"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">
                montekristobelgrade.com/reports/p/{slug || "your-slug"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Legal company name (optional)</Label>
              <Input
                id="company"
                placeholder="Luxe Fitness LLC"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Client primary contact email</Label>
              <Input
                id="email"
                type="email"
                placeholder="owner@luxefitness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                We&apos;ll send them a magic-link invite. They&apos;ll see only their own intake.
              </p>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="coral" disabled={submitting}>
                {submitting ? "Creating…" : "Create project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
