import { describe, it, expect } from "vitest";
import { applyCreditsFifo, buildAging, bucketFor, daysBetween, suggestDunningStep, type OpenInvoice } from "../src/domain/aging.js";

const inv = (o: Partial<OpenInvoice> & { id: number }): OpenInvoice => ({
  invoiceNumber: String(1000 + o.id), counterpartId: 1, counterpartName: "A AS", invoiceDate: "2026-07-01",
  dueDate: "2026-07-15", amount: 1000, restAmount: 1000, ...o,
});

describe("aging", () => {
  it("computes day differences and buckets", () => {
    expect(daysBetween("2026-08-01", "2026-08-31")).toBe(30);
    expect(bucketFor(0)).toBe("notDue"); expect(bucketFor(30)).toBe("d1_30");
    expect(bucketFor(31)).toBe("d31_60"); expect(bucketFor(91)).toBe("d90plus");
  });
  it("groups per counterpart and ranks by priority", () => {
    const r = buildAging([
      inv({ id: 1, counterpartId: 1, dueDate: "2026-09-20", restAmount: 5000 }),
      inv({ id: 2, counterpartId: 2, counterpartName: "B AS", dueDate: "2026-06-01", restAmount: 2000 }),
      inv({ id: 3, counterpartId: 2, counterpartName: "B AS", dueDate: "2026-08-25", restAmount: 500 }),
      inv({ id: 4, counterpartId: 3, counterpartName: "Paid", restAmount: 0 }),
    ], "2026-09-08");
    expect(r.invoiceCount).toBe(3);
    expect(r.total).toBe(7500); expect(r.overdue).toBe(2500); expect(r.netOverdue).toBe(2500);
    expect(r.buckets.notDue).toBe(5000); expect(r.buckets.d90plus).toBe(2000); expect(r.buckets.d1_30).toBe(500);
    expect(r.counterparts[0].counterpartName).toBe("B AS");
    expect(r.counterparts[0].oldestDaysOverdue).toBe(99);
    expect(suggestDunningStep(r.counterparts[0]).step).toBe("send_to_collection");
    expect(suggestDunningStep(r.counterparts[1]).step).toBe("none");
  });
  it("nets unmatched payments the way Unimicro's Forfalt figure does (customer 100100 in the demo)", () => {
    // 52 105 in overdue invoices, 31 600 in payments not matched to them: Unimicro shows Forfalt 20 505.
    const r = buildAging([
      inv({ id: 1, counterpartId: 102, counterpartName: "Live Andreassen", dueDate: "2026-09-10", restAmount: 8055 }),
      inv({ id: 2, counterpartId: 102, counterpartName: "Live Andreassen", dueDate: "2026-02-16", restAmount: 14250 }),
      inv({ id: 3, counterpartId: 102, counterpartName: "Live Andreassen", dueDate: "2026-03-18", restAmount: 14250 }),
      inv({ id: 4, counterpartId: 102, counterpartName: "Live Andreassen", dueDate: "2026-04-17", restAmount: 14250 }),
      inv({ id: 5, counterpartId: 102, counterpartName: "Live Andreassen", dueDate: "2024-02-23", restAmount: 1300 }),
      inv({ id: 6, counterpartId: 7, counterpartName: "Fully covered AS", dueDate: "2026-05-01", restAmount: 1000 }),
    ], "2026-09-11", new Map([[102, -31600], [7, -1500], [99, -400]]));
    const live = r.counterparts.find((c) => c.counterpartId === 102)!;
    expect(live.total).toBe(52105); expect(live.overdue).toBe(52105);
    expect(live.credits).toBe(-31600); expect(live.netOverdue).toBe(20505); expect(live.netTotal).toBe(20505);
    const covered = r.counterparts.find((c) => c.counterpartId === 7)!;
    expect(covered.netOverdue).toBe(0); expect(covered.priority).toBe(0);
    expect(suggestDunningStep(covered).step).toBe("none");
    expect(suggestDunningStep(covered).rationale).toMatch(/match the payments/);
    expect(r.credits).toBe(-33500); expect(r.netTotal).toBe(53105 - 33500);
    expect(r.overpaidCount).toBe(2); // customer 7 (-500) and customer 99 (credits only)
    expect(r.counterparts[0].counterpartId).toBe(102);
  });
  it("applies unmatched credits to the oldest invoices first", () => {
    const netted = applyCreditsFifo([
      inv({ id: 1, counterpartId: 5, dueDate: "2026-03-01", restAmount: 1000 }),
      inv({ id: 2, counterpartId: 5, dueDate: "2026-01-01", restAmount: 600 }),
      inv({ id: 3, counterpartId: 5, dueDate: "2026-05-01", restAmount: 400 }),
      inv({ id: 4, counterpartId: 6, dueDate: "2026-05-01", restAmount: 400 }),
    ], new Map([[5, -900], [6, -1000]]));
    expect(netted.map((i) => [i.id, i.restAmount])).toEqual([[1, 700], [3, 400]]);
    expect(applyCreditsFifo([inv({ id: 9 })], undefined)).toHaveLength(1);
  });
});
