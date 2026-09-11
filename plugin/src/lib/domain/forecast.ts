/** 13-week rolling cash-flow forecast – pure functions. */
import type { OpenInvoice } from "./aging.js";
import { daysBetween } from "./aging.js";

export interface ForecastInput {
  asOf: string;
  bankBalance: number;
  receivables: OpenInvoice[];
  payables: OpenInvoice[];
  /** Average monthly operating cash cost (salaries, rent, etc.) not represented by open supplier invoices. */
  monthlyFixedCosts?: number;
  /** Expected VAT settlements { date, amount } (positive = payment out). */
  vatSettlements?: { date: string; amount: number }[];
  /** Weeks to forecast (default 13). */
  weeks?: number;
  /** Collection assumptions: share of receivables expected to be collected, by lateness. */
  collectionRates?: { current: number; late: number; veryLate: number };
}

export interface ForecastWeek {
  weekStart: string; weekEnd: string; opening: number;
  inflowsAR: number; outflowsAP: number; outflowsFixed: number; outflowsVat: number;
  net: number; closing: number;
}

export interface Forecast {
  asOf: string; weeks: ForecastWeek[];
  lowestClosing: { amount: number; weekStart: string };
  endClosing: number;
  assumptions: string[];
  overdueReceivablesExcluded: number;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (isoDate: string, n: number) => { const d = new Date(isoDate + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
const r2 = (n: number) => Math.round(n * 100) / 100;

export function buildForecast(input: ForecastInput): Forecast {
  const weeks = input.weeks ?? 13;
  const rates = input.collectionRates ?? { current: 0.97, late: 0.8, veryLate: 0.4 };
  const fixedPerWeek = (input.monthlyFixedCosts ?? 0) * 12 / 52;
  const assumptions = [
    `Receivables not yet due: ${Math.round(rates.current * 100)}% collected in their due week.`,
    `Receivables 1-60 days overdue: ${Math.round(rates.late * 100)}% collected within 2 weeks.`,
    `Receivables more than 60 days overdue: ${Math.round(rates.veryLate * 100)}% collected in week 4, rest excluded.`,
    "Supplier invoices paid in their due week; overdue ones in week 1.",
    input.monthlyFixedCosts ? `Fixed costs ${r2(input.monthlyFixedCosts)}/month spread evenly per week.` : "No fixed-cost estimate supplied.",
  ];

  const horizonEnd = addDays(input.asOf, weeks * 7);
  let excluded = 0;

  const arByWeek = new Array<number>(weeks).fill(0);
  for (const inv of input.receivables) {
    if (inv.dueDate > horizonEnd) continue;
    const overdueDays = daysBetween(inv.dueDate, input.asOf);
    let week: number; let rate: number;
    if (overdueDays <= 0) { week = Math.min(weeks - 1, Math.floor(-overdueDays / 7)); rate = rates.current; }
    else if (overdueDays <= 60) { week = 1; rate = rates.late; }
    else { week = 3; rate = rates.veryLate; }
    arByWeek[Math.min(week, weeks - 1)] += inv.restAmount * rate;
    excluded += inv.restAmount * (1 - rate);
  }
  const apByWeek = new Array<number>(weeks).fill(0);
  for (const inv of input.payables) {
    if (inv.dueDate > horizonEnd) continue;
    const overdueDays = daysBetween(inv.dueDate, input.asOf);
    const week = overdueDays >= 0 ? 0 : Math.min(weeks - 1, Math.floor(-overdueDays / 7));
    apByWeek[week] += inv.restAmount;
  }
  const vatByWeek = new Array<number>(weeks).fill(0);
  for (const v of input.vatSettlements ?? []) {
    const d = daysBetween(input.asOf, v.date);
    if (d < 0 || v.date > horizonEnd) continue;
    vatByWeek[Math.min(weeks - 1, Math.floor(d / 7))] += v.amount;
  }

  const out: ForecastWeek[] = [];
  let opening = input.bankBalance;
  let lowest = { amount: Number.POSITIVE_INFINITY, weekStart: input.asOf };
  for (let w = 0; w < weeks; w++) {
    const weekStart = addDays(input.asOf, w * 7);
    const net = arByWeek[w] - apByWeek[w] - fixedPerWeek - vatByWeek[w];
    const closing = opening + net;
    out.push({
      weekStart, weekEnd: addDays(weekStart, 6), opening: r2(opening),
      inflowsAR: r2(arByWeek[w]), outflowsAP: r2(apByWeek[w]), outflowsFixed: r2(fixedPerWeek), outflowsVat: r2(vatByWeek[w]),
      net: r2(net), closing: r2(closing),
    });
    if (closing < lowest.amount) lowest = { amount: r2(closing), weekStart };
    opening = closing;
  }
  return { asOf: input.asOf, weeks: out, lowestClosing: lowest, endClosing: r2(opening), assumptions, overdueReceivablesExcluded: r2(excluded) };
}
