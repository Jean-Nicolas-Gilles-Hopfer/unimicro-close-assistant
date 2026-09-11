/**
 * Revision-check remediation: turns Unimicro's revision findings into explanations,
 * diagnostics and proposed correcting journal entries. Pure functions.
 */

export interface RevisionFinding {
  status: "Error" | "Warning" | "Ok" | string;
  comment: string;
  accountNumber: number;
  accountName: string;
  value: number;
  reason: string;
}
export interface RevisionSection { name: string; status: string; findings: RevisionFinding[] }

export interface TrialBalanceRow { account: string; accountNumber: number; startBalance: number; balance: number }

export interface DraftLine { accountNumber: number; amount: number; description: string; financialDate: string; vatTypeId?: number | null }

export interface Remediation {
  section: string;
  severity: "error" | "warning" | "info";
  finding: RevisionFinding;
  explanation: string;
  likelyCauses: string[];
  diagnostics: string[];
  proposedEntries: { title: string; lines: DraftLine[]; caution: string }[];
  requiresAccountantJudgement: boolean;
}

const nok = (n: number) => new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 2 }).format(n);

export function remediate(report: RevisionSection[], opts: { year: number; trialBalance?: TrialBalanceRow[]; asOf?: string }): Remediation[] {
  const out: Remediation[] = [];
  const openingDate = `${opts.year}-01-01`;
  const tb = opts.trialBalance ?? [];
  const plAccountsWithOpening = tb.filter((r) => r.accountNumber >= 3000 && r.accountNumber <= 8999 && Math.abs(r.startBalance) > 0.005);

  const plOpeningFinding = report.find((s) => s.name.toLowerCase().includes("income statement opening"))?.findings.find((f) => f.status !== "Ok");

  for (const s of report) {
    for (const f of s.findings) {
      if (f.status === "Ok") continue;
      const severity = f.status === "Error" ? "error" : f.status === "Warning" ? "warning" : "info";
      const key = s.name.toLowerCase();

      if (key.includes("opening balance total")) {
        // A one-sided posting cannot be booked. If P&L accounts carry an IB of the same size with opposite
        // sign, the balance sheet is only unbalanced because the result was never allocated: that fix resolves both.
        const explainedByPl = plOpeningFinding && Math.abs(plOpeningFinding.value + f.value) < 1;
        out.push({
          section: s.name, severity, finding: f,
          explanation: `The opening balance (IB) for ${opts.year} does not sum to zero: debits and credits differ by ${nok(f.value)}. A balance sheet must balance, so the IB was imported or posted incompletely.` +
            (explainedByPl ? ` The difference equals the opening balance sitting on P&L accounts, so it disappears once last year's result is transferred to equity (see the 'Income statement opening balance' remediation).` : ""),
          likelyCauses: explainedByPl ? [
            "Previous year's result never closed to equity (year-end allocation not run), so the balance-sheet side lacks its equity counter-post.",
          ] : [
            "Opening balance imported from a previous system with a missing or wrong line (for example 2050 Annen egenkapital).",
            "An IB line was posted on the wrong side or with the wrong sign.",
          ],
          diagnostics: [
            `Trial balance for ${opts.year} period 1 with opening balances: which accounts carry IB?`,
            `Journal entries dated ${openingDate} or earlier with 'IB' or 'Inngående balanse' in the description.`,
            `Compare closing balance ${opts.year - 1} period 12 with IB ${opts.year} per account.`,
          ],
          proposedEntries: explainedByPl ? [] : [{
            title: `Correct the opening balance import for ${opts.year}`,
            lines: [],
            caution: "A one-sided correction cannot be booked as a journal entry. Re-open the opening balance (Inngående balanse) function, compare with the closing balance of the previous year per account, and add or fix the missing line there.",
          }],
          requiresAccountantJudgement: true,
        });
      } else if (key.includes("income statement opening balance")) {
        const lines: DraftLine[] = plAccountsWithOpening.length
          ? [
              ...plAccountsWithOpening.map((r) => ({ accountNumber: r.accountNumber, amount: -r.startBalance, description: `Nullstill IB på resultatkonto ${r.accountNumber}`, financialDate: openingDate, vatTypeId: null })),
              { accountNumber: 2050, amount: plAccountsWithOpening.reduce((a, r) => a + r.startBalance, 0), description: "Overføring av fjorårets resultat til egenkapital", financialDate: openingDate, vatTypeId: null },
            ]
          : [
              { accountNumber: 8960, amount: -f.value, description: `Overføring årsresultat ${opts.year - 1}`, financialDate: openingDate, vatTypeId: null },
              { accountNumber: 2050, amount: f.value, description: `Overføring årsresultat ${opts.year - 1} til annen egenkapital`, financialDate: openingDate, vatTypeId: null },
            ];
        out.push({
          section: s.name, severity, finding: f,
          explanation: `Profit-and-loss accounts (3000-8999) carry an opening balance of ${nok(f.value)}. P&L accounts must start each year at zero; last year's result should have been transferred to equity at year end.`,
          likelyCauses: [
            "Year-end closing (årsavslutning / disponering) was not performed for the previous year.",
            "Opening balance import placed the previous result on a result account instead of equity.",
            "The system shows the pseudo-account '0 - Udisponert resultat', meaning the result is not yet allocated.",
          ],
          diagnostics: [
            `List P&L accounts with non-zero IB in ${opts.year}${plAccountsWithOpening.length ? `: ${plAccountsWithOpening.map((r) => r.accountNumber).join(", ")}` : ""}.`,
            `Check whether a year-end allocation entry exists dated ${opts.year - 1}-12-31.`,
          ],
          proposedEntries: [{
            title: `Transfer ${opts.year - 1} result to equity (disponering)`,
            lines,
            caution: "Standard year-end allocation. If dividends or tax were decided, split the counter-post accordingly (2800 utbytte, 2500 betalbar skatt).",
          }],
          requiresAccountantJudgement: true,
        });
      } else if (key.includes("liability")) {
        const isInputVat = f.accountNumber >= 2710 && f.accountNumber <= 2719;
        const date = opts.asOf ?? `${opts.year}-12-31`;
        out.push({
          section: s.name, severity, finding: f,
          explanation: isInputVat
            ? `Account ${f.accountNumber} (${f.accountName}) holds input VAT of ${nok(f.value)} that has never been settled. Input VAT is a receivable from the state until the VAT return (mva-melding) is run, which nets the 2700-series accounts against 2740 Oppgjørskonto merverdiavgift.`
            : `Liability account ${f.accountNumber} (${f.accountName}) has a debit balance of ${nok(f.value)}, the opposite sign of what a liability should have.`,
          likelyCauses: isInputVat
            ? ["VAT returns have not been run or booked for the periods (common in demo companies).", "VAT settlement entries were posted to the wrong account."]
            : ["Overpayment to a creditor or supplier.", "A payment booked twice or against the wrong account.", "Manual entry with reversed sign."],
          diagnostics: [
            `Statistics: sum of JournalEntryLine.Amount on ${f.accountNumber} per VAT period for ${opts.year}.`,
            `Check VatReport status per bi-monthly term for ${opts.year}.`,
          ],
          proposedEntries: isInputVat ? [{
            title: "Run the VAT return for each open term instead of posting manually",
            lines: [],
            caution: "Do not post manually: create and approve the mva-melding for each term in the system; it books 2700/2710 against 2740 automatically and files to Skatteetaten.",
          }] : [{
            title: `Reclassify debit balance on ${f.accountNumber}`,
            lines: [
              { accountNumber: f.accountNumber, amount: f.value, description: `Reklassifisering debetsaldo ${f.accountNumber}`, financialDate: date, vatTypeId: null },
              { accountNumber: 1570, amount: -f.value, description: `Andre kortsiktige fordringer (reklass. fra ${f.accountNumber})`, financialDate: date, vatTypeId: null },
            ],
            caution: "Verify the root cause first; a reclassification hides double payments instead of fixing them.",
          }],
          requiresAccountantJudgement: true,
        });
      } else if (key.includes("unmatched")) {
        out.push({
          section: s.name, severity, finding: f,
          explanation: `${nok(Math.abs(f.value))} of customer payments and credit notes sit on the receivables ledger without being matched to an invoice (${f.comment}). Open invoices therefore look ${nok(Math.abs(f.value))} too high, reminders may go to customers who have already paid, and the aging report overstates what is overdue.`,
          likelyCauses: [
            "Bank payments imported and posted to the customer but never matched (KID missing or amount differs).",
            "Credit notes issued without being applied to the original invoice.",
            "Payments registered manually on the customer instead of on the invoice.",
          ],
          diagnostics: [
            "Sales → Kunder → customer → Åpne poster: lines with a negative rest amount are the unmatched payments.",
            "Regnskap → Åpne poster: use 'Match' to pair payments with invoices, oldest first.",
          ],
          proposedEntries: [{
            title: "Match payments to invoices (no journal entry needed)",
            lines: [],
            caution: "Matching changes no balances, only which invoices count as paid. Do it before sending any reminders.",
          }],
          requiresAccountantJudgement: false,
        });
      } else if (key.includes("vat")) {
        out.push({
          section: s.name, severity, finding: f,
          explanation: `Output VAT ${nok(Math.abs(f.value))} is booked on the 2700-series accounts but ${f.comment}. Until the VAT return (mva-melding) is created and approved for each two-month term, the VAT accounts are never settled against 2740 and the liability to Skatteetaten is not visible.`,
          likelyCauses: ["VAT returns were never produced in this company (typical for demo or freshly migrated companies).", "Terms were produced but not approved/booked."],
          diagnostics: ["Regnskap → Mva-melding: list of terms and their status for the year.", "Balance on 2740 Oppgjørskonto merverdiavgift should move at each term."],
          proposedEntries: [{
            title: "Create and approve the VAT return for each open term",
            lines: [],
            caution: "Never post VAT settlement manually; the mva-melding function books 2700/2710 against 2740 and files to Altinn.",
          }],
          requiresAccountantJudgement: true,
        });
      } else if (key.includes("receivable")) {
        out.push({
          section: s.name, severity, finding: f,
          explanation: `Receivables control account ${f.accountNumber} disagrees with the customer sub-ledger by ${nok(f.value)}.`,
          likelyCauses: ["Manual posting directly on 1500 without a customer.", "Payment matched to the wrong customer.", "Credit note not linked to the invoice."],
          diagnostics: ["Journal entry lines on 1500 with no CustomerID.", "Customers with negative open balance."],
          proposedEntries: [], requiresAccountantJudgement: true,
        });
      } else {
        out.push({
          section: s.name, severity, finding: f,
          explanation: `${s.name}: ${f.comment} (account ${f.accountNumber} ${f.accountName}, value ${nok(f.value)}, rule ${f.reason}).`,
          likelyCauses: ["Unexpected sign or magnitude compared with the rule's threshold."],
          diagnostics: [`Drill into account ${f.accountNumber} for ${opts.year}.`],
          proposedEntries: [], requiresAccountantJudgement: true,
        });
      }
    }
  }
  // Fix the P&L opening balance before the total-IB difference: the first often causes the second.
  return out.sort((a, b) => rank(a) - rank(b));
}

function rank(r: Remediation): number {
  const k = r.section.toLowerCase();
  if (k.includes("income statement opening")) return 0;
  if (k.includes("opening balance total")) return 1;
  return r.severity === "error" ? 2 : r.severity === "warning" ? 3 : 4;
}

/** Sanity check: every proposed entry must balance. */
export function entriesBalance(lines: DraftLine[]): boolean {
  return Math.abs(lines.reduce((s, l) => s + l.amount, 0)) < 0.005;
}
