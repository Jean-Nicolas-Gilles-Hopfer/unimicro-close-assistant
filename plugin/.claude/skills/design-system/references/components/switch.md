# Switch

Use `<uni-switch>` for a boolean on/off setting with its label in the default slot. Use `<uni-checkbox>` instead when the UI calls for checkbox semantics.

## Basic use / Required composition

Place the switch label in the default slot.

```html
<uni-switch>Enable notifications</uni-switch>
```

## API

### Attributes and properties

| Attribute  | Property   | Type      | Default | Purpose                                              |
| ---------- | ---------- | --------- | ------- | ---------------------------------------------------- |
| `large`    | `large`    | `boolean` | `false` | Uses the larger switch presentation.                 |
| `checked`  | `checked`  | `boolean` | `false` | Controls whether the switch is on; reflected.        |
| `disabled` | `disabled` | `boolean` | `false` | Prevents the checked state from changing; reflected. |

### Events

| Event        | Detail               | Propagation                        | When                                |
| ------------ | -------------------- | ---------------------------------- | ----------------------------------- |
| `uni-change` | `{ value: boolean }` | Bubbles, composed, not cancelable. | User interaction changes the state. |

### Slots

| Slot    | Content       |
| ------- | ------------- |
| default | Switch label. |

## Examples

### Checked and large variants

Boolean attributes are enabled by their presence. Use `large` for the larger presentation and `checked` when the switch should initially be on.

```html
<uni-switch checked>Sync automatically</uni-switch> <uni-switch large>Use the expanded layout</uni-switch>
```

### Change events and programmatic state

Listen for `uni-change` when application state should follow user interaction. Assign the `checked` property when application code needs to set the state.

```html
<uni-switch id="status">Active</uni-switch>

<script type="module">
    const status = document.querySelector('#status');

    status.addEventListener('uni-change', (event) => {
        console.log(event.detail.value);
    });

    status.checked = true;
</script>
```

### Disabled state and keyboard interaction

The disabled state functions like a read-only state: the switch remains accessible with a keyboard, but pointer and keyboard interaction do not change its value. Boolean attributes are enabled by their presence; assign the property from JavaScript instead of using a string such as `disabled="false"`.

```html
<uni-switch disabled checked>Managed by your administrator</uni-switch>
```
