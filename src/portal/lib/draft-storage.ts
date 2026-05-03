/**
 * Local draft storage for form sections.
 *
 * Goal: never lose user input. Every onChange writes to localStorage BEFORE the
 * network save fires. If the browser crashes, network drops, tab closes, or any
 * server error keeps a save from completing, the next time the user opens the
 * section we restore the unsaved values from localStorage and re-attempt.
 *
 * Schema: draft:{project_id}:{section_key} → { values, dirty, updatedAt }
 */

const PREFIX = "mkop_draft:"; // "mk onboarding portal" namespace

interface DraftPayload {
  values: Record<string, unknown>;
  dirty: string[];
  /** Server's per-field updated_at at the time we started editing (for optimistic concurrency) */
  serverBaseline: Record<string, string | null>;
  updatedAt: string; // ISO
}

const key = (projectId: string, sectionKey: string) => `${PREFIX}${projectId}:${sectionKey}`;

/**
 * Returns true on durable write, false if storage is unavailable (quota, private mode).
 * Caller should surface a "local backup unavailable" warning on false.
 */
export function saveDraft(
  projectId: string,
  sectionKey: string,
  values: Record<string, unknown>,
  dirty: Set<string>,
  serverBaseline: Record<string, string | null> = {}
): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  if (dirty.size === 0) {
    try {
      window.localStorage.removeItem(key(projectId, sectionKey));
    } catch {
      return false;
    }
    return true;
  }
  try {
    const payload: DraftPayload = {
      values,
      dirty: Array.from(dirty),
      serverBaseline,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(key(projectId, sectionKey), JSON.stringify(payload));
    return true;
  } catch {
    // Quota exceeded / private mode
    return false;
  }
}

export function loadDraft(projectId: string, sectionKey: string): DraftPayload | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(key(projectId, sectionKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DraftPayload>;
    if (!parsed || typeof parsed !== "object" || !parsed.values || !parsed.dirty) return null;
    return {
      values: parsed.values,
      dirty: parsed.dirty,
      serverBaseline: parsed.serverBaseline ?? {},
      updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

export function clearDraft(projectId: string, sectionKey: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(key(projectId, sectionKey));
  } catch {
    // ignore
  }
}

/**
 * Conflict recovery: when a save is rejected by optimistic concurrency, we stash
 * the user's local values (the ones that lost the conflict) under a separate key
 * so they can copy/paste back into the form. NOT auto-applied (would re-create
 * the conflict).
 */
const conflictKey = (projectId: string, sectionKey: string) =>
  `mkop_conflict:${projectId}:${sectionKey}`;

export interface ConflictPayload {
  values: Record<string, unknown>;
  fields: string[]; // ordered list of fields that had conflicts
  storedAt: string;
}

export function saveConflictRecovery(
  projectId: string,
  sectionKey: string,
  values: Record<string, unknown>,
  fields: string[]
): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (fields.length === 0) return;
  const subset: Record<string, unknown> = {};
  for (const f of fields) subset[f] = values[f];
  try {
    const payload: ConflictPayload = {
      values: subset,
      fields,
      storedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(conflictKey(projectId, sectionKey), JSON.stringify(payload));
  } catch {
    // best-effort
  }
}

export function loadConflictRecovery(
  projectId: string,
  sectionKey: string
): ConflictPayload | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(conflictKey(projectId, sectionKey));
    if (!raw) return null;
    return JSON.parse(raw) as ConflictPayload;
  } catch {
    return null;
  }
}

export function clearConflictRecovery(projectId: string, sectionKey: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.removeItem(conflictKey(projectId, sectionKey));
  } catch {
    // ignore
  }
}

/**
 * Build the URL for a direct REST call to save_section_batch.
 * Used by the pagehide keepalive fetch (which needs absolute URL + Authorization header set inline).
 */
import { PORTAL_SUPABASE_URL } from "@/portal/integrations/supabase/client";

export function buildSaveBatchUrl(): string {
  return `${PORTAL_SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/save_section_batch`;
}
