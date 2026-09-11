/**
 * Data access for the plugin views, through host.api only.
 * Queries were verified against the test environment (see ../../RESEARCH.md in the repo root).
 */
import type { UnimicroHost } from '@unimicro/plugin-types';
import type { OpenInvoice } from './domain/aging';

// CustomerInvoice: 42001 draft, 42002 invoiced, 42003 partly paid, 42004 paid, 42006 credited
export const OPEN_RECEIVABLES_FILTER =
    'StatusCode ne 42001 and StatusCode ne 42004 and StatusCode ne 42006 and RestAmount gt 0';
// SupplierInvoice: StatusCode 30104 journaled; PaymentStatus 30112 paid
export const OPEN_PAYABLES_FILTER = 'StatusCode ge 30102 and PaymentStatus ne 30112 and RestAmount gt 0';

const day = (s: unknown) => String(s ?? '').slice(0, 10);

function stats<T>(host: UnimicroHost, params: Record<string, string | number>): Promise<T[]> {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) q.set(k, String(v));
    q.set('wrap', 'false');
    return host.api.get<T[]>(`/api/statistics?${q.toString()}`);
}

interface ReceivableRow {
    ID: number; InvoiceNumber: string; CustomerID: number; InvoiceDate: string; PaymentDueDate: string;
    TaxInclusiveAmount: number; RestAmount: number; StatusCode: number; CustomerName: string; EmailAddress: string | null;
}

export async function fetchOpenReceivables(host: UnimicroHost, customerId?: number): Promise<OpenInvoice[]> {
    const rows = await stats<ReceivableRow>(host, {
        model: 'CustomerInvoice',
        select: 'ID as ID,InvoiceNumber as InvoiceNumber,CustomerID as CustomerID,InvoiceDate as InvoiceDate,PaymentDueDate as PaymentDueDate,TaxInclusiveAmount as TaxInclusiveAmount,RestAmount as RestAmount,StatusCode as StatusCode,Info.Name as CustomerName,DefaultEmail.EmailAddress as EmailAddress',
        expand: 'Customer.Info.DefaultEmail',
        filter: OPEN_RECEIVABLES_FILTER + (customerId ? ` and CustomerID eq ${customerId}` : ''),
        orderby: 'PaymentDueDate',
        top: 2000,
    });
    return rows.map((r) => ({
        id: r.ID, invoiceNumber: String(r.InvoiceNumber ?? r.ID), counterpartId: r.CustomerID,
        counterpartName: r.CustomerName ?? `Customer ${r.CustomerID}`, invoiceDate: day(r.InvoiceDate), dueDate: day(r.PaymentDueDate),
        amount: r.TaxInclusiveAmount ?? 0, restAmount: r.RestAmount ?? 0, statusCode: r.StatusCode, emailAddress: r.EmailAddress ?? undefined,
    }));
}

interface PayableRow {
    ID: number; InvoiceNumber: string; SupplierID: number; InvoiceDate: string; PaymentDueDate: string;
    TaxInclusiveAmount: number; RestAmount: number | null; StatusCode: number; SupplierName: string | null;
}

export async function fetchOpenPayables(host: UnimicroHost): Promise<OpenInvoice[]> {
    const rows = await stats<PayableRow>(host, {
        model: 'SupplierInvoice',
        select: 'ID as ID,InvoiceNumber as InvoiceNumber,SupplierID as SupplierID,InvoiceDate as InvoiceDate,PaymentDueDate as PaymentDueDate,TaxInclusiveAmount as TaxInclusiveAmount,RestAmount as RestAmount,StatusCode as StatusCode,Info.Name as SupplierName',
        expand: 'Supplier.Info',
        filter: OPEN_PAYABLES_FILTER,
        orderby: 'PaymentDueDate',
        top: 2000,
    });
    return rows.map((r) => ({
        id: r.ID, invoiceNumber: String(r.InvoiceNumber ?? r.ID), counterpartId: r.SupplierID,
        counterpartName: r.SupplierName ?? `Supplier ${r.SupplierID}`, invoiceDate: day(r.InvoiceDate), dueDate: day(r.PaymentDueDate),
        amount: r.TaxInclusiveAmount ?? 0, restAmount: r.RestAmount ?? r.TaxInclusiveAmount ?? 0, statusCode: r.StatusCode,
    }));
}

/**
 * Customer payments and credit notes that are booked on the receivables account but not yet matched to an
 * invoice (open journal lines with a negative rest amount). Unimicro's own "Forfalt" figure nets these
 * against the overdue invoices, so we do the same. Keyed by customer id; amounts are negative.
 */
