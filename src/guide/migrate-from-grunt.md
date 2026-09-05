---
title: Migrate from Grunt
description: Translate a Gruntfile into a kist pipeline — the mapping is closer than you would expect.
---

# Migrate from Grunt

Of the tools people migrate from, Grunt is the closest fit. Both describe a
build as configuration rather than as a stream program: a Gruntfile is a big
object of task configs, and a `kist.yml` is a list of stages holding steps. The
translation is mostly a change of syntax.

## Should you?

Grunt is stable and still maintained, and a Gruntfile that works is not an
emergency. The reasons to move are concrete ones:

- **The plugin ecosystem has aged.** Many `grunt-contrib-*` packages have not
  had a release in years and wrap versions of tools you are no longer running.
- **Nothing is skipped.** `grunt-newer` exists, but caching is opt-in per task
  and based on timestamps. kist hashes declared inputs.
- **The config is unvalidated.** A typo in a task's options is discovered at
  run time. kist's [JSON Schema](https://www.getkist.com/schema.json) means
  your editor flags it as you type.

If none of those bite, staying is a defensible answer.

## The mapping

| Grunt | kist |
| --- | --- |
| `Gruntfile.js` | `kist.yml` |
| `grunt.initConfig({ … })` | the whole file |
| a task config key (`uglify: {}`) | a step's `action` |
| a target under a task (`uglify.dist`) | a separate step, with its own `name` |
| `grunt.registerTask('build', [...])` | a stage, listing steps in order |
| `grunt.loadNpmTasks(...)` | nothing — plugins are found in `node_modules` |
| `src` / `dest` | the action's own input/output options |
| `files: { 'out': ['in'] }` | one step per output |
| `options: {}` | `options:` — the same idea, same place |
| `grunt.registerTask('default', [...])` | the order of `stages` |
| `grunt-contrib-clean` | `DirectoryCleanAction` |
| `grunt-contrib-copy` | `FileCopyAction`, `DirectoryCopyAction` |
| `grunt-contrib-sass` / `grunt-sass` | [`@getkist/action-sass`](/plugins/action-sass) |
| `grunt-postcss` | [`@getkist/action-postcss`](/plugins/action-postcss) |
| `grunt-contrib-uglify` | [`@getkist/action-terser`](/plugins/action-terser) |
| `grunt-ts` | [`@getkist/action-typescript`](/plugins/action-typescript) |
| `grunt-eslint` | [`@getkist/action-eslint`](/plugins/action-eslint) |
| `grunt-contrib-jshint` | [`@getkist/action-eslint`](/plugins/action-eslint) |
| `grunt-contrib-watch` | `options.live` |
| `grunt-webfont` | [`@getkist/action-fantasticon`](/plugins/action-fantasticon) |
| `grunt-svgstore` | [`@getkist/action-svg`](/plugins/action-svg) |
| `grunt-newer` | `inputs` / `outputs` on a step |
| anything else | `RunScriptAction` |

Two differences are worth calling out before the example.

**Grunt multi-tasks become separate steps.** A task with three targets is three
steps in kist, each named. More lines, and each one shows up by name in the log
and can be cached independently.

**`grunt.loadNpmTasks` has no equivalent, and that is deliberate.** Installing
`@getkist/action-sass` is the whole registration step; kist scans
`node_modules` for `@getkist/action-*`, `kist-action-*`, and `kist-plugin-*` on
startup. There is no list to keep in sync with `package.json`.

## A worked example

```js
module.exports = function (grunt) {
  grunt.initConfig({
    clean: {
      dist: ['dist'],
    },
    sass: {
      options: { style: 'compressed' },
      dist: { files: { 'dist/css/main.css': 'src/scss/main.scss' } },
    },
    uglify: {
      dist: { files: { 'dist/js/app.min.js': ['src/js/app.js'] } },
    },
    eslint: {
      target: ['src/js/**/*.js'],
    },
    copy: {
      assets: {
        expand: true,
        cwd: 'src/images',
        src: '**',
        dest: 'dist/images',
      },
    },
    watch: {
      all: { files: ['src/**'], tasks: ['build'] },
    },
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-sass')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('build', ['clean', 'eslint', 'sass', 'uglify', 'copy'])
  grunt.registerTask('default', ['build'])
}
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

    - name: Lint
      dependsOn: [Clean]
      steps:
          - name: LintScripts
            action: LintAction
            inputs:
                - "src/js/**/*.js"
            options:
                targetFiles:
                    - "src/js/**/*.js"

    # `registerTask('build', [...])` ran these one after another because it had
    # no way to say they were independent. They are, so they run together.
    - name: Build
      dependsOn: [Lint]
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
                - "src/js/app.js"
            outputs:
                - "dist/js/app.min.js"
            options:
                inputPath: ./src/js/app.js
                outputPath: ./dist/js/app.min.js

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

```bash
npm install --save-dev kist \
  @getkist/action-sass @getkist/action-terser @getkist/action-eslint
npx kist --dry-run
npx kist
```

## What `grunt-newer` was doing, and what replaces it

`grunt-newer` compared file modification times and re-ran a task only for the
files that looked newer. kist's [caching](/guide/caching) is the same idea with
two changes:

- It hashes content rather than reading timestamps, so touching a file without
  editing it does not invalidate anything, and a checkout that resets mtimes
  does not invalidate everything.
- It is declared per step, as `inputs` and `outputs`, rather than by wrapping
  the task name.

```yaml
- name: Styles
  action: StyleProcessingAction
  inputs:
      - "src/scss/**/*.scss"
  outputs:
      - "dist/css/**"
  options:
      inputFile: ./src/scss/main.scss
      outputFile: ./dist/css/main.css
```

A step with no `inputs` runs every time. kist will not guess what a step reads,
because guessing wrong means silently skipping work that should have happened.

## Watch

`grunt-contrib-watch` becomes `options.live`, which also serves the output
directory and reloads the browser:

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

## Templates and `<%= %>`

Grunt config supports template expansion against the config object itself:

```js
grunt.initConfig({
  pkg: grunt.file.readJSON('package.json'),
  uglify: {
    options: { banner: '/*! <%= pkg.name %> */\n' },
  },
})
```

kist's YAML has no expression language. Where a value has to come from
`package.json`, the options are:

- **`PackageManagerAction`**, which reads a `package.json` and writes a filtered
  or extended copy — the common case of shipping a trimmed manifest.
- **`VersionWriteAction`**, which replaces version strings in named files.
- **A Node script via `RunScriptAction`**, for anything else. It can read
  `package.json` and write whatever it needs to.

This is a real reduction in expressiveness. It is the same trade as
[conditionals](/guide/migrate-from-gulp#conditionals-and-environments): the file
stays inspectable and schema-checkable because it is data, and data does not
compute.

## Migrate incrementally

kist runs fine as one Grunt task while you move the rest across:

```js
grunt.registerTask('kist', function () {
  const done = this.async()
  require('child_process')
    .spawn('npx', ['kist'], { stdio: 'inherit' })
    .on('close', (code) => done(code === 0))
})

grunt.registerTask('build', ['kist', 'taskYouHaveNotMovedYet'])
```

Move a task at a time, keep the build green throughout, and delete the
Gruntfile when nothing is left in it.

## Next steps

- [Configuration reference](/guide/configuration) — every field, in full
- [Core actions](/guide/core-actions) — what ships without a plugin
- [Plugin registry](/plugins/registry) — searchable, by action name
- [Caching](/guide/caching) — what replaces `grunt-newer`
- [How kist compares](/guide/comparison) — including when not to switch
