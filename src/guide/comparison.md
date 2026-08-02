# How kist compares

kist is a pipeline runner: you describe stages and steps in a YAML file, and it
runs them, in the right order, skipping what has not changed. It is not a
bundler and not a monorepo task graph. This page is about where that leaves it
relative to the tools you are probably already using, including the cases where
one of them is the better answer.

## The short version

| You want to… | Use |
| --- | --- |
| Bundle an application for the browser | Vite, or Rollup/esbuild directly |
| Orchestrate tasks across many packages in a monorepo | Turborepo or Nx |
| Add caching to the npm scripts you already have | Wireit |
| Describe a build as ordered stages, with caching and watch built in | kist |

## npm scripts

npm scripts are where most projects start, and for a handful of commands they
are the right tool: no dependency, no configuration, no concepts to learn.

They start to hurt when the build becomes a graph rather than a list. Ordering
turns into `&&` chains and `npm-run-all` invocations, nothing is skipped when
inputs have not changed, and a failure halfway through leaves you guessing which
step it was. Passing options to a tool means editing a shell string.

kist keeps the shape of the build in one file, gives each step a name that shows
up in the output, and skips steps whose inputs are unchanged. If your build is
five commands in a row, npm scripts remain a perfectly good answer.

## Wireit

[Wireit](https://github.com/google/wireit) is the closest thing to kist in
spirit, and it makes the opposite configuration choice: it enhances the npm
scripts you already have by adding a `wireit` section to `package.json`, rather
than moving the build into a separate file.

Both skip work whose declared inputs have not changed. The differences:

- **Wireit** leaves your scripts as the unit of work. Nothing new to learn if
  you already know npm scripts, and adoption is incremental — one script at a
  time.
- **kist** makes the pipeline the unit of work. Stages, dependencies between
  them, per-step options, and watch-and-serve are described in one place, and
  actions are typed plugins rather than shell strings.

Choose Wireit if your build is fundamentally a set of npm scripts and you want
them to be faster. Choose kist if you want the build described as a pipeline.

## Turborepo and Nx

[Turborepo](https://turborepo.dev) and [Nx](https://nx.dev) solve a problem kist
does not address: running tasks across many packages in a monorepo, in
dependency order, with remote caching shared across a team and CI.

If you have a monorepo with more than a handful of packages, use one of them.
They are mature, well funded, and the caching model kist's own is built on comes
straight from their design.

kist is aimed at the single package: the one library, site, or design system
whose build is more than a couple of commands but which does not need a task
graph across twenty workspaces. The two are not mutually exclusive — Turborepo
can invoke `kist` as the build task for a package.

## Vite, Rollup, esbuild, and friends

These are bundlers: they take modules and produce optimised output. kist does
not bundle anything. It runs the bundler, along with everything else the build
needs — cleaning, copying, compiling styles, generating icon fonts, writing
`package.json` — in a defined order.

A typical kist pipeline calls a bundler as one of its steps, through
[`@getkist/action-tsup`](/plugins/action-tsup) or
[`@getkist/action-tsdown`](/plugins/action-tsdown).

## Gulp and Grunt

kist is a plugin-based task runner with a declarative configuration, which is
also a fair description of Gulp and Grunt. It is worth being honest about why
those fell out of favour, because the criticism applies to any tool of this
shape:

> Plugins are thin wrappers around tools you could call directly. They lag the
> tool they wrap, they add a layer to debug through, and the configuration
> abstraction leaks the moment you need something the wrapper did not
> anticipate.

Three things in kist are meant to keep that from repeating:

1. **Plugins stay thin and are tested.** Each `@getkist/action-*` package runs
   its own suite on every push, against the tool it wraps.
2. **There is always an escape hatch.** `RunScriptAction` runs any command. A
   missing wrapper is never a blocker; it is at most an inconvenience.
3. **Configuration is schema-validated.** The
   [JSON Schema](https://www.getkist.com/schema.json) means your editor tells
   you what a step accepts before you run it, rather than the pipeline telling
   you afterwards.

If a wrapper is holding you back, drop to `RunScriptAction` and keep moving.

## What kist does not do

Stated plainly, so you can rule it out quickly:

- No bundling, minification, or transpilation of its own — it calls tools that do.
- No cross-package task graph. One package, one pipeline.
- No remote cache shared between machines yet. Caching is local, though the
  cache directory can be shared through your CI provider's cache — see
  [Caching](/guide/caching).
- No plugin marketplace. Plugins are npm packages named `@getkist/action-*`,
  `kist-action-*`, or `kist-plugin-*`, discovered from `node_modules`.
