---
title: Cookbook
description: Complete, working kist.yml recipes for the builds people actually have.
---

# Cookbook

Whole pipelines, not fragments. Each recipe lists what to install, gives a
`kist.yml` you can paste, and says what it does and does not cover.

For what each option means, see the [configuration
reference](/guide/configuration); for what each action accepts, [core
actions](/guide/core-actions) and the [plugin registry](/plugins/registry).

Every recipe assumes the schema comment at the top of the file, which is what
makes your editor complete and validate the rest:

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json
```

[[toc]]

## A TypeScript library

The common case: type-check, bundle to ESM and CJS, and ship a trimmed
`package.json` next to it.

```bash
npm install --save-dev kist @getkist/action-typescript @getkist/action-tsup @getkist/action-eslint
```

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json

options:
    mode: production
    logLevel: info
    haltOnFailure: true
    cache:
        enabled: true

stages:
    - name: Clean
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: ./dist

    - name: Verify
      dependsOn: [Clean]
      # Linting and type-checking do not depend on each other.
      parallel: true
      steps:
          - name: Lint
            action: LintAction
            inputs:
                - "src/**/*.ts"
            options:
                targetFiles:
                    - "src/**/*.ts"

          - name: TypeCheck
            action: TypeScriptCompilerAction
            inputs:
                - "src/**/*.ts"
                - "tsconfig.json"
            options:
                tsconfigPath: ./tsconfig.json

    - name: Bundle
      dependsOn: [Verify]
      steps:
          - name: BuildBundle
            action: BundleAction
            inputs:
                - "src/**/*.ts"
            outputs:
                - "dist/**"
            options:
                entry: ./src/index.ts
                outDir: ./dist
                format: [esm, cjs]
                dts: true
                sourcemap: true
                target: node20

    - name: Package
      dependsOn: [Bundle]
      steps:
          - name: WritePackageJson
            action: PackageManagerAction
            options:
                packageJsonPath: ./package.json
                outputDir: ./dist
                fields:
                    - name
                    - version
                    - description
                    - license
                    - author
                    - repository
                    - keywords
                    - dependencies

          - name: CopyLicense
            action: FileCopyAction
            options:
                srcFiles:
                    - ./LICENSE
                    - ./README.md
                destDir: ./dist
                useCache: true
```

`TypeScriptCompilerAction` here is doing a type check, and `BundleAction`
produces the actual output — tsup strips types rather than checking them, so
running both is what makes a type error fail the build.

## A design system: styles, icons, and an icon font

```bash
npm install --save-dev kist \
  @getkist/action-sass @getkist/action-postcss \
  @getkist/action-svg @getkist/action-fantasticon
```

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json

options:
    mode: production
    cache:
        enabled: true
    performance:
        maxConcurrentSteps: 4

stages:
    - name: Prepare
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: ./dist
          - name: CreateTree
            action: DirectoryCreateAction
            options:
                basePath: ./dist
                directories: [css, icons, font]

    - name: Assets
      dependsOn: [Prepare]
      parallel: true
      steps:
          - name: Styles
            action: StyleProcessingAction
            inputs:
                - "src/scss/**/*.scss"
            outputs:
                - "dist/css/**"
            options:
                inputFile: ./src/scss/index.scss
                outputFile: ./dist/css/index.css
                styleOption: compressed
                sourceMap: true

          - name: IconSprite
            action: SvgSpriteAction
            inputs:
                - "src/icons/**/*.svg"
            outputs:
                - "dist/icons/**"
            options:
                sourceDir: ./src/icons
                outputDir: ./dist/icons

          - name: IconFont
            action: FantasticonAction
            inputs:
                - "src/icons/**/*.svg"
            outputs:
                - "dist/font/**"
            options:
                inputDir: ./src/icons
                outputDir: ./dist/font
                fontName: ds-icons
                formats: [woff2, woff]
                css: true
                classPrefix: icon
```

The three asset steps read different inputs and write different outputs, so
`parallel: true` is safe. Where two steps write into the same directory, keep
them sequential — kist does not detect the collision for you.

## A static site with live reload

```bash
npm install --save-dev kist @getkist/action-nunjucks @getkist/action-sass
```

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json

options:
    mode: development
    logLevel: info
    live:
        enabled: true
        port: 3000
        root: dist
        watchPaths:
            - src/**
        ignoredPaths:
            - node_modules/**
            - dist/**
    cache:
        enabled: true

stages:
    - name: Site
      steps:
          - name: RenderPages
            action: TemplateRenderAction
            inputs:
                - "src/pages/**/*.njk"
                - "src/layouts/**/*.njk"
                - "src/data/**"
            outputs:
                - "dist/**/*.html"
            options:
                inputDir: ./src/pages
                outputDir: ./dist
                searchPaths:
                    - ./src/layouts
                contextFiles:
                    - ./src/data/site.yml
                stripExtension: .njk
                excludePatterns:
                    - "_*.njk"

          - name: Styles
            action: StyleProcessingAction
            inputs:
                - "src/scss/**/*.scss"
            outputs:
                - "dist/css/**"
            options:
                inputFile: ./src/scss/main.scss
                outputFile: ./dist/css/main.css
                styleOption: expanded
```

