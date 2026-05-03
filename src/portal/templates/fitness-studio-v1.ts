import schema from "./fitness-studio-v1.json";
import type { TemplateSchema } from "@/portal/types/template";

// Source-of-truth lives in fitness-studio-v1.json so the seed script can
// POST it directly via Supabase Management API without TS compilation.
export const fitnessStudioV1: TemplateSchema = schema as unknown as TemplateSchema;
