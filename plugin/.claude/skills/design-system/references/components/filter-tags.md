# Filter tags

Use `<uni-filter-tag-group>` to coordinate a set of filter tags. Use `<uni-filter-tag>` by itself when the application manages the tag's active state directly.

## Basic use / Required composition

Place `<uni-filter-tag>` elements directly in the group's default slot. The default mode allows one active tag at a time; set `value` to the initially selected tag value.

```html
<uni-filter-tag-group value="option1">
    <uni-filter-tag value="option1">Option 1</uni-filter-tag>
    <uni-filter-tag value="option2">Option 2</uni-filter-tag>
    <uni-filter-tag value="option3">Option 3</uni-filter-tag>
</uni-filter-tag-group>
```

## API

### `<uni-filter-tag>`

#### Attributes and properties

| Attribute | Property | Type      | Default | Purpose                                        |
| --------- | -------- | --------- | ------- | ---------------------------------------------- |
| `value`   | `value`  | `any`     | —       | Value associated with the tag.                 |
| `active`  | `active` | `boolean` | `false` | Controls whether the tag is active; reflected. |

#### Events

| Event        | Detail    | Propagation                            | When                      |
| ------------ | --------- | -------------------------------------- | ------------------------- |
| `uni-toggle` | `boolean` | Bubbles, not composed, not cancelable. | The active state changes. |

#### Slots

| Slot    | Content    |
| ------- | ---------- |
| default | Tag label. |

### `<uni-filter-tag-group>`

#### Attributes and properties

| Attribute  | Property   | Type      | Default | Purpose                                                                                        |
| ---------- | ---------- | --------- | ------- | ---------------------------------------------------------------------------------------------- |
| `value`    | `value`    | `any`     | —       | Selected value: one tag value in single-selection mode or an array in multiple-selection mode. |
| `multiple` | `multiple` | `boolean` | `false` | Allows multiple tags to be active at the same time; reflected.                                 |
| `required` | `required` | `boolean` | `false` | Keeps at least one tag active; reflected.                                                      |

#### Events

| Event        | Detail               | Propagation                        | When                               |
| ------------ | -------------------- | ---------------------------------- | ---------------------------------- |
| `uni-change` | `{ value: unknown }` | Bubbles, composed, not cancelable. | The selected filter value changes. |

#### Slots

| Slot    | Content                             |
| ------- | ----------------------------------- |
| default | Direct `<uni-filter-tag>` children. |

## Examples

### Multiple selection

Add `multiple` when several filters can be active together. In this mode, initialize the property with an array when an initial selection is needed. The `uni-change` detail contains the selected values.

```html
<uni-filter-tag-group id="status-filters" multiple>
    <uni-filter-tag value="open">Open</uni-filter-tag>
    <uni-filter-tag value="pending">Pending</uni-filter-tag>
    <uni-filter-tag value="closed">Closed</uni-filter-tag>
</uni-filter-tag-group>

<script type="module">
    const filters = document.querySelector('#status-filters');
    filters.value = ['open'];

    filters.addEventListener('uni-change', (event) => {
        const selectedValues = event.detail.value;
        console.log(selectedValues);
    });
</script>
```

### Required selection

Add `required` when the group must always have an active tag. With this setting, clicking the only active tag keeps that tag selected.

```html
<uni-filter-tag-group required value="option1">
    <uni-filter-tag value="option1">Option 1</uni-filter-tag>
    <uni-filter-tag value="option2">Option 2</uni-filter-tag>
    <uni-filter-tag value="option3">Option 3</uni-filter-tag>
</uni-filter-tag-group>
```

### Standalone tag state and event

Outside a group, clicking a tag toggles its `active` state and emits `uni-toggle`. Use the event detail when application state needs to follow that toggle.

```html
<uni-filter-tag id="archived-filter" value="archived">Archived</uni-filter-tag>

<script type="module">
    const tag = document.querySelector('#archived-filter');

    tag.addEventListener('uni-toggle', (event) => {
        const isActive = event.detail;
        console.log(isActive);
    });
</script>
```

Boolean attributes are enabled by their presence. To change a boolean state from JavaScript, assign the property instead of using a string such as `active="false"` or `required="false"`.
