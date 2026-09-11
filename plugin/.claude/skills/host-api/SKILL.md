---
name: host-api
description: The host handle a plugin view is given, member by member - dialogs (confirm, message, prompt), notifications, navigation, logging, getContext and slot context, host.api.request for files and other media types, plus the error codes calls reject with and what happens at unmount. Use whenever plugin code asks the user something, shows a message, moves the user somewhere, logs, or reads who and where it is running. Business data, statistics and the other platform services through host.api are the platform-api skill.
---

# The host handle

A view talks to the platform through `host` and nothing else. The platform assigns it before the
browser connects the element, so it is usable from the first line of `connectedCallback`, and revokes
it at unmount.

```typescript
import type { UnimicroHost } from '@unimicro/plugin-types';

export default class ShipmentsView extends HTMLElement {
    host!: UnimicroHost;

    async connectedCallback() {
        const { company } = await this.host.getContext();
        this.host.log.info('view opened', { company: company.key });
    }
}
```

| Member | What it is |
| --- | --- |
| `getContext()` | Who and where the plugin is running. |
| `api` | The platform's APIs, as the signed-in user. See the **platform-api** skill. |
| `navigation` | The platform router. |
| `dialog` | Modal questions and messages, drawn by the platform. |
| `notifications` | Transient messages, where the platform puts its own. |
| `log` | Structured logging, attributed to the plugin. |
| `slot?` | The entity of the page a slot or tab view sits on, or the row a column cell shows. |

Every member is async even where a native view could answer synchronously, so the same source runs
unchanged under both view models — in an isolated view each call crosses a message channel.
`notifications` and `log` are the exceptions: they return nothing, so there is nothing to await.

## Context

```typescript
const { plugin, user, company } = await this.host.getContext();
```

`plugin` is `{ id, version }` as the host bound it, not what the manifest says locally. `user` is
`{ name, email }`, `company` is `{ name, orgNumber, key }`. Fields are empty strings, never
undefined, when the session has no company chosen yet — check `company.key` before using it as one.

Read the context; do not cache it across mounts. A view is a fresh element with a fresh handle every
time the user opens it.

## Api addresses

The start of the string decides which API answers. Everything else about a call — the query bag, the
verbs, the entity names — is the **platform-api** skill.

```typescript
await this.host.api.get('invoices', { top: 50 });              // business API, /api/biz/invoices
await this.host.api.get('/api/statistics?model=Customer…');    // the platform host beside /api/biz
await this.host.api.get('~files/api/download?id=…');           // another platform service
```

A bare name is the business API and is what most calls are. A leading slash addresses the platform
host itself, which is how the statistics endpoint and the other API roots beside `/api/biz` are
reached; the path must be under `/api`. A `~name` prefix picks a service from the platform's
endpoints document — `files`, `job`, `integration`, `license` — matched whatever its casing, and
resolved per environment, so nothing in a plugin names a lane.

The session travels with all three; a plugin never handles a token. Anything that climbs out with
`..`, names a scheme, or reaches outside `/api` on the platform host rejects with
`host/request-failed` before it is sent.

## Files and anything else that is not json

`get`, `post`, `put` and `delete` read json. `host.api.request` is the same client with the media
type named, for a file to download, an image to draw, or a form to upload.

```typescript
const pdf = await this.host.api.request<Blob>({
    path: '~files/api/download',
    query: { id: reference },
    responseType: 'blob',
});

const url = URL.createObjectURL(pdf.data);   // yours to revoke when the view unmounts
```

It answers the whole response: `status`, `contentType`, `filename` when the service suggested one,
and `data` read as `json` (the default), `text`, `blob` or `arrayBuffer`. A `FormData` or `Blob` body
uploads one the same way.

Which service holds what, and the fields each call expects, are the **platform-api** skill.

`headers` takes `Accept`, `Accept-Language`, `Content-Type`, `Content-Disposition`, `If-Match`,
`If-None-Match`, `If-Modified-Since` and `Range`. Anything else is refused rather than dropped —
`Authorization`, `CompanyKey` and the rest belong to the session, which the platform attaches and a
plugin never chooses.

A response over **256 MB** is refused. That is what the platform itself accepts on the way in, so it
is a runaway stop rather than a working limit; read something near it a piece at a time with `Range`.

## Dialogs

Three calls, and they are the whole of it:

```typescript
const ok = await this.host.dialog.confirm({
    title: 'Delete this shipment?',
    message: 'The carrier booking is cancelled too.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
});

await this.host.dialog.message({ title: 'Booking sent', message: 'The carrier has it.' });

const reference = await this.host.dialog.prompt({
    title: 'Carrier reference',
    label: 'Reference',
    defaultValue: last,
});
```

- `confirm` resolves `true` only if the user accepted. Dismissing any other way is `false`.
- `prompt` resolves what the user typed, or `undefined` if they cancelled. It takes **no `message`** —
  a title, a field label and the field. Whatever it has to say goes in the title or the label.
