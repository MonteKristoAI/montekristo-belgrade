# MonteKristo Onboarding Portal — Level 10

Interni AI-powered command center za MK tim. Deploy-uje se kao ruta `/onboarding/*` na `montekristobelgrade.com`.

**Samo za interno koriscenje.** Svi AI pozivi zahtevaju autentifikovanu sesiju.

---

## Level 10 differentiators vs Level 1

| Kapacitet | Level 1 | Level 10 |
|---|---|---|
| UI | Plain shadcn na svetloj pozadini | Dark "command center" sa glass cards, motion, gradient hero per klijent, coral accents |
| Navigacija | Top navbar + tabs | Fixed sidebar + breadcrumbs + CMD+K global search + motion-animated tab underline |
| Portfolio pregled | Grid cards | Service heatmap (klijent × servis) + health-colored cells + sort po health/activity |
| Health signal | Nema | 0-100 score po klijentu (blokeri, stare pitanja, dani bez ship-a, itd.) — HealthRing SVG na svakoj kartici |
| AI chat | Nema | Streaming Claude panel scoped per-klijent, full profil u system prompt-u, persisted history |
| AI growth ideas | Nema | Generator klika → 5 strukturisanih ideja sa impact/effort/tags → accept/reject u `mk_growth_ideas` |
| AI meeting prep | Nema | One-click pre-call brief generisan iz celog profila → MD download ili copy |
| Auto-enrichment | Manuelni unos | "Popuni iz URL-a" — PageSpeed + OG scraper + schema detector + CMS fingerprinting |
| Skill launchers | Nema | Svaki deliverable ima "Launch" dugme koje generise Claude Code prompt za odgovarajuci skill (/blog write, /meta-ads, /retell-agent-builder, /seo-audit, /montekristo-website, itd.) |
| Performance charts | Mini bar SVG | Recharts LineChart sa tooltipom + delta indikator |
| Activity feed | Per-klijent tab | Globalni activity feed + per-klijent tab + home feed widget |
| Empty states | Plain text | Framer-motion animated, icon + hint + optional action |
| Keyboard | Nema | CMD+K command palette, ESC, arrow navigation kroz palette |
| Design tokens | Ad-hoc | Centralizovana theme datoteka: bg, border, text, accent, status, health, shadow, motion |

---

## Arhitektura

```
src/pages/onboarding/
├── theme.ts                      ← design tokens + health/status/service helpers
├── components/
│   ├── primitives.tsx            ← Surface, Section, StatBlock, Pill, StatusPill, HealthRing, Sparkline, Skeleton, EmptyState, Kbd, inputCls, textareaCls, selectCls
│   ├── Layout.tsx                ← sidebar + topbar + breadcrumbs
│   ├── CommandPalette.tsx        ← cmdk-powered CMD+K palette
│   └── AIChatPanel.tsx           ← streaming Claude chat drawer
├── Dashboard.tsx                 ← KPI stats + heatmap + activity feed + client grid
├── Portfolio.tsx                 ← full portfolio heatmap (service × client matrix)
├── ActivityAll.tsx               ← global activity audit log
├── ClientDetail.tsx              ← gradient hero + 12 tabs + AI co-pilot
├── OnboardingLogin.tsx           ← dark auth screen
├── NewClient.tsx                 ← minimal onboarding form
├── OnboardingRoutes.tsx          ← protected routing shell
└── tabs/                         ← 12 tabs, all dark theme, inline-save
    ├── OverviewTab.tsx
    ├── BusinessTab.tsx           ← + AI growth ideas generator
    ├── WebPresenceTab.tsx        ← + auto-enrichment
    ├── IntegrationsTab.tsx       ← categorized + secret-masking
    ├── DeliverablesTab.tsx       ← Kanban + skill launchers
    ├── BrandVoiceTab.tsx
    ├── ContactsTab.tsx
    ├── DocumentsTab.tsx
    ├── PerformanceTab.tsx        ← Recharts
    ├── OpenQuestionsTab.tsx
    ├── ActivityTab.tsx
    └── MeetingPrepTab.tsx        ← + AI pre-call brief

src/lib/mk-onboarding/
├── supabase.ts                   ← separate Supabase client (mk-onboarding project)
├── useAuth.ts                    ← session hook
├── useClientData.ts              ← aggregate signals via react-query
├── useSavedField.tsx             ← debounced save + status badge
├── healthScore.ts                ← derived 0-100 health metric
├── buildClientContext.ts         ← full-profile markdown for AI context
└── skillLauncher.ts              ← deliverable type → Claude Code prompt

supabase/functions/
├── mk-ai-chat/index.ts           ← Anthropic streaming chat (SSE)
├── mk-growth-ideas/index.ts      ← One-shot 5-idea generator (structured JSON)
├── mk-meeting-prep/index.ts      ← Pre-call brief (markdown)
└── mk-enrich-web/index.ts        ← PageSpeed + OG scraper + CMS fingerprint
```

