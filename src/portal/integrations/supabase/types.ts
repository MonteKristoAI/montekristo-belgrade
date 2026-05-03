export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type ProjectStatus = "draft" | "in_progress" | "submitted" | "reviewed" | "approved" | "archived";
type MemberRole = "mk_admin" | "mk_collaborator" | "client_owner" | "client_editor";

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          client_type: string;
          display_name: string;
          status: ProjectStatus;
          template_slug: string;
          created_by: string | null;
          invited_email: string | null;
          client_company: string | null;
          notes_internal: string | null;
          created_at: string;
          updated_at: string;
          submitted_at: string | null;
          reviewed_at: string | null;
          approved_at: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          client_type?: string;
          display_name: string;
          status?: ProjectStatus;
          template_slug: string;
          created_by?: string | null;
          invited_email?: string | null;
          client_company?: string | null;
          notes_internal?: string | null;
          created_at?: string;
          updated_at?: string;
          submitted_at?: string | null;
          reviewed_at?: string | null;
          approved_at?: string | null;
        };
        // Note: client UPDATEs to projects are blocked by RLS (admin only).
        // Use mark_project_in_progress / submit_for_review RPCs instead.
        Update: never;
        Relationships: [];
      };
      project_members: {
        Row: {
          project_id: string;
          user_id: string;
          role: MemberRole;
          invited_email: string | null;
          invited_at: string;
          accepted_at: string | null;
        };
        Insert: {
          project_id: string;
          user_id: string;
          role: MemberRole;
          invited_email?: string | null;
          invited_at?: string;
          accepted_at?: string | null;
        };
        Update: {
          project_id?: string;
          user_id?: string;
          role?: MemberRole;
          invited_email?: string | null;
          invited_at?: string;
          accepted_at?: string | null;
        };
        Relationships: [];
      };
      intake_templates: {
        Row: {
          slug: string;
          client_type: string;
          version: number;
          display_name: string;
          description: string | null;
          schema_jsonb: Json;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          slug: string;
          client_type: string;
          version?: number;
          display_name: string;
          description?: string | null;
          schema_jsonb: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          client_type?: string;
          version?: number;
          display_name?: string;
          description?: string | null;
          schema_jsonb?: Json;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      intake_responses: {
        Row: {
          id: string;
          project_id: string;
          section_key: string;
          field_key: string;
          value_jsonb: Json | null;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          section_key: string;
          field_key: string;
          value_jsonb?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          section_key?: string;
          field_key?: string;
          value_jsonb?: Json | null;
          updated_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      intake_progress: {
        Row: {
          project_id: string;
          section_key: string;
          fields_total: number;
          fields_completed: number;
          fields_critical_missing: number;
          last_updated_at: string;
        };
        Insert: {
          project_id: string;
          section_key: string;
          fields_total?: number;
          fields_completed?: number;
          fields_critical_missing?: number;
          last_updated_at?: string;
        };
        Update: {
          project_id?: string;
          section_key?: string;
          fields_total?: number;
          fields_completed?: number;
          fields_critical_missing?: number;
          last_updated_at?: string;
        };
        Relationships: [];
      };
      intake_assets: {
        Row: {
          id: string;
          project_id: string;
          category: string;
          storage_path: string;
          original_filename: string;
          size_bytes: number;
          mime_type: string | null;
          uploaded_by: string | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          category: string;
          storage_path: string;
          original_filename: string;
          size_bytes: number;
          mime_type?: string | null;
          uploaded_by?: string | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          category?: string;
          storage_path?: string;
          original_filename?: string;
          size_bytes?: number;
          mime_type?: string | null;
          uploaded_by?: string | null;
          uploaded_at?: string;
        };
        Relationships: [];
      };
      audit_log: {
        Row: {
          id: number;
          project_id: string | null;
          user_id: string | null;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_id?: string | null;
          user_id?: string | null;
          action: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          project_id?: string | null;
          user_id?: string | null;
          action?: string;
          details?: Json | null;
          created_at?: string;
        };
        Relationships: [];
      };
      project_notes: {
        Row: {
          id: string;
          project_id: string;
          author_id: string | null;
          body_markdown: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          author_id?: string | null;
          body_markdown: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          author_id?: string | null;
          body_markdown?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      app_admins: {
        Row: {
          email: string;
          added_by: string | null;
          added_at: string;
          notes: string | null;
        };
        Insert: {
          email: string;
          added_by?: string | null;
          added_at?: string;
          notes?: string | null;
        };
        Update: {
          email?: string;
          added_by?: string | null;
          added_at?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      project_completion_v: {
        Row: {
          project_id: string | null;
          slug: string | null;
          display_name: string | null;
          status: string | null;
          fields_completed: number | null;
          fields_total: number | null;
          critical_missing: number | null;
          completion_pct: number | null;
          last_activity_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      save_response: {
        Args: {
          p_project_id: string;
          p_section_key: string;
          p_field_key: string;
          p_value: Json;
          p_fields_total: number;
          p_fields_completed: number;
          p_fields_critical_missing?: number;
        };
        Returns: undefined;
      };
      save_section_batch: {
        Args: {
          p_project_id: string;
          p_section_key: string;
          p_values: Json;
          p_fields_total: number;
          p_fields_completed: number;
          p_fields_critical_missing?: number;
          p_expected_updated_at?: Json | null;
        };
        Returns: { saved: number; updated_at_by_field: Record<string, string> };
      };
      accept_project_invites: {
        Args: Record<string, never>;
        Returns: number;
      };
      mark_project_in_progress: {
        Args: { p_project_id: string };
        Returns: undefined;
      };
      submit_for_review: {
        Args: { p_project_id: string };
        Returns: undefined;
      };
      create_project_with_owner: {
        Args: {
          p_slug: string;
          p_display_name: string;
          p_template_slug: string;
          p_client_type: string;
          p_invited_email: string;
          p_client_company?: string | null;
        };
        Returns: string;
      };
      is_mk_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_project_member: {
        Args: { p_project_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      project_status: ProjectStatus;
      member_role: MemberRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
