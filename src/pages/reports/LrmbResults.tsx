import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ─── FIELD LABELS ─────────────────────────────────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  s01_total: "Total properties managed",
  s01_phase1: "Phase 1 deployment count",
  s01_proplist: "Existing property list",
  s01_regions: "Organized by region/zone",
  s01_regions_list: "Region/zone names",
  s01_units: "Average units per property",
  s01_names: "Property names source",
  s01_ids: "Internal property IDs/codes",
  s02_creates: "Who creates tasks",
  s02_reassign: "Who can reassign tasks",
  s02_verify: "Who can verify/close tasks",
  s02_coverage: "Staff assignment model",
  s02_vendors: "External vendors need app access",
  s02_vendors_detail: "Vendor details",
  s02_admin_count: "Admin dashboard users (count)",
  s03_maint: "Top 10 maintenance task types",
  s03_vendor_tasks: "Vendor-specific tasks",
  s03_vendor_detail: "Vendor task list",
  s03_vendor_assign: "Who assigns vendors to tasks",
  s03_cycle: "Average maintenance cycle time",
  s03_hk_types: "Housekeeping task types",
  s03_hk_create: "Who creates housekeeping tasks",
  s03_hk_checklists: "Housekeeping checklists available",
  s03_cleaners: "Cleaners on roster",
  s03_cleaner_assign: "Cleaner assignment model",
  s03_insp_types: "Inspection types performed",
  s03_insp_who: "Who performs inspections",
  s03_insp_checklist: "Standardized inspection checklist",
  s03_insp_auto: "Auto-create maintenance from flagged inspection",
  s03_other: "Other task types",
  s04_flow: "Status flow alignment",
  s04_flow_changes: "Status flow changes needed",
  s04_blocked_means: '"Blocked" definition',
  s04_blocked_who: "Who can mark a task blocked",
  s04_waiting_parts: 'Use "waiting_parts" status',
  s04_parts_who: "Who orders parts/materials",
  s04_complete_who: "Who marks tasks completed",
  s04_verify_who: "Who verifies completed tasks",
  s04_verify_types: "Task types requiring verification",
  s04_photo: "Photo requirement to close task",
  s04_note: "Note requirement to close task",
  s04_overdue: "Task overdue threshold",
  s04_overdue_custom: "Custom overdue threshold",
  s04_priority_urgent: "Priority: Urgent",
  s04_priority_high: "Priority: High",
  s04_priority_medium: "Priority: Medium",
  s04_priority_low: "Priority: Low",
  s05_accept_hours: "Hours before unaccepted task escalates",
  s05_accept_notify: "Notified for unaccepted tasks",
  s05_overdue_notify: "Notified for overdue tasks",
  s05_blocked_hours: "Hours before blocked task escalates",
  s05_blocked_notify: "Notified for blocked escalations",
  s05_mgr_escalation: "Manager-level escalation triggers",
  s05_sla: "Guest SLA commitments",
  s05_sla_detail: "SLA details",
  s06_plan: "TravelNet plan/package",
  s06_features: "Active TravelNet features",
  s06_mobile: "TravelNet mobile app usage",
  s06_access: "TravelNet access/docs availability",
  s06_hk_trigger: "Housekeeping task auto-creation trigger",
  s06_hk_hours: "Hours before checkout for HK trigger",
  s06_task_data: "Reservation data in housekeeping task",
  s07_triggers: "Guest message types that create tasks",
  s07_auto: "Task creation mode",
  s07_reply: "Auto-reply to guests when task created",
  s07_reply_msg: "Auto-reply message draft",
  s08_channels: "Notification channels",
  s08_tool: "Team communication tool",
  s08_notif_notes: "Notification matrix — additional notes",
  s08_quiet: "Quiet hours enabled",
  s08_quiet_from: "Quiet hours start",
  s08_quiet_to: "Quiet hours end",
  s08_volume: "Notification volume preference",
  s08_volume_custom: "Custom notification rules",
  s09_damage_form: "Separate damage report form",
  s09_scoring: "Inspection scoring system",
  s10_appname: "App name for field staff",
  s10_appname_custom: "Custom app name",
  s10_logo: "LRMB logo availability",
  s10_colors: "Brand colors preference",
  s10_language: "App language",
  s10_tutorial: "In-app onboarding tutorial",
  s10_devices: "Field staff devices",
  s10_offline: "Offline mode requirement",
  s11_metrics: "Key daily dashboard metrics",
  s11_email_report: "Scheduled email report",
  s11_export: "Data export needs",
  s11_billing: "Cost/billing tracking per task",
  s11_audit: "Audit trail requirement",
  s11_kpi_reports: "KPI report frequency",
  s12_domain: "Hosting domain preference",
  s12_domain_name: "Custom domain name",
  s12_connect: "Domain connection method",
  s12_accounts: "User account management",
  s12_sso: "Single Sign-On requirement",
  s12_compliance: "Security/compliance requirements",
  s12_retention: "Task history retention period",
  s12_tech_contact: "Primary technical contact",
  s13_payroll: "Payroll/hours data available",
  s13_cycle: "Average maintenance cycle time today",
  s13_admin_hours: "Admin hours/week on coordination",
  s13_photo_pct: "Tasks closed with photo today (%)",
  s13_reopen: "Task reopen rate",
  s13_verbal: 'Daily verbal "did you finish?" checks',
  s14_closure: "Task closure ownership",
  s14_closure_detail: "Closure rules by task type",
  s14_completed_def: '"Completed" definition per task type',
  s14_escalation: "Escalation triggers",
  s14_escalation_custom: "Custom escalation logic",
  s14_vendors: "Vendor/contractor list available",
  s14_vendors_list: "Vendor/contractor list",
  s14_guest_bypass: "Guest bypass handling",
  s14_guest_bypass_detail: "Guest bypass — additional context",
};

