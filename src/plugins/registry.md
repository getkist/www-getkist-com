---
title: Plugin registry
description: Every kist plugin, searchable by package name, action name, or keyword.
---

# Plugin registry

Every published kist plugin, searchable by package name, by the action name a
pipeline step would reference, or by keyword.

Plugins are ordinary npm packages. Install one and its actions become available
by name — there is nothing to register in `kist.yml`:

```bash
npm install --save-dev @getkist/action-sass
```

kist scans `node_modules` on startup for packages named `@getkist/action-*`,
`kist-action-*`, or `kist-plugin-*`. See [Using plugins](/plugins/using-plugins)
for how that discovery resolves, and what to do when it does not find one.

<PluginRegistry />

## Not listed here?

This registry lists the plugins maintained in the [getkist
organisation](https://github.com/getkist). Community plugins are discovered by
the same naming convention, so they work without appearing on this page —
searching npm for [`kist-action`](https://www.npmjs.com/search?q=kist-action) or
[`kist-plugin`](https://www.npmjs.com/search?q=kist-plugin) finds them.

If nothing wraps the tool you need, you have two options, and the second one is
not a consolation prize:

1. **[Write a plugin](/guide/plugin-development).** A plugin is one class with
   an `execute` method and a default export describing it. If you would find it
   useful, [open a pull request](https://github.com/getkist/kist/pulls) and it
   can live here.
2. **Skip the plugin.** Put the call in a Node script and run it with
   [`RunScriptAction`](/guide/core-actions#runscriptaction). You lose schema
   validation of that step's options and nothing else. A missing wrapper should
   never be what blocks a build.

## Next steps

- [Using plugins](/plugins/using-plugins) — installing, discovery, and troubleshooting
- [Plugin development](/guide/plugin-development) — writing your own
- [Core actions](/guide/core-actions) — what ships with kist itself, no plugin needed
