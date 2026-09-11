# Tag

Use `<uni-tag>` for a compact status or category label. Use filter tags when users need to select or toggle filters; a tag is not a selection control.

## Basic use / Required composition

Use the default slot for the tag label. Set `type` when the label represents an informational, successful, warning, or critical state.

```html
<uni-tag type="success">Paid</uni-tag>
```

## API

### Attributes and properties

| Attribute   | Property   | Type                                                          | Default     | Purpose                                                                                                 |
| ----------- | ---------- | ------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------- |
| `type`      | `type`     | `'default' \| 'info' \| 'success' \| 'warning' \| 'critical'` | `'default'` | Selects the tag type and changes its background and border color; with `icon`, selects the preset icon. |
| `small`     | `small`    | `boolean`                                                     | `false`     | Enables the compact tag size.                                                                           |
| `closable`  | `closable` | `boolean`                                                     | `false`     | Adds a close control that hides the tag.                                                                |
| `visible`   | `visible`  | `boolean`                                                     | `true`      | Controls whether the tag is rendered; reflected to the attribute.                                       |
| `icon`      | `icon`     | `boolean \| undefined`                                        | `undefined` | Shows the preset icon for the selected tag type when one exists.                                        |
| `icon-name` | `iconName` | `IconName \| undefined`                                       | `undefined` | Shows the named icon instead of a preset icon.                                                          |

The `icon-name` property accepts the supported `IconName` values listed in the [`<uni-icon>` reference](icon.md).

### Methods

| Method   | Result          | Purpose                                                                 |
| -------- | --------------- | ----------------------------------------------------------------------- |
| `hide()` | `Promise<void>` | Animates out the tag, emits `uni-hide`, then sets `visible` to `false`. |

### Events

| Event      | Detail | Propagation                          | When                              |
| ---------- | ------ | ------------------------------------ | --------------------------------- |
| `uni-hide` | `void` | Does not bubble, compose, or cancel. | `hide()` finishes hiding the tag. |

Listen for `uni-hide` on the tag itself.

### Slots

| Slot    | Content    |
| ------- | ---------- |
| default | Tag label. |

## Examples

### Types and sizes

Use `type` to communicate the tag category or status. Add `small` for the compact presentation.

```html
<uni-tag>Default</uni-tag>
<uni-tag type="info">Information</uni-tag>
<uni-tag type="success">Completed</uni-tag>
<uni-tag type="warning">Needs attention</uni-tag>
<uni-tag type="critical">Failed</uni-tag>

<uni-tag small type="success">Compact status</uni-tag>
```

### Preset and named icons

Set the boolean `icon` attribute to use the preset icon for a tag type. The `default` type has no preset icon. Set `icon-name` when a specific supported icon is needed; it takes precedence over `icon`.

```html
<uni-tag icon type="info">Information</uni-tag>
<uni-tag icon type="success">Completed</uni-tag>
<uni-tag icon-name="mail">Contact</uni-tag>
```

### Dismissal and visibility

Add `closable` to provide a built-in close control. Closing calls `hide()`, emits `uni-hide`, and sets `visible` to `false`. Set the JavaScript `visible` property to show the tag again or to hide it without emitting `uni-hide`.

```html
<uni-tag id="status-tag" closable type="success">Saved</uni-tag>

<script type="module">
    const tag = document.querySelector('#status-tag');

    tag.addEventListener('uni-hide', () => {
        console.log('The status tag was dismissed.');
        setTimeout(() => {
            tag.visible = true;
        }, 1000);
    });
</script>
```

Boolean attributes are enabled by their presence. To change a boolean state from JavaScript, assign the property instead of using a string such as `visible="false"` or `closable="false"`.
