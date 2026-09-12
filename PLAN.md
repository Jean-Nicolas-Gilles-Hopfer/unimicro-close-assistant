# Hackathon plan – "Close Assistant" for Unimicro

_Deadline 15 Sept 2026 23:59. Started 8 Sept._

## Thesis
Accountants and SMB owners lose the most time at month end: chasing unpaid invoices, guessing
cash position, and hunting for the cause of revision-check errors. Unimicro MCP already reads
the books and can book entries, but three things are missing. We add them.

## The three problems we fix
1. **Receivables blind spot** – no tool returns open/overdue customer invoices or an aging view.
   → `get_open_invoices`, `get_receivables_aging`, `draft_reminder` tools + a dunning agent.
2. **Cash position blind spot** – no bank, payment, budget or forecast data via MCP.
   → `get_cash_flow_forecast` (bank balance + open AR by due date + open AP by due date + recurring).
3. **Revision check without remedy** – `get_revisioncheck` flags seven fixed rules but never says
   why or how to fix. → `explain_revision_findings` that inspects the underlying accounts and
   proposes correcting journal entries, then books them through Unimicro's own
   `create_journal_entry` with confirmation.

## Architecture (track 2 + track 3, plugin-ready)
```
Claude Desktop / Claude Code / our web UI
        │  MCP (Streamable HTTP)
        ▼
  close-assistant MCP server (Node/TS, @modelcontextprotocol/sdk)
        ├── Unimicro REST API  (OAuth PKCE, api/biz + statistics)   ← invoices, payments, bank, budgets
        └── Unimicro MCP       (proxy for create_journal_entry etc.) ← booking with confirmation
```
- Layer 1: REST client + OAuth (PKCE public client, token cache, CompanyKey header).
- Layer 2: domain services (aging, forecast, revision explainer) – pure functions, unit-tested.
- Layer 3: MCP server exposing tools; optional composite "agent" prompts.
- Layer 4: web dashboard (Vite + React) that calls the same services; can be wrapped as a
  Unimicro plugin view later if the portal setup prompt is obtained.

## Milestones
- D1 (8 Sept): access + research ✔, plan, REST client working against test env.
- D2: aging + open invoices tools; unit tests on fixtures from demo data.
- D3: cash-flow forecast; revision explainer with proposed correcting entries.
- D4: MCP server end-to-end in Claude Desktop; dunning agent flow (draft reminders).
- D5: web dashboard; polish; README, demo video script.
- D6–7: buffer, plugin wrapping if feasible, submission.

## Open questions
- Does the MCP-broker token work against REST? (audience says no – confirm with fresh token)
- Portal application: need client_id for a PKCE client with redirect http://localhost:8766/callback.
- Submission format (Unimicro said "more info coming").

## Submission (info.unimicro.no/hackaton/submission, read 2026-09-11)
Form fields: Fornavn, Etternavn, E-post*, Konseptbeskrivelse* (plain-language concept description), URL til demo,
URL til video (optional, <1 min, landscape, consent to marketing use; share via Dropbox-style download link).
Deadline 15 Sept 23:59. Best entries shown on stage at Unimicro Next, Grieghallen 23-24 Sept.
Implications:
- The demo must be reachable by URL. Plan: public GitHub repo with README + a hosted demo page (static dashboard
  fed by a snapshot of the demo company, plus screenshots/GIF of the plugin inside test.unimicro.no) and the video.
- Concept description drafted in Norwegian and English, non-technical, 150-250 words: problem, what it does,
  what is new, how it uses Unimicro (MCP + REST + plugin slots).
- Video: 45-55 s screen recording of the plugin widget + Claude asking the close assistant, face optional.

## Progress 11 Sept
- Slack read; digest in SLACK-DIGEST.md. Submission form found (see above).
- Unimicro CLI installed, logged in, plugin "Close Assistant" scaffolded in ./plugin (id close-assistant).
- Plugin views built and verified live in test.unimicro.no: overview page (KPIs, aging, chase list, 13-week
  forecast), dashboard widget, invoice header tag, customer header tag, invoice list "Forfalt" column.
- Next: dashboard widget check, seed richer demo data, revision-check card (via REST or close-assistant server),
  reminder drafting via ai-generate, README/demo/video, offline_access request in Slack.
- 11 Sept (later): unmatched customer payments discovered (5.27 MNOK in demo); netting added to aging, dunning,
  plugin headers/widget/page and forecast (FIFO). Customer header now equals Unimicro's own Forfalt figure.
- 11 Sept (evening): revision checks computed natively in the plugin via statistics (same figures as Unimicro's
  MCP get_revisioncheck) + two own checks (unmatched payments, VAT returns), with explanations and proposed
  entries; reminder drafting via ai-generate in a drawer. Problem 1-3 all have a first implementation.
- 12 Sept: repo initialised (personal identity), revision texts in bokmål, all views verified live.
  Remaining: root README, concept text NO/EN, GitHub publish (personal account via gh auth login),
  GitHub Pages demo (docs/ with snapshot), video script, optional demo-data seeding.
- 12 Sept: migrated to the personal GitHub developer account. New contract 1884, demo company "DEMO JN's company"
  (26d93f12-e3a2-40f5-9cb6-123e1fab5594), application "Close Assistant" (927cf365-e9ab-428e-842c-3793ed0f5761),
  plugin id close-assistant-app (old id is reserved by the old contract). Dashboard widget must be re-added in the
  new company; Unimicro MCP product must be activated there; Slack thread needs the new application details.
