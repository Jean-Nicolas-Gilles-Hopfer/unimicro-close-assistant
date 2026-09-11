# Unimicro Hackathon 2026 – Research Notes

_Compiled 2026-09-08. Deadline: **15 September 2026, 23:59**._

## What Unimicro is

Unimicro is a Norwegian ERP / accounting platform vendor (Bergen). One technical core
("Unimicro Platform") powers several white-labelled accounting systems:

| Environment | Base URL |
|---|---|
| Test | https://test.unimicro.no/ |
| Unimicro | https://app.unimicro.no/ |
| Unimicro SMB | https://smb.unimicro.no/ |
| DNB Regnskap | https://dnbregnskap.dnb.no/ |
| Eika Regnskap | https://system.eikaregnskap.no/ |
| Azets Complete | https://complete.azets.no/ |
| SpareBank 1 Regnskap (many regional banks) | e.g. https://regnskap.sb1.no/ – shared login https://login.regnskap.sparebank1.no |

Same REST endpoints everywhere, only the base URL differs. `GET {base}/api/endpoints` returns the
service map (AppFramework, Identity, Job, Files, Integration...). Marketplace reaches ~70 000 businesses.
Users: accounting firms (multi-client) and SMBs doing their own books. Domains: accounting
(journal entries, VAT, annual settlement, Altinn/A-melding), sales (quotes, orders, invoices, EHF,
reminders, debt collection), payroll (employees, wage types, payroll runs), bank (statements,
reconciliation, payments), time tracking, projects/dimensions, budgets, assets, files/OCR.

## Hackathon facts

- Tracks: (1) plugin/native view inside the accounting system, (2) MCP / AI skills / AI tools,
  (3) standalone app on REST API + webhooks. Mixing is encouraged.
- Prize pool 20 000 NOK; best entries shown at Unimicro Konferansen, Grieghallen 23–24 Sept;
  possible paid follow-up and marketplace publication. Norwegian or English accepted.
- Judging language: "most useful or interesting contributions" that solve a real user need.
- Sign-up: https://info.unimicro.no/unimicro-hackathon
- Slack: https://join.slack.com/t/unimicrohackathon/shared_invite/zt-48yxh3h41-dazO7tP8YgRkKOuqdHqbPQ
- Meetup Bergen.Works (7 Sept, already past): https://luma.com/hn9t4bpv
- Plugins are **early beta, not production-ready** – prototypes only.
- Unimicro keeps the right to build similar concepts themselves.

## Getting access (must be done by a human, once)

1. developer.unimicro.no → Sign In → **Log in with GitHub**. Developer licence + test company
   are created immediately (per the MCP guide). Portal: https://developer.unimicro.no/portal/applications
2. Test environment: https://test.unimicro.no/#/ (login server https://test-login.unimicro.no)
3. For MCP: activate the **"Unimicro Mcp"** product in the marketplace for the test company.
4. For a plugin: Portal → Create application → Create plugin → copy the generated setup prompt
   into Claude (installs Unimicro CLI, agent skills, project template).
5. For REST: Portal → Create application → settings (access level, auth flow, redirect URIs, scopes).

## Unimicro MCP

- Endpoint: `https://test-mcp.unimicro.app/mcp` (Streamable HTTP, OAuth; test env only).
- Confirmed reachable: unauthenticated POST returns 401 with
  `WWW-Authenticate: Bearer resource_metadata=.../.well-known/oauth-protected-resource/mcp`.
  Protected-resource metadata: authorization server `https://test-mcp.unimicro.app`,
  scopes `openid`, `McpUniMicro.All`. So standard MCP OAuth discovery should work in Claude clients.
- Claude Code: `claude mcp add --transport http unimicro https://test-mcp.unimicro.app/mcp`
  (a project `.mcp.json` with the same server is already in this folder).
- Claude Desktop: Settings → Connectors → Add custom connector → paste URL → Connect.
- Non-remote clients: `npx -y mcp-remote https://test-mcp.unimicro.app/mcp --transport http-only`.
- Tools (per docs, depends on server version/permissions): customer & supplier invoice queries,
  general-ledger summaries, customer lookup/contact details, account recommendations,
  invoice create/update.
