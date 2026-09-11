# Wizard

Use the wizard family for a multi-step workflow with linear navigation or directly selectable tabs. Compose `<uni-wizard>` with one or more `<uni-wizard-step>` elements and place navigation actions in `<uni-wizard-footer>`. Use the stacked layout when the step indicator should sit above the content; use the tabbed variant when users should be able to jump directly between steps.

## Basic use / Required composition

The wizard activates the first step automatically. Set `active` on another step when a different initial step is required. A footer can be nested in each step for step-specific actions or placed directly inside the wizard for actions shared across steps. Add `data-wizard-next` or `data-wizard-prev` to a clicked navigation control to move between steps.

```html
<uni-wizard header="Create an account">
    <uni-wizard-step name="Details" header="Your details">
        <label>
            Name
            <input type="text" name="name" />
        </label>

        <uni-wizard-footer>
            <uni-button variant="primary" data-wizard-next>Next</uni-button>
        </uni-wizard-footer>
    </uni-wizard-step>

    <uni-wizard-step name="Finish" header="Review">
        Review the account details before saving.

        <uni-wizard-footer>
            <uni-button variant="secondary" data-wizard-prev>Back</uni-button>
            <uni-button variant="primary">Save</uni-button>
        </uni-wizard-footer>
    </uni-wizard-step>
</uni-wizard>
```

## API

### `<uni-wizard>`

#### Attributes and properties

| Attribute | Property  | Type                  | Default     | Purpose                                                                                          |
| --------- | --------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------ |
| `header`  | `header`  | `string \| undefined` | `undefined` | Subdued text displayed above the active step in the side-by-side layout; not shown when stacked. |
| `stacked` | `stacked` | `boolean`             | `false`     | Places the step indicator above the step content instead of beside it.                           |
| `tabbed`  | `tabbed`  | `boolean`             | `false`     | Allows users to activate steps directly from a tab-style step indicator.                         |

#### Methods

| Method                                      | Result | Purpose                                                                                                              |
| ------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| `focus(options?: FocusOptions)`             | `void` | Focuses the first focusable control in the active step.                                                              |
| `next(preventable?: boolean)`               | `void` | Activates the next step. When `preventable` is `true`, navigation can be stopped by cancelling `uni-deactivate`.     |
| `prev(preventable?: boolean)`               | `void` | Activates the previous step. When `preventable` is `true`, navigation can be stopped by cancelling `uni-deactivate`. |
| `activateStep(index: number, focus = true)` | `void` | Activates the step at the zero-based `index`; focuses it by default.                                                 |
| `activateStepByValue(value: any)`           | `void` | Activates the step whose `value` matches `value`.                                                                    |

#### Slots

| Slot     | Content                                 |
| -------- | --------------------------------------- |
| default  | `<uni-wizard-step>` children.           |
| `footer` | Navigation actions shared across steps. |

### `<uni-wizard-step>`

#### Attributes and properties

| Attribute | Property | Type                    | Default     | Purpose                                                                                                                 |
| --------- | -------- | ----------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `name`    | `name`   | `string`                | -           | Required label shown in the step indicator.                                                                             |
| `value`   | `value`  | `string \| undefined`   | `undefined` | Optional identifier used in step event details and with `activateStepByValue()`.                                        |
| `header`  | `header` | `string \| undefined`   | `undefined` | Optional heading displayed above the step body.                                                                         |
| `active`  | `active` | `boolean`               | `false`     | Controls whether this step is active; reflected.                                                                        |
| `icon`    | `icon`   | `IconName \| undefined` | `undefined` | Icon shown in the step indicator for non-linear, tabbed wizards. See the [icon reference](icon.md) for supported names. |

#### Methods

| Method                          | Result | Purpose                             |
| ------------------------------- | ------ | ----------------------------------- |
| `focus(options?: FocusOptions)` | `void` | Focuses the step content.           |
| `activate()`                    | `void` | Activates this step.                |
| `next()`                        | `void` | Activates the next wizard step.     |
| `prev()`                        | `void` | Activates the previous wizard step. |

#### Events

