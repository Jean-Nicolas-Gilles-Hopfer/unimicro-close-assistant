# Design tokens

The tokens below are the shared public CSS custom properties endorsed for application use. Load the base theme before using them:

```css
@import '@unimicro/design-system/styles/themes/base.css';
```

`base.css` is required. It defines the Unimicro defaults and fallback values used when an optional theme does not override every token. To use a supplied theme, also load one of `azets.css`, `dnb.css`, `eika.css`, or `sb1.css`:

```css
@import '@unimicro/design-system/styles/themes/base.css';
@import '@unimicro/design-system/styles/themes/dnb.css';
```

Loading a theme stylesheet is an application responsibility; the theme configuration value is not documented as a stylesheet loader.

## Public token inventory

### Text

`--text-default`, `--text-subdued`, `--text-interactive`, `--text-critical`, `--text-link`

### Surfaces

`--surface-default`, `--surface-subdued`, `--surface-info`, `--surface-success`, `--surface-warning`, `--surface-critical`, `--surface-selected`, `--surface-hover`, `--surface-sum-primary`, `--surface-sum-secondary`, `--surface-sum-tertiary`

### Borders

`--border-default`, `--border-disabled`, `--border-selected`, `--border-info`, `--border-success`, `--border-warning`, `--border-critical`, `--border-invalid`

### Icons

`--icon-default`, `--icon-invert`, `--icon-disabled`, `--icon-interactive`, `--icon-info`, `--icon-success`, `--icon-warning`, `--icon-critical`

### Avatars

`--avatar-light-ash`, `--avatar-dark-ash`, `--avatar-light-blue`, `--avatar-dark-blue`, `--avatar-light-emerald`, `--avatar-dark-emerald`, `--avatar-light-green`, `--avatar-dark-green`, `--avatar-light-orange`, `--avatar-dark-orange`, `--avatar-light-purple`, `--avatar-dark-purple`, `--avatar-light-red`, `--avatar-dark-red`, `--avatar-light-yellow`, `--avatar-dark-yellow`

### Categoricals

`--categorical-1`, `--categorical-2`, `--categorical-3`, `--categorical-4`, `--categorical-5`, `--categorical-6`, `--categorical-7`, `--categorical-8`

### Graph

`--graph-1`, `--graph-2`, `--graph-3`, `--graph-4`, `--graph-5`, `--graph-6`, `--graph-7`

## Cascade and customization

The base defaults are declared on `:root` inside the `base-theme` cascade layer. Supplied theme files declare their overrides on `:root` without a layer, so their normal declarations take precedence over the layered defaults. Tokens omitted by a theme continue to use the base value.

Use the tokens through CSS `var()` in application styles. To customize them, declare the chosen public token in application CSS loaded after the theme. A `:root` declaration changes the application-wide value; a declaration on an ancestor or a component host scopes the inherited custom property to that subtree. Normal CSS origin, layer, specificity, and source-order rules determine the winning declaration.

## Public versus component-internal variables

This inventory is the complete shared public-token allowlist. Other custom properties present in `base.css` are intended for specific components and should not be used as application design tokens merely because they are visible in that file. Use a component-specific custom property only when that component's reference explicitly documents it.
