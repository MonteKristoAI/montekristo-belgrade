// Template schema types — mirrored on server in intake_templates.schema_jsonb

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "tel"
  | "number"
  | "select"
  | "multiselect"
  | "radio"
  | "checkbox"
  | "boolean"
  | "date"
  | "currency"
  | "array_of_objects"
  | "array_of_strings"
  | "matrix"; // table-style matrix (events × channels etc)

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  critical?: boolean; // counts toward critical_missing
  help?: string;
  placeholder?: string;
  options?: FieldOption[];
  schema?: FieldDef[]; // for array_of_objects → child field defs
  rows?: string[]; // for matrix
  cols?: string[]; // for matrix
  min?: number;
  max?: number;
}

export interface SectionDef {
  key: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

export interface TemplateSchema {
  version: number;
  sections: SectionDef[];
}
