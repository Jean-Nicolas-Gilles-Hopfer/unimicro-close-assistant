# Combobox

Use `<uni-combobox>` to choose one value from a small or medium local option list when filtering by typing helps users find the choice. The component accepts only supplied options: typed text filters case-insensitively but is never committed as a free-form value. Do not use it for remote search, multiple selection, or arbitrary text entry.

## Basic use

Supply the accessible `label`, then assign the `options` property. A string selection can be initialized with the `value` attribute.

```html
<uni-combobox id="country" label="Country" value="Norway"></uni-combobox>

<script type="module">
    const country = document.querySelector('#country');
    country.options = ['Denmark', 'Finland', 'Norway', 'Sweden'];
</script>
```

## API

### Attributes and properties

| Attribute          | Property            | Type                                                                           | Default     | Purpose                                                                                                                                                          |
| ------------------ | ------------------- | ------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`          | `options`           | `any[]`                                                                        | `[]`        | Supplies the options. Can be set as an attribute (JSON array) or a property (array).                                                                             |
| `value`            | `value`             | `any`                                                                          | `undefined` | Holds the resolved committed value. The attribute initializes string values; assign non-string values as a property. Programmatic changes are silent.            |
| `size`             | `size`              | `UniFieldSize \| undefined`                                                    | `undefined` | Sets the input control width: `xs` 82, `sm` 184, `md` 288, `lg` 384, or `xl` 592px. It defaults to the complete field width, cannot exceed it, and is reflected. |
| `field-size`       | `fieldSize`         | `UniFieldSize \| undefined`                                                    | `undefined` | Sets the complete field width to one of the named sizes. It defaults to the available container width, cannot exceed it, and is reflected.                       |
| `display-field`    | `displayField`      | `string \| undefined`                                                          | `undefined` | Dot-separated path used to display and filter object options, including nested properties and array indices.                                                     |
| `value-field`      | `valueField`        | `string \| undefined`                                                          | `undefined` | Dot-separated path used to resolve object-option values. Without it, the original object is the value.                                                           |
| `label`            | `label`             | `string`                                                                       | `''`        | Supplies the required accessible field label.                                                                                                                    |
| `label-hidden`     | `labelHidden`       | `boolean`                                                                      | `false`     | Visually hides the label while retaining the accessible name.                                                                                                    |
| `help`             | `help`              | `string \| undefined`                                                          | `undefined` | Displays help text through the field-label help affordance.                                                                                                      |
| `placeholder`      | `placeholder`       | `string \| undefined`                                                          | `undefined` | Shows a hint only when there is no selection or query.                                                                                                           |
| `popup-max-height` | `popupMaxHeight`    | `string`                                                                       | `'15rem'`   | Sets the maximum popup height before options scroll.                                                                                                             |
| `popup-max-width`  | `popupMaxWidth`     | `string \| undefined`                                                          | `undefined` | Sets the maximum popup width.                                                                                                                                    |
| `name`             | `name`              | `string \| undefined`                                                          | `undefined` | Sets the native form field name; reflected.                                                                                                                      |
| `required`         | `required`          | `boolean`                                                                      | `false`     | Enables native required validation for the displayed input text.                                                                                                 |
| `readonly`         | `readonly`          | `boolean`                                                                      | `false`     | Keeps the committed value focusable and form-submittable while preventing editing and opening; reflected.                                                        |
| —                  | `validator`         | `((value: any, option: any \| undefined) => string \| undefined) \| undefined` | `undefined` | Returns a custom error message for the resolved value and exact original option, or `undefined` when valid.                                                      |
| —                  | `input`             | `HTMLInputElement`                                                             | —           | References the native input element displaying the selection or query. Available after the first render.                                                         |
| —                  | `validity`          | `ValidityState`                                                                | —           | Read-only native constraint-validation state.                                                                                                                    |
| —                  | `validationMessage` | `string`                                                                       | —           | Read-only current native or custom validation message.                                                                                                           |
| —                  | `form`              | `HTMLFormElement \| null`                                                      | —           | Read-only associated form.                                                                                                                                       |

### Methods

| Method             | Result    | Purpose                                                                               |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| `checkValidity()`  | `boolean` | Checks validity without displaying the inline error message.                          |
| `reportValidity()` | `boolean` | Checks validity and displays the inline error message for a failing custom validator. |

### Events

| Event        | Detail                                     | Propagation                        | When                                                                                                                                    |
| ------------ | ------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `uni-change` | `{ value: any; option: any \| undefined }` | Bubbles, composed, not cancelable. | The user commits a different original option or clears a selection. Typing, programmatic updates, and option reconciliation are silent. |

## Examples

### Object options and nested mappings

Set `displayField` and `valueField` to dot-separated paths. Primitive options use their string representation for display and their original primitive as the value. An object without `valueField` uses the original object reference as its value.

```html
<uni-combobox id="customer" label="Customer" display-field="contact.name" value-field="id"></uni-combobox>

