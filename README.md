# Close Assistant for Unimicro

**Unimicro Hackathon 2026 entry.** Month-end help for the 70 000 businesses on Unimicro, DNB Regnskap,
SpareBank 1 Regnskap, Eika Regnskap and Azets Complete: who to chase, how much cash you really have, and why the
revision check is red, explained in plain Norwegian with the fix ready to review.

| | |
|---|---|
| Plugin inside Unimicro | [`plugin/`](plugin/README.md) – page, dashboard widget, invoice/customer header tags, invoice-list column |
| MCP server + CLI for AI assistants | [`close-assistant/`](close-assistant/README.md) – the same logic as tools for Claude and other MCP clients |
| Research and notes | [`RESEARCH.md`](RESEARCH.md), [`SLACK-DIGEST.md`](SLACK-DIGEST.md), [`PLAN.md`](PLAN.md) |

## The three problems it solves

1. **Who should I chase, and with what?** Unimicro shows open invoices, but no aging, no priority and no advice.
   Close Assistant ages every open invoice, nets off customer payments that were never matched to an invoice
   (the demo company had 5.3 MNOK of those, which would have sent reminders to customers who had already paid),
   ranks customers, and proposes the next step under Norwegian practice: vennlig påminnelse → purring →
   inkassovarsel → inkasso. One click drafts the letter with Unimicro's built-in text generation.
2. **How much cash do I really have?** A 13-week rolling forecast from bank balance, open customer and supplier
   invoices and average fixed costs, with explicit collection assumptions and the low point highlighted.
3. **Why is the revision check red?** Unimicro's check lists seven rules and stops. Close Assistant reproduces the
   checks from the ledger, adds two of its own (unmatched payments, VAT returns not produced), and for each finding
   gives the cause, how to verify it, and a balanced correcting entry, ordered so root causes come first. In the
   demo company the two opening-balance errors turn out to be one unallocated prior-year result.

## How it is built

```
Unimicro web app ──► plugin views (Lit, native model, design-system components)
                        │  host.api → business API + statistics endpoint
                        ▼
                  shared domain logic (aging, dunning, forecast, revision remediation) – pure TypeScript, unit-tested
                        ▲
Claude / MCP clients ──► close-assistant MCP server (REST + statistics + Unimicro MCP proxy)
```

Everything is read as the signed-in user. Nothing is booked without Unimicro's own confirmation step.

## Try it

- Plugin: `cd plugin && npm install && unimicro login && unimicro plugin dev`, then open the link the CLI prints.
- MCP server: `cd close-assistant && npm install && npm run cli -- login mcp && npm run cli -- tool get_receivables_aging`.

Built during Unimicro Hackathon 2026 (5–15 September) by Jean-Nicolas Gilles Hopfer, a product designer who does
not write code. Claude did the heavy lifting; Jean-Nicolas added the sprinkles, the dark mode and the unsolicited
feedback. Demo page: `docs/` (GitHub Pages).
