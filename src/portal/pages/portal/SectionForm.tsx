import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Save, AlertCircle, AlertTriangle, RotateCw } from "lucide-react";
import { toast } from "sonner";
import {
  supabase,
  PORTAL_SUPABASE_KEY_EXPORT,
} from "@/portal/integrations/supabase/client";
import { AppShell } from "@/portal/components/portal/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/portal/components/ui/card";
import { Button } from "@/portal/components/ui/button";
import { ProgressBar } from "@/portal/components/ui/progress-bar";
import { FieldRenderer } from "@/portal/components/forms/FieldRenderer";
import { computeSectionProgress } from "@/portal/lib/template";
import { formatRelative } from "@/portal/lib/utils";
import {
  saveDraft,
  loadDraft,
  clearDraft,
  buildSaveBatchUrl,
  saveConflictRecovery,
  loadConflictRecovery,
  clearConflictRecovery,
  type ConflictPayload,
} from "@/portal/lib/draft-storage";
import type { TemplateSchema, SectionDef } from "@/portal/types/template";

interface ProjectRow {
  id: string;
  slug: string;
  display_name: string;
  status: string;
  template_slug: string;
}

const AUTOSAVE_INTERVAL_MS = 30_000; // 30 seconds
const RETRY_BACKOFFS_MS = [800, 2400, 6000]; // 3 attempts after first failure

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error" | "retrying";

