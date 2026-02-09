# Plugins

Extend kist with official and community plugins.

## What are Plugins?

Plugins add new **actions** to kist. Actions are the building blocks of your pipeline - each action performs a specific task like compiling TypeScript, processing SCSS, or running tests.

## Installing Plugins

```bash
# Install one or more plugins
npm install --save-dev @getkist/action-sass @getkist/action-typescript

# Then declare them in kist.yml
```

```yaml
plugins:
  - @getkist/action-sass
  - @getkist/action-typescript
```

## Official Plugins

Official plugins are maintained by the kist team and follow strict quality standards.

### Style Plugins

| Plugin | Actions | Description |
|--------|---------|-------------|
| [@getkist/action-sass](/plugins/action-sass) | `StyleProcessingAction` | SCSS/Sass compilation with source maps |
| [@getkist/action-postcss](/plugins/action-postcss) | `PostCssAction` | PostCSS processing with autoprefixer, cssnano |

### Build Plugins

| Plugin | Actions | Description |
|--------|---------|-------------|
| [@getkist/action-typescript](/plugins/action-typescript) | `TypeScriptCompilerAction` | TypeScript compilation |
| [@getkist/action-terser](/plugins/action-terser) | `JavaScriptMinifyAction` | JavaScript minification |
| [@getkist/action-tsup](/plugins/action-tsup) | `BundleAction` | Bundle with tsup (esbuild) |

### Quality Plugins

| Plugin | Actions | Description |
|--------|---------|-------------|
| [@getkist/action-eslint](/plugins/action-eslint) | `LintAction` | ESLint code linting |
| [@getkist/action-prettier](/plugins/action-prettier) | `PrettierAction` | Prettier code formatting |
| [@getkist/action-jest](/plugins/action-jest) | `JestAction` | Jest test runner |

### Asset Plugins

| Plugin | Actions | Description |
|--------|---------|-------------|
| [@getkist/action-svg](/plugins/action-svg) | `SvgSpriteAction`, `SvgReaderAction`, `SvgPackagerAction`, `SvgToPngAction` | SVG processing and sprite generation |
| [@getkist/action-nunjucks](/plugins/action-nunjucks) | `TemplateRenderAction` | Nunjucks template rendering |

## Plugin Versions

| Plugin | Version | npm |
|--------|---------|-----|
| @getkist/action-sass | 1.0.5 | [![npm](https://img.shields.io/npm/v/@getkist/action-sass)](https://npmjs.com/package/@getkist/action-sass) |
| @getkist/action-postcss | 1.0.3 | [![npm](https://img.shields.io/npm/v/@getkist/action-postcss)](https://npmjs.com/package/@getkist/action-postcss) |
| @getkist/action-typescript | 0.0.9 | [![npm](https://img.shields.io/npm/v/@getkist/action-typescript)](https://npmjs.com/package/@getkist/action-typescript) |
| @getkist/action-eslint | 1.0.3 | [![npm](https://img.shields.io/npm/v/@getkist/action-eslint)](https://npmjs.com/package/@getkist/action-eslint) |
| @getkist/action-prettier | 1.0.7 | [![npm](https://img.shields.io/npm/v/@getkist/action-prettier)](https://npmjs.com/package/@getkist/action-prettier) |
| @getkist/action-jest | 1.0.5 | [![npm](https://img.shields.io/npm/v/@getkist/action-jest)](https://npmjs.com/package/@getkist/action-jest) |
| @getkist/action-terser | 1.0.3 | [![npm](https://img.shields.io/npm/v/@getkist/action-terser)](https://npmjs.com/package/@getkist/action-terser) |
| @getkist/action-tsup | 1.0.3 | [![npm](https://img.shields.io/npm/v/@getkist/action-tsup)](https://npmjs.com/package/@getkist/action-tsup) |
| @getkist/action-svg | 1.0.5 | [![npm](https://img.shields.io/npm/v/@getkist/action-svg)](https://npmjs.com/package/@getkist/action-svg) |
| @getkist/action-nunjucks | 2.0.10 | [![npm](https://img.shields.io/npm/v/@getkist/action-nunjucks)](https://npmjs.com/package/@getkist/action-nunjucks) |

## Community Plugins

Community plugins follow the naming convention `kist-plugin-*`.

::: tip Creating a Plugin?
Check out the [Plugin Development Guide](/guide/plugin-development) to create your own plugin.
:::

## Quick Start Examples

### SCSS Compilation

```bash
npm install --save-dev @getkist/action-sass
```

```yaml
plugins:
  - @getkist/action-sass

pipeline:
  build:
    stages:
      - name: styles
        steps:
          - action: StyleProcessingAction
            options:
              inputFile: src/styles/main.scss
              outputFile: dist/css/main.css
              style: compressed
              sourceMap: true
```

### TypeScript + Linting

```bash
npm install --save-dev @getkist/action-typescript @getkist/action-eslint
```

```yaml
plugins:
  - @getkist/action-typescript
  - @getkist/action-eslint

pipeline:
  build:
    stages:
      - name: lint
        steps:
          - action: LintAction
            options:
              files: ["src/**/*.ts"]
              
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

### SVG Sprites

```bash
npm install --save-dev @getkist/action-svg
```

```yaml
plugins:
  - @getkist/action-svg

pipeline:
  build:
    stages:
      - name: icons
        steps:
          - action: SvgSpriteAction
            options:
              inputDir: src/icons
              outputDir: dist/sprites
              spriteFilename: icons.sprite.svg
```

## Next Steps

- [Using Plugins](/plugins/using-plugins) - Detailed usage guide
- [Plugin Development](/guide/plugin-development) - Create your own plugin
- [Configuration](/guide/configuration) - Full configuration reference
