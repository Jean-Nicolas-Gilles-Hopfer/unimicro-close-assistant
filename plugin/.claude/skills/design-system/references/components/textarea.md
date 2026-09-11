# Textarea

Use `<uni-textarea>` for labelled multi-line text entry with native form participation and optional validation messaging. Use `<uni-input>` instead for single-line values.

## Basic use

Always supply an accessible `label`. Hide it visually with `label-hidden` only when the surrounding interface already provides enough visual context.

```html
<uni-textarea name="notes" label="Notes"></uni-textarea>
```

## API

### Attributes and properties

| Attribute      | Property            | Type                                                       | Default      | Purpose                                                                                                        |
| -------------- | ------------------- | ---------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------- |
| `value`        | `value`             | `string`                                                   | `''`         | Holds the value displayed by the textarea.                                                                     |
| `label`        | `label`             | `string`                                                   | `''`         | Supplies the required accessible field label.                                                                  |
| `label-hidden` | `labelHidden`       | `boolean`                                                  | `false`      | Visually hides the label while retaining the accessible name.                                                  |
| `help`         | `help`              | `string \| undefined`                                      | `undefined`  | Displays help text through the field-label help affordance.                                                    |
| `placeholder`  | `placeholder`       | `string \| undefined`                                      | `undefined`  | Shows a short hint inside the empty control. Do not use it instead of `label`.                                 |
| `resize`       | `resize`            | `'none' \| 'vertical' \| 'horizontal' \| 'both' \| 'auto'` | `'vertical'` | Controls how the textarea can be resized. `auto` grows and shrinks the textarea to fit its content; reflected. |
| `readonly`     | `readonly`          | `boolean`                                                  | `false`      | Keeps the textarea focusable and form-submittable while preventing edits; reflected.                           |
| `minlength`    | `minlength`         | `number \| undefined`                                      | `undefined`  | Sets the native minimum value length.                                                                          |
| `maxlength`    | `maxlength`         | `number \| undefined`                                      | `undefined`  | Sets the native maximum value length.                                                                          |
| `name`         | `name`              | `string \| undefined`                                      | `undefined`  | Sets the native form field name; reflected.                                                                    |
| `required`     | `required`          | `boolean`                                                  | `false`      | Enables native required validation.                                                                            |
| -              | `validator`         | `((value: string) => string \| undefined) \| undefined`    | `undefined`  | Returns a custom error message for the current value, or `undefined` when valid.                               |
| -              | `input`             | `HTMLTextAreaElement`                                      | -            | References the native textarea element inside the component. Available after the first render.                 |
| -              | `validity`          | `ValidityState`                                            | -            | Read-only native constraint-validation state.                                                                  |
| -              | `validationMessage` | `string`                                                   | -            | Read-only current native or custom validation message.                                                         |
| -              | `form`              | `HTMLFormElement \| null`                                  | -            | Read-only associated form.                                                                                     |

### Methods

| Method             | Result    | Purpose                                                                               |
| ------------------ | --------- | ------------------------------------------------------------------------------------- |
| `checkValidity()`  | `boolean` | Checks validity without displaying the inline error message.                          |
| `reportValidity()` | `boolean` | Checks validity and displays the inline error message for a failing custom validator. |

### Events

| Event    | Detail | Propagation                                       | When                                             |
| -------- | ------ | ------------------------------------------------- | ------------------------------------------------ |
| `input`  |        | Bubbles and crosses the shadow boundary.          | The user changes the input value.                |
| `change` |        | Bubbles and crosses the shadow boundary.          | The user commits a change to the textarea value. |
| `focus`  |        | Does not bubble, but crosses the shadow boundary. | The textarea gains focus.                        |
| `blur`   |        | Does not bubble, but crosses the shadow boundary. | The control loses focus.                         |

## Examples

### Resizing behavior

`resize="auto"` grows and shrinks the textarea to fit its content instead of showing a scrollbar or a manual resize handle.

```html
<uni-textarea
    label="Notes"
    resize="auto"
    value="This textarea grows and shrinks automatically as its content changes."
></uni-textarea>
```

### Native and custom validation

Native constraints participate in form validation. Assign `validator` as a property for application-specific rules. Its message appears after interaction or `reportValidity()`.

```html
<form>
    <uni-textarea id="notes" name="notes" label="Notes" minlength="5" required></uni-textarea>
    <button type="submit">Save</button>
</form>

<script type="module">
    const notes = document.querySelector('#notes');
    notes.validator = (value) => (value.length < 5 ? 'Enter at least five characters.' : undefined);
</script>
```

### Help text

Use `help` for concise guidance associated with the label.

```html
<uni-textarea label="Notes" help="Describe the issue in your own words."></uni-textarea>
```

## Documentation gaps and conflicts

The component description in source notes character counting as a planned but unimplemented feature ("optional resizing and character counting (TODO)"). No character-counting API is declared in the current manifest, so none is documented here.
