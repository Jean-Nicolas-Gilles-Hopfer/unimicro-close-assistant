# Working in this repository

This is a Unimicro platform plugin. Platform documentation is installed as skill files in `.claude/skills`.

Read the one that matches what you are doing:

- `.claude/skills/cli/` — How to use the Unimicro CLI (unimicro plugin) to create, develop and publish plugins - commands, project configuration and the dev loop.
- `.claude/skills/host-api/` — The host handle a plugin view is given, member by member - dialogs (confirm, message, prompt), notifications, navigation, logging, getContext and slot context, host.api.request for files and other media types, plus the error codes calls reject with and what happens at unmount. Use whenever plugin code asks the user something, shows a message, moves the user somewhere, logs, or reads who and where it is running. Business data, statistics and the other platform services through host.api are the platform-api skill.
- `.claude/skills/platform-api/` — Reading and writing Unimicro platform data from a plugin view through host.api - which entities exist and what route each answers on, their exact field names, what can be expanded, the filter and paging syntax, status codes, the conventions that break writes, the statistics endpoint for totals and counts, and the other platform services such as files. Use whenever plugin code fetches or saves customers, invoices, orders, products, accounts, suppliers, employees, payments or any other business record, aggregates or counts them, or reaches a file.
- `.claude/skills/plugin-dev/` — How to build Unimicro plugins - manifest format, view models, and the publish flow.
- `.claude/skills/design-system/` — design-system

These files are managed by the Unimicro CLI (`unimicro plugin skills update`). Edit them only if you intend to keep local changes; the CLI will not overwrite edited files.
