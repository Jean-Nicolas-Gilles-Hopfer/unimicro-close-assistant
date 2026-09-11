/** MCP tool definitions for the Close Assistant server. */
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { config } from "../config.js";
import { UnimicroRest } from "../unimicro/rest.js";
import { UnimicroMcp } from "../unimicro/mcp-client.js";
import { NeedsLoginError } from "../unimicro/auth.js";
import { buildAging, applyCreditsFifo, suggestDunningStep, BUCKET_LABELS, type CounterpartAging } from "../domain/aging.js";
import { buildForecast } from "../domain/forecast.js";
import { remediate, entriesBalance, type DraftLine } from "../domain/revision.js";
import { fetchOpenReceivables, fetchOpenPayables, fetchBankBalance, fetchMonthlyOpex, fetchTrialBalance, fetchRevisionReport, fetchUnappliedCredits } from "../services/ledger.js";

/** Open receivables together with unmatched customer credits, as one aging report. */
async function agingFor(r: UnimicroRest, asOf: string) {
  const [inv, credits] = await Promise.all([fetchOpenReceivables(r), fetchUnappliedCredits(r)]);
  return buildAging(inv, asOf, credits);
}

const today = () => new Date().toISOString().slice(0, 10);
const companyKeyArg = z.string().optional().describe("Company key (GUID). Defaults to UNIMICRO_COMPANY_KEY.");

function ok(payload: unknown, text?: string) {
  return { content: [{ type: "text" as const, text: text ?? JSON.stringify(payload, null, 2) }], structuredContent: payload as Record<string, unknown> };
}
function fail(e: unknown) {
  const msg = e instanceof NeedsLoginError ? e.message : e instanceof Error ? e.message : String(e);
  return { content: [{ type: "text" as const, text: `Error: ${msg}` }], isError: true };
}
const rest = (companyKey?: string) => new UnimicroRest({ companyKey: companyKey ?? config.companyKey });
const mcp = new UnimicroMcp();

function reminderText(cp: CounterpartAging, step: string, companyName: string): string {
  const lines = cp.invoices.filter((i) => i.daysOverdue > 0).map((i) => `  - Faktura ${i.invoiceNumber}, forfalt ${i.dueDate}, utestående ${i.restAmount.toFixed(2)} NOK`).join("\n");
  const total = cp.overdue.toFixed(2);
  switch (step) {
    case "friendly_reminder":
      return `Hei ${cp.counterpartName},\n\nVi kan ikke se å ha mottatt betaling for følgende faktura(er):\n${lines}\n\nTotalt utestående: ${total} NOK. Dersom betalingen allerede er sendt, ber vi deg se bort fra denne henvendelsen.\n\nMed vennlig hilsen\n${companyName}`;
    case "reminder_with_fee":
      return `Purring\n\n${cp.counterpartName},\n\nFølgende faktura(er) er forfalt til betaling:\n${lines}\n\nTotalt utestående: ${total} NOK. Purregebyr etter inkassoforskriften kan tilkomme. Vennligst betal innen 14 dager.\n\nMed vennlig hilsen\n${companyName}`;
    case "debt_collection_notice":
      return `INKASSOVARSEL\n\n${cp.counterpartName},\n\nTil tross for tidligere purring er følgende faktura(er) fortsatt ubetalt:\n${lines}\n\nTotalt utestående: ${total} NOK. Dersom beløpet ikke er betalt innen 14 dager fra dato, vil kravet bli sendt til inkasso, jf. inkassoloven § 9. Ytterligere omkostninger vil da påløpe.\n\nMed vennlig hilsen\n${companyName}`;
    case "send_to_collection":
      return `Internt notat: ${cp.counterpartName} har krav ${total} NOK som er ${cp.oldestDaysOverdue} dager forfalt og har passert inkassovarsel-fristen. Anbefaling: overfør til inkassobyrå. Fakturaer:\n${lines}`;
    default:
      return "";
  }
}

export type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

type ToolConfig<S extends z.ZodRawShape> = { title: string; description: string; inputSchema: S };
type Def = <S extends z.ZodRawShape>(name: string, cfg: ToolConfig<S>, handler: (args: z.infer<z.ZodObject<S>>) => Promise<unknown>) => void;

