# Dropdown Menu

Use the dropdown-menu family for a button-triggered list of actions or links. Use a popover instead when the popup contains arbitrary interactive content rather than menu items.

## Required composition

Give a button `slot="toggle"`, then place one `<uni-menu>` in the default slot. Menu items must be direct children of the menu; optional headers and dividers can be placed between them.

```html
<uni-dropdown-menu id="actions-menu" placement="bottom-end">
    <uni-button slot="toggle" variant="secondary" small caret>More options</uni-button>

    <uni-menu>
        <uni-menu-item data-action="edit">Edit</uni-menu-item>
        <uni-menu-item data-action="duplicate">Duplicate</uni-menu-item>
        <uni-menu-item data-action="delete" disabled>Delete</uni-menu-item>
    </uni-menu>
</uni-dropdown-menu>

<script type="module">
    const dropdown = document.querySelector('#actions-menu');
    dropdown.addEventListener('uni-select', (event) => {
        const item = event.detail;
        runAction(item.dataset.action);
    });
</script>
```

The toggle slot is intended for a button. Storybook endorses `<uni-button>` and `<uni-icon-button>` toggles. The dropdown supplies `aria-haspopup` and `aria-expanded` state and closes after `uni-select`.

## API

### `<uni-dropdown-menu>`

#### Attributes and properties

| Attribute   | Property    | Type                                                         | Default          | Purpose                                     |
| ----------- | ----------- | ------------------------------------------------------------ | ---------------- | ------------------------------------------- |
| `placement` | `placement` | `'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'` | `'bottom-start'` | Preferred placement relative to the toggle. |

#### Methods

| Method                                       | Result | Purpose                                                                 |
| -------------------------------------------- | ------ | ----------------------------------------------------------------------- |
| `close(returnFocusToToggle: boolean = true)` | `void` | Closes the menu and optionally returns focus to the toggle after close. |

#### Slots

| Slot     | Content                                        |
| -------- | ---------------------------------------------- |
| `toggle` | Button that opens and closes the menu.         |
| default  | The `<uni-menu>` containing available actions. |

### `<uni-menu>`

#### Attributes and properties

`<uni-menu>` declares no custom attributes.

| Attribute | Property       | Type                       | Default | Purpose                                                 |
| --------- | -------------- | -------------------------- | ------- | ------------------------------------------------------- |
| —         | `items`        | `UniMenuItem[]`            | —       | Component-managed list of direct menu-item children.    |
| —         | `selectedItem` | `UniMenuItem \| undefined` | —       | Read-only first item whose `selected` property is true. |

#### Methods

| Method                       | Result | Purpose                                                       |
| ---------------------------- | ------ | ------------------------------------------------------------- |
| `focus(opts?: FocusOptions)` | `void` | Focuses the selected item, or the menu when none is selected. |

#### Events

| Event        | Detail        | Propagation                       | When                             |
| ------------ | ------------- | --------------------------------- | -------------------------------- |
| `uni-select` | `UniMenuItem` | Bubbles, composed, not cancelable | A non-disabled item is selected. |

#### Slots

| Slot    | Content                                                                |
| ------- | ---------------------------------------------------------------------- |
| default | Direct `<uni-menu-item>` children, with optional headers and dividers. |

### `<uni-menu-item>`

#### Attributes and properties

| Attribute  | Property   | Type                  | Default | Purpose                                             |
| ---------- | ---------- | --------------------- | ------- | --------------------------------------------------- |
| `selected` | `selected` | `boolean`             | `false` | Marks the item as the current selection; reflected. |
| `disabled` | `disabled` | `boolean`             | `false` | Prevents pointer and programmatic activation.       |
| `href`     | `href`     | `string \| undefined` | —       | Renders the item as a link to this URL.             |
| `target`   | `target`   | `string \| undefined` | —       | Passes the browsing context to a linked item.       |
| `rel`      | `rel`      | `string \| undefined` | —       | Passes the link relationship to a linked item.      |

#### Methods

| Method       | Result | Purpose                                   |
| ------------ | ------ | ----------------------------------------- |
| `activate()` | `void` | Activates the item unless it is disabled. |

#### Slots

| Slot    | Content          |
| ------- | ---------------- |
| default | Menu-item label. |

## Examples

### Selection, disabled items, and links

Listen for `uni-select` on the menu or an ancestor such as `<uni-dropdown-menu>`. Its `detail` is the selected `<uni-menu-item>`. Selection does not change the item's `selected` property automatically; update `selected` when the application has persistent selection state.

`disabled` prevents pointer selection and `activate()`. Add `href` to render an item as a link; `target` and `rel` pass through to that link.

```html
<uni-menu>
    <uni-menu-item selected>Current workspace</uni-menu-item>
    <uni-menu-item href="/workspaces">All workspaces</uni-menu-item>
    <uni-menu-item href="https://example.com/docs" target="_blank" rel="noopener">Documentation</uni-menu-item>
</uni-menu>
```

Storybook also treats the native `click` from a menu item as observable. Prefer `uni-select` when handling menu selection because it provides the selected item consistently and drives dropdown closing.

### Headers, dividers, and icons

Place plain-text headers and `<hr>` dividers directly in `<uni-menu>` to group related actions. An item can include a `<uni-icon>` before its text.

```html
<uni-menu>
    <span>Workspace</span>
    <uni-menu-item>Rename</uni-menu-item>
    <uni-menu-item>Duplicate</uni-menu-item>

    <hr />

    <span>Preferences</span>
    <uni-menu-item>
        <uni-icon size="18" name="settings"></uni-icon>
        Settings
    </uni-menu-item>
</uni-menu>
```

### Toggle and keyboard behavior

- Clicking the toggle opens or closes the menu.
- `ArrowDown` or `ArrowUp` on the toggle opens it. With no selected item, these keys focus the first or last item respectively.
- Opening focuses the selected item when one exists; otherwise it focuses the menu.
- Within the menu, `ArrowDown` and `ArrowUp` move between items and wrap at the ends.
- `Home` and `End` move to the first and last enabled item.
- `Enter` or `Space` activates the focused item.
- `Escape` closes and returns focus to the toggle.
- `Tab` closes without forcing focus back to the toggle.

### Placement and overflow

`placement` is a preferred edge and alignment. The popup may flip or shift to stay within the viewport. Limit a long menu with ordinary CSS `height` or `max-height`; its content then scrolls.

```html
<uni-dropdown-menu placement="top-start">
    <uni-button slot="toggle" variant="secondary" caret>Recent items</uni-button>
    <uni-menu id="recent-menu">
        <uni-menu-item>Item 1</uni-menu-item>
        <uni-menu-item>Item 2</uni-menu-item>
        <uni-menu-item>Item 3</uni-menu-item>
    </uni-menu>
</uni-dropdown-menu>

<style>
    #recent-menu {
        max-height: 15rem;
    }
</style>
```
