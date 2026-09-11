# Expansion panel

Use `<uni-expansion-panel>` for collapsible content with a distinct header and optional header actions. Use `<uni-details>` instead for a compact disclosure with a brief text header.

## Basic use

Set `header` for a plain-text heading and place the content revealed by the panel in the default slot. Panels are closed by default; add `open` when the initial state should be expanded.

```html
<uni-expansion-panel header="Account information" open> Contact information and account settings. </uni-expansion-panel>
```

## API

### `<uni-expansion-panel>`

#### Attributes and properties

| Attribute     | Property     | Type      | Default  | Purpose                                                                            |
| ------------- | ------------ | --------- | -------- | ---------------------------------------------------------------------------------- |
| `header`      | `header`     | `string`  | `''`     | Supplies a plain-text header; use the `header` slot when markup is needed.         |
| `open-label`  | `openLabel`  | `string`  | `'Åpne'` | Text shown in the header while the panel is closed; uses configured text when set. |
| `close-label` | `closeLabel` | `string`  | `'Lukk'` | Text shown in the header while the panel is open; uses configured text when set.   |
| `open`        | `open`       | `boolean` | `false`  | Controls whether the panel is expanded; reflected.                                 |
| `max-height`  | `maxHeight`  | `string`  | `''`     | Sets the maximum height of the panel content area.                                 |

#### Events

| Event       | Detail | Propagation                        | When                 |
| ----------- | ------ | ---------------------------------- | -------------------- |
| `uni-open`  | `{}`   | Bubbles, composed, not cancelable. | The panel is opened. |
| `uni-close` | `{}`   | Bubbles, composed, not cancelable. | The panel is closed. |

#### Slots

| Slot     | Content                                                              |
| -------- | -------------------------------------------------------------------- |
| default  | Collapsible panel content.                                           |
| `header` | Panel header content; use instead of `header` when markup is needed. |

### `<uni-expansion-panel-header>`

#### Slots

| Slot      | Content                                                 |
| --------- | ------------------------------------------------------- |
| default   | Expansion-panel heading content.                        |
| `actions` | Controls that should not toggle the panel when clicked. |

### `<uni-accordion>`

#### Attributes and properties

| Attribute  | Property   | Type      | Default | Purpose                                                                 |
| ---------- | ---------- | --------- | ------- | ----------------------------------------------------------------------- |
| `multiple` | `multiple` | `boolean` | `false` | Allows multiple child expansion panels to remain open at the same time. |

#### Slots

| Slot    | Content                           |
| ------- | --------------------------------- |
| default | `<uni-expansion-panel>` children. |

## Examples

### Custom header content and actions

Use `<uni-expansion-panel-header>` when the heading needs markup. Put controls in its `actions` slot so their clicks do not toggle the panel.

```html
<uni-expansion-panel>
    <uni-expansion-panel-header>
        Customer details
        <div slot="actions">
            <uni-button variant="tertiary" small type="button">Edit</uni-button>
        </div>
    </uni-expansion-panel-header>

    Contact information and account settings.
</uni-expansion-panel>
```

### Labels, state, and events

Set `open-label` and `close-label` to customize the text displayed beside the panel indicator. The `open` property is boolean: use the JavaScript property when changing the state programmatically; do not use `open="false"`, because a boolean attribute's presence means true.

```html
<uni-expansion-panel id="preferences" header="Preferences" open-label="Show more" close-label="Show less">
    Notification and privacy settings.
</uni-expansion-panel>

<script type="module">
    const panel = document.querySelector('#preferences');

    panel.addEventListener('uni-open', () => {
        // Refresh or reveal related application state.
    });

    panel.open = true;
</script>
```

### Grouping panels in an accordion

Place panels in `<uni-accordion>` to coordinate their open state. By default, opening one panel closes the other panels in the group. Add `multiple` when several panels may stay open.

```html
<uni-accordion multiple>
    <uni-expansion-panel header="Panel 1">Panel 1 content.</uni-expansion-panel>
    <uni-expansion-panel header="Panel 2">Panel 2 content.</uni-expansion-panel>
    <uni-expansion-panel header="Panel 3">Panel 3 content.</uni-expansion-panel>
</uni-accordion>
```

### Panel size and content height

Panels have a default width of `626px` and a `max-width` of `100%`; override those values with ordinary CSS. Use `max-height` to limit the content area when it should scroll.

```html
<uni-expansion-panel header="Activity" style="width: 100%" max-height="250px">
    A long list of activity entries.
</uni-expansion-panel>
```
