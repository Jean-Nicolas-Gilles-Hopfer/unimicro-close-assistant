# Popover

Popovers display contextual content and interactive elements in a floating panel anchored to a trigger. Use them for rich tooltips, menus, etc.
Consider the dropdown-menu component instead if all you need is a list of actions or links.

## Basic use / Required composition

Provide a button in the `toggle` slot and the overlay content in the default slot. Wrap the content in `<uni-popover-panel>` for the supplied panel styling.

```html
<uni-popover>
    <uni-button slot="toggle">Open popover</uni-button>

    <uni-popover-panel header="Popover header">
        <p>Additional information can go here.</p>

        <div style="display: flex; gap: 0.5rem;">
            <uni-button small variant="secondary">Action 1</uni-button>
            <uni-button small variant="secondary">Action 2</uni-button>
        </div>
    </uni-popover-panel>
</uni-popover>
```

## API

### `<uni-popover>`

#### Attributes and properties

| Attribute       | Property      | Type                     | Default | Purpose                                                                                                                                       |
| --------------- | ------------- | ------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `show-on-hover` | `showOnHover` | `boolean`                | `false` | Opens and closes with pointer hover. Hover mode does not alter focus; keyboard activation still uses the default focus behavior.              |
| `placement`     | `placement`   | `Placement \| undefined` | -       | Preferred placement relative to the toggle. When omitted, positioning falls back to `bottom-start` and may flip or shift to fit the viewport. |

The `placement` property uses the `Placement` type from `@floating-ui/dom`; the stories demonstrate values such as `top` and `bottom-start`.

#### Methods

| Method                                     | Result | Purpose                                                     |
| ------------------------------------------ | ------ | ----------------------------------------------------------- |
| `close(focusToggleButton: boolean = true)` | `void` | Closes the popover and optionally restores focus to toggle. |

#### Slots

| Slot     | Content                                           |
| -------- | ------------------------------------------------- |
| `toggle` | Button that opens and closes the popover.         |
| default  | Popover content wrapped in `<uni-popover-panel>`. |

### `<uni-popover-panel>`

#### Attributes and properties

| Attribute | Property | Type                  | Default | Purpose                                       |
| --------- | -------- | --------------------- | ------- | --------------------------------------------- |
| `header`  | `header` | `string \| undefined` | -       | Optional header text displayed above content. |

#### Slots

| Slot    | Content               |
| ------- | --------------------- |
| default | Popover body content. |

## Examples

### Showing supplementary information on hover

Set `show-on-hover` to open the popover when the toggle is hovered. In hover mode the component does not change focus. Keyboard activation still follows the default focus behavior.

```html
<uni-popover show-on-hover placement="top">
    <uni-icon-button slot="toggle" label="Show more info">
        <uni-icon name="circle-question" color="interactive"></uni-icon>
    </uni-icon-button>

    <uni-popover-panel header="More information">
        <p>Supplementary information for this control.</p>
    </uni-popover-panel>
</uni-popover>
```

### Closing and focus restoration

In the default mode, opening traps focus inside the overlay and closing restores focus to the toggle. Press `Escape` or click outside the overlay to close. The toggle receives `aria-haspopup="dialog"` and `aria-expanded` state, and the hidden panel is marked with `aria-hidden`. The `close` method restores focus by default; pass `false` when focus should not be returned to the toggle.

```html
<uni-popover id="account-help">
    <uni-button slot="toggle">Account help</uni-button>
    <uni-popover-panel>
        <p>Review the account requirements before continuing.</p>
        <uni-button id="close-help">Close</uni-button>
    </uni-popover-panel>
</uni-popover>

<script type="module">
    const popover = document.querySelector('#account-help');

    document.querySelector('#close-help').addEventListener('click', () => {
        // Close without moving focus back to the toggle.
        popover.close(false);
    });
</script>
```

### Sizing long content

`<uni-popover-panel>` has a default maximum width of `574px` and maximum height of `40rem`. Content that exceeds the maximum height scrolls. Override these limits on the panel when needed.

```html
<uni-popover>
    <uni-button slot="toggle">Open wide popover</uni-button>
    <uni-popover-panel class="wide-panel" header="Details">
        <p>Long content can scroll inside the panel.</p>
    </uni-popover-panel>
</uni-popover>

<style>
    .wide-panel {
        max-width: 600px;
        max-height: 400px;
    }
</style>
```
