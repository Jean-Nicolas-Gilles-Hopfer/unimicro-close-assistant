import { defineConfig } from 'vitest/config';

/**
 * Tests run the real view, in a DOM, against a host you write.
 *
 * That is the supported way to see what a view does with data in it: the element is the one the
 * platform mounts, and the handle is the one it assigns. A second application that renders the view
 * outside the platform proves nothing about the platform — it loads its own copy of the design
 * system, mounts the element outside the shadow root the platform owns, and hands it no host at all.
 *
 * Separate from vite.config.ts, which is a contract with `unimicro plugin dev` and has one build
 * input per manifest view. Nothing here reaches the artifact.
 */
export default defineConfig({
    test: {
        environment: 'happy-dom',
        include: ['src/**/*.test.ts'],
    },
});
