import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Plus, Trash2, Upload, ChevronRight, ClipboardList } from "lucide-react";
import { SESSION_KEY } from "@/pages/Reports";

type FormData = Record<string, any>;
interface StaffRow { name: string; email: string; phone: string; role: string; properties: string; }
interface AdminRow { name: string; email: string; }

const LS_KEY = "mk_lrmb_onboarding_v1";
const LS_SUBMITTED_KEY = "mk_lrmb_submitted";

const SECTIONS = [
  { id: "s01", label: "01 · Properties" }, { id: "s02", label: "02 · Staff" },
  { id: "s03", label: "03 · Task Types" }, { id: "s04", label: "04 · Status & Completion" },
  { id: "s05", label: "05 · Escalation" }, { id: "s06", label: "06 · TravelNet" },
  { id: "s07", label: "07 · Akia" }, { id: "s08", label: "08 · Notifications" },
  { id: "s09", label: "09 · Inspections" }, { id: "s10", label: "10 · Branding & UX" },
  { id: "s11", label: "11 · Dashboard" }, { id: "s12", label: "12 · Deployment" },
  { id: "s13", label: "13 · KPI Baseline" }, { id: "s14", label: "14 · Open Questions" },
  { id: "del", label: "Deliverables" },
];

const NOTIF_EVENTS = ["Task assigned","Task overdue","Task blocked","Task completed","Verification needed","New urgent task"];
const NOTIF_ROLES = ["Field Staff","Admin","Supervisor","Manager"];

const DELIVERABLES = [
  { key: "del_properties", label: "Property list with addresses", format: "Excel / CSV", priority: "Critical" },
  { key: "del_staff", label: "Staff roster with emails and phones", format: "Excel", priority: "Critical" },
  { key: "del_inspection", label: "Inspection checklist(s)", format: "PDF / Word / Excel", priority: "Critical" },
  { key: "del_housekeeping", label: "Housekeeping checklist", format: "PDF / Word", priority: "Critical" },
  { key: "del_logo", label: "LRMB logo", format: "PNG / SVG", priority: "High" },
  { key: "del_travelnet", label: "TravelNet documentation or IT contact", format: "Link / PDF / Text", priority: "High" },
  { key: "del_kpi", label: "Baseline KPI data", format: "Any format", priority: "Medium" },
  { key: "del_damage", label: "Sample damage report (anonymized)", format: "PDF / Word", priority: "Medium" },
];

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────

const RadioOpt = ({ name, value, checked, onChange, label }: { name: string; value: string; checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div onClick={onChange} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${checked ? "border-blue-500 bg-blue-500" : "border-gray-600 group-hover:border-gray-400"}`}>
      {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

const CheckOpt = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div onClick={onChange} className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${checked ? "border-blue-500 bg-blue-500" : "border-gray-600 group-hover:border-gray-400"}`}>
      {checked && <Check className="w-2.5 h-2.5 text-white" />}
    </div>
    <span className="text-gray-300 text-sm">{label}</span>
  </label>
);

const FL = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="mb-2">
    <p className="text-sm font-medium text-gray-200">{children}</p>
    {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
  </div>
);

const SC = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-xs font-bold bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20 flex-shrink-0">{number}</span>
      <h2 className="text-white font-semibold text-base">{title}</h2>
    </div>
    {children}
  </div>
);

const Hr = () => <div className="border-t border-white/[0.06] my-1" />;

