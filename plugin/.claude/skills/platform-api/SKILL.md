---
name: platform-api
description: Reading and writing Unimicro platform data from a plugin view through host.api - which entities exist and what route each answers on, their exact field names, what can be expanded, the filter and paging syntax, status codes, the conventions that break writes, the statistics endpoint for totals and counts, and the other platform services such as files. Use whenever plugin code fetches or saves customers, invoices, orders, products, accounts, suppliers, employees, payments or any other business record, aggregates or counts them, or reaches a file.
---

# The platform API, from a plugin

A plugin reads and writes the same data the platform itself does, through one client:

```ts
import type { CustomerInvoice } from '@unimicro/platform-types';

const invoices = await this.host.api.get<Partial<CustomerInvoice>[]>('invoices', {
    filter: 'StatusCode eq 42002',
    orderby: 'PaymentDueDate',
    top: 50,
});
```

`@unimicro/platform-types` carries every business entity, generated from the platform's own model
and installed by the scaffold. Use it rather than declaring your own shapes: a field the entity does
not have then fails to compile, which is the mistake worth catching.

**`Partial`, not the entity itself.** `select` trims the payload, so typing a selected response as a
whole `CustomerInvoice` claims a hundred fields the object does not have, and the editor
autocompletes every one of them — a misspelling caught, a missing field vouched for. `Partial` keeps
the names checked and leaves presence to the query. A call with no `select` returns the whole entity
and can be typed as one.

The host builds the request against the business API, and the platform's own interceptor adds the
signed-in user's token, the active company and the active financial year. **A plugin never handles
authentication and never sends a company key.** Every call runs as the user looking at the page and is
bounded by their rights.

## Look the entity up. Do not guess it.

The first argument is a route, and it is frequently not the entity's name. `CustomerInvoice` answers
on `invoices`. `SalaryTransaction` answers on `salarytrans`. `PayrollRun` answers on `payrollrun`,
singular. A name that reads right and is wrong returns a 404 that says nothing about why.

`references/entities/index.md` lists all 267 routed entities with their route, verbs and action count.
Read it before writing the call, every time — it is a lookup, not a memory exercise.

The same goes for fields. `references/entities/*.md` give the exact field names per entity, with types
and limits. A filter on a field that does not exist does not fail; it returns the collection
unfiltered, and the view renders plausible nonsense.

## What is reachable, and what is not

The client reaches the business API, the platform's other API roots, and its other services. Which
one answers depends on how the entity string starts — a bare name, a leading slash, or `~service`.
See `references/services.md`.

Aggregation lives on the statistics endpoint, at `/api/statistics`: `sum`, `count`, grouping and
joins. See `references/statistics.md`.

The runtime refuses any entity string that tries to leave what it addressed — a scheme, a
protocol-relative path, or anything with a `..` segment in it, however it is encoded.

## Five things that break integrations

1. **Related data is absent unless expanded.** A customer's name is not on `Customer`; it is on the
   business relation behind `Info`. `expand: 'Info'` is load-bearing, and a page of nameless rows is
   what its absence looks like.
2. **Operations are actions on the entity string**, not paths of their own:
   `put('invoices/7?action=create-credit-draft-invoice', body)`. The verb varies per action — look it
   up rather than assuming POST.
3. **A `put` of a parent can create, update and delete its children at once**, and every new child
   needs a `_createguid`. Leaving a child out of the array does not delete it.
4. **Foreign keys are internal ids**, not the numbers on screen. Look up the account by its number and
   send the id.
5. **Status is an integer whose meaning differs per entity.** 30001 on a customer is not 30001 on
   something else.

`references/conventions.md` has all five in full, along with dimensions, dates and signs, and what a
failure looks like.

## Query syntax is an allowlist

`filter`, `select`, `expand`, `orderby`, `top`, `skip`, `hateoas`. That is the set.

An unrecognised parameter is **ignored, not rejected** — so an invented one returns the whole
collection with a 200, looking exactly like a query that matched everything. Nothing on the plugin
path filters the bag, so whatever key you write is sent. `references/querying.md` has the operators.

## When it fails

Failures arrive as a `HostError` carrying `code`, `message` and `status`. `code` is always
`host/request-failed` for anything from `api`, so **branch on `status`**. A 401 or 403 means the user
lacks the right — surface it; never render a missing right as an empty list.

## Personal data

Customer, contact, employee and payroll records carry personal data, including Norwegian national
identity numbers on employees. Uni Micro is the data processor and the customer is the controller.
Keep it out of logs, out of fixtures and out of issue trackers — `host.log` is sent to the platform's
telemetry, so log ids rather than people. Develop against a test company.

## References

| Load when you need | File |
| --- | --- |
| Which entity, and what route it answers on | `references/entities/index.md` |
| Fields, expandable relations and actions, per entity | `references/entities/sales.md`, `accounting.md`, `banking.md`, `payroll.md`, `common.md` |
| What a status integer means | `references/entities/status-codes.md` |
| Filtering, expanding, paging, sorting | `references/querying.md` |
| Complex writes, foreign keys, dimensions, errors | `references/conventions.md` |
| Totals, counts, grouping — the statistics endpoint | `references/statistics.md` |
| Files, and the other platform services | `references/services.md` |

The entity pages are generated from the platform's own API description and regenerate when it
changes. The rest is written by hand. Neither is a substitute for looking at what a call actually
returns before building a view on top of it.
