import { describe, it, expect } from "vitest";
import { remediate, entriesBalance } from "../src/domain/revision.js";

// Real findings from the demo company, 2026-09-08
const report = [
  { name: "Opening balance total", status: "Error", findings: [{ status: "Error", comment: "The opening balance has a difference", accountNumber: 0, accountName: "Start balance", value: 8813187.54, reason: "NotEquals 0" }] },
  { name: "Income statement opening balance", status: "Error", findings: [{ status: "Error", comment: "Income statement accounts have an opening balance", accountNumber: 0, accountName: "Start balance", value: -8813187.54, reason: "NotEquals 0" }] },
  { name: "Receivables", status: "Ok", findings: [] },
  { name: "Liability accounts", status: "Warning", findings: [{ status: "Warning", comment: "Liability account has a positive balance", accountNumber: 2710, accountName: "Inngående merverdiavgift, høy sats", value: 2156851.69, reason: "GreaterThan 0" }] },
];

describe("revision remediation", () => {
  it("explains unmatched payments and missing VAT returns", () => {
    const r = remediate([
      { name: "Unmatched customer payments", status: "Warning", findings: [{ status: "Warning", comment: "payments not matched to invoices", accountNumber: 1500, accountName: "Kundefordringer", value: -5274740, reason: "LessThan 0" }] },
      { name: "VAT returns", status: "Warning", findings: [{ status: "Warning", comment: "no VAT return exists for 2026", accountNumber: 2700, accountName: "Utgående merverdiavgift", value: -4743350, reason: "Equals 0 returns" }] },
    ], { year: 2026 });
    expect(r).toHaveLength(2);
    expect(r.find((x) => x.section === "Unmatched customer payments")!.explanation).toMatch(/without being matched/);
    expect(r.find((x) => x.section === "Unmatched customer payments")!.requiresAccountantJudgement).toBe(false);
    expect(r.find((x) => x.section === "VAT returns")!.explanation).toMatch(/mva-melding/);
  });
  it("orders the P&L opening fix before the IB total and explains each finding", () => {
    const r = remediate(report, { year: 2026 });
    expect(r).toHaveLength(3);
    expect(r[0].section).toBe("Income statement opening balance");
    expect(r[1].section).toBe("Opening balance total");
    expect(r[2].severity).toBe("warning");
    expect(r[2].explanation).toMatch(/never been settled/);
    for (const rem of r) for (const e of rem.proposedEntries) expect(entriesBalance(e.lines)).toBe(true);
  });
  it("uses the trial balance to target the exact P&L accounts", () => {
    const r = remediate(report, { year: 2026, trialBalance: [{ account: "3000", accountNumber: 3000, startBalance: -8813187.54, balance: -1 }] });
    const lines = r[0].proposedEntries[0].lines;
    expect(lines[0].accountNumber).toBe(3000);
    expect(lines[0].amount).toBeCloseTo(8813187.54, 2);
    expect(entriesBalance(lines)).toBe(true);
  });
});
