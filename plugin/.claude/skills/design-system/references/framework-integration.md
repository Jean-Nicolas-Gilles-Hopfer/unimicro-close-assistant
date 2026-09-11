# Framework integration

The library components are custom elements. Use their native element names and APIs rather than assuming framework-specific wrapper components.

## Generated framework types

The package generates declarations from its custom-elements manifest and exports them under `@unimicro/design-system/types/*`:

- `@unimicro/design-system/types/jsx` exports `CustomElements` and `ScopedElements` JSX mappings.
- `@unimicro/design-system/types/vue` augments Vue `GlobalComponents` and the global JSX intrinsic elements.

Include the applicable declaration in the consumer project's type configuration using that project's TypeScript/framework tooling. These declarations provide editor and type-checker support; they do not register components at runtime.