const NOTIF_EVENTS = ["Task assigned", "Task overdue", "Task blocked", "Task completed", "Verification needed", "New urgent task"];
const NOTIF_ROLES = ["Field Staff", "Admin", "Supervisor", "Manager"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const prettifyKey = (key: string): string => {
  if (key.endsWith("_other")) {
    const parent = key.slice(0, -6);
    return (FIELD_LABELS[parent] || prettifyKey(parent)) + " — notes";
  }
  if (key.endsWith("_extra")) return "Anything else / additional notes";
  return key.replace(/^s\d+_/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatValue = (val: any): string => {
  if (Array.isArray(val)) return val.join(", ");
  if (typeof val === "boolean") return val ? "Yes" : "No";
  return String(val);
};

const isEmpty = (val: any) =>
  val === null || val === undefined || val === "" || (Array.isArray(val) && val.length === 0);

const Ans = ({ label, value }: { label: string; value: any }) => {
  if (isEmpty(value)) return null;
  return (
    <div className="py-2.5 border-b border-white/[0.05] last:border-0">
      <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">{formatValue(value)}</p>
    </div>
  );
};

const Sec = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-0.5">
    <div className="flex items-center gap-3 mb-3">
      <span className="text-xs font-bold bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20 flex-shrink-0">{number}</span>
      <h2 className="text-white font-semibold text-base">{title}</h2>
    </div>
    {children}
  </div>
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const LrmbResults = () => {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sub, setSub] = useState<any>(null);

  const handleUnlock = async () => {
    if (!pw.trim()) return;
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from("form_submissions")
      .select("*")
      .eq("view_password", pw.trim().toUpperCase())
      .maybeSingle();
    setLoading(false);
    if (qErr || !data) {
      setError("Access code not found. Check the code and try again.");
      return;
    }
    setSub(data);
  };

  // ── Password gate ────────────────────────────────────────────────────────────
  if (!sub) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-gray-300">MonteKristo AI · Results</span>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-8">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-center mb-1">Questionnaire Results</h1>
            <p className="text-gray-500 text-sm text-center mb-6">Enter your access code to view submitted answers.</p>
            <input
              type="text"
              value={pw}
              onChange={(e) => { setPw(e.target.value.toUpperCase()); setError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
              placeholder="XXXX-XXXX"
              maxLength={9}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white text-center text-lg font-mono tracking-widest placeholder-gray-700 outline-none focus:border-blue-500/50 transition-colors mb-3"
            />
            {error && <p className="text-red-400 text-xs text-center mb-3">{error}</p>}
            <button
              onClick={handleUnlock}
              disabled={loading || !pw.trim()}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
            >
              {loading ? "Checking..." : "View Results"}
            </button>
          </div>
          <button onClick={() => navigate(-1)} className="mt-6 flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm transition-colors mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>
    );
  }

  // ── Results view ─────────────────────────────────────────────────────────────
  const { formData, staffRows, adminRows } = sub.data ?? {};
  const fd: Record<string, any> = formData ?? {};
  const submittedAt = sub.submitted_at
    ? new Date(sub.submitted_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Unknown date";

  const a = (key: string) => <Ans key={key} label={FIELD_LABELS[key] || prettifyKey(key)} value={fd[key]} />;

  const notifMatrix = () => {
    const rows = NOTIF_EVENTS.map((event) => ({
      event,
      roles: NOTIF_ROLES.filter((role) => fd[`s08_notif_${event}_${role}`]),
    })).filter((r) => r.roles.length > 0);
    if (rows.length === 0) return null;
    return (
      <div className="py-2.5 border-b border-white/[0.05]">
        <p className="text-[11px] text-gray-500 mb-2">Notification matrix</p>
        <div className="space-y-1.5">
          {rows.map(({ event, roles }) => (
            <div key={event} className="flex gap-3 text-xs">
              <span className="text-gray-500 w-40 flex-shrink-0">{event}</span>
              <span className="text-gray-200">{roles.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-gray-700 hidden sm:inline">|</span>
          <span className="text-gray-400 text-xs sm:text-sm">LRMB — Onboarding Results</span>
        </div>
        <span className="text-xs text-gray-600">Submitted {submittedAt}</span>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">LRMB</span>
          </div>
          <h1 className="text-2xl font-bold">Submitted Questionnaire</h1>
          <p className="text-gray-500 text-sm mt-1">Read-only view of submitted onboarding answers.</p>
        </div>

        {/* S01 — Properties */}
        <Sec number="01" title="Properties & Units">
          {a("s01_total")}{a("s01_phase1")}{a("s01_proplist")}{a("s01_proplist_other")}
          {a("s01_regions")}{a("s01_regions_list")}{a("s01_units")}
          {a("s01_names")}{a("s01_names_other")}{a("s01_ids")}{a("s01_ids_other")}{a("s01_extra")}
        </Sec>

        {/* S02 — Staff */}
        <Sec number="02" title="Staff Roster">
          {(staffRows ?? []).some((r: any) => r.name) && (
            <div className="pb-3 mb-1 border-b border-white/[0.05]">
              <p className="text-[11px] text-gray-500 mb-2">Staff members</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.06]">
                      {["Name", "Email", "Phone", "Role", "Properties"].map((h) => (
                        <th key={h} className="text-left pb-2 pr-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(staffRows ?? []).filter((r: any) => r.name).map((r: any, i: number) => (
                      <tr key={i} className="border-b border-white/[0.04] text-gray-300">
                        <td className="py-2 pr-3">{r.name}</td>
                        <td className="py-2 pr-3">{r.email}</td>
                        <td className="py-2 pr-3">{r.phone}</td>
                        <td className="py-2 pr-3">{r.role}</td>
                        <td className="py-2">{r.properties}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {a("s02_creates")}{a("s02_creates_other")}{a("s02_reassign")}{a("s02_reassign_other")}
          {a("s02_verify")}{a("s02_verify_other")}{a("s02_coverage")}{a("s02_coverage_other")}
          {a("s02_vendors")}{a("s02_vendors_detail")}{a("s02_admin_count")}{a("s02_extra")}
        </Sec>

        {/* S03 — Tasks */}
        <Sec number="03" title="Task Types & Categories">
          {a("s03_maint")}{a("s03_vendor_tasks")}{a("s03_vendor_tasks_other")}{a("s03_vendor_detail")}
          {a("s03_vendor_assign")}{a("s03_vendor_assign_other")}{a("s03_cycle")}
          {a("s03_hk_types")}{a("s03_hk_types_other")}{a("s03_hk_create")}{a("s03_hk_create_other")}
          {a("s03_hk_checklists")}{a("s03_hk_checklists_other")}{a("s03_cleaners")}
          {a("s03_cleaner_assign")}{a("s03_cleaner_assign_other")}
          {a("s03_insp_types")}{a("s03_insp_types_other")}{a("s03_insp_who")}{a("s03_insp_who_other")}
          {a("s03_insp_checklist")}{a("s03_insp_checklist_other")}{a("s03_insp_auto")}{a("s03_insp_auto_other")}
          {a("s03_other")}{a("s03_extra")}
        </Sec>

        {/* S04 — Status */}
        <Sec number="04" title="Task Status & Completion Rules">
          {a("s04_flow")}{a("s04_flow_other")}{a("s04_flow_changes")}
          {a("s04_blocked_means")}{a("s04_blocked_means_other")}{a("s04_blocked_who")}{a("s04_blocked_who_other")}
          {a("s04_waiting_parts")}{a("s04_waiting_parts_other")}{a("s04_parts_who")}{a("s04_parts_who_other")}
          {a("s04_complete_who")}{a("s04_complete_who_other")}{a("s04_verify_who")}{a("s04_verify_who_other")}{a("s04_verify_types")}
          {a("s04_photo")}{a("s04_photo_other")}{a("s04_note")}{a("s04_note_other")}
          {a("s04_overdue")}{a("s04_overdue_other")}{a("s04_overdue_custom")}
          {a("s04_priority_urgent")}{a("s04_priority_high")}{a("s04_priority_medium")}{a("s04_priority_low")}
          {a("s04_extra")}
        </Sec>

        {/* S05 — Escalation */}
        <Sec number="05" title="Escalation Rules">
          {a("s05_accept_hours")}{a("s05_accept_notify")}{a("s05_accept_notify_other")}
          {a("s05_overdue_notify")}{a("s05_overdue_notify_other")}
          {a("s05_blocked_hours")}{a("s05_blocked_notify")}{a("s05_blocked_notify_other")}
          {a("s05_mgr_escalation")}{a("s05_sla")}{a("s05_sla_other")}{a("s05_sla_detail")}{a("s05_extra")}
        </Sec>

        {/* S06 — TravelNet */}
        <Sec number="06" title="TravelNet Integration">
          {a("s06_plan")}{a("s06_features")}{a("s06_features_other")}
          {a("s06_mobile")}{a("s06_mobile_other")}{a("s06_access")}{a("s06_access_other")}
          {a("s06_hk_trigger")}{a("s06_hk_trigger_other")}{a("s06_hk_hours")}
          {a("s06_task_data")}{a("s06_task_data_other")}{a("s06_extra")}
        </Sec>

        {/* S07 — Akia */}
        <Sec number="07" title="Akia Integration">
          {a("s07_triggers")}{a("s07_triggers_other")}
          {a("s07_auto")}{a("s07_auto_other")}
          {a("s07_reply")}{a("s07_reply_other")}{a("s07_reply_msg")}{a("s07_extra")}
        </Sec>

        {/* S08 — Notifications */}
        <Sec number="08" title="Notifications">
          {a("s08_channels")}{a("s08_channels_other")}{a("s08_tool")}{a("s08_tool_other")}
          {notifMatrix()}
          {a("s08_notif_notes")}{a("s08_quiet")}{a("s08_quiet_other")}{a("s08_quiet_from")}{a("s08_quiet_to")}
          {a("s08_volume")}{a("s08_volume_other")}{a("s08_volume_custom")}{a("s08_extra")}
        </Sec>

        {/* S09 — Inspections */}
        <Sec number="09" title="Inspection Templates">
          {["Move-in", "Move-out", "Periodic", "Damage"].map((type) => {
            const k = type.toLowerCase();
            const sections = fd[`s09_${k}_sections`];
            const photos = fd[`s09_${k}_photos`];
            const triggers = fd[`s09_${k}_triggers`];
            if (!sections && !photos && !triggers) return null;
            return (
              <div key={type} className="pb-3 mb-1 border-b border-white/[0.05]">
                <p className="text-[11px] font-semibold text-gray-400 mb-1">{type} Inspection</p>
                {sections && <Ans label="Checklist sections" value={sections} />}
                {photos && <Ans label="Items requiring photos" value={photos} />}
                {triggers && <Ans label="Items that auto-create a maintenance task" value={triggers} />}
              </div>
            );
          })}
          {a("s09_damage_form")}{a("s09_damage_form_other")}{a("s09_scoring")}{a("s09_scoring_other")}{a("s09_extra")}
        </Sec>

        {/* S10 — Branding */}
        <Sec number="10" title="Branding & UX">
          {a("s10_appname")}{a("s10_appname_custom")}{a("s10_logo")}{a("s10_logo_other")}
          {a("s10_colors")}{a("s10_colors_other")}{a("s10_language")}{a("s10_language_other")}
          {a("s10_tutorial")}{a("s10_tutorial_other")}{a("s10_devices")}{a("s10_devices_other")}
          {a("s10_offline")}{a("s10_offline_other")}{a("s10_extra")}
        </Sec>

        {/* S11 — Dashboard */}
        <Sec number="11" title="Manager Dashboard & Reporting">
          {a("s11_metrics")}{a("s11_metrics_other")}{a("s11_email_report")}{a("s11_email_report_other")}
          {a("s11_export")}{a("s11_export_other")}{a("s11_billing")}{a("s11_billing_other")}
          {a("s11_audit")}{a("s11_audit_other")}{a("s11_kpi_reports")}{a("s11_kpi_reports_other")}{a("s11_extra")}
        </Sec>

        {/* S12 — Deployment */}
        <Sec number="12" title="Production Deployment">
          {a("s12_domain")}{a("s12_domain_other")}{a("s12_domain_name")}
          {a("s12_connect")}{a("s12_connect_other")}{a("s12_accounts")}{a("s12_accounts_other")}
          {a("s12_sso")}{a("s12_sso_other")}{a("s12_compliance")}{a("s12_compliance_other")}
          {a("s12_retention")}{a("s12_retention_other")}{a("s12_tech_contact")}{a("s12_extra")}
        </Sec>

        {/* S13 — KPI */}
        <Sec number="13" title="Baseline KPI Data">
          {a("s13_payroll")}{a("s13_payroll_other")}{a("s13_cycle")}{a("s13_admin_hours")}
          {a("s13_photo_pct")}{a("s13_photo_pct_other")}{a("s13_reopen")}{a("s13_reopen_other")}
          {a("s13_verbal")}{a("s13_extra")}
        </Sec>

        {/* S14 — Open Questions */}
        <Sec number="14" title="Open Questions">
          {a("s14_closure")}{a("s14_closure_other")}{a("s14_closure_detail")}{a("s14_completed_def")}
          {a("s14_escalation")}{a("s14_escalation_other")}{a("s14_escalation_custom")}
          {(adminRows ?? []).some((r: any) => r.name) && (
            <div className="py-2.5 border-b border-white/[0.05]">
              <p className="text-[11px] text-gray-500 mb-1">Admin users</p>
              {(adminRows ?? []).filter((r: any) => r.name).map((r: any, i: number) => (
                <p key={i} className="text-sm text-gray-200">{r.name}{r.email ? ` · ${r.email}` : ""}</p>
              ))}
            </div>
          )}
          {a("s14_vendors")}{a("s14_vendors_other")}{a("s14_vendors_list")}
          {a("s14_guest_bypass")}{a("s14_guest_bypass_other")}{a("s14_guest_bypass_detail")}{a("s14_extra")}
        </Sec>

        <p className="text-gray-700 text-[11px] text-center pb-4">
          MonteKristo AI · Read-only view · Contact contact@montekristobelgrade.com to make changes.
        </p>
      </main>
    </div>
  );
};

export default LrmbResults;
