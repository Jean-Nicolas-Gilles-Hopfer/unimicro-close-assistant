# Split button

Use `<uni-split-button>` when one action is the expected default and a few related alternatives belong in a menu attached to it. Use `<uni-button>` when there is only one action, and `<uni-dropdown-menu>` when no single action deserves prominence. The main action is always visible; the alternatives sit behind a toggle that opens an anchored menu.

## Basic use / Required composition

There are two mutually exclusive ways to fill the component: slot the menu markup yourself, or set the `actions` property. Do not combine them.

When slotting, put the main action label in the default slot and one `<uni-menu>` in the `menu` slot. Handling the click events is then your responsibility.

```html
<uni-split-button id="save-actions">
    Save

    <uni-menu slot="menu">
        <uni-menu-item data-action="save-and-close">Save and close</uni-menu-item>
        <uni-menu-item data-action="save-as-draft">Save as draft</uni-menu-item>
    </uni-menu>
</uni-split-button>

<script type="module">
    const splitButton = document.getElementById('save-actions');

    splitButton.addEventListener('click', () => save());
    splitButton.addEventListener('uni-select', (event) => runAction(event.detail.dataset.action));
</script>
```

## API

### Attributes and properties

| Attribute | Property     | Type                             | Default     | Purpose                                                                                                        |
| --------- | ------------ | -------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `variant` | `variant`    | `'primary' \| 'secondary'`       | `'primary'` | Changes the visual variant of both the main action and the toggle.                                             |
| `small`   | `small`      | `boolean`                        | `false`     | Uses the compact button size for both the main action and the toggle; reflected.                               |
| —         | `actions`    | `SplitButtonAction[]`            | `[]`        | Declares the main action and the menu items. Property only; assign it in JavaScript.                           |
| —         | `mainAction` | `SplitButtonAction \| undefined` | —           | Read-only. The first entry with `main: true`, otherwise the first entry; `undefined` while `actions` is empty. |

An `actions` entry has the shape `{ label: string; onClick: () => void; main?: boolean; disabled?: boolean }`. `label` is the button or menu-item text, `onClick` runs on activation, `main` selects the entry rendered as the main action button, and `disabled` prevents activation of the entry, whether it renders as the main action or as a menu item.

### Slots

| Slot    | Content                                                                                                                                                                                             |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | Label for the main action. Takes precedence over the main action's `label` when it contains content.                                                                                                |
| `menu`  | A `<uni-menu>` with the alternative actions. Takes precedence over the menu generated from `actions`. See [Dropdown menu](dropdown-menu.md) for menu composition, selection, and keyboard behavior. |

## Examples

### The actions property

Set `actions` when the actions are data rather than markup. The entry marked `main: true` becomes the main action button and every other entry becomes a menu item, in array order. Each entry's `onClick` runs when it is activated, so no event listeners are needed.

```html
<uni-split-button id="invoice-actions"></uni-split-button>

<script type="module">
    const splitButton = document.getElementById('invoice-actions');

    splitButton.actions = [
        { label: 'Send invoice', main: true, onClick: () => sendInvoice() },
        { label: 'Send reminder', onClick: () => sendReminder() },
        { label: 'Credit invoice', onClick: () => creditInvoice(), disabled: true }
    ];
</script>
```

### Variants and sizes

`variant` and `small` style the main action and the toggle together, matching the `<uni-button>` attributes of the same name. `primary` is the default variant and `secondary` is the alternative. `small` uses the compact size.

```html
<uni-split-button variant="secondary" small>
    Export

    <uni-menu slot="menu">
        <uni-menu-item>Export as PDF</uni-menu-item>
        <uni-menu-item>Export as CSV</uni-menu-item>
    </uni-menu>
</uni-split-button>
```

### Click handling and event propagation

The component filters what leaves the element, so listeners on `<uni-split-button>` only receive the main action:

- Clicks on the toggle and on menu items do not propagate out of the element. Handle menu selection with `uni-select`, or with a `click` listener attached to the `<uni-menu>` element itself.
- With a slotted menu and no `actions`, clicking the main action emits a `click` event from the element. This is the intended way to run the main action in that mode.
- With `actions` set, the main action's `onClick` runs and its `click` event is stopped, so a `click` listener on the element does not fire. Do not mix an `actions`-driven main action with a `click` listener on the element.
- `uni-select` from the menu reaches the element and continues to bubble in both modes.

### Keyboard and focus behavior

Focus is delegated: calling `focus()` on the element, or tabbing to it, focuses the main action button. The toggle is a separate tab stop that opens the menu, and the menu itself provides the arrow-key navigation, `Enter` and `Space` activation, and `Escape` close behavior described in [Dropdown menu](dropdown-menu.md). The menu is anchored below the element's trailing edge and its placement is not configurable.

The toggle's accessible name comes from the configured `texts.moreOptions` and defaults to `Flere valg`. Override it through `updateConfig` when the application needs another language.
