# Unimicro dark theme (proposal)

Unimicro has no dark mode today, but its design system is built for one: every colour in the application is a
named token (`--text-default`, `--surface-default`, ...) declared in `base.css`, and the brand themes for DNB,
SpareBank 1, Eika and Azets work by overriding those tokens on `:root`. `unimicro-dark.css` is a fifth theme in
exactly that format: dark values for all 130 colour tokens, keeping the Unimicro blue family and the semantic
colours, with the page background darker than cards as in the light theme.

- `unimicro-dark.css` – the theme. Load after `base.css`, or wrap in `@media (prefers-color-scheme: dark)`.
- `check-contrast.mjs` – WCAG check for the text/surface pairs that matter. Run `node theme/check-contrast.mjs`.
- Preview without touching the app: open test.unimicro.no, paste the contents of `unimicro-dark.css` into a
  `<style>` element via the browser's developer tools (or a user-style extension such as Stylus). The whole
  application switches, plugin views included.

## What it does not do

The application still contains around 800 hard-coded colour literals outside the token system, so a first
release would leave a few light patches. Injecting the file on test.unimicro.no shows which: the logo (dark on
dark), the active item and icon colours in the left menu, and the demo banner. Fixing those is a matter of
replacing literals with tokens that already exist (`--icon-default`, `--surface-selected`); the theme file
needs no changes for that. Everything else, including tables, cards, tags, buttons, alerts, dialogs and every
plugin view, follows the tokens.

A plugin cannot ship this: plugin views may only style their own box. The theme belongs in the design system,
which is why it is offered here as a file in their own theme format rather than as a plugin.

## Plugin views

The Close Assistant views use only design-system tokens (no colour literals), so they follow whichever theme the
host loads, this one included.
