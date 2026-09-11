# Radio

Use `<uni-radio-group>` with direct `<uni-radio-button>` or `<uni-radio-card>` children when a user must choose one option from a list. Use radio buttons for compact options and radio cards when an option needs a bordered surface, supporting description, or richer content.

## Basic use / Required composition

Give the group a label and place each radio option directly in its default slot. Set the group's `value` to the value of the initially selected option.

```html
<uni-radio-group label="Delivery method" value="email">
    <uni-radio-button value="email">Email</uni-radio-button>
    <uni-radio-button value="sms">SMS</uni-radio-button>
    <uni-radio-button value="post">Post</uni-radio-button>
</uni-radio-group>
```

## API

### `<uni-radio-button>`

#### Attributes and properties

| Attribute | Property | Type  | Default | Purpose                                                                    |
| --------- | -------- | ----- | ------- | -------------------------------------------------------------------------- |
| `value`   | `value`  | `any` | —       | Value associated with the option. The group uses it as its selected value. |

#### Slots

| Slot    | Content       |
| ------- | ------------- |
| default | Option label. |

### `<uni-radio-card>`

#### Attributes and properties

| Attribute    | Property     | Type      | Default | Purpose                                                |
| ------------ | ------------ | --------- | ------- | ------------------------------------------------------ |
| `value`      | `value`      | `any`     | —       | Value associated with the option.                      |
| `horizontal` | `horizontal` | `boolean` | `false` | Lays out the card content horizontally and centers it. |

#### Slots

| Slot          | Content                                |
| ------------- | -------------------------------------- |
| default       | Option label or card title.            |
| `description` | Supporting description for the choice. |

### `<uni-radio-group>`

#### Attributes and properties

| Attribute      | Property      | Type                  | Default | Purpose                                                        |
| -------------- | ------------- | --------------------- | ------- | -------------------------------------------------------------- |
| `label`        | `label`       | `string \| undefined` | —       | Label for the group of radio controls.                         |
| `value`        | `value`       | `any`                 | —       | Value of the selected radio option.                            |
| `label-hidden` | `labelHidden` | `boolean`             | `false` | Hides the group label visually while keeping it in the markup. |
| `disabled`     | `disabled`    | `boolean`             | `false` | Prevents the group's selected value from changing.             |
| `horizontal`   | `horizontal`  | `boolean`             | `false` | Lays out the radio controls horizontally.                      |

#### Events

| Event        | Detail               | Propagation                        | When                                               |
| ------------ | -------------------- | ---------------------------------- | -------------------------------------------------- |
| `uni-change` | `{ value: unknown }` | Bubbles, composed, not cancelable. | A radio option with a different value is selected. |

#### Slots

| Slot      | Content                                                     |
| --------- | ----------------------------------------------------------- |
| default   | Direct `<uni-radio-button>` or `<uni-radio-card>` children. |
| `tooltip` | Supplementary help displayed beside the group label.        |

## Examples

### Horizontal radio controls

Set `horizontal` on the group when the options should be laid out horizontally.

```html
<uni-radio-group label="View mode" value="list" horizontal>
    <uni-radio-button value="list">List</uni-radio-button>
    <uni-radio-button value="grid">Grid</uni-radio-button>
</uni-radio-group>
```

### Radio cards and supporting descriptions

Put the card title in the default slot and longer supporting text in the `description` slot. Set `horizontal` on an individual card when its content should be centered in a horizontal layout.

```html
<uni-radio-group label="Plan" value="basic">
    <uni-radio-card value="basic">
        Basic
        <span slot="description">For individuals getting started.</span>
    </uni-radio-card>
    <uni-radio-card value="pro" horizontal>
        Pro
        <span slot="description">For teams that need more features.</span>
    </uni-radio-card>
</uni-radio-group>
```

### Selection events and programmatic state

Listen for `uni-change` on the group when application state should follow a selection change; reselecting the option with the current value does not emit another event. Assign the group's `value` property when application code needs to select an option.

```html
<uni-radio-group id="billing" label="Billing cycle" value="monthly">
    <uni-radio-button value="monthly">Monthly</uni-radio-button>
    <uni-radio-button value="annual">Annual</uni-radio-button>
</uni-radio-group>

<script type="module">
    const billing = document.querySelector('#billing');

    billing.addEventListener('uni-change', (event) => {
        console.log(event.detail.value);
    });

    billing.value = 'annual';
</script>
```

### Labels, tooltips, disabled state, and keyboard interaction

Keep a meaningful `label` even when using `label-hidden`; the attribute only hides the label visually. Put supplementary help in the group's `tooltip` slot. Its tooltip toggle is focusable, so it adds a Tab stop when moving between form fields.

The group handles `Enter` and `Space` to select the focused option. `ArrowUp` and `ArrowLeft` move to the previous option, while `ArrowDown` and `ArrowRight` move to the next option; navigation wraps at either end. A disabled group remains accessible for reading and focus, but pointer and keyboard selection do not change its value.

```html
<uni-radio-group label="Account type" label-hidden disabled value="personal">
    <span slot="tooltip">Choose the type used for this account.</span>
    <uni-radio-button value="personal">Personal</uni-radio-button>
    <uni-radio-button value="business">Business</uni-radio-button>
</uni-radio-group>
```

Boolean attributes are enabled by their presence. To change a boolean state from JavaScript, assign the property instead of using a string such as `disabled="false"` or `horizontal="false"`.

## Documentation gaps and conflicts

- The radio-card story describes a default maximum width of 596px, while `radio-card.ts` sets `:host` `max-width` to 700px. This reference does not promise either value; maintainers should clarify the intended default.
