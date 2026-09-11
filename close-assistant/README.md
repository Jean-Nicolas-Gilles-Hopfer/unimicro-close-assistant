# Unimicro Close Assistant

Month-end close assistant for Unimicro-based accounting systems (Unimicro, DNB Regnskap, SpareBank 1 Regnskap,
Eika Regnskap, Azets Complete). It fills three gaps in what Unimicro MCP exposes today and packages them as an
MCP server any AI client can use, plus a CLI.

| Gap in Unimicro MCP | Tool added here |
|---|---|
| No open / overdue invoices, no aging | `get_open_invoices`, `get_receivables_aging`, `draft_payment_reminders` |
| No cash position or forecast | `get_cash_flow_forecast` (13-week rolling) |
| Revision check flags but never explains or fixes | `explain_revision_findings`, `book_correcting_entry` |

`unimicro_passthrough` forwards any call to Unimicro's hosted MCP (customers, income statement, account suggestions, ...).

## How it works

```
Claude Desktop / Claude Code / any MCP client
        │ stdio
        ▼
close-assistant (this repo)
        ├── Unimicro REST + statistics API  (OAuth PKCE)   ← invoices, payments, bank, opex
        └── Unimicro MCP (test-mcp.unimicro.app)          ← revision check, trial balance, booking with confirmation
```

Domain logic (`src/domain`) is pure and unit-tested. Data access (`src/services`) maps Unimicro entities to domain
inputs. Tools (`src/tools`) are thin adapters.

## Setup

```bash
npm install
cp .env.example .env        # set UNIMICRO_CLIENT_ID (PKCE client from developer.unimicro.no/portal) and UNIMICRO_COMPANY_KEY
npm run cli -- login mcp    # opens browser login for Unimicro MCP (token 1 h, no refresh)
npm run cli -- login rest   # opens browser login for the REST API
npm test
```

### Claude Desktop / Claude Code

```json
{ "mcpServers": { "close-assistant": { "command": "npx", "args": ["tsx", "D:/Projects/Unimicro/close-assistant/src/server.ts"] } } }
```

### CLI examples

```bash
npm run cli -- tool get_receivables_aging
npm run cli -- tool explain_revision_findings '{"year":2026}'
npm run cli -- umcp get_income_statement '{"year":2026}'
npm run cli -- stats model=CustomerInvoice select=count(ID) filter="RestAmount gt 0"
```

## Status

Hackathon prototype (Unimicro Hackathon 2026). REST field names for open invoices are taken from the public docs and
are verified against the test environment as part of the build. Nothing is booked without Unimicro's own confirmation step.
