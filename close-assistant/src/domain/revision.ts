/**
 * Revision-check remediation: turns revision findings into explanations, diagnostics and proposed
 * correcting journal entries. Pure functions. Texts exist in English (default, for the MCP server) and
 * Norwegian bokmål (for the plugin UI).
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

export type Lang = "en" | "nb";

const nok = (n: number) => new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 2 }).format(n);

interface Ctx { year: number; f: RevisionFinding; plAccounts: string; explainedByPl: boolean; isInputVat: boolean }
interface SectionText {
  explanation: (c: Ctx) => string;
  causes: (c: Ctx) => string[];
  diagnostics: (c: Ctx) => string[];
  title: (c: Ctx) => string;
  caution: (c: Ctx) => string;
}

const TEXTS: Record<Lang, Record<string, SectionText>> = {
  en: {
    ibTotal: {
      explanation: (c) => `The opening balance (IB) for ${c.year} does not sum to zero: debits and credits differ by ${nok(c.f.value)}. A balance sheet must balance, so the IB was imported or posted incompletely.` +
        (c.explainedByPl ? ` The difference equals the opening balance sitting on P&L accounts, so it disappears once last year's result is transferred to equity (see the 'Income statement opening balance' remediation).` : ""),
      causes: (c) => c.explainedByPl
        ? ["Previous year's result never closed to equity (year-end allocation not run), so the balance-sheet side lacks its equity counter-post."]
        : ["Opening balance imported from a previous system with a missing or wrong line (for example 2050 Annen egenkapital).", "An IB line was posted on the wrong side or with the wrong sign."],
      diagnostics: (c) => [
        `Trial balance for ${c.year} period 1 with opening balances: which accounts carry IB?`,
        `Journal entries dated ${c.year}-01-01 or earlier with 'IB' or 'Inngående balanse' in the description.`,
        `Compare closing balance ${c.year - 1} period 12 with IB ${c.year} per account.`,
      ],
      title: (c) => `Correct the opening balance import for ${c.year}`,
      caution: () => "A one-sided correction cannot be booked as a journal entry. Re-open the opening balance (Inngående balanse) function, compare with the closing balance of the previous year per account, and add or fix the missing line there.",
    },
    ibPl: {
      explanation: (c) => `Profit-and-loss accounts (3000-8999) carry an opening balance of ${nok(c.f.value)}. P&L accounts must start each year at zero; last year's result should have been transferred to equity at year end.`,
      causes: () => [
        "Year-end closing (årsavslutning / disponering) was not performed for the previous year.",
        "Opening balance import placed the previous result on a result account instead of equity.",
        "The system shows the pseudo-account '0 - Udisponert resultat', meaning the result is not yet allocated.",
      ],
      diagnostics: (c) => [
        `List P&L accounts with non-zero IB in ${c.year}${c.plAccounts ? `: ${c.plAccounts}` : ""}.`,
        `Check whether a year-end allocation entry exists dated ${c.year - 1}-12-31.`,
      ],
      title: (c) => `Transfer ${c.year - 1} result to equity (disponering)`,
      caution: () => "Standard year-end allocation. If dividends or tax were decided, split the counter-post accordingly (2800 utbytte, 2500 betalbar skatt).",
    },
    liability: {
      explanation: (c) => c.isInputVat
        ? `Account ${c.f.accountNumber} (${c.f.accountName}) holds input VAT of ${nok(c.f.value)} that has never been settled. Input VAT is a receivable from the state until the VAT return (mva-melding) is run, which nets the 2700-series accounts against 2740 Oppgjørskonto merverdiavgift.`
        : `Liability account ${c.f.accountNumber} (${c.f.accountName}) has a debit balance of ${nok(c.f.value)}, the opposite sign of what a liability should have.`,
      causes: (c) => c.isInputVat
        ? ["VAT returns have not been run or booked for the periods (common in demo companies).", "VAT settlement entries were posted to the wrong account."]
        : ["Overpayment to a creditor or supplier.", "A payment booked twice or against the wrong account.", "Manual entry with reversed sign."],
      diagnostics: (c) => [`Statistics: sum of JournalEntryLine.Amount on ${c.f.accountNumber} per VAT period for ${c.year}.`, `Check VatReport status per bi-monthly term for ${c.year}.`],
      title: (c) => c.isInputVat ? "Run the VAT return for each open term instead of posting manually" : `Reclassify debit balance on ${c.f.accountNumber}`,
      caution: (c) => c.isInputVat
        ? "Do not post manually: create and approve the mva-melding for each term in the system; it books 2700/2710 against 2740 automatically and files to Skatteetaten."
        : "Verify the root cause first; a reclassification hides double payments instead of fixing them.",
    },
    unmatched: {
      explanation: (c) => `${nok(Math.abs(c.f.value))} of customer payments and credit notes sit on the receivables ledger without being matched to an invoice (${c.f.comment}). Open invoices therefore look ${nok(Math.abs(c.f.value))} too high, reminders may go to customers who have already paid, and the aging report overstates what is overdue.`,
      causes: () => [
        "Bank payments imported and posted to the customer but never matched (KID missing or amount differs).",
        "Credit notes issued without being applied to the original invoice.",
        "Payments registered manually on the customer instead of on the invoice.",
      ],
      diagnostics: () => [
        "Sales → Kunder → customer → Åpne poster: lines with a negative rest amount are the unmatched payments.",
        "Regnskap → Åpne poster: use 'Match' to pair payments with invoices, oldest first.",
      ],
      title: () => "Match payments to invoices (no journal entry needed)",
      caution: () => "Matching changes no balances, only which invoices count as paid. Do it before sending any reminders.",
    },
    vat: {
      explanation: (c) => `Output VAT ${nok(Math.abs(c.f.value))} is booked on the 2700-series accounts but ${c.f.comment}. Until the VAT return (mva-melding) is created and approved for each two-month term, the VAT accounts are never settled against 2740 and the liability to Skatteetaten is not visible.`,
      causes: () => ["VAT returns were never produced in this company (typical for demo or freshly migrated companies).", "Terms were produced but not approved/booked."],
      diagnostics: () => ["Regnskap → Mva-melding: list of terms and their status for the year.", "Balance on 2740 Oppgjørskonto merverdiavgift should move at each term."],
      title: () => "Create and approve the VAT return for each open term",
      caution: () => "Never post VAT settlement manually; the mva-melding function books 2700/2710 against 2740 and files to Altinn.",
    },
    receivable: {
      explanation: (c) => `Receivables control account ${c.f.accountNumber} disagrees with the customer sub-ledger by ${nok(c.f.value)}.`,
      causes: () => ["Manual posting directly on 1500 without a customer.", "Payment matched to the wrong customer.", "Credit note not linked to the invoice."],
      diagnostics: () => ["Journal entry lines on 1500 with no CustomerID.", "Customers with negative open balance."],
      title: () => "", caution: () => "",
    },
    other: {
      explanation: (c) => `${c.f.comment} (account ${c.f.accountNumber} ${c.f.accountName}, value ${nok(c.f.value)}, rule ${c.f.reason}).`,
      causes: () => ["Unexpected sign or magnitude compared with the rule's threshold."],
      diagnostics: (c) => [`Drill into account ${c.f.accountNumber} for ${c.year}.`],
      title: () => "", caution: () => "",
    },
  },
  nb: {
    ibTotal: {
      explanation: (c) => `Inngående balanse (IB) for ${c.year} går ikke i null: debet og kredit avviker med ${nok(c.f.value)}. En balanse må balansere, så IB er importert eller bokført ufullstendig.` +
        (c.explainedByPl ? ` Avviket er nøyaktig like stort som inngående balanse på resultatkontoene, så det forsvinner når fjorårets resultat overføres til egenkapital (se punktet om resultatkontoer).` : ""),
      causes: (c) => c.explainedByPl
        ? ["Fjorårets resultat er aldri disponert til egenkapital (årsavslutning ikke kjørt), så balansen mangler motposten på egenkapital."]
        : ["Inngående balanse er importert fra et tidligere system med en manglende eller feil linje (for eksempel 2050 Annen egenkapital).", "En IB-linje er bokført på feil side eller med feil fortegn."],
      diagnostics: (c) => [
        `Saldobalanse for ${c.year} periode 1 med inngående balanse: hvilke kontoer har IB?`,
        `Bilag datert ${c.year}-01-01 eller tidligere med «IB» eller «Inngående balanse» i teksten.`,
        `Sammenlign utgående balanse ${c.year - 1} periode 12 med IB ${c.year} per konto.`,
      ],
      title: (c) => `Rett importen av inngående balanse for ${c.year}`,
      caution: () => "En ensidig korreksjon kan ikke bokføres som bilag. Åpne funksjonen for inngående balanse, sammenlign med fjorårets utgående balanse per konto, og legg til eller rett linjen som mangler.",
    },
    ibPl: {
      explanation: (c) => `Resultatkontoene (3000–8999) har en inngående balanse på ${nok(c.f.value)}. Resultatkontoer skal starte hvert år på null; fjorårets resultat skulle vært overført til egenkapital ved årsslutt.`,
      causes: () => [
        "Årsavslutning (disponering av resultatet) er ikke gjennomført for forrige år.",
        "Importen av inngående balanse la fjorårets resultat på en resultatkonto i stedet for på egenkapital.",
        "Systemet viser pseudokontoen «0 – Udisponert resultat», som betyr at resultatet ikke er disponert.",
      ],
      diagnostics: (c) => [
        `List resultatkontoer med IB ulik null i ${c.year}${c.plAccounts ? `: ${c.plAccounts}` : ""}.`,
        `Sjekk om det finnes et disponeringsbilag datert ${c.year - 1}-12-31.`,
      ],
      title: (c) => `Overfør resultatet for ${c.year - 1} til egenkapital (disponering)`,
      caution: () => "Standard årsdisponering. Er det vedtatt utbytte eller skatt, splittes motposten tilsvarende (2800 utbytte, 2500 betalbar skatt).",
    },
    liability: {
      explanation: (c) => c.isInputVat
        ? `Konto ${c.f.accountNumber} (${c.f.accountName}) har ${nok(c.f.value)} i inngående mva som aldri er avregnet. Inngående mva er en fordring på staten til mva-meldingen kjøres og 2700-kontoene nulles mot 2740 Oppgjørskonto merverdiavgift.`
        : `Gjeldskonto ${c.f.accountNumber} (${c.f.accountName}) har debetsaldo ${nok(c.f.value)}, altså motsatt fortegn av det en gjeldspost skal ha.`,
      causes: (c) => c.isInputVat
        ? ["Mva-meldinger er ikke kjørt eller bokført for terminene (vanlig i demoselskap).", "Mva-oppgjør er bokført på feil konto."]
        : ["Overbetaling til kreditor eller leverandør.", "En betaling bokført to ganger eller mot feil konto.", "Manuelt bilag med snudd fortegn."],
      diagnostics: (c) => [`Sum av bilagslinjer på ${c.f.accountNumber} per mva-termin for ${c.year}.`, `Status på mva-melding per termin for ${c.year}.`],
      title: (c) => c.isInputVat ? "Kjør mva-melding for hver åpen termin i stedet for å bokføre manuelt" : `Omklassifiser debetsaldo på ${c.f.accountNumber}`,
      caution: (c) => c.isInputVat
        ? "Ikke bokfør manuelt: opprett og godkjenn mva-meldingen for hver termin; systemet bokfører 2700/2710 mot 2740 automatisk og sender til Skatteetaten."
        : "Finn årsaken først; en omklassifisering skjuler dobbeltbetalinger i stedet for å rette dem.",
    },
    unmatched: {
      explanation: (c) => `${nok(Math.abs(c.f.value))} i innbetalinger og kreditnotaer ligger på kundereskontroen uten å være koblet til noen faktura. Åpne fakturaer ser derfor ${nok(Math.abs(c.f.value))} for høye ut, purringer kan gå til kunder som allerede har betalt, og aldersfordelingen overdriver det som er forfalt.`,
      causes: () => [
        "Bankinnbetalinger er importert og bokført på kunden, men aldri matchet (KID mangler eller beløpet avviker).",
        "Kreditnotaer er utstedt uten å bli koblet mot opprinnelig faktura.",
        "Innbetalinger er registrert manuelt på kunden i stedet for på fakturaen.",
      ],
      diagnostics: () => [
        "Salg → Kunder → kunden → Åpne poster: linjer med negativt restbeløp er de umatchede innbetalingene.",
        "Regnskap → Åpne poster: bruk «Match» for å koble innbetalinger mot fakturaer, eldste først.",
      ],
      title: () => "Match innbetalinger mot fakturaer (ingen bilag nødvendig)",
      caution: () => "Matching endrer ingen saldoer, bare hvilke fakturaer som regnes som betalt. Gjør det før du sender purringer.",
    },
    vat: {
      explanation: (c) => `Utgående mva på ${nok(Math.abs(c.f.value))} er bokført på 2700-kontoene, men det finnes ingen mva-melding for ${c.year}. Før mva-meldingen opprettes og godkjennes for hver tomånedstermin, avregnes ikke mva-kontoene mot 2740, og gjelden til Skatteetaten er usynlig.`,
      causes: () => ["Mva-melding er aldri produsert i dette selskapet (typisk for demo- eller nylig migrerte selskap).", "Terminer er produsert, men ikke godkjent eller bokført."],
      diagnostics: () => ["Regnskap → Mva-melding: terminer og status for året.", "Saldo på 2740 Oppgjørskonto merverdiavgift skal endre seg ved hver termin."],
      title: () => "Opprett og godkjenn mva-melding for hver åpen termin",
      caution: () => "Bokfør aldri mva-oppgjør manuelt; mva-meldingen bokfører 2700/2710 mot 2740 og sender til Altinn.",
    },
    receivable: {
      explanation: (c) => `Samlekonto ${c.f.accountNumber} for kundefordringer avviker fra kundereskontroen med ${nok(c.f.value)}.`,
      causes: () => ["Manuell bokføring direkte på 1500 uten kunde.", "Innbetaling matchet mot feil kunde.", "Kreditnota ikke koblet til fakturaen."],
      diagnostics: () => ["Bilagslinjer på 1500 uten kunde.", "Kunder med negativ åpen saldo."],
      title: () => "", caution: () => "",
    },
    other: {
      explanation: (c) => `${c.f.comment} (konto ${c.f.accountNumber} ${c.f.accountName}, verdi ${nok(c.f.value)}, regel ${c.f.reason}).`,
      causes: () => ["Uventet fortegn eller størrelse i forhold til regelens grense."],
      diagnostics: (c) => [`Gå inn på konto ${c.f.accountNumber} for ${c.year}.`],
      title: () => "", caution: () => "",
    },
  },
};

const NB_DESC = {
  resetPl: (a: number) => `Nullstill IB på resultatkonto ${a}`,
  toEquity: "Overføring av fjorårets resultat til egenkapital",
  result: (y: number) => `Overføring årsresultat ${y}`,
  resultToEquity: (y: number) => `Overføring årsresultat ${y} til annen egenkapital`,
  reclass: (a: number) => `Reklassifisering debetsaldo ${a}`,
  otherReceivable: (a: number) => `Andre kortsiktige fordringer (reklass. fra ${a})`,
};

function kindOf(sectionName: string): keyof typeof TEXTS.en {
  const k = sectionName.toLowerCase();
  if (k.includes("opening balance total")) return "ibTotal";
  if (k.includes("income statement opening")) return "ibPl";
  if (k.includes("unmatched")) return "unmatched";
  if (k.includes("vat")) return "vat";
  if (k.includes("liability")) return "liability";
  if (k.includes("receivable")) return "receivable";
  return "other";
}

export function remediate(report: RevisionSection[], opts: { year: number; trialBalance?: TrialBalanceRow[]; asOf?: string; lang?: Lang }): Remediation[] {
  const out: Remediation[] = [];
  const t = TEXTS[opts.lang ?? "en"];
  const openingDate = `${opts.year}-01-01`;
  const tb = opts.trialBalance ?? [];
  const plAccountsWithOpening = tb.filter((r) => r.accountNumber >= 3000 && r.accountNumber <= 8999 && Math.abs(r.startBalance) > 0.005);
  const plOpeningFinding = report.find((s) => kindOf(s.name) === "ibPl")?.findings.find((f) => f.status !== "Ok");

  for (const s of report) {
    for (const f of s.findings) {
      if (f.status === "Ok") continue;
      const severity = f.status === "Error" ? "error" : f.status === "Warning" ? "warning" : "info";
      const kind = kindOf(s.name);
      const ctx: Ctx = {
        year: opts.year, f,
        plAccounts: plAccountsWithOpening.map((r) => r.accountNumber).join(", "),
        explainedByPl: !!plOpeningFinding && Math.abs(plOpeningFinding.value + f.value) < 1,
        isInputVat: f.accountNumber >= 2710 && f.accountNumber <= 2719,
      };
      const text = t[kind];
      const base = { section: s.name, severity, finding: f, explanation: text.explanation(ctx), likelyCauses: text.causes(ctx), diagnostics: text.diagnostics(ctx) } as const;
      const entry = (lines: DraftLine[]) => [{ title: text.title(ctx), lines, caution: text.caution(ctx) }];

      switch (kind) {
        case "ibTotal":
          // A one-sided posting cannot be booked. If P&L accounts carry an IB of the same size with opposite
          // sign, the balance sheet is only unbalanced because the result was never allocated: that fix resolves both.
          out.push({ ...base, proposedEntries: ctx.explainedByPl ? [] : entry([]), requiresAccountantJudgement: true });
          break;
        case "ibPl": {
          const lines: DraftLine[] = plAccountsWithOpening.length
            ? [
                ...plAccountsWithOpening.map((r) => ({ accountNumber: r.accountNumber, amount: -r.startBalance, description: NB_DESC.resetPl(r.accountNumber), financialDate: openingDate, vatTypeId: null })),
                { accountNumber: 2050, amount: plAccountsWithOpening.reduce((a, r) => a + r.startBalance, 0), description: NB_DESC.toEquity, financialDate: openingDate, vatTypeId: null },
              ]
            : [
                { accountNumber: 8960, amount: -f.value, description: NB_DESC.result(opts.year - 1), financialDate: openingDate, vatTypeId: null },
                { accountNumber: 2050, amount: f.value, description: NB_DESC.resultToEquity(opts.year - 1), financialDate: openingDate, vatTypeId: null },
              ];
          out.push({ ...base, proposedEntries: entry(lines), requiresAccountantJudgement: true });
          break;
        }
        case "liability": {
          const date = opts.asOf ?? `${opts.year}-12-31`;
          const lines: DraftLine[] = ctx.isInputVat ? [] : [
            { accountNumber: f.accountNumber, amount: f.value, description: NB_DESC.reclass(f.accountNumber), financialDate: date, vatTypeId: null },
            { accountNumber: 1570, amount: -f.value, description: NB_DESC.otherReceivable(f.accountNumber), financialDate: date, vatTypeId: null },
          ];
          out.push({ ...base, proposedEntries: entry(lines), requiresAccountantJudgement: true });
          break;
        }
        case "unmatched":
          out.push({ ...base, proposedEntries: entry([]), requiresAccountantJudgement: false });
          break;
        case "vat":
          out.push({ ...base, proposedEntries: entry([]), requiresAccountantJudgement: true });
          break;
        default:
          out.push({ ...base, proposedEntries: [], requiresAccountantJudgement: true });
      }
    }
  }
  // Fix the P&L opening balance before the total-IB difference: the first often causes the second.
  return out.sort((a, b) => rank(a) - rank(b));
}

function rank(r: Remediation): number {
  const k = kindOf(r.section);
  if (k === "ibPl") return 0;
  if (k === "ibTotal") return 1;
  return r.severity === "error" ? 2 : r.severity === "warning" ? 3 : 4;
}

/** Sanity check: every proposed entry must balance. */
export function entriesBalance(lines: DraftLine[]): boolean {
  return Math.abs(lines.reduce((s, l) => s + l.amount, 0)) < 0.005;
}