---

## Deploy edge funkcije (prvi put, ~5 min)

Pošto koriste Anthropic API, edge fn treba da bude deploy-ovana u Supabase projekt `tydafqhnzxmrpnclaxnl` sa `ANTHROPIC_API_KEY` kao secret-om.

### 1. Instaliraj Supabase CLI (ako nije)

```bash
brew install supabase/tap/supabase
```

### 2. Login + link projekt

```bash
cd /Users/milanmandic/Desktop/montekristo-web-forge
supabase login
supabase link --project-ref tydafqhnzxmrpnclaxnl
```

### 3. Dodaj secret

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-api03-... --project-ref tydafqhnzxmrpnclaxnl
```

Opciono (za PSI quota):

```bash
supabase secrets set PAGESPEED_API_KEY=AIza... --project-ref tydafqhnzxmrpnclaxnl
```

### 4. Deploy sve cetiri fn

```bash
supabase functions deploy mk-ai-chat --project-ref tydafqhnzxmrpnclaxnl
supabase functions deploy mk-growth-ideas --project-ref tydafqhnzxmrpnclaxnl
supabase functions deploy mk-meeting-prep --project-ref tydafqhnzxmrpnclaxnl
supabase functions deploy mk-enrich-web --project-ref tydafqhnzxmrpnclaxnl
```

Ili jedan `./deploy-edge-fns.sh` (pogledaj ispod).

### 5. Verifikuj

U portalu: otvori bilo kog klijenta → "AI co-pilot" → pitaj nesto. Ako odgovor dolazi, fn radi.
Ako dobijes gresku: `supabase functions logs mk-ai-chat --project-ref tydafqhnzxmrpnclaxnl --tail`.

---

## Vault sync

Kao u Lvl1 — hourly LaunchAgent + `_internal/scripts/sync-vault.ts`. Auto-commit-uje u `MonteKristo Vault/context/clients/`.

---

## Lokalni razvoj

```bash
cd /Users/milanmandic/Desktop/montekristo-web-forge
npm install
npm run dev  # http://localhost:8080/onboarding/login
```

---

## Data model

Vidi migracije `mk_onboarding_schema_v1` + `mk_fix_audit_trigger` u Supabase projekat `tydafqhnzxmrpnclaxnl`. 12 tabela pod `mk_` prefixom. Svi triger audit + updated_at. RLS kroz `mk_is_team_member()` policy helper.

---

## Keyboard

| Sta | Gde |
|---|---|
| `⌘K` / `Ctrl+K` | CMD+K command palette (globalni) |
| `ESC` | Zatvori palette / chat |
| `Enter` u chat-u | Salji poruku |
| `Shift+Enter` u chat-u | Novi red |

---

_Level 10 completed 2026-04-17 by Milan + Claude (MK CEO Agent)._
