---
title: Migrate from Gulp
description: Translate a gulpfile into a kist pipeline, one task at a time, without a big-bang rewrite.
---

# Migrate from Gulp

Gulp and kist describe the same thing — an ordered set of build tasks — and
disagree about where that description lives. A gulpfile is code that builds a
stream graph at runtime. A `kist.yml` is data that kist reads and executes.

Most of the migration is mechanical. This page covers the mapping, the two
places it stops being mechanical, and how to move across without a rewrite
weekend.

## Should you?

Not necessarily. Gulp still works. Move if you want the build described as
data — inspectable with `kist --dry-run`, validated by your editor against a
[JSON Schema](https://www.getkist.com/schema.json), skipped when inputs have not
changed. Stay if your gulpfile leans hard on custom stream transforms; those are
the part with no direct equivalent, and rewriting them is real work with no
payoff beyond the config format.

## The mapping

| Gulp | kist |
| --- | --- |
| `gulpfile.js` | `kist.yml` |
| `gulp.task('x', …)` / exported function | a step, with `name: X` |
| `gulp.series(a, b)` | steps in order inside one stage (`parallel: false`, the default) |
| `gulp.parallel(a, b)` | steps in one stage with `parallel: true` |
| `gulp.src(glob)` | the action's own input option (`inputFile`, `srcDir`, `targetFiles`, …) |
| `gulp.dest(dir)` | the action's own output option (`outputFile`, `destDir`, …) |
| `.pipe(plugin())` | one step per plugin, not a chain |
| `gulp.watch(glob, task)` | `options.live.watchPaths` |
| `gulp-if` | no equivalent — see [Conditionals](#conditionals-and-environments) |
| `del` / `gulp-clean` | `DirectoryCleanAction` |
| `gulp-sass` | [`@getkist/action-sass`](/plugins/action-sass) |
| `gulp-postcss` | [`@getkist/action-postcss`](/plugins/action-postcss) |
| `gulp-uglify` / `gulp-terser` | [`@getkist/action-terser`](/plugins/action-terser) |
| `gulp-typescript` | [`@getkist/action-typescript`](/plugins/action-typescript) |
| `gulp-eslint` | [`@getkist/action-eslint`](/plugins/action-eslint) |
| `gulp-nunjucks` | [`@getkist/action-nunjucks`](/plugins/action-nunjucks) |
| `gulp-svg-sprite` | [`@getkist/action-svg`](/plugins/action-svg) |
| `gulp-rename` | `FileRenameAction` |
| anything else | `RunScriptAction`, see [The escape hatch](#the-escape-hatch) |

The one line worth staring at is **`.pipe()` becomes separate steps**. That is
the real change of model, and the next section is about what it costs you.

## Streams become files

Gulp passes vinyl file objects between plugins in memory. A chain like this
never touches disk in between:

```js
gulp.src('src/scss/*.scss')
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(cssnano())
  .pipe(gulp.dest('dist/css'))
```

kist has no equivalent of the stream. Each action reads files and writes files.
The same chain becomes two steps, with an intermediate file between them:

```yaml
stages:
    - name: Styles
      steps:
          - name: CompileSass
            action: StyleProcessingAction
            options:
                inputFile: ./src/scss/main.scss
                outputFile: ./build/css/main.css
                styleOption: expanded

          - name: PostProcessCss
            action: PostCssAction
            options:
                inputFile: ./build/css/main.css
                outputFile: ./dist/css/main.css
```

Be honest about the trade: this is more I/O than Gulp does, and it introduces a
`build/` directory that only exists to hold the handoff. What you get back is a
build whose intermediate state you can open in an editor when a step produces
something unexpected, and steps that cache independently.

Where a plugin already does the whole chain, use it —
[`@getkist/action-sass`](/plugins/action-sass) runs PostCSS itself, so the
example above collapses back to one step in real projects. The two-step version
is the general shape, not the recommended one.

## A worked example

A gulpfile of the kind most projects actually have:

```js
const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const terser = require('gulp-terser')
const del = require('del')

function clean() {
  return del(['dist'])
}

function styles() {
  return src('src/scss/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(dest('dist/css'))
}

function scripts() {
  return src('src/js/**/*.js').pipe(terser()).pipe(dest('dist/js'))
}

function assets() {
  return src('src/images/**/*').pipe(dest('dist/images'))
}

exports.build = series(clean, parallel(styles, scripts, assets))
exports.watch = () => watch('src/**/*', exports.build)
```

The same build as `kist.yml`:

```yaml
# yaml-language-server: $schema=https://www.getkist.com/schema.json

options:
    mode: production
    logLevel: info
    cache:
        enabled: true
    live:
        enabled: false
        watchPaths:
            - src/**

stages:
    - name: Clean
      steps:
          - name: CleanDist
            action: DirectoryCleanAction
            options:
                dirPath: ./dist

    - name: Build
      dependsOn: [Clean]
      # `parallel(styles, scripts, assets)` — three independent steps, run
      # concurrently within the stage.
      parallel: true
      steps:
          - name: Styles
            action: StyleProcessingAction
            inputs:
                - "src/scss/**/*.scss"
            outputs:
                - "dist/css/**"
            options:
                inputFile: ./src/scss/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed

          - name: Scripts
            action: JavaScriptMinifyAction
            inputs:
                - "src/js/**/*.js"
            outputs:
                - "dist/js/**"
            options:
                inputDir: ./src/js
                outputDir: ./dist/js

          - name: Assets
            action: DirectoryCopyAction
            inputs:
                - "src/images/**"
            outputs:
                - "dist/images/**"
            options:
                srcDir: ./src/images
                destDir: ./dist/images
```

Two things in there have no counterpart in the gulpfile:

- **`dependsOn`** makes the ordering a declared fact rather than the argument
  order of a `series()` call. `kist --graph mermaid` will draw it for you.
- **`inputs` / `outputs`** opt each step into content-hash caching. Change one
  SCSS file and `Scripts` and `Assets` are skipped, with their previous output
  restored. A step with no declared `inputs` always runs — kist will not guess
  what a step reads. See [Caching](/guide/caching).

Then run it:

```bash
npm install --save-dev kist @getkist/action-sass @getkist/action-terser
npx kist --dry-run   # check the plan before running anything
npx kist
```

Nothing is declared in `kist.yml` about the plugins. kist finds them in
`node_modules` by name and registers their actions.

## Conditionals and environments

`gulp-if` has no equivalent, because a `kist.yml` is data and cannot branch.
Where a gulpfile does this:

```js
.pipe(gulpif(isProduction, terser()))
```

kist expects two configurations sharing a base, which is
[config inheritance](/guide/configuration#config-inheritance):

```yaml
# kist.base.yml — everything common
stages:
    - name: Build
      steps:
          - name: Compile
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
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
                inputDir: ./dist/js
                outputDir: ./dist/js
```

```bash
kist                                   # development
kist --config kist.production.yml      # production
```

More configuration, and each one says exactly what it runs. If you have more
than two or three variants, that stops being a good trade — it is a fair reason
to stay on Gulp.

## Watch mode

`gulp.watch` becomes `options.live`, which also serves a directory over HTTP and
reloads the browser:

```yaml
options:
    live:
        enabled: true
        port: 3000
        root: dist
        watchPaths:
            - src/**
        ignoredPaths:
            - node_modules/**
```

```bash
kist --live
```

`--live` turns it on for one run without editing the file.

## The escape hatch

No wrapper should ever block the migration. `RunScriptAction` runs a Node
script, so anything you can call from Node is one step away:

```yaml
- name: GenerateSitemap
  action: RunScriptAction
  options:
      scriptPath: ./scripts/sitemap.js
      args: ["--out", "dist/sitemap.xml"]
```

Read [`RunScriptAction`](/guide/core-actions#runscriptaction) before you lean on
it — it invokes `node <scriptPath>` rather than a shell, so a shell one-liner
needs a small wrapper script, and the action treats anything the script writes
to stderr as a failure.

For a custom gulp stream transform, the same script is where its body goes: read
the files, transform, write them out. You lose the streaming, and you keep the
logic.

## Migrate incrementally

You do not have to move the whole gulpfile at once. kist can be one task in it:

```js
const { series } = require('gulp')
const { spawn } = require('child_process')

function kist(done) {
  spawn('npx', ['kist'], { stdio: 'inherit' }).on('close', (code) =>
    code === 0 ? done() : done(new Error(`kist exited ${code}`)),
  )
}

exports.build = series(kist, legacyTaskYouHaveNotMovedYet)
```

Move one task at a time, keep both green, and delete the gulpfile when it is
empty.

## Next steps

- [Configuration reference](/guide/configuration) — every field, in full
- [Core actions](/guide/core-actions) — what ships without a plugin
- [Plugin registry](/plugins/registry) — searchable, by action name
- [Caching](/guide/caching) — what `inputs`/`outputs` buy you
- [How kist compares](/guide/comparison) — including when not to switch
