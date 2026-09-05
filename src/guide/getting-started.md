# Getting Started

Get up and running with kist in minutes.

## What is kist?

**kist** is a lightweight Package Pipeline Processor with a Plugin Architecture, designed to streamline build processes for TypeScript and web projects. It provides a modular framework for managing build pipelines, with automatic plugin discovery, fail-fast configuration validation, and built-in live reload.

## Prerequisites

- **Node.js** 22.0.0 or higher
- **npm** 9.0.0 or higher

## Quick Start

### 1. Install kist

```bash
# Global installation (recommended for CLI usage)
npm install -g kist

# Or as a project dependency
npm install --save-dev kist
```

### 2. Create a configuration file

Create a `kist.yml` (or `kist.yaml`) file in your project root:

```yaml
options:
    logLevel: info

stages:
    - name: Compile
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json
```

A configuration has up to four top-level keys: `extends`, `metadata`, `options`, and `stages`. Every step names a registered **action** — either one of kist's [core actions](/guide/core-actions) or an action provided by an [installed plugin](/plugins/).

### 3. Run kist

```bash
# Uses kist.yaml or kist.yml from the current directory
kist

# Or with an explicit config file
kist --config kist.yml

# Or via npx
npx kist
```

kist validates the configuration before running anything — a typo in an action name, a duplicate stage, or a dependency on an unknown stage fails immediately with a clear error. A failing step fails the build with exit code 1 (set `options.haltOnFailure: false` to continue past failures).

## Next Steps

- [Installation Guide](/guide/installation) - Detailed installation options
- [Configuration](/guide/configuration) - Full configuration reference
- [Pipeline Architecture](/guide/architecture) - Understanding the pipeline system
- [Available Plugins](/plugins/) - Browse official plugins

## Example Projects

Check out these example configurations:

### TypeScript + SCSS Project

Uses the [@getkist/action-sass](https://npmjs.com/package/@getkist/action-sass) and [@getkist/action-terser](https://npmjs.com/package/@getkist/action-terser) plugins — install them as dev dependencies and their actions are discovered automatically:

```bash
npm install --save-dev @getkist/action-sass @getkist/action-terser
```

```yaml
options:
    haltOnFailure: true

stages:
    - name: Styles
      steps:
          - name: CompileScss
            action: StyleProcessingAction
            options:
                inputFile: ./src/styles/main.scss
                outputFile: ./dist/css/main.css
                styleOption: compressed

    - name: Scripts
      steps:
          - name: CompileTypeScript
            action: TypeScriptCompilerAction
            options:
                tsconfigPath: ./tsconfig.json

    - name: Minify
      dependsOn:
          - Scripts
      steps:
          - name: MinifyBundle
            action: JavaScriptMinifyAction
            options:
                inputPath: ./dist/js/main.js
                outputPath: ./dist/js/main.min.js
```

### SVG Icon Library

Uses the [@getkist/action-svg](https://npmjs.com/package/@getkist/action-svg) plugin:

```yaml
stages:
    - name: Sprites
      steps:
          - name: BuildSprite
            action: SvgSpriteAction
            options:
                sourceDir: ./src/icons
                outputDir: ./dist/sprites
```

### Live Reload during Development

```bash
kist --live
```

Serves `options.live.root` (default `public/`) on port 3000, watches your source files, and re-runs the pipeline on changes.

## Getting Help

- 📖 [Configuration Guide](/guide/configuration)
- 🐛 [Report Issues](https://github.com/getkist/kist/issues)
- 💬 [GitHub Discussions](https://github.com/getkist/kist/discussions)
- 📦 [npm Package](https://npmjs.com/package/kist)
