import { useId } from "react";
import { Input } from "@/portal/components/ui/input";
import { Textarea } from "@/portal/components/ui/textarea";
import { Label } from "@/portal/components/ui/label";
import type { FieldDef } from "@/portal/types/template";
import { cn } from "@/portal/lib/utils";

interface FieldRendererProps {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled?: boolean;
}

export function FieldRenderer({ field, value, onChange, disabled }: FieldRendererProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <Label htmlFor={id}>
          {field.label}
          {field.required && <span className="ml-1 text-destructive">*</span>}
          {field.critical && (
            <span className="ml-2 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium uppercase text-accent">
              critical
            </span>
          )}
        </Label>
      </div>
      {renderInput(id, field, value, onChange, disabled)}
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
    </div>
  );
}

function renderInput(
  id: string,
  field: FieldDef,
  value: unknown,
  onChange: (v: unknown) => void,
  disabled?: boolean
) {
  const v = value as never;

  switch (field.type) {
    case "text":
    case "email":
    case "url":
    case "tel":
      return (
        <Input
          id={id}
          type={field.type === "text" ? "text" : field.type}
          placeholder={field.placeholder}
          value={(v as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );

    case "number":
    case "currency":
      return (
        <Input
          id={id}
          type="number"
          placeholder={field.placeholder}
          value={(v as number | string) ?? ""}
          min={field.min}
          max={field.max}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          disabled={disabled}
        />
      );

    case "date":
      return (
        <Input
          id={id}
          type="date"
          value={(v as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );

    case "textarea":
      return (
        <Textarea
          id={id}
          rows={4}
          placeholder={field.placeholder}
          value={(v as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );

    case "select":
      return (
        <select
          id={id}
          value={(v as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          <option value="">— Select —</option>
          {(field.options ?? []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );

    case "radio":
      return (
        <div className="space-y-2">
          {(field.options ?? []).map((o) => (
            <label key={o.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name={id}
                value={o.value}
                checked={v === o.value}
                onChange={() => onChange(o.value)}
                disabled={disabled}
              />
              {o.label}
            </label>
          ))}
        </div>
      );

    case "checkbox":
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(v)}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
          />
          <span>{field.placeholder ?? "Yes"}</span>
        </label>
      );

    case "multiselect":
      return (
        <div className="grid grid-cols-2 gap-2">
          {(field.options ?? []).map((o) => {
            const arr = Array.isArray(v) ? (v as string[]) : [];
            const checked = arr.includes(o.value);
            return (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    if (e.target.checked) onChange([...arr, o.value]);
                    else onChange(arr.filter((x) => x !== o.value));
                  }}
                  disabled={disabled}
                />
                {o.label}
              </label>
            );
          })}
        </div>
      );

    case "array_of_strings":
      return (
        <ArrayOfStringsInput
          value={(v as string[]) ?? []}
          onChange={onChange}
          disabled={disabled}
          placeholder={field.placeholder}
        />
      );

    case "array_of_objects":
      return (
        <ArrayOfObjectsInput
          schema={field.schema ?? []}
          value={(v as Record<string, unknown>[]) ?? []}
          onChange={onChange}
          disabled={disabled}
        />
      );

    case "matrix":
      return (
        <MatrixInput
          rows={field.rows ?? []}
          cols={field.cols ?? []}
          value={(v as Record<string, Record<string, boolean>>) ?? {}}
          onChange={onChange}
          disabled={disabled}
        />
      );

    default:
      return (
        <Input
          id={id}
          value={String(v ?? "")}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      );
  }
}

function ArrayOfStringsInput({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const update = (i: number, s: string) => {
    const next = [...value];
    next[i] = s;
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, ""]);

  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) => update(i, e.target.value)}
            disabled={disabled}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            disabled={disabled}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="text-xs font-medium text-accent hover:underline"
      >
        + Add another
      </button>
    </div>
  );
}

function ArrayOfObjectsInput({
  schema,
  value,
  onChange,
  disabled,
}: {
  schema: FieldDef[];
  value: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  disabled?: boolean;
}) {
  const update = (i: number, key: string, fieldValue: unknown) => {
    const next = [...value];
    next[i] = { ...next[i], [key]: fieldValue };
    onChange(next);
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, {}]);

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="rounded-md border border-border bg-secondary/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase text-muted-foreground">
              Entry {i + 1}
            </span>
            <button
              type="button"
              onClick={() => remove(i)}
              disabled={disabled}
              className="text-xs text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {schema.map((sf) => (
              <FieldRenderer
                key={sf.key}
                field={sf}
                value={item[sf.key]}
                onChange={(v) => update(i, sf.key, v)}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        disabled={disabled}
        className="rounded-md border border-dashed border-accent/50 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5"
      >
        + Add entry
      </button>
    </div>
  );
}

function MatrixInput({
  rows,
  cols,
  value,
  onChange,
  disabled,
}: {
  rows: string[];
  cols: string[];
  value: Record<string, Record<string, boolean>>;
  onChange: (v: Record<string, Record<string, boolean>>) => void;
  disabled?: boolean;
}) {
  const toggle = (row: string, col: string, checked: boolean) => {
    const next = { ...value };
    next[row] = { ...(next[row] ?? {}), [col]: checked };
    onChange(next);
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/50">
            <th className="p-2 text-left text-xs font-semibold text-muted-foreground"></th>
            {cols.map((c) => (
              <th key={c} className="p-2 text-center text-xs font-semibold text-muted-foreground">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r} className="border-t">
              <td className="p-2 font-medium text-foreground">{r}</td>
              {cols.map((c) => (
                <td key={c} className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={Boolean(value[r]?.[c])}
                    onChange={(e) => toggle(r, c, e.target.checked)}
                    disabled={disabled}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