```bash
kist --live
```

`dist/**` is in `ignoredPaths` deliberately: without it the build's own output
retriggers the watcher and the pipeline runs forever.

## Development and production from one base

`extends` merges a base file into the one that names it, with the child
winning. Keep everything shared in the base and let each variant say only what
differs.

```yaml
# kist.base.yml
options:
    logLevel: info
    cache:
        enabled: true

stages:
    - name: Build
      steps:
          - name: Bundle
            action: BundleAction
            options:
                entry: ./src/index.ts
                outDir: ./dist
                format: [esm]
```

```yaml
# kist.yml — development
extends: ./kist.base.yml

options:
    mode: development
    logLevel: debug
    live:
        enabled: true
        root: dist
        watchPaths: [src/**]
```

```yaml
# kist.production.yml
extends: ./kist.base.yml

options:
    mode: production

stages:
    - name: Optimise
      dependsOn: [Build]
      steps:
          - name: Minify
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/index.js
                outputPath: ./dist/index.min.js
```

```bash
kist                                  # development
kist --config kist.production.yml     # production
```

## Running something no plugin covers

`RunScriptAction` runs `node <scriptPath>`. It is not a shell, so a command
line goes in a small script rather than in the YAML:

```yaml
- name: GenerateSitemap
  action: RunScriptAction
  inputs:
      - "dist/**/*.html"
  outputs:
      - "dist/sitemap.xml"
  options:
      scriptPath: ./scripts/sitemap.js
      args: ["--base", "https://example.com"]
```

Two things to know before relying on it:

- **It spawns `node` directly.** To run a binary from `node_modules/.bin`, or
  anything with pipes and redirection, write a script that spawns it.
- **Anything the script writes to stderr fails the step.** Plenty of tools log
  progress there while succeeding, so a wrapper script should capture the child
  process's stderr and decide for itself, rather than letting it through.

```js
// scripts/sitemap.js — a wrapper that judges by exit code, not by stderr
import { spawnSync } from 'node:child_process'

const result = spawnSync('npx', ['some-tool', ...process.argv.slice(2)], {
  encoding: 'utf8',
})

if (result.status !== 0) {
  // Only now is it a failure. Writing to stdout keeps kist happy.
  console.log(result.stderr)
  process.exit(result.status ?? 1)
}
console.log(result.stdout)
```

## Making a build cache well

Caching is per step and opt-in through `inputs`. A step without them runs every
time — kist will not guess what a step reads, because guessing wrong means
silently skipping work.

```yaml
- name: Styles
  action: StyleProcessingAction
  inputs:
      # Everything the step reads, including partials it imports.
      - "src/scss/**/*.scss"
  outputs:
      # Everything it writes, so the output can be restored on a hit.
      - "dist/css/**"
  options:
      inputFile: ./src/scss/main.scss
      outputFile: ./dist/css/main.css
```

Three habits that decide whether caching helps:

1. **Declare partials, not just entry points.** `inputs: ["src/scss/main.scss"]`
   on a file that `@use`s a dozen partials will happily serve you a stale
   stylesheet.
2. **Declare outputs.** Without them a hit can skip the step but has nothing to
   restore, which matters the moment the output directory has been cleaned.
3. **Do not cache what is cheap.** Restoring is not always faster than
   re-running; a step that takes 50ms is not worth a cache lookup.

See [Caching](/guide/caching) for the cache key, environment variables, and how
to carry the directory between CI runs.

## Checking a pipeline before running it

```bash
kist --dry-run                        # what would run, in order
kist --dry json                       # the same plan, for tooling
kist --graph mermaid                  # the stage graph, to paste into a doc
kist validate                         # the file parses and every action exists
```

`kist validate` is the one worth putting in CI — it catches a step naming an
action no installed plugin provides, which otherwise surfaces only when the
pipeline reaches that step.

## In CI

```yaml
# .github/workflows/build.yml
name: Build

on: [push, pull_request]

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v6

            - uses: actions/setup-node@v6
              with:
                  node-version: 22.x
                  cache: npm

            - run: npm ci

            # Carry the cache directory between runs so the skip logic has
            # something to work with.
            - uses: actions/cache@v4
              with:
                  path: .kist-cache
                  key: kist-${{ runner.os }}-${{ hashFiles('src/**') }}
                  restore-keys: kist-${{ runner.os }}-

            - run: npx kist validate
            - run: npx kist --config kist.production.yml
```

Restoring a cache is not free. If your build is a few seconds, downloading and
unpacking the cache can cost more than the work it saves — measure before
keeping it.

## Next steps

- [Configuration reference](/guide/configuration) — every field
- [Core actions](/guide/core-actions) — what needs no plugin
- [Plugin registry](/plugins/registry) — searchable by action name
- [Caching](/guide/caching) — the cache key in detail
- [Best practices](/guide/best-practices) — how to keep a pipeline readable
