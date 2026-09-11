# Illustration

Use `<uni-illustration>` to render a named design-system illustration. The component loads SVG assets from the configured assets directory; configure that directory before using illustrations in an application.

## Basic use / Required composition

Set `name` to a supported illustration name.

```html
<uni-illustration name="all_done"></uni-illustration>
```

## API

### Attributes and properties

| Attribute | Property | Type                            | Default        | Purpose                                                                |
| --------- | -------- | ------------------------------- | -------------- | ---------------------------------------------------------------------- |
| `name`    | `name`   | `IllustrationName`              | —              | Selects the illustration to render.                                    |
| `size`    | `size`   | `string \| number \| undefined` | `undefined`    | Sets the illustration width. Numeric values are interpreted as pixels. |
| `theme`   | `theme`  | `Theme \| undefined`            | `config.theme` | Overrides the page's active theme for this illustration.               |

The `name` property accepts these values:

```text
'person' | 'clock' | 'attachment' | 'start' | 'invoice' | 'lightbulb' |
'success' | 'warning' | 'all_done' | 'attention' | 'building' | 'checkmark' |
'completed' | 'confetti' | 'contract' | 'documentation' | 'due_date' | 'email' |
'empty_box' | 'empty_state' | 'error' | 'finish_line' | 'hours' | 'landbruk' |
'laptop' | 'mobile_otp' | 'payment_period' | 'pending' | 'people' | 'quantity' |
'recover' | 'reports' | 'security' | 'selection' | 'thumb_up' | 'thumbs_up' |
'todo' | 'wait' | 'welcome'
```

The `theme` property accepts `'unimicro' | 'dnb' | 'sb1' | 'eika' | 'azets'`. When it is omitted, the component uses the active global `config.theme` value, whose default is `'unimicro'`. All supported illustrations are available for each supported theme.

The component has a default width of `200px` and preserves a square aspect ratio. It supplies image alternative text in the form `Illustration: {name}`.

## Examples

### Configure illustration assets

Copy the package assets to the application's public output and set `assetsPath` to that public URL. See [Getting started](../getting-started.md) for the complete setup.

```js
import '@unimicro/design-system/components';
import { updateConfig } from '@unimicro/design-system/config';

updateConfig({ assetsPath: '/design-system-assets/' });
```

### Set the illustration size

Set `size` with a CSS length such as `100px`, use a numeric property value for pixels, or set the host width with CSS. The height follows the square aspect ratio.

```html
<uni-illustration name="all_done" size="100px"></uni-illustration>

<uni-illustration id="responsive-illustration" name="all_done"></uni-illustration>

<style>
    #responsive-illustration {
        width: 100px;
    }
</style>
```

```html
<uni-illustration id="numeric-size" name="all_done"></uni-illustration>

<script type="module">
    document.querySelector('#numeric-size').size = 100;
</script>
```

### Override the active theme

Use `theme` only when an illustration must use a different theme from the rest of the page. Omit it in the usual case so the illustration follows the page's active theme.

```html
<uni-illustration name="success" theme="dnb"></uni-illustration>
```