| Event            | Detail                                                                                | Propagation                        | When                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `uni-activate`   | `{ step: UniWizardStep, index: number, isFirstStep?: boolean, isLastStep?: boolean }` | Bubbles, composed, not cancelable. | This step is activated.                                                                                |
| `uni-deactivate` | `{ index: number, step: UniWizardStep, nextIndex: number, nextStep: UniWizardStep }`  | Bubbles, composed, cancelable.     | The wizard is about to navigate away from this step. Calling `preventDefault()` stops that navigation. |

#### Slots

| Slot     | Content                           |
| -------- | --------------------------------- |
| default  | Step body content.                |
| `footer` | Step-specific navigation actions. |

### `<uni-wizard-footer>`

#### Slots

| Slot    | Content                    |
| ------- | -------------------------- |
| default | Wizard navigation actions. |

## Examples

### Stacked layout

Add `stacked` when the step indicator should be horizontal above the step content. The wizard header is not displayed in this layout.

```html
<uni-wizard stacked>
    <uni-wizard-step name="Details" header="Details">Enter the details.</uni-wizard-step>
    <uni-wizard-step name="Review" header="Review">Review the details.</uni-wizard-step>

    <uni-wizard-footer>
        <uni-button variant="secondary" data-wizard-prev>Back</uni-button>
        <uni-button variant="primary" data-wizard-next>Next</uni-button>
    </uni-wizard-footer>
</uni-wizard>
```

### Tabbed steps

Add `tabbed` when users should be able to select steps directly from the tab-style indicator. Arrow keys move focus between tabs. Set `icon` on a step to show a supported icon in its tab.

```html
<uni-wizard tabbed>
    <uni-wizard-step name="Details" header="Details" icon="edit">Step 1</uni-wizard-step>
    <uni-wizard-step name="Due dates" header="Due dates" icon="clock">Step 2</uni-wizard-step>
    <uni-wizard-step name="Attachments" header="Attachments" icon="attachment">Step 3</uni-wizard-step>
</uni-wizard>
```

### Programmatic navigation and step values

Use the wizard or step methods when navigation is controlled by application code. Assign `value` strings to steps when indexes are not convenient to retain.

```html
<uni-wizard id="account-wizard">
    <uni-wizard-step name="Details" value="details">Details</uni-wizard-step>
    <uni-wizard-step name="Review" value="review">Review</uni-wizard-step>
</uni-wizard>

<script type="module">
    const wizard = document.querySelector('#account-wizard');
    wizard.activateStepByValue('review');
</script>
```

### Stopping navigation for validation

Listen for `uni-deactivate` on a step or its wizard ancestor when navigation initiated by the wizard must be validated. The event bubbles across the composed boundary. Calling `preventDefault()` stops the attempt; direct `next()` and `prev()` calls without `preventable: true` do not emit this event.

```html
<uni-wizard id="validated-wizard">
    <uni-wizard-step name="Details" header="Details">
        <input id="required-field" required />
    </uni-wizard-step>
    <uni-wizard-step name="Review" header="Review">Review</uni-wizard-step>

    <uni-wizard-footer>
        <uni-button data-wizard-next>Next</uni-button>
    </uni-wizard-footer>
</uni-wizard>

<script type="module">
    document.querySelector('#validated-wizard').addEventListener('uni-deactivate', (event) => {
        if (!document.querySelector('#required-field').value) {
            event.preventDefault();
        }
    });
</script>
```

### Initialization when a step activates

Use `uni-activate` for setup that should run whenever a step becomes active. Slotted step content is rendered when the wizard is added, so this event is a coordination point rather than lazy rendering.

```html
<uni-wizard>
    <uni-wizard-step name="Details">Details</uni-wizard-step>
    <uni-wizard-step id="attachments-step" name="Attachments">Attachments</uni-wizard-step>

    <uni-wizard-footer>
        <uni-button data-wizard-next>Next</uni-button>
    </uni-wizard-footer>
</uni-wizard>

<script type="module">
    document.querySelector('#attachments-step').addEventListener('uni-activate', (event) => {
        console.log(`Activated step ${event.detail.index}`);
    });
</script>
```

### Long step content

Give the wizard a height when its content should scroll within the step panel. The footer remains sticky at the bottom of the panel.

```html
<uni-wizard style="height: 25rem">
    <uni-wizard-step name="Details" header="Details">
        <p>Long step content.</p>
        <uni-wizard-footer>
            <uni-button data-wizard-next>Next</uni-button>
        </uni-wizard-footer>
    </uni-wizard-step>
</uni-wizard>
```
