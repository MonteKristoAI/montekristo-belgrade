import type { FieldDef, SectionDef, TemplateSchema } from "@/portal/types/template";

export function countFields(section: SectionDef): {
  total: number;
  critical: number;
} {
  let total = 0;
  let critical = 0;
  for (const f of section.fields) {
    total++;
    if (f.critical) critical++;
  }
  return { total, critical };
}

export function isFieldFilled(field: FieldDef, value: unknown): boolean {
  if (value === null || value === undefined) return false;
  switch (field.type) {
    case "text":
    case "textarea":
    case "email":
    case "url":
    case "tel":
    case "select":
    case "radio":
    case "date":
      return typeof value === "string" && value.trim().length > 0;
    case "number":
    case "currency":
      if (typeof value === "number") return Number.isFinite(value);
      if (typeof value === "string") return value.trim().length > 0 && !Number.isNaN(Number(value));
      return false;
    case "multiselect":
    case "array_of_strings":
      return Array.isArray(value) && value.some((s) => typeof s === "string" && s.trim().length > 0);
    case "boolean":
    case "checkbox":
      // Required/critical booleans must be explicitly TRUE — checking then unchecking should not "complete" the field.
      // For optional booleans we still accept any boolean assignment.
      if (field.required || field.critical) return value === true;
      return typeof value === "boolean";
    case "array_of_objects": {
      if (!Array.isArray(value) || value.length === 0) return false;
      const childFields = field.schema ?? [];
      // Each entry must have at least one populated child field; required child fields must be filled in every entry.
      return value.some((row) => {
        if (typeof row !== "object" || row === null) return false;
        const r = row as Record<string, unknown>;
        return childFields.some((sf) => isFieldFilled(sf, r[sf.key]));
      });
    }
    case "matrix":
      if (value === null || typeof value !== "object") return false;
      // Matrix is filled if at least one row has at least one column toggled true
      return Object.values(value as Record<string, Record<string, boolean>>).some(
        (rowMap) => rowMap && typeof rowMap === "object" && Object.values(rowMap).some(Boolean)
      );
    default:
      return Boolean(value);
  }
}

export function computeSectionProgress(
  section: SectionDef,
  responses: Record<string, unknown>
): { fields_total: number; fields_completed: number; fields_critical_missing: number } {
  let completed = 0;
  let criticalMissing = 0;
  for (const f of section.fields) {
    const filled = isFieldFilled(f, responses[f.key]);
    if (filled) completed++;
    else if (f.critical) criticalMissing++;
  }
  return {
    fields_total: section.fields.length,
    fields_completed: completed,
    fields_critical_missing: criticalMissing,
  };
}

export function computeOverallProgress(
  schema: TemplateSchema,
  responsesBySection: Record<string, Record<string, unknown>>
): { total: number; completed: number; criticalMissing: number; pct: number } {
  let total = 0;
  let completed = 0;
  let criticalMissing = 0;
  for (const section of schema.sections) {
    const r = responsesBySection[section.key] || {};
    const sub = computeSectionProgress(section, r);
    total += sub.fields_total;
    completed += sub.fields_completed;
    criticalMissing += sub.fields_critical_missing;
  }
  return {
    total,
    completed,
    criticalMissing,
    pct: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}
