# Plugins

Extend kist with official and community plugins. For a searchable list —
by package, by action name, or by keyword — see the
[plugin registry](/plugins/registry).

## What are Plugins?

Plugins add new **actions** to kist. Actions are the building blocks of your pipeline - each action performs a specific task like compiling TypeScript, processing SCSS, or running tests.

## Installing Plugins

```bash
# Install one or more plugins
npm install --save-dev @getkist/action-sass @getkist/action-typescript
```

That is all. Plugins are **discovered automatically**: on startup, kist scans your project's `node_modules` for packages named `@getkist/action-*`, `kist-action-*`, or `kist-plugin-*` and registers their actions. They are never declared in `kist.yml` - once installed, their actions can be referenced by name in your steps.

## Official Plugins

Official plugins are maintained by the kist team and follow strict quality standards.

### Style Plugins

| Plugin | Actions | Description |
| --- | --- | --- |
| [@getkist/action-sass](/plugins/action-sass) | `StyleProcessingAction` | SCSS/Sass compilation with PostCSS processing |
| [@getkist/action-postcss](/plugins/action-postcss) | `PostCssAction` | PostCSS processing with autoprefixer, cssnano |

### Build Plugins

| Plugin | Actions | Description |
| --- | --- | --- |
| [@getkist/action-typescript](/plugins/action-typescript) | `TypeScriptCompilerAction` | TypeScript compilation |
| [@getkist/action-terser](/plugins/action-terser) | `JavaScriptMinifyAction` | JavaScript minification |
| [@getkist/action-tsup](/plugins/action-tsup) | `BundleAction` | Bundle with tsup (esbuild) |
| [@getkist/action-tsdown](/plugins/action-tsdown) | `TsdownAction` | Bundle with tsdown (Rolldown) |

### Quality Plugins

| Plugin | Actions | Description |
| --- | --- | --- |
| [@getkist/action-eslint](/plugins/action-eslint) | `LintAction` | ESLint code linting |
| [@getkist/action-prettier](/plugins/action-prettier) | `PrettierAction` | Prettier code formatting |
| [@getkist/action-jest](/plugins/action-jest) | `JestAction` | Jest test runner |

### Asset Plugins

| Plugin | Actions | Description |
| --- | --- | --- |
| [@getkist/action-svg](/plugins/action-svg) | `SvgSpriteAction`, `SvgReaderAction`, `SvgPackagerAction`, `SvgToPngAction` | SVG processing and sprite generation |
| [@getkist/action-nunjucks](/plugins/action-nunjucks) | `TemplateRenderAction` | Nunjucks template rendering |
| [@getkist/action-example](/guide/plugin-development) | `ExampleAction` | Reference plugin to copy when writing your own |
| [@getkist/action-fantasticon](/plugins/action-fantasticon) | `FantasticonAction` | Icon font generation from SVGs |

## Plugin Versions

| Plugin | npm |
| --- | --- |
| @getkist/action-sass | [![npm](https://img.shields.io/npm/v/@getkist/action-sass)](https://npmjs.com/package/@getkist/action-sass) |
| @getkist/action-postcss | [![npm](https://img.shields.io/npm/v/@getkist/action-postcss)](https://npmjs.com/package/@getkist/action-postcss) |
| @getkist/action-typescript | [![npm](https://img.shields.io/npm/v/@getkist/action-typescript)](https://npmjs.com/package/@getkist/action-typescript) |
| @getkist/action-eslint | [![npm](https://img.shields.io/npm/v/@getkist/action-eslint)](https://npmjs.com/package/@getkist/action-eslint) |
| @getkist/action-prettier | [![npm](https://img.shields.io/npm/v/@getkist/action-prettier)](https://npmjs.com/package/@getkist/action-prettier) |
| @getkist/action-jest | [![npm](https://img.shields.io/npm/v/@getkist/action-jest)](https://npmjs.com/package/@getkist/action-jest) |
| @getkist/action-terser | [![npm](https://img.shields.io/npm/v/@getkist/action-terser)](https://npmjs.com/package/@getkist/action-terser) |
| @getkist/action-tsup | [![npm](https://img.shields.io/npm/v/@getkist/action-tsup)](https://npmjs.com/package/@getkist/action-tsup) |
| @getkist/action-svg | [![npm](https://img.shields.io/npm/v/@getkist/action-svg)](https://npmjs.com/package/@getkist/action-svg) |
| @getkist/action-nunjucks | [![npm](https://img.shields.io/npm/v/@getkist/action-nunjucks)](https://npmjs.com/package/@getkist/action-nunjucks) |
| @getkist/action-tsdown | [![npm](https://img.shields.io/npm/v/@getkist/action-tsdown)](https://npmjs.com/package/@getkist/action-tsdown) |
| @getkist/action-fantasticon | [![npm](https://img.shields.io/npm/v/@getkist/action-fantasticon)](https://npmjs.com/package/@getkist/action-fantasticon) |
| @getkist/action-example | [![npm](https://img.shields.io/npm/v/@getkist/action-example)](https://npmjs.com/package/@getkist/action-example) |

## Community Plugins

Community plugins follow the naming conventions `kist-action-*` or `kist-plugin-*`, which kist's discovery also picks up automatically.

::: tip Creating a Plugin?
Check out the [Plugin Development Guide](/guide/plugin-development) to create your own plugin.
:::

## Quick Start Examples

### SCSS Compilation

```bash
npm install --save-dev @getkist/action-sass
```

```yaml
stages:
    - name: Styles
      steps:
          - name: MainStyles
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed
                sourceMap: true
```

### TypeScript + Linting

```bash
npm install --save-dev @getkist/action-typescript @getkist/action-eslint
```

```yaml
stages:
    - name: Lint
      steps:
          - name: LintSources
            action: LintAction
            options:
                targetFiles:
                    - "src/**/*.ts"

    - name: Compile
      dependsOn: [Lint]
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

### SVG Sprites

```bash
npm install --save-dev @getkist/action-svg
```

```yaml
stages:
    - name: Icons
      steps:
          - name: BuildSprite
            action: SvgSpriteAction
            options:
                sourceDir: ./src/icons
                outputDir: ./dist/sprites
```

## Next Steps

- [Using Plugins](/plugins/using-plugins) - Detailed usage guide
- [Plugin Development](/guide/plugin-development) - Create your own plugin
- [Configuration](/guide/configuration) - Full configuration reference
