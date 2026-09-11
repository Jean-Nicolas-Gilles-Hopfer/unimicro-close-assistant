---
name: unimicro-cli
description: How to use the Unimicro CLI (unimicro plugin) to create, develop and publish plugins - commands, project configuration and the dev loop.
---

# The Unimicro CLI

The `unimicro` command is the entry point to Unimicro's command-line tools, and it dispatches to a
binary per command group: `unimicro plugin …` runs `unimicro-plugin`, with everything after the group
name forwarded to it. Flags therefore go after the group name.

`unimicro plugin` is the group for plugin work: reserve a plugin id, scaffold it, run it against a real
test company while you edit, and publish versions.

Every command works both interactively and scripted. Supply the flags and it never prompts, which is
what makes it usable from CI and from an AI coding agent — add `--no-input` to be certain, and it will
fail with a message naming the missing flag rather than waiting for a terminal that is not there.
`--json` gives machine-readable output for the commands that report data.

## The loop

```sh
unimicro login                  # browser sign-in over a loopback redirect; also picks the test company
unimicro plugin create          # reserve the id, scaffold the project, install
unimicro plugin dev             # build as you edit, served live to the test company
unimicro plugin publish         # build, validate, upload as the new WIP version
```

`unimicro plugin dev` prints and opens a link to the plugin's newest page view, with the tunnel id and
the active test company in it:

```
http://localhost:3000/#/plugins/sales/acme-freight/shipments?companyKey=6f1c…&tunnelId=t_1a2b3c
```

Anyone with access to a test company on the owning contract can open that link and see the build
running on your machine — including someone who has to sign in first: the platform keeps both values
for the life of the tab the link was opened in, so they survive the sign-in sequence and a company
switch. The company is the one `unimicro company` shows, and the link opens in it rather than in
whichever company that browser was last left in — which matters because the tunnel is granted against
the company's contract. A plugin whose views are all slots has no route to land on, so its link is to
the platform itself. Opening the platform with `?tunnelId=` (blank) is how a tab goes back to loading
uploaded files.

## Commands

Session commands live on `unimicro` itself; everything else is under `unimicro plugin`. The prefix is
shown here so each row is a command you can type.

