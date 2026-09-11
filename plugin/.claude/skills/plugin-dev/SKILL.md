---
name: plugin-dev
description: How to build Unimicro plugins - manifest format, view models, and the publish flow.
---

# Unimicro plugin development

A plugin is described by a manifest.json at the artifact root. The plugin is the atom:
one manifest, one repository, one artifact per version.

## Manifest essentials

- `manifestVersion`: the manifest format version (currently 1).
- `apiVersion`: the Plugin Host API version the plugin targets.
- `id`: lowercase kebab-case, letters and hyphens only (no digits), immutable after creation.
- `version`: semantic version; every publish needs a new one.
- `name`, and optionally `description` and `icon`: display metadata.
- `menuSections[]` (optional): top-level menu sections this plugin contributes. See below.
- `views[]`: each view declares `model` (`native` or `isolated`), `shape` (`page`, `slot` or
  `column`), an `entry` module, and a `placement` saying where it goes in each front end it targets.
  A page view also carries a `slug` and a `menu.label`, a column view a `column` block, and a slot
  view aimed at a tab slot a `tab.label`; these are the same in every front end.

## Placement: one view, several front ends

A plugin can target more than one front end, and the front ends do not share a vocabulary: the
module a view belongs to, the menu section it appears in, the permission keys that gate it and the
slot it mounts in are each that front end's own. So a view says what it *is* once, and where it
goes once per front end:

```json
{
  "platformApps": ["appfrontend", "otherfront"],
  "views": [
    {
      "id": "shipments",
      "model": "native",
      "shape": "page",
      "entry": "./views/shipments/index.js",
      "slug": "shipments",
      "menu": { "label": "Shipments" },
      "placement": {
        "appfrontend": {
          "module": "sales",
          "menu": { "section": "common_sales" },
          "requires": ["ui_sales_orders"]
        },
        "otherfront": { "module": "logistics" }
      }
    }
  ]
}
```

- **On the view**: `id`, `model`, `shape`, `entry`, `slug`, `menu.label`, `column` and `tab` — what
  the view is, and what reads the same everywhere.
- **In each placement**: `module`, `menu.section`, `requires` and `slot` — what only that front end
  can answer.
- **A placement key must be a front end the plugin is registered for.** Publish refuses anything
  else: a placement nobody reads is a view that silently never appears.
- **A view with no placement is refused.** It would be a view no front end has anywhere to put.
- **Placing in a subset is normal.** A view listed for one of three front ends appears in that one
  and is absent from the others, which is how a plugin ships a surface only one product has.

The manifest accepts no other top-level properties — the schema rejects unknown keys. In
particular there is no `customFields`: custom fields were parked, and will return at the
application level, outside the manifest.

## View contract

The entry module default-exports a custom element. The platform assigns the view its own host handle
before the browser connects the element, so it is usable from the first line of `connectedCallback`,
and revokes it at unmount:

```typescript
import type { UnimicroHost } from '@unimicro/plugin-types';

export default class ShipmentsView extends HTMLElement {
  host!: UnimicroHost;              // assigned by the platform before connectedCallback

  async connectedCallback() {
    const { company } = await this.host.getContext();
    // render into this element (or its shadow root)
  }
}
```

`@unimicro/plugin-types` is a devDependency and ships no JavaScript — the import is type-only and is
erased at build. Two templates scaffold this: **Vite + Lit**, the default, and **TypeScript, no
bundler**, where `tsc` alone compiles a plain custom element. Lit is a custom element like any other,
and so is a plain class.

**The handle is the whole interface.** A view talks to the platform through `host` and through
nothing else: not the document outside its own element, not `window` globals, not the design system's
internals, not the platform's own network calls. Everything a view is entitled to — session, company,
business data, navigation, dialogs, notifications, logging — arrives through the handle, and anything
reachable another way is an implementation detail that will move without warning.

The **host-api** skill has the handle member by member: dialogs, notifications, navigation, logging,
context and the error codes calls reject with. Platform data through `host.api` — business records,
statistics, and services such as files — is the **platform-api** skill.

