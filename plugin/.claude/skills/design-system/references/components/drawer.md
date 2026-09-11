# Drawer

Use the drawer for modal, full-height side content that slides in from the edge of the viewport and temporarily blocks interaction with the page behind it. Use a popover instead for contextual content anchored to a trigger.

## Basic use / Required composition

Set a non-empty `header` for the drawer's accessible name, place body content in the default slot, and wrap actions in `<uni-drawer-footer>`. Set the `open` property to show the drawer.

```html
<uni-button id="open-settings" variant="secondary">Open settings</uni-button>

<uni-drawer id="settings-drawer" header="Settings">
    <p>Update your account settings.</p>

    <uni-drawer-footer>
        <uni-button id="cancel-settings" variant="secondary">Cancel</uni-button>
        <uni-button>Save</uni-button>
    </uni-drawer-footer>
</uni-drawer>

<script type="module">
    const drawer = document.querySelector('#settings-drawer');

    document.querySelector('#open-settings').addEventListener('click', () => {
        drawer.open = true;
    });

    document.querySelector('#cancel-settings').addEventListener('click', () => {
        drawer.open = false;
    });
</script>
```

## API

### `<uni-drawer>`

#### Attributes and properties

| Attribute       | Property       | Type                  | Default   | Purpose                                                                                                                   |
| --------------- | -------------- | --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| `open`          | `open`         | `boolean`             | `false`   | Controls whether the drawer is visible; reflected.                                                                        |
| `position`      | `position`     | `'left' \| 'right'`   | `'right'` | Controls which side of the viewport the drawer slides in from.                                                            |
| `header`        | `header`       | `string`              | -         | Accessible name for the drawer. Required even when `header-hidden` is set.                                                |
| `header-hidden` | `headerHidden` | `boolean`             | `false`   | Hides the visual header and its close button while retaining the required `header` value as the drawer's accessible name. |
| `width`         | `width`        | `string \| undefined` | -         | CSS width value for the panel. When omitted, the panel uses a `38rem` width; it cannot exceed the viewport width.         |

#### Events

| Event       | Detail                                                      | Propagation                    | When                                                                                                                               |
| ----------- | ----------------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `uni-close` | `{ source: 'escape' \| 'click-outside' \| 'close-button' }` | Bubbles, composed, cancelable. | Before the drawer closes itself through Escape, a backdrop click, or its close button. Call `preventDefault()` to stop that close. |

#### Slots

| Slot     | Content                                                         |
| -------- | --------------------------------------------------------------- |
| default  | Drawer body content.                                            |
| `footer` | Drawer actions, usually supplied through `<uni-drawer-footer>`. |

### `<uni-drawer-footer>`

#### Slots

| Slot    | Content                 |
| ------- | ----------------------- |
| default | Drawer action controls. |

## Examples

### Position and sizing

Drawers slide in from the right by default. Set `position="left"` to open from the left, and set `width` to a CSS width value when the default panel width is not suitable. The drawer remains full viewport height and its content can scroll vertically.

```html
<uni-drawer header="More filters" position="left" width="50rem">
    <p>Filter options appear in this side panel.</p>
</uni-drawer>
```

### Hiding the header

Set `header-hidden` when the visual header is not needed, but continue to provide `header` for accessibility. Hiding the header also hides the built-in close button, so provide another control that sets `open` to `false`.

```html
<uni-drawer id="compact-drawer" header="Compact drawer" header-hidden>
    Drawer content without a visible header.

    <uni-drawer-footer>
        <uni-button id="close-compact-drawer" variant="secondary">Close</uni-button>
    </uni-drawer-footer>
</uni-drawer>

<script type="module">
    const drawer = document.querySelector('#compact-drawer');

    document.querySelector('#close-compact-drawer').addEventListener('click', () => {
        drawer.open = false;
    });
</script>
```

### Preventing accidental closing

The drawer emits `uni-close` only when it initiates closing through Escape, a backdrop click, or its close button. Inspect `event.detail.source` when needed, call `preventDefault()` to keep it open, and set `open` to `false` after application logic allows the close.

```html
<uni-drawer id="edit-drawer" header="Edit details">Unsaved changes</uni-drawer>

<script type="module">
    const drawer = document.querySelector('#edit-drawer');

    drawer.addEventListener('uni-close', (event) => {
        if (event.detail.source === 'close-button') {
            return;
        }

        event.preventDefault();
        if (confirm('Discard unsaved changes?')) {
            // Run any application-specific save or confirmation flow here.
            drawer.open = false;
        }
    });
</script>
```

### Focus and full-width sections

Opening the drawer moves focus to the first focusable child, or to the panel when there is no focusable child. Add `data-autofocus` to a focusable element to choose the initial focus. Focus is restored when the drawer closes. Add the `full-width` class to a slotted element when it should span the drawer body instead of using its default horizontal padding.

```html
<uni-drawer header="Edit profile">
    <label>
        Display name
        <input data-autofocus type="text" />
    </label>

    <p class="full-width">This notice spans the drawer body.</p>
</uni-drawer>
```

Slotted content is rendered even while the drawer is hidden. If expensive content must be created only when the drawer is shown, defer that rendering in the surrounding application.