export default function SectionFormPage() {
  const { slug, sectionKey } = useParams<{ slug: string; sectionKey: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [schema, setSchema] = useState<TemplateSchema | null>(null);
  const [section, setSection] = useState<SectionDef | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [restoredFromDraft, setRestoredFromDraft] = useState(false);
  const [conflictRecovery, setConflictRecovery] = useState<ConflictPayload | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Refs synced for save loop (so callbacks don't recreate on every render)
  const dirtyFieldsRef = useRef<Set<string>>(new Set());
  const versionsRef = useRef<Record<string, number>>({});
  const valuesRef = useRef<Record<string, unknown>>({});
  const sectionRef = useRef<SectionDef | null>(null);
  const projectRef = useRef<ProjectRow | null>(null);
  const inFlightRef = useRef(false);
  const inFlightPromiseRef = useRef<Promise<boolean> | null>(null);
  const cancelledRef = useRef(false);
  // Per-field server updated_at (ISO string or null). Used as optimistic concurrency
  // baseline so two-tab edits don't silently overwrite newer data.
  const serverUpdatedAtRef = useRef<Record<string, string | null>>({});
  const [localBackupAvailable, setLocalBackupAvailable] = useState(true);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);
  useEffect(() => {
    sectionRef.current = section;
  }, [section]);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  // Load project + template + responses + restore draft from localStorage if present
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!slug || !sectionKey) return;
      setLoading(true);
      setError(null);
      const { data: pj, error: pjErr } = await supabase
        .from("projects")
        .select("id, slug, display_name, status, template_slug")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
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
        .maybeSingle();
      if (cancelled) return;
      if (tplErr || !tpl) {
        setError("Template missing");
        setLoading(false);
        return;
      }
      const tplSchema = tpl.schema_jsonb as unknown as TemplateSchema;
      setSchema(tplSchema);
      const found = tplSchema.sections.find((s) => s.key === sectionKey);
      if (!found) {
        setError(`Section "${sectionKey}" not found`);
        setLoading(false);
        return;
      }
      setSection(found);

      const { data: resp, error: respErr } = await supabase
        .from("intake_responses")
        .select("field_key, value_jsonb, updated_at")
        .eq("project_id", projectRow.id)
        .eq("section_key", sectionKey);
      if (cancelled) return;
      if (respErr) {
        setError(respErr.message);
        setLoading(false);
        return;
      }
      const serverMap: Record<string, unknown> = {};
      const baselineMap: Record<string, string | null> = {};
      (resp ?? []).forEach((r) => {
        const k = r.field_key as string;
        serverMap[k] = r.value_jsonb;
        baselineMap[k] = (r as { updated_at?: string }).updated_at ?? null;
      });
      serverUpdatedAtRef.current = baselineMap;

      // Check for orphaned local draft (e.g. previous session crashed before save).
      const draft = loadDraft(projectRow.id, sectionKey);
      if (draft && draft.dirty.length > 0) {
        // Apply draft on top of server values, marking those fields as dirty so we re-attempt save.
        const merged = { ...serverMap, ...draft.values };
        setValues(merged);
        valuesRef.current = merged;
        dirtyFieldsRef.current = new Set(draft.dirty);
        // CRITICAL: use draft.serverBaseline as the OC baseline for dirty fields, not the
        // just-fetched server timestamps — otherwise we'd silently overwrite intervening writes.
        const baselineOverlay: Record<string, string | null> = { ...baselineMap };
        for (const f of draft.dirty) {
          if (Object.prototype.hasOwnProperty.call(draft.serverBaseline, f)) {
            baselineOverlay[f] = draft.serverBaseline[f];
          } else {
            // Draft predates serverBaseline tracking → fail safe (treat as new field).
            // Server-side OC will reject if the row exists.
            baselineOverlay[f] = null;
          }
        }
        serverUpdatedAtRef.current = baselineOverlay;
        setRestoredFromDraft(true);
        setSaveState("dirty");
        toast.warning(`Restored ${draft.dirty.length} unsaved field(s) from your previous session`, {
          description: "We'll save them now.",
          duration: 8000,
        });
      } else {
        setValues(serverMap);
        valuesRef.current = serverMap;
        dirtyFieldsRef.current = new Set();
        setSaveState("idle");
      }

      // Surface any prior conflict-recovery payload (user's lost edits from a previous
      // optimistic-concurrency collision) — they can view and copy back into the form.
      const recovery = loadConflictRecovery(projectRow.id, sectionKey);
      if (recovery && recovery.fields.length > 0) {
        setConflictRecovery(recovery);
      }

      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, sectionKey]);

  // Refetch server state for the current section (after a conflict resolution).
  // `conflictedFields` are the fields whose local values lost the conflict — we stash
  // them under a separate localStorage key so the user can copy them back if they want.
  // The form is replaced with the EXACT server snapshot (no spread merge) so no
  // partially-saved-looking values remain visible.
  const refetchSection = useCallback(
    async (conflictedFields: string[] = []): Promise<void> => {
      const proj = projectRef.current;
      const sec = sectionRef.current;
      if (!proj || !sec) return;

      // Stash conflicted local values to recovery key BEFORE we replace the form.
      // CRITICAL: build the in-memory payload FIRST so even if localStorage write fails
      // (quota/private mode), the user still sees the recovery banner + modal.
      if (conflictedFields.length > 0) {
        const subset: Record<string, unknown> = {};
        for (const f of conflictedFields) subset[f] = valuesRef.current[f];
        const inMemoryPayload: ConflictPayload = {
          values: subset,
          fields: conflictedFields,
          storedAt: new Date().toISOString(),
        };
        setConflictRecovery(inMemoryPayload);
        // Best-effort persistence (survives reload). Failure is non-fatal because
        // we already pushed to React state.
        saveConflictRecovery(proj.id, sec.key, valuesRef.current, conflictedFields);
      }

      const { data: resp, error: respErr } = await supabase
        .from("intake_responses")
        .select("field_key, value_jsonb, updated_at")
        .eq("project_id", proj.id)
        .eq("section_key", sec.key);
      if (respErr || cancelledRef.current) return;
      const serverMap: Record<string, unknown> = {};
      const baselineMap: Record<string, string | null> = {};
      (resp ?? []).forEach((r) => {
        const k = r.field_key as string;
        serverMap[k] = r.value_jsonb;
        baselineMap[k] = (r as { updated_at?: string }).updated_at ?? null;
      });
      serverUpdatedAtRef.current = baselineMap;
      // EXACT server snapshot — no merge of stale local edits.
      setValues(serverMap);
      valuesRef.current = serverMap;
      dirtyFieldsRef.current.clear();
      versionsRef.current = {};
      // Drafts are stale now that server-state replaced them; clear so refresh doesn't restore.
      clearDraft(proj.id, sec.key);
    },
    []
  );

  // Single-attempt RPC. Returns true on success.
  const runSaveOnce = useCallback(async (): Promise<boolean> => {
    const proj = projectRef.current;
    const sec = sectionRef.current;
    const currentValues = valuesRef.current;
    if (!proj || !sec || dirtyFieldsRef.current.size === 0) return true;

    const fieldsToSave = Array.from(dirtyFieldsRef.current);
    const versionSnapshot: Record<string, number> = {};
    const payload: Record<string, unknown> = {};
    const expectedMap: Record<string, string | null> = {};
    for (const k of fieldsToSave) {
      versionSnapshot[k] = versionsRef.current[k] ?? 0;
      const v = currentValues[k];
      payload[k] = v === undefined ? null : v;
      expectedMap[k] = serverUpdatedAtRef.current[k] ?? null;
    }
    const progress = computeSectionProgress(sec, currentValues);

    const { data: rpcData, error: rpcErr } = await supabase.rpc("save_section_batch", {
      p_project_id: proj.id,
      p_section_key: sec.key,
      p_values: payload as never,
      p_fields_total: progress.fields_total,
      p_fields_completed: progress.fields_completed,
      p_fields_critical_missing: progress.fields_critical_missing,
      p_expected_updated_at: expectedMap as never,
    });

    if (rpcErr) {
      // Detect optimistic-concurrency conflict (PostgreSQL serialization_failure 40001)
      const code = (rpcErr as { code?: string }).code;
      const msg = rpcErr.message ?? "";
      if (code === "40001" || msg.includes("concurrent edit conflict")) {
        if (!cancelledRef.current) {
          toast.warning("Server has newer data — your edits were rolled back", {
            description:
              "We saved your typed values to a recovery panel below. Open it to copy them back if you still want them.",
            duration: 10000,
          });
        }
        // Pass ALL fields we attempted to save as conflicted (server wins for all of them).
        await refetchSection(fieldsToSave);
        return true;
      }
      if (!cancelledRef.current) setErrorMessage(rpcErr.message);
      return false;
    }

    // Update server baseline timestamps from RPC response so subsequent saves stay consistent.
    const updatedAtMap = (rpcData as { updated_at_by_field?: Record<string, string> } | null)
      ?.updated_at_by_field;
    if (updatedAtMap) {
      for (const [k, v] of Object.entries(updatedAtMap)) {
        serverUpdatedAtRef.current[k] = v;
      }
    }

    // Clear dirty for fields whose version is unchanged since save started.
    for (const k of fieldsToSave) {
      if ((versionsRef.current[k] ?? 0) === versionSnapshot[k]) {
        dirtyFieldsRef.current.delete(k);
      }
    }
    if (proj.status === "draft") {
      const { error: rpcErr2 } = await supabase.rpc("mark_project_in_progress", {
        p_project_id: proj.id,
      });
      if (!rpcErr2 && !cancelledRef.current) {
        const updated = { ...proj, status: "in_progress" };
        projectRef.current = updated;
        setProject(updated);
      }
    }
    return true;
  }, [refetchSection]);

  // Save with retry-with-exponential-backoff. Returns true if eventually persisted.
  const saveWithRetry = useCallback(async (): Promise<boolean> => {
    if (!cancelledRef.current) {
      setSaveState("saving");
      setErrorMessage(null);
    }

    const ok = await runSaveOnce();
    if (ok) return true;

    // Retry chain (silent first attempt, then visible retrying state)
    if (!cancelledRef.current) setSaveState("retrying");
    for (const delay of RETRY_BACKOFFS_MS) {
      if (cancelledRef.current) break;
      await new Promise((r) => setTimeout(r, delay));
      if (cancelledRef.current) break;
      const retryOk = await runSaveOnce();
      if (retryOk) return true;
    }
    return false;
  }, [runSaveOnce]);

  // Public entry: persists all dirty fields. Concurrent callers AWAIT in-flight promise.
  const flushDirty = useCallback(async (): Promise<boolean> => {
    if (dirtyFieldsRef.current.size === 0) return true;
    if (!projectRef.current || !sectionRef.current) return true;
    if (inFlightRef.current && inFlightPromiseRef.current) {
      const okPrev = await inFlightPromiseRef.current;
      if (!okPrev) return false;
      // After waiting, re-check dirt — this caller's edits may still need saving.
      return flushDirty();
    }
    inFlightRef.current = true;

    const promise = saveWithRetry();
    inFlightPromiseRef.current = promise;
    let ok = false;
    try {
      ok = await promise;
    } finally {
      inFlightRef.current = false;
      inFlightPromiseRef.current = null;
    }

    if (!cancelledRef.current) {
      if (ok) {
        setLastSavedAt(new Date());
        setSaveState(dirtyFieldsRef.current.size > 0 ? "dirty" : "saved");
        // Successful save → clear localStorage draft
        const proj = projectRef.current;
        const sec = sectionRef.current;
        if (proj && sec && dirtyFieldsRef.current.size === 0) {
          clearDraft(proj.id, sec.key);
        }
      } else {
        setSaveState("error");
        // Persist remaining dirty fields to localStorage so they survive page reload
        const proj = projectRef.current;
        const sec = sectionRef.current;
        if (proj && sec) {
          saveDraft(proj.id, sec.key, valuesRef.current, dirtyFieldsRef.current);
        }
      }
    }

    // If more dirt accumulated during save AND save succeeded, flush again.
    if (ok && dirtyFieldsRef.current.size > 0 && !cancelledRef.current) {
      return flushDirty();
    }
    return ok;
  }, [saveWithRetry]);

  // 30s autosave timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (dirtyFieldsRef.current.size > 0) void flushDirty();
    }, AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [flushDirty]);

  // Mount / unmount
  useEffect(() => {
    cancelledRef.current = false;
    return () => {
      cancelledRef.current = true;
      // Persist any remaining dirt to localStorage as last resort.
      const proj = projectRef.current;
      const sec = sectionRef.current;
      if (proj && sec && dirtyFieldsRef.current.size > 0) {
        saveDraft(proj.id, sec.key, valuesRef.current, dirtyFieldsRef.current);
      }
      // Fire-and-forget normal flush (Supabase client owns its in-flight fetch).
      if (dirtyFieldsRef.current.size > 0) void flushDirty();
    };
  }, [flushDirty]);

  // pagehide: last-ditch save with fetch keepalive (works even after tab is closing)
  useEffect(() => {
    const handler = () => {
      const proj = projectRef.current;
      const sec = sectionRef.current;
      if (!proj || !sec || dirtyFieldsRef.current.size === 0) return;

      // 1) Persist locally so reload restores
      saveDraft(proj.id, sec.key, valuesRef.current, dirtyFieldsRef.current);

      // 2) Best-effort keepalive request to the RPC — browser delivers this even after page unload.
      //    INCLUDES p_expected_updated_at so OC still applies (no silent overwrite).
      try {
        const fields = Array.from(dirtyFieldsRef.current);
        const payload: Record<string, unknown> = {};
        const expectedMap: Record<string, string | null> = {};
        for (const k of fields) {
          payload[k] = valuesRef.current[k] === undefined ? null : valuesRef.current[k];
          expectedMap[k] = serverUpdatedAtRef.current[k] ?? null;
        }
        const progress = computeSectionProgress(sec, valuesRef.current);
        const url = buildSaveBatchUrl();
        // Read access token from our portal-scoped Supabase auth storage key
        const tokenRaw = window.localStorage.getItem("mkop-auth-token") ?? "{}";
        let accessToken = "";
        try {
          const parsed = JSON.parse(tokenRaw);
          accessToken = parsed?.access_token ?? "";
        } catch {
          accessToken = "";
        }
        if (!url || !accessToken) return;
        void fetch(url, {
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
            apikey: PORTAL_SUPABASE_KEY_EXPORT,
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            p_project_id: proj.id,
            p_section_key: sec.key,
            p_values: payload,
            p_fields_total: progress.fields_total,
            p_fields_completed: progress.fields_completed,
            p_fields_critical_missing: progress.fields_critical_missing,
            p_expected_updated_at: expectedMap,
          }),
        }).catch(() => undefined);
      } catch {
        // Best-effort — already backed up locally
      }
    };
    window.addEventListener("pagehide", handler);
    return () => window.removeEventListener("pagehide", handler);
  }, []);

  // Browser-level beforeunload guard if there are unsaved changes.
  useBeforeUnload(
    useCallback((event: BeforeUnloadEvent) => {
      if (dirtyFieldsRef.current.size > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    }, [])
  );

  const onChange = (fieldKey: string, value: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [fieldKey]: value };
      valuesRef.current = next;
      return next;
    });
    dirtyFieldsRef.current.add(fieldKey);
    versionsRef.current[fieldKey] = (versionsRef.current[fieldKey] ?? 0) + 1;
    setSaveState("dirty");

    // Persist draft OUTSIDE the state updater (saveDraft is sync but doing
    // localStorage work inside React's state updater is an anti-pattern).
    // Use the freshly computed `next` via valuesRef.
    const proj = projectRef.current;
    const sec = sectionRef.current;
    if (proj && sec) {
      const dirtyClone = new Set(dirtyFieldsRef.current);
      const ok = saveDraft(proj.id, sec.key, valuesRef.current, dirtyClone, serverUpdatedAtRef.current);
      if (!ok && localBackupAvailable) {
        setLocalBackupAvailable(false);
      } else if (ok && !localBackupAvailable) {
        setLocalBackupAvailable(true);
      }
    }
  };

  const manualSaveBusyRef = useRef(false);
  const handleManualSave = async () => {
    if (dirtyFieldsRef.current.size === 0) {
      toast.info("Nothing to save");
      return;
    }
    if (manualSaveBusyRef.current) return;
    manualSaveBusyRef.current = true;
    try {
      const ok = await flushDirty();
      if (ok) {
        toast.success("Saved");
      } else {
        toast.error("Couldn't save", {
          description:
            errorMessage ??
            "Changes are backed up on this device. We'll keep retrying — don't close the tab if you can help it.",
        });
      }
    } finally {
      manualSaveBusyRef.current = false;
    }
  };

  const navigateWithFlush = async (to: string) => {
    if (dirtyFieldsRef.current.size > 0) {
      const ok = await flushDirty();
      if (!ok) {
        toast.error("Save failed — fix and retry before leaving the section.");
        return;
      }
    }
    navigate(to);
  };

  const sectionIdx = useMemo(() => {
    if (!schema || !section) return -1;
    return schema.sections.findIndex((s) => s.key === section.key);
  }, [schema, section]);

  const prevSection = sectionIdx > 0 ? schema?.sections[sectionIdx - 1] : null;
  const nextSection =
    schema && sectionIdx >= 0 && sectionIdx < schema.sections.length - 1
      ? schema.sections[sectionIdx + 1]
      : null;

  const sectionProgress = useMemo(() => {
    if (!section) return null;
    return computeSectionProgress(section, values);
  }, [section, values]);

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground">Loading…</div>
      </AppShell>
    );
  }
  if (error || !project || !schema || !section) {
    return (
      <AppShell>
        <div className="text-destructive">Error: {error}</div>
      </AppShell>
    );
  }

  const pct = sectionProgress
    ? sectionProgress.fields_total === 0
      ? 0
      : Math.round((sectionProgress.fields_completed / sectionProgress.fields_total) * 100)
    : 0;

  const dirtyCount = dirtyFieldsRef.current.size;
  const submitted = ["submitted", "reviewed", "approved"].includes(project.status);

  return (
    <AppShell>
      <div className="mb-6">
        <Link
          to={`/reports/portal/p/${slug}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-accent"
          onClick={(e) => {
            if (dirtyFieldsRef.current.size > 0) {
              e.preventDefault();
              void navigateWithFlush(`/p/${slug}`);
            }
          }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {project.display_name}
        </Link>
      </div>

      {(saveState === "error" || saveState === "retrying") && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium">
              {saveState === "retrying" ? "Retrying save…" : "Save failed"}
            </div>
            <div className="text-xs">
              Your changes are backed up on this device and will be retried automatically.{" "}
              {errorMessage ? `Reason: ${errorMessage}` : "Network may be unstable."}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleManualSave}>
            <RotateCw className="h-3.5 w-3.5" />
            Retry now
          </Button>
        </div>
      )}

      {restoredFromDraft && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium">Restored unsaved changes from your previous session</div>
            <div className="text-xs">Click Save to push these to the server now.</div>
          </div>
        </div>
      )}

      {conflictRecovery && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium">
              {conflictRecovery.fields.length} field
              {conflictRecovery.fields.length === 1 ? "" : "s"} from your previous edits couldn&apos;t
              be saved due to a conflict
            </div>
            <div className="text-xs">
              We kept what you typed. Open the recovery panel to view and copy them back into the form.
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Button variant="coral" size="sm" onClick={() => setShowRecoveryModal(true)}>
              View recovered values
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!project || !section) return;
                clearConflictRecovery(project.id, section.key);
                setConflictRecovery(null);
              }}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {showRecoveryModal && conflictRecovery && section && (
        <RecoveryModal
          payload={conflictRecovery}
          section={section}
          onClose={() => setShowRecoveryModal(false)}
          onClear={() => {
            if (!project || !section) return;
            clearConflictRecovery(project.id, section.key);
            setConflictRecovery(null);
            setShowRecoveryModal(false);
          }}
        />
      )}

      {!localBackupAvailable && (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-medium">Local backup unavailable</div>
            <div className="text-xs">
              Your browser&apos;s storage is full or disabled (private mode?). Your changes can only
              be saved by clicking <strong>Save</strong> — closing the tab without saving will lose them.
            </div>
          </div>
        </div>
      )}

      <Card className="mb-6 border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono text-muted-foreground">
                Section {sectionIdx + 1} of {schema.sections.length}
              </div>
              <CardTitle className="mt-1">{section.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <SaveIndicator state={saveState} lastSavedAt={lastSavedAt} dirtyCount={dirtyCount} />
              <Button
                variant={dirtyCount > 0 ? "coral" : "outline"}
                size="sm"
                onClick={handleManualSave}
                disabled={saveState === "saving" || saveState === "retrying" || submitted}
                aria-label="Save now"
              >
                <Save className="h-4 w-4" />
                Save{dirtyCount > 0 ? ` (${dirtyCount})` : ""}
              </Button>
            </div>
          </div>
          {section.description && <CardDescription>{section.description}</CardDescription>}
          <div className="pt-3">
            <ProgressBar value={pct} />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {sectionProgress?.fields_completed}/{sectionProgress?.fields_total} fields
                {sectionProgress?.fields_critical_missing
                  ? ` · ${sectionProgress.fields_critical_missing} critical missing`
                  : ""}
              </span>
              <span>Autosave every 30s · backed up locally</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {submitted && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              Project already submitted. Editing is locked. Contact MonteKristo to re-open.
            </div>
          )}
          {section.fields.map((f) => (
            <FieldRenderer
              key={f.key}
              field={f}
              value={values[f.key]}
              onChange={(v) => onChange(f.key, v)}
              disabled={submitted}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={!prevSection}
          onClick={() => prevSection && navigateWithFlush(`/p/${slug}/section/${prevSection.key}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          {prevSection ? prevSection.title : "Previous"}
        </Button>
        <Button
          variant="coral"
          onClick={() =>
            navigateWithFlush(
              nextSection ? `/p/${slug}/section/${nextSection.key}` : `/p/${slug}/review`
            )
          }
        >
          {nextSection ? nextSection.title : "Review & submit"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </AppShell>
  );
}

function RecoveryModal({
  payload,
  section,
  onClose,
  onClear,
}: {
  payload: ConflictPayload;
  section: SectionDef;
  onClose: () => void;
  onClear: () => void;
}) {
  const fieldByKey = new Map(section.fields.map((f) => [f.key, f]));
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="font-heading text-xl font-semibold text-primary">Recovered values</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These are what you typed before another session updated the same fields. Copy what you
            need, then dismiss to restore a clean view.
          </p>
        </div>
        <ul className="space-y-3">
          {payload.fields.map((fk) => {
            const field = fieldByKey.get(fk);
            const v = payload.values[fk];
            const display =
              typeof v === "string" || typeof v === "number" || typeof v === "boolean"
                ? String(v)
                : v == null
                ? "—"
                : JSON.stringify(v, null, 2);
            return (
              <li key={fk} className="rounded-md border bg-secondary/30 p-3">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {field?.label ?? fk}
                </div>
                <pre className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                  {display}
                </pre>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(display);
                      toast.success("Copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={onClear}>
            Discard recovered values
          </Button>
          <Button variant="coral" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function SaveIndicator({
  state,
  lastSavedAt,
  dirtyCount,
}: {
  state: SaveState;
  lastSavedAt: Date | null;
  dirtyCount: number;
}) {
  if (state === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Save className="h-3.5 w-3.5 animate-pulse" />
        Saving {dirtyCount} field{dirtyCount === 1 ? "" : "s"}…
      </span>
    );
  }
  if (state === "retrying") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-700">
        <RotateCw className="h-3.5 w-3.5 animate-spin" />
        Retrying…
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-destructive">
        <AlertCircle className="h-3.5 w-3.5" />
        Backed up locally — click Retry
      </span>
    );
  }
  if (state === "dirty") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
        {dirtyCount} unsaved
      </span>
    );
  }
  if (state === "saved" && lastSavedAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
        <Check className="h-3.5 w-3.5" />
        Saved {formatRelative(lastSavedAt)}
      </span>
    );
  }
  return null;
}