A native view runs in the platform's own document, so nothing physically stops it reaching outside the
shadow root it was given. That is what makes this a rule rather than a constraint: the isolated model
enforces it with an iframe, the native model asks you.

## Using the design system without shipping it

The platform imports `@unimicro/design-system` itself and registers its elements globally, so a view
uses `<uni-button>`, `<uni-alert>` and the rest by tag name with nothing imported at runtime:

```typescript
// Types for the elements, and no code: this import is erased at build.
import type {} from '@unimicro/design-system/components';
```

Importing the package for real is a mistake in three ways. It adds its whole bundle to every view —
around 200 kB in the shipped template, against 16 kB without it. It calls `customElements.define` on
names the platform already holds, which throws. And a second copy of the elements would drift from the
platform's as the product updates.

Keep the package as a devDependency, for the element types alone. This holds for both view models: an
isolated view runs in its own document, and the shell the platform supplies there loads the design
system before the view's entry, so the same tag names resolve. A second copy imported by the view is
ignored with a console warning.

Design tokens are a different matter — they are custom properties, they cross the shadow boundary the
platform mounts a native view behind, and `var(--text-default)` resolves without anything imported.
Selector-based rules, like the design system's utility classes, do not cross that boundary.

## One runtime: the front end you are built for

A plugin never provides its own runtime. It is loaded by a platform front end, and everything it needs
at runtime is already there: the element registry, the design system, the router, the session. The
build ships views, not an application.

- **Do not build a host page for your views.** No second Vite or Webpack app, no `index.html` that
  mounts a view, no dev server of your own beyond the one `unimicro plugin dev` starts. A host of your
  own loads its own copy of Lit and the design system, mounts the element outside the shadow root the
  platform owns, and hands it no host handle —
  so what renders there is not what the product renders, and passing there proves nothing.
- **To see a view against known data, stub the host.** `npm test` runs the real view in a DOM with a
  handle you write; the scaffold ships an example. That is the supported answer to "does this look
  right with data in it", and it is the one that keeps working when the data changes.
- **An isolated view is still a Unimicro surface.** Its shell brings the same design system elements
  and tokens the platform document has, so it is not exempt from them. A plugin that hand-rolls its own
  visual language is what this rule exists to prevent, however well-judged the styling.
- **Build for a declared front end.** The manifest names the front ends a plugin targets. A view that
  would only work in a host you wrote is not a plugin; it is an application.
- **Do not open the dev server yourself.** `unimicro plugin dev` prints a dev server URL and a
  platform link; only the platform link renders a view. The dev server hands out module files for the
  platform to fetch through the tunnel — opened directly it has no host handle, no design system and
  no shadow root, so a blank page or a 404 there says nothing about whether the plugin works. Open the
  link the CLI prints, in the configured platform app, and check it there.

If you find yourself writing HTML that is not inside a view, stop: that is the platform's job.

## Build output the manifest can name

The manifest names each view's entry file, and it cannot name a content hash. So a bundler has to emit
entry files at stable paths and hash only shared chunks — the Vite template does this with one named
input per view and `entryFileNames: '[name].js'`.

The artifact carries `manifest.json` plus the files the manifest names, so shared chunks would be left
out of the upload. `artifact.include` is what ships the rest of the build output:

```json
"artifact": { "include": ["dist/**"], "exclude": ["**/*.map"] }
```

The same file runs under both view models; which one is a manifest field:

- **native** runs in the platform document, inside a shadow root the platform owns.
- **isolated** runs in a sandboxed iframe whose document the platform supplies. The author writes no
  HTML for it, and every host call crosses a message channel — which is why the whole API is async.

`model` is a request, not a grant. Native views are only accepted from a **publisher Unimicro has
designated as trusted** — the organization the plugin's application belongs to, not the plugin itself,
so the answer is the same for everything that publisher ships. Publishing a native view without it is
rejected at upload with `model-not-allowed-by-trust`. It is not a code review and does not replace
one: every build still goes through the application release review before it reaches production.

