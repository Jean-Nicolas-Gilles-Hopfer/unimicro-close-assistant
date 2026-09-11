# Table

Use `<uni-table>` to present structured data in rows and columns. Compose it from direct `<uni-table-row>` children containing `<uni-table-cell>` elements. Add one `header` row to define column headings and shared column width and alignment.

Add `selectable` when activating a body row should show details or navigate. This enables mouse and keyboard activation but does not store a selected row. If the interface needs a persistent single selection, the application must move the `selected` state between rows.

## Basic use / Required composition

Set `label` to give the table an accessible name. Mark the column-heading row with `header`.

```html
<uni-table label="Invoices">
    <uni-table-row header>
        <uni-table-cell>Invoice</uni-table-cell>
        <uni-table-cell>Description</uni-table-cell>
        <uni-table-cell alignment="right">Amount</uni-table-cell>
    </uni-table-row>
    <uni-table-row>
        <uni-table-cell>1001</uni-table-cell>
        <uni-table-cell>Consulting services</uni-table-cell>
        <uni-table-cell>1250</uni-table-cell>
    </uni-table-row>
</uni-table>
```

## API

### `<uni-table>`

#### Attributes and properties

| Attribute    | Property     | Type                                      | Default     | Purpose                                                                                                                                                                                             |
| ------------ | ------------ | ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`       | `size`       | `'small' \| 'default' \| 'large' \| 'xl'` | `'default'` | Sets row height to 32, 40, 48, or 56px, respectively.                                                                                                                                               |
| `label`      | `label`      | `string`                                  | `''`        | Supplies the accessible name for the table.                                                                                                                                                         |
| `selectable` | `selectable` | `boolean`                                 | `false`     | Makes non-header rows focusable, navigable with Arrow Up/Down, and activatable by mouse, Enter, or Space; reflected. The table sets body-row `tabindex` to `0` when enabled and `-1` when disabled. |

#### Slots

| Slot    | Content                            |
| ------- | ---------------------------------- |
| default | Direct `<uni-table-row>` children. |

### `<uni-table-row>`

#### Attributes and properties

| Attribute  | Property   | Type      | Default | Purpose                                                                                      |
| ---------- | ---------- | --------- | ------- | -------------------------------------------------------------------------------------------- |
| `header`   | `header`   | `boolean` | `false` | Marks the row as the column-header row and marks its cells as column headers; reflected.     |
| `selected` | `selected` | `boolean` | `false` | Applies selected presentation and semantics. The application controls this state; reflected. |

#### Events

| Event            | Detail        | Propagation                        | When                                                          |
| ---------------- | ------------- | ---------------------------------- | ------------------------------------------------------------- |
| `uni-row-select` | `UniTableRow` | Bubbles, composed, not cancelable. | A selectable body row is activated by mouse, Enter, or Space. |

#### Slots

| Slot    | Content                                  |
| ------- | ---------------------------------------- |
| default | One or more `<uni-table-cell>` elements. |

### `<uni-table-cell>`

#### Attributes and properties

| Attribute   | Property    | Type                                         | Default     | Purpose                                                                                             |
| ----------- | ----------- | -------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------- |
| `alignment` | `alignment` | `'left' \| 'center' \| 'right' \| undefined` | `undefined` | Sets horizontal alignment. On a header cell, applies to every cell in that column; left by default. |
| `width`     | `width`     | `string \| undefined`                        | `undefined` | Sets a CSS width. On a header cell, applies to every cell in that column.                           |

#### Slots

| Slot    | Content       |
| ------- | ------------- |
| default | Cell content. |

## Examples

### Activate rows and manage one selected row

Each activated body `<uni-table-row>` emits `uni-row-select` and provides itself as `event.detail`. The event bubbles to `<uni-table>`, so listen on individual rows for row-specific handling or on the table to handle all its body rows. With `selectable`, clicking a body row emits the event, rows are separate Tab stops, Arrow Up and Arrow Down move focus between body rows and wrap at either end, and Enter or Space activates the focused row. Clicking or using an interactive control inside a cell keeps that interaction with the control and does not emit `uni-row-select`.

The table owns body-row `tabindex`, setting it to `0` while `selectable` is enabled and `-1` when disabled.

The table never changes `selected` or clears sibling rows. Move the state explicitly when the interface needs one persistent selected row. A navigation-only handler can omit that state management.

```html
<uni-table id="invoices" label="Invoices" selectable>
    <uni-table-row header>
        <uni-table-cell>Invoice</uni-table-cell>
        <uni-table-cell>Description</uni-table-cell>
    </uni-table-row>
    <uni-table-row>
        <uni-table-cell>1001</uni-table-cell>
        <uni-table-cell>Consulting services</uni-table-cell>
    </uni-table-row>
    <uni-table-row>
        <uni-table-cell>1002</uni-table-cell>
        <uni-table-cell>Software subscription</uni-table-cell>
    </uni-table-row>
</uni-table>

<script type="module">
    const table = document.querySelector('#invoices');

    table.addEventListener('uni-row-select', (event) => {
        table.querySelectorAll(':scope > uni-table-row[selected]').forEach((row) => {
            row.selected = false;
        });
        event.detail.selected = true;

        const invoice = event.detail.querySelector('uni-table-cell').textContent.trim();
        openInvoiceDetails(invoice);
    });
</script>
```

### Configure columns from the header row

Set `alignment` and `width` on header cells. The table propagates those values to current and later body cells in the same column. Use `width="0"` for an action-only column that should be only as wide as its content.

```html
<uni-table label="Invoices">
    <uni-table-row header>
        <uni-table-cell>Invoice</uni-table-cell>
        <uni-table-cell width="8rem">Status</uni-table-cell>
        <uni-table-cell alignment="right" width="8rem">Amount</uni-table-cell>
        <uni-table-cell width="0" aria-label="Actions"></uni-table-cell>
    </uni-table-row>
    <uni-table-row>
        <uni-table-cell>1001</uni-table-cell>
        <uni-table-cell>Paid</uni-table-cell>
        <uni-table-cell>1250</uni-table-cell>
        <uni-table-cell>
            <uni-icon-button label="Actions for invoice 1001" small>
                <uni-icon name="more"></uni-icon>
            </uni-icon-button>
        </uni-table-cell>
    </uni-table-row>
</uni-table>
```
