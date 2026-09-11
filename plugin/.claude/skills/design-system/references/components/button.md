# Button

Use `<uni-button>` without `href` for an action. Add `href` when the control navigates; it then renders a link while keeping button styling.

## Basic use

The default `primary` variant represents an emphasized action. Handle actions with the standard `click` event on the custom element.

```html
<uni-button>Save</uni-button>
```

## API

### Attributes and properties

| Attribute  | Property   | Type                                                      | Default     | Purpose                                                        |
| ---------- | ---------- | --------------------------------------------------------- | ----------- | -------------------------------------------------------------- |
| `variant`  | `variant`  | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive'` | `'primary'` | Changes the visual variant.                                    |
| `loading`  | `loading`  | `boolean`                                                 | `false`     | Shows progress and prevents activation.                        |
| `small`    | `small`    | `boolean`                                                 | `false`     | Enables the compact size; reflected.                           |
| `xs`       | `xs`       | `boolean`                                                 | `false`     | Removes whitespace for tertiary buttons only; reflected.       |
| `caret`    | `caret`    | `boolean`                                                 | `false`     | Adds a dropdown indicator and matching spacing.                |
| `disabled` | `disabled` | `boolean`                                                 | `false`     | Prevents button or link activation.                            |
| `type`     | `type`     | `'button' \| 'submit' \| 'reset'`                         | `'button'`  | Selects native button behavior when `href` is not set.         |
| `href`     | `href`     | `string \| undefined`                                     | `undefined` | Renders the control as a link and supplies its destination.    |
| `target`   | `target`   | `'_self' \| '_blank'`                                     | `'_self'`   | Sets the link browsing context when `href` is present.         |
| —          | `button`   | `HTMLButtonElement \| HTMLAnchorElement`                  | —           | References the rendered button or anchor element after render. |

### Slots

| Slot    | Content                                 |
| ------- | --------------------------------------- |
| default | Button label and optional icon content. |

## Examples

### Variants and sizes

`secondary` is an alternative action, `tertiary` is the least visually prominent option, and `destructive` identifies a destructive action. `small` uses the compact size. `xs` removes surrounding whitespace and applies only to `tertiary`.

The public API defines these variants as appearance choices but does not specify how many primary actions a view should contain.

```html
<uni-button>Save</uni-button>
<uni-button variant="secondary">Cancel</uni-button>
<uni-button variant="destructive">Delete</uni-button>
<uni-button variant="tertiary" xs>Learn more</uni-button>
```

### Forms and navigation

The default `type` is `button`. For a form action, omit `href` and set `type="submit"` or `type="reset"`. For navigation, set `href`; `target` controls where the link opens. The component adapts route-style `href` values when it detects hash-based routing.

Treat form actions and navigation as mutually exclusive. Under the current implementation, combining `href` with `type="submit"` or `type="reset"` can both navigate and submit or reset the associated form.

```html
<form id="customer-form">
    <!-- form fields -->
    <uni-button type="submit">Save customer</uni-button>
    <uni-button type="reset" variant="secondary">Reset</uni-button>
</form>

<uni-button href="/customers" variant="tertiary">View all customers</uni-button>
<uni-button href="https://example.com/help" target="_blank">Open help</uni-button>
```

The component is form-associated and invokes the associated form's submit or reset behavior. It does not expose `name`, `value`, or `form` attributes.

### Loading and disabled states

`loading` replaces the visible content with a progress indicator and prevents activation. `disabled` also prevents button or link activation. Keep the original label in the default slot so the control retains its context.

```html
<uni-button id="save-button">Save</uni-button>

<script type="module">
    const saveButton = document.querySelector('#save-button');
    saveButton.loading = true;
    try {
        await saveChanges();
    } finally {
        saveButton.loading = false;
    }
</script>
```

### Icons and a menu caret

Place `<uni-icon>` before or after the label for a prefix or suffix icon. When a button toggles a dropdown, use `caret` instead of adding a chevron manually; it supplies the endorsed indicator and matching spacing.

```html
<uni-button variant="secondary">
    <uni-icon name="settings"></uni-icon>
    Settings
</uni-button>

<uni-button slot="toggle" variant="secondary" small caret>More options</uni-button>
```
