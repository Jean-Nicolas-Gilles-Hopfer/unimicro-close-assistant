# Alert

Use `<uni-alert>` for contextual status, success, warning, or critical feedback. Use the default `info` type for neutral information, `success` for a completed outcome, `warning` for caution, and `critical` for an error or urgent problem.

## Basic use

Use the default slot for the message and the `header` attribute for a plain-text heading.

```html
<uni-alert type="success" header="Changes saved">The customer record is up to date.</uni-alert>
```

## API

### Attributes and properties

| Attribute        | Property        | Type                                             | Default  | Purpose                                                                     |
| ---------------- | --------------- | ------------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| `type`           | `type`          | `'info' \| 'success' \| 'warning' \| 'critical'` | `'info'` | Selects the appearance and icon.                                            |
| `header`         | `header`        | `string \| undefined`                            | —        | Supplies a plain-text heading; the `header` slot takes its place when used. |
| `expand-label`   | `expandLabel`   | `string \| undefined`                            | —        | Labels the control that reveals collapsed content.                          |
| `collapse-label` | `collapseLabel` | `string \| undefined`                            | —        | Labels the control that hides expanded content.                             |
| `expanded`       | `expanded`      | `boolean \| undefined`                           | —        | Controls expandable content; reflected to the attribute.                    |
| `small`          | `small`         | `boolean`                                        | `false`  | Enables the compact, short-message presentation; reflected.                 |
| `closable`       | `closable`      | `boolean`                                        | `false`  | Adds the built-in close control.                                            |
| `visible`        | `visible`       | `boolean`                                        | `true`   | Controls rendering and visibility; reflected.                               |

### Methods

| Method   | Result          | Purpose                                                         |
| -------- | --------------- | --------------------------------------------------------------- |
| `hide()` | `Promise<void>` | Animates out, emits `uni-hide`, then sets `visible` to `false`. |

### Events

| Event      | Detail | Propagation                          | When                                                               |
| ---------- | ------ | ------------------------------------ | ------------------------------------------------------------------ |
| `uni-hide` | `void` | Does not bubble, compose, or cancel. | `hide()` finishes its animation, including from the close control. |

Listen for `uni-hide` on the alert itself.

### Slots

| Slot      | Content                                                        |
| --------- | -------------------------------------------------------------- |
| default   | Alert body.                                                    |
| `header`  | Heading markup; use instead of `header` when markup is needed. |
| `actions` | Buttons or links that need the alert's action spacing.         |

## Examples

### Heading markup and actions

Use the `header` slot when a heading needs markup. Put action buttons or links in the `actions` slot so the component supplies their spacing.

```html
<uni-alert type="warning">
    <strong slot="header">Invoice needs attention</strong>
    Add a due date before sending this invoice.
    <uni-button slot="actions" variant="secondary" small>Add due date</uni-button>
</uni-alert>
```

### Compact alerts

Use `small` only for a short, single-line message. It reduces padding, removes the border, and sizes the alert to its text.

```html
<uni-alert small type="warning">Payment is due tomorrow.</uni-alert>
```

### Expandable, closable, and visible states

An expandable alert requires both `expand-label` and `collapse-label`. It starts collapsed unless `expanded` is set. Keep both labels explicit and localized.

`closable` adds the built-in close control. Closing calls `hide()`, waits for its exit animation, emits `uni-hide`, and sets `visible` to `false`. Set the JavaScript `visible` property to show or hide the alert directly; direct visibility changes do not emit `uni-hide`.

```html
<uni-alert
    id="details-alert"
    type="critical"
    header="Import failed"
    expand-label="Show details"
    collapse-label="Hide details"
    closable
>
    Three rows contain invalid account numbers.
</uni-alert>

<script type="module">
    const alert = document.querySelector('#details-alert');
    alert.addEventListener('uni-hide', () => {
        // Update application state after the user closes the alert.
    });

    // Show it again later:
    // alert.visible = true;
</script>
```

`visible` is a boolean attribute/property. Do not write `visible="false"`: the presence of a boolean attribute means true. Use `element.visible = false` to hide it.
