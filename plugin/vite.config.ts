import { readdirSync, type Dirent } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

/**
 * Two things here are contracts with `unimicro plugin dev`, not preferences.
 *
 * `base` comes from UNIMICRO_ASSET_BASE. In proxy mode the platform loads this dev server's files through
 * the tunnel, under a path prefix it owns. Vite emits absolute URLs for anything it did not inline —
 * code-split chunks, `/@vite/client` — and those resolve against the platform's origin unless the
 * base says otherwise, at which point they leave the tunnel and 404.
 *
 * A build gets no prefix, because one artifact is served under a version path, the dev path and a
 * tunnel prefix. It defaults to relative, so assets resolve against the module the platform imported.
 *
 * UNIMICRO_DEV_ORIGIN is where the browser can reach this dev server without going through the tunnel, and
 * it is what makes HMR work. The HMR client is served through the tunnel, so by default it dials the
 * platform's origin, which has no socket for it. Pointed at this origin instead it connects straight
 * to the machine — a browser permits a `ws://localhost` socket even from an https page, because
 * loopback counts as a secure context.
 */
const devOrigin = process.env.UNIMICRO_DEV_ORIGIN ? new URL(process.env.UNIMICRO_DEV_ORIGIN) : null;

export default defineConfig({
    // This project, wherever it is asked from. Vite resolves root — and outDir, and every input
    // below — against the working directory by default, so `vite --config <path>` run from anywhere
    // but the plugin root reads the wrong sources or writes dist into the wrong tree. In the
    // sanctioned path, where `unimicro plugin build` runs npm here, this is the value it already had.
    root: import.meta.dirname,

    plugins: [warnOnUnlinkedCss()],

    base: process.env.UNIMICRO_ASSET_BASE ?? './',

    server: {
        // The port is this plugin's own, chosen when it was created, so two plugins on one machine do
        // not fight over a shared default. UNIMICRO_DEV_PORT overrides it: `unimicro plugin dev` moves the dev server
        // when the configured port turns out to belong to something else, and this is how it says so.
        port: Number(process.env.UNIMICRO_DEV_PORT ?? 6076),
        // Fail on a taken port rather than move to the next one. Moving is the CLI's to do, and it is
        // the only party that can: the port above is also what unimicro.config.json advertises, and
        // what the tunnel is pointed at. Vite's default is to increment silently, which leaves the
        // dev server running somewhere nobody is looking — the tunnel reaches a closed port and the
        // view fails to load, with a healthy-looking dev server in the terminal saying otherwise.
        strictPort: true,
        // The platform imports these files from another origin, which a browser only allows when the
        // response says so.
        cors: true,

        // Only loopback is reachable this way. Someone who opens the dev link on a different machine
        // gets no hot updates and a retrying socket in their console; the view still loads, and the
        // platform still reloads it when `unimicro plugin dev` signals a finished build.
        hmr: devOrigin
            ? {
                  protocol: devOrigin.protocol === 'https:' ? 'wss' : 'ws',
                  host: devOrigin.hostname,
                  clientPort: Number(devOrigin.port || (devOrigin.protocol === 'https:' ? 443 : 80)),
              }
            : true,
    },

    build: {
        target: 'es2022',
        outDir: 'dist',
        emptyOutDir: true,

        // Written, but not pointed at. A published artifact excludes **/*.map — see
        // unimicro.config.json — so `true` would put a `//# sourceMappingURL=index.js.map` comment in
        // every shipped file, naming a file that is not in the artifact: devtools then requests it on
        // every load of the view and gets the platform's 404 page. 'hidden' emits the same map and
        // leaves the comment out, so the map is on disk for whoever wants to attach it by hand and
        // nothing in the published output refers to it.
        sourcemap: 'hidden',

        rollupOptions: {
            /**
             * Keep the entry's exports.
             *
             * Vite builds an application by default, where an entry is a script the browser runs for
             * its side effects and nothing imports it — so Rollup is told the entry's signature does
             * not matter and its exports are dropped. A plugin view is the opposite: the platform
             * imports it and its default export is the entire contract. Without this the build
             * succeeds, the file loads, and the module has no exports at all — which surfaces only as
             * "must default-export a custom element" at mount time.
             */
            preserveEntrySignatures: 'strict',

            /**
             * One input per view, named for the path it should land on.
             *
             * The manifest names each view's entry file, and it cannot name a hash — so entry files
             * get stable paths and only shared chunks are content-hashed.
             *
             * Read off the directory rather than listed by hand. `unimicro plugin add view` writes
             * src/views/<id>/index.ts and leaves this file alone, so a list maintained here goes
             * out of step the first time a view is added: the manifest then names an entry the
             * build never emitted, and the view is missing with nothing to say why.
             */
            input: viewEntries(),

            output: {
                format: 'es',
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
});

/**
 * Every view in the project, as Rollup inputs: src/views/<id>/index.ts becomes
 * views/<id>/index.js, which is the path a manifest entry names.
 *
 * Resolved from this file, not from the working directory. `vite --config` may be run from anywhere
 * — a monorepo task runner, an editor, a script one directory up — and a relative 'src/views' read
 * against whatever the cwd happened to be gives a bare ENOENT naming a path that does not exist,
 * with nothing to say which of the two directories was the wrong one.
 *
 * Sorted, so the same source always produces the same config.
 */
function viewEntries(): Record<string, string> {
    const viewsDir = join(import.meta.dirname, 'src', 'views');

    let contents: Dirent[];
    try {
        contents = readdirSync(viewsDir, { withFileTypes: true });
    } catch (cause) {
        throw new Error(
            `Cannot read the views directory ${viewsDir}. Every view lives in src/views/<id>/index.ts, ` +
                'and `unimicro plugin add view` puts it there.',
            { cause },
        );
    }

    const views = contents
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    // A build with no inputs is not an empty build: Rollup falls back to its own default entry and
    // fails somewhere further in, about a file this project has never had.
    if (views.length === 0) {
        throw new Error(
            `No views to build: ${viewsDir} has no subdirectories. A view is src/views/<id>/index.ts, ` +
                'and `unimicro plugin add view` creates one.',
        );
    }

    return Object.fromEntries(
        views.map((view) => [`views/${view}/index`, join(viewsDir, view, 'index.ts')]),
    );
}

/**
 * Warns during the build about a stylesheet nothing will load. Vite emits a view's CSS as its own
 * file and leaves the linking to an HTML page, which a plugin view does not have.
 */
function warnOnUnlinkedCss(): Plugin {
    return {
        name: 'unimicro:warn-on-unlinked-css',
        generateBundle(_options, bundle) {
            for (const chunk of Object.values(bundle)) {
                if (chunk.type !== 'chunk' || !chunk.isEntry || !chunk.viteMetadata?.importedCss?.size) {
                    continue;
                }

                // A CSS module is imported for its class names, so `?inline` is the wrong advice.
                const plain = chunk.moduleIds.filter(
                    (id) => id.endsWith('.css') && !id.endsWith('.module.css'),
                );
                if (plain.length === 0) {
                    continue;
                }

                this.warn(
                    `${chunk.fileName} imports a stylesheet that nothing will load. Import it with ` +
                        "`?inline` and adopt it on the view's own root, which works in either view model.",
                );
            }
        },
    };
}
