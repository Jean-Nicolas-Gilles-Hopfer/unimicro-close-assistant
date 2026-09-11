# Checkbox

Use `<uni-checkbox>` for an independently toggled choice. Use `<uni-checkbox-group>` to label related checkbox controls, and use `<uni-checkbox-card>` when a choice needs a card-styled surface.

## Basic use / Required composition

Place the checkbox label in the default slot. For related choices, put direct `<uni-checkbox>` or `<uni-checkbox-card>` children in a `<uni-checkbox-group>` and provide the group's `label`.

```html
<uni-checkbox>Subscribe to product updates</uni-checkbox>
```

## API

### `<uni-checkbox>`

#### Attributes and properties

| Attribute      | Property      | Type      | Default | Purpose                                                                  |
| -------------- | ------------- | --------- | ------- | ------------------------------------------------------------------------ |
| `checked`      | `checked`     | `boolean` | `false` | Controls whether the checkbox is checked; reflected.                     |
| `disabled`     | `disabled`    | `boolean` | `false` | Prevents the checked state from changing; reflected.                     |
| `label-hidden` | `labelHidden` | `boolean` | `false` | Hides the built-in label visually while keeping the label in the markup. |

#### Methods

| Method     | Result | Purpose                                                |
| ---------- | ------ | ------------------------------------------------------ |
| `toggle()` | —      | Toggles the checked state when the control is enabled. |

#### Events

| Event        | Detail               | Propagation                        | When                       |
| ------------ | -------------------- | ---------------------------------- | -------------------------- |
| `uni-change` | `{ value: boolean }` | Bubbles, composed, not cancelable. | The checked state changes. |

#### Slots

| Slot    | Content         |
| ------- | --------------- |
| default | Checkbox label. |

### `<uni-checkbox-card>`

#### Attributes and properties

| Attribute    | Property     | Type      | Default | Purpose                                                |
| ------------ | ------------ | --------- | ------- | ------------------------------------------------------ |
| `checked`    | `checked`    | `boolean` | `false` | Controls whether the card is checked; reflected.       |
| `disabled`   | `disabled`   | `boolean` | `false` | Prevents the checked state from changing; reflected.   |
| `horizontal` | `horizontal` | `boolean` | `false` | Lays out the card content horizontally and centers it. |

#### Events

| Event        | Detail               | Propagation                        | When                       |
| ------------ | -------------------- | ---------------------------------- | -------------------------- |
| `uni-change` | `{ value: boolean }` | Bubbles, composed, not cancelable. | The checked state changes. |

#### Slots

| Slot          | Content                                |
| ------------- | -------------------------------------- |
| default       | Checkbox label or card title.          |
| `description` | Supporting description for the choice. |

### `<uni-checkbox-group>`

#### Attributes and properties

| Attribute    | Property     | Type      | Default | Purpose                                   |
| ------------ | ------------ | --------- | ------- | ----------------------------------------- |
| `label`      | `label`      | `string`  | —       | Visible label for the group of controls.  |
| `horizontal` | `horizontal` | `boolean` | `false` | Lays out the group controls horizontally. |

#### Slots

| Slot      | Content                                              |
| --------- | ---------------------------------------------------- |
| default   | Checkbox or checkbox-card controls.                  |
| `tooltip` | Supplementary help displayed beside the group label. |

## Examples

### Grouping related checkboxes

Use a group when several checkbox controls share a label. Add `horizontal` when the group controls should be laid out horizontally.

```html
<uni-checkbox-group label="Notifications" horizontal>
    <uni-checkbox checked>Email</uni-checkbox>
    <uni-checkbox>SMS</uni-checkbox>
    <uni-checkbox>Push notifications</uni-checkbox>
</uni-checkbox-group>
```

### Checkbox cards

Put the card title in the default slot and longer supporting text in the `description` slot. Use `horizontal` on a card when its content should be centered in a horizontal layout.

```html
<uni-checkbox-group label="Plans">
    <uni-checkbox-card checked>
        Basic
        <span slot="description">For individuals getting started.</span>
    </uni-checkbox-card>
    <uni-checkbox-card horizontal>
        Pro
        <span slot="description">For teams that need more features.</span>
    </uni-checkbox-card>
</uni-checkbox-group>
```

### Change events and programmatic state

The `uni-change` event detail contains the new boolean checked value. Assign the `checked` property or call `toggle()` from JavaScript when application state needs to change the control.

```html
<uni-checkbox id="terms">Accept the terms</uni-checkbox>

<script type="module">
    const terms = document.querySelector('#terms');

    terms.addEventListener('uni-change', (event) => {
        console.log(event.detail.value);
    });

    terms.checked = true;
    terms.toggle();
</script>
```

### Hidden labels, disabled state, and keyboard interaction

The default label is required even when `label-hidden` is used; the attribute only hides it visually. A visible label cannot be supplied through a separate light-DOM `<label>` element. Both checkboxes and checkbox cards can be toggled with Enter or Space. Disabled controls remain focusable, but clicks and keyboard activation do not change them. `uni-checkbox.toggle()` also does nothing while disabled; assigning `checked` directly still updates the property.

Boolean attributes are enabled by their presence. To change a boolean state from JavaScript, assign the property instead of using a string such as `checked="false"` or `disabled="false"`.

```html
<uni-checkbox label-hidden>Account status</uni-checkbox> <uni-checkbox disabled checked>Locked setting</uni-checkbox>
```

### Tooltip in a group label

Put supplementary help in the group's `tooltip` slot. The tooltip toggle is focusable, so it adds an extra Tab stop when navigating between form fields; avoid overusing group label tooltips in large forms.

```html
<uni-checkbox-group label="Delivery options">
    <span slot="tooltip">Choose every delivery method that applies.</span>
    <uni-checkbox>Email</uni-checkbox>
    <uni-checkbox>Text message</uni-checkbox>
</uni-checkbox-group>
```

## Documentation gaps and conflicts

- The checkbox-card story describes a default maximum width of 596px, while the implementation sets `:host` `max-width` to 700px. The reference does not promise either value; maintainers should clarify the intended default.
