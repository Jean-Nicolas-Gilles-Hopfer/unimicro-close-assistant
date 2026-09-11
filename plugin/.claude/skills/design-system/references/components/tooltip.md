# Tooltip

Use `<uni-tooltip>` for short, plain-text explanatory information shown when an anchor is hovered or focused. Use `<uni-popover>` instead when the content is more than a few words, needs rich markup, interaction, or more space.

## Basic use / Required composition

Set `text` to a non-empty message to display. Without content in the default slot, the component supplies a focusable information icon as the anchor.

```html
<uni-tooltip text="This setting applies to future invoices."></uni-tooltip>
```

To attach the tooltip to a specific element, put it in the default slot.

## API

### Attributes and properties

| Attribute   | Property    | Type                                                                                                   | Default | Purpose                                                                                 |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------- |
| `text`      | `text`      | `string`                                                                                               | `''`    | Plain-text message displayed by the tooltip.                                            |
| `placement` | `placement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'top'` | Preferred position relative to the anchor; the overlay may move to fit available space. |
| `delay`     | `delay`     | `number`                                                                                               | `250`   | Duration in milliseconds between hover and the tooltip being displayed.                 |

### Slots

| Slot    | Content                                                                                  |
| ------- | ---------------------------------------------------------------------------------------- |
| default | The tooltip's trigger or anchor element. If omitted, the component renders an info icon. |

## Examples

### Attaching to a specific control

Use a natively focusable control, such as a button or another design-system component, when the anchor is also an interactive control.

```html
<uni-tooltip text="Shows the customer account number.">
    <uni-button variant="secondary">Account number</uni-button>
</uni-tooltip>
```

### Attaching to a non-focusable element

Non-focusable elements are supported when the tooltip only adds supplementary information. The component adds `tabindex="0"` to the slotted element so the tooltip can also be reached with keyboard focus.

```html
<uni-tooltip text="Organization number">
    <span>Org.no</span>
</uni-tooltip>
```

### Accessibility and focus

The tooltip opens when its anchor is hovered or focused and closes when the anchor is no longer hovered or focused. It augments the anchor's accessible labeling when needed without replacing an existing label: unlabeled anchors receive the tooltip text as an accessible label, while already-labelled anchors receive it as an accessible description.

```html
<uni-tooltip text="Describes the report's date range.">
    <button type="button" aria-label="Report date range">?</button>
</uni-tooltip>
```

### Placement and hover delay

Set `placement` to one of the supported positions when the default top placement is not suitable. The overlay can move if the preferred position does not fit. `delay` affects hover; focusing the anchor displays the tooltip immediately.

```html
<uni-tooltip text="Exports the current report." placement="bottom-end" delay="500">
    <button type="button">Export report</button>
</uni-tooltip>
```

### Choosing a popover for richer content

Tooltips cannot contain interactive content and their panel is not focusable. Use `<uni-popover>` for explanatory content that includes markup, actions, or links.