| Command | What it does |
| --- | --- |
| `unimicro login` | Sign in, then pick the active test company. Opens the browser and takes the result back over loopback; `--device-code` for a session with no local browser, `--company` to activate one without being asked. |
| `unimicro logout` | Sign out: revoke the refresh token with the issuer, then forget the cached tokens, contract and company. An issuer that cannot be reached, or that advertises no revocation endpoint, is reported and the local half still happens. |
| `unimicro company` | Show or switch the active test company; `--set` switches without the prompt, `--list` prints the ones on this contract. A contract with no test company gets one created automatically. |
| `unimicro contract` | Show or switch the active contract; `--set <id>` switches, `--list` prints the ones you can use. Switching also picks a test company under the new contract. |
| `unimicro plugin application create` | Create the application a plugin belongs to, without asking anything. `app` is an alias. Takes the name as its argument and `--description`; `--json` returns the application, whose `id` is what `plugin create --application` wants. **This is the command to reach for when scripting on a contract that has no application yet** — `plugin create` offers to make one only when there is somebody to prompt, and otherwise fails asking for an `--application <id>` that does not exist. |
| `unimicro plugin create` | Reserve a plugin id and scaffold the project — then everything under "After scaffolding" below. Asks what the plugin is called and suggests the id from that; `--id` supplies it outright. Plugin ids are lowercase letters and hyphens, no digits, and permanent once reserved — digits in the name are spelled out rather than dropped, so "Acme Freight 2" suggests `acme-freight-two`. `--template` picks the template (the default is Vite + Lit), `--dir` the directory (default: the plugin id). Then asks what kind the first view is, the same choice as `add view`: a native page (default, the template's full page), a native slot, a native column or an isolated page; `--shape page\|slot\|column` and `--model native\|isolated` supply it. A slot or column first view replaces the template's page and takes `--slot`, `--label` and `--field` like `add view`; the template then defaults to the no-bundler one. `--label` defaults to the plugin name. |
| `unimicro plugin add view` | Add a view. Asks what the view is called and suggests the id, route slug and label from it — `--name` does the same without prompting, and passing the id as the argument skips it. View ids are lowercase letters, digits, hyphens and underscores; they become a directory, a route segment and a class name. Then asks what kind of view it is: native page, native slot, native column or isolated page, marking native when the publisher is not designated as trusted; `--shape page\|slot\|column` and `--model native\|isolated` answer it without prompting (default: native page). A page view's platform area is picked from a list (`--module` to supply it outright) and doubles as its menu section, so nothing asks twice — the same list carries this plugin's own menu sections and an entry that declares a new one, and `--section` supplies one outright. A slot view picks its target from the catalogue (`--slot`), which offers panel slots and tab slots; on a tab slot it asks what the tab says, defaulting to the view name (`--label`). A column view picks a column slot (`--slot`), asks for the header (default: the view name, `--label`) and the row fields it needs as statistics paths (`--field`, repeatable); `sortField`, `width` and `alignment` are edited into the manifest by hand. `--requires` (repeatable) lists `ui_`-prefixed permission keys the view needs: the platform hides a view whose keys the session does not hold, using the same check that gates its own pages. |
| `unimicro plugin add menu-section` | Declare a top-level menu section for this plugin (the manifest's `menuSections`), which views join by naming its id in `menu.section`. Asks for the label and suggests the id from it; `--label`, `--id` and `--icon` supply them outright. Section ids are **global rather than per plugin**: two plugins declaring the same one share a single section, and the first by plugin id supplies the label and icon. The icon is an SVG in the plugin's own assets, drawn by the platform as a mask filled with the menu's colour — a glyph, not a logo, since only its alpha channel survives. Interactively, a placeholder is offered at `./assets/icons/{id}.svg` so the loop works before a designer is involved. |
| `unimicro plugin dev` | The dev loop — see below. `--mode` overrides `dev.mode` for one run, `--debounce` the 300 ms window changes are batched into. `--no-tunnel` builds and watches locally without opening a tunnel; `--no-open` keeps the shareable URL off the screen. |
| `unimicro plugin validate` | Everything the publish gate checks that can be checked locally, plus warnings. `--skip-file-checks` drops the entry and icon existence checks, for validating a manifest before anything has been built. A column view without a header, a `sortField` outside its `fields`, and `tab` on anything but a slot view are errors here; whether a slot's kind fits the view is checked at `add view` and at publish, where the catalogue is. Menu section icons are checked here: an icon that is missing, not an SVG, over 32 kB, or carrying script, embedded HTML or references outside itself is an **error**; a missing icon, a missing `viewBox`, a section no view names, and an icon outside the served roots are **warnings**, which leave the exit code at 0 and travel through `--json` beside the problems. |
| `unimicro plugin build` | Build and write the artifact archive; `--output` names the file (default `{id}-{version}.zip` in the plugin). `--skip-build-script` packages the output already on disk. |
| `unimicro plugin publish` | Build, validate, upload as the WIP version. `--skip-build-script` uploads the output already on disk. |
| `unimicro plugin status` | Current plugin: id, application, WIP version, validation state. |
| `unimicro plugin versions` | The plugin's uploaded versions. |
| `unimicro plugin list` | The contract's applications and their plugins. |
| `unimicro plugin config` | The resolved project configuration, including what was inferred, and the Developer API it resolved to — which is the origin every other endpoint here hangs off. |
| `unimicro plugin slots` | The slots a view can render in: id, what the surface is, what context the page hands it, and its kind. A plain entry is a panel a slot view renders in; `kind: tab` is a tab on a details page, also for slot views, one tab per label; `kind: column` is a column in a list, for column views. Without `--platform-app`, only the slots every front end this plugin declares offers, which is what publish accepts. The catalogue is served by the front end rather than compiled in — publish validates against this list, so a copy kept anywhere else would drift. Anonymous, so it answers signed out. |
| `unimicro plugin skills` | `skills install`, `skills update` (refresh to the versions matching this plugin) and `skills list` (what is installed, with update state). `unimicro plugin create` installs them for you. |

### After scaffolding

`unimicro plugin create` does not stop at extracting the template. In order, and each step skippable:

1. **Platform skills** are installed into the plugin (`--no-skills`). They are what teach a coding
   agent this platform, and they are worth the most in the minutes right after `unimicro plugin create` — which is
   exactly when nobody yet knows `unimicro plugin skills install` exists. A failure here is never fatal: the id is
   already reserved and the scaffold is on disk.
2. **`git init` and a first commit** of the scaffold (`--no-git`), before dependencies are installed,
   so the baseline commit is what the template gave you and not whatever the package manager wrote.
3. **Dependencies** (`--install` / `--no-install`). Interactively this is a prompt defaulting to yes.
   Scripted, the answer is **no** — a CI step or an agent that wanted an id and a directory should not
   spend minutes on a package manager, possibly with no network, that it never asked for.

The CLI cannot `cd` for you — a child process cannot move its parent's shell — so the install runs in
the new directory and `cd` stays in the printed next steps.

Per-plugin state — the plugin id, its application, the tunnel id — lives in `.unimicro/` inside the
plugin and is gitignored, so each working copy keeps its own tunnel id and URLs. The skills are
installed into `.claude/skills/` and committed, so a fresh clone has the files `AGENTS.md` points at.

## Project configuration

`unimicro.config.json` beside `manifest.json` describes how the project is built and run. It is
optional: with no file, the CLI infers a rebuild-mode setup from `package.json` and the manifest. Run
`unimicro plugin config` to see what it resolved.

```jsonc
{
  "$schema": "https://dev-developer-api.unimicro.no/schemas/unimicro.config.json",
  "build": { "command": "npm run build", "outDir": "dist" },
  "dev": {
    "mode": "proxy",                    // rebuild | watch | proxy
    "command": "npm run dev",
    "url": "http://localhost:5173",     // proxy: where the dev server listens
    "watch": ["src", "manifest.json"],
    "entryMap": { "^dist/views/(.+)/index\\.js$": "src/views/$1/index.ts" }
  },
  "serve": { "roots": ["dist"] },       // the only paths the tunnel may read
  "artifact": { "include": ["dist/**"], "exclude": ["**/*.map"] }
}
```

### The three dev modes

| Mode | The CLI runs | "A build finished" is | Files come from |
| --- | --- | --- | --- |
| `rebuild` | the command once per change | the command exiting 0 | disk, under `serve.roots` |
| `watch` | the command once, kept alive | `signalOn` paths going quiet | disk, under `serve.roots` |
| `proxy` | the command once, or attaches to a server already running | `watch` paths going quiet | the dev server, over HTTP |

`rebuild` is the safest: a failed build emits no signal, so the browser keeps the last good one. In
`watch` and `proxy` the CLI does not own the build, so completion is inferred from output settling.

The two shipped templates take one each: **Vite + Lit** (the default) runs `proxy`, and **TypeScript,
no bundler** runs `watch` on `tsc --watch`, which writes to disk.

**Proxy mode is a contract with the bundler**, and the shipped Vite template holds up its end:

- The CLI passes `UNIMICRO_ASSET_BASE`, `UNIMICRO_TUNNEL_ID`, `UNIMICRO_PLUGIN_ID`, `UNIMICRO_DEV_ORIGIN` and `UNIMICRO_DEV_PORT`
  into the dev command's environment. None of them can be overridden by `dev.env`.
- The bundler must use `UNIMICRO_ASSET_BASE` as its public base path, or the absolute URLs it emits —
  code-split chunks, its own client — resolve outside the tunnel and 404.
- `dev.entryMap` rewrites the manifest's built entry paths to the source paths the dev server has.
  Without it the platform asks for files the dev server has never produced.

### Which port the dev server uses

`unimicro plugin create` picks a free port per plugin and writes it into both `unimicro.config.json` (`dev.url`)
and the bundler's config, so two plugins on one machine never contend for a shared default. A single
port shipped in the template would be a collision waiting to happen — and was: the template's old
default was 5173, which is also what the developer portal uses.

`unimicro plugin dev` attaches to a server already on that port only when it is serving *this* plugin. It decides
by asking for the plugin's first view under `UNIMICRO_ASSET_BASE`, a prefix carrying the plugin id and the
tunnel id — nothing else has a reason to answer there. If something else holds the port, the CLI takes
a free one, passes it as `UNIMICRO_DEV_PORT`, and says so. The bundler's config reads that variable, falling
back to the scaffolded port:

```ts
port: Number(process.env.UNIMICRO_DEV_PORT ?? 5487),
```

One dev loop runs per plugin directory: two would share a tunnel id and take turns owning it. A loop an
earlier run left behind — killed with its shell, but not by it — is ended when the next loop starts in
the same directory, so it is never in the way.

On Windows under Git Bash, start a background loop as `unimicro.cmd plugin dev`. The `unimicro` sh shim
npm installs breaks the process tree, so stopping the shell leaves the loop and its dev server running.

The platform never sees this port — the tunnel addresses the plugin through the Developer API — so
moving is invisible to everything except HMR, whose origin the CLI derives from whatever port is
settled on.

### Hot module replacement

`UNIMICRO_DEV_ORIGIN` is where the browser can reach the dev server with the tunnel out of the way, and
pointing the bundler's HMR client at it is all HMR needs. Served through the tunnel, that client
defaults to dialling the platform's origin, which has no socket for it; given this origin it connects
straight to the machine. A browser permits that even from the platform's https page, because loopback
counts as a secure context. Nothing about it is Vite-specific — any bundler that lets its HMR client's
host and port be configured can use it. In the Vite template:

```ts
const devOrigin = process.env.UNIMICRO_DEV_ORIGIN ? new URL(process.env.UNIMICRO_DEV_ORIGIN) : null;
// server.hmr
hmr: devOrigin ? { protocol: 'ws', host: devOrigin.hostname, clientPort: Number(devOrigin.port) } : true
```

Two limits worth knowing. It is loopback only, so someone who opens the dev link on another machine
gets no hot updates and a retrying socket in their console — the view still loads, and the platform
still reloads it when the CLI signals a finished build. And the variable is absent outside proxy mode,
since only proxy mode has a dev server; absence is the signal to leave HMR alone.

## Build output the manifest can name

The manifest names each view's entry file and cannot name a content hash, so entry files need stable
paths — hash only shared chunks. The artifact carries `manifest.json` plus the files the manifest
names, so anything else the build emits needs `artifact.include`.

## Signing in

`unimicro login` runs the authorization code flow with PKCE and a loopback redirect — the browser opens, the
developer signs in as they do everywhere else, and the code comes back to a listener the CLI holds on
`localhost`. Nothing is typed by hand. The redirect is fixed at `http://localhost:7890/callback`
because the redirect URI is part of the client registration and is matched as a string;
`--redirect-port` covers the case where something else holds the port, but the port has to be one the
identity server knows. The CLI listens on both `127.0.0.1` and `::1`, because `localhost` resolves to
either and the browser picks.

The CLI lands on the **test lane** when nothing says otherwise: it signs in at
`test-login.unimicro.no`, talks to `developer-api.unimicro.no` and opens `test.unimicro.no`.
`--lane dev` is the dev lane. A lane is one set, and the whole set moves together — a token from one
lane's issuer is refused by every other lane's API. That is why a lane is chosen whole, with `--lane`,
rather than one endpoint at a time: overriding part of it produces a sign-in that succeeds and calls
that fail.

**A command that needs the API signs you in first.** Running `unimicro plugin dev` with no session
opens the browser, completes the sign-in, picks the test company and then carries on with the command
you asked for — there is no "run login first and try again" step. Commands that need no API —
`validate`, `build`, `config` — never trigger it.

**A terminal is not required for this.** What decides is whether a browser here can reach the
developer, which is a different question from whether stdout is a console. An AI coding agent running
on the developer's own machine has no terminal and a browser one window away, so it signs in normally.
The sign-in URL is printed to **stderr** and is never suppressed, `--json` included, because it is the
one line somebody has to act on.

How it resolves, first match winning:

| Condition | What happens |
| --- | --- |
| `--no-browser` (env `UNIMICRO_NO_BROWSER`) | refuses, naming `unimicro login` |
| `--no-input` | refuses — a sign-in is something a person has to answer |
| `$CI` (or `GITHUB_ACTIONS`, `TF_BUILD`, `GITLAB_CI`, …) | refuses, rather than waiting out a five-minute timeout on every job |
| `$SSH_CONNECTION` / `$SSH_TTY` | device code — a loopback redirect cannot reach the far end of an SSH session |
| otherwise | browser, terminal or not |

`unimicro login` is the exception to the refusals: asking to sign in outright means the developer is
there, so `--no-browser` and CI send it to the device-code flow instead of failing. `--device-code`
asks for that flow outright. **Device code is not enabled on the current registration**: the server
answers `unauthorized_client`, and the CLI says so and points at `unimicro login`.

If sign-in succeeds but no test company can be picked — several exist and nothing can prompt — the
sign-in still counts and is saved; the command then fails naming `--company`. A contract with no test
company at all is different: one is created automatically, so the command carries on.

**Neither works in CI**, because both need a person at a browser. Publishing from a pipeline needs a
confidential client and the client-credentials grant, which does not exist yet; until it does, a
pipeline cannot authenticate. Everything else about the CLI is CI-ready — flag forms, `--no-input`,
`--json`, exit codes — so this is a credential gap, not a usability one.

## Pointing at something other than the default

| Flag | Env | What it points at |
| --- | --- | --- |
| `--contract` | `UNIMICRO_CONTRACT_ID` | the contract to operate on |
| `--lane` | `UNIMICRO_LANE` | the lane to work against |

Work in progress only loads on the test instance — production loads published versions and never
touches a tunnel — so a dev link into production could not work, whatever it pointed at.

**There is no flag for the Developer API, the issuer, the OAuth client or the platform app.** They
are set through `UNIMICRO_API_URL`, `UNIMICRO_ISSUER`, `UNIMICRO_CLIENT_ID` and
`UNIMICRO_PLATFORM_URL`, for Unimicro's own work on the platform, and an installed CLI follows the
first three only to an address on the same machine. Do not suggest any of them to a plugin developer:
their services are not the ones they are pointed at, and advising it sends them looking for a fault
that is not there.

## Watching the dev loop from a program

`unimicro plugin dev --json` writes newline-delimited JSON to stdout, one object per line, as things
happen. Human output and the build's own output stay on stderr, so stdout is only ever events.

```
{"event":"dev.started","time":"…","pluginId":"acme-freight","mode":"rebuild","tunnel":true,"verdicts":true}
{"event":"tunnel.ready","time":"…","tunnelId":"t_1a2b3c","url":"https://…","companyKey":"6f1c…"}
{"event":"build.started","time":"…","reason":"initial"}
{"event":"build.succeeded","time":"…","durationMs":412}
{"event":"build.started","time":"…","reason":"change","changed":["src/views/x/index.ts"]}
{"event":"build.failed","time":"…","durationMs":380,"exitCode":2,"error":"…","output":"src/views/x/index.ts:12:5 - error TS2345…"}
```

Every event carries `event` and `time` (RFC3339).

| Event | Fields |
| --- | --- |
| `dev.started` | `pluginId`, `mode`, `inferred`, `tunnel`, `verdicts` |
| `tunnel.ready` | `tunnelId`, `url`, `companyKey` |
| `tunnel.stopped` | `error` |
| `devserver.ready` | `url`, `port`, `attached` |
| `devserver.exited` | `command`, `error` |
| `build.started` | `reason` (`initial` or `change`), `changed` |
| `build.succeeded` | `durationMs` |
| `build.failed` | `durationMs`, `exitCode`, `error`, `output` |
| `reloaded` | `manifestChanged`, or `error` when the signal failed |
| `dev.stopping` | `reason` (`interrupt` or `session-lost`) |

**`session-lost` is not an interrupt, and the difference is the point.** The dev loop ends either
because somebody stopped it or because the session expired and nobody signed in again — a browser
opens for that, and it waits five minutes. Reconnecting past it is pointless: every attempt needs a
token and getting one is what went unanswered, so the loop stops rather than reopening a tab every
few minutes at a machine nobody is sitting at. An agent seeing `session-lost` should report that the
developer has to run `unimicro login`, not retry.

**`verdicts` on `dev.started` says whether a build outcome will ever arrive.** In `rebuild` mode the
CLI runs the build, so every `build.started` is followed by `build.succeeded` or `build.failed`. In
`watch` and `proxy` the build belongs to your bundler and the CLI only sees output go quiet — so
`build.started` is followed by `reloaded` and no verdict, ever. Read `verdicts` before waiting on one;
with `verdicts: false`, compiler errors are on stderr and nowhere else.

`build.failed.output` is the tail of what the build printed (last 100 lines), which is where the
compiler error is. `exitCode` is absent when the failure was not a non-zero exit.

## Notes for agents

- Prefer flags over prompts, and pass `--no-input` so a missing value fails loudly.
- `unimicro plugin slots` before `add view --shape slot` or `--shape column`: slot ids and their kinds are not guessable.
- `unimicro plugin validate` before `unimicro plugin publish`: validation errors come back all at once, and it needs no upload.
- `unimicro plugin status --json` and `unimicro plugin config --json` are the two reads worth making before changing anything.
- `unimicro plugin dev --json` is the one streaming command — read it line by line rather than waiting for it to exit, because it does not.
- Stop the dev loop with Ctrl+C, or by ending its process; the next `unimicro plugin dev` in the same directory ends a loop left behind. Under Git Bash on Windows run it as `unimicro.cmd plugin dev`.
- A plugin id is immutable once reserved, and lowercase kebab-case with letters and hyphens only.
