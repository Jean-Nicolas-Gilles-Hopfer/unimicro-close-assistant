# Close Assistant – Unimicro plugin

Native plugin views for Unimicro (and the white-label systems built on it) that put receivables follow-up and
cash visibility where the accountant already works. Built for Unimicro Hackathon 2026.

| View | Where it appears | What it shows |
|---|---|---|
| `close-assistant` (page) | Salg menu → Close Assistant | KPIs (bank, receivables net of unmatched payments, real overdue, unmatched payments, 13-week low point), aging buckets, customers to chase first with the suggested dunning step and a "Lag tekst" button that drafts the reminder with Unimicro's built-in text generation, revision checks with explanations and proposed corrections, 13-week cash-flow forecast with assumptions |
| `cash-widget` (slot) | Dashboard → "Plugin widget" | Bank today, overdue receivables, customers to remind, low point and end balance of the forecast |
| `invoice-header` (slot) | Invoice details header | Days overdue and next step (vennlig påminnelse → purring → inkassovarsel → inkasso) |
| `customer-header` (slot) | Customer details header | Open and overdue balance for the customer, with the next step |
| `overdue-column` (column) | Invoice list | "Forfalt" column: days overdue as a coloured tag, from the row's own fields |

All data is read through `host.api` as the signed-in user; the statistics endpoint does the aggregation. Nothing is
written from these views. The pure domain logic (aging buckets, dunning steps, forecast) is shared with the
`close-assistant` MCP server in the repository root and is unit-tested there.

## Develop

```bash
npm install
unimicro login                 # once; picks the test company
unimicro plugin dev            # on Windows Git Bash: unimicro.cmd plugin dev
npm run check && npm test && unimicro plugin validate
```

Open the platform link the dev loop prints. The dashboard widget must be added once via the dashboard's
"Legg til eller fjern elementer" (Plugin widget small / large).

## Notes

- Dunning steps follow Norwegian practice: reminder after 14 days, inkassovarsel with 14-day deadline, then collection.
- Forecast assumptions (collection rates by lateness, fixed costs from accounts 5000–7999) are listed under
  "Forutsetninger" on the page.
