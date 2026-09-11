---
name: unimicro-design-system
description: Use when installing or configuring @unimicro/design-system, or when building, reviewing, or troubleshooting interfaces with the Unimicro Design System. Covers component APIs and examples, as well as public design tokens, and setup instructions.
---

# Unimicro Design System

Use these references when consuming `@unimicro/design-system`. Load only the references relevant to the current task.

Component references omit empty API categories. When a category (e.g "Methods" or "Events") is absent for an element, the generated public API declares no component-specific entries in that category; standard DOM APIs still apply.
Do not invent attributes, properties, events, slots, methods, CSS parts, custom properties, tokens, or behavior that the references do not document.
Do not treat private shadow-DOM selectors or implementation-only CSS variables as supported styling hooks.

All component examples assume only html and js. If you are using a frontend framework you likely have a more elegant solution for setting properties, listening to events etc.

## Setup and integration

> Note that if you are developing a ui plugin for the Unimicro application then the components, styles and assets will already be loaded, and you can skip the setup.

- [Getting started](references/getting-started.md) - Install the package, load the component library and required styles, and configure static assets.
- [Framework integration](references/framework-integration.md) - Register the custom elements, add framework types, and avoid browser-only imports during server-side rendering.

## Foundations

- [Design tokens](references/design-tokens.md) - Use the public CSS custom properties and load or override the supplied themes.

## Components

### Actions

- [`<uni-button>`](references/components/button.md) - Trigger an action, submit a form, or navigate to another page. Setting `href` renders the component as a link.
- [`<uni-icon-button>`](references/components/icon-button.md) - Trigger a compact icon-only action with an accessible label, optionally as a link, with variants, loading, and tooltip support.
- [`<uni-split-button>`](references/components/split-button.md) - Pair a prominent main action with a menu of related alternatives, from slotted markup or an actions list.
- [`<uni-clickable>`](references/components/clickable.md) - Make non-button-styled content trigger an action with accessible button behavior.
- [`<uni-dropdown-menu>`, `<uni-menu>`, and `<uni-menu-item>`](references/components/dropdown-menu.md) - Build a button-triggered menu of actions or links with selection and keyboard navigation.

### Content

- [`<uni-icon>`](references/components/icon.md) - Render a named design-system icon with optional semantic labeling, color, and size.
- [`<uni-illustration>`](references/components/illustration.md) - Render a named design-system illustration with configurable size and themed assets.
- [`<uni-popover>` and `<uni-popover-panel>`](references/components/popover.md) - Display arbitrary interactive content in an overlay toggled by a button, with optional hover mode and panel styling.
- [`<uni-drawer>` and `<uni-drawer-footer>`](references/components/drawer.md) - Display modal, full-height side content with body and action slots, configurable position and width, and cancelable close behavior.
- [`<uni-tag>`](references/components/tag.md) - Render a compact status or category label with variants, optional icons, compact sizing, and dismissal.
- [`<uni-tooltip>`](references/components/tooltip.md) - Show short plain-text information on anchor hover or focus, with configurable placement and delay.

### Feedback

- [`<uni-alert>`](references/components/alert.md) - Show important contextual information, success, warnings, or errors inline with surrounding content.

### Data display

- [`<uni-table>`, `<uni-table-row>`, and `<uni-table-cell>`](references/components/table.md) - Present structured tabular data with column configuration and optional consumer-managed row activation and selection.

### Layout

- [`<uni-card>` and `<uni-card-header>`](references/components/card.md) - Group related content in a bordered surface with an optional plain-text or structured header.
- [`<uni-details>`](references/components/details.md) - Show a brief header that expands to reveal additional content.
- [`<uni-expansion-panel>`, `<uni-expansion-panel-header>`, and `<uni-accordion>`](references/components/expansion-panel.md) - Reveal content in collapsible panels, compose custom headers, and coordinate grouped panels.
- [`<uni-page-header>`](references/components/page-header.md) - Present a page heading with optional breadcrumb ancestors and actions.
- [`<uni-stepper>`, `<uni-step>`, and `<uni-sub-step>`](references/components/stepper.md) - Show presentational progress through steps and optional substeps, with vertical, horizontal, and application-controlled interactive variants.
- [`<uni-wizard>`, `<uni-wizard-step>`, and `<uni-wizard-footer>`](references/components/wizard.md) - Build multi-step workflows with linear or tabbed navigation and shared or step-specific action footers.

### Navigation

- [`<uni-breadcrumbs>` and `<uni-breadcrumb-item>`](references/components/breadcrumbs.md) - Show a labelled page hierarchy with linked ancestors and a non-link current page.

### Forms

- [`<uni-checkbox>`, `<uni-checkbox-card>`, and `<uni-checkbox-group>`](references/components/checkbox.md) - Build independent checkbox choices, card-styled choices, and labelled groups of related controls.
- [`<uni-combobox>`](references/components/combobox.md) - Choose one constrained value from a local option list with editable filtering, object mapping, and native form participation.
- [`<uni-filter-tag-group>` and `<uni-filter-tag>`](references/components/filter-tags.md) - Coordinate one or more active filter tags in single- or multiple-selection mode.
- [`<uni-input>`](references/components/input.md) - Collect labelled single-line text with native form participation, validation, and responsive named input and field widths.
- [`<uni-radio-group>`, `<uni-radio-button>`, and `<uni-radio-card>`](references/components/radio.md) - Build single-selection groups with compact radio controls or card-styled options.
- [`<uni-switch>`](references/components/switch.md) - Toggle a boolean setting with a compact or large switch control.
- [`<uni-textarea>`](references/components/textarea.md) - Collect labelled multi-line text with native form participation, validation, and resizing behavior.