- Your own app can be the MCP client: it owns sign-in, users see only what they may see in Unimicro.

## REST API essentials

- Auth: OAuth 2.0 / OIDC at `https://test-login.unimicro.no` (discovery at
  `/.well-known/openid-configuration`). Flows:
  - Server client: `client_credentials` + `private_key_jwt` client assertion (X.509 .p12 cert,
    RS256; jti/sub/iss=client_id, aud=token endpoint, ~1 min expiry). Acts on companies without a user.
  - Web app: authorization code + client_secret. Scope `AppFramework profile openid offline_access`.
  - SPA/mobile: authorization code + PKCE (oidc-client style, silent renew).
- Base API URL comes from the `AppFramework` claim in the access token.
- Companies: `GET {base}/api/init/companies` → use `Key` as `CompanyKey` header (required for
  multi-tenant clients).
- Business API: `{base}/api/biz/{entity}` e.g. `customers`, `orders`, `invoices`,
  `supplierinvoices`, `journalentries`, `products`, `employees`. OData-style query:
  `filter`, `select`, `expand`, `orderby`, `top`, `skip`, `hateoas`; operators eq/ne/gt/lt/ge/le/like,
  contains(), startswith(), endswith().
- Statistics endpoint (ad-hoc aggregation): `model`, `select` with count/sum/avg/min/max,
  casewhen, year()/month(), `filter`, `expand`, `join`, `orderby`, `top/skip`. Undocumented:
  HAVING, PIVOT, DISTINCT, RANGE.
- Webhooks: `Eventplan` (PlanType 0) + `EventSubscriber.Endpoint`; `OperationFilter` "CUD";
  `ExpressionFilter` e.g. `updated(CustomerInvoice,"StatusCode") and CustomerInvoice.StatusCode = 42004`.
  Signature header `Unimicro-Signature: t=<ts>, v1=<hmac-sha256(ts + "." + body)>`.
  Admin UI: `{base}/#/admin/flow/flows`. Scope `Webhook.Admin`.
- Files: multipart upload to the Files server (Token, Key=CompanyKey, File); OCR + conversion.
- Custom fields on entities; `CustomStorage` entity exists (useful for plugin state).
- Full entity list (~300 entities): https://developer.unimicro.no/docs (Swagger per entity, e.g. /docs/CustomerInvoice).

## Guide index (developer.unimicro.no/guide/...)

hackathon/{welcome, plugin-101, mcp, automation, buildUniMCP} · intro/{getting-started, environments,
going-to-production} · authentication/{overview, server, auth-code, pkce, postman} ·
api/{filtering, hypermedia, troubleshooting, dimensions, files, statistics, webhooks, custom-fields} ·
endpoints/{activation-flow, journal-entries, supplier-invoices, customers, contacts, products, orders,
invoices, invoice-sales, flows, factoring, users} · payroll/{payroll, employee, employment} ·
legal/{privacy, data-protection}. Older docs: https://unimicro.github.io/developer/

## Idea seeds (from Unimicro's own hints + gaps noticed)