/** Registers the tools on an MCP server; also returns the handlers so the CLI can call them directly. */
export function registerTools(server?: McpServer): Record<string, ToolHandler> {
  const handlers: Record<string, ToolHandler> = {};
  const def: Def = (name, cfg, handler) => {
    // The CLI bypasses MCP, so validate and apply defaults with the same schema the server uses.
    const schema = z.object(cfg.inputSchema);
    handlers[name] = (args) => handler(schema.parse(args) as never);
    server?.registerTool(name, cfg as never, handler as never);
  };
  defineTools(def);
  return handlers;
}

function defineTools(def: Def): void {
  def("get_open_invoices", {
    title: "Open customer invoices",
    description: "Lists unpaid customer invoices (rest amount > 0) with due date and days overdue. Optionally filter to overdue only or to one customer.",
    inputSchema: { companyKey: companyKeyArg, overdueOnly: z.boolean().optional().default(false), customerId: z.number().int().optional(), asOf: z.string().optional().describe("yyyy-MM-dd, default today") },
  }, async ({ companyKey, overdueOnly, customerId, asOf }) => {
    try {
      const report = await agingFor(rest(companyKey), asOf ?? today());
      let items = report.counterparts.flatMap((c) => c.invoices);
      if (customerId) items = items.filter((i) => i.counterpartId === customerId);
      if (overdueOnly) items = items.filter((i) => i.daysOverdue > 0);
      return ok({ asOf: report.asOf, count: items.length, totalRest: items.reduce((s, i) => s + i.restAmount, 0), invoices: items });
    } catch (e) { return fail(e); }
  });

  def("get_receivables_aging", {
    title: "Receivables aging report",
    description: "Aging of open customer invoices in buckets (not due, 1-30, 31-60, 61-90, 90+ days) with per-customer totals, unmatched customer payments netted off (netOverdue, as Unimicro's own Forfalt figure does), a chase priority (0-100) and the suggested dunning step under Norwegian practice. Also reports how much money sits in payments never matched to an invoice.",
    inputSchema: { companyKey: companyKeyArg, asOf: z.string().optional(), topCustomers: z.number().int().min(1).max(100).optional().default(15) },
  }, async ({ companyKey, asOf, topCustomers }) => {
    try {
      const report = await agingFor(rest(companyKey), asOf ?? today());
      const customers = report.counterparts.slice(0, topCustomers).map((c) => ({ ...c, invoices: undefined, suggestedStep: suggestDunningStep(c) }));
      return ok({ ...report, bucketLabels: BUCKET_LABELS, counterparts: customers, customerCount: report.counterparts.length });
    } catch (e) { return fail(e); }
  });

  def("draft_payment_reminders", {
    title: "Draft payment reminders",
    description: "Drafts Norwegian reminder texts (vennlig påminnelse, purring, inkassovarsel) for the customers that need chasing, chosen from their oldest overdue invoice. Nothing is sent; texts are returned for review.",
    inputSchema: { companyKey: companyKeyArg, asOf: z.string().optional(), customerId: z.number().int().optional(), maxCustomers: z.number().int().min(1).max(50).optional().default(10), senderName: z.string().optional().default("Regnskapsavdelingen") },
  }, async ({ companyKey, asOf, customerId, maxCustomers, senderName }) => {
    try {
      const report = await agingFor(rest(companyKey), asOf ?? today());
      const targets = report.counterparts.filter((c) => c.netOverdue > 0 && (!customerId || c.counterpartId === customerId)).slice(0, maxCustomers);
      const drafts = targets.map((c) => { const s = suggestDunningStep(c); return { customerId: c.counterpartId, customer: c.counterpartName, email: c.invoices.find((i) => i.emailAddress)?.emailAddress, overdue: c.overdue, unmatchedCredits: c.credits, netOverdue: c.netOverdue, oldestDaysOverdue: c.oldestDaysOverdue, step: s.step, rationale: s.rationale, text: reminderText(c, s.step, senderName) }; });
      return ok({ asOf: report.asOf, count: drafts.length, drafts });
    } catch (e) { return fail(e); }
  });

  def("get_cash_flow_forecast", {
    title: "13-week cash-flow forecast",
    description: "Weekly cash forecast from bank balance, open customer invoices (with collection assumptions), open supplier invoices and average fixed costs. Reports the lowest projected balance and the week it occurs.",
    inputSchema: { companyKey: companyKeyArg, asOf: z.string().optional(), weeks: z.number().int().min(4).max(26).optional().default(13), monthlyFixedCosts: z.number().optional().describe("Override the fixed-cost estimate (default: average of accounts 5000-7999 this year)"), vatSettlements: z.array(z.object({ date: z.string(), amount: z.number() })).optional() },
  }, async ({ companyKey, asOf, weeks, monthlyFixedCosts, vatSettlements }) => {
    try {
      const r = rest(companyKey); const as = asOf ?? today(); const year = Number(as.slice(0, 4));
      const [gross, credits, payables, bank, opex] = await Promise.all([fetchOpenReceivables(r), fetchUnappliedCredits(r), fetchOpenPayables(r), fetchBankBalance(r), fetchMonthlyOpex(r, year)]);
      // Payments already received but not matched to an invoice must not be forecast as inflows again.
      const receivables = applyCreditsFifo(gross, credits);
      const fixed = monthlyFixedCosts ?? Math.abs(opex.average);
      const f = buildForecast({ asOf: as, bankBalance: bank.total, receivables, payables, monthlyFixedCosts: fixed, vatSettlements, weeks });
      return ok({ ...f, inputs: { bankAccounts: bank.accounts, openReceivablesGross: gross.length, openReceivablesAfterCredits: receivables.length, unmatchedCredits: [...credits.values()].reduce((a, b) => a + b, 0), openPayables: payables.length, monthlyFixedCosts: fixed, opexMonths: opex.months } });
    } catch (e) { return fail(e); }
  });

  def("explain_revision_findings", {
    title: "Explain and remediate revision-check findings",
    description: "Runs Unimicro's revision check for a year, then explains each error/warning in plain language, lists likely causes and diagnostics, and proposes balanced correcting journal entries (as draft lines, not booked). Findings are ordered so root causes come first.",
    inputSchema: { companyKey: companyKeyArg, year: z.number().int().optional() },
  }, async ({ companyKey, year }) => {
    try {
      const ck = companyKey ?? config.companyKey; const y = year ?? new Date().getFullYear();
      const [rev, tb] = await Promise.all([fetchRevisionReport(mcp, ck, y), fetchTrialBalance(mcp, ck, y).catch(() => [])]);
      const remediations = remediate(rev.sections, { year: y, trialBalance: tb, asOf: today() });
      return ok({ year: y, errorCount: rev.errorCount, warningCount: rev.warningCount, remediations, note: "Use book_correcting_entry to book a proposed entry after an accountant has approved it." });
    } catch (e) { return fail(e); }
  });

  def("book_correcting_entry", {
    title: "Book a correcting journal entry (via Unimicro MCP, with confirmation)",
    description: "Books a balanced set of draft lines as one journal entry through Unimicro's own create_journal_entry tool, which enforces its confirmation step. Pass confirmationToken on the second call when Unimicro answers confirmation_required.",
    inputSchema: {
      companyKey: companyKeyArg,
      lines: z.array(z.object({ accountNumber: z.number().int(), amount: z.number(), description: z.string(), financialDate: z.string(), vatTypeId: z.number().int().nullable().optional() })).min(2),
      confirmationToken: z.string().optional(),
    },
  }, async ({ companyKey, lines, confirmationToken }) => {
    try {
      if (!entriesBalance(lines as DraftLine[])) return fail(new Error("Lines do not balance to zero."));
      const args: Record<string, unknown> = { companyKey: companyKey ?? config.companyKey, lines, description: lines[0].description, financial_date: lines[0].financialDate };
      if (confirmationToken) args.confirmation_token = confirmationToken;
      const r = await mcp.call("create_journal_entry", args);
      return ok(UnimicroMcp.payload(r));
    } catch (e) { return fail(e); }
  });

  def("unimicro_passthrough", {
    title: "Call any Unimicro MCP tool",
    description: "Escape hatch: call a tool on Unimicro's hosted MCP server by name (e.g. find_customers, get_income_statement, suggest_account_for_entry) with JSON arguments.",
    inputSchema: { name: z.string(), arguments: z.record(z.string(), z.unknown()).optional().default({}) },
  }, async ({ name, arguments: args }) => {
    try { return ok(UnimicroMcp.payload(await mcp.call(name, { companyKey: config.companyKey, ...args }))); } catch (e) { return fail(e); }
  });
}