- Every dialog carries the plugin's name, appended by the platform. Do not put it in the title
  yourself; the name comes from the binding, so a plugin cannot ask in the platform's own voice.

**A dialog takes no custom content.** There is no way to render markup, a form or a component inside
one — the options are the whole surface. Anything richer than a title, a line of text and one field
belongs in a **drawer** the view renders itself:

```typescript
// uni-drawer is registered by the platform; the design-system skill has the component in full.
render() {
    return html`
        <uni-drawer header="Book shipment" .open=${this.booking} @uni-close=${() => (this.booking = false)}>
            <!-- the form, in your own view -->
            <uni-drawer-footer>
                <uni-button @click=${this.book}>Book</uni-button>
            </uni-drawer-footer>
        </uni-drawer>
    `;
}
```

**One dialog at a time.** A second one while the first is open rejects with
`host/too-many-requests`. Awaiting a dialog is what stops this happening, so
`for (const row of rows) void host.dialog.confirm(...)` is the shape to avoid: ask once for the batch.

At unmount the platform closes whatever dialog the view had open. Do not write code whose data
depends on an answer arriving — the user has already left the page.

## Notifications

```typescript
this.host.notifications.success('Shipment created');
this.host.notifications.error('Booking failed', 'The carrier rejected it');
```

`success`, `info`, `warn` and `error`, each taking a message and an optional detail line. They return
nothing in both view models, so there is nothing to await and nothing to branch on. Like a dialog,
each one carries the plugin's name, appended by the platform.

Capped at five per view over a rolling ten seconds. Anything over the cap is dropped and reported
once in the console rather than refused — so a missing notification is a console line, not an error.
Use them for the outcome of something the user did, not for progress.

## Navigation

Plugins never touch `location`, `history` or `window.open`.

```typescript
await this.host.navigation.navigateTo('/sales/customer/42');
await this.host.navigation.openExternal('https://carrier.example/track/1234');
const route = await this.host.navigation.getRoute();
```

- `navigateTo` resolves the route from the application root, whatever the current URL is. A leading
  `#` is stripped. A scheme (`https:`, `javascript:`) or a protocol-relative `//host` is refused with
  `host/navigation-refused` — use `openExternal` for a link out.
- Where inside the application is not restricted, because the platform's own guards still run: a view
  cannot reach a page its user may not see, and a page with unsaved work still asks before it is left.
- `openExternal` opens a new tab with opener access severed, and takes `http` and `https` only.
  Anything else, `javascript:` and `data:` included, is refused with the same code.

## Logging

```typescript
this.host.log.info('booking requested', { shipmentId });
this.host.log.error(error, { shipmentId });
```

`info` and `warn` take a message and optional data; `error` takes the error itself. Every line goes to
the console **and** to the host application's telemetry, attributed to the plugin, its version and the
view — the console is where you look while building, telemetry is where anyone answering for the
plugin in production looks. Neither replaces the other, so log through the handle rather than through
`console` directly.

`log` is the one member that never throws. After unmount lines are dropped, with one console warning
saying so — which usually means a timer or subscription was not released.

## Slot context

Present on a native view's handle, and `undefined` when there is no page around it. Absent entirely in
an isolated view, so check before reading. The **plugin-dev** skill covers slot views; the short form
is that subscribing is the whole of it:

```typescript
this.unsubscribe = this.host.slot?.onContextChange((entity) => this.render(entity));
```

A tab view is a slot view and reads the same entity. A column cell gets `ColumnContext` instead:
`{ id, fields }`, the row's id and the fields the column declared in its manifest, keyed as declared
(`fields['Customer.OrgNumber']`). The platform reuses the cell's element across rows, so the handler
runs again with another row's values when the cell moves; render from it every time and keep no row
state outside it.

```typescript
import type { ColumnContext } from '@unimicro/plugin-types';

this.unsubscribe = this.host.slot?.onContextChange<ColumnContext>((cell) => {
    this.orgNumber = String(cell?.fields['Customer.OrgNumber'] ?? '');
});
```

## Failures

Every promise-returning call rejects with a `HostError` carrying a `code`. Branch on the code, never
on the message text:

| Code | Means |
| --- | --- |
| `host/revoked` | The view was unmounted; its handle no longer works. |
| `host/request-failed` | An API call failed; `status` says how, where there was one. |
| `host/navigation-refused` | The route or URL was not one this view may send the user to. |
| `host/too-many-requests` | A second dialog while one is already open. |

```typescript
import type { HostError } from '@unimicro/plugin-types';

try {
    await this.host.api.get('invoices', { top: 50 });
} catch (error) {
    const code = (error as HostError).code;
    if (code === 'host/revoked') return;        // the user left; nothing to report
    this.host.notifications.error('Could not load invoices');
}
```

**The handle dies with the view.** After unmount every call rejects with `host/revoked` and every
subscription the view was given is released. A view that awaits, polls or times out has to expect
that rejection: release timers and subscriptions in `disconnectedCallback`, and treat `host/revoked`
as "stop", not as an error to show.