const TI = ({ value, onChange, placeholder = "", type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) => (
  <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors" />
);

const TA = ({ value, onChange, placeholder = "", rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) => (
  <textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors resize-none" />
);

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const LrmbOnboarding = () => {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [activeSection, setActiveSection] = useState("s01");
  const [formData, setFormData] = useState<FormData>({});
  const [staffRows, setStaffRows] = useState<StaffRow[]>([{ name: "", email: "", phone: "", role: "field_staff", properties: "" }]);
  const [adminRows, setAdminRows] = useState<AdminRow[]>([{ name: "", email: "" }]);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (sessionStorage.getItem(SESSION_KEY) !== "lrmb") { navigate("/reports", { replace: true }); return; }
    setAuthorized(true);
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        if (p.formData) setFormData(p.formData);
        if (p.staffRows?.length) setStaffRows(p.staffRows);
        if (p.adminRows?.length) setAdminRows(p.adminRows);
        if (p.fileNames) setFileNames(p.fileNames);
      } catch {}
    }
    if (localStorage.getItem(LS_SUBMITTED_KEY) === "true") setSubmitted(true);
  }, [navigate]);

  const triggerSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(LS_KEY, JSON.stringify({ formData, staffRows, adminRows, fileNames }));
      const n = new Date();
      setSavedAt(`${n.getHours()}:${String(n.getMinutes()).padStart(2, "0")}`);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 1800);
    }, 500);
  }, [formData, staffRows, adminRows, fileNames]);

  useEffect(() => { triggerSave(); }, [formData, staffRows, adminRows, fileNames, triggerSave]);

  const set = (key: string, value: any) => setFormData((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: string, opt: string) => {
    const cur: string[] = formData[key] ?? [];
    set(key, cur.includes(opt) ? cur.filter((v) => v !== opt) : [...cur, opt]);
  };
  const isChk = (key: string, opt: string): boolean => (formData[key] ?? []).includes(opt);

  // ── Helper: radio group with auto "Other + textbox" ─────────────────────────
  const rg = (field: string, label: string, options: string[], hint?: string) => (
    <div>
      <FL hint={hint}>{label}</FL>
      <div className="flex flex-col gap-2 mb-2">
        {[...options, "Other"].map((opt) => (
          <RadioOpt key={opt} name={field} value={opt} checked={formData[field] === opt} onChange={() => set(field, opt)} label={opt} />
        ))}
      </div>
      {formData[field] === "Other" && (
        <div className="ml-6 mt-1">
          <TI value={formData[`${field}_other`] ?? ""} onChange={(v) => set(`${field}_other`, v)} placeholder="Please specify..." />
        </div>
      )}
    </div>
  );

  // ── Helper: checkbox group with auto "Other + textbox" ──────────────────────
  const cbg = (field: string, label: string, options: string[], hint?: string) => (
    <div>
      <FL hint={hint}>{label}</FL>
      <div className="flex flex-col gap-2">
        {[...options, "Other"].map((opt) => (
          <CheckOpt key={opt} checked={isChk(field, opt)} onChange={() => toggle(field, opt)} label={opt} />
        ))}
      </div>
      {isChk(field, "Other") && (
        <div className="ml-6 mt-2">
          <TI value={formData[`${field}_other`] ?? ""} onChange={(v) => set(`${field}_other`, v)} placeholder="Please specify..." />
        </div>
      )}
    </div>
  );

  const scrollToTab = (id: string) => {
    setActiveSection(id);
    if (tabsRef.current) {
      const btn = tabsRef.current.querySelector(`[data-section="${id}"]`) as HTMLElement;
      if (btn) btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextSection = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
    if (idx < SECTIONS.length - 1) scrollToTab(SECTIONS[idx + 1].id);
  };

  if (!authorized) return null;

  if (submitted) return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mb-6">
        <Check className="w-7 h-7 text-green-400" />
      </div>
      <h1 className="text-2xl font-bold mb-3">Questionnaire Submitted</h1>
      <p className="text-gray-400 text-center max-w-sm leading-relaxed mb-8">Thank you! Your answers have been saved. We'll review everything and be in touch within 24 hours.</p>
      <button onClick={() => navigate("/reports")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Reports
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-white/[0.07]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/reports")} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Reports</span>
            </button>
            <span className="text-gray-700 hidden sm:inline">|</span>
            <span className="text-gray-400 text-xs sm:text-sm truncate">LRMB — Production Onboarding</span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs transition-opacity duration-300 ${showSaved ? "opacity-100" : "opacity-0"}`}>
            <Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Saved {savedAt}</span>
          </div>
        </div>
        <div ref={tabsRef} className="flex gap-2 overflow-x-auto px-4 sm:px-6 pb-3 scrollbar-hide">
          {SECTIONS.map((s) => (
            <button key={s.id} data-section={s.id} onClick={() => scrollToTab(s.id)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${activeSection === s.id ? "bg-blue-600 text-white font-semibold" : "bg-white/[0.05] text-gray-400 hover:bg-white/[0.09] hover:text-gray-200"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2"><ClipboardList className="w-5 h-5 text-blue-400" /><span className="text-blue-300 text-xs font-bold uppercase tracking-widest">LRMB</span></div>
          <h1 className="text-2xl font-bold">Production Onboarding</h1>
          <p className="text-gray-500 text-sm mt-1">Please complete all sections at your own pace — your answers save automatically.</p>
        </div>

        {/* ── S01 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s01" && (
          <SC number="01" title="Properties & Units">
            <div><FL>Total properties managed by LRMB?</FL><TI type="number" value={formData.s01_total ?? ""} onChange={(v) => set("s01_total", v)} placeholder="e.g. 45" /></div>
            <Hr />
            <div><FL>Properties going into Phase 1 production deployment?</FL><TI type="number" value={formData.s01_phase1 ?? ""} onChange={(v) => set("s01_phase1", v)} placeholder="e.g. 20" /></div>
            <Hr />
            {rg("s01_proplist", "Do you have an existing property list you can share?", ["Yes — Excel/CSV file", "Yes — TravelNet export", "No, we'll build it together"])}
            <Hr />
            {rg("s01_regions", "Are properties organized by region or zone? (e.g. South Beach, Mid-Beach)", ["Yes", "No"])}
            {formData.s01_regions === "Yes" && (
              <div className="ml-6 -mt-2"><TI value={formData.s01_regions_list ?? ""} onChange={(v) => set("s01_regions_list", v)} placeholder="List the regions / zones..." /></div>
            )}
            <Hr />
            <div><FL>Average number of units per property?</FL><TI type="number" value={formData.s01_units ?? ""} onChange={(v) => set("s01_units", v)} placeholder="e.g. 1" /></div>
            <Hr />
            {rg("s01_names", "Should we use the same property names as in TravelNet?", ["Yes, same names", "No, we use different names", "We'll confirm later"])}
            <Hr />
            {rg("s01_ids", "Do you use internal property IDs or codes?", ["Yes", "No"])}
          </SC>
        )}

        {/* ── S02 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s02" && (
          <SC number="02" title="Staff Roster">
            <div>
              <FL hint="Add every staff member who will use the app. You can also upload an Excel file in the Deliverables section.">Staff members</FL>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.06]">
                      {["Name","Email","Phone","Role","Properties covered",""].map((h) => <th key={h} className="text-left pb-2 pr-3 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {staffRows.map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.04]">
                        {(["name","email","phone"] as const).map((f) => (
                          <td key={f} className="pr-2 py-2">
                            <input value={row[f]} onChange={(e) => { const n=[...staffRows]; n[i]={...n[i],[f]:e.target.value}; setStaffRows(n); }}
                              className="w-full min-w-[90px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08] text-gray-200 text-xs outline-none focus:border-blue-500/50" />
                          </td>
                        ))}
                        <td className="pr-2 py-2">
                          <select value={row.role} onChange={(e) => { const n=[...staffRows]; n[i]={...n[i],role:e.target.value}; setStaffRows(n); }}
                            className="w-full min-w-[120px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08] text-gray-200 text-xs outline-none focus:border-blue-500/50">
                            <option value="field_staff">Field Staff</option><option value="admin">Admin</option>
                            <option value="supervisor">Supervisor</option><option value="manager">Manager</option>
                          </select>
                        </td>
                        <td className="pr-2 py-2">
                          <input value={row.properties} onChange={(e) => { const n=[...staffRows]; n[i]={...n[i],properties:e.target.value}; setStaffRows(n); }}
                            className="w-full min-w-[110px] px-2 py-1.5 rounded bg-white/[0.05] border border-white/[0.08] text-gray-200 text-xs outline-none focus:border-blue-500/50" />
                        </td>
                        <td className="py-2">{staffRows.length > 1 && <button onClick={() => setStaffRows(staffRows.filter((_,j)=>j!==i))} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setStaffRows([...staffRows,{name:"",email:"",phone:"",role:"field_staff",properties:""}])}
                className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add staff member
              </button>
            </div>
            <Hr />
            {cbg("s02_creates", "Who creates tasks today?", ["Admin","Supervisor","Both Admin and Supervisor"])}
            <Hr />
            {cbg("s02_reassign", "Who can reassign a task to a different staff member?", ["Admin","Supervisor","Manager"])}
            <Hr />
            {cbg("s02_verify", "Who can verify and close a task?", ["Field Staff (self-close)","Admin","Supervisor","Manager"])}
            <Hr />
            {rg("s02_coverage", "Are staff assigned to specific properties or do they cover all?", ["Assigned to specific properties","Cover all properties","Mixed — some assigned, some cover all"])}
            <Hr />
            {rg("s02_vendors", "Do you have external vendors or contractors who need app access?", ["Yes","No","Maybe in the future"])}
            {formData.s02_vendors === "Yes" && (
              <div className="ml-6 -mt-2"><TA value={formData.s02_vendors_detail ?? ""} onChange={(v) => set("s02_vendors_detail", v)} placeholder="Describe which vendors and what access level..." /></div>
            )}
            <Hr />
            <div><FL>How many people need access to the admin dashboard?</FL><TI type="number" value={formData.s02_admin_count ?? ""} onChange={(v) => set("s02_admin_count", v)} placeholder="e.g. 4" /></div>
          </SC>
        )}

        {/* ── S03 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s03" && (
          <SC number="03" title="Task Types & Categories">
            <p className="text-xs text-gray-500 -mt-2">Maintenance</p>
            <div><FL>List your 10 most common maintenance task types</FL><TA value={formData.s03_maint ?? ""} onChange={(v) => set("s03_maint", v)} placeholder={"1. AC issue\n2. Plumbing\n3. Broken appliance\n4. ..."} rows={6} /></div>
            <Hr />
            {rg("s03_vendor_tasks", "Do you have vendor-specific tasks (e.g. HVAC contractor, pool service)?", ["Yes","No"])}
            {formData.s03_vendor_tasks === "Yes" && (
              <div className="ml-6 -mt-2"><TA value={formData.s03_vendor_detail ?? ""} onChange={(v) => set("s03_vendor_detail", v)} placeholder="List them..." /></div>
            )}
            <Hr />
            {rg("s03_vendor_assign", "Who assigns vendors to tasks?", ["Admin","Supervisor","Either Admin or Supervisor"])}
            <Hr />
            <div><FL>Average maintenance task cycle time today? (estimate)</FL><TI value={formData.s03_cycle ?? ""} onChange={(v) => set("s03_cycle", v)} placeholder="e.g. 2–3 days, or varies by type" /></div>
            <Hr />
            <p className="text-xs text-gray-500">Housekeeping</p>
            {cbg("s03_hk_types", "Which types of housekeeping tasks do you use?", ["Checkout clean","Mid-stay clean","Deep clean","Turnover"])}
            <Hr />
            {rg("s03_hk_create", "Who creates housekeeping tasks today?", ["Admin creates them manually","TravelNet auto-generates them","Both"])}
            <Hr />
            {rg("s03_hk_checklists", "Do you have housekeeping checklists you can share?", ["Yes","No","We'll prepare them"])}
            <Hr />
            <div><FL>How many cleaners are on your roster?</FL><TI type="number" value={formData.s03_cleaners ?? ""} onChange={(v) => set("s03_cleaners", v)} placeholder="e.g. 8" /></div>
            <Hr />
            {rg("s03_cleaner_assign", "Are cleaners assigned to specific properties?", ["Yes, assigned to specific properties","No, available by rotation","Mixed"])}
            <Hr />
            <p className="text-xs text-gray-500">Inspections</p>
            {cbg("s03_insp_types", "Which inspection types do you perform?", ["Move-in","Move-out","Periodic","Damage","Guest-ready"])}
            <Hr />
            {cbg("s03_insp_who", "Who performs inspections?", ["Supervisor","Dedicated inspector","Field staff"])}
            <Hr />
            {rg("s03_insp_checklist", "Do you have a standardized inspection checklist?", ["Yes","No","Still in progress"])}
            <Hr />
            {rg("s03_insp_auto", "Should a flagged inspection item automatically create a maintenance task?", ["Yes, we want this","No","Undecided"])}
            <Hr />
            <div><FL>Any other task types not covered above?</FL><TA value={formData.s03_other ?? ""} onChange={(v) => set("s03_other", v)} placeholder="Describe any general or miscellaneous task types..." /></div>
          </SC>
        )}

        {/* ── S04 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s04" && (
          <SC number="04" title="Task Status & Completion Rules">
            <div className="bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06] text-xs text-gray-400">
              Our status flow: <span className="text-gray-200">new → assigned → in_progress → waiting_parts → blocked → completed → verified</span>
            </div>
            {rg("s04_flow", "Does this status flow match your operations?", ["Yes, this is perfect","Mostly — minor changes needed","Needs significant changes"])}
            {(formData.s04_flow === "Mostly — minor changes needed" || formData.s04_flow === "Needs significant changes") && (
              <div className="ml-6 -mt-2"><TA value={formData.s04_flow_changes ?? ""} onChange={(v) => set("s04_flow_changes", v)} placeholder="What would you change?" /></div>
            )}
            <Hr />
            {cbg("s04_blocked_means", '"Blocked" means: (select all that apply)', ["Missing parts or materials","Waiting for approval","Vendor no-show","Guest issue / access problem"])}
            <Hr />
            {cbg("s04_blocked_who", "Who can mark a task as blocked?", ["Field staff","Admin","Both"])}
            <Hr />
            {rg("s04_waiting_parts", 'Do you use the "waiting_parts" status?', ["Yes","No","We'll decide later"])}
            <Hr />
            {rg("s04_parts_who", "Who orders parts/materials?", ["Admin","Supervisor","Field staff","External vendor"])}
            <Hr />
            {cbg("s04_complete_who", "Who can mark a task as completed?", ["Field staff","Admin","Both"])}
            <Hr />
            {rg("s04_verify_who", "Who verifies completed tasks?", ["Supervisor — always","Admin","Only for specific task types","No verification step needed"])}
            {formData.s04_verify_who === "Only for specific task types" && (
              <div className="ml-6 -mt-2"><TA value={formData.s04_verify_types ?? ""} onChange={(v) => set("s04_verify_types", v)} placeholder="Which task types require verification?" /></div>
            )}
            <Hr />
            {rg("s04_photo", "Is a photo required to close a task?", ["Required for all task types","Required for maintenance only","Required for inspections only","Optional","Not required"])}
            <Hr />
            {rg("s04_note", "Is a note required to close a task?", ["Required for all task types","Required for blocked / issue tasks","Optional","Not required"])}
            <Hr />
            {rg("s04_overdue", 'When does a task become "overdue"?', ["24 hours after creation","48 hours after creation","72 hours after creation","Depends on priority level","Custom threshold"])}
            {formData.s04_overdue === "Custom threshold" && (
              <div className="ml-6 -mt-2"><TI value={formData.s04_overdue_custom ?? ""} onChange={(v) => set("s04_overdue_custom", v)} placeholder="Describe your threshold..." /></div>
            )}
            <Hr />
            <div>
              <FL hint="Define each level and how quickly it needs to be resolved.">Priority level definitions</FL>
              <div className="space-y-3">
                {["Urgent","High","Medium","Low"].map((lvl) => (
                  <div key={lvl} className="flex gap-3 items-start">
                    <span className={`text-xs font-semibold mt-2.5 w-14 flex-shrink-0 ${lvl==="Urgent"?"text-red-400":lvl==="High"?"text-orange-400":lvl==="Medium"?"text-yellow-400":"text-gray-400"}`}>{lvl}</span>
                    <TI value={formData[`s04_priority_${lvl.toLowerCase()}`] ?? ""} onChange={(v) => set(`s04_priority_${lvl.toLowerCase()}`, v)} placeholder="Definition + target close time..." />
                  </div>
                ))}
              </div>
            </div>
          </SC>
        )}

        {/* ── S05 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s05" && (
          <SC number="05" title="Escalation Rules">
            <div><FL>If a task is assigned but not accepted, after how many hours should someone be notified?</FL><TI type="number" value={formData.s05_accept_hours ?? ""} onChange={(v) => set("s05_accept_hours", v)} placeholder="e.g. 2" /></div>
            {cbg("s05_accept_notify", "Who gets notified when a task isn't accepted?", ["Admin","Supervisor","Manager"])}
            <Hr />
            {cbg("s05_overdue_notify", "When a task becomes overdue, who gets notified?", ["Admin","Supervisor","Manager"])}
            <Hr />
            <div><FL>If a task stays blocked, after how many hours should it escalate?</FL><TI type="number" value={formData.s05_blocked_hours ?? ""} onChange={(v) => set("s05_blocked_hours", v)} placeholder="e.g. 4" /></div>
            {cbg("s05_blocked_notify", "Who gets notified for a blocked escalation?", ["Admin","Supervisor","Manager"])}
            <Hr />
            <div><FL>Are there situations where a Manager (executive level) must be notified directly?</FL><TA value={formData.s05_mgr_escalation ?? ""} onChange={(v) => set("s05_mgr_escalation", v)} placeholder="e.g. guest safety issue, damage above $X, VIP guest complaint..." /></div>
            <Hr />
            {rg("s05_sla", "Do you have SLA commitments to guests for certain repair types?", ["Yes","No"])}
            {formData.s05_sla === "Yes" && (
              <div className="ml-6 -mt-2"><TA value={formData.s05_sla_detail ?? ""} onChange={(v) => set("s05_sla_detail", v)} placeholder="e.g. AC repairs: within 4 hours, plumbing: within 2 hours..." /></div>
            )}
          </SC>
        )}

        {/* ── S06 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s06" && (
          <SC number="06" title="TravelNet Integration">
            <div><FL>Which TravelNet plan or package do you use?</FL><TI value={formData.s06_plan ?? ""} onChange={(v) => set("s06_plan", v)} placeholder="e.g. TravelNet Full Suite, or unsure" /></div>
            <Hr />
            {cbg("s06_features", "Which TravelNet features do you actively use?", ["Reservations","Housekeeping management","Maintenance work orders","Channel management","Owner statements","Accounting"])}
            <Hr />
            {rg("s06_mobile", "Does your team use the TravelNet mobile app?", ["Yes, regularly","Sometimes","No","Unsure"])}
            <Hr />
            {rg("s06_access", "Can you provide TravelNet access or documentation for our integration setup?", ["Yes, we'll arrange access","We'll share the documentation","Not sure what's available — we'll check"], "We'll handle the technical setup — we just need credentials or docs to review.")}
            <Hr />
            {rg("s06_hk_trigger", "When should a housekeeping task be automatically created?", ["At the checkout event","X hours before checkout","When a reservation is confirmed","At checkout + mid-stay for long reservations"])}
            {formData.s06_hk_trigger === "X hours before checkout" && (
              <div className="ml-6 -mt-2"><TI type="number" value={formData.s06_hk_hours ?? ""} onChange={(v) => set("s06_hk_hours", v)} placeholder="Hours before checkout" /></div>
            )}
            <Hr />
            {cbg("s06_task_data", "What reservation data should appear in the housekeeping task?", ["Guest name","Checkout time","Check-in time","Property and unit","Special instructions"])}
          </SC>
        )}

        {/* ── S07 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s07" && (
          <SC number="07" title="Akia Integration">
            {cbg("s07_triggers", "Which guest message types should automatically create a task?", ["AC / HVAC issue","Plumbing problem","No hot water","Broken appliance","Noise complaint","Safety concern"])}
            <Hr />
            {rg("s07_auto", "Should task creation be automatic or require admin review?", ["Fully automatic — create task immediately","Manual review first — admin decides","Automatic for urgent, manual review for others"])}
            <Hr />
            {rg("s07_reply", "Should guests receive an automatic reply when their task is created?", ["Yes","No","Undecided"])}
            {formData.s07_reply === "Yes" && (
              <div className="ml-6 -mt-2"><TA value={formData.s07_reply_msg ?? ""} onChange={(v) => set("s07_reply_msg", v)} placeholder='Draft auto-reply message... e.g. "Thank you for letting us know. Our team is on it."' /></div>
            )}
          </SC>
        )}

        {/* ── S08 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s08" && (
          <SC number="08" title="Notifications">
            {cbg("s08_channels", "Which notification channels are acceptable for your team?", ["In-app push notification","SMS","Email","WhatsApp"])}
            <Hr />
            {rg("s08_tool", "Do you use a team communication tool?", ["Slack","Microsoft Teams","WhatsApp group","No tool currently"])}
            <Hr />
            <div>
              <FL hint="Check each role that should receive notifications for that event.">Notification matrix — who gets notified per event?</FL>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/[0.06]">
                      <th className="text-left pb-2 font-medium pr-4 min-w-[130px]">Event</th>
                      {NOTIF_ROLES.map((r) => <th key={r} className="text-center pb-2 font-medium px-2">{r}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {NOTIF_EVENTS.map((event) => (
                      <tr key={event} className="border-b border-white/[0.04]">
                        <td className="py-2.5 pr-4 text-gray-300">{event}</td>
                        {NOTIF_ROLES.map((role) => {
                          const key = `s08_notif_${event}_${role}`;
                          return (
                            <td key={role} className="text-center py-2.5 px-2">
                              <div onClick={() => set(key, !formData[key])} className={`w-4 h-4 rounded border-2 flex items-center justify-center mx-auto cursor-pointer transition-colors ${formData[key] ? "border-blue-500 bg-blue-500" : "border-gray-600 hover:border-gray-400"}`}>
                                {formData[key] && <Check className="w-2.5 h-2.5 text-white" />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3">
                <FL>Additional notes on the notification matrix</FL>
                <TA value={formData.s08_notif_notes ?? ""} onChange={(v) => set("s08_notif_notes", v)} placeholder="e.g. Manager should only be notified for urgent tasks..." rows={2} />
              </div>
            </div>
            <Hr />
            {rg("s08_quiet", "Do you want quiet hours (no notifications during certain times)?", ["Yes","No"])}
            {formData.s08_quiet === "Yes" && (
              <div className="ml-6 -mt-2 flex items-center gap-3">
                <TI value={formData.s08_quiet_from ?? ""} onChange={(v) => set("s08_quiet_from", v)} placeholder="From (e.g. 22:00)" />
                <span className="text-gray-500 flex-shrink-0">to</span>
                <TI value={formData.s08_quiet_to ?? ""} onChange={(v) => set("s08_quiet_to", v)} placeholder="To (e.g. 07:00)" />
              </div>
            )}
            <Hr />
            {rg("s08_volume", "Notification volume preference", ["All events — notify for everything","Critical only — urgent and overdue","Custom — specify below"])}
            {formData.s08_volume === "Custom — specify below" && (
              <div className="ml-6 -mt-2"><TA value={formData.s08_volume_custom ?? ""} onChange={(v) => set("s08_volume_custom", v)} placeholder="Describe which events should trigger notifications..." /></div>
            )}
          </SC>
        )}

        {/* ── S09 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s09" && (
          <SC number="09" title="Inspection Templates">
            <p className="text-xs text-gray-500 -mt-2 mb-1">For each type, describe checklist sections, items needing photos, and items that should auto-create a maintenance task. You can also upload existing checklists in Deliverables.</p>
            {["Move-in","Move-out","Periodic","Damage"].map((type) => (
              <div key={type}>
                <FL>{type} Inspection</FL>
                <div className="space-y-2">
                  <TA value={formData[`s09_${type.toLowerCase()}_sections`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_sections`, v)} placeholder={`Checklist sections (e.g. Kitchen, Bathrooms, Bedroom, Exterior...)`} rows={2} />
                  <TA value={formData[`s09_${type.toLowerCase()}_photos`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_photos`, v)} placeholder={`Items requiring photos...`} rows={2} />
                  <TA value={formData[`s09_${type.toLowerCase()}_triggers`] ?? ""} onChange={(v) => set(`s09_${type.toLowerCase()}_triggers`, v)} placeholder={`Items that should auto-create a maintenance task if flagged...`} rows={2} />
                </div>
                <Hr />
              </div>
            ))}
            {rg("s09_damage_form", "Do you have a separate damage report form different from the standard inspection?", ["Yes, it's a different form","No, same checklist","We don't have one yet"])}
            <Hr />
            {rg("s09_scoring", "What scoring system do you prefer for inspections?", ["1–5 scale","Pass / Fail checkmark","Both (score + pass/fail)","Haven't decided yet"])}
          </SC>
        )}

        {/* ── S10 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s10" && (
          <SC number="10" title="Branding & UX">
            {rg("s10_appname", "What should field staff see as the app name?", ["LRMB Field Ops","AiiA","Custom name"])}
            {formData.s10_appname === "Custom name" && (
              <div className="ml-6 -mt-2"><TI value={formData.s10_appname_custom ?? ""} onChange={(v) => set("s10_appname_custom", v)} placeholder="Your preferred app name..." /></div>
            )}
            <Hr />
            {rg("s10_logo", "Do you have an LRMB logo to use in the app?", ["Yes — uploading in Deliverables","No logo yet","We'll provide it later"])}
            <Hr />
            {rg("s10_colors", "Brand colors for the app?", ["Yes, use LRMB brand colors (we'll share them)","Use MonteKristo AI default design","Open to suggestions"])}
            <Hr />
            {cbg("s10_language", "What language should the app use?", ["English only","Spanish only","Both English and Spanish"])}
            <Hr />
            {rg("s10_tutorial", "Do field staff need an in-app onboarding tutorial when they first log in?", ["Yes, definitely","No","Nice to have"])}
            <Hr />
            {cbg("s10_devices", "Which devices do field staff use?", ["iOS (iPhone)","Android","Both iOS and Android"])}
            <Hr />
            {rg("s10_offline", "Is the app expected to work offline?", ["Always online — no offline needed","Sometimes offline","Frequently offline"])}
          </SC>
        )}

        {/* ── S11 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s11" && (
          <SC number="11" title="Manager Dashboard & Reporting">
            {cbg("s11_metrics", "Which metrics are most important to see every day?", ["Open tasks count","Overdue tasks","Task completion rate","Staff workload by person","Status by property","Blocked tasks","Verification queue"])}
            <Hr />
            {rg("s11_email_report", "Do you need a scheduled email summary report?", ["Daily summary","Weekly summary","Both daily and weekly","Not needed"])}
            <Hr />
            {cbg("s11_export", "Do you need data export functionality?", ["CSV export","PDF export","Neither — not needed"])}
            <Hr />
            {rg("s11_billing", "Do you need cost / billing tracking per task? (vendor costs, materials)", ["Yes","No","Future consideration"])}
            <Hr />
            {rg("s11_audit", "Do you need an audit trail to review historical task activity?", ["Yes, very important","Nice to have","Not needed"])}
            <Hr />
            {rg("s11_kpi_reports", "Do you need weekly or monthly KPI reports?", ["Weekly KPI report","Monthly KPI report","Both","Not needed"])}
          </SC>
        )}

        {/* ── S12 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s12" && (
          <SC number="12" title="Production Deployment">
            <div>
              <FL>Which domain should the app be hosted on?</FL>
              <div className="flex flex-col gap-2 mb-3">
                <RadioOpt name="s12_domain" value="lovable" checked={formData.s12_domain === "lovable"} onChange={() => set("s12_domain","lovable")} label="Use Lovable subdomain (e.g. lrmb.lovable.app) — free, instant, no setup" />
                <RadioOpt name="s12_domain" value="custom" checked={formData.s12_domain === "custom"} onChange={() => set("s12_domain","custom")} label="Use our own custom domain (e.g. ops.lrmb.com)" />
                <RadioOpt name="s12_domain" value="Other" checked={formData.s12_domain === "Other"} onChange={() => set("s12_domain","Other")} label="Other" />
              </div>
              {formData.s12_domain === "custom" && (
                <div className="ml-6 space-y-3">
                  <TI value={formData.s12_domain_name ?? ""} onChange={(v) => set("s12_domain_name", v)} placeholder="Your domain (e.g. ops.lrmb.com)" />
                  <p className="text-xs text-gray-500">How will you connect the domain?</p>
                  <div className="flex flex-col gap-2">
                    <RadioOpt name="s12_connect" value="provide_login" checked={formData.s12_connect === "provide_login"} onChange={() => set("s12_connect","provide_login")} label="We'll provide GoDaddy / registrar login — you connect it for us" />
                    <RadioOpt name="s12_connect" value="self_connect" checked={formData.s12_connect === "self_connect"} onChange={() => set("s12_connect","self_connect")} label="We'll connect it ourselves — we have DNS / IT access" />
                    <RadioOpt name="s12_connect" value="Other" checked={formData.s12_connect === "Other"} onChange={() => set("s12_connect","Other")} label="Other" />
                    {formData.s12_connect === "Other" && <div className="ml-6"><TI value={formData.s12_connect_other ?? ""} onChange={(v) => set("s12_connect_other", v)} placeholder="Please specify..." /></div>}
                  </div>
                </div>
              )}
              {formData.s12_domain === "Other" && <div className="ml-6 mt-1"><TI value={formData.s12_domain_other ?? ""} onChange={(v) => set("s12_domain_other", v)} placeholder="Please specify..." /></div>}
            </div>
            <Hr />
            {rg("s12_accounts", "Who manages user accounts (create / remove) in production?", ["We manage it ourselves","MonteKristo AI manages it for us","Shared — we handle most, you help with setup"])}
            <Hr />
            {cbg("s12_sso", "Do you need Single Sign-On (SSO)?", ["Google SSO","Microsoft SSO","Not needed"])}
            <Hr />
            {cbg("s12_compliance", "Security or compliance requirements?", ["None — standard security is fine","Data backup required","Custom data retention policy"])}
            <Hr />
            {rg("s12_retention", "How long should task history be retained?", ["1 year","2 years","Indefinitely","Unsure — open to recommendation"])}
            <Hr />
            <div><FL>Primary technical contact for production issues</FL><TI value={formData.s12_tech_contact ?? ""} onChange={(v) => set("s12_tech_contact", v)} placeholder="Name and email address" /></div>
          </SC>
        )}

        {/* ── S13 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s13" && (
          <SC number="13" title="Baseline KPI Data">
            <p className="text-xs text-gray-500 -mt-2 mb-1">We need this before deployment to measure the improvement we achieve. Estimates are fine.</p>
            {rg("s13_payroll", "Do you have payroll / hours data for field staff from the past month?", ["Yes, we can share it","No","We have approximate figures"])}
            <Hr />
            <div><FL>Average maintenance task cycle time today? (estimate)</FL><TI value={formData.s13_cycle ?? ""} onChange={(v) => set("s13_cycle", v)} placeholder="e.g. 2 days for minor, 4–5 days for major" /></div>
            <Hr />
            <div><FL>How many admin hours per week go into task coordination? (follow-up calls, status checks)</FL><TI type="number" value={formData.s13_admin_hours ?? ""} onChange={(v) => set("s13_admin_hours", v)} placeholder="e.g. 10" /></div>
            <Hr />
            {rg("s13_photo_pct", "What percentage of tasks are closed with a photo today?", ["0%","Less than 25%","25–50%","50–75%","75% or more","Unknown"])}
            <Hr />
            {rg("s13_reopen", "What percentage of tasks get reopened (reopen rate)?", ["Less than 5%","5–15%","15–30%","More than 30%","Unknown"])}
            <Hr />
            <div><FL>How many times per day does admin verbally ask "did you finish that task?"</FL><TI type="number" value={formData.s13_verbal ?? ""} onChange={(v) => set("s13_verbal", v)} placeholder="e.g. 5" /></div>
          </SC>
        )}

        {/* ── S14 ──────────────────────────────────────────────────────────── */}
        {activeSection === "s14" && (
          <SC number="14" title="Open Questions">
            {rg("s14_closure", "Who owns task closure? (who has the final say that a task is done)", ["Field staff — they mark it done, that's final","Admin must confirm for all tasks","Depends on the task type"])}
            {formData.s14_closure === "Depends on the task type" && (
              <div className="ml-6 -mt-2"><TA value={formData.s14_closure_detail ?? ""} onChange={(v) => set("s14_closure_detail", v)} placeholder="Explain which types require admin confirmation..." /></div>
            )}
            <Hr />
            <div><FL>What exactly does "completed" mean for each task type?</FL><TA value={formData.s14_completed_def ?? ""} onChange={(v) => set("s14_completed_def", v)} placeholder={"Maintenance: all items fixed + photo taken.\nHousekeeping: all checklist items checked.\nInspection: ..."} rows={4} /></div>
            <Hr />
            {cbg("s14_escalation", "What triggers an escalation?", ["Time elapsed (task not progressing)","Priority level (all urgent tasks)","Task type (certain categories)","Combination of factors","Custom logic"])}
            {isChk("s14_escalation","Custom logic") && (
              <div className="ml-6 mt-2"><TA value={formData.s14_escalation_custom ?? ""} onChange={(v) => set("s14_escalation_custom", v)} placeholder="Describe the custom escalation logic..." /></div>
            )}
            <Hr />
            <div>
              <FL hint="These are the people who will have Admin access to the dashboard.">Admin users (name + email)</FL>
              <div className="space-y-2">
                {adminRows.map((row, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input value={row.name} onChange={(e) => { const n=[...adminRows]; n[i]={...n[i],name:e.target.value}; setAdminRows(n); }} placeholder="Full name"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50" />
                    <input value={row.email} onChange={(e) => { const n=[...adminRows]; n[i]={...n[i],email:e.target.value}; setAdminRows(n); }} placeholder="Email address"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder-gray-600 outline-none focus:border-blue-500/50" />
                    {adminRows.length > 1 && <button onClick={() => setAdminRows(adminRows.filter((_,j)=>j!==i))} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>}
                  </div>
                ))}
              </div>
              <button onClick={() => setAdminRows([...adminRows,{name:"",email:""}])} className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add admin
              </button>
            </div>
            <Hr />
            {rg("s14_vendors", "Do you have a vendor / contractor list that should be added to the system?", ["Yes","No","We'll provide it later"])}
            {formData.s14_vendors === "Yes" && (
              <div className="ml-6 -mt-2"><TA value={formData.s14_vendors_list ?? ""} onChange={(v) => set("s14_vendors_list", v)} placeholder="List vendors / contractors..." /></div>
            )}
            <Hr />
            {rg("s14_guest_bypass", "What happens when a guest complains directly to a manager, bypassing the system?", ["Manager enters it into the app — it becomes a task","Handled outside the system entirely","Hybrid — sometimes in, sometimes out"])}
            <div className="mt-2"><TA value={formData.s14_guest_bypass_detail ?? ""} onChange={(v) => set("s14_guest_bypass_detail", v)} placeholder="Any additional context..." rows={2} /></div>
          </SC>
        )}

        {/* ── DELIVERABLES ─────────────────────────────────────────────────── */}
        {activeSection === "del" && (
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/20">Deliverables</span>
                <h2 className="text-white font-semibold text-base">Files We Need From You</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1 mb-6">Check each item you have ready, attach the file, and add a Google Drive link or notes. Email all files to <span className="text-gray-300">hello@montekristoai.com</span>.</p>
              <div className="space-y-5">
                {DELIVERABLES.map((item) => {
                  const readyKey = `${item.key}_ready`;
                  const notesKey = `${item.key}_notes`;
                  return (
                    <div key={item.key} className={`rounded-xl border p-4 transition-colors ${formData[readyKey] ? "border-green-500/30 bg-green-500/5" : "border-white/[0.08] bg-white/[0.02]"}`}>
                      <div className="flex items-start gap-3">
                        <div onClick={() => set(readyKey, !formData[readyKey])} className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer transition-colors ${formData[readyKey] ? "border-green-500 bg-green-500" : "border-gray-600 hover:border-gray-400"}`}>
                          {formData[readyKey] && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium text-gray-200">{item.label}</p>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.priority==="Critical"?"bg-red-500/15 text-red-400 border border-red-500/20":item.priority==="High"?"bg-orange-500/15 text-orange-400 border border-orange-500/20":"bg-gray-500/15 text-gray-400 border border-gray-500/20"}`}>{item.priority}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{item.format}</p>
                          <div className="mt-3 space-y-2">
                            <label className={`flex items-center gap-2 text-xs cursor-pointer px-3 py-2 rounded-lg border transition-colors ${fileNames[item.key] ? "border-blue-500/30 bg-blue-500/5 text-blue-300" : "border-white/[0.08] text-gray-500 hover:border-gray-500 hover:text-gray-400"}`}>
                              <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                              {fileNames[item.key] || "Select file"}
                              <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileNames((prev) => ({ ...prev, [item.key]: f.name })); }} />
                            </label>
                            <input value={formData[notesKey] ?? ""} onChange={(e) => set(notesKey, e.target.value)} placeholder="Notes or Google Drive link..."
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-gray-200 text-xs placeholder-gray-600 outline-none focus:border-blue-500/50 transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-center">
              <h3 className="text-white font-semibold mb-2">Ready to submit?</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Once you submit, your answers will be saved and we'll begin reviewing within 24 hours. You can still return and update your answers after submitting.</p>
              <button onClick={() => { localStorage.setItem(LS_SUBMITTED_KEY,"true"); setSubmitted(true); }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm transition-all duration-150">
                <Check className="w-4 h-4" /> Submit Questionnaire
              </button>
              <p className="text-gray-700 text-xs mt-4">Your answers are auto-saved — you can close this tab and return later.</p>
            </div>
          </div>
        )}

        {activeSection !== "del" && (
          <div className="flex justify-end pt-2">
            <button onClick={nextSection} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/[0.05]">
              Next section <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-gray-700 text-[11px] text-center mt-6 pb-4">Prepared by MonteKristo AI · Answers are saved locally and only visible to you and your team.</p>
      </main>
    </div>
  );
};

export default LrmbOnboarding;