The upload is the only thing that consults it: a native view runs in `unimicro plugin dev` whoever publishes it.

`unimicro plugin create` and `unimicro plugin add view` both ask what kind of view to add: a native
page, slot or column, or an isolated page, marking native when the publisher is not designated — so
an undesignated publisher sees the refusal before writing the view rather than at upload. `--shape`
and `--model native|isolated` answer it without prompting; with neither the flags nor a terminal, a
native page is scaffolded, as it always was. Slot and column views are native by definition, and
`--model isolated` with either shape is refused.

## Where a page view lands

A placement's `module` is the platform area the view belongs to in that front end: it becomes the
first segment of the view's URL (`/plugins/{module}/{plugin}/{slug}`) and, unless `menu.section` says
otherwise, the menu it appears in. `GET /schemas/modules.json` lists the areas with what each one
holds, and `unimicro plugin add view` offers them as a choice.

`menu.section` names a section of the plugin's own (below), or a platform section the view belongs in
rather than the one its URL implies. Otherwise leave it out — the module already says it, and two
fields holding the same answer are two fields that can disagree.

Unlike a slot id the module is not enforced at publish: an unrecognised one still routes, but its
menu entry falls into a generic Plugins section instead of sitting beside the work it belongs to.

## A menu section of your own

A plugin that is a module in its own right declares a top-level menu section, and routes views into
it by naming its id:

```json
{
  "menuSections": [
    { "id": "freight", "label": "Freight", "icon": "./assets/icons/freight.svg" }
  ],
  "views": [
    { "id": "shipments", "model": "native", "shape": "page", "entry": "./views/shipments/index.js",
      "slug": "shipments",
      "menu": { "label": "Shipments" },
      "placement": {
        "appfrontend": { "module": "sales", "menu": { "section": "freight" } }
      } }
  ]
}
```

- **Section ids are global, not per plugin.** Two plugins declaring the same one share a single
  section — that is how several plugins making up one feature set land under one menu entry. The
  first by plugin id supplies the label and the icon; the rest contribute views.
- **A section may not take a platform module's name.** Publish refuses it: declared sections resolve
  before the platform's own, so a section called `sales` would collect views meant for its menu.
- **A section appears only while something is in it.** It is built from the views that survived their
  `requires` gate, and it goes when the last of them does.
- **The icon is a glyph, not a logo.** The platform draws it as a mask filled with the menu's own
  colour, so only its alpha channel survives — colour and gradients in the file are discarded. It
  must be an SVG in the plugin's own assets, at most 32 kB, carrying no script, no `<foreignObject>`,
  no event handlers and no references outside itself; publish refuses anything else rather than
  silently stripping it. A section with no icon publishes and shows a generic glyph.
- Order is not yours to set: the platform's own sections come first, then plugin-declared ones, then
  the generic Plugins section.

`unimicro plugin add menu-section` writes the declaration, and `unimicro plugin add view` offers it
beside the platform's areas when it asks where a view belongs.

## Slot views

A `page` view owns a route and a menu entry. A `slot` view instead renders inside a host page, which
hands it the entity it is already showing:

```json
{
  "id": "freight-status",
  "model": "native",
  "shape": "slot",
  "entry": "./views/freight-status/index.js",
  "placement": {
    "appfrontend": { "slot": "sales.customer.details:summary" }
  }
}
```

```typescript
// Subscribing is the whole of it: the handler is called with the value the slot holds now, and
// again on every change. Fetching first with getContext() is redundant, and races an update that
// arrives while the await is in flight.
this.unsubscribe = this.host.slot.onContextChange((updated) => this.render(updated));
```

- The slot id must be one that front end offers. `unimicro plugin slots` lists them with what each
  renders, what context it provides and its kind; each front end serves its own list, at
  `/plugin-slots.json`. Publish checks each placement against its own front end's catalogue and
  rejects anything else, naming the alternatives — a slot with no outlet could never render. Two
  front ends may well hold the same view in differently named slots.
