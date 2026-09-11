# Page header

Use `<uni-page-header>` to present a page heading, optional linked breadcrumb ancestors, and page actions. The heading identifies the current page, so property-based breadcrumbs represent only its ancestors.

## Basic use

Use the `breadcrumbs` slot when breadcrumb markup is available directly in the page.

```html
<uni-page-header heading="Invoice 1001">
    <uni-breadcrumbs slot="breadcrumbs">
        <uni-breadcrumb-item href="/sales">Sales</uni-breadcrumb-item>
        <uni-breadcrumb-item href="/sales/invoices">Invoices</uni-breadcrumb-item>
    </uni-breadcrumbs>
    <uni-button>Create invoice</uni-button>
</uni-page-header>
```

## Sticky positioning

The element is `position: sticky; top: 0` by default, so the header stays visible while the page scrolls. It sticks to the nearest scrolling ancestor, so place it inside the element that scrolls.

Override the host positioning to opt out:

```css
uni-page-header {
    position: static;
}
```

Adjust `top` the same way when the header sits below another fixed element.

## API

### Attributes and properties

| Attribute       | Property       | Type                                | Default | Purpose                                                 |
| --------------- | -------------- | ----------------------------------- | ------- | ------------------------------------------------------- |
| `heading`       | `heading`      | `string`                            | `''`    | Sets the page header heading.                           |
| `heading-level` | `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6`        | `1`     | Selects the semantic heading level.                     |
| —               | `breadcrumbs`  | `{ label: string; href: string }[]` | `[]`    | Supplies linked breadcrumb ancestors above the heading. |

### Slots

| Slot          | Content                                                                                                                                                                                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`     | Page header actions, displayed at the end of the header.                                                                                                                                                                                            |
| `breadcrumbs` | A `<uni-breadcrumbs>` element displayed above the heading; overrides property breadcrumbs when present. A `<uni-breadcrumbs>` element placed in the default slot instead is moved here automatically, so explicit `slot="breadcrumbs"` is optional. |

## Examples

### Programmatic breadcrumbs

Set `breadcrumbs` as a JavaScript property when breadcrumb data is available programmatically.

```html
<uni-page-header id="invoice-page-header" heading="Invoice 1001">
    <uni-button variant="secondary">Secondary</uni-button>
    <uni-button>Primary action</uni-button>
</uni-page-header>

<script type="module">
    const pageHeader = document.getElementById('invoice-page-header');
    pageHeader.breadcrumbs = [
        { label: 'Sales', href: '/sales' },
        { label: 'Invoices', href: '/sales/invoices' }
    ];
</script>
```
