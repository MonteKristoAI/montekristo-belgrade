import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams, useBeforeUnload } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft,
  FolderOpen,
  Trash2,
  Upload,
  FileImage,
  FileText,
  Film,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { formatRelative } from "@/portal/lib/utils";

const CATEGORIES = [
  { key: "01-Brand/logos", label: "Brand · Logos" },
  { key: "01-Brand/guide", label: "Brand · Guide & References" },
  { key: "02-Studio-Photos/interior", label: "Studio · Interior" },
  { key: "02-Studio-Photos/exterior", label: "Studio · Exterior" },
  { key: "02-Studio-Photos/classes", label: "Studio · Classes in Action" },
  { key: "03-Trainers", label: "Team · Trainers (photos + bios)" },
  { key: "04-Videos/intro", label: "Videos · Studio Intro" },
  { key: "04-Videos/trainer-intros", label: "Videos · Trainer Intros" },
  { key: "04-Videos/sample-classes", label: "Videos · Sample Classes (Phase 2)" },
  { key: "05-Documents", label: "Documents · Policies & Waivers" },
  { key: "06-Marketing", label: "Existing Marketing Material" },
  { key: "07-Reference-Data", label: "Reference Data (CSV / Spreadsheets)" },
];

const MAX_FILE_BYTES = 100 * 1024 * 1024; // 100 MB

interface AssetRow {
  id: string;
  category: string;
  storage_path: string;
  original_filename: string;
  size_bytes: number;
  mime_type: string | null;
  uploaded_at: string;
}

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
}

interface UploadingItem {
  id: string;
  filename: string;
  size: number;
  state: "uploading" | "indexing" | "rolling-back" | "error";
  error?: string;
}