- Overdue-invoice follow-up agent (MCP): ranks debtors, drafts reminders, suggests next step.
- Receipt-booking bot for Slack/Teams (Files upload + OCR + LedgerSuggestion + JournalEntry).
- Client portal for accounting firms: "how much do I owe and for what" via MCP as client.
- VAT / tax overview plugin (Unimicro's own demo – avoid copying, extend instead).
- Cash-flow forecast view: statistics on open invoices + supplier invoices + payroll runs + bank.
- Anomaly / audit assistant: AuditLog + JournalEntryLine statistics to flag odd postings before period close.
- Industry vertical plugin (they explicitly mention new verticals; they recently launched farm accounting).
- Webhook-driven automations (customer created → CRM, invoice paid → notify) as a low-effort track-3 entry.

## Unimicro MCP – verified 2026-09-08

Connected via `tools/unimicro-mcp.mjs` (own OAuth/PKCE client; dynamic client registration works;
token lifetime 1 h, **no refresh_token grant** – re-run `node tools/unimicro-mcp.mjs login` when expired).
Server: UniMCP 1.0.0.0. Demo company: "DEMO Jean-Nicolas Gilles Hopfer's company",
companyKey `910c715b-dd6c-40df-815c-30450254cb2a`, id 8639.

30 tools. Read: check_server_status, list_companies, find_customers, search_for_supplier, find_products,
search_for_journal_entry (max 10), get_trial_balance, get_income_statement, get_revisioncheck,
search_vat_code, suggest_account_for_entry (semantic), convert_currency, search_help_articles,
get_files_in_inbox, extract_text_from_file_ocr, vacation_search_tool, overtime_tool, hours_total, hours_reporting.
Write: create_invoice_draft, create_journal_entry, create_supplier, create_supplier_invoice,
journal_supplier_invoice, register_work_hours, edit_vacation_tool. UI helpers: create_table,
create_line_chart, create_bar_chart, create_pie_chart. Write tools use a confirmation_token round-trip.
Gaps noticed: no tool lists open/overdue customer invoices, no aging report, no bank/payment data,
no customer-level receivables, no budget, no dimensions/projects, no employees/payroll.

Demo data (2026): revenue 2.85 MNOK Jan–Aug on acct 3000, COGS 1.12 MNOK, only 3 P&L accounts,
7 balance accounts (1280, 1500 receivables 768k, 1920 bank 15.6M, 2400 AP 3.4M, 2700/2710 VAT).
~660 journal entries in 2026, mostly customer invoices + payments. ~11 suppliers, dozens of customers
(Nordic-sounding generated names), ~30 products (Nissan Leaf, Arbeidstimer, HSE items at 0 price).
Revision check flags: opening balance difference 8.81 MNOK, P&L accounts have opening balance,
acct 2710 positive balance (input VAT never settled → VAT reporting never run in demo).

## REST / statistics facts verified against the test env (2026-09-08)

- The MCP-broker access token is accepted by REST (`api/init/companies`, `api/biz/*`, `api/statistics`) with the
  `CompanyKey` header. No portal application needed.
- Statistics: `GET /api/statistics?model=..&select=..&expand=..&filter=..&wrap=false` returns a bare JSON array.
  Aliases via `Field as Name`. Spaces must be URL-encoded (curl `--get --data-urlencode`).
- CustomerInvoice StatusCode in demo: 42002 invoiced (333), 42003 partly paid (637), 42004 paid (482), 42006 credited (186).
  Open AR filter used: `StatusCode ne 42001 and StatusCode ne 42004 and StatusCode ne 42006 and RestAmount gt 0`.
  Expand `Customer.Info.DefaultEmail` gives `Info.Name`, `DefaultEmail.EmailAddress` (emails are null in demo data).
- SupplierInvoice: StatusCode 30104 journaled; PaymentStatus 30109 not paid (86 open, 3.43 MNOK = ledger 2400), 30112 paid.
- JournalEntryLine: `Account.AccountNumber`, `sum(Amount)`, `Period.No` (month), `Period.AccountYear`. Do NOT filter on
  StatusCode with `ne` (thousands of lines have null status and get dropped). Bank 1920 sum = trial balance.
- `Period.AccountPeriod` does not exist; `api/biz/periods` is 404. VatReport is empty for 2025-2026 in the demo.
- Demo receivables: 767 open invoices, 6.04 MNOK, 99% overdue (data spans 2022-2026), 142 customers.

## Unmatched customer payments (found 2026-09-11)
Unimicro's customer header "Forfalt" nets open receivables against payments/credit notes on the customer's
sub-ledger that are not matched to an invoice. Query (statistics): model=JournalEntryLine,
select=SubAccount.CustomerID as CustomerID,sum(RestAmount) as Credits, expand=SubAccount,
filter=SubAccount.CustomerID gt 0 and StatusCode ne 31003 and RestAmount lt 0. Demo company: 845 lines,
-5 274 740 NOK. Open invoices 6 042 470 - 5 274 740 = 767 730 = ledger 1500 balance exactly.
Net overdue 2 161 950 across 143 customers; 61 customers have paid more than they owe (unmatched).
Domain: buildAging(invoices, asOf, credits) -> netTotal/netOverdue per counterpart; priority and dunning use net.
