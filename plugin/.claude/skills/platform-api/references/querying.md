# Querying

Everything on this page goes in the query bag of `host.api.get(entity, query)`. Values may be
strings, numbers or booleans; the runtime turns them into strings and the platform encodes them, so
a filter reads on the wire much as you wrote it.

```ts
import type { Customer } from '@unimicro/platform-types';

const customers = await this.host.api.get<Partial<Customer>[]>('customers', {
    expand: 'Info',
    select: 'ID,CustomerNumber,Info.Name',
    filter: "StatusCode eq 30001",
    orderby: 'Info.Name',
    top: 100,
});
```

## The one rule

**Do not send a parameter, operator or function that is not on this page.**

An unrecognised query parameter is ignored rather than rejected. An invented `where`, or an
`in (...)` in a filter, comes back 200 with the *whole unfiltered collection*, which looks exactly
like a query that matched everything. The failure is wrong data on the page, with nothing in the
console to notice. Nothing on the plugin path filters the bag either — whatever key you put in it is
sent.

If you need something that is not here, sort or aggregate the rows in the view instead of guessing at
syntax.

## The parameters

| Parameter | What it does |
| --- | --- |
| `filter` | narrows the collection |
| `select` | trims the payload to named fields |
| `expand` | pulls in related entities |
| `orderby` | sorts |
| `top` / `skip` | pages |
| `hateoas` | asks what may legally be done to this record next |

That is the whole set. It is the same set the platform's own front end sends — its HTTP client
appends exactly these and drops anything else.

## filter

| Operator | Meaning | Example |
| --- | --- | --- |
| `eq` `ne` | equals, not equals | `StatusCode eq 30001` |
| `gt` `lt` `ge` `le` | comparison | `TaxInclusiveAmount gt 1000` |
| `like` `notlike` | wildcard, case-insensitive | `CustomerName like '%micro%'` |
| `contains(F,'x')` | contains, case-insensitive | `contains(CustomerName,'micro')` |
| `startswith(F,'x')` | starts with | `startswith(AccountNumber,'4300')` |
| `endswith(F,'x')` | ends with | `endswith(Name,'AS')` |

Combine with `and`, `or` and `not`. Strings are single-quoted, numbers bare, dates single-quoted in
ISO form: `InvoiceDate ge '2026-01-01' and InvoiceDate le '2026-12-31'`.

Filters reach into related entities with dots, and the relation does not have to be expanded for the
filter to work: `filter=worker.userid eq 5`.

Operators that are **not** available: `in`, `any`, `all`, arithmetic, and date functions. There is no
`$` prefix — `$filter` appears in a few places in the written guides and is ignored here, silently,
in the way described above.

## select

Names the fields you want. `ID`, `Deleted` and `CustomValues` come back whether or not you ask.

Dotted paths select through an expand: `select=ID,Info.Name,Items.Product.Name`. A path whose
relation was not expanded returns nothing for that column rather than failing, so keep `select` and
`expand` in step.

## expand

Related entities are absent unless asked for, and this is the single most common reason a page renders
empty rows. A customer's name is not on `Customer` — it is on the business relation behind `Info`, so
`expand: 'Info'` is load-bearing rather than an optimisation.

Dots walk down, commas take siblings, and they combine:

```
expand: 'Items.Product'
expand: 'Customer,Items.Product'
expand: 'Info,Info.DefaultEmail,Info.DefaultPhone,Info.Addresses'
```

There is no documented depth limit, and customer and contact graphs get large quickly. Expand what
the view draws and nothing more.

The entity pages under `references/entities/` list, per entity, exactly which properties can be
expanded and what each one leads to.

## orderby

Sorts server-side: `orderby: 'Info.Name'`, `orderby: 'InvoiceDate desc'`. Dotted paths work.

The written guides do not mention `orderby` on these routes, but the platform's own front end relies
on it in nearly two hundred places and its HTTP client lists it alongside `filter` and `expand`. It
works. It is called out here because a reader who finds the guides first will conclude it does not.

## top and skip

`top` caps the rows, `skip` offsets: `top: 50, skip: 50` is the second page. Without `top` you get the
collection's default page, not the whole collection — so a total is never something to infer from the
length of one response.

## hateoas

`hateoas: true` adds a `_links` block with three sections: `actions` (operations available now),
`transitions` (the status moves legal from this record's *current* status) and `relations`.

It is the cheapest way to find out what may be done to a record without hard-coding a status-code
state machine, and it is worth preferring over a table of codes when the answer decides whether a
button is enabled. Pass `hateoas: false` to suppress it.

## Aggregation is a different endpoint

Nothing on this page groups or totals. `sum`, `count` and `group by` live on the statistics endpoint,
reached as `/api/statistics?model=…` — see `references/statistics.md`.

Some entities also carry an action that returns a ready-made summary: the invoice entity has one, and
the account entity returns key figures for a period. The entity pages list them with the query
parameters each one takes.
