# Slack digest – UnimicroHackathon workspace (read 2026-09-11)

Channels: #announcements (Unimicro staff), #help (technical Q&A, most useful), #general (photos, one
discussion), #all-unimicrohackathon (kick-off, IP question, demo-data thread), #team-finding (one post).
Answers came from the Unimicro platform team; names are left out here.

## Platform updates (announcements)
- 6 Sept: new plugin deploy. WebSocket bug fixed. **Plugin Host now exposes the whole API environment**
  (statistics, files, ...). Skills updated: ask Claude for `unimicro plugin skills update`.
- 7 Sept: AI agent **"Micro"** enabled in demo companies ("Ask Micro" in toolbar, or full app from left menu).
- 10 Sept: plugin system update deployed. CLI auto-connects to the right environment for multi-dev plugins;
  better `help`; file upload/download and other media types via `host.api.request(...)`; slot views via
  `unimicro plugin add view` (now lists slots); **new slots**: header slot for order/invoice/customer/product,
  a new column in order and invoice lists, a new tab for order/invoice/customer/product.
  Upgrade: `npm i -g @unimicro/cli`, `npm upgrade`, `unimicro plugin skills update`.
  Wish list item accepted: multi-language for slots (dennis).

## Technical answers from #help
- **Dashboard widgets**: dashboard on test.unimicro.no has "Plugin widget small" and "Plugin widget large"
  slots. Create with `unimicro plugin add view --shape slot --slot dashboard.widget`; the plugin then renders
  inside the widget. (Unimicro platform team, 8 Sept)
- **Calling your own external API from a plugin**: allowed on test.unimicro.no today because the CSP is
  report-only; you must allow origin `https://test.unimicro.no` in your API's CORS. Production may later
  require a proxy; no timeline. (Unimicro platform team, 8 Sept)
- **ai-generate endpoint** (LLM proxy inside the business API, OpenAI-shaped) was switched on for the test
  environment on 9 Sept: `POST /api/biz/ai-generate?action=generate-text` with
  `{"Prompt": "...", "Temperature": 100, "TopPercentage": 99}`; `?action=check-has-ai` returns `hasAI`.
  Text only; for PDFs run OCR first and pass the text. (Unimicro platform team)
- **File upload from a plugin**: build a Blob + FormData with field `File` and
  `await this.host.api.post('~files/api/file?doocr=false', form)`. (Unimicro platform team, 9 Sept)
- **File image preview from a plugin** (page images of inbox files) is not supported yet; team working on
  file streaming, "ETA tomorrow" said 9 Sept. (Unimicro platform team)
- **Refresh tokens / offline_access** for a portal-registered client gave `invalid_scope`; Unimicro staff said
  it is a dev-portal bug, enabled it manually for that client, and warned: do not press Save in the dev
  portal afterwards or it disappears. Also choose roles/scopes per area (sales, accounting) rather than all
  sub-items. → We can ask for offline_access on our client the same way.
- **MCP write operations failing from Claude mobile voice mode**: likely the elicitation requirement;
  Unimicro checking. (Unimicro platform team)
- **Login**: developer.unimicro.no login works but dev-login.unimicro.no may reject the same account (6 replies,
  not read in full).
- Widgets vs plugin views: "own plugin type for widgets" planned so several integrations can contribute widgets.

## Demo data & seeding (#all-unimicrohackathon)
- Demo companies are thin, especially payroll. Import centre: `test.unimicro.no/#/import/page`; download the
  templates and let Claude fill them with synthetic data. One participant seeded suppliers, supplier
  invoices, employees and hours through the MCP server. If MCP lacks an entity, the Plugin CLI has access
  to all API endpoints. (Unimicro platform team, 7–8 Sept)

## Other
- IP question (a participant, 5 Sept): asked whether Unimicro can claim ownership of proprietary
  implementations; 2 replies not read. Hackathon terms: Unimicro may build similar concepts itself.
- Business-case sharing thread (#general): participants only; no submission-format info yet.
- No message yet about how to submit entries (deadline 15 Sept 23:59).

## Implications for our project
1. Track 1 is now realistic: dashboard widget slot for the cash-flow forecast and the receivables aging;
   invoice/customer header slot for "days overdue / suggested dunning step". Plugin Host can call statistics.
2. Our close-assistant MCP/REST server can be called from the plugin on test (CORS on our side).
3. ai-generate lets the plugin draft reminder texts server-side without our own LLM key.
4. Seed richer demo data (employees, payroll, bank statements) via the import centre if the forecast demo
   needs it.
5. Ask in #help for offline_access on our MCP-broker client id to remove the hourly re-login.

## Second pass (2026-09-11 afternoon)
- Channel directory confirms only five channels exist; all read. Slack search for "levere"/"submit" finds
  nothing beyond the kick-off deadline line: **no submission format has been announced yet**.
- IP: Unimicro platform team, 5 Sept: "Yes, you own your code."
- CLI 0.1.6 regression (a participant, 11 Sept): after upgrading, `unimicro plugin dev` said the plugin
  was not registered on the dev lane. Unimicro platform team: "lane"/"move-lane" only matter for people who used the CLI
  before 0.1.0; plugins should live on the **test** lane. Remove `"lane": "dev"` from `.unimicro/state.json`
  and make sure `unimicro.config.json` has `"lane": "test"`; commands default to the test lane.
- Docs question on CustomStorage (tore.myklebust, 7 Sept) - unanswered as far as read.
