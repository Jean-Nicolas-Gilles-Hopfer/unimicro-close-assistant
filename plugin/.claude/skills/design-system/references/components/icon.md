# Icon

Use `<uni-icon>` to render one of the design system's named icons. Use it for decorative or contextual visuals; use `<uni-icon-button>` when the icon itself is the control.

## Basic use / Required composition

Set `name` to a supported icon name. Decorative icons should omit `label`; add `label` when the icon provides information that is not already available from its surrounding content.

```html
<uni-icon name="circle-check"></uni-icon>
```

## API

### Attributes and properties

| Attribute | Property | Type                                                                                                                  | Default     | Purpose                                                                     |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `name`    | `name`   | `IconName`                                                                                                            | -           | Selects the icon to render.                                                 |
| `color`   | `color`  | `'default' \| 'interactive' \| 'info' \| 'success' \| 'warning' \| 'critical' \| 'disabled' \| 'invert' \| undefined` | `undefined` | Selects the icon color token. When omitted, the icon uses `--icon-default`. |
| `size`    | `size`   | `number \| undefined`                                                                                                 | `undefined` | Sets the icon size in pixels.                                               |
| `label`   | `label`  | `string \| undefined`                                                                                                 | `undefined` | Adds an accessible label for an informative icon.                           |

The `name` property accepts these values:

```text
'chevron-up' | 'chevron-down' | 'chevron-left' | 'chevron-right' |
'arrow-up' | 'arrow-down' | 'arrow-right-up' | 'arrow-right-down' |
'arrow-prev' | 'arrow-next' | 'menu-collapse' | 'menu-expand' |
'add' | 'circle-add-fill' | 'subtract' | 'equal' | 'edit' | 'delete' |
'circle-check' | 'circle-check-fill' | 'check' | 'check-double' |
'circle-info' | 'circle-info-fill' | 'questionmark' | 'circle-error' |
'circle-error-fill' | 'circle-disabled-fill' | 'circle-close' |
'circle-close-fill' | 'close' | 'mail' | 'notification' | 'help-fill' |
'new-tab' | 'visible' | 'hidden' | 'calendar' | 'search' |
'circle-question' | 'drag-drop' | 'draggable' | 'box-add-fill' |
'buildings' | 'bank' | 'settings' | 'overview-settings' | 'language' | 'person' |
'person-add' | 'person-fill' | 'persons-fill' | 'menu' | 'clock' | 'more' |
'company' | 'calendar-days' | 'circle-arrow-up-fill' |
'circle-arrow-down-fill' | 'coinstack-fill' | 'hand-coin' | 'house' | 'house-fill' |
'email-fill' | 'phone-fill' | 'briefcase-fill' | 'square-check' |
'task-list-fill' | 'notes' | 'details' | 'copy' | 'pin-clock-fill' |
'clock-fill' | 'notes-fill' | 'attachment' | 'start' | 'start-fill' |
'thumb-up' | 'thumb-up-fill' | 'thumb-down' | 'thumb-down-fill' | 'flag' |
'flag-fill' | 'invoice-fill' | 'file-edit' | 'file-sign' | 'file-search' |
'file-add' | 'invoice' | 'upload' | 'download' | 'comment-add' |
'comment-added' | 'message' | 'filter' | 'folder' | 'folder-add' |
'folder-add-fill' | 'plant' | 'plant-fill' | 'save' | 'log-out' |
'document' | 'autofill' | 'active' | 'lock' | 'report' | 'mobile' |
'desktop' | 'camera' | 'car' | 'box-payment-kr' | 'box-payment-kr-fill' |
'circle-payment-kr' | 'circle-payment-kr-fill' | 'payment-arrow-kr' |
'product' | 'lightbulb' | 'lunch' | 'timer' | 'timer-fill' | 'history' |
'star' | 'star-fill' | 'link' | 'num-pad-back' | 'ai-magic'
```

### CSS parts and custom properties

| Custom property | Type       | Default | Purpose                                                                                          |
| --------------- | ---------- | ------- | ------------------------------------------------------------------------------------------------ |
| `--icon-size`   | CSS length | `20px`  | Sets the icon width and height on the host or an ancestor. The `size` property takes precedence. |

The `color` values use the public [icon design tokens](../design-tokens.md). The icon can also inherit a regular CSS `color` value when a color token is not suitable.

## Examples

### Accessible and decorative icons

Omit `label` when the icon is decorative. When it contributes information not already present in nearby content, provide a concise label; the component exposes that label to assistive technology as an image.

```html
<span>
    <uni-icon name="circle-check"></uni-icon>
    Saved
</span>

<uni-icon name="circle-info" label="Information"></uni-icon>
```

### Color and size

Use a supported `color` value for the supplied icon tokens. Set `size` in pixels, or set `--icon-size` on the icon or an ancestor; `size` takes precedence when both are set.

```html
<uni-icon name="circle-check" color="success" size="26"></uni-icon>

<div style="--icon-size: 22px">
    <uni-icon name="circle-info" color="info"></uni-icon>
</div>
```
