# Icon button

Use `<uni-icon-button>` for a compact icon-only action with a required accessible label. Renders a native `button` by default, but can render an anchor/link styled as a button if `href` is provided.

## Basic use / Required composition

Provide the icon in the default slot and always set `label` to describe the action for screen readers and other assistive devices. Handle actions with the standard `click` event on the custom element.

```html
<uni-icon-button label="Close">
    <uni-icon name="close"></uni-icon>
</uni-icon-button>
```

## API

### Attributes and properties

| Attribute           | Property           | Type                                                                                                   | Default     | Purpose                                                                          |
| ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------- |
| `label`             | `label`            | `string`                                                                                               | required    | Accessible name that describes the action.                                       |
| `variant`           | `variant`          | `'default' \| 'secondary' \| 'outline'`                                                                | `'default'` | Changes the visual variant.                                                      |
| `small`             | `small`            | `boolean`                                                                                              | `false`     | Uses the compact size; reflected.                                                |
| `xs`                | `xs`               | `boolean`                                                                                              | `false`     | Removes the button's surrounding size so it matches the slotted icon; reflected. |
| `loading`           | `loading`          | `boolean`                                                                                              | `false`     | Shows a progress indicator and prevents activation.                              |
| `disabled`          | `disabled`         | `boolean`                                                                                              | `false`     | Prevents activation.                                                             |
| `type`              | `type`             | `'button' \| 'submit' \| 'reset'`                                                                      | `'button'`  | Selects native button behavior when `href` is not set.                           |
| `href`              | `href`             | `string \| undefined`                                                                                  | `undefined` | Renders the control as a link and supplies its destination.                      |
| `target`            | `target`           | `string`                                                                                               | `'_self'`   | Sets the link browsing context when `href` is present.                           |
| `tooltip`           | `tooltip`          | `boolean`                                                                                              | `false`     | Displays the label in a tooltip on hover and focus.                              |
| `hide-title`        | `hideTitle`        | `boolean`                                                                                              | `false`     | Suppresses the native title generated from the label for button rendering.       |
| `tooltip-placement` | `tooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'top'`     | Sets the preferred tooltip placement.                                            |
| -                   | `button`           | `HTMLButtonElement \| HTMLAnchorElement`                                                               | -           | References the rendered button or anchor element after render.                   |

### Slots

| Slot    | Content                       |
| ------- | ----------------------------- |
| default | Icon displayed by the action. |

## Examples

### Variants and sizes

The default variant has no border or background. `secondary` follows the regular secondary-button styling, while `outline` adds a border. `small` uses the compact size. Although `xs` can keep a tight container from growing, it reduces the hit area and should generally be avoided.

```html
<uni-icon-button label="Close">
    <uni-icon name="close"></uni-icon>
</uni-icon-button>

<uni-icon-button variant="secondary" label="Close" small>
    <uni-icon name="close"></uni-icon>
</uni-icon-button>

<uni-icon-button variant="outline" label="Close">
    <uni-icon name="close"></uni-icon>
</uni-icon-button>
```

### Tooltips

Add `tooltip` to show the label on hover and focus. The preferred placement is `top`; use `tooltip-placement` for another supported position. Tooltips add event listeners, so omitting them can be appropriate for a large repeated collection of icon buttons.

```html
<uni-icon-button label="Previous" tooltip tooltip-placement="left">
    <uni-icon name="chevron-left"></uni-icon>
</uni-icon-button>

<uni-icon-button label="Next" tooltip tooltip-placement="right">
    <uni-icon name="chevron-right"></uni-icon>
</uni-icon-button>
```

### Loading and disabled states

`loading` shows a progress indicator and prevents activation. `disabled` also prevents activation. Keep the icon and label in the component so the control retains its context when the state changes. Boolean attributes are enabled by their presence; assign the property from JavaScript instead of using a string such as `disabled="false"`.

```html
<uni-icon-button id="save-button" label="Save" loading>
    <uni-icon name="save"></uni-icon>
</uni-icon-button>

<uni-icon-button label="Save" disabled>
    <uni-icon name="save"></uni-icon>
</uni-icon-button>
```

### Forms and navigation

The default `type` is `button`. For a form action, omit `href` and set `type="submit"` or `type="reset"`. For navigation, set `href`; `target` controls where the link opens. Treat form actions and navigation as mutually exclusive.

```html
<form id="customer-form">
    <uni-icon-button type="submit" label="Save customer">
        <uni-icon name="check"></uni-icon>
    </uni-icon-button>
    <uni-icon-button type="reset" label="Reset form">
        <uni-icon name="history"></uni-icon>
    </uni-icon-button>
</form>

<uni-icon-button href="/customers" label="View customers">
    <uni-icon name="buildings"></uni-icon>
</uni-icon-button>

<uni-icon-button href="https://example.com/help" target="_blank" label="Open help">
    <uni-icon name="circle-question"></uni-icon>
</uni-icon-button>
```

The component is form-associated and invokes the associated form's submit or reset behavior. It does not expose `name`, `value`, or `form` attributes.
