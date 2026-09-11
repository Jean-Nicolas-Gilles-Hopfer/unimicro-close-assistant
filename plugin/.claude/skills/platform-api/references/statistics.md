# Statistics

Aggregation, grouping and counting over the same records the business API serves. Use it whenever a
view needs a total, a count, a breakdown or a top-N list, rather than fetching rows and reducing them
in the plugin.

```ts
const [row] = await host.api.get<{ total: number; cnt: number }[]>(
    "/api/statistics?model=CustomerInvoice&select=sum(TaxInclusiveAmount) as total,count(ID) as cnt&wrap=false",
);
```

The leading slash matters. Without it the call goes to the business API, which does not serve this
endpoint.

## The two rules that break queries

**`model` takes the entity name, not the business route.** `/api/biz` addresses records by route and
statistics addresses them by name, and the two differ more often than not.

| Entity name — `model=` | Business route |
| --- | --- |
| `CustomerInvoice` | `invoices` |
| `SalaryTransaction` | `salarytrans` |
| `VacationPayLine` | `VacationPayLines` |
| `FileTag` | `filetags` |

The Entity column of `references/entities/index.md` is the name to use. Casing does not matter — the
lookup is case-insensitive, whatever the error text suggests.

**Always alias every selected column with `as`.** An unaliased column comes back under a name the
endpoint composes, not the one you wrote:

| `select=` | Key in the response |
| --- | --- |
| `ID` on `Customer` | `CustomerID` |
| `StatusCode` on `CustomerInvoice` | `CustomerInvoiceStatusCode` |
| `BusinessRelation.Name` | `BusinessRelationName` |
| `count(ID)` | `countID` |
| `ID as id` | `id` |

Reading `row.ID` off the first of those yields `undefined`, with no error anywhere. Aliasing is the
whole defence, and it costs four characters.

Using `skip` also injects an `allPagesRowIndex` key into every row.

## Response shape, and the error that looks like success

`wrap` decides the success shape *and* the failure status. It defaults to **true**.

| | Success | Failure |
| --- | --- | --- |
| `wrap=true` (default) | 200, `{Data, Success: true, Message, Columns, Count}` | **200**, `Success: false`, `Message` |
| `wrap=false` | 200, bare array | **400**, message as a bare JSON string |

On the default path a failed query is an HTTP 200. Code that checks only the status sees success and
then reads an empty `Data`.

**Always pass `wrap=false`.** A failure then rejects like any other call, and the rows arrive as a
plain array. It also keeps the plugin working if a deployment runs the older statistics
implementation, where the default is the other way round.

```ts
const rows = await host.api.get<Row[]>("/api/statistics?model=Customer&select=count(ID) as cnt&wrap=false");
```

A model that is admin-only or blacklisted for statistics is refused the same way — `Model 'X' is not
allowed in statistics.` — so it too is a 200 unless `wrap=false`.

## Parameters

| Parameter | What it does |
| --- | --- |
| `model` | The entity name. Required. |
| `select` | Columns and expressions, comma separated. Alias each one with `as`. |
| `filter` | Row filter, before grouping. |
| `having` | Filter on an aggregate, after grouping. |
| `orderby` | Sort. Repeat the expression — an alias is not accepted here. |
| `expand` | Relations to join, so their fields can be selected and filtered. |
| `join` | An explicit join, including a subquery with its own `model=`. |
| `top`, `skip` | Paging. |
| `distinct` | Defaults to **true**. Pass `distinct=false` to keep duplicate rows. |
| `pivot` | Pivots the result. |
| `range` | `range=<selected column>,<value>,…` — guarantees a row per value, filling missing ones with nulls. A single token means months 1–12 of that column. |
| `hateoas` | Adds links; requires the main model's `ID` and `StatusCode` in `select`. |
| `wrap` | See above. Defaults to true. |

Grouping is implicit: select a plain column beside an aggregate and it becomes the grouping key.

The `count` response header carries the grand total only when `top` is set. Without `top` it is just
the number of rows returned.

## Operators

`eq ne gt lt ge le` compare, `and or not` combine, `in` and `notin` take a parenthesised list, and
`add sub mul div mod` do arithmetic. Strings are single-quoted.

```
filter=StatusCode ne 42001 and InvoiceDate gt '2024-01-01'
filter=StatusCode in (42002,42004)
```

## Functions

Aggregates: `count` `sum` `min` `max` `avg`, one argument each.

Conditional and null handling: `casewhen(test,then,else)` (exactly 3), `isnull(value[,fallback])`,
`setornull(value)`, `null()`.

Dates: `year(f)` `month(f)` `day(f)`, `now()` `getdate()`, `thisyear()` `thismonth()`
`activeyear()`, and `datediff('day',from,to)` — the first argument is a quoted datepart from `year`,
`quarter`, `month`, `dayofyear`, `day`, `week`, `hour`, `minute`, `second`, `millisecond`,
`microsecond`, `nanosecond`.

Text: `concat(a,b,…)`, `concat_ws('-',a,b,…)` (separator first, three arguments minimum),
`length(f)`, `left(f,n)`, `startswith(f,v)`, `endswith(f,v)`, `contains(f,v)`, `stuff(…)` (1–3).

Arithmetic: `add` `subtract` `multiply` `divide`, two arguments each.

Also `between(f,low,high)`, `entitynumber(…)`, `localtime(f)`, and `getlatestsharingtype`,
`getlatestsharingstatus`, `getlatestsharingdate`, `getlatestauditlogtime` for sharing and audit data.

An unknown name is refused outright — `Invalid function: x` — and a wrong argument count is refused
by name, so a failure here says which function it was.

## Worked examples

Invoiced total per year, newest first:

```ts
await host.api.get(
    "/api/statistics?model=CustomerInvoice" +
        "&select=year(InvoiceDate) as yr,sum(TaxInclusiveAmount) as total,count(ID) as cnt" +
        "&orderby=year(InvoiceDate) desc&wrap=false",
);
// [{ yr: 2025, total: 745222.38, cnt: 812 }, …]
```

Drafts against the whole book, in one row, without fetching any:

```ts
await host.api.get(
    "/api/statistics?model=CustomerInvoice" +
        "&select=sum(casewhen(StatusCode eq 42001,1,0)) as drafts,count(ID) as total&wrap=false",
);
// [{ drafts: 622, total: 4301 }]
```

Top customers by invoice count, through a relation:

```ts
await host.api.get(
    "/api/statistics?model=CustomerInvoice" +
        "&select=Customer.CustomerNumber as num,count(ID) as cnt" +
        "&expand=Customer&having=count(ID) gt 20&top=10&wrap=false",
);
// [{ num: 100149, cnt: 59 }, …]
```

Field names are on the domain pages under `references/entities/`. Their Expand tables are a good
starting point for `expand`, but not the full set — statistics also accepts a related model's own
name, as `Customer` above shows.
