# Input

Use `<uni-input>` for labelled single-line text entry with native form participation and optional validation messaging. Choose a supported `type` for common text-like values; use a different form control for multiline text, constrained choices, or boolean values.

## Basic use

Always supply an accessible `label`. Hide it visually with `label-hidden` only when the surrounding interface already provides enough visual context.

```html
<uni-input name="email" type="email" label="Email address" required></uni-input>
```

## API

### Attributes and properties

| Attribute      | Property            | Type                                                               | Default     | Purpose                                                                                                                                                  |
| -------------- | ------------------- | ------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | `type`              | `'text' \| 'number' \| 'tel' \| 'email' \| 'password' \| 'search'` | `'text'`    | Selects the native input type.                                                                                                                           |
| `size`         | `size`              | `UniFieldSize \| undefined`                                        | `undefined` | Sets the input width: `xs` 82, `sm` 184, `md` 288, `lg` 384, or `xl` 592px. It defaults to the complete field width, cannot exceed it, and is reflected. |
| `field-size`   | `fieldSize`         | `UniFieldSize \| undefined`                                        | `undefined` | Sets the complete field width to one of the named sizes. It defaults to the available container width, cannot exceed it, and is reflected.               |
| `value`        | `value`             | `string`                                                           | `''`        | Holds the value displayed by the input.                                                                                                                  |
| `label`        | `label`             | `string`                                                           | `''`        | Supplies the required accessible field label.                                                                                                            |
| `label-hidden` | `labelHidden`       | `boolean`                                                          | `false`     | Visually hides the label while retaining the accessible name.                                                                                            |
| `help`         | `help`              | `string \| undefined`                                              | `undefined` | Displays help text through the field-label help affordance.                                                                                              |
| `placeholder`  | `placeholder`       | `string \| undefined`                                              | `undefined` | Shows a short hint inside the empty input. Do not use it instead of `label`.                                                                             |
| `readonly`     | `readonly`          | `boolean`                                                          | `false`     | Keeps the input focusable and form-submittable while preventing edits; reflected.                                                                        |
| `minlength`    | `minlength`         | `number \| undefined`                                              | `undefined` | Sets the native minimum value length.                                                                                                                    |
| `maxlength`    | `maxlength`         | `number \| undefined`                                              | `undefined` | Sets the native maximum value length.                                                                                                                    |
| `name`         | `name`              | `string \| undefined`                                              | `undefined` | Sets the native form field name; reflected.                                                                                                              |
| `required`     | `required`          | `boolean`                                                          | `false`     | Enables native required validation.                                                                                                                      |
| -              | `validator`         | `((value: string) => string \| undefined) \| undefined`            | `undefined` | Returns a custom error message for the current value, or `undefined` when valid.                                                                         |
| -              | `input`             | `HTMLInputElement`                                                 | -           | References the native input element inside the component. Available after the first render.                                                              |
| -              | `validity`          | `ValidityState`                                                    | -           | Read-only native constraint-validation state.                                                                                                            |
| -              | `validationMessage` | `string`                                                           | -           | Read-only current native or custom validation message.                                                                                                   |
| -              | `form`              | `HTMLFormElement \| null`                                          | -           | Read-only associated form.                                                                                                                               |

### Methods

| Method             | Result    | Purpose                                                                               |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| `checkValidity()`  | `boolean` | Checks validity without displaying the inline error message.                          |
| `reportValidity()` | `boolean` | Checks validity and displays the inline error message for a failing custom validator. |

### Events

| Event    | Detail | Propagation                                       | When                                          |
| -------- | ------ | ------------------------------------------------- | --------------------------------------------- |
| `input`  |        | Bubbles and crosses the shadow boundary.          | The user changes the input value.             |
| `change` |        | Bubbles and crosses the shadow boundary.          | The user commits a change to the input value. |
| `focus`  |        | Does not bubble, but crosses the shadow boundary. | The input gains focus.                        |
| `blur`   |        | Does not bubble, but crosses the shadow boundary. | The control loses focus.                      |

## Examples

### Input and field sizing

The field and input fill their container by default. Use `size` for the common case of narrowing only the input while leaving room for its label and validation content. Add `field-size` when the complete field also needs a specific width. Both widths remain capped by their container.

```html
<uni-input label="Reference" size="md"></uni-input>
<uni-input label="Detailed account label" field-size="lg" size="sm"></uni-input>
```

### Native and custom validation

Native constraints participate in form validation. Assign `validator` as a property for application-specific rules. Its message appears after interaction or `reportValidity()`.

```html
<form>
    <uni-input id="username" name="username" label="Username" minlength="5" required></uni-input>
    <button type="submit">Save</button>
</form>

<script type="module">
    const username = document.querySelector('#username');
    username.validator = (value) => (value === 'admin' ? 'Choose a different username.' : undefined);
</script>
```

### Help text

Use `help` for concise guidance associated with the label.

```html
<uni-input label="Invoice reference" help="Use the reference shown on the invoice."></uni-input>
```
