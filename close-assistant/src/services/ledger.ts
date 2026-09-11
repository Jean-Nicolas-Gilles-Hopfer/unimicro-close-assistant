/**
 * Data access: turns Unimicro REST/statistics results into domain inputs.
 * Field names follow developer.unimicro.no/docs (CustomerInvoice, SupplierInvoice, JournalEntryLine).
 */
import { UnimicroRest } from "../unimicro/rest.js";
import { UnimicroMcp } from "../unimicro/mcp-client.js";
import type { OpenInvoice } from "../domain/aging.js";
import type { RevisionSection, TrialBalanceRow } from "../domain/revision.js";

// CustomerInvoice status codes (SoftRig/Unimicro): 42001 draft, 42002 invoiced, 42003 partly paid, 42004 paid, 42005 sold, 42006 credited
export const CUSTOMER_INVOICE_OPEN_FILTER = "StatusCode ne 42001 and StatusCode ne 42004 and StatusCode ne 42006 and RestAmount gt 0";
// SupplierInvoice: StatusCode 30104 journaled; PaymentStatus 30109 not paid, 30111 partly paid, 30110 transferred to bank, 30112 paid
export const SUPPLIER_INVOICE_OPEN_FILTER = "StatusCode ge 30102 and PaymentStatus ne 30112 and RestAmount gt 0";

interface CustomerInvoiceRow {
  ID: number; InvoiceNumber?: number | string; CustomerID: number; InvoiceDate: string; PaymentDueDate: string;
  TaxInclusiveAmount: number; RestAmount: number; StatusCode: number; CurrencyCodeID?: number;
  CustomerName?: string; ReminderCount?: number; EmailAddress?: string;
}
interface SupplierInvoiceRow {
  ID: number; InvoiceNumber?: string; SupplierID: number; InvoiceDate: string; PaymentDueDate: string;
  TaxInclusiveAmount: number; RestAmount?: number; StatusCode: number; PaymentStatus?: number; SupplierName?: string;
}

const day = (s: string | undefined) => (s ?? "").slice(0, 10);

export async function fetchOpenReceivables(rest: UnimicroRest): Promise<OpenInvoice[]> {
  const rows = await rest.statistics<CustomerInvoiceRow>({
    model: "CustomerInvoice",
    select: "ID as ID,InvoiceNumber as InvoiceNumber,CustomerID as CustomerID,InvoiceDate as InvoiceDate,PaymentDueDate as PaymentDueDate,TaxInclusiveAmount as TaxInclusiveAmount,RestAmount as RestAmount,StatusCode as StatusCode,Customer.CustomerNumber as CustomerNumber,Info.Name as CustomerName,DefaultEmail.EmailAddress as EmailAddress",
    expand: "Customer.Info.DefaultEmail",
    filter: CUSTOMER_INVOICE_OPEN_FILTER,
    orderby: "PaymentDueDate",
    top: 2000,
  });
  return rows.map((r) => ({
    id: r.ID, invoiceNumber: String(r.InvoiceNumber ?? r.ID), counterpartId: r.CustomerID,
    counterpartName: r.CustomerName ?? `Customer ${r.CustomerID}`, invoiceDate: day(r.InvoiceDate), dueDate: day(r.PaymentDueDate),
    amount: r.TaxInclusiveAmount ?? 0, restAmount: r.RestAmount ?? 0, statusCode: r.StatusCode, emailAddress: r.EmailAddress ?? undefined,
  }));
}

export async function fetchOpenPayables(rest: UnimicroRest): Promise<OpenInvoice[]> {
  const rows = await rest.statistics<SupplierInvoiceRow>({
    model: "SupplierInvoice",
    select: "ID as ID,InvoiceNumber as InvoiceNumber,SupplierID as SupplierID,InvoiceDate as InvoiceDate,PaymentDueDate as PaymentDueDate,TaxInclusiveAmount as TaxInclusiveAmount,RestAmount as RestAmount,StatusCode as StatusCode,PaymentStatus as PaymentStatus,Info.Name as SupplierName",
    expand: "Supplier.Info",
    filter: SUPPLIER_INVOICE_OPEN_FILTER,
    orderby: "PaymentDueDate",
    top: 2000,
  });
  return rows.map((r) => ({
    id: r.ID, invoiceNumber: String(r.InvoiceNumber ?? r.ID), counterpartId: r.SupplierID,
    counterpartName: r.SupplierName ?? `Supplier ${r.SupplierID}`, invoiceDate: day(r.InvoiceDate), dueDate: day(r.PaymentDueDate),
    amount: r.TaxInclusiveAmount ?? 0, restAmount: r.RestAmount ?? r.TaxInclusiveAmount ?? 0, statusCode: r.StatusCode,
  }));
}