export async function fetchUnappliedCredits(host: UnimicroHost, customerId?: number): Promise<Map<number, number>> {
    const rows = await stats<{ CustomerID: number; Credits: number }>(host, {
        model: 'JournalEntryLine',
        select: 'SubAccount.CustomerID as CustomerID,sum(RestAmount) as Credits',
        expand: 'SubAccount',
        filter: `SubAccount.CustomerID gt 0 and StatusCode ne 31003 and RestAmount lt 0${customerId ? ` and SubAccount.CustomerID eq ${customerId}` : ''}`,
    });
    const m = new Map<number, number>();
    for (const r of rows) if (r.CustomerID && r.Credits) m.set(r.CustomerID, r.Credits);
    return m;
}

export interface BankBalance { total: number; accounts: { accountNumber: number; accountName: string; balance: number }[] }

/** Sum of bank and cash accounts 1900-1999 from posted journal lines. Verified equal to the trial balance. */
export async function fetchBankBalance(host: UnimicroHost): Promise<BankBalance> {
    const rows = await stats<{ AccountNumber: number; AccountName: string; Balance: number }>(host, {
        model: 'JournalEntryLine',
        select: 'Account.AccountNumber as AccountNumber,Account.AccountName as AccountName,sum(Amount) as Balance',
        expand: 'Account',
        filter: 'Account.AccountNumber ge 1900 and Account.AccountNumber le 1999',
        orderby: 'Account.AccountNumber',
    });
    const accounts = rows.map((r) => ({ accountNumber: r.AccountNumber, accountName: r.AccountName, balance: r.Balance ?? 0 }));
    return { total: accounts.reduce((s, a) => s + a.balance, 0), accounts };
}

/** Average monthly operating cost (accounts 5000-7999) over the months with postings this year. */
export async function fetchMonthlyOpex(host: UnimicroHost, year: number): Promise<{ average: number; months: { month: number; amount: number }[] }> {
    const rows = await stats<{ Month: number; Amount: number }>(host, {
        model: 'JournalEntryLine',
        select: 'Period.No as Month,sum(Amount) as Amount',
        expand: 'Account,Period',
        filter: `Account.AccountNumber ge 5000 and Account.AccountNumber le 7999 and Period.AccountYear eq ${year}`,
        orderby: 'Period.No',
    });
    const months = rows.filter((r) => r.Month).map((r) => ({ month: r.Month, amount: r.Amount ?? 0 }));
    const average = months.length ? months.reduce((s, m) => s + m.amount, 0) / months.length : 0;
    return { average, months };
}

/** One invoice, for the header slot: the slot hands the invoice entity, but RestAmount may be stale, so re-read. */
export async function fetchInvoice(host: UnimicroHost, id: number): Promise<OpenInvoice | undefined> {
    const rows = await stats<ReceivableRow>(host, {
        model: 'CustomerInvoice',
        select: 'ID as ID,InvoiceNumber as InvoiceNumber,CustomerID as CustomerID,InvoiceDate as InvoiceDate,PaymentDueDate as PaymentDueDate,TaxInclusiveAmount as TaxInclusiveAmount,RestAmount as RestAmount,StatusCode as StatusCode,Info.Name as CustomerName',
        expand: 'Customer.Info',
        filter: `ID eq ${id}`,
        top: 1,
    });
    const r = rows[0];
    if (!r) return undefined;
    return {
        id: r.ID, invoiceNumber: String(r.InvoiceNumber ?? r.ID), counterpartId: r.CustomerID, counterpartName: r.CustomerName ?? '',
        invoiceDate: day(r.InvoiceDate), dueDate: day(r.PaymentDueDate), amount: r.TaxInclusiveAmount ?? 0, restAmount: r.RestAmount ?? 0, statusCode: r.StatusCode,
    };
}

export const today = () => new Date().toISOString().slice(0, 10);

export const nok = (n: number) =>
    new Intl.NumberFormat('nb-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n);

export const STEP_LABEL: Record<string, { text: string; type: 'default' | 'info' | 'success' | 'warning' | 'critical' }> = {
    none: { text: 'Ikke forfalt', type: 'success' },
    friendly_reminder: { text: 'Vennlig påminnelse', type: 'info' },
    reminder_with_fee: { text: 'Purring', type: 'warning' },
    debt_collection_notice: { text: 'Inkassovarsel', type: 'critical' },
    send_to_collection: { text: 'Til inkasso', type: 'critical' },
};
