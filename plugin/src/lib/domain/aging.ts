/** Receivables / payables aging – pure functions. */

export interface OpenInvoice {
  id: number;
  invoiceNumber: string;
  counterpartId: number;
  counterpartName: string;
  invoiceDate: string;   // yyyy-MM-dd
  dueDate: string;       // yyyy-MM-dd
  amount: number;        // tax inclusive
  restAmount: number;    // outstanding
  currency?: string;
  statusCode?: number;
  remindersSent?: number;
  emailAddress?: string;
}

export const BUCKETS = ["notDue", "d1_30", "d31_60", "d61_90", "d90plus"] as const;
export type Bucket = (typeof BUCKETS)[number];
export const BUCKET_LABELS: Record<Bucket, string> = {
  notDue: "Not due", d1_30: "1-30 days", d31_60: "31-60 days", d61_90: "61-90 days", d90plus: "90+ days",
};

export function daysBetween(fromIso: string, toIso: string): number {
  const a = Date.UTC(+fromIso.slice(0, 4), +fromIso.slice(5, 7) - 1, +fromIso.slice(8, 10));
  const b = Date.UTC(+toIso.slice(0, 4), +toIso.slice(5, 7) - 1, +toIso.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

export function bucketFor(daysOverdue: number): Bucket {
  if (daysOverdue <= 0) return "notDue";
  if (daysOverdue <= 30) return "d1_30";
  if (daysOverdue <= 60) return "d31_60";
  if (daysOverdue <= 90) return "d61_90";
  return "d90plus";
}

export interface AgedInvoice extends OpenInvoice { daysOverdue: number; bucket: Bucket }

export interface CounterpartAging {
  counterpartId: number;
  counterpartName: string;
  /** Sum of open invoice rest amounts. */
  total: number;
  /** Rest amounts past due. */
  overdue: number;
  /** Payments and credit notes booked on the counterpart but not matched to an invoice (negative or 0). */
  credits: number;
  /** total + credits, floored at 0: what the counterpart really owes. */
  netTotal: number;
  /** overdue + credits, floored at 0: what is really overdue. Drives priority and dunning. */
  netOverdue: number;
  oldestDaysOverdue: number;
  invoiceCount: number;
  buckets: Record<Bucket, number>;
  invoices: AgedInvoice[];
  /** 0-100, higher = chase first */
  priority: number;
}

export interface AgingReport {
  asOf: string;
  total: number;
  overdue: number;
  overdueShare: number;
  /** Sum of unmatched credits across counterparts (negative or 0). */
  credits: number;
  netTotal: number;
  netOverdue: number;
  /** Counterparts whose unmatched payments exceed their open invoices, i.e. money to refund or match. */
  overpaidCount: number;
  buckets: Record<Bucket, number>;
  counterparts: CounterpartAging[];
  invoiceCount: number;
}

const zeroBuckets = (): Record<Bucket, number> => ({ notDue: 0, d1_30: 0, d31_60: 0, d61_90: 0, d90plus: 0 });
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * @param credits unmatched credits per counterpart id (negative numbers), as Unimicro's own "Forfalt"
 *                figure nets them. Counterparts with credits but no open invoices are included with zero invoices.
 */
export function buildAging(invoices: OpenInvoice[], asOf: string, credits?: Map<number, number>): AgingReport {
  const aged: AgedInvoice[] = invoices
    .filter((i) => i.restAmount > 0.005)
    .map((i) => { const d = daysBetween(i.dueDate, asOf); return { ...i, daysOverdue: d, bucket: bucketFor(d) }; });

  const byCp = new Map<number, CounterpartAging>();
  const ensure = (id: number, name: string) => {
    let cp = byCp.get(id);
    if (!cp) {
      cp = { counterpartId: id, counterpartName: name, total: 0, overdue: 0, credits: 0, netTotal: 0, netOverdue: 0, oldestDaysOverdue: 0, invoiceCount: 0, buckets: zeroBuckets(), invoices: [], priority: 0 };
      byCp.set(id, cp);
    }
    return cp;
  };
  for (const inv of aged) {
    const cp = ensure(inv.counterpartId, inv.counterpartName);
    cp.total += inv.restAmount; cp.invoiceCount++;
    cp.buckets[inv.bucket] += inv.restAmount;
    if (inv.daysOverdue > 0) { cp.overdue += inv.restAmount; cp.oldestDaysOverdue = Math.max(cp.oldestDaysOverdue, inv.daysOverdue); }
    cp.invoices.push(inv);
  }
  for (const [id, c] of credits ?? []) {
    if (!c) continue;
    const cp = ensure(id, `Customer ${id}`);
    cp.credits += Math.min(0, c);
  }

  let creditsTotal = 0; let overpaidCount = 0;
  for (const cp of byCp.values()) {
    creditsTotal += cp.credits;
    cp.netTotal = Math.max(0, cp.total + cp.credits);
    cp.netOverdue = Math.max(0, cp.overdue + cp.credits);
    if (cp.total + cp.credits < -0.005) overpaidCount++;
  }

  const total = aged.reduce((s, i) => s + i.restAmount, 0);
  const buckets = zeroBuckets();
  for (const i of aged) buckets[i.bucket] += i.restAmount;
  const overdue = total - buckets.notDue;
  const maxNetOverdue = Math.max(1, ...[...byCp.values()].map((c) => c.netOverdue));

  const counterparts = [...byCp.values()].map((c) => {
    // priority: 60% relative net overdue amount, 40% age (capped at 120 days); nothing net overdue = 0
    c.priority = c.netOverdue > 0 ? Math.round(60 * (c.netOverdue / maxNetOverdue) + 40 * Math.min(c.oldestDaysOverdue, 120) / 120) : 0;
    c.total = r2(c.total); c.overdue = r2(c.overdue); c.credits = r2(c.credits); c.netTotal = r2(c.netTotal); c.netOverdue = r2(c.netOverdue);
    for (const b of BUCKETS) c.buckets[b] = r2(c.buckets[b]);
    c.invoices.sort((a, b) => b.daysOverdue - a.daysOverdue);
    return c;
  }).sort((a, b) => b.priority - a.priority || b.netOverdue - a.netOverdue || b.total - a.total);

  for (const b of BUCKETS) buckets[b] = r2(buckets[b]);
  const netTotal = Math.max(0, total + creditsTotal);
  return {
    asOf, total: r2(total), overdue: r2(overdue), overdueShare: total ? r2(overdue / total) : 0,
    credits: r2(creditsTotal), netTotal: r2(netTotal), netOverdue: r2(counterparts.reduce((s, c) => s + c.netOverdue, 0)),
    overpaidCount, buckets, counterparts, invoiceCount: aged.length,
  };
}

/**
 * Applies unmatched credits to a counterpart's invoices oldest-first (FIFO), the way a bookkeeper would match
 * them. Returns a new invoice list with reduced rest amounts; fully covered invoices are dropped.
 * Use this when the invoices feed a cash-flow forecast, so already-received money is not counted as an inflow.
 */
export function applyCreditsFifo(invoices: OpenInvoice[], credits?: Map<number, number>): OpenInvoice[] {
  if (!credits || credits.size === 0) return invoices;
  const remaining = new Map<number, number>();
  for (const [id, c] of credits) if (c < 0) remaining.set(id, -c);
  const sorted = [...invoices].sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.id - b.id);
  const out: OpenInvoice[] = [];
  for (const inv of sorted) {
    const left = remaining.get(inv.counterpartId) ?? 0;
    if (left <= 0) { out.push(inv); continue; }
    const applied = Math.min(left, inv.restAmount);
    remaining.set(inv.counterpartId, left - applied);
    const rest = Math.round((inv.restAmount - applied) * 100) / 100;
    if (rest > 0.005) out.push({ ...inv, restAmount: rest });
  }
  return out;
}

/** Suggested dunning step per counterpart, Norwegian practice (purring, inkassovarsel, inkasso). Uses the net overdue amount. */
export type DunningStep = "none" | "friendly_reminder" | "reminder_with_fee" | "debt_collection_notice" | "send_to_collection";

export function suggestDunningStep(cp: CounterpartAging): { step: DunningStep; rationale: string } {
  const d = cp.oldestDaysOverdue;
  if (cp.netOverdue <= 0) {
    return { step: "none", rationale: cp.credits < 0 && cp.overdue > 0 ? "Overdue invoices are covered by payments not yet matched to them; match the payments instead of reminding." : "Nothing overdue." };
  }
  if (d <= 14) return { step: "friendly_reminder", rationale: `Oldest invoice ${d} days overdue; a friendly reminder is customary before fees.` };
  if (d <= 28) return { step: "reminder_with_fee", rationale: `Oldest invoice ${d} days overdue (more than 14): a formal purring with statutory reminder fee is allowed.` };
  if (d <= 42) return { step: "debt_collection_notice", rationale: `Oldest invoice ${d} days overdue: send inkassovarsel with a 14-day deadline before collection.` };
  return { step: "send_to_collection", rationale: `Oldest invoice ${d} days overdue and past the inkassovarsel window; hand over to collection.` };
}
