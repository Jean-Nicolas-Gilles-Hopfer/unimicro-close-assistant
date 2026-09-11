import { describe, it, expect } from "vitest";
import { buildForecast } from "../src/domain/forecast.js";

describe("forecast", () => {
  it("rolls balances week over week", () => {
    const f = buildForecast({
      asOf: "2026-09-08", bankBalance: 10000, weeks: 4, monthlyFixedCosts: 0,
      receivables: [{ id: 1, invoiceNumber: "1", counterpartId: 1, counterpartName: "A", invoiceDate: "2026-09-01", dueDate: "2026-09-10", amount: 1000, restAmount: 1000 }],
      payables: [{ id: 2, invoiceNumber: "2", counterpartId: 9, counterpartName: "S", invoiceDate: "2026-09-01", dueDate: "2026-09-22", amount: 3000, restAmount: 3000 }],
      collectionRates: { current: 1, late: 1, veryLate: 1 },
    });
    expect(f.weeks).toHaveLength(4);
    expect(f.weeks[0].inflowsAR).toBe(1000);
    expect(f.weeks[0].closing).toBe(11000);
    expect(f.weeks[2].outflowsAP).toBe(3000);
    expect(f.endClosing).toBe(8000);
    expect(f.lowestClosing.amount).toBe(8000);
  });
  it("pushes overdue payables to week 1 and discounts very late receivables", () => {
    const f = buildForecast({
      asOf: "2026-09-08", bankBalance: 0, weeks: 5,
      receivables: [{ id: 1, invoiceNumber: "1", counterpartId: 1, counterpartName: "A", invoiceDate: "2026-05-01", dueDate: "2026-05-15", amount: 1000, restAmount: 1000 }],
      payables: [{ id: 2, invoiceNumber: "2", counterpartId: 9, counterpartName: "S", invoiceDate: "2026-08-01", dueDate: "2026-08-15", amount: 200, restAmount: 200 }],
    });
    expect(f.weeks[0].outflowsAP).toBe(200);
    expect(f.weeks[3].inflowsAR).toBe(400);
    expect(f.overdueReceivablesExcluded).toBe(600);
  });
});