- Slot context is read-only and arrives as a plain-data snapshot. Change things through `host.api`
  and `host.navigation` like any other view.
- Subscriptions are released when the view unmounts, whether or not the view unsubscribes — so
  nothing leaks between views. Keep the returned unsubscribe anyway and call it when the element
  disconnects: an element moved in the DOM disconnects and reconnects on the same live handle,
  and subscribes again each time.
- A slot view declares no slug and no menu, and is **native only** — the isolated model is for
  full-page applications, and an iframe per slotted component is the wrong weight.

### Slot kinds

The catalogue gives each slot a kind, and publish refuses a view whose shape does not fit it
(`slot-kind-mismatch`):

- A plain slot is a panel on a page, for a slot view. The customer, order, invoice and product
  details pages offer a `:header` slot beside the page title; the customer page also has `:summary`
  and `:footer`.
- A `tab` slot is a tab on a details page, also for a slot view. See below.
- A `column` slot is a column in a list, for a column view. See below.

## Tab views

A slot view aimed at a `tab` slot becomes a tab on the details page. It carries the tab's label, and
every view on that slot with the same label renders inside the same tab, stacked, so two views or
two plugins can share one tab:

```json
{
  "id": "credit-history",
  "model": "native",
  "shape": "slot",
  "entry": "./views/credit-history/index.js",
  "tab": { "label": "Kreditt" },
  "placement": {
    "appfrontend": { "slot": "sales.customer.details:tab" }
  }
}
```

- Plugin tabs come after the page's own tabs. They appear and disappear with the plugin, and a tab's
  views are only in the DOM while that tab is open.
- The context is the page's entity, read through `host.slot` like any slot view.
- `tab.label` is one language, up to 100 characters. It is required on a tab slot
  (`tab-label-missing`), refused on a panel slot (`slot-kind-mismatch`) and on a page or column view
  (`tab-not-allowed`).
- A link can open a plugin tab: `?tab=plugin:Kreditt` on the order and invoice pages,
  `?pluginTab=Kreditt` on the customer page.

## Column views

A `column` view is one cell per row in a list the platform already has. The order and invoice lists
offer `sales.order.list:column` and `sales.invoice.list:column`:

```json
{
  "id": "credit-status",
  "model": "native",
  "shape": "column",
  "entry": "./views/credit-status/index.js",
  "column": {
    "label": "Kredittstatus",
    "fields": ["CustomerID", "Customer.OrgNumber"],
    "sortField": "Customer.OrgNumber"
  },
  "placement": {
    "appfrontend": { "slot": "sales.order.list:column" }
  }
}
```

- `column.label` is the header text and the name in the column picker; it is required
  (`column-label-missing`). `fields` are statistics paths relative to the list's model
  (`CustomerOrder`, `CustomerInvoice`), and the platform adds them to the list query; the row `ID` is
  always given. `sortField` must be one of `fields` (`column-sort-field-not-declared`) and makes the
  column sortable and exportable; without it the column neither sorts nor exports. `width` and
  `alignment` (`left`, `right`, `center`) are optional.
- A cell gets `{ id, fields }` through `host.slot`: the row's id and the declared fields, keyed
  exactly as declared (`ColumnContext` in `@unimicro/plugin-types`). Nothing else of the row is
  passed. Fetching more through `host.api` works but costs one call per visible row, so declare
  fields instead where you can.
- The platform reuses a cell's element across rows: the context changes when the element moves to
  another row, so render from `onContextChange` and keep no row state outside it.
- Plugin columns come after the platform's own, are visible by default, and are never part of the
  filter builder, the quick search or the sum row.
- A column view declares no slug and no menu, and is **native only**, like a slot view.

## Publish flow

1. Build the artifact (bundle entry files, include manifest.json at the root).
2. Upload the zip to the Developer API; validation errors come back all at once.
3. Activate the uploaded version; activating an older version is rollback.
