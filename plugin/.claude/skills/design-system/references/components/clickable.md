# Clickable

Use `<uni-clickable>` when content must trigger an action but should not use button styling. Use `<uni-button>` when the action can be presented as a button.

## Basic use

Place the actionable content in the default slot and handle the standard `click` event on the component. `<uni-clickable>` provides button semantics and activates on Enter or Space.

```html
<uni-clickable id="copy-account">Copy account number</uni-clickable>

<script type="module">
    const copyAccount = document.querySelector('#copy-account');
    copyAccount.addEventListener('click', () => {
        copyAccountNumber();
    });
</script>
```

## API

### Attributes and properties

| Attribute  | Property   | Type     | Default | Purpose                             |
| ---------- | ---------- | -------- | ------- | ----------------------------------- |
| `tabindex` | `tabindex` | `number` | `0`     | Sets the host's keyboard tab order. |

### Slots

| Slot    | Content                                           |
| ------- | ------------------------------------------------- |
| default | Content that receives accessible button behavior. |
