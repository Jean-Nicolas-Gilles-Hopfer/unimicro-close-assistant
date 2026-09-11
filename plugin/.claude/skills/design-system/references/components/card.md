# Card

Use `<uni-card>` to group related content in a bordered surface with an optional header. The component declares no action, navigation, or selection behavior; place controls in the header or body when the card's content needs them.

## Basic use

Use `<uni-card-header>` for a structured heading. It assigns itself to the card's `header` slot, while the remaining content goes in the card's default slot.

```html
<uni-card>
    <uni-card-header>Customer details</uni-card-header>
    Contact information and account settings.
</uni-card>
```

## API

### `<uni-card>`

#### Attributes and properties

| Attribute | Property | Type                  | Default | Purpose                                                          |
| --------- | -------- | --------------------- | ------- | ---------------------------------------------------------------- |
| `header`  | `header` | `string \| undefined` | —       | Supplies a plain-text header when the `header` slot is not used. |

#### Slots

| Slot     | Content                                                             |
| -------- | ------------------------------------------------------------------- |
| default  | Card body content.                                                  |
| `header` | Card header content; use instead of `header` when markup is needed. |

### `<uni-card-header>`

#### Slots

| Slot      | Content                                        |
| --------- | ---------------------------------------------- |
| default   | Card heading content.                          |
| `actions` | Actions aligned at the end of the card header. |

## Examples

### Plain-text header

Use the `header` attribute when the heading is plain text and does not need actions or other markup.

```html
<uni-card header="Customer details">Contact information and account settings.</uni-card>
```

### Header actions

Put header buttons in the `actions` slot of `<uni-card-header>` so the component supplies their placement and spacing.

```html
<uni-card>
    <uni-card-header>
        Invoice
        <uni-button slot="actions" variant="secondary" small>Download</uni-button>
        <uni-button slot="actions" small>Send</uni-button>
    </uni-card-header>

    Invoice number 1042 is ready to send.
</uni-card>
```

### Card size and overflowing content

Cards have a default `max-width` of `626px`. Override it with ordinary CSS when a card needs another width. Setting a height or maximum height makes overflowing body content scroll within the card.

```html
<uni-card class="activity-card">
    <uni-card-header>Recent activity</uni-card-header>
    Activity entries go here.
</uni-card>

<style>
    .activity-card {
        max-width: none;
        max-height: 22rem;
    }
</style>
```
