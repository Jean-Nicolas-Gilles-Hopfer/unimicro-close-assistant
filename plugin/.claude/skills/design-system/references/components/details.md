# Details

Use `<uni-details>` for a compact disclosure with a brief text header and expandable content. The `label` supplies the header text; place the content revealed by the disclosure in the default slot.

## Basic use

Set `label` for the disclosure header and place its additional content in the default slot.

```html
<uni-details label="Details header"> Additional information appears when the disclosure is opened. </uni-details>
```

## API

### Attributes and properties

| Attribute | Property | Type      | Default | Purpose                                              |
| --------- | -------- | --------- | ------- | ---------------------------------------------------- |
| `label`   | `label`  | `string`  | `''`    | Supplies the disclosure header text.                 |
| `open`    | `open`   | `boolean` | `false` | Controls whether the content is expanded; reflected. |

### Events

| Event       | Detail | Propagation                        | When                 |
| ----------- | ------ | ---------------------------------- | -------------------- |
| `uni-open`  | `{}`   | Bubbles, composed, not cancelable. | The panel is opened. |
| `uni-close` | `{}`   | Bubbles, composed, not cancelable. | The panel is closed. |

### Slots

| Slot    | Content                                       |
| ------- | --------------------------------------------- |
| default | Content revealed when the disclosure is open. |

## Examples

### Controlling the open state

The `open` property is boolean. Use the JavaScript property when changing the state programmatically; do not use `open="false"`, because a boolean attribute's presence means true.

```html
<uni-details id="account-details" label="Account information"> Contact information and account settings. </uni-details>

<script type="module">
    const details = document.querySelector('#account-details');

    details.addEventListener('uni-open', () => {
        // Refresh or reveal related application state.
    });

    details.open = true;
</script>
```
