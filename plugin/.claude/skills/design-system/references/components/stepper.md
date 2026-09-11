# Stepper

Use the stepper family to present visual progress through a sequence of steps and optional substeps. It is presentational: application code owns step navigation, state changes, and any validation. Use the `horizontal` variant when the progress indicator should run across the page, and `interactive` when users should be able to activate step or substep controls for application navigation. Steps with substeps still expose header interaction for expanding or collapsing those substeps.

## Basic use / Required composition

Compose `<uni-stepper>` with `<uni-step>` children. Set `name` on every step and use `active` and `completed` to show the current progress.

```html
<uni-stepper>
    <uni-step name="Account" completed></uni-step>
    <uni-step name="Details" active></uni-step>
    <uni-step name="Review"></uni-step>
</uni-stepper>
```

## API

### `<uni-stepper>`

#### Attributes and properties

| Attribute     | Property      | Type      | Default | Purpose                                                                                                                                         |
| ------------- | ------------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `horizontal`  | `horizontal`  | `boolean` | `false` | Displays the step list horizontally instead of vertically.                                                                                      |
| `interactive` | `interactive` | `boolean` | `false` | Makes eligible step headers and substeps clickable so application code can handle navigation; disabled and locked steps remain non-interactive. |

#### Slots

| Slot    | Content                |
| ------- | ---------------------- |
| default | `<uni-step>` children. |

### `<uni-step>`

#### Attributes and properties

| Attribute   | Property    | Type      | Default | Purpose                                                                         |
| ----------- | ----------- | --------- | ------- | ------------------------------------------------------------------------------- |
| `name`      | `name`      | `string`  | -       | Label displayed for the step.                                                   |
| `active`    | `active`    | `boolean` | `false` | Marks the step as active; setting it true also shows its substeps.              |
| `completed` | `completed` | `boolean` | `false` | Displays the step as completed and applies the completed state to its substeps. |
| `disabled`  | `disabled`  | `boolean` | `false` | Applies disabled styling and prevents the step header from being interactive.   |
| `locked`    | `locked`    | `boolean` | `false` | Displays a lock icon and prevents the step header from being interactive.       |

#### Slots

| Slot    | Content                                           |
| ------- | ------------------------------------------------- |
| default | Optional `<uni-sub-step>` elements for this step. |

### `<uni-sub-step>`

#### Attributes and properties

| Attribute   | Property    | Type      | Default | Purpose                                                                                                                 |
| ----------- | ----------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| `name`      | `name`      | `string`  | -       | Label displayed for the substep.                                                                                        |
| `active`    | `active`    | `boolean` | `false` | Displays the substep as active.                                                                                         |
| `completed` | `completed` | `boolean` | `false` | Displays the substep as completed; the parent step's completed state also applies.                                      |
| `disabled`  | `disabled`  | `boolean` | `false` | Displays the substep as disabled and prevents it from being interactive; the parent step's disabled state also applies. |

## Examples

### Horizontal progress

Set `horizontal` when the step indicator should run from left to right.

```html
<uni-stepper horizontal>
    <uni-step name="Account" completed></uni-step>
    <uni-step name="Details" active></uni-step>
    <uni-step name="Review"></uni-step>
</uni-stepper>
```

### Steps with substeps

Place `<uni-sub-step>` elements in a step's default slot. A step with substeps can expand and collapse its substep list.

```html
<uni-stepper style="width: 16rem;">
    <uni-step name="Account" completed>
        <uni-sub-step name="Profile"></uni-sub-step>
        <uni-sub-step name="Contact"></uni-sub-step>
    </uni-step>

    <uni-step name="Details" active>
        <uni-sub-step name="Address" completed></uni-sub-step>
        <uni-sub-step name="Preferences" active></uni-sub-step>
    </uni-step>

    <uni-step name="Review" disabled>
        <uni-sub-step name="Summary"></uni-sub-step>
        <uni-sub-step name="Confirmation"></uni-sub-step>
    </uni-step>
</uni-stepper>
```

### Application-controlled navigation

Add `interactive` and listen for standard `click` events when application code should control which step is active. The component does not perform navigation or update `active`, `completed`, or `disabled` for you.

```html
<uni-stepper id="checkout-steps" interactive>
    <uni-step name="Account" active></uni-step>
    <uni-step name="Details"></uni-step>
    <uni-step name="Review"></uni-step>
</uni-stepper>

<script type="module">
    const stepper = document.querySelector('#checkout-steps');
    const steps = [...stepper.querySelectorAll('uni-step')];

    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            steps.forEach((item, itemIndex) => {
                item.active = itemIndex === index;
            });
        });
    });
</script>
```

### Locked steps

Use `locked` for a step that should show a lock icon and remain non-interactive even when the stepper is interactive.

```html
<uni-stepper interactive>
    <uni-step name="Account" completed></uni-step>
    <uni-step name="Details" active></uni-step>
    <uni-step name="Review" locked></uni-step>
</uni-stepper>
```