/**
 * Customer payments and credit notes on the receivables ledger not yet matched to an invoice: open journal lines
 * (StatusCode 31001/31002) with a negative rest amount. Verified 2026-09-11 against Unimicro's own "Forfalt" figure.
 * Returns negative amounts keyed by customer id.
 */
export async function fetchUnappliedCredits(rest: UnimicroRest, customerId?: number): Promise<Map<number, number>> {
  const rows = await rest.statistics<{ CustomerID: number; Credits: number }>({
    model: "JournalEntryLine",
    select: "SubAccount.CustomerID as CustomerID,sum(RestAmount) as Credits",
    expand: "SubAccount",
    filter: `SubAccount.CustomerID gt 0 and StatusCode ne 31003 and RestAmount lt 0${customerId ? ` and SubAccount.CustomerID eq ${customerId}` : ""}`,
  });
  const m = new Map<number, number>();
  for (const r of rows) if (r.CustomerID && r.Credits) m.set(r.CustomerID, r.Credits);
  return m;
}

/** Sum of bank and cash accounts (1900-1999) from posted journal lines. */
export async function fetchBankBalance(rest: UnimicroRest, asOf?: string): Promise<{ total: number; accounts: { accountNumber: number; accountName: string; balance: number }[] }> {
  const rows = await rest.statistics<{ AccountNumber: number; AccountName: string; Balance: number }>({
    model: "JournalEntryLine",
    select: "Account.AccountNumber as AccountNumber,Account.AccountName as AccountName,sum(Amount) as Balance",
    expand: "Account",
    // No StatusCode filter: many demo lines have StatusCode null, and "ne" would silently drop them. Verified 2026-09-08: this sum equals the trial balance for 1920.
    filter: `Account.AccountNumber ge 1900 and Account.AccountNumber le 1999${asOf ? ` and FinancialDate le '${asOf}'` : ""}`,
    orderby: "Account.AccountNumber",
  });
  const accounts = rows.map((r) => ({ accountNumber: r.AccountNumber, accountName: r.AccountName, balance: r.Balance ?? 0 }));
  return { total: accounts.reduce((s, a) => s + a.balance, 0), accounts };
}

/** Average monthly operating cost (accounts 5000-7999: salaries, rent, other opex) over the months that have postings. */
export async function fetchMonthlyOpex(rest: UnimicroRest, year: number): Promise<{ average: number; months: { month: number; amount: number }[] }> {
  const rows = await rest.statistics<{ Month: number; Amount: number }>({
    model: "JournalEntryLine",
    select: "Period.No as Month,sum(Amount) as Amount",
    expand: "Account,Period",
    filter: `Account.AccountNumber ge 5000 and Account.AccountNumber le 7999 and Period.AccountYear eq ${year}`,
    orderby: "Period.No",
  });
  const months = rows.filter((r) => r.Month).map((r) => ({ month: r.Month, amount: r.Amount ?? 0 }));
  const average = months.length ? months.reduce((s, m) => s + m.amount, 0) / months.length : 0;
  return { average, months };
}

/** Trial balance rows via Unimicro MCP (already available there). */
export async function fetchTrialBalance(mcp: UnimicroMcp, companyKey: string, year: number, month = 12): Promise<TrialBalanceRow[]> {
  const p = UnimicroMcp.payload(await mcp.call("get_trial_balance", { companyKey, year, month }));
  const table = (p.summary as { type?: string; rows?: { Account: string; StartBalance: number; Balance: number }[] }[] | undefined)?.find((s) => s.type === "table");
  return (table?.rows ?? []).map((r) => ({
    account: r.Account, accountNumber: Number(String(r.Account).split(" - ")[0]) || 0, startBalance: r.StartBalance ?? 0, balance: r.Balance ?? 0,
  }));
}

export async function fetchRevisionReport(mcp: UnimicroMcp, companyKey: string, year: number): Promise<{ sections: RevisionSection[]; errorCount: number; warningCount: number }> {
  const p = UnimicroMcp.payload(await mcp.call("get_revisioncheck", { companyKey, year }));
  const data = (p.data ?? {}) as { report?: RevisionSection[]; errorCount?: number; warningCount?: number };
  return { sections: data.report ?? [], errorCount: data.errorCount ?? 0, warningCount: data.warningCount ?? 0 };
}
