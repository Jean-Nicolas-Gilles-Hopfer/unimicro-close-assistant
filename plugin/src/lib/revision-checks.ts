/**
 * Revision checks computed from the ledger through statistics, in the shape Unimicro's own revision check
 * reports (sections with findings), extended with two checks of our own: unmatched customer payments and
 * VAT returns not produced. Verified against the demo company on 2026-09-11: the opening-balance figures
 * equal those of Unimicro's get_revisioncheck MCP tool.
 */
import type { UnimicroHost } from '@unimicro/plugin-types';
import { remediate, type Remediation, type RevisionSection, type TrialBalanceRow } from './domain/revision';

function stats<T>(host: UnimicroHost, params: Record<string, string | number>): Promise<T[]> {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) q.set(k, String(v));
    q.set('wrap', 'false');
    return host.api.get<T[]>(`/api/statistics?${q.toString()}`);
}

interface AccountRow { A: number; Name: string; Sum: number }

export interface RevisionResult {
    year: number;
    sections: RevisionSection[];
    remediations: Remediation[];
    errorCount: number;
    warningCount: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export async function runRevisionChecks(host: UnimicroHost, year: number, unmatchedCredits: number): Promise<RevisionResult> {
    const [ib, balances, subLedger, vatReports] = await Promise.all([
        stats<AccountRow>(host, {
            model: 'JournalEntryLine',
            select: 'Account.AccountNumber as A,Account.AccountName as Name,sum(Amount) as Sum',
            expand: 'Account',
            filter: `FinancialDate lt '${year}-01-01'`,
            orderby: 'Account.AccountNumber',
        }),
        stats<AccountRow>(host, {
            model: 'JournalEntryLine',
            select: 'Account.AccountNumber as A,Account.AccountName as Name,sum(Amount) as Sum',
            expand: 'Account',
            filter: `FinancialDate le '${year}-12-31'`,
            orderby: 'Account.AccountNumber',
        }),
        stats<{ Sum: number | null }>(host, {
            model: 'JournalEntryLine',
            select: 'sum(Amount) as Sum',
            expand: 'Account,SubAccount',
            filter: `Account.AccountNumber eq 1500 and SubAccount.CustomerID gt 0 and FinancialDate le '${year}-12-31'`,
        }),
        stats<{ N: number }>(host, { model: 'VatReport', select: 'count(ID) as N', filter: `TerminPeriod.AccountYear eq ${year}`, expand: 'TerminPeriod' }).catch(() => [{ N: -1 }]),
    ]);

    const sections: RevisionSection[] = [];
    const finding = (status: string, comment: string, accountNumber: number, accountName: string, value: number, reason: string) =>
        ({ status, comment, accountNumber, accountName, value: r2(value), reason });

    // 1. Opening balance total: balance-sheet accounts must sum to zero at the start of the year.
    const ibBalanceSheet = ib.filter((r) => r.A < 3000).reduce((s, r) => s + (r.Sum ?? 0), 0);
    sections.push({
        name: 'Opening balance total', status: Math.abs(ibBalanceSheet) > 0.5 ? 'Error' : 'Ok',
        findings: Math.abs(ibBalanceSheet) > 0.5 ? [finding('Error', 'The opening balance has a difference', 0, 'Start balance', ibBalanceSheet, 'NotEquals 0')] : [],
    });
    // 2. P&L accounts must start the year at zero.
    const ibPl = ib.filter((r) => r.A >= 3000 && r.A <= 8999).reduce((s, r) => s + (r.Sum ?? 0), 0);
    sections.push({
        name: 'Income statement opening balance', status: Math.abs(ibPl) > 0.5 ? 'Error' : 'Ok',
        findings: Math.abs(ibPl) > 0.5 ? [finding('Error', 'Income statement accounts have an opening balance', 0, 'Start balance', ibPl, 'NotEquals 0')] : [],
    });
    // 3. Receivables control account vs customer sub-ledger.
    const control = balances.find((r) => r.A === 1500)?.Sum ?? 0;
    const sub = subLedger[0]?.Sum ?? 0;
    const diff = control - sub;
    sections.push({
        name: 'Receivables', status: Math.abs(diff) > 0.5 ? 'Error' : 'Ok',
        findings: Math.abs(diff) > 0.5 ? [finding('Error', 'Receivables account differs from the customer ledger', 1500, 'Kundefordringer', diff, 'NotEquals 0')] : [],
    });
    // 4. Liability accounts with a debit balance.
    const positiveLiabilities = balances.filter((r) => r.A >= 2000 && r.A <= 2999 && (r.Sum ?? 0) > 0.5);
    sections.push({
        name: 'Liability accounts', status: positiveLiabilities.length ? 'Warning' : 'Ok',
        findings: positiveLiabilities.map((r) => finding('Warning', 'Liability account has a positive balance', r.A, r.Name, r.Sum, 'GreaterThan 0')),
    });
    // 5. Unmatched customer payments (ours).
    sections.push({
        name: 'Unmatched customer payments', status: unmatchedCredits < -0.5 ? 'Warning' : 'Ok',
        findings: unmatchedCredits < -0.5 ? [finding('Warning', 'payments not matched to invoices', 1500, 'Kundefordringer', unmatchedCredits, 'LessThan 0')] : [],
    });
    // 6. VAT returns (ours): output VAT booked but no returns produced this year.
    const outputVat = balances.filter((r) => r.A >= 2700 && r.A <= 2709).reduce((s, r) => s + (r.Sum ?? 0), 0);
    const vatCount = vatReports[0]?.N ?? -1;
    const vatMissing = vatCount === 0 && Math.abs(outputVat) > 0.5;
    sections.push({
        name: 'VAT returns', status: vatMissing ? 'Warning' : 'Ok',
        findings: vatMissing ? [finding('Warning', `no VAT return exists for ${year}`, 2700, 'Utgående merverdiavgift', outputVat, 'Equals 0 returns')] : [],
    });

    const trialBalance: TrialBalanceRow[] = balances.map((r) => ({
        account: `${r.A} - ${r.Name}`, accountNumber: r.A, startBalance: ib.find((i) => i.A === r.A)?.Sum ?? 0, balance: r.Sum ?? 0,
    }));
    const remediations = remediate(sections, { year, trialBalance, asOf: new Date().toISOString().slice(0, 10), lang: 'nb' });
    return {
        year, sections, remediations,
        errorCount: remediations.filter((r) => r.severity === 'error').length,
        warningCount: remediations.filter((r) => r.severity === 'warning').length,
    };
}
