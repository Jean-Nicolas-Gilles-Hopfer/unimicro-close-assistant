# Conventions

Behaviour that holds across nearly every entity, and that plugin code gets wrong in the same few
ways.

## Where a call goes

The start of the string picks the API. A bare name is the business API, and that is what the rest of
this page is about.

```ts
await host.api.get('customers', { top: 50 })              // business API — /api/biz/customers
await host.api.get('/api/statistics?model=Customer…')     // the platform host beside /api/biz
await host.api.get('~files/api/download?id=…')            // another platform service
```

Aggregation and counting live on the statistics endpoint, not here — see `statistics.md`. The other
services and what they answer are in `services.md`.

## The shape of a call

```ts
await host.api.get('customers', { top: 50 })          // list, with the query bag
await host.api.get('customers/42')                    // one record
await host.api.post('customers', body)                // create
await host.api.put('customers/42', body)              // update
await host.api.delete('customers/42')                 // delete
```

Anything beyond that is an **action**, addressed on the entity string rather than as a path of its
own:

```ts
await host.api.put('invoices/7?action=create-credit-draft-invoice', body)
await host.api.get('invoices', { action: 'get-customer-invoice-summary', odataFilter: "..." })
```

Only `get` takes a query bag, so an action on a write goes in the entity string as above. The verb
differs per action and is not guessable — the entity pages list each action with its verb.

A successful status transition answers **204 No Content**. One that is illegal from the record's
current status answers 400, which is why `hateoas: true` is worth asking for before offering the user
a button.

## Updating children in one request

A `put` of a parent can create, update and delete its children in the same call.

- **Update** a child: include it with its real `ID`.
- **Delete** a child: include it with `"Deleted": true`.
- **Create** a child: `"ID": 0` and a fresh `_createguid`.

Leaving a child out of the array does **not** delete it. It is untouched.

```json
{
  "ID": 712,
  "Items": [
    { "ID": 797, "NumberOfItems": 2 },
    { "ID": 799, "Deleted": true },
    { "ID": 0, "NumberOfItems": 1, "_createguid": "8da83feb-b714-4cbe-a9fe-35e4d29096de" }
  ]
}
```

Without the guid the write is refused: *creating new entities in a PUT is not allowed unless
_createguid property is specified*. It exists to make the insert idempotent — the same guid cannot be
inserted twice, so a retried save cannot duplicate a line. Generate one per new child
(`crypto.randomUUID()`).

`_guid` and `_isDirty` turn up in payloads copied from the platform's own front end. They are its
internal bookkeeping and are not required.

## Foreign keys are internal ids, not the numbers on screen

An account number, a product number and a customer number are not what a `*ID` field wants. Look the
id up first:

```ts
import type { Account } from '@unimicro/platform-types';

const [account] = await host.api.get<Partial<Account>[]>('accounts', {
    filter: 'AccountNumber eq 1920',
    select: 'ID,AccountNumber,VatTypeID',
});
```

Posting the number where the id belongs gives a foreign-key error, usually as a 500 rather than a
validation message. `AccountID`, `VatTypeID`, `ProductID`, `CustomerID` and `DimensionsID` are the
ones this bites on most.

## Status is an integer, and it is entity-specific

The same number means different things on different entities. `references/entities/status-codes.md`
has the tables the model declares — 56 entities enumerate theirs.

Two things the model does not say, both from the written guides:

- Supplier invoice attachments can be added while the invoice is at 30101, 30102 or 30108, and
  submitting for approval requires 30101 or 30108. 30108 appears in those rules without being
  described anywhere.
- On a customer invoice, `CollectorStatusCode` in the 42500–42507 range means the invoice is with a
  third party — 42503 is waiting for factoring. None of that range is in the model, so it is not in
  the generated tables.

Where the answer decides what the user may do, prefer `hateoas: true` and read the transitions over
hard-coding any of these.

## Dimensions

Project and department are separate entities, but they attach to a record through a `Dimensions`
object that groups them. New dimensions go inline as a child, so they need a `_createguid`; existing
ones are referenced by `DimensionsID` with `Dimensions` set to null.

```json
{ "ID": 0, "Dimensions": { "ID": 0, "ProjectID": 12, "_createguid": "55fb7ade-…" } }
{ "ID": 0, "Dimensions": null, "DimensionsID": 12 }
```

The same shape appears on journal entry lines, salary transactions, customers and supplier invoices —
on the last as `DefaultDimensions`.

## CustomValues

Every record carries a `CustomValues` object, and it comes back from a `select` whether or not you
asked for it. Custom fields defined on a company appear inside it with a `Custom` prefix. Defining one
is an administrative act rather than something a plugin does through this API; reading and writing an
existing one is ordinary.

## Dates and numbers

Dates are ISO `YYYY-MM-DD`; date-times come back as `2026-04-30T00:00:00Z`. Decimals use a point, and
amounts usually carry four decimal places, so format for display rather than printing what arrived.

Sign carries meaning: credit notes and credit lines are negative, journal debits positive and credits
negative. A view that shows absolute values will misreport a credit note.

## When a call fails

Everything that goes wrong arrives as a `HostError`:

```ts
try {
    await host.api.get('invoices', { top: 50 });
} catch (error) {
    const failure = error as HostError;   // failure.code, failure.message, failure.status
}
```

- `code` is always `host/request-failed` for anything from `api`. Branch on **`status`**, not on the
  code.
- `message` is the platform's own message where it sent one, and otherwise a generic transport
  message naming the path.
- A 404 is what a wrong entity name gives you, and it looks the same as a record that is not there.
  Check the entity index before assuming the record is missing.
- A 401 or 403 means the signed-in user lacks the right. The token and the company are the host's
  job, so this is never something to fix by retrying or re-authenticating — surface it. A missing
  right must never be shown as an empty list.
- Validation detail from a 400 does not survive: the platform returns it in a `_validationResults`
  object, and only the top-level message is carried through to the error. Do not try to read the
  body — show the message.

`instanceof HostError` does not hold in an isolated view, because the error crosses a frame boundary
and is rebuilt on the other side. Branch on `code` and `status`.
