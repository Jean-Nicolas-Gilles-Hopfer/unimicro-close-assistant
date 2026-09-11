# Getting started

`@unimicro/design-system` provides custom elements, utilities, and assets. Its custom elements can be used with plain HTML or frameworks that support custom elements.

> Note that if you are developing a ui plugin for the Unimicro application then the components, styles and assets will already be loaded, and you can skip this setup.

## Install

```bash
npm install @unimicro/design-system
```

## Load components and styles

Load the component code once near the application entry point. `base.css` is required because it defines CSS variables and fallback values, including for applications that add a white-label theme. `styles.css` is recommended and provides typography, color, and other utility styles.

```ts
import '@unimicro/design-system/components';

import '@unimicro/design-system/styles/themes/base.css';
import '@unimicro/design-system/styles/styles.css';
```

This example assumes the build setup supports CSS imports from TypeScript. Use the project's supported stylesheet-loading mechanism otherwise. For server-rendered applications, follow [Framework integration](framework-integration.md) before importing component code.

## Configure static assets when needed

Components such as `<uni-illustration>` need the package's static assets. Copy the contents of `node_modules/@unimicro/design-system/dist/assets/` into the application's build output, then configure the public URL for that directory:

```ts
import { updateConfig } from '@unimicro/design-system/config';

updateConfig({ assetsPath: '/design-system-assets/' });
```

The copy mechanism depends on the application's build tooling. Set `assetsPath` to the public URL where the assets were copied.

## A note on server-side rendering frameworks

The component entry point calls `customElements.define()` and should not be called on the server. Load component code dynamically behind the framework's browser/client guard while keeping stylesheet imports outside that guard when the framework supports doing so.

The documented SvelteKit pattern is:

```ts
// src/lib/design-system.ts
import '@unimicro/design-system/styles/styles.css';
import '@unimicro/design-system/styles/themes/base.css';

import { browser } from '$app/environment';

if (browser) {
    import('@unimicro/design-system/components');
}
```

Import that guarded module from the root layout. Other SSR frameworks require their own documented client-only loading mechanism; do not copy the SvelteKit `browser` API into another framework.