export default function AssetsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [assets, setAssets] = useState<AssetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].key);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const uploadingRef = useRef<UploadingItem[]>([]);
  uploadingRef.current = uploading;

  // Idempotency: dedupe rapid re-drops of the SAME file (filename+size+mtime) within a session
  const recentDropsRef = useRef<Set<string>>(new Set());

  const loadAssets = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from("intake_assets")
      .select("*")
      .eq("project_id", projectId)
      .order("uploaded_at", { ascending: false });
    if (error) {
      // Surface read errors prominently — silent ignore here masks data
      setLoadError(error.message);
      toast.error("Couldn't load assets list", { description: error.message });
      return;
    }
    setLoadError(null);
    setAssets((data ?? []) as AssetRow[]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setLoadError(null);
      const { data: pj, error: pjErr } = await supabase
        .from("projects")
        .select("id, slug, display_name, status")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (pjErr || !pj) {
        setLoadError(pjErr?.message ?? "Project not found");
        setLoading(false);
        return;
      }
      setProject(pj as ProjectRow);
      await loadAssets((pj as ProjectRow).id);
      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, loadAssets]);

  // Block tab close while uploads are running
  useBeforeUnload(
    useCallback(
      (event: BeforeUnloadEvent) => {
        if (uploadingRef.current.length > 0) {
          event.preventDefault();
          event.returnValue = "";
        }
      },
      []
    )
  );

  const submitted = project ? ["submitted", "reviewed", "approved"].includes(project.status) : false;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!project || submitted) return;

      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_BYTES) {
          toast.error(`Too large: ${file.name}`, { description: "100 MB max per file." });
          continue;
        }
        // Dedupe within a single category only (uploading the same file to a different
        // category is legitimate). 5s TTL to avoid blocking intentional re-uploads.
        const dedupeKey = `${activeCategory}::${file.name}::${file.size}::${file.lastModified}`;
        if (recentDropsRef.current.has(dedupeKey)) {
          toast.info(`Already uploading ${file.name}`);
          continue;
        }
        recentDropsRef.current.add(dedupeKey);
        setTimeout(() => recentDropsRef.current.delete(dedupeKey), 5000);

        const uploadId = crypto.randomUUID();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
        const path = `${project.id}/${activeCategory}/${uploadId}-${safeName}`;
        const item: UploadingItem = {
          id: uploadId,
          filename: file.name,
          size: file.size,
          state: "uploading",
        };
        setUploading((u) => [...u, item]);

        // 1) Storage upload
        const { error: upErr } = await supabase.storage
          .from("portal-assets")
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });
        if (upErr) {
          setUploading((u) =>
            u.map((x) =>
              x.id === uploadId ? { ...x, state: "error", error: upErr.message } : x
            )
          );
          toast.error(`Upload failed: ${file.name}`, { description: upErr.message });
          // Remove from list after short delay so user sees the error
          setTimeout(() => setUploading((u) => u.filter((x) => x.id !== uploadId)), 4000);
          continue;
        }

        // 2) DB insert (with .select() so we get the row back to optimistically append)
        setUploading((u) => u.map((x) => (x.id === uploadId ? { ...x, state: "indexing" } : x)));
        const { data: row, error: insErr } = await supabase
          .from("intake_assets")
          .insert({
            project_id: project.id,
            category: activeCategory,
            storage_path: path,
            original_filename: file.name,
            size_bytes: file.size,
            mime_type: file.type || null,
          })
          .select("*")
          .maybeSingle();

        if (insErr || !row) {
          // The insert may have actually committed before the response was lost
          // (network blip after server commit). Verify by querying for the row.
          const { data: existingRow, error: lookupErr } = await supabase
            .from("intake_assets")
            .select("*")
            .eq("storage_path", path)
            .maybeSingle();

          if (existingRow) {
            // Lost-response scenario — DB already has it. Treat as success.
            setAssets((prev) => [existingRow as AssetRow, ...prev]);
            setUploading((u) => u.filter((x) => x.id !== uploadId));
            toast.success(`Uploaded ${file.name}`);
            continue;
          }

          if (lookupErr) {
            // Cannot verify — be conservative: keep the blob, show "uncertain" status,
            // let admin orphan-cleanup deal with it later.
            setUploading((u) =>
              u.map((x) =>
                x.id === uploadId
                  ? {
                      ...x,
                      state: "error",
                      error:
                        "Upload status uncertain — please refresh; if missing, re-upload.",
                    }
                  : x
              )
            );
            toast.warning(`${file.name}: status uncertain`, {
              description:
                "Server may have saved this. Refresh in a moment to check; if missing, re-upload.",
            });
            setTimeout(() => setUploading((u) => u.filter((x) => x.id !== uploadId)), 6000);
            continue;
          }

          // Confirmed: row does NOT exist on server → safe to roll back the blob.
          setUploading((u) =>
            u.map((x) => (x.id === uploadId ? { ...x, state: "rolling-back" } : x))
          );
          let removeOk = false;
          for (let i = 0; i < 3; i++) {
            const { error: rmErr } = await supabase.storage.from("portal-assets").remove([path]);
            if (!rmErr || (rmErr.message && rmErr.message.includes("Not Found"))) {
              removeOk = true;
              break;
            }
            await new Promise((r) => setTimeout(r, 500 * (i + 1)));
          }
          setUploading((u) =>
            u.map((x) =>
              x.id === uploadId
                ? {
                    ...x,
                    state: "error",
                    error: insErr?.message ?? "Failed to register file (unknown error)",
                  }
                : x
            )
          );
          toast.error(`Couldn't index: ${file.name}`, {
            description: insErr?.message
              ? `${insErr.message}${removeOk ? " (rolled back)" : " (manual cleanup needed)"}`
              : "Unknown error",
          });
          setTimeout(() => setUploading((u) => u.filter((x) => x.id !== uploadId)), 4000);
          continue;
        }

        // 3) Optimistic UI append — don't depend on loadAssets refetch
        setAssets((prev) => [row as AssetRow, ...prev]);
        setUploading((u) => u.filter((x) => x.id !== uploadId));
        toast.success(`Uploaded ${file.name}`);
      }

      // Final consistency refetch in the background. Don't block on it.
      void loadAssets(project.id);
    },
    [project, activeCategory, loadAssets, submitted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: submitted,
  });

  const handleDelete = async (asset: AssetRow) => {
    if (!project) return;
    if (submitted) {
      toast.error("Project locked — contact MonteKristo to re-open before changing assets.");
      return;
    }
    if (!confirm(`Delete ${asset.original_filename}?`)) return;

    // DB-first delete: if metadata removal fails we still have storage. If metadata
    // succeeds but storage remove fails, run a cleanup-by-orphan job (out of scope here).
    const { error: dbErr } = await supabase
      .from("intake_assets")
      .delete()
      .eq("id", asset.id);
    if (dbErr) {
      toast.error("Couldn't remove record", { description: dbErr.message });
      return;
    }
    // Optimistic UI remove
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));

    const { error: stErr } = await supabase.storage
      .from("portal-assets")
      .remove([asset.storage_path]);
    if (stErr && stErr.message && !stErr.message.includes("Not Found")) {
      toast.warning("File metadata removed, but storage cleanup failed", {
        description: `${stErr.message}. The orphan blob will be reaped on the next admin sweep.`,
      });
    } else {
      toast.success("Deleted");
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (!project) {
    return (
      <AppShell>
        <div className="text-destructive">{loadError ?? "Project not found."}</div>
      </AppShell>
    );
  }

  const filtered = assets.filter((a) => a.category === activeCategory);

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

      <h1 className="mb-2 font-heading text-3xl font-semibold text-primary">Assets</h1>
      <p className="mb-6 text-muted-foreground">
        Drag &amp; drop files into a category. Up to 100 MB per file. Any format — images, videos, PDFs,
        spreadsheets.
      </p>

      {loadError && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium">Couldn&apos;t load asset list</div>
            <div className="text-xs">{loadError}</div>
          </div>
          <Button variant="outline" size="sm" onClick={() => project && loadAssets(project.id)}>
            Retry
          </Button>
        </div>
      )}

      {uploading.length > 0 && (
        <div className="mb-4 rounded-md border border-accent/30 bg-accent/5 p-3 text-sm">
          <div className="mb-2 flex items-center gap-2 font-medium text-primary">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            Uploading {uploading.length} file{uploading.length === 1 ? "" : "s"}… please don&apos;t close the tab
          </div>
          <ul className="space-y-1 text-xs">
            {uploading.map((u) => (
              <li key={u.id} className="flex items-center justify-between">
                <span className="truncate">{u.filename}</span>
                <span className="ml-2 flex-shrink-0 text-muted-foreground">
                  {u.state === "uploading" && "Uploading…"}
                  {u.state === "indexing" && "Indexing…"}
                  {u.state === "rolling-back" && "Cleaning up after error…"}
                  {u.state === "error" && (
                    <span className="text-destructive">{u.error ?? "Failed"}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-1">
          {CATEGORIES.map((c) => {
            const count = assets.filter((a) => a.category === c.key).length;
            const active = activeCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  active
                    ? "bg-accent/10 text-accent font-medium"
                    : "hover:bg-secondary text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5" />
                  {c.label}
                </span>
                {count > 0 && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{count}</span>
                )}
              </button>
            );
          })}
        </aside>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {CATEGORIES.find((c) => c.key === activeCategory)?.label}
              </CardTitle>
              <CardDescription>
                {filtered.length} file{filtered.length === 1 ? "" : "s"}
                {submitted ? " · project locked, ask MonteKristo to re-open to add or remove" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition ${
                  submitted
                    ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
                    : isDragActive
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50 hover:bg-secondary/50"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mb-2 h-8 w-8 text-accent" />
                <p className="text-sm font-medium text-primary">
                  {submitted
                    ? "Project locked — uploads disabled"
                    : isDragActive
                    ? "Drop files here…"
                    : "Drag & drop files here"}
                </p>
                {!submitted && <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>}
              </div>

              {filtered.length > 0 && (
                <ul className="divide-y rounded-md border">
                  {filtered.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 p-3">
                      <FileIcon mime={a.mime_type} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">
                          {a.original_filename}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatBytes(a.size_bytes)} · {formatRelative(a.uploaded_at)}
                        </div>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(a)}
                        aria-label="Delete"
                        disabled={submitted}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function FileIcon({ mime }: { mime: string | null }) {
  if (mime?.startsWith("image/")) return <FileImage className="h-5 w-5 text-accent" />;
  if (mime?.startsWith("video/")) return <Film className="h-5 w-5 text-accent" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
}

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(1)} GB`;
}
