# Getting Started

Get up and running with kist in minutes.

## What is kist?

**kist** is a lightweight Package Pipeline Processor with a Plugin Architecture, designed to streamline build processes for TypeScript and web projects. It provides a modular framework for managing build pipelines with support for live reload functionality.

## Prerequisites

- **Node.js** 20.0.0 or higher
- **npm** or **yarn**

## Quick Start

### 1. Install kist

```bash
# Global installation (recommended for CLI usage)
npm install -g kist

# Or as a project dependency
npm install --save-dev kist
```

### 2. Create a configuration file

Create a `kist.yml` file in your project root:

```yaml
name: my-project
version: 1.0.0

plugins:
  - @getkist/action-typescript

pipeline:
  build:
    stages:
      - name: compile
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json
```

### 3. Run kist

```bash
# Using global installation
kist --config kist.yml

# Or using npx
npx kist --config kist.yml
```

## Next Steps

- [Installation Guide](/guide/installation) - Detailed installation options
- [Configuration](/guide/configuration) - Full configuration reference
- [Pipeline Architecture](/guide/architecture) - Understanding the pipeline system
- [Available Plugins](/plugins/) - Browse official plugins

## Example Projects

Check out these example configurations:

### TypeScript + SCSS Project

```yaml
name: web-app
version: 1.0.0

plugins:
  - @getkist/action-sass
  - @getkist/action-typescript
  - @getkist/action-terser

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

      - name: scripts
        steps:
          - action: TypeScriptCompilerAction
            options:
              tsconfig: tsconfig.json

      - name: minify
        steps:
          - action: JavaScriptMinifyAction
            options:
              inputFile: dist/js/main.js
              outputFile: dist/js/main.min.js
```

### SVG Icon Library

```yaml
name: icon-library
version: 1.0.0

plugins:
  - @getkist/action-svg

pipeline:
  build:
    stages:
      - name: sprites
        steps:
          - action: SvgSpriteAction
            options:
              inputDir: src/icons
              outputDir: dist/sprites
              spriteFilename: icons.sprite.svg
```

## Getting Help

- 📖 [Configuration Guide](/guide/configuration)
- 🐛 [Report Issues](https://github.com/getkist/kist/issues)
- 💬 [GitHub Discussions](https://github.com/getkist/kist/discussions)
- 📦 [npm Package](https://npmjs.com/package/kist)
