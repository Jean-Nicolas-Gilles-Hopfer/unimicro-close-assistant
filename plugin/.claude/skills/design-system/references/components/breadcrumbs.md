# Breadcrumbs

Use `<uni-breadcrumbs>` to show the current page's position in a page hierarchy. Compose it from `<uni-breadcrumb-item>` elements: navigable ancestors have `href`, while the final item omits `href` and identifies the current page. The component presents the hierarchy as labelled breadcrumb navigation with list semantics; separators are decorative.

## Basic use / Required composition

Place `<uni-breadcrumb-item>` elements directly inside `<uni-breadcrumbs>`. Set `href` on ancestor pages and omit it from the current page.

```html
<uni-breadcrumbs label="Breadcrumb">
    <uni-breadcrumb-item href="/sales">Sales</uni-breadcrumb-item>
    <uni-breadcrumb-item href="/sales/invoices">Invoices</uni-breadcrumb-item>
    <uni-breadcrumb-item>Invoice 1001</uni-breadcrumb-item>
</uni-breadcrumbs>
```

## API

### `<uni-breadcrumbs>`

#### Attributes and properties

| Attribute | Property | Type     | Default                                             | Purpose                                           |
| --------- | -------- | -------- | --------------------------------------------------- | ------------------------------------------------- |
| `label`   | `label`  | `string` | Configured `texts.breadcrumbs` or `"Brødsmulesti"`. | Supplies the accessible label for the navigation. |

#### Slots

| Slot    | Content                           |
| ------- | --------------------------------- |
| default | `<uni-breadcrumb-item>` elements. |

### `<uni-breadcrumb-item>`

#### Attributes and properties

| Attribute | Property | Type     | Default | Purpose                                                                                                                          |
| --------- | -------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `href`    | `href`   | `string` | `''`    | Renders the item as a link to this URL. When omitted, the item renders as non-link current-page text with `aria-current="page"`. |

#### Slots

| Slot    | Content           |
| ------- | ----------------- |
| default | Breadcrumb label. |

## Examples

### Hash-based routing

Use the same route-style `href` values for hash-based applications. When hash-based routing is detected, the component adapts those links automatically.

```html
<uni-breadcrumbs label="Breadcrumb">
    <uni-breadcrumb-item href="/customers">Customers</uni-breadcrumb-item>
    <uni-breadcrumb-item>Customer details</uni-breadcrumb-item>
</uni-breadcrumbs>
```