<script type="module">
    const customer = document.querySelector('#customer');
    customer.options = [
        { id: 101, contact: { name: 'Ada Lovelace' } },
        { id: 102, contact: { name: 'Grace Hopper' } }
    ];

    customer.addEventListener('uni-change', (event) => {
        console.log(event.detail.value, event.detail.option);
    });
</script>
```

If a `displayField` path is missing, display falls back to `String(option)`. If a `valueField` path is missing, the option remains selectable but resolves to `undefined` and contributes no form value.

### Forms and object serialization

Strings submit unchanged, numbers and booleans submit as strings, and object values submit as JSON. Object values must therefore be JSON-serializable. Clearing removes the field from form data.

`required` uses the native text-input constraint: an empty display is invalid, while non-empty text temporarily satisfies the constraint during filtering. Uncommitted text is not submitted and is restored on blur. Native required failures use browser validation UI; the component renders inline error content only when `validator` returns a message.

```html
<form>
    <uni-combobox id="assignee" name="assignee" label="Assignee" display-field="name" required></uni-combobox>
    <button type="submit">Save</button>
</form>

<script type="module">
    const assignee = document.querySelector('#assignee');
    assignee.options = [
        { id: 1, name: 'Ada Lovelace' },
        { id: 2, name: 'Grace Hopper' }
    ];
    assignee.validator = (_value, option) => (option?.id === 2 ? 'Grace Hopper is already assigned.' : undefined);
</script>
```

### Filtering, commitment, and clearing

Click or press Enter to open the popup; clicking again closes it. When the popup is open, Enter commits the active option, or closes the popup when no option is active. Space toggles the popup while the input is empty; once the input contains text, Space inserts whitespace normally. Typing or using Arrow Up/Arrow Down opens the popup, and typing performs local case-insensitive substring filtering in the original option order. Pointer selection commits the clicked option. Escape cancels an edit. Blurring or tabbing away restores any non-empty uncommitted query.

To clear a selection, delete all input text and then blur or Tab away. This emits `uni-change` only when a selection existed. The no-results status defaults to `Ingen treff` and can be configured through `texts.combobox.noResults`.

### Input and field sizing

The field and input control fill their container by default. Use `size` for the common case of narrowing only the control while leaving room for its label and validation content. Add `field-size` when the complete field also needs a specific width. Both widths remain capped by their container.

```html
<uni-combobox id="status" label="Status" size="md"></uni-combobox>
<uni-combobox id="account" label="Detailed account label" field-size="lg" size="sm"></uni-combobox>

<script type="module">
    document.querySelector('#status').options = ['Open', 'Closed'];
    document.querySelector('#account').options = ['1000', '2000'];
</script>
```

### Popup sizing and readonly state

The popup is at least as wide as the input control and can grow for long labels. Set `popup-max-width` to cap that growth and `popup-max-height` to change the height at which options scroll; the popup also stays within the available viewport. Constrained labels ellipsize. Boolean attributes are enabled by their presence, so assign properties rather than writing values such as `readonly="false"`.

```html
<uni-combobox id="invoice" label="Invoice" popup-max-height="20rem" popup-max-width="28rem"></uni-combobox>
<uni-combobox id="managed" label="Managed choice" readonly value="One"></uni-combobox>

<script type="module">
    document.querySelector('#invoice').options = [
        'Invoice 1001 — Annual support and maintenance agreement',
        'Invoice 1002 — Professional services'
    ];
    document.querySelector('#managed').options = ['One', 'Two'];
</script>
```
